import styled from "styled-components";
import { maxMobileWidth } from "./globalstyles";
import { BellIcon } from "./icons";

const Circle = styled.div`
  background-color: #bbb;
  border-radius: 50%;
  height: 40px;
  width: 40px;
`;

export const NavBar = styled.div`
  display: flex;
  margin-bottom: 60px;
`;

export const NavBarCloseButton = styled.div`
  cursor: pointer;
  margin-top: 11px;

  @media (max-width: ${maxMobileWidth}) {
    margin-top: 0;
  }
`;

export const NavBarItem = styled.div`
  color: #FFFFFF;
  cursor: pointer;
  font-size: 18px;
  line-height: 18px;
  margin: auto 32px;
`;

export const NavBarItemBell = () => (
  <NavBarItem className="hidden-mobile">
    <BellIcon />
  </NavBarItem>
);

export const NavBarItemUser = () => (
  <NavBarItem>
    <Circle />
  </NavBarItem>
);

export const NavBarRight = styled.div`
  display: flex;
  margin: auto 32px auto auto;

  @media (max-width: ${maxMobileWidth}) {
    margin: auto;
    width: 100%;
  }

  > div {
    margin: auto 20px;

    @media (max-width: ${maxMobileWidth}) {
      margin: 0;
    }
  }
`;

export const NavBarTitle = styled.div`
  margin: 0 32px 0 0;

  svg {
    height: 34px;
    width: 113px;
  }

  @media (max-width: ${maxMobileWidth}) {
    margin: 0 auto !important;
    text-align: center;

    svg {
      height: 28px;
      width: 98px;
    }
  }
`;

