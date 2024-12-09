import { v4 } from "uuid";

export type Status = "ready" | "uploading" | "done";

class UiFile {
  status: "ready" | "uploading" | "done";
  readonly file: File;
  name: string;
  readonly id: string

  constructor(f: File) {
    this.file = f;
    this.name = f.name;
    this.id = v4().toString();
    this.status = "ready";
  }
}

export default UiFile
