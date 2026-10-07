import Image from "next/image";

type LogoMarkProps = {
  size?: number;
  className?: string;
};

/** 벚꽃 로고. 파비콘(src/app/icon.png)과 같은 그림이다. */
export function LogoMark({ size = 56, className }: LogoMarkProps) {
  return (
    <Image
      src="/images/logo-sakura.png"
      alt="도화사주 로고"
      width={size}
      height={size}
      className={className}
    />
  );
}
