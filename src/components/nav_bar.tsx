import styled from "styled-components";
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


export const NavBarItem = styled.div`
  color: #FFFFFF;
  cursor: pointer;
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  letter-spacing: 4px;
  line-height: 18px;
  margin: auto 32px;
`;

export const NavBarItemNotifications = () => (
  <NavBarItem>
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

  > div {
    margin: auto 20px;
  }
`;

