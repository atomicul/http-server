import { useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaRegCircle } from "react-icons/fa";
import { FaRegCheckCircle } from "react-icons/fa";
import { FaRegTimesCircle } from "react-icons/fa";
import { CgSpinnerTwo } from "react-icons/cg";


import FileAdder, { RefType as FileAdderRef } from "./FileAdder";
import humanFileSize from "./utils/humanReadableFileSize";
import UiFile, { Status } from "./types/UiFile";

const statusIconMap: Map<Status, any> = new Map([
  ["ready", <FaRegCircle />],
  ["uploading", <CgSpinnerTwo className="animate-spin" />],
  ["done", <FaRegCheckCircle />],
  ["error", <FaRegTimesCircle />],
]);

function App() {
  const fileAdderRef = useRef<null | FileAdderRef>(null);
  const [files, setFiles] = useState<UiFile[]>([]);

  const setStatus = (file: UiFile, status: Status) => {
    setFiles((files) => {
      const filesCopy = structuredClone(files);

      const fileToModify = filesCopy.find(f => f.id === file.id)
      if (fileToModify)
        fileToModify.status = status;

      return filesCopy;
    });
  }

  const handleAddFiles = (f: File[]) => {
    setFiles([...files, ...f.map((f) => new UiFile(f))]);
  }

  const handleRemoveFiles = (file: UiFile) => { setFiles(fs => fs.filter(f => f.id !== file.id)) }

  const handleUploadFile = async (file: UiFile) => {
    if (!file.uploadable)
      return;

    const url = "http://localhost:3001";

    setStatus(file, "ready");

    try {
      const res = await fetch(url + "/" + file.name, {
        method: "POST",
        body: file.file
      })

      if (res.ok) {
        setStatus(file, "done");
      } else {
        setStatus(file, "error");
      }
    } catch {
      setStatus(file, "error");
    }
  }

  return <main className="h-svh p-8 space-y-8 relative overflow-hidden flex flex-col">
    <h1 className="text-xl">File uploader</h1>

    <section className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
      <table className="table table-sm">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Filetype</th>
            <th>Size</th>
            <th>Status</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, idx) => (
            <tr key={file.id}>
              <th>{idx + 1}</th>
              <td className="max-w-16 truncate">{file.name}</td>
              <td>{file.file.type || "other"}</td>
              <td>{humanFileSize(file.file.size)}</td>
              <td>{<button onClick={() => handleUploadFile(file)} className="text-xl text-center relative left-1">{statusIconMap.get(file.status)}</button>}</td>
              <td className="relative left-1">
                <button onClick={() => handleRemoveFiles(file)} className="btn btn-xs btn-error btn-link uppercase text-xl">
                  <MdDelete />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>

    <button
      onClick={() => { fileAdderRef.current?.getFiles().then(files => { handleAddFiles(files) }) }}
      className="btn btn-circle absolute right-4 bottom-4">

      <FaPlus />
    </button>

    <FileAdder ref={fileAdderRef} />
  </main>
}

export default App
