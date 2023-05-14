import React from "react";
import Modal from "react-modal";
import "./ConfirmacionModal.css";

const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    position: "relative",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
    borderRadius: "4px",
    backgroundColor: "#fff",
    padding: "20px",
    maxWidth: "500px",
    margin: "0 auto",
  },
  bodyOpen: {
    overflow: "hidden",
  },
};
Modal.setAppElement("#root"); // Establece el elemento raíz de tu aplicación

const ConfirmacionModal = ({ casaId, isOpen, onClose, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={modalStyles}>
      <h1>
        ¿Seguro que quieres eliminar la casa? Esta acción no se podrá revertir
      </h1>
      <button className="botonSi" onClick={() => onConfirm(casaId)}>
        Sí
      </button>
      <button className="botonNo" onClick={onClose}>
        No
      </button>
    </Modal>
  );
};

export default ConfirmacionModal;
