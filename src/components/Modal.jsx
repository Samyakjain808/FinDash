import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import useStore from "../store/useStore";

export default function Modal({ children, title, onClose }) {
  const darkMode = useStore((s) => s.darkMode);
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
    >
      <div
        ref={contentRef}
        className={`modal-content w-full max-w-lg rounded-2xl shadow-2xl ${
          darkMode
            ? "bg-[#171c28] border border-[#2a3348]"
            : "bg-white border border-gray-200"
        }`}
      >

        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          darkMode ? "border-[#2a3348]" : "border-gray-100"
        }`}>
          <h2 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              darkMode
                ? "hover:bg-[#252d3d] text-gray-400"
                : "hover:bg-gray-100 text-gray-500"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  );
}
