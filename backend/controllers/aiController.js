// controllers/hrAIController.js
const db = require("../config/db");
const { Groq } = require("groq-sdk");
require("dotenv").config();

const MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Cache (simple in-memory)
const queryCache = new Map();
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

// Allowed schema (whitelist)
const ALLOWED_TABLES = {
  students: new Set(["student_id", "firstname", "email", "phone", "join_date"]),
  users: new Set(["user_id", "firstname", "lastname", "email", "phone", "role_id", "status"]),
  roles: new Set(["role_id", "role_name"]),
};

// Forbidden SQL keywords (case-insensitive)
const FORBIDDEN = ["update", "delete", "insert", "drop", "alter", "truncate", "create"];

// ---------- Prompts ----------
const sqlGeneratorPrompt = `
You are a School MIS SQL generator.
Return ONLY a clean MySQL SELECT query. No text, no notes, no explanations.

Allowed tables & columns:
- students (student_id, firstname, email, phone, join_date)
- users (user_id, firstname, lastname, email, phone, role_id, status)
- roles (role_id, role_name)

Rules:
- Output ONE valid SELECT query.
- DO NOT generate: UPDATE, DELETE, INSERT, DROP, ALTER, TRUNCATE, CREATE.
- If request is impossible (e.g., asks to modify data or reference a non-existing column) → return:
  SELECT 'Invalid request' AS error;
- If specific columns are mentioned → return only those.
- Use aliases where relevant.
- No comments, no semicolons, no markdown.
`;

const formatterPrompt = `
You are a response formatter.

Input: a JSON array of SQL result rows.

Rules:
1. If the array contains rows:
   - Detect all columns in each row.
   - If there is only one column → format as a bullet list.
   - If there are two or more columns → format as a clean table-like text block.
     Example:
     Column1 | Column2 | Column3
     value1  | value2  | value3
2. If the array is empty: output exactly "No data found."
3. If the array contains an object with an "error" key: output only that error message.
4. Never output SQL.
5. Never change, rename, or reorder values.
6. Output must be plain text, no markdown styling.
7. Reply must not be empty.

`;

// ---------- Helpers ----------
function stripCommentsAndTrim(s) {
  // remove SQL comments (/* ... */ and -- ... ) simply
  return s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/--.*$/gm, "").trim();
}

function containsForbidden(sqlLower) {
  return FORBIDDEN.some((kw) => sqlLower.includes(` ${kw} `) || sqlLower.startsWith(`${kw} `));
}

