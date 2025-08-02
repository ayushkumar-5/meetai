import { Loader2Icon } from "lucide-react";

interface Props {
  title: string;
  description: string;
}

export const LoadingState = ({ title, description }: Props) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-50 dark:bg-blue-950">
      <div className="relative flex flex-col items-center gap-y-10 rounded-3xl bg-white/90 dark:bg-blue-900/90 p-12 shadow-2xl backdrop-blur-lg transition-transform duration-500 hover:scale-110 max-w-md w-full">
        <div className="relative">
          <Loader2Icon className="size-12 animate-spin text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-800" />
          <div className="absolute inset-0 animate-ping bg-blue-600/40 rounded-full scale-150"></div>
          <div className="absolute inset-0 scale-200 animate-pulse bg-blue-500/20 rounded-full"></div>
        </div>
        <div className="flex flex-col items-center gap-y-4 text-center">
          <h6 className="text-3xl font-extrabold text-blue-900 dark:text-blue-100 tracking-tight">
            {title}
          </h6>
          <p className="text-lg text-blue-700 dark:text-blue-300 leading-7">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};