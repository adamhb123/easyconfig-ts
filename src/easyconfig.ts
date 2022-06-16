// External modules
import { join } from "path";
import fs from "fs";
import Dotenv from "dotenv";
import { InvalidArgumentError } from "./errorhandler";

/**
 * Alternative method of prioritizing dot file loading.
 *
 * Where as a list of strings will be prioritized in sequence as given,
 * A list of objects conforming to the PrioritizedDotFile interface will
 * be prioritized as defined by their priority property.
 *
 * @param path: string - the dot file path,
 * @param priority: number - the priority of the dot file, assessed in
 * ascending (least to greatest) order
 */
export interface PrioritizedDotFile {
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

/**
 * @param rootPath - The root path to search for dot files from.
 * @param terminal - Whether to throw
 * @param quiet - Whether to log to console or not
 * @param dotFiles - rest parameter consisting they are provided in
 * order of priority. If a PrioritizedDotFile[] is provided, then the
 * dot files will be assessed based on their given priority.
 *
 * @returns void
 */
export const EasyConfig = (
  rootPath: string,
  terminal: boolean,
  quiet: boolean,
  ...dotFiles: string[] | PrioritizedDotFile[]
) => {
  let chosenPath: string | undefined;
  const asString =
    typeof dotFiles[0] === "string"
      ? <string[]>dotFiles
      : typeof dotFiles[0] !== "string" &&
        Object.prototype.hasOwnProperty.call(dotFiles[0], "priority")
      ? (<PrioritizedDotFile[]>dotFiles)
          // Sort by priority (descending)
          .sort((a, b) => (a.priority < b.priority ? 1 : -1))
          // Retrieve path from <PrioritizedDotFile>dotFile
          .map((dotFile) => dotFile.path)
      : null;
  if (!asString)
    throw new InvalidArgumentError(
      `Invalid values provided to rest parameter: ...dotFiles=${dotFiles}`
    );
  const dotFilePaths = asString.map((dotFilePath) =>
    join(rootPath, dotFilePath)
  ); // Map to proper paths
  for (const dotFilePath of dotFilePaths) {
    if (fs.existsSync(dotFilePath)) {
      chosenPath = dotFilePath;
      break;
    }
  }
  if (!chosenPath) {
    const errstr = `No .env or .env.local configurations found in root\
     directory (${rootPath}) with paths: ${dotFilePaths} parsed from\
     rest parameter: dotFiles=${dotFiles}`;
    if (terminal) {
      log(errstr, LogType.Error, quiet);
      throw new InvalidArgumentError(errstr);
    }
    log(
      `${errstr}\nNot set to terminate on failure (arg: terminal=${terminal})`,
      LogType.Warn,
      quiet
    );
  } // Initialize dotenv with chosenPath
  else Dotenv.config({ path: chosenPath });
};

export default EasyConfig;
