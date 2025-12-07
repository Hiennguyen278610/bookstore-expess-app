import { cn } from "@/lib/utils"; // Nếu không dùng shadcn thì bỏ dòng này và dùng template string thường

interface MapPinProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export function MapPin({ size = 24, className, ...props }: MapPinProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor" // Để màu ăn theo class text-red-600
      stroke="none"
      className={cn("text-red-600", className)} // Mặc định màu đỏ
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18.364 4.636a9 9 0 0 1 .203 12.519l-.203 .21l-4.243 4.242a3 3 0 0 1 -4.097 .135l-.144 -.135l-4.244 -4.243a9 9 0 0 1 12.728 -12.728zm-6.364 3.364a3 3 0 1 0 0 6a3 3 0 0 0 0 -6z" />
    </svg>
  );
}