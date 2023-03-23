import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import Form from "./form";
import { classNameVisible, maxMobileWidth } from "./globalstyles";
import { ClipIcon } from "./icons";
import Logo from "./logo";
import Modal from "./modal";
import { MY_MOVIES_QUERY } from "./movies_sidebar";

const ADD_MY_MOVIE_MUTATION = gql`
  mutation AddMyMovieMutation($attributes: MyMovieInputObject!) {
    addMyMovie(attributes: $attributes) {
      success
      message
      resource {
        id
      }
    }
  }
`;

const ALLOWED_FILE_TYPES = ['image/gif', 'image/jpeg', 'image/png'];

const CancelButton = styled.div`
  cursor: pointer;
  margin-top: 20px;
  font-size: 18px;
  position: absolute;
  right: 0;
`;

const Clip = styled.span`
  margin-right: 16px;
`;

interface DropzoneProps {
  dragging: boolean;
}

const Dropzone = styled.label<DropzoneProps>`
  background: rgba(66, 66, 66, 0.0);
  border: 1px dashed #FFFFFF;
  cursor: pointer;
  display: block;
  height: 93px;
  line-height: 93px;
  opacity: 0;
  padding: 0 24px;
  position: absolute;
  text-align: center;
  transition: visibility 0s 0.3s, opacity 0.3s, background 0.3s;
  visibility: hidden;
  width: 100%;

  > input[type=file] {
    display: none;
  }

  &.visible {
    opacity: 1;
    transition: visibility 0s, opacity 0.3s, background 0.3s;
    visibility: visible;
  }

  ${props => props.dragging && css`
    background: rgba(66, 66, 66, 0.9);
  `}
`;

const DropzoneWrapper = styled.div`
  height: 93px;
  position: relative;
`;

const ProgressBar = styled.div`
  position: absolute;
  width: 100%;
`;

const ProgressButtons = styled.div`
  margin-top: 20px;
  font-size: 18px;
  position: absolute;
  right: 0;
`;

const ProgressDescription = styled.div`
  margin-bottom: 19px;
  text-align: left;
`;

interface ProgressIndicatorProps {
  hasError: boolean;
  progress: number;
}

const ProgressIndicator = styled.div<ProgressIndicatorProps>`
  background-color: rgba(255, 255, 255, 0.5);
  height: 4px;
  position: relative;
  width: 100%;

  &:after {
    content: '';
    height: 10px;
    position: absolute;
    top: -3px;
    transition: width 0.3s, background-color: 0.3s;
    left: 0;

    ${props => css`
      background-color: ${props.hasError ? '#FF0000' : '#64EEBC'};
      width: ${props.hasError ? '100' : props.progress}%;
    `}
  }
`;

const Success = styled.div`
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  text-align: center;
  top: 0;

  > svg {
    margin-bottom: 72px;
    width: 113px;
  }
`;

const SuccessButton = styled.div`
    background-color: #ffffff;
    color: #242424;
    height: 56px;
    width: 248px;
    font-size: 18px;
    line-height: 56px;
    letter-spacing: 4px;
    margin: auto;
`;

const SuccessMessage = styled.div`
  font-size: 20px;
  line-height: 24px;
  margin-bottom: 74px;
`;

const SuccessTitle = styled.div`
  font-size: 24px;
  line-height: 26px;
  margin-bottom: 24px;
`;

const TitleLabel = styled.label`
  @media (max-width: ${maxMobileWidth}) {
    margin-bottom: 96px;
  }
`;

const ModalExitButton = styled.div`
  background: rgba(36, 36, 36, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.5);
  cursor: pointer;
  font-size: 18px;
  height: 56px;
  padding: 18px;
  text-align: center;
  width: 248px;
  transition: background 0.3s;

  &:hover {
    background: rgba(66, 66, 66, 0.5);
  }

  @media (max-width: ${maxMobileWidth}) {
    margin: 0 auto 16px;
  }
`;

interface AddMovieModalProps {
  onClose: () => void;
  show: boolean;
}

