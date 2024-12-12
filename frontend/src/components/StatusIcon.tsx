import { CgSpinnerTwo } from "react-icons/cg";
import { FaRegCircle, FaRegCheckCircle, FaRegTimesCircle } from "react-icons/fa";
import UiFile, { Status } from "../types/UiFile";

interface Props { file: UiFile; handleUpload: (f: UiFile) => void; };


const StatusIcon = ({ file, handleUpload }: Props) => {

  const statusIconMap: Map<Status, any> = new Map([
    ["ready", <FaRegCircle />],
    ["uploading", <CgSpinnerTwo className="animate-spin" />],
    ["done", <FaRegCheckCircle />],
    ["error", <FaRegTimesCircle />],
  ]);

  return (
    <div className="tooltip tooltip-right text-xl text-center relative left-2" data-tip={file.status !== "uploading" ? file.status : Math.round((file.progress ?? 0) * 100) + "%"}>
      <button onClick={() => handleUpload(file)}>
        {statusIconMap.get(file.status)}
      </button>
    </div>
  )
}

export default StatusIcon;
