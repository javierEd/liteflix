import styled from "styled-components";
import Modal from "./modal";

const PlayDescription = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const PlayIframe = styled.iframe`
  border: none;
  height: 360px;
  width: 100%;
`;

export interface VideoProps {
  key: string;
  site: string;
  type: string;
}

interface PlayMovieModalProps {
  onClose: () => void;
  show: boolean;
  video: VideoProps | null;
}

const PlayMovieModal = (props: PlayMovieModalProps) => (
  <Modal show={props.show} onClose={props.onClose} title="REPRODUCIR">
    <PlayDescription>
      NO TENGO LOS DERECHOS DE TRANSMISIÓN &#128546;
    </PlayDescription>
    <PlayDescription>
      TENDRÁS QUE CONFORMARTE CON UN TRAILER &#128517;
    </PlayDescription>
    <PlayIframe src={`https://www.youtube.com/embed/${props.video?.key}?autoplay=1`}>
    </PlayIframe> 
  </Modal>
);

export default PlayMovieModal;
