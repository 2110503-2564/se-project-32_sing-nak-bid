import React from "react";

type ErrorAlertProps = {
  message: string;
  onClose: () => void;
};

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center">
      <div
        className="error-alert cursor-default flex items-center justify-between w-96 sm:w-[400px] text-[14px] sm:text-lg z-50 bg-[#232531] px-6 py-4 rounded-lg"
      >
        <div className="flex gap-4">
          <div className="text-[#d65563] bg-white/5 backdrop-blur-xl p-2 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
              ></path>
            </svg>
          </div>
          <div>
            <p className="text-white text-xl">{message}</p>
          </div>
        </div>
        <button
          onClick={onClose} // Close the alert on button click
          className="text-gray-600 hover:bg-white/10 p-2 rounded-md transition-colors ease-linear"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18 18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ErrorAlert;
