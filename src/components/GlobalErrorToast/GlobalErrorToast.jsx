import { useEffect, useState } from "react";

function GlobalErrorToast() {
  const [globalError, setGlobalError] = useState("");

  useEffect(() => {
    let timeoutId;

    const handleGlobalError = (event) => {
      setGlobalError(
        event.detail?.message ||
          "Internal Server Error!"
      );

      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        setGlobalError("");
      }, 3000);
    };

    window.addEventListener(
      "global-api-error",
      handleGlobalError
    );

    return () => {
      window.removeEventListener(
        "global-api-error",
        handleGlobalError
      );

      clearTimeout(timeoutId);
    };
  }, []);

  if (!globalError) return null;

  return (
    <div className="fixed top-5 right-5 z-[999999] rounded-lg bg-red-500 px-5 py-3 text-sm text-white shadow-lg">
      {globalError}
    </div>
  );
}

export default GlobalErrorToast;
