import { MouseEventHandler, ReactNode, useRef } from "react";
import styled, { css } from "styled-components";

interface OverlayProps {
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLElement>;
  show: boolean;
}

const Overlay = styled.div`
  background: rgba(36, 36, 36, 0.0);
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  transition: z-index 0s 0.3s, background 0.3s;
  z-index: -1;

  &.active {
    background: rgba(36, 36, 36, 0.7);
    overflow: auto;
    transition: z-index 0s, background 0.3s;
    z-index: 0;
  }
`;

export default (props: OverlayProps) => {
  const overlayRef = useRef(null);

  return (
    <Overlay
      ref={overlayRef}
      className={ props.show ? 'active' : '' }
      onClick={(event) => { if (props.onClick && overlayRef.current == event.target) { props.onClick(event); } }}
    >
      {props.children}
    </Overlay>
  );
}
