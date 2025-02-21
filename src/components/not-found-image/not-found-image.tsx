import Image from "next/image";

const NotFoundImage = ({ text }: { text?: string }) => {
  const isDark = document.documentElement.classList.contains("dark");

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-28 h-16">
        <Image
          src={isDark ? "/main-c-dark.png" : "/main-c.png"}
          fill
          alt="not found"
        />
        <div className="absolute w-full h-full top-0 left-0 bg-[rgba(255,255,255,0.3)] dark:bg-[rgba(35,35,35,0.3)]" />
      </div>
      <div className="font-bold mt-1">{text}</div>
    </div>
  );
};

export default NotFoundImage;
