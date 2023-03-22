import { MovieType, MyMovieType } from "@/utils/interfaces";
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

interface PlayMovieModalProps {
  onClose: () => void;
  show: boolean;
  movie?: MovieType | MyMovieType;
}

const PlayMovieModal = (props: PlayMovieModalProps) => (
  <Modal show={props.show} onClose={props.onClose} title="REPRODUCIR">
    <PlayDescription>
      NO TENGO LOS DERECHOS DE TRANSMISIÓN &#128546;
    </PlayDescription>
    <PlayDescription>
      TENDRÁS QUE CONFORMARTE CON ESTO &#128517;
    </PlayDescription>
    <PlayIframe
      src={typeof props.movie !== 'undefined' ? `https://www.youtube.com/embed/${props.movie.youTubeTrailerKey}?autoplay=1` : ''}
    />
  </Modal>
);

export default PlayMovieModal;
