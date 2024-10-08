import React from "react";

export function Modal({ isOpen, onClose, children }) {
  return (
    <div className={`modal ${isOpen ? "open" : ""}`}>
      <div className="modal-content">
        {children}
        <div className="close-button" onClick={onClose}>
          <span className="x-icon">&#x2715;</span>
        </div>
      </div>
    </div>
  );
}
