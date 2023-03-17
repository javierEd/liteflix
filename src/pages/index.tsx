import Head from 'next/head';
import styled from 'styled-components';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react'

import MainMenu from '@/components/main_menu';
import { ArrowDownIcon, CheckIcon, MenuIcon, PlayCircleIcon, PlayIcon, PlusIcon, SmallPlayCircleIcon, StarIcon } from '@/components/icons';
import Logo from '@/components/logo';
import { NavBar, NavBarItem, NavBarItemNotifications, NavBarItemUser, NavBarRight } from '@/components/nav_bar';
import HelpModal from '@/components/help_modal';
import PlayMovieModal, { VideoProps } from '@/components/play_movie_modal';
import AddMovieModal from '@/components/add_movie_modal';

const Arrow = styled.span`
  margin-left: 11px;
`;

const Check = styled.div`
  float: right;
`;

const Content = styled.div`
  display: flex;
  margin: 64px 100px;
  min-height: calc(100vh - 200px);
`;

const Featured = styled.div`
  flex-grow: 9; 
  margin-bottom: 100px;
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

const NavBarTitle = styled.div`
  margin: auto 32px;
`;

const Plus = styled.span`
  margin-right: 12px;
`;

interface MovieCardProps {
  backgroundImage: string;
}

const MovieCard = styled.div<MovieCardProps>`
  cursor: pointer;
  height: 146px;
  width: 220px;
  background-image: url(${(props) => props.backgroundImage});
  background-size: cover;
  border-radius: 4px;
  margin: 20px auto;
  position: relative;

  &:hover > .unselected, &.active > .unselected {
    opacity: 0;
    visibility: hidden;
  }
`;

const MovieCardCircle = styled.div`
  &.unselected {
    height: 40px;
    width: 40px;
    margin: auto;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    transition: opacity 0.3s;
  }

  &.selected {
    align-self: center;
    margin: 0 12px 16px 0;
    width: 24px;

    > svg {
      circle {
        transition: all 0.3s;
      }

      path {
        transition: all 0.3s;
      }

      &:hover {
        circle {
          fill: #64EEBC;
          fill-opacity: 1;
          transition: all 0.3s;
        }

        path {
          stroke: #242424;
          fill: #242424;
          transition: all 0.3s;
        }
      }
    }
  }
`;

const MovieCardTitle = styled.div`
  font-size: 16px;

  &.unselected {
    text-align: center;
    position: absolute;
    bottom: 14px;
    left: 14px;
    right: 14px;
    transition: opacity 0.3s;
  }

  &.selected {
    align-self: center;
    margin-bottom: 18px;
    text-align: left;
    width: 152px;
  }
`;

const MovieCardOverlay = styled.div` 
  align-content: end;
  border-radius: 4px;
  background: rgba(36, 36, 36, 0.7);
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  opacity: 0;
  padding: 16px;
  transition: opacity 0.3s;
  width: 100%;

  &:hover, &.active {
    opacity: 1; 
  } 
`;

const MovieCardRating = styled.div`
    font-size: 14px;
    letter-spacing: 2px;

  > svg {
    margin-right: 6px;
  }
`;

const MovieCardYear = styled.div`
  flex-grow: 1;
  font-size: 14px;
  letter-spacing: 2px;
  text-align: right;
