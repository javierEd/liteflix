import Head from 'next/head';
import styled from 'styled-components';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

import MainMenu from '@/components/main_menu';
import { MenuIcon, PlayIcon, PlusIcon } from '@/components/icons';
import Logo from '@/components/logo';
import { NavBar, NavBarItem, NavBarItemNotifications, NavBarItemUser, NavBarRight } from '@/components/nav_bar';
import HelpModal from '@/components/help_modal';
import PlayMovieModal, { VideoProps } from '@/components/play_movie_modal';
import AddMovieModal from '@/components/add_movie_modal';
import MoviesSidebar from '@/components/movies_sidebar';
import { classNameVisible } from '@/components/globalstyles';
import { Movie } from '@/utils/interfaces';

const Content = styled.div`
  display: flex;
  min-height: calc(100vh - 164px);
`;

const Featured = styled.div`
  flex-grow: 1;
  align-self: end;
  margin-bottom: 100px;
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
  background-color: #242424;
  cursor: pointer;
  font-size: 18px;
  height: 56px;
  margin-right: 24px;
  padding: 18px;
  text-align: center;
  width: 248px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #363636;
  }
`;

const AddToListButton = styled.div`
  background: rgba(36, 36, 36, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.5);
  cursor: pointer;
  height: 56px;
  padding: 18px;
  text-align: center;
  width: 248px;
  transition: background 0.3s;

  &:hover {
    background: rgba(66, 66, 66, 0.5);
  }
`;

const NavBarTitle = styled.div`
  margin: auto 32px;
`;

const Plus = styled.span`
  margin-right: 12px;
`;

export default function Home() {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | undefined>(undefined);
  const [currentComponent, setCurrentComponent] = useState<'a' | 'h' | 'm' | undefined>(undefined);
  const [currentVideo, setCurrentVideo] = useState<VideoProps | undefined>(undefined);
  const [hideSplash, setHideSplash] = useState(false);

  const onKeyDown = (event: any) => {
    const key = event.key.toLowerCase();

    if (typeof currentComponent === 'undefined' && typeof currentVideo === 'undefined') {
      if (['a', 'h', 'm'].includes(key)) {
        setCurrentComponent(key as 'a' | 'h' | 'm');
      } else if (key == 'p') {
        openPlayModal(featuredMovie);
      }
    } else if (key == 'escape') {
      setCurrentComponent(undefined);
      setCurrentVideo(undefined);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [currentComponent, currentVideo, featuredMovie]);

  useEffect(() => {
    fetch('https://api.themoviedb.org/3/movie/now_playing?api_key=6f26fd536dd6192ec8a57e94141f8b20')
      .then((response) => response.json())
      .then((json) => {
        const movie = json['results'][0];

        document.body.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${movie['backdrop_path']})`;

        setFeaturedMovie(movie);
      });

    setHideSplash(true);
  }, []);

  const openPlayModal = (movie?: Movie) => {
    if (typeof movie === 'undefined') { return; }

    setCurrentComponent(undefined);

    if (typeof movie.backdrop_path !== 'undefined') {
      fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=6f26fd536dd6192ec8a57e94141f8b20`)
        .then((response) => response.json())
        .then((json) => {
          const video = json['results'].find((video: VideoProps) => video.type == 'Trailer' && video.site == 'YouTube');

          setCurrentVideo(video || { key: 'oU9F6J1lafY', site: 'YouTube', type: 'Video' });
        });
    } else {
      setCurrentVideo({ key: 'oU9F6J1lafY', site: 'YouTube', type: 'Video' });
    }
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
        <MoviesSidebar enableKeybinding={!currentComponent} onClickMovie={openPlayModal}/>
      </Content>
      <MainMenu
        show={currentComponent == 'm'}
        onClose={() => setCurrentComponent(undefined)}
        onClickAddMovie={() => setCurrentComponent('a')}
      />
      <AddMovieModal show={currentComponent == 'a'} onClose={() => setCurrentComponent(undefined)} />
      <HelpModal show={currentComponent == 'h'} onClose={() => setCurrentComponent(undefined)} />
      <PlayMovieModal
        show={typeof currentVideo !== 'undefined'}
        onClose={() => setCurrentVideo(undefined)} video={currentVideo}
      />
      <div className={`splash ${classNameVisible(!hideSplash)}`}>
        <Logo />
      </div>
    </>
  )
}
