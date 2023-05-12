import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root"); // Establece el elemento raíz de tu aplicación

const ConfirmacionModal = ({ casaId, isOpen, onClose, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
      <h1>
        ¿Seguro que quieres eliminar la casa? Esta acción no se podrá revertir
      </h1>
      <button onClick={() => onConfirm(casaId)}>Sí</button>
      <button onClick={onClose}>No</button>
    </Modal>
  );
};

export default ConfirmacionModal;
