import { Movie } from "@/utils/interfaces";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { ArrowDownIcon, CheckIcon, PlayCircleIcon, SmallPlayCircleIcon, StarIcon } from "./icons";

export const MY_MOVIES_QUERY = gql`
  query MyMoviesQuery {
    myMovies {
      id
      title
      imageBase64
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

const MovieCardYear = styled.div`
  flex-grow: 1;
  font-size: 14px;
  letter-spacing: 2px;
  text-align: right;
`;

const MoviesCardList = styled.div`
  opacity: 0;
  position: absolute;
  transition: visibility 0s 0.3s, opacity 0.3s;
  visibility: hidden;

  &.visible {
    opacity: 1;
    transition: visibility 0s, opacity 0.3s;
    visibility: visible;
  }
`;

const MoviesSidebarWrapper = styled.div`
  flex-shrink: 0;
  height: 700px;
  position: relative;
  text-align: right;
  width: 220px;
`;

interface MoviesSidebarProps {
  onClickMovie: (movie?: Movie) => void;
  enableKeybinding: boolean;
}

const MoviesSidebar = (props: MoviesSidebarProps) => {
  const [currentCard, setCurrentCard] = useState<number>(-1);
  const [currentOption, setCurrentOption] = useState<0 | 1>(0);
  const dropdownRef = useRef(null);
  const [popularMovies, setPopularMovies] = useState<Movie[] | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const { data, refetch } = useQuery(MY_MOVIES_QUERY);

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
      } else if (key == 'Enter' && popularMovies && currentCard > -1 && currentCard < 4) {
        props.onClickMovie(currentCard == 0 ? popularMovies[currentCard] : data?.myMovies[currentCard]);
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
  }, [currentCard, popularMovies, props.enableKeybinding]);

  useEffect(() => {
    fetch('https://api.themoviedb.org/3/movie/popular?api_key=6f26fd536dd6192ec8a57e94141f8b20')
      .then((response) => response.json())
      .then((json) => {
        const movies = json['results'];

        setPopularMovies(movies);
      });

    if (currentOption == 1) {
      refetch();
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
            <MovieCardCircle className='selected' onClick={() => props.onClickMovie(movie)}>
              <SmallPlayCircleIcon />
            </MovieCardCircle>
            <MovieCardTitle className='selected'>{movie.title}</MovieCardTitle>
            <MovieCardRating>
              <StarIcon />
              {movie.vote_average}
            </MovieCardRating>
            <MovieCardYear>
              {movie.release_date?.split('-')[0]}
            </MovieCardYear>
          </MovieCardOverlay>
        </MovieCard>
      ))}
    </MoviesCardList>
    <MoviesCardList className={currentOption == 1 ? 'visible' : ''}>
      {data?.myMovies?.slice(0, 4).map((movie: any, index: number) => (
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
            <MovieCardCircle className='selected' onClick={() => props.onClickMovie(movie)}>
              <SmallPlayCircleIcon />
            </MovieCardCircle>
            <MovieCardTitle className='selected'>{movie.title}</MovieCardTitle>
          </MovieCardOverlay>
        </MovieCard>
      ))}
    </MoviesCardList>
  </MoviesSidebarWrapper>
  );
}

export default MoviesSidebar;
