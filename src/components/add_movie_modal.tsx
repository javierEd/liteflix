import { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import Form from "./form";
import { ClipIcon, CloseIcon } from "./icons";
import Modal from "./modal";

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
  padding: 40px 60px;
  text-align: center;
  transition: background 0.3s;

  > input[type=file] {
    display: none;
  }

  ${props => props.dragging && css`     
    background: rgba(66, 66, 66, 0.9);
  `}
`;

interface ShowProp {
  show: boolean;
}

const DropzoneDescription = styled.div<ShowProp>`
  display: none;

  ${props => props.show && css`
    display: block; 
  `}
`;

const CurrentImage = styled.div<ShowProp>`
  display: none;

  ${props => props.show && css`
    display: flex; 
  `}
`;

const ImageName = styled.div`
  flex-grow: 1;
  font-size: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

  interface AddMovieModalProps {
    onClose: () => void;
    show: boolean;
  }

  const AddMovieModal = (props: AddMovieModalProps) => {
    const [draggingFile, setDraggingFile] = useState(false);
    const [image, setImage] = useState<File | undefined>(undefined);
    const [title, setTitle] = useState('');

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

  const onClose = () => {
    props.onClose();
    setImage(undefined);
  };

  return (
    <Modal show={props.show} onClose={onClose} title="AGREGAR PELÍCULA">
      <Form>
        <Dropzone dragging={draggingFile}>
          <DropzoneDescription show={typeof image == 'undefined'}>
            <Clip>
              <ClipIcon />
            </Clip>
            AGREGÁ UN ARCHIVO O ARRASTRALO Y SOLTALO AQUÍ
          </DropzoneDescription>
          <CurrentImage show={typeof image != 'undefined'}>
            <ImageName>{image?.name}</ImageName>
            <div onClick={(event) => { event.preventDefault(); setImage(undefined); }}><CloseIcon /></div>
          </CurrentImage>
          <input
            type="file"
            accept="image/gif,image/jpeg,image/png"
            onChange={(event) => { if (event.target.files) { setImage(event.target.files[0]); } }}
          />
        </Dropzone>
        <label>
          <input type="text" placeholder='TÍTULO' value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <input type="submit" value="SUBIR PELÍCULA" />
      </Form>
    </Modal>
  );
}

export default AddMovieModal;
