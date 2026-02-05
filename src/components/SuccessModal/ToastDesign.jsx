import React, { useEffect } from "react";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

const Toast = ({
  show,
  onClose,
  message,
  type = "success",
  duration = 3000,
}) => {

  useEffect(() => {
    if (show && duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  const getStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-50",
          text: "text-green-700",
          icon: <CheckCircle className="w-5 h-5 text-green-600" />,
        };
      case "error":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          icon: <XCircle className="w-5 h-5 text-red-600" />,
        };
      case "warning":
        return {
          bg: "bg-yellow-50",
          text: "text-yellow-700",
          icon: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-700",
          icon: null,
        };
    }
  };

  const styles = getStyles();

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-fadeIn">
      <div
        className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg ${styles.bg}`}
      >
        {styles.icon}
        <span className={`font-medium text-sm ${styles.text}`}>
          {message}
        </span>
      </div>
    </div>
  );
};

export default Toast;
