// External modules
import { join } from "path";
import fs from "fs";
import _Dotenv from "dotenv";
import { InvalidArgumentError } from "./errorhandler";

interface PrioritizedDotFile {
  path: string;
  priority: number;
}

enum LogType {
  Warn,
  Error,
}

function log(text: string, type?: LogType, quiet?: boolean) {
  if (!quiet) (type === LogType.Warn ? console.warn : console.error)(text);
}

export const Dotenv = (
  rootDotFilePath: string,
  terminal: boolean = false,
  quiet: boolean = false,
  ...dotFiles: string[] | PrioritizedDotFile[]
) => {
  /**
   * @param rootDotFile - The root path to search for dot files from.
   * @param dotFiles - Array of dotenv files to look for. If a String[] is provided, it is assumed
   * @param silence - Whether to log to console or not
   * that they are provided in order of priority. If a PrioritizedDotFile[] is provided, then the dot files
   * will be assessed based on their given priority.
   *
   * @returns void
   */
  let chosenPath: string | undefined;
  const asString = (typeof dotFiles === "string"
    ? dotFiles
    : typeof dotFiles !== "string" &&
      Object.prototype.hasOwnProperty.call(dotFiles, "priority")
    ? (<PrioritizedDotFile[]>dotFiles)
        .sort((a, b) => (a.priority < b.priority ? 1 : -1)) // Sort by priority (descending)
        .map((dotFile) => dotFile.path)
    : null
  )
  if(!asString) throw new InvalidArgumentError(("Invalid values provided to argument: ...dotFiles"));
  const dotFilePaths = asString.map((dotFilePath) => join(rootDotFilePath, dotFilePath)); // Map to proper paths
  for (const dotFilePath of dotFilePaths) {
    if (fs.existsSync(dotFilePath)) {
      chosenPath = dotFilePath;
      break;
    }
  }
  if (!chosenPath) {
    const errstr = `No .env or .env.local configurations found in root directory (${rootDotFilePath}) with given paths: ${dotFilePaths}`;
    if (terminal) {
      log(errstr, LogType.Error, quiet);
      throw new Error(errstr);
    }
    log(
      `${errstr}\nNot set to terminate (arg: terminal=${terminal})`,
      LogType.Warn,
      quiet
    );
  } else _Dotenv.config({ path: chosenPath }); // Initialize dotenv with chosenPath
};

export default Dotenv;
