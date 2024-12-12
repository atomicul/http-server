import { v4 } from "uuid";

export type Status = "ready" | "uploading" | "done" | "error";

class UiFile {
  readonly file: File;
  status: Status;
  readonly id: string
  private _progress: number

  get name() { return this.file.name }

  get uploadable() { return this.status === "ready" || this.status === "error" }

  get progress(): null | number { if (this.status != "uploading") return null; return this._progress }
  set progress(x: number) {
    x = Math.min(1, Math.max(0, x));
    this.status = "uploading";
    this._progress = x;
  }

  private constructor(file: File, status: Status, id: string) {
    this.file = file;
    this.status = status;
    this.id = id;
    this._progress = 0;
  }

  clone() {
    return new UiFile(this.file, this.status, this.id);
  }

  static fromFile(f: File) {
    return new UiFile(f, "ready", v4().toString())
  }
}

export default UiFile
