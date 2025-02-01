import { useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";


import FileAdder, { RefType as FileAdderRef } from "./components/FileAdder";
import humanFileSize from "./utils/humanReadableFileSize";
import UiFile, { Status } from "./types/UiFile";
import StatusIcon from "./components/StatusIcon";
import axios from "axios";

function App() {
  const fileAdderRef = useRef<null | FileAdderRef>(null);
  const [files, setFiles] = useState<UiFile[]>([]);

  interface FileProperties { status?: Status; progress?: number }
  const setFileProperties = (file: UiFile, properties: FileProperties) => {
    setFiles((files) => {
      const filesCopy = Array.from(files.map(file => file.clone()));

      const fileToModify = filesCopy.find(f => f.id === file.id)
      if (fileToModify) {
        if (properties.status)
          fileToModify.status = properties.status;
        if (properties.progress)
          fileToModify.progress = properties.progress;
      }

      return filesCopy;
    });
  }
  const setFileStatus = (file: UiFile, status: Status) => setFileProperties(file, { status });
  const setFileProgress = (file: UiFile, progress: number) => setFileProperties(file, { progress });

  const handleAddFiles = (f: File[]) => {
    setFiles([...files, ...f.map((f) => UiFile.fromFile(f))]);
  }

  const handleRemoveFiles = (file: UiFile) => { setFiles(fs => fs.filter(f => f.id !== file.id)) }

  const handleDrop = (ev: React.DragEvent<HTMLElement>) => {
    ev.preventDefault();

    const files = Array
      .from(ev.dataTransfer.items)
      .map(item => item.getAsFile())
      .filter(file => file !== null);

    handleAddFiles(files);
  }

  const handlePaste = (ev: React.ClipboardEvent<HTMLElement>) => {
    ev.preventDefault();

    const files = Array.from(ev.clipboardData.files);
    handleAddFiles(files);
  }

  const handleUploadFile = async (file: UiFile) => {
    if (!file.uploadable)
      return;

    setFileStatus(file, "uploading");

    try {
      let url: string | null = null; 
      url ??= import.meta.env.VITE_BACKEND_URL;
      url ??= import.meta.env.VITE_BACKEND_PORT &&
          `http://${location.hostname}:${import.meta.env.VITE_BACKEND_PORT}`;
      url ??= '/api';

      if(url.endsWith("/")) {
        url = url.substring(0, url.length-1);
      }

      console.log('requesting at', url + "/" + file.name);
      const res = await axios.post(url + "/" + file.name, file.file, {
        onUploadProgress: (p) => { setFileProgress(file, p.loaded / (p.total ?? Infinity)) }
      })

      if (res.status >= 200 && res.status < 300) {
        setFileStatus(file, "done");
      } else {
        setFileStatus(file, "error");
      }
    } catch (err) {
      console.error(err);
      setFileStatus(file, "error");
    }
  }

  const handleUploadAll = () => { files.forEach(f => handleUploadFile(f)) }
  const handleRemoveUploaded = () => { setFiles(files.filter(f => f.status !== "done")); }

  return <main
    onDrop={handleDrop}
    onDragOver={(ev) => { ev.preventDefault() }}
    onPaste={handlePaste}
    className="h-svh p-8 gap-6 overflow-hidden flex flex-col">

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
              <td><StatusIcon handleUpload={handleUploadFile} file={file} /></td>
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
    <div className="flex justify-between">
      <div className="space-x-2">
        <button onClick={handleUploadAll} className={`btn ${files.some(f => f.uploadable) || "btn-disabled"}`}>Upload all files</button>
        <button onClick={handleRemoveUploaded} className={`btn ${files.some(f => f.status === "done") || "btn-disabled"}`}>Remove uploaded</button>
      </div>

      <button
        onClick={() => { fileAdderRef.current?.getFiles().then(files => { handleAddFiles(files) }) }}
        className="btn btn-circle">

        <FaPlus />
      </button>
    </div>

    <FileAdder ref={fileAdderRef} />
  </main >
}

export default App
