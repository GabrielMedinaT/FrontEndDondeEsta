import React from "react";
import Modal from "react-modal";
import "./ConfirmacionModal.css";

// Estilos CSS para el modal
const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.75)" /* Fondo oscuro semi-transparente */,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    position: "relative",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)" /* Sombra del modal */,
    borderRadius: "4px",
    backgroundColor: "#fff" /* Color de fondo del modal */,
    padding: "20px",
    maxWidth: "500px" /* Ancho máximo del modal */,
    margin: "0 auto" /* Centrar horizontalmente */,
  },
  bodyOpen: {
    overflow:
      "hidden" /* Evitar el desplazamiento de fondo cuando el modal está abierto */,
  },
};

Modal.setAppElement("#root"); // Establece el elemento raíz de tu aplicación

const ConfirmacionModalHabitacion = ({
  modalAbiertoHab,
  cerrarModal,
  eliminarHabitacion,
  nombreHabitacion,
}) => {
  return (
    <Modal
      isOpen={modalAbiertoHab}
      onRequestClose={cerrarModal}
      style={modalStyles} // Aplicar los estilos CSS al modal
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
