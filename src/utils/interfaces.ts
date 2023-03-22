export interface MovieType {
  id: number;
  title: string;
  backdropPath: string;
  releaseYear: number;
  voteAverage: number;
  youTubeTrailerKey: string;
}

export interface MyMovieType {
  id: string;
  title: string;
  imageBase64: string;
  youTubeTrailerKey: string;
}
