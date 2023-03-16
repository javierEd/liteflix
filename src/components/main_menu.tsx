import Link from "next/link";
import styled, { css } from "styled-components";
import { CloseIcon } from "./icons";
import { NavBar, NavBarItemNotifications, NavBarItemUser, NavBarRight } from "./nav_bar";
import Overlay from "./overlay";

interface MainMenuProps {
  onClose?: () => void;
  show: boolean;
}

const MainMenu = styled.div`
  background: rgba(36, 36, 36, 0.9);
  box-shadow: 0 0 1px 1px rgba(0,0,0,0.5);
  height: 100%;
  margin: 0 0 0 100%;
  overflow: auto;
  transition: visibility 0s 0.3s, margin-left 0.3s;
  visibility: hidden;
  width: 761px;

  > * {
    margin-left: 88px;
  }

  &.active {
    margin-left: calc(100% - 761px);
    transition: visibility 0s, margin-left 0.3s;
    visibility: visible;
  }
`;

const MainMenuItem = styled.div` 
  color: #FFFFFF;
  font-family: 'Bebas Neue';
  font-style: normal;
  font-weight: 400;
  font-size: 22px;
  letter-spacing: 4px;
  line-height: 22px;
  margin: 40px 0 40px 88px;
`;

export default (props: MainMenuProps) => (
  <Overlay show={props.show} onClick={props.onClose}>
    <MainMenu className={props.show ? 'active' : ''}>
      <NavBar>
        <Link href="#" onClick={props.onClose}>
          <CloseIcon />
        </Link>
        <NavBarRight>
          <NavBarItemNotifications />
          <NavBarItemUser />
        </NavBarRight>
      </NavBar>
      <MainMenuItem>
        <Link href="#">
          INICIO
        </Link>
      </MainMenuItem>
      <MainMenuItem>
        <Link href="#">
          SERIES
        </Link>
      </MainMenuItem>
      <MainMenuItem>
        <Link href="#">
          PELICULAS
        </Link>
      </MainMenuItem>
      <MainMenuItem>
        <Link href="#">
          AGREGADAS RECIENTEMENTE
        </Link>
      </MainMenuItem>
      <MainMenuItem>
        <Link href="#">
          POPULARES
        </Link>
      </MainMenuItem>
      <MainMenuItem>
        <Link href="#">
          MIS PELÍCULAS
        </Link>
      </MainMenuItem>
      <MainMenuItem>
        <Link href="#">
          MI LISTA
        </Link>
      </MainMenuItem>
      <MainMenuItem>
        <Link href="#">
          CERRAR SESIÓN
        </Link>
      </MainMenuItem>
    </MainMenu>
  </Overlay>
);
