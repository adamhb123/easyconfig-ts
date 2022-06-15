class ErrorBase extends Error {
  constructor(message?: string) {
    super(`[EasyConfig-TS] ${message ?? "No error message provided."}`);
    this.name = "ErrorBase";
  }
}

export class InvalidArgumentError extends ErrorBase {
  constructor(message?: string) {
    super(message);
    this.name = "InvalidArgumentError";
  }
}

export default {
  InvalidArgumentError,
};
