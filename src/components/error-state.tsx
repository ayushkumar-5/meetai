import { AlertCircleIcon } from "lucide-react";

interface Props {
  title: string;
  description: string;
}

export const ErrorState = ({ title, description }: Props) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-red-50 dark:bg-red-950">
      <div className="relative flex flex-col items-center gap-y-10 rounded-3xl bg-white/90 dark:bg-red-900/90 p-12 shadow-2xl backdrop-blur-lg transition-transform duration-500 hover:scale-110 max-w-md w-full">
        <div className="relative">
          <AlertCircleIcon className="size-12 text-red-600 dark:text-red-400" />
        </div>
        <div className="flex flex-col items-center gap-y-4 text-center">
          <h6 className="text-3xl font-extrabold text-red-900 dark:text-red-100 tracking-tight">
            {title}
          </h6>
          <p className="text-lg text-red-700 dark:text-red-300 leading-7">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};