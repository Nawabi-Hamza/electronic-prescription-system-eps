// build.js
import { build } from "esbuild";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables from example.env instead of .env
const envFile = path.resolve("example.env");
const envConfig = dotenv.parse(fs.readFileSync(envFile));

// Convert into esbuild define format
const define = {};
for (const k in envConfig) {
  define[`process.env.${k}`] = JSON.stringify(envConfig[k]);
}

// Function to copy folder recursively
function copyFolderSync(src, dest) {
  if (!fs.existsSync(src)) return;

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  fs.readdirSync(src).forEach((file) => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);

    if (fs.lstatSync(srcPath).isDirectory()) {
      copyFolderSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

async function runBuild() {
  try {
    await build({
      entryPoints: ["cluster.js"],
      bundle: true,
      minify: true,
      platform: "node",
      target: ["node24"], // Node.js 24
      outfile: "dist/server.js",
      define, // inject env vars at build time
    });

    // Copy uploads folder
    copyFolderSync("uploads", "dist/uploads");

    console.log("✅ Build finished using example.env for environment variables");
  } catch (err) {
    console.error("❌ Build failed:", err);
    process.exit(1);
  }
}

runBuild();
