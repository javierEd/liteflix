import { MovieType } from "@/utils/interfaces";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { maxMobileWidth } from "./globalstyles";
import { ArrowDownIcon, CheckIcon, PlayCircleIcon, SmallPlayCircleIcon, StarIcon } from "./icons";

export const MY_MOVIES_QUERY = gql`
  query MyMoviesQuery {
    myMovies {
      id
      title
      imageBase64
      youTubeTrailerKey
    }
  }
`;

export const POPULAR_MOVIES_QUERY = gql`
  query PopularMoviesQuery {
    popularMovies {
      id
      title
      backdropPath
      releaseYear
      voteAverage
      youTubeTrailerKey
    }
  }
`;

const Arrow = styled.span`
  margin-left: 11px;
`;

interface CheckProps {
  show: boolean;
}

const Check = styled.div<CheckProps>`
  float: right;
  visibility: hidden;

  ${props => props.show && css`
    visibility: visible;
  `}
`;

const Dropdown = styled.div`
  margin-bottom: 24px;
  position: relative;
`;

const DropdownItem = styled.div`
  cursor: pointer;
  padding: 8px 16px;

  &:hover {
    background-color: #363636;
  }
`;

const DropdownMenu = styled.div`
  background-color: #242424;
  opacity: 0;
  padding: 16px 8px;
  position: absolute;
  right: 0;
  text-align: left;
  top: 36px;
  transition: visibility 0s 0.3s, opacity 0.3s;
  visibility: hidden;
  width: 241px;
  z-index: 10;

  @media (max-width: ${maxMobileWidth}) {
    box-shadow: 0 0 1px 1px rgba(0,0,0,0.5);
    width: 100%;
  }

  &:before {
    content:'';
    position: absolute;
    width: 0;
    height: 0;
    margin-left: 191px;
    margin-top: -24px;
    border-bottom: solid 12px #242424;
    border-left: solid 12px transparent;
    border-right: solid 12px transparent;

    @media (max-width: ${maxMobileWidth}) {
      display: none;
    }
  }

  &.active {
    opacity: 1;
    transition: visibility 0s, opacity 0.3s;
    visibility: visible;
  }
`;

const DropdownTitle = styled.div`
  cursor: pointer;
  margin-right: 24px;
`;

interface MovieCardProps {
  backgroundImage: string;
}

const MovieCard = styled.div<MovieCardProps>`
  cursor: pointer;
  height: 146px;
  width: 220px;
  background-image: url(${(props) => props.backgroundImage});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 4px;
  margin: 20px auto;
  position: relative;

  &:hover > .unselected, &.active > .unselected {
    opacity: 0;
    visibility: hidden;
  }

  @media (max-width: ${maxMobileWidth}) {
    height: 172px;
    width: 100%;
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

const MovieCardOverlay = styled.div`
  justify-content: end;
  border-radius: 4px;
  background: rgba(36, 36, 36, 0.7);
  display: flex;
  flex-direction: column;
  height: 100%;
  opacity: 0;
  padding: 16px;
  transition: opacity 0.3s;
  width: 100%;

  &:hover, &.active {
    opacity: 1;
  }

  > div {
    display: flex;
  }
`;

const MovieCardRating = styled.div`
    font-size: 14px;
    letter-spacing: 2px;

  > svg {
    margin-right: 6px;
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
  }
`;

const MovieCardYear = styled.div`
  flex-grow: 1;
  font-size: 14px;
  letter-spacing: 2px;
  text-align: right;
`;

const MoviesCardList = styled.div`
  grid-row-start: 2;
  grid-column-start: 1;
  opacity: 0;
  transition: visibility 0s 0.3s, opacity 0.3s;
  visibility: hidden;
  width: 100%;

  &.visible {
    opacity: 1;
    transition: visibility 0s, opacity 0.3s;
    visibility: visible;
  }
`;

const MoviesSidebarWrapper = styled.div`
  align-content: start;
  display: grid;
  flex-shrink: 0;
  text-align: right;
  width: 220px;

  @media (max-width: ${maxMobileWidth}) {
    margin: auto;
    max-width: 330px;
    width: 100%;
  }
