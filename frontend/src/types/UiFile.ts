import { v4 } from "uuid";

export type Status = "ready" | "uploading" | "done" | "error";

class UiFile {
  status: Status;
  readonly file: File;
  name: string;
  readonly id: string

  get uploadable() { return this.status === "ready" || this.status === "error" }

  constructor(f: File) {
    this.file = f;
    this.name = f.name;
    this.id = v4().toString();
    this.status = "ready";
  }
}

export default UiFile
