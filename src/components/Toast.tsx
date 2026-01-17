import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
}

export function Toast({ message, type = 'success', duration = 2000, onClose }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose?.(), 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-sage-500" />,
    error: <XCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-pink-400" />,
  };

  const backgrounds = {
    success: 'bg-sage-50 border-sage-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-pink-50 border-pink-200',
  };

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border-2 shadow-lg transition-all duration-300 ${
        backgrounds[type]
      } ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
    >
      {icons[type]}
      <span className="text-sm font-medium text-deep-rose">{message}</span>
    </div>
  );
}

interface UseToastReturn {
  showToast: (message: string, type?: ToastType) => void;
  toast: React.ReactNode;
}

export function useToast(): UseToastReturn {
  const [toast, setToast] = useState<{ message: string; type: ToastType; key: number } | null>(null);

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type, key: Date.now() });
  };

  const toastNode = toast ? (
    <Toast
      key={toast.key}
      message={toast.message}
      type={toast.type}
      onClose={() => setToast(null)}
    />
  ) : null;

  return { showToast, toast: toastNode };
}
