import React from "react";
import { PiWarningCircle } from "react-icons/pi";
import { IoIosCheckmark } from "react-icons/io";
import { MdWarningAmber } from "react-icons/md";
import PropTypes from "prop-types";

const ErrorMessage = ({ message, type = "error" }) => {
  if (!message || (Array.isArray(message) && message.length === 0)) return null;

  const messages = Array.isArray(message) ? message : [message];

  let icon;
  let textColor;
  let bgColor;

  switch (type) {
    case "success":
      icon = <IoIosCheckmark className="text-green-600 text-lg" />;
      textColor = "text-green-600";
      bgColor = "bg-green-50";
      break;

    case "warning":
      icon = <MdWarningAmber className="text-orange-500 text-lg" />;
      textColor = "text-orange-500";
      bgColor = "bg-orange-50";
      break;

    default:
      icon = <PiWarningCircle className="text-red-600 text-base" />;
      textColor = "text-red-600";
      bgColor = "bg-red-50";
  }

  return (
    <div
      className={`${bgColor} mt-1 px-3 py-2 rounded-md flex flex-col gap-1 w-fit`}
    >
      {messages.map((msg, index) => (
        <div key={index} className="flex items-start gap-2">
          {icon}
          <span
            className={`text-xs leading-4 font-medium ${textColor} break-words`}
          >
            {msg}
          </span>
        </div>
      ))}
    </div>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.node,
  ]),
  type: PropTypes.string,
};

export default ErrorMessage;
