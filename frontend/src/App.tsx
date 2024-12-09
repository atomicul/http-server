import { useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import FileAdder, { RefType as FileAdderRef } from "./FileAdder";
import humanFileSize from "./utils/humanReadableFileSize";

function App() {
  const fileAdderRef = useRef<null | FileAdderRef>(null);
  const [files, setFiles] = useState<File[]>([]);


  const handleAddFiles = (f: File[]) => {
    setFiles([...files, ...f]);
  }

  return <main className="h-svh p-8 space-y-8 relative">
    <h1 className="text-xl">File uploader</h1>

    <table className="table table-sm">
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Filetype</th>
          <th>Size</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {files.map((file, idx) => (
          <tr key={file.name}>
            <th>{idx + 1}</th>
            <td>{file.name}</td>
            <td>{file.type}</td>
            <td>{humanFileSize(file.size)}</td>
            <td><button className="btn btn-xs btn-error btn-link uppercase text-xl"><MdDelete /></button></td>
          </tr>
        ))}
      </tbody>
    </table>

    <button
      onClick={() => { fileAdderRef.current?.getFiles().then(files => { handleAddFiles(files) }) }}
      className="btn btn-circle absolute right-4 bottom-4">

      <FaPlus />
    </button>

    <FileAdder ref={fileAdderRef} />
  </main>
}

export default App
