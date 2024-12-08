export class ResultMessage {
  constructor(code, message, data = null) {
    this.code = code;
    this.message = message;
    this.data = data;
  }
}