`;

interface MoviesSidebarProps {
  onClickMovie: (movie?: MovieType) => void;
  enableKeybinding: boolean;
}

const MoviesSidebar = (props: MoviesSidebarProps) => {
  const [currentCard, setCurrentCard] = useState<number>(-1);
  const [currentOption, setCurrentOption] = useState<0 | 1>(0);
  const dropdownRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const myMoviesQuery = useQuery(MY_MOVIES_QUERY);
  const popularMoviesQuery = useQuery(POPULAR_MOVIES_QUERY);

  const onKeyDown = (event: any) => {
    const key = event.key;

    if (props.enableKeybinding) {
      if (key == 'ArrowDown') {
        let newCurrentCard = currentCard + 1;

        if (newCurrentCard > 3) {
          newCurrentCard = 3;
        }

        setCurrentCard(newCurrentCard);
      } else if (key == 'ArrowUp' && currentCard > 0) {
        let newCurrentCard = currentCard - 1;

        if (newCurrentCard < 0) {
          newCurrentCard = 0;
        }

        setCurrentCard(newCurrentCard);
      } else if (key == 'Enter' && currentCard > -1 && currentCard < 4) {
        props.onClickMovie(currentOption == 0 ? popularMoviesQuery.data.popularMovies[currentCard] : myMoviesQuery.data.myMovies[currentCard]);
      } else if (key == 'Escape') {
        setCurrentCard(-1);
      }
    } else {
      setShowDropdown(false);
      setCurrentCard(-1);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [currentCard, popularMoviesQuery, myMoviesQuery, props.enableKeybinding]);

  useEffect(() => {
    if (currentOption == 0) {
      popularMoviesQuery.refetch();
    } else {
      myMoviesQuery.refetch();
    }
  }, [currentOption]);

  const openDropdown = () => {
      if (!showDropdown) {
        setShowDropdown(true);
        setTimeout(() => document.addEventListener('click', () => setShowDropdown(false), { once: true }), 300);
    }
  };

  return (
  <MoviesSidebarWrapper onKeyDown={onKeyDown}>
    <Dropdown>
      <DropdownTitle ref={dropdownRef} onClick={openDropdown}>
        VER: { currentOption == 0 ? 'POPULARES' : 'MIS PELÍCULAS'}
        <Arrow>
          <ArrowDownIcon />
        </Arrow>
      </DropdownTitle>
      <DropdownMenu className={showDropdown ? 'active' : ''}>
        <DropdownItem onClick={() => setCurrentOption(0)}>
          POPULARES
          <Check show={currentOption == 0}>
            <CheckIcon />
          </Check>
        </DropdownItem>
        <DropdownItem onClick={() => setCurrentOption(1)}>
          MIS PELÍCULAS
          <Check show={currentOption == 1}>
            <CheckIcon />
          </Check>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <MoviesCardList className={currentOption == 0 ? 'visible' : ''}>
      {popularMoviesQuery.data?.popularMovies.map((movie: MovieType, index: number) => (
        <MovieCard
          key={movie.id}
          backgroundImage={`https://image.tmdb.org/t/p/w500/${movie.backdropPath}`}
          className={currentCard == index ? 'active': ''}
        >
          <MovieCardCircle className='unselected'>
            <PlayCircleIcon />
          </MovieCardCircle>
          <MovieCardTitle className='unselected'>{movie.title}</MovieCardTitle>
          <MovieCardOverlay className={currentCard == index ? 'active': ''}>
            <div>
              <MovieCardCircle className='selected' onClick={() => props.onClickMovie(movie)}>
                <SmallPlayCircleIcon />
              </MovieCardCircle>
              <MovieCardTitle className='selected'>{movie.title}</MovieCardTitle>
            </div>
            <div>
              <MovieCardRating>
                <StarIcon />
                {movie.voteAverage}
              </MovieCardRating>
              <MovieCardYear>
                {movie.releaseYear}
              </MovieCardYear>
            </div>
          </MovieCardOverlay>
        </MovieCard>
      ))}
    </MoviesCardList>
    <MoviesCardList className={currentOption == 1 ? 'visible' : ''}>
      {myMoviesQuery.data?.myMovies.map((movie: any, index: number) => (
        <MovieCard
          key={movie.id}
          backgroundImage={movie.imageBase64}
          className={currentCard == index ? 'active': ''}
        >
          <MovieCardCircle className='unselected'>
            <PlayCircleIcon />
          </MovieCardCircle>
          <MovieCardTitle className='unselected'>{movie.title}</MovieCardTitle>
          <MovieCardOverlay className={currentCard == index ? 'active': ''}>
            <div>
              <MovieCardCircle className='selected' onClick={() => props.onClickMovie(movie)}>
                <SmallPlayCircleIcon />
              </MovieCardCircle>
              <MovieCardTitle className='selected'>{movie.title}</MovieCardTitle>
            </div>
          </MovieCardOverlay>
        </MovieCard>
      ))}
    </MoviesCardList>
  </MoviesSidebarWrapper>
  );
}

export default MoviesSidebar;
