
import { GoogleIcon } from "@/components/ui/GoogleIcon";

interface SocialAuthButtonsProps {
  action: "Masuk" | "Daftar";
}

const socialButtons = [
  {
    label: "Google",
    icon: <GoogleIcon className="size-5" />,
  },
];

export function SocialAuthButtons({ action }: SocialAuthButtonsProps) {
  return (
    <div className="mt-6 flex justify-center gap-4">
      {socialButtons.map((item) => (
        <button
          key={item.label}
          type="button"
          aria-label={`${action} dengan ${item.label}`}
          className="flex size-11 items-center justify-center rounded-full border border-[#ececf4] bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-action-blue/40"
        >
          {item.icon}
        </button>
      ))}
    </div>
  );
}