function extractTableNames(sql) {
  // naive extraction of table names from FROM and JOIN clauses
  const regex = /\bfrom\b\s+([^\s,;]+)|\bjoin\b\s+([^\s,;]+)/ig;
  const tables = new Set();
  let m;
  while ((m = regex.exec(sql)) !== null) {
    const tableToken = m[1] || m[2];
    if (!tableToken) continue;
    // remove backticks/aliases if present
    const cleaned = tableToken.replace(/[`"'()]/g, "").split(/\s+/)[0].split(".").pop();
    tables.add(cleaned.toLowerCase());
  }
  return Array.from(tables);
}

function extractSelectedColumns(sql) {
  // naive: capture between SELECT and FROM
  const m = sql.match(/select\s+([\s\S]+?)\s+from\b/i);
  if (!m) return null;
  const raw = m[1].trim();
  // split by commas not inside parentheses
  const cols = raw.split(/,(?![^(]*\))/).map(c => c.trim());
  return cols;
}

function isSafeSQL(sql) {
  const cleaned = stripCommentsAndTrim(sql);
  if (!cleaned) return { ok: false, reason: "Empty SQL" };

  // no semicolons allowed (single statement)
  if (/[;]+/.test(cleaned)) return { ok: false, reason: "Multiple statements or semicolon detected" };

  const lower = cleaned.toLowerCase();

  if (!lower.startsWith("select")) return { ok: false, reason: "Not a SELECT statement" };

  if (containsForbidden(lower)) return { ok: false, reason: "Forbidden SQL keyword detected" };

  // validate table names
  const tables = extractTableNames(cleaned);
  if (tables.length === 0) return { ok: false, reason: "No table found in FROM/JOIN" };

  for (const t of tables) {
    if (!Object.prototype.hasOwnProperty.call(ALLOWED_TABLES, t)) {
      return { ok: false, reason: `Table "${t}" is not allowed` };
    }
  }

  // validate selected columns if explicit (not *)
  const cols = extractSelectedColumns(cleaned);
  if (cols) {
    // if the only selected column is '*' or table.* allow
    if (!(cols.length === 1 && /^\*|(\w+\.\*)$/.test(cols[0]))) {
      for (const col of cols) {
        // remove functions and aliases, e.g., COUNT(users.user_id) AS total
        const colClean = col.replace(/\s+as\s+.*$/i, "").replace(/\(.*\)/, "").trim();
        // allow expressions like COUNT(*) etc — basic check: if contains non-identifier characters, skip detailed validation
        if (/[^a-zA-Z0-9_.]/.test(colClean)) {
          // allow numeric expressions, functions; assume safe if no forbidden keywords
          continue;
        }
        // colClean may be table.col or col
        const parts = colClean.split(".");
        const colName = parts.pop().toLowerCase();
        const tableHint = parts.length ? parts[0].toLowerCase() : null;
        if (tableHint) {
          if (!Object.prototype.hasOwnProperty.call(ALLOWED_TABLES, tableHint)) {
            return { ok: false, reason: `Referenced table "${tableHint}" in columns is not allowed` };
          }
          if (!ALLOWED_TABLES[tableHint].has(colName) && colName !== "*") {
            return { ok: false, reason: `Column "${colName}" is not allowed on table "${tableHint}"` };
          }
        } else {
          // no table qualifier: ensure that the column exists in at least one allowed table OR it's an alias/expression
          const exists = Object.keys(ALLOWED_TABLES).some(t => ALLOWED_TABLES[t].has(colName));
          if (!exists && colName !== "*") {
            // might be an alias or expression — allow but be cautious
            // to be conservative, reject unknown simple identifiers
            return { ok: false, reason: `Column "${colName}" is not allowed` };
          }
        }
      }
    }
  }

  return { ok: true, cleaned };
}

// ---------- Controller ----------
const hrAIModel = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || !String(question).trim()) {
      return res.status(400).json({ error: "Question is required." });
    }
    const normalized = String(question).trim().toLowerCase();

    // return cache if valid
    if (queryCache.has(normalized)) {
      const cached = queryCache.get(normalized);
      if (Date.now() - cached.time < CACHE_TTL) {
        return res.json({ reply: cached.formatted, sql: cached.sql, raw_data: cached.rows, cached: true });
      } else {
        queryCache.delete(normalized);
      }
    }

    // --------- STEP 1: Generate SQL ----------
    const sqlAI = await client.chat.completions.create({
      model: MODEL,
      temperature: 0,
      messages: [
        { role: "system", content: sqlGeneratorPrompt },
        { role: "user", content: question }
      ],
    });

    let sql = String(sqlAI.choices?.[0]?.message?.content || "").trim();
    sql = sql.replace(/\n+/g, " ").trim();
    // remove trailing semicolon if any
    sql = sql.replace(/;$/, "");

    if (!sql) {
      return res.status(500).json({ error: "SQL generator returned empty response." });
    }

    // --------- STEP 2: Validate SQL ----------
    const validation = isSafeSQL(sql);
    if (!validation.ok) {
      return res.status(400).json({ error: "Unsafe SQL generated.", reason: validation.reason, sql });
    }
    sql = validation.cleaned;

    // --------- STEP 3: Execute SQL ----------
    // IMPORTANT: Using db.execute(sql) — keep only for SELECT. Make sure db is a mysql2 pool/connection.
    const [rows] = await db.execute(sql);

    // --------- STEP 4: Format output using AI (retry if empty)
// --------- STEP 4: Format output using AI (retry; guaranteed fallback) ----------
const formatterInput = [
  { role: "system", content: formatterPrompt },
  {
    role: "user",
    content:
      `User question:\n${question}\n\nSQL result JSON:\n${JSON.stringify(rows, null, 2)}`
  }
];

let formatted = "";

// 1) Try AI formatter (2 attempts)
try {
  for (let attempt = 0; attempt < 2; attempt++) {
    const fmtAI = await client.chat.completions.create({
      model: MODEL,
      temperature: 0.2,
      messages: formatterInput,
    });

    formatted = String(fmtAI.choices?.[0]?.message?.content || "").trim();
    console.log(`[hrAIModel] formatter attempt ${attempt+1} returned length=${formatted.length}`);
    if (formatted) break;
  }
} catch (fmtErr) {
  console.error("[hrAIModel] formatter AI error:", fmtErr);
  formatted = "";
}

// 2) Defensive fallback (guarantee non-empty output)
if (!formatted) {
  console.log("[hrAIModel] Formatter returned empty - using fallback formatter");
  if (!rows || rows.length === 0) {
    formatted = "No data found.";
  } else {
    const columns = Object.keys(rows[0] || {});
    // normalize columns (string)
    if (columns.length === 0) {
      // rows exist but no keys (unlikely) — present JSON
      formatted = `${rows.length} record(s) found:\n` + rows.map((r, i) => `${i+1}. ${JSON.stringify(r)}`).join("\n");
    } else if (columns.length === 1) {
      // single column -> bullet list
      const col = columns[0];
      formatted = rows.map(r => `* ${r[col]}`).join("\n");
    } else {
      // multi-column -> table-like plain text with column header and rows
      // compute max width per column for nicer alignment
      const widths = {};
      for (const c of columns) {
        widths[c] = Math.max(String(c).length, ...rows.map(r => String(r[c] ?? "").length));
      }
      // build header
      const header = columns.map(c => String(c).padEnd(widths[c])).join(" | ");
      // separator (optional)
      const separator = columns.map(c => "-".repeat(widths[c])).join("-|-");
      // rows
      const body = rows
        .map(row => columns.map(c => String(row[c] ?? "").padEnd(widths[c])).join(" | "))
        .join("\n");
      formatted = `${header}\n${separator}\n${body}`;
    }
  }
}

// log final formatted
console.log("[hrAIModel] final formatted length=", formatted.length);

// --------- continue: cache and respond ----------
queryCache.set(normalized, { sql, rows, formatted, time: Date.now() });

return res.json({
  reply: formatted,
  sql,
  raw_data: rows
});

  } catch (err) {
    console.error("hrAIModel error:", err);
    // map known errors to user-friendly messages
    if (err?.response) {
      return res.status(500).json({ error: "AI provider error", details: err.response?.data || err.message });
    }
    return res.status(500).json({ error: "Server error", details: err.message });
  }
};

module.exports = { hrAIModel };
