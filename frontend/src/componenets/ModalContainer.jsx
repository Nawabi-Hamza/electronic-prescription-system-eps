// Modal.jsx

import { X } from "lucide-react";
import { modalStyles } from "../styles/modalStyles";
import { btnStyle } from "../styles/componentsStyle";

const Modal = ({ isOpen, onClose, title, containerStyle, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className={modalStyles.overlay} onClick={onClose}>
      <div className={`${containerStyle ==="md" ? modalStyles.containerMd: containerStyle==="sm"? modalStyles.containerSm : containerStyle==="xsm"? modalStyles.containerXSm: modalStyles.container} ${modalStyles.overFlowY}`} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={modalStyles.header}>
          <h2 className={modalStyles.title}>{title}</h2>
          <button
            onClick={onClose}
            className={btnStyle.dangerSm}
          >
            <X className={modalStyles.closeBtnIcon}/>
          </button>
        </div>

        {/* Body */}
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
