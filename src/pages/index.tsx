import Head from 'next/head';
import styled, { css } from 'styled-components';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react'

import MainMenu from '@/components/main_menu';
import Modal from '@/components/modal';
import { ArrowDownIcon, CheckIcon, ClipIcon, MenuIcon, PlayCircleIcon, PlayIcon, PlusIcon, SmallPlayCircleIcon } from '@/components/icons';
import Logo from '@/components/logo';
import { NavBar, NavBarItem, NavBarItemNotifications, NavBarItemUser, NavBarRight } from '@/components/nav_bar';

const Arrow = styled.span`
  margin-left: 11px;
`;

interface BackgroundProps {
  backgroundUrl?: string;
}

const Background = styled.div<BackgroundProps>`
  ${props => props.backgroundUrl && css`
    background: url(${props.backgroundUrl});
  `}
`;

const Check = styled.div`
  float: right;
`;

const Clip = styled.span`
  margin-right: 16px;
`;

const Content = styled.div`
  display: flex;
  margin: 64px 100px;
  min-height: calc(100vh - 200px);
`;

const Featured = styled.div`
  flex-grow: 9; 
  align-self: end;
`;

const FeaturedTitle = styled.div`
  color: #64EEBC;
  font-size: 120px;
  letter-spacing: 16px;
  text-transform: uppercase;
`;

const FeaturedButtons = styled.div`
  display: flex;
`;

const PlayButton = styled.div`
  background: #242424;
  cursor: pointer;
  font-size: 18px;
  height: 56px;
  margin-right: 24px;
  padding: 18px;
  text-align: center;
  width: 248px;
`;

const AddToListButton = styled.div`
  background: rgba(36, 36, 36, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.5);
  cursor: pointer;
  height: 56px;
  padding: 18px;
  text-align: center;
  width: 248px;
`;

const Popular = styled.div`
  flex-grow: 1;
  text-align: right;
`;

const Dropdown = styled.div`
  margin-bottom: 24px;
  position: relative;
`;

const DropdownTitle = styled.div`
  cursor: pointer;
  margin-right: 32px;
`;

const DropdownMenu = styled.div`
  background: #242424;
  opacity: 0;
  padding: 8px;
  position: absolute;
  right: 0;
  text-align: left;
  top: 36px;
  transition: visibility 0s 0.3s, opacity 0.3s;
  visibility: hidden;
  width: 241px;
  z-index: 10;

  &:before {
    content:'';
    position: absolute;
    width: 0;
    height: 0;
    margin-left: 184px;
    margin-top: -18px;
    border-bottom: solid 12px #242424;
    border-left: solid 12px transparent;
    border-right: solid 12px transparent;
  }

  &.active {
    opacity: 1;
    transition: visibility 0s, opacity 0.3s;
    visibility: visible;
  }
`;

const DropdownItem = styled.div`
  margin: 16px;
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

const Form = styled.form`
  text-align: center;

  > * {
    display: block;
    margin: 36px auto;

    > input[type=text], > input[type=text]:hover {
      background: none;
      border: none;
      border-bottom: 1px solid #FFFFFF;
      color: #FFFFFF;
      font-family: 'Bebas Neue';
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 19px;
      text-align: center;
      letter-spacing: 4px;
      padding: 8px;
      text-align: center;
      width: 248px;
    }
  }

  > input[type=submit] {
    background: #919191;
    border: none;
    color: #242424;
    height: 56px;
    width: 248px;
    font-family: 'Bebas Neue';
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 22px;
    letter-spacing: 4px;
  }
`;

const NavBarTitle = styled.div`
  margin: auto 32px;
`;

const PlayDescription = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const PlayIframe = styled.iframe`
  border: none;
  height: 360px;
  width: 100%;
`;

const Plus = styled.span`
  margin-right: 12px;
`;

interface MovieCardProps {
  backgroundImage: string;
}

const MovieCard = styled.div<MovieCardProps>`
  height: 146px;
  width: 220px;
  background-image: url(${(props) => props.backgroundImage});
  background-size: cover;
  border-radius: 4px;
  margin: 20px auto;
  position: relative;

  &:hover > .unselected {
    opacity: 0;
  }
