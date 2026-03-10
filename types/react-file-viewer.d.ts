declare module "react-file-viewer" {
  import { ComponentType } from "react";

  interface FileViewerProps {
    fileType: string;
    filePath: string;
    errorComponent?: ComponentType<any>;
    onError?: (e: any) => void;
  }

  const FileViewer: ComponentType<FileViewerProps>;

  export default FileViewer;
}