`;

interface MovieProps {
  id: number;
  title: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
}

export default function Home() {
  const [featuredMovie, setFeaturedMovie] = useState<MovieProps | null>(null);
  const [popularMovies, setPopularMovies] = useState<MovieProps[] | null>(null);
  const [currentComponent, setCurrentComponent] = useState<'a' | 'd' | 'h' | 'm' | 'p' | null>(null);
  const [currentCard, setCurrentCard] = useState<number>(-1);
  const [currentVideo, setCurrentVideo] = useState<VideoProps | null>(null);
  const [hideSplash, setHideSplash] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    if (currentComponent == 'd') {
      document.onclick = (event) => {
        if (dropdownRef.current != event.target) {
          setCurrentComponent(null);
        }
      };
    } else {
      document.onclick = null;
    }
  }, [currentComponent]);

  useEffect(() => {
    document.onkeydown = (event) => {
      const key = event.key.toLowerCase();

      if (currentComponent == null) {
        if (['a', 'h', 'm', 'p'].includes(key)) {
          setCurrentComponent(key as 'a' | 'h' | 'm' | 'p');
        } else if (key == 'p') {
          openPlayModal(featuredMovie);
        } else if (key == 'arrowdown' && currentCard < 3) {
          setCurrentCard(currentCard + 1);
        } else if (key == 'arrowup' && currentCard > 0) {
          setCurrentCard(currentCard - 1);
        } else if (key == 'enter' && popularMovies && currentCard > -1 && currentCard < 4) {
          openPlayModal(popularMovies[currentCard])
        } else if (key == 'escape') {
          setCurrentCard(-1);
        }
      } else if (key == 'escape') {
        setCurrentComponent(null);
        setCurrentVideo(null);
      }
 
      console.log(event.key);
    };

    if (currentComponent != null) {
      setCurrentCard(-1);
    }
  }, [currentCard, currentComponent, featuredMovie, popularMovies]);

  useEffect(() => {
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

    setHideSplash(true);
  }, []);

  const openPlayModal = (movie: MovieProps | null) => {
    if (!movie) { return; }

    fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=6f26fd536dd6192ec8a57e94141f8b20`)
      .then((response) => response.json())
      .then((json) => {
        const video = json['results'].find((video: VideoProps) => video.type == 'Trailer' && video.site == 'YouTube');

        if (video) {
          setCurrentVideo(video);
          setCurrentComponent('p');
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
        <NavBarItem onClick={() => setCurrentComponent('a')}>
          <Plus>
            <PlusIcon />
          </Plus>
          AGREGAR PELÍCULA
        </NavBarItem>
        <NavBarRight>
          <NavBarItem onClick={() => setCurrentComponent('m')}>
            <MenuIcon />
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
            <DropdownTitle ref={dropdownRef} onClick={() => setCurrentComponent(currentComponent != 'd' ? 'd' : null)}>
              VER: POPULARES
              <Arrow>
                <ArrowDownIcon />
              </Arrow>
            </DropdownTitle>
            <DropdownMenu className={currentComponent == 'd' ? 'active' : ''}>
              <DropdownItem>
                POPULARES
                <Check>
                  <CheckIcon />
                </Check>
              </DropdownItem>
              <DropdownItem>MIS PELÍCULAS</DropdownItem>
            </DropdownMenu>
          </Dropdown>

          {popularMovies?.slice(0, 4).map((movie, index) => (
            <MovieCard
              key={movie.id}
              backgroundImage={`https://image.tmdb.org/t/p/w500/${movie.backdrop_path}`}
              className={currentCard == index ? 'active': ''}
            >
              <MovieCardCircle className='unselected'>
                <PlayCircleIcon />
              </MovieCardCircle>
              <MovieCardTitle className='unselected'>{movie.title}</MovieCardTitle>
              <MovieCardOverlay className={currentCard == index ? 'active': ''}>
                <MovieCardCircle className='selected' onClick={() => openPlayModal(movie)}>
                  <SmallPlayCircleIcon />
                </MovieCardCircle>
                <MovieCardTitle className='selected'>{movie.title}</MovieCardTitle>
                <MovieCardRating>
                  <StarIcon />
                  {movie.vote_average}
                </MovieCardRating>
                <MovieCardYear>
                  {movie.release_date.split('-')[0]}
                </MovieCardYear>
              </MovieCardOverlay>
            </MovieCard>
          ))}
        </Popular>
      </Content>
      <MainMenu
        show={currentComponent == 'm'}
        onClose={() => setCurrentComponent(null)}
        onClickAddMovie={() => setCurrentComponent('a')}
      />
      <AddMovieModal show={currentComponent == 'a'} onClose={() => setCurrentComponent(null)} />
      <HelpModal show={currentComponent == 'h'} onClose={() => setCurrentComponent(null)} />
      <PlayMovieModal
        show={currentComponent == 'p' && currentVideo != null}
        onClose={() => { setCurrentComponent(null); setCurrentVideo(null); }} video={currentVideo}
      />
      <div className={`splash ${hideSplash ? 'hidden' : '' }`}>
        <Logo />
      </div>
    </>
  )
}
