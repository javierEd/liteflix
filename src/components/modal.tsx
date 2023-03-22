import { ReactNode } from "react";
import styled from "styled-components";
import { maxMobileWidth } from "./globalstyles";
import { CloseIcon } from "./icons";
import Overlay from "./overlay";

const ModalBox = styled.div`
  background: #242424;
  box-shadow: 0 0 1px 1px rgba(0,0,0,0.5);
  color: #ffffff;
  margin: 100vh auto 128px;
  transition: visibility 0s 0.3s, margin-top 0.3s;
  visibility: hidden;
  width: 730px;

  &.active {
    margin-top: 128px;
    transition: visibility 0s, margin-top 0.3s;
    visibility: visible;
  }

  @media (max-width: ${maxMobileWidth}) {
    height: 100vh;
    width: 100%;

    &.active {
      margin: 0;
    }
  }
`;

const ModalHeader = styled.div`
  position: relative;
`;

const ModalTitle = styled.div`
  color: #64EEBC;
  font-size: 20px;
  line-height: 20px;
  padding-top: 48px;
  text-align: center;
`;

const CloseButton = styled.div`
  cursor: pointer;
  float: right;
  position: absolute;
  top: 24px;
  right: 24px;
`

const ModalContent = styled.div`
  font-size: 16px;
  padding: 48px 64px;
  position: relative;
`;

interface ModalProps {
  children?: ReactNode;
  onClose: () => void;
  show: boolean;
  title: string;
}

const Modal = (props: ModalProps) => (
  <Overlay show={props.show} onClick={props.onClose}>
    <ModalBox className={ props.show ? 'active' : '' }>
      <ModalHeader>
        <ModalTitle>
          {props.title}
        </ModalTitle>
        <CloseButton onClick={props.onClose}>
          <CloseIcon />
        </CloseButton>
      </ModalHeader>
      <ModalContent>
        {props.children}
      </ModalContent>
   </ModalBox>
  </Overlay>
);

export default Modal;
