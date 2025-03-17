import useToast from "./use-toast";

export const useClipboard = () => {
  const { toast } = useToast();
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast("복사가 완료되었습니다.");
    } catch (error) {
      console.error(error);
      toast("복사가 완료되지 않았습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  return { copyToClipboard };
};