`;

const MovieCardCircle = styled.div`
  height: 40px;
  width: 40px;
  margin: auto;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  transition: opacity 0.3s;
`;

const MovieCardTitle = styled.div`
  &.unselected {
    text-align: center;
    position: absolute;
    bottom: 14px;
    left: 14px;
    right: 14px;
    transition: opacity 0.3s;
  }

  &.selected {
    text-align: left;
  }
`;

const MovieCardOverlay = styled.div` 
  border-radius: 4px;
  background: rgba(36, 36, 36, 0.7);
  display: flex;
  width: 100%;
  height: 100%;
  opacity: 0;
  padding: 16px;,
  transition: opacity 0.3s;

  > svg {
  }

  &:hover {
    opacity: 1; 
  }
`;

interface MovieProps {
  id: number;
  title: string;
  backdrop_path: string;
}

interface VideoProps {
  key: string;
  site: string;
  type: string;
}

export default function Home() {
  const [currentVideo, setCurrentVideo] = useState<VideoProps | null>(null);
  const [draggingFile, setDraggingFile] = useState(false);
  const [featuredMovie, setFeaturedMovie] = useState<MovieProps | null>(null);
  const [popularMovies, setPopularMovies] = useState<MovieProps[] | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMainMenu, setShowMainMenu] = useState(false);
  const [showAddMovieModal, setShowAddMovieModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const dropdownRef = useRef(null);

  const closeAll = () => {
    setShowDropdown(false);
    setShowMainMenu(false);
    setShowAddMovieModal(false);
    setShowHelpModal(false);
  };

  useEffect(() => {
    if (showDropdown) {
      document.onclick = (event) => {
        if (dropdownRef.current != event.target) {
          setShowDropdown(false);
        }
      };
    } else {
      document.onclick = null;
    }
  }, [showDropdown]);

  useEffect(() => {
    document.ondragover = (event) => {
      const items = event.dataTransfer?.items;
      const files = event.dataTransfer?.files;

      if (items) {
        setDraggingFile([...items].find((item) => item.kind == 'file') != null);
      } else if (files) {  
        setDraggingFile(files.length > 0);
      }
    };

    document.ondragleave = () => { setDraggingFile(false); };

    document.onkeydown = (event) => {
      switch (event.key) {
        case 'a':
          setShowDropdown(false);
          setShowMainMenu(false);
          setShowHelpModal(false);
          setShowAddMovieModal(true);
          break; 
        case 'c':
          closeAll();
          break;
        case 'h':
          setShowDropdown(false);
          setShowMainMenu(false);
          setShowAddMovieModal(false);
          setShowHelpModal(true); 
          break;
        case 'm':
          setShowDropdown(false);
          setShowAddMovieModal(false);
          setShowHelpModal(false);
          setShowMainMenu(true);
          break; 
        case 'p':
          setShowDropdown(false);
          setShowMainMenu(false);
          setShowHelpModal(false);
          setShowAddMovieModal(false);
          openPlayModal(featuredMovie);
          break; 
      }
    };

    fetch('https://api.themoviedb.org/3/movie/now_playing?api_key=6f26fd536dd6192ec8a57e94141f8b20')
      .then((response) => response.json())
      .then((json) => {
        const movie = json['results'][0];

        document.body.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${movie['backdrop_path']})`;

        setFeaturedMovie(movie);
      });

    fetch('https://api.themoviedb.org/3/movie/popular?api_key=6f26fd536dd6192ec8a57e94141f8b20')
      .then((response) => response.json())
      .then((json) => {
        const movies = json['results'];

        setPopularMovies(movies);
      });

  }, []);

  const openPlayModal = (movie: MovieProps | null) => {
    if (!movie) { return; }

    fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=6f26fd536dd6192ec8a57e94141f8b20`)
      .then((response) => response.json())
      .then((json) => {
        const video = json['results'].find((video: VideoProps) => video.type == 'Trailer' && video.site == 'YouTube');

        if (video) {
          setCurrentVideo(video);
        }
      });
  };

  return (
    <>
      <Head>
        <title>LITEFLIX</title>
        <meta name="description" content="LITEFLIX APP" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar>
        <NavBarTitle>
          <Link href="/">
            <Logo />
          </Link>
        </NavBarTitle>  
        <NavBarItem>
          <Link href="#" onClick={() => setShowAddMovieModal(true)}>
            <Plus>
              <PlusIcon />
            </Plus>
            AGREGAR PELÍCULA
          </Link>
        </NavBarItem>
        <NavBarRight>
          <NavBarItem>
            <Link href="#" onClick={() => setShowMainMenu(true)}>
              <MenuIcon />
            </Link>
          </NavBarItem>
          <NavBarItemNotifications />
          <NavBarItemUser />
        </NavBarRight>
      </NavBar>
      <Content>
        <Featured> 
          <FeaturedTitle>{featuredMovie?.title}</FeaturedTitle>
          <FeaturedButtons>
            <PlayButton onClick={() => openPlayModal(featuredMovie)}><Plus><PlayIcon /></Plus> REPRODUCIR</PlayButton>
            <AddToListButton><Plus><PlusIcon /></Plus> MI LISTA</AddToListButton>
          </FeaturedButtons>
        </Featured>
        <Popular>
          <Dropdown>
            <DropdownTitle ref={dropdownRef} onClick={() => setShowDropdown(!showDropdown)}>
              VER: POPULARES
              <Arrow>
                <ArrowDownIcon />
              </Arrow>
            </DropdownTitle>
            <DropdownMenu className={showDropdown ? 'active' : ''}>
              <DropdownItem>
                POPULARES
                <Check>
                  <CheckIcon />
                </Check>
              </DropdownItem>
              <DropdownItem>MIS PELÍCULAS</DropdownItem>
            </DropdownMenu>
          </Dropdown>

          {popularMovies?.slice(0, 4).map((movie) => (
            <MovieCard key={movie.id} backgroundImage={`https://image.tmdb.org/t/p/w500/${movie.backdrop_path}`}>
              <MovieCardCircle className='unselected'>
                <PlayCircleIcon />
              </MovieCardCircle>
              <MovieCardTitle className='unselected'>{movie.title}</MovieCardTitle>
              <MovieCardOverlay>
                <SmallPlayCircleIcon />
                <MovieCardTitle className='selected'>{movie.title}</MovieCardTitle>
              </MovieCardOverlay>
            </MovieCard>
          ))}
        </Popular>
      </Content>
      <MainMenu show={showMainMenu} onClose={() => setShowMainMenu(false)} />
      <Modal show={showAddMovieModal} onClose={() => setShowAddMovieModal(false)} title="AGREGAR PELÍCULA">
        <Form>
          <Dropzone dragging={draggingFile}>
            <Clip>
              <ClipIcon />
            </Clip>
            AGREGÁ UN ARCHIVO O ARRASTRALO Y SOLTALO AQUÍ
            <input type="file" />
          </Dropzone>
          <label>
            <input type="text" placeholder='TÍTULO' />
          </label>
          <input type="submit" value="SUBIR PELÍCULA" />
        </Form>
      </Modal>
      <Modal show={showHelpModal} onClose={() => setShowHelpModal(false)} title="AYUDA">
        <p>Atajos de teclado:</p>
        <p> A: AGREGAR PELÍCULA</p>
        <p> C: CERRAR DIALOGOS Y MENÚS</p>
        <p> H: AYUDA</p>
        <p> M: MENÚ PRINCIPAL</p>
        <p> P: REPRODUCIR</p>
      </Modal>
      <Modal show={currentVideo !== null} onClose={() => setCurrentVideo(null)} title="REPRODUCIR">
        <PlayDescription>
          NO TENGO LOS DERECHOS DE TRANSMISIÓN &#128546;
        </PlayDescription>
        <PlayDescription>
          TENDRÁS QUE CONFORMARTE CON UN TRAILER &#128517;
        </PlayDescription>
        <PlayIframe src={`https://www.youtube.com/embed/${currentVideo?.key}?autoplay=1`}>
        </PlayIframe> 
      </Modal>
    </>
  )
}
