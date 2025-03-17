import { downloadPdf, type DownloadPdf } from "@/api/marker";
import useToast from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

export const useDownloadPdf = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: DownloadPdf) => downloadPdf(payload),
    onSuccess: (blob, payload) => {
      if (!blob) {
        toast("파일 다운로드에 실패했습니다.");
        return;
      }

      try {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${payload.lat}${payload.lng}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error(error);
        toast("파일 다운로드 중 오류가 발생했습니다.");
      }
    },
    onError: (error) => {
      console.error(error);
      toast("서버가 원활하지 않습니다. 잠시 후 다시 시도해주세요.");
    },
  });
};
