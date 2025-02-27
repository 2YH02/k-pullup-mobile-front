import { useState } from "react";

const useImageLoading = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    const suppertedFormats = [
      "image/jpeg",
      "image/png",
      "image/svg+xml",
      "image/webp",
    ];

    if (!e.target.files) {
      setIsLoading(false);
      return;
    }

    if (!suppertedFormats.includes(e.target.files[0]?.type)) {
      setErrorMessage(
        "지원되지 않은 이미지 형식입니다. JPEG, PNG, webp형식의 이미지를 업로드해주세요."
      );
      setIsError(true);
      setIsLoading(false);
      return;
    }

    const file = e.target.files[0];

    if (file) {
      setFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }

    setErrorMessage("");
    setIsError(false);
    e.target.value = "";
    setIsLoading(false);
  };

  const reset = () => {
    setIsLoading(false);
    setIsError(false);
    setErrorMessage("");
    setPreviewUrl(null);
    setFile(null);
  };

  return {
    handleImageChange,
    reset,
    isLoading,
    isError,
    errorMessage,
    previewUrl,
    file,
  };
};

export default useImageLoading;
