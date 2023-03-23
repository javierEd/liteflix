import { MouseEventHandler, ReactNode, useRef } from "react";
import styled from "styled-components";

interface OverlayProps {
  children?: ReactNode;
  hasOverflow?: boolean;
  onClick?: MouseEventHandler<HTMLElement>;
  show: boolean;
}

const OverlayWrapper = styled.div`
  background-color: rgba(36, 36, 36, 0.0);
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  transition: z-index 0s 0.3s, background-color 0.3s;
  z-index: -1;

  &.active {
    background-color: rgba(36, 36, 36, 0.7);
    transition: z-index 0s, background-color 0.3s;
    z-index: 0;
  }
`;

const Overlay = (props: OverlayProps) => {
  const overlayRef = useRef(null);

  return (
    <OverlayWrapper
      ref={overlayRef}
      className={ props.show ? 'active' : '' }
      onClick={(event) => { if (props.onClick && overlayRef.current == event.target) { props.onClick(event); } }}
      style={{ overflow: (props.show && props.hasOverflow ? 'auto' : 'hidden') }}
    >
      {props.children}
    </OverlayWrapper>
  );
}

export default Overlay;
