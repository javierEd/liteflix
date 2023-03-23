import Link from "next/link";
import { ReactNode, useEffect } from "react";
import styled from "styled-components";
import { maxMobileWidth } from "./globalstyles";
import { CloseIcon } from "./icons";
import Logo from "./logo";
import { NavBar, NavBarCloseButton, NavBarItemBell, NavBarItemUser, NavBarRight, NavBarTitle } from "./nav_bar";
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
    overflow: auto;
    width: 100%;

    &.active {
      margin: 0;
      padding: 24px;
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

  @media (max-width: ${maxMobileWidth}) {
    font-size: 22px;
  }
`;

const ModalCloseButton = styled.div`
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

  @media (max-width: ${maxMobileWidth}) {
    padding: 48px 0;
  }
`;

interface ModalProps {
  children?: ReactNode;
  onClose: () => void;
  show: boolean;
  title: string;
}

const Modal = (props: ModalProps) => {
  const onKeyDown = (event: any) => {
    if (event.key == 'Escape') {
      props.onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (props.show) {
      document.body.style.overflowY = 'hidden';
    }

    return () => { document.body.style.overflowY = 'auto'; };
  }, [props.show]);

 return (
    <Overlay show={props.show} onClick={props.onClose} hasOverflow={props.show}>
      <ModalBox className={ props.show ? 'active' : '' }>
        <ModalHeader>
          <NavBar className="hidden-desktop">
            <NavBarCloseButton onClick={props.onClose}>
              <CloseIcon />
            </NavBarCloseButton>
            <NavBarRight>
              <NavBarTitle className="hidden-desktop">
                <Link href="/" onClick={props.onClose}>
                  <Logo />
                </Link>
              </NavBarTitle>
              <NavBarItemBell />
              <NavBarItemUser />
            </NavBarRight>
          </NavBar>
          <ModalTitle>
            {props.title}
          </ModalTitle>
          <ModalCloseButton onClick={props.onClose} className="hidden-mobile">
            <CloseIcon />
          </ModalCloseButton>
        </ModalHeader>
        <ModalContent>
          {props.children}
        </ModalContent>
     </ModalBox>
    </Overlay>
  );
}

export default Modal;
