import { useRef, useImperativeHandle, forwardRef, useState, ChangeEvent } from "react";

interface PromiseResolvers {
  resolve: (a: File[]) => void;
  reject: () => void;
}

export interface RefType {
  getFiles(): Promise<File[]>
}

const FileAdder = forwardRef((_, ref) => {
  const inputRef = useRef<null | HTMLInputElement>(null);
  const [activePromise, setActivePromise] = useState<null | PromiseResolvers>(null)

  const handleFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      activePromise?.resolve(Array.from(e.target.files));
      setActivePromise(null);
    }
  }

  useImperativeHandle(ref, (): RefType => (
    {
      getFiles() {
        if (inputRef.current === null)
          return Promise.resolve([]);

        if (activePromise !== null) {
          activePromise.reject();
        }

        inputRef.current.click();
        return new Promise((resolve, reject) => { setActivePromise({ resolve, reject }) })
      },
    }
  ))

  return <input ref={inputRef} type="file" className="hidden" onChange={handleFilesChange} multiple />
})

export default FileAdder
