import React from "react";
import Modal from "react-modal";


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

Modal.setAppElement("#root");

const ConfirmacionModalHabitacion = ({
  modalAbierto,
  cerrarModal,
  eliminarHabitacion,
  nombreHabitacion,
}) => {
  return (
    <Modal
      isOpen={modalAbierto}
      onRequestClose={cerrarModal}
      style={modalStyles}
    >
      <h1>
        ¿Seguro que quieres eliminar la Habitacion? Esta acción no se podrá
        revertir
      </h1>
      <button
        className="botonSi"
        onClick={() => eliminarHabitacion(nombreHabitacion)}
      >
        Sí
      </button>
      <button className="botonNo" onClick={cerrarModal}>
        No
      </button>
    </Modal>
  );
};

export default ConfirmacionModalHabitacion;
