import Head from 'next/head';
import styled from 'styled-components';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

import MainMenu from '@/components/main_menu';
import { MenuIcon, PlayIcon, PlusIcon } from '@/components/icons';
import Logo from '@/components/logo';
import { NavBar, NavBarItem, NavBarItemBell, NavBarItemUser, NavBarRight, NavBarTitle } from '@/components/nav_bar';
import HelpModal from '@/components/help_modal';
import PlayMovieModal from '@/components/play_movie_modal';
import AddMovieModal from '@/components/add_movie_modal';
import MoviesSidebar from '@/components/movies_sidebar';
import { classNameVisible, maxMobileWidth } from '@/components/globalstyles';
import { MovieType } from '@/utils/interfaces';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';

export const FEATURED_MOVIE_QUERY = gql`
  query FeatureMovieQuery {
    featuredMovie {
      id
      title
      backdropPath
      youTubeTrailerKey
    }
  }
`;

const BackgroundOverlay = styled.div`
  background-color: rgba(0, 0, 0, 0.33);
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  z-index: -1;

  @media (max-width: ${maxMobileWidth}) {
    background: linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(36,36,36,1) 620px);
  }
`;

const Content = styled.div`
  display: flex;
  min-height: calc(100vh - 164px);

  @media (max-width: ${maxMobileWidth}) {
    display: block;
    margin-top: 214px;
  }
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

  @media (max-width: ${maxMobileWidth}) {
    font-size: 76px;
    text-align: center;
  }
`;

const FeaturedButtons = styled.div`
  display: flex;

  @media (max-width: ${maxMobileWidth}) {
    display: block;
  }
`;

const FeaturedOriginal = styled.div`
  font-size: 20px;

  > svg {
    height: 18px;
    width: 90px;
  }

  @media (max-width: ${maxMobileWidth}) {
    text-align: center;
  }
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

  @media (max-width: ${maxMobileWidth}) {
    margin: 0 auto 16px;
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

  @media (max-width: ${maxMobileWidth}) {
    margin: 0 auto 16px;
  }
`;

const Plus = styled.span`
  margin-right: 12px;
`;

export default function Home() {
  const [currentComponent, setCurrentComponent] = useState<'a' | 'h' | 'm' | undefined>(undefined);
  const [currentMovie, setCurrentMovie] = useState<MovieType | undefined>(undefined);
  const [hideSplash, setHideSplash] = useState(false);
  const featuredMovieQuery = useQuery(FEATURED_MOVIE_QUERY);

  const onKeyDown = (event: any) => {
    const key = event.key.toLowerCase();

    if (typeof currentComponent === 'undefined' && typeof currentMovie === 'undefined') {
      if (['a', 'h', 'm'].includes(key)) {
        setCurrentComponent(key as 'a' | 'h' | 'm');
      } else if (key == 'p') {
        openPlayModal(featuredMovieQuery.data.featuredMovie);
      }
    } else if (key == 'escape') {
      setCurrentComponent(undefined);
      setCurrentMovie(undefined);
    }
  };

  useEffect(() => {
    if (typeof featuredMovieQuery.data !== 'undefined') {
      document.body.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${featuredMovieQuery.data.featuredMovie.backdropPath})`;
      setHideSplash(true);
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [currentComponent, currentMovie, featuredMovieQuery]);

  const openPlayModal = (movie?: MovieType) => {
    if (typeof movie === 'undefined') { return; }

    setCurrentComponent(undefined);
    setCurrentMovie(movie);
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
        <NavBarTitle className="hidden-mobile">
          <Link href="/">
            <Logo />
          </Link>
        </NavBarTitle>
        <NavBarItem onClick={() => setCurrentComponent('a')} className="hidden-mobile">
          <Plus>
            <PlusIcon />
          </Plus>
          AGREGAR PELÍCULA
        </NavBarItem>
        <NavBarRight>
          <NavBarItem onClick={() => setCurrentComponent('m')}>
            <MenuIcon />
          </NavBarItem>
          <NavBarTitle className="hidden-desktop">
            <Link href="/">
              <Logo />
            </Link>
          </NavBarTitle>
          <NavBarItemBell />
          <NavBarItemUser />
        </NavBarRight>
      </NavBar>
      <Content>
        <Featured>
          <FeaturedOriginal>ORIGINAL DE <Logo /></FeaturedOriginal>
          <FeaturedTitle>{featuredMovieQuery.data?.featuredMovie.title}</FeaturedTitle>
          <FeaturedButtons>
            <PlayButton onClick={() => openPlayModal(featuredMovieQuery.data?.featuredMovie)}><Plus><PlayIcon /></Plus> REPRODUCIR</PlayButton>
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
        show={typeof currentMovie !== 'undefined'}
        onClose={() => setCurrentMovie(undefined)} movie={currentMovie}
      />
      <div className={`splash ${classNameVisible(!hideSplash)}`}>
        <Logo />
      </div>
      <BackgroundOverlay />
    </>
  )
}
