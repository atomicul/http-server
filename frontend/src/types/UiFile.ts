import { v4 } from "uuid";

export type Status = "ready" | "uploading" | "done" | "error";

class UiFile {
  readonly file: File;
  status: Status;
  name: string;
  readonly id: string

  get uploadable() { return this.status === "ready" || this.status === "error" }

  private constructor(file: File, status: Status, name: string, id: string) {
    this.file = file;
    this.status = status;
    this.name = name;
    this.id = id;
  }

  clone() {
    return new UiFile(this.file, this.status, this.name, this.id);
  }

  static fromFile(f: File) {
    return new UiFile(f, "ready", f.name, v4().toString())
  }
}

export default UiFile
