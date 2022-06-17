import EasyConfig, { PrioritizedDotFile } from "../easyconfig";

/**
 * Logs a formatted string containing given text.
 * @param text - Text to log
 */
const log = (text: string) => console.log(`[EasyConfig-TS Tests] ${text}`);

/**
 * Logs a formatted string containing the optional text parameter with the value
 * of process.env.EASYCONFIG_TS_TESTING_PRIORITY(AKA the
 * EASYCONFIG_TS_TESTING_PRIORITY environment variable) concatenated.
 *
 * @param text - Text to prepend to log
 * @param verifyAgainst - String to verify environment variable against
 * @return Whether the priority env var is set correctly or not
 */
const logAndVerifyPriorityEnvVar = (
  text: string = "",
  verifyAgainst: string = "highest"
) => {
  const priorityEnvVar = process.env.EASYCONFIG_TS_TESTING_PRIORITY;
  log(
    `${text} (verifying against value: ${verifyAgainst}) ${
      priorityEnvVar
        ? `\n\tResult: ${verifyAgainst === priorityEnvVar}`
        : `Critical error! EASYCONFIG_TS_TESTING_PRIORITY not set! Ensure \
      your tests/*.env files exist and have not been altered.`
    }`
  );
  return priorityEnvVar === verifyAgainst;
};
/**
 * Deletets the EASYCONFIG_TS_TESTING_PRIORITY environment variable from
 * the environment (AKA process.env).
 */
const unsetPriorityEnvVar = () =>
  delete process.env.EASYCONFIG_TS_TESTING_PRIORITY;

/**
 * Tests ...dotFiles: PrioritizedDotFile[] functionality.
 *
 * Highest priority file should be assessed first, as it is given the
 * highest priority value.
 */
export const testPrioritizedDotFileFunctionality = () => {
  const prioritizedDotFileArray: PrioritizedDotFile[] = [
    {
      // lowest
      path: "./lowestpriority.env",
      priority: 0,
    },
    {
      // middle
      path: "./midpriority.env",
      priority: 1,
    },
    {
      path: "./highestpriority.env",
      priority: 2,
    }, // highest
  ];
  EasyConfig({
    rootPath: __dirname,
    dotFiles: prioritizedDotFileArray
  });
  const result = logAndVerifyPriorityEnvVar(
    "testPrioritizedDotFileFunctionality"
  );
  unsetPriorityEnvVar();
  return result;
};

/**
 * Tests ...dotFiles: string[] functionality.
 *
 * Highest priority file should be assessed first, as it the first string
 * provided in the ...dotFiles: string[].
 */
export const testStringArrayDotFileFunctionality = () => {
  EasyConfig({
    rootPath: __dirname,
    dotFiles: [ 
      "./highestpriority.env",
      "./midpriority.env",
      "./lowestpriority.env",
    ],
  });
  const result = logAndVerifyPriorityEnvVar(
    "testStringArrayDotFileFunctionality"
  );
  unsetPriorityEnvVar();
  return result;
};

export const runAllTests = () => {
  const results = {
    testPrioritizedDotFileFunctionality: testPrioritizedDotFileFunctionality(),
    testStringArrayDotFileFunctionality: testStringArrayDotFileFunctionality(),
  };
  const failures = Object.entries(results).filter((res) => res[1] === false);
  log(
    `${
      failures.length === 0
        ? "All tests passed!"
        : `${failures.length} test${
            failures.length > 1 ? "s" : ""
          } failed!\nFailed test${failures.length > 1 ? "s" : ""}:${failures}`
    }`
  );
};

export default {
  testPrioritizedDotFileFunctionality,
  testStringArrayDotFileFunctionality,
  runAllTests
}

if (require.main === module) runAllTests();
