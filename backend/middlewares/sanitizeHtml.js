const sanitizeHtml = require("sanitize-html");


const removeDangerousChars = (s) => {
  if (typeof s !== "string") return s;
  // remove backtick, single and double quotes
  return s.replace(/[`"'’]/g, "");
};

const stripAnyTags = (s) => {
  if (typeof s !== "string") return s;
  // first use sanitize-html to remove recognized tags
  let v = sanitizeHtml(s, { allowedTags: [], allowedAttributes: {} });
  // then remove any leftover <...> patterns (including unknown tags)
  v = v.replace(/<[^>]*>/g, "");
  // normalize whitespace
  return v.replace(/\s+/g, " ").trim();
};

const sanitizeValue = (val) => {
  if (val === null || val === undefined) return val;

  // If it's a JSON-string (addresses etc.), try to parse then sanitize recursively
  if (typeof val === "string") {
    // quick heuristic: starts with { or [ => JSON
    const trimmed = val.trim();
    if ((trimmed.startsWith("{") && trimmed.endsWith("}")) ||
        (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
      try {
        const parsed = JSON.parse(trimmed);
        sanitizeObject(parsed);
        return JSON.stringify(parsed);
      } catch (e) {
        // not valid JSON — continue to sanitize as plain string
      }
    }

    // normal string: remove quotes/backticks then strip tags
    return stripAnyTags(removeDangerousChars(val));
  }

  // If object/array, sanitize recursively
  if (typeof val === "object") {
    sanitizeObject(val);
    return val;
  }

  // numbers, booleans stay
  return val;
};

function sanitizeObject(obj) {
  if (!obj || typeof obj !== "object") return;
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (typeof value === "string" || typeof value === "object") {
      obj[key] = sanitizeValue(value);
    } else {
      // leave primitives (number/boolean) intact
      obj[key] = value;
    }
  }
}

const sanitizeInput = (req, res, next) => {
  // sanitize body, query, params — but make sure multer ran first for multipart
  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);

  // sanitize file.originalname to avoid dangerous chars in filenames
  if (req.file && req.file.originalname) {
    req.file.originalname = removeDangerousChars(req.file.originalname).replace(/<[^>]*>/g, "");
  }
  next();
};

module.exports = { sanitizeInput };



// const sanitizeObject = (obj) => {
//   for (const key in obj) {
//     if (typeof obj[key] === "string") {
//       let value = obj[key];

//       // Step 1: Remove backticks, quotes, and apostrophes
//       value = value.replace(/[`"'']/g, "");

//       // Step 2: Use sanitize-html to strip any HTML or script tags
//       value = sanitizeHtml(value, {
//         allowedTags: [],        // no tags allowed
//         allowedAttributes: {},  // no attributes allowed
//       });

//       // Step 3: Extra safety — remove anything inside <...>
//       value = value.replace(/<[^>]*>/g, "");

//       // Step 4: Remove leftover characters that look like code
//       value = value.replace(/[<>]/g, "");

//       // Step 5: Normalize spaces and trim
//       value = value.replace(/\s+/g, " ").trim();

//       obj[key] = value;
//     } else if (typeof obj[key] === "object" && obj[key] !== null) {
//       sanitizeObject(obj[key]);
//     }
//   }
// };

// const sanitizeInput = (req, res, next) => {
//   if (req.body) sanitizeObject(req.body);
//   if (req.query) sanitizeObject(req.query);
//   if (req.params) sanitizeObject(req.params);
//   next();
// };

// module.exports = { sanitizeInput };

