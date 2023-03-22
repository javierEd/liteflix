import styled from "styled-components";
import { CloseIcon, PlusIcon } from "./icons";
import { NavBar, NavBarItemNotifications, NavBarItemUser, NavBarRight } from "./nav_bar";
import Overlay from "./overlay";

interface MainMenuProps {
  onClickAddMovie: () => void;
  onClose: () => void;
  show: boolean;
}

const CloseButton = styled.div`
  cursor: pointer;
  margin-top: 11px;
`;

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
`;

const Plus = styled.span`
  margin-right: 16px;
`;

const MainMenu = (props: MainMenuProps) => (
  <Overlay show={props.show} onClick={props.onClose}>
    <MainMenuWrapper className={props.show ? 'active' : ''}>
      <NavBar>
        <CloseButton onClick={props.onClose}>
          <CloseIcon />
        </CloseButton>
        <NavBarRight>
          <NavBarItemNotifications />
          <NavBarItemUser />
        </NavBarRight>
      </NavBar>
      <MainMenuItem>
          INICIO
      </MainMenuItem>
      <MainMenuItem>
          SERIES
      </MainMenuItem>
      <MainMenuItem>
          PELICULAS
      </MainMenuItem>
      <MainMenuItem>
          AGREGADAS RECIENTEMENTE
      </MainMenuItem>
      <MainMenuItem>
          POPULARES
      </MainMenuItem>
      <MainMenuItem>
          MIS PELÍCULAS
      </MainMenuItem>
      <MainMenuItem>
          MI LISTA
      </MainMenuItem>
      <MainMenuItem className="add-movie" onClick={props.onClickAddMovie}>
        <Plus>
          <PlusIcon />
        </Plus>
        AGREGAR PELÍCULA
      </MainMenuItem>
      <MainMenuItem>
          CERRAR SESIÓN
      </MainMenuItem>
    </MainMenuWrapper>
  </Overlay>
);

export default MainMenu;
