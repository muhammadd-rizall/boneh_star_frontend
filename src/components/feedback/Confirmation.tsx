import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { AlertTriangle, Info, HelpCircle } from "lucide-react";

interface ConfirmationProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  variant?: "danger" | "warning" | "info";
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

function Confirmation({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message,
  variant = "danger",
  confirmText = "Yes, Delete",
  cancelText = "Cancel",
  loading = false,
}: ConfirmationProps) {
  const icons = {
    danger: <AlertTriangle className="text-red-600 w-10 h-10" />,
    warning: <HelpCircle className="text-amber-500 w-10 h-10" />,
    info: <Info className="text-blue-500 w-10 h-10" />,
  };

  const buttonVariants = {
    danger: "danger",
    warning: "primary",
    info: "primary",
  } as const;

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center">
        <div className={`p-4 rounded-3xl mb-4 ${
          variant === 'danger' ? 'bg-red-50' : 
          variant === 'warning' ? 'bg-amber-50' : 'bg-blue-50'
        }`}>
          {icons[variant]}
        </div>
        
        <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-8">
          {message}
        </p>

        <div className="flex flex-col w-full gap-2">
          <Button 
            variant={buttonVariants[variant]} 
            className="w-full py-3" 
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
          <Button 
            variant="ghost" 
            className="w-full py-3" 
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default Confirmation;