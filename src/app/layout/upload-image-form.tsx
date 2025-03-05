import useImageLoading from "@/hooks/use-image-loading";
import useToast from "@/hooks/use-toast";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BsPlusLg, BsX } from "react-icons/bs";

export type FileData = {
  file: File;
  previewUrl: string;
};

interface UploadImageFormProps {
  uploadFile?: (file: FileData) => void;
  deleteFile?: (id: string) => void;
}

const UploadImageForm = ({ uploadFile, deleteFile }: UploadImageFormProps) => {
  const { toast } = useToast();
  const { handleImageChange, file, previewUrl, isError } = useImageLoading();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<FileData[]>([]);

  useEffect(() => {
    if (isError || !file || !previewUrl) return;

    if (files.length > 4) {
      toast("최대 5개 까지 등록 가능합니다!");
      return;
    }

    const data: FileData = {
      file,
      previewUrl: previewUrl,
    };

    if (uploadFile) uploadFile(data);
    setFiles((prev) => [...prev, data]);
  }, [file]);

  const addImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const deleteImage = (id: string) => {
    const filtered = files.filter((file) => file.previewUrl !== id);

    if (deleteFile) deleteFile(id);
    setFiles(filtered);
  };

  return (
    <div>
      <div className="flex justify-start gap-4 flex-wrap">
        {files.map((file, i) => {
          return (
            <div
              key={`${file.previewUrl} ${file.file} ${i}`}
              className="relative rounded-lg w-16 h-16 shadow-sm dark:border border-solid border-grey-dark"
            >
              <button
                className={`absolute -top-2 -right-2 rounded-full w-6 h-6 z-50 flex items-center justify-center bg-primary text-white`}
                onClick={() => deleteImage(file.previewUrl)}
              >
                <BsX size={20} />
              </button>
              <Image
                src={file.previewUrl}
                alt="report"
                className="object-cover rounded-lg"
                fill
              />
            </div>
          );
        })}

        <AddImageButton onClick={addImageButtonClick} />
      </div>

      <input
        type="file"
        onChange={handleImageChange}
        ref={fileInputRef}
        data-testid="file-input"
        className="hidden"
      />
    </div>
  );
};

const AddImageButton = ({ onClick }: { onClick: VoidFunction }) => {
  return (
    <div
      className="relative rounded-lg flex items-center justify-center shrink-0 h-16 w-16 cursor-pointer border-2 border-dashed border-grey-dark"
      onClick={onClick}
    >
      <BsPlusLg size={24} />
    </div>
  );
};

export default UploadImageForm;
