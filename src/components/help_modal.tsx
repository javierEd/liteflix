import styled from "styled-components";
import Modal from "./modal";

const Key = styled.span`
  border: 1px solid #ffffff;
  margin-right: 3px;
  padding-left: 3px;
`;

interface HelpModalProps {
  onClose: () => void;
  show: boolean;
}

const HelpModal = (props: HelpModalProps) => (
  <Modal show={props.show} onClose={props.onClose} title="AYUDA">
    <p>Atajos de teclado:</p>
    <p><Key>&darr;</Key>: ABAJO</p>
    <p><Key>&uarr;</Key>: ARRIBA</p>
    <p><Key>A</Key>: AGREGAR PELÍCULA</p>
    <p><Key>Enter</Key>: REPRODUCIR SELECCIÓN</p>
    <p><Key>ESC</Key>: CERRAR DIALOGOS Y MENÚS</p>
    <p><Key>H</Key>: AYUDA</p>
    <p><Key>M</Key>: MENÚ PRINCIPAL</p>
    <p><Key>P</Key>: REPRODUCIR PELÍCULA DESTACADA</p>
  </Modal>
);

export default HelpModal;
