
import { GoogleIcon } from "@/components/ui/GoogleIcon";

interface SocialAuthButtonsProps {
  action: "Masuk" | "Daftar";
}

export function SocialAuthButtons({ action }: SocialAuthButtonsProps) {
  return (
    <div className="mt-4 w-full">
      <button
        type="button"
        aria-label={`${action} dengan Google`}
        className="flex items-center justify-center gap-2 h-12 w-full rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-midnight-indigo transition-all cursor-pointer shadow-sm"
      >
        <GoogleIcon className="size-4.5" />
        <span>Google</span>
      </button>
    </div>
  );
}
