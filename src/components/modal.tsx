import Link from "next/link";
import { ReactNode } from "react";
import styled, { css } from "styled-components";
import { CloseIcon } from "./icons";
import Overlay from "./overlay";


const ModalBox = styled.div`
  background: #242424;
  box-shadow: 0 0 1px 1px rgba(0,0,0,0.5);
  color: #ffffff;
  margin: 100% auto 128px;
  transition: visibility 0s 0.3s, margin-top 0.3s;    
  visibility: hidden;
  width: 730px;

  &.active {
    margin-top: 128px;
    transition: visibility 0s, margin-top 0.3s;    
    visibility: visible;
  }
`;

const ModalTitle = styled.h3`
  color: #64EEBC;
  font-size: 20px;
  line-height: 20px;
  padding-top: 48px;
  text-align: center;
`;

const ModalClose = styled.div`
  float: right;
  padding: 24px 24px 0 0;
`

const ModalContent = styled.div`
  font-size: 16px;
  padding: 48px 64px;
`;

interface ModalProps {
  children?: ReactNode;
  onClose: () => void;
  show: boolean;
  title: string;
}

export default (props: ModalProps) => (
  <Overlay show={props.show} onClick={props.onClose}>
    <ModalBox className={ props.show ? 'active' : '' }>
      <ModalClose>
        <Link href="#" onClick={props.onClose}>
          <CloseIcon />
        </Link>
      </ModalClose>
      <ModalTitle>
        {props.title}
      </ModalTitle>
      <ModalContent>
        {props.children}
      </ModalContent>
   </ModalBox>
  </Overlay>
);
