import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class FileUtils {
  static readJSON(relativePath) {
    const fullPath = path.join(__dirname, relativePath);
    const data = fs.readFileSync(fullPath, "utf8");
    return JSON.parse(data);
  }
}

export default FileUtils;
