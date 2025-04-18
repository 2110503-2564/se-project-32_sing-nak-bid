import React from "react";

type SuccessAlertProps = {
  message: string;
  onClose: () => void;
};

const SuccessAlert: React.FC<SuccessAlertProps> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center">
      <div
        className="success-alert cursor-default flex items-center justify-between w-96 sm:w-[400px] text-[14px] sm:text-lg z-50 bg-[#232531] px-6 py-4 rounded-lg"
      >
        <div className="flex gap-4">
          <div className="text-[#2b9875] bg-white/5 backdrop-blur-xl p-2 rounded-lg">
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
                d="m4.5 12.75 6 6 9-13.5"
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

export default SuccessAlert;