const AddMovieModal = (props: AddMovieModalProps) => {
  const [draggingFile, setDraggingFile] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imageBase64, setImageBase64] = useState<string | undefined>(undefined);
  const [title, setTitle] = useState('');
  const [formError, setFormError] = useState<string | undefined>(undefined);
  const [addMyMovieMutation, {loading, data, reset }] = useMutation(
    ADD_MY_MOVIE_MUTATION, { refetchQueries: [{ query: MY_MOVIES_QUERY }] }
  );

  useEffect(() => {
    document.ondragover = (event) => {
      event.preventDefault();
      event.stopPropagation();
      const items = event.dataTransfer?.items;
      const files = event.dataTransfer?.files;

      if (items) {
        setDraggingFile([...items].find((item) => item.kind == 'file') != null);
      } else if (files) {
        setDraggingFile(files.length > 0);
      }
    };

    document.ondragleave = (event) => {
      event.preventDefault();
      event.stopPropagation();
      setDraggingFile(false);
    };

    document.ondrop = (event) => {
      event.preventDefault();
      event.stopPropagation();
      setDraggingFile(false);

      setImage(event.dataTransfer?.files[0]);
    };
  }, []);

  const setImage = (image: File | undefined) => {
    setProgress(10);

    if (!image) {
      setFormError(undefined);
      setProgress(0);
      setImageBase64(undefined);
      return;
    }

    setProgress(25);

    if (image.size > 512000) {
      setFormError('TAMAÑO INVÁLIDO (NO PUEDE SUPERAR LOS 500KB)');
      return;
    }

    if (!ALLOWED_FILE_TYPES.includes(image.type)) {
      setFormError('FORMATO INVÁLIDO (SOLO SE PERMITE JPG, PNG O GIF)');
      return;
    }

    setProgress(50);

    const fileReader = new FileReader();

    fileReader.onload = () => {
      const newImage = fileReader.result as string;

      setImageBase64(newImage);
      setProgress(100);
    };

    fileReader.readAsDataURL(image as Blob);
  };

  const progressDescriptionText = () => {
    if (formError) {
      return `¡ERROR! ${formError}`;
    }

    return progress < 100 ? `CARGANDO ${progress}%` : '100% CARGADO';
  };

  const hasFormError = () => (typeof formError !== 'undefined');

  const isReady = () => (!loading && typeof imageBase64 !== 'undefined' && title.trim().length > 0);

  const isSubmitted = () => (typeof data !== 'undefined');

  const onSubmit = (event: any) => {
    event.preventDefault();

    if (!isReady()) {
      return;
    }

    addMyMovieMutation({ variables: { attributes: { title: title.trim(), imageBase64 } } });
  };

  const onClose = () => {
    props.onClose();
    setFormError(undefined);
    setProgress(0);
    setImage(undefined);
    setTitle('');
    reset();
  };

  return (
    <Modal show={props.show} onClose={onClose} title={isSubmitted() ? '' : 'AGREGAR PELÍCULA'}>
      <Form onSubmit={onSubmit} className={classNameVisible(!isSubmitted())}>
        <DropzoneWrapper>
          <Dropzone className={classNameVisible(progress == 0)} dragging={draggingFile}>
            <div>
              <Clip>
                <ClipIcon />
              </Clip>
              <span className="hidden-mobile">AGREGÁ UN ARCHIVO O ARRASTRALO Y SOLTALO AQUÍ</span>
              <span className="hidden-desktop">AGREGÁ UN ARCHIVO</span>
            </div>
            <input
              type="file"
              accept="image/gif,image/jpeg,image/png"
              onChange={(event) => { if (event.target.files) { setImage(event.target.files[0]); } }}
            />
          </Dropzone>
          <ProgressBar className={classNameVisible(progress > 0)}>
            <ProgressDescription>
              {progressDescriptionText()}
            </ProgressDescription>
            <ProgressIndicator progress={progress} hasError={hasFormError()} />
            <ProgressButtons>
              <CancelButton
                onClick={() => setImage(undefined)}
                className={classNameVisible((progress > 0 && progress < 100) || hasFormError())}
              >
                { hasFormError() ? 'REINTENTAR' : 'CANCELAR' }
              </CancelButton>
              <div className={classNameVisible(progress == 100 && !hasFormError())}>¡LISTO!</div>
            </ProgressButtons>
          </ProgressBar>
        </DropzoneWrapper>
        <TitleLabel>
          <input type="text" placeholder="TÍTULO" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={255} />
        </TitleLabel>
        <input type="submit" value="SUBIR PELÍCULA" className={isReady() ? '' : 'disabled'} />
        <ModalExitButton onClick={props.onClose} className="hidden-desktop">SALIR</ModalExitButton>
      </Form>
      <Success className={classNameVisible(isSubmitted())}>
        <Logo />
        <SuccessTitle>¡FELICITACIONES!</SuccessTitle>
        <SuccessMessage>{title} FUE CORRECTAMENTE SUBIDA.</SuccessMessage>
        <SuccessButton onClick={onClose}>IR A HOME</SuccessButton>
      </Success>
    </Modal>
  );
}

export default AddMovieModal;
