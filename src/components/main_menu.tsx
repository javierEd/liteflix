import Link from "next/link";
import { useEffect } from "react";
import styled from "styled-components";
import { maxMobileWidth } from "./globalstyles";
import { CloseIcon, PlusIcon } from "./icons";
import Logo from "./logo";
import { NavBar, NavBarCloseButton, NavBarItemBell, NavBarItemUser, NavBarRight, NavBarTitle } from "./nav_bar";
import Overlay from "./overlay";

interface MainMenuProps {
  onClickAddMovie: () => void;
  onClose: () => void;
  show: boolean;
}

const MainMenuWrapper = styled.div`
  background: rgba(36, 36, 36, 0.9);
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.5);
  height: 100%;
  margin: 0 0 0 100%;
  overflow: auto;
  padding: 32px 100px 0 88px;
  transition: visibility 0s 0.3s, margin-left 0.3s;
  visibility: hidden;
  width: 761px;

  &.active {
    margin-left: calc(100% - 761px);
    transition: visibility 0s, margin-left 0.3s;
    visibility: visible;
  }

  @media (max-width: ${maxMobileWidth}) {
    width: 100%;

    &.active {
      margin-left: 0;
      padding: 24px;
    }
  }
`;

const MainMenuItem = styled.div`
  color: #FFFFFF;
  cursor: pointer;
  font-size: 22px;
  line-height: 22px;
  margin: 40px 0 40px;

  &.add-movie {
    margin: 72px 0 72px;
  }

  @media (max-width: ${maxMobileWidth}) {
    font-size: 16px;
    line-height: 16px;
  }
`;

const Plus = styled.span`
  margin-right: 16px;
`;

const MainMenu = (props: MainMenuProps) => {
  useEffect(() => {
    if (props.show) {
      document.body.style.overflowY = 'hidden';
    }

    return () => { document.body.style.overflowY = 'auto'; };
  }, [props.show]);

  return (
    <Overlay show={props.show} onClick={props.onClose}>
      <MainMenuWrapper className={props.show ? 'active' : ''}>
        <NavBar>
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
        <MainMenuItem className="font-light">
            <Link href="/" onClick={props.onClose}>
              INICIO
            </Link>
        </MainMenuItem>
        <MainMenuItem className="font-light">
            SERIES
        </MainMenuItem>
        <MainMenuItem className="font-light">
            PELICULAS
        </MainMenuItem>
        <MainMenuItem className="font-light">
            AGREGADAS RECIENTEMENTE
        </MainMenuItem>
        <MainMenuItem className="font-light">
            POPULARES
        </MainMenuItem>
        <MainMenuItem className="font-light">
            MIS PELÍCULAS
        </MainMenuItem>
        <MainMenuItem className="font-light">
            MI LISTA
        </MainMenuItem>
        <MainMenuItem className="add-movie" onClick={props.onClickAddMovie}>
          <Plus>
            <PlusIcon />
          </Plus>
          AGREGAR PELÍCULA
        </MainMenuItem>
        <MainMenuItem className="font-light">
            CERRAR SESIÓN
        </MainMenuItem>
      </MainMenuWrapper>
    </Overlay>
  );
}

export default MainMenu;
