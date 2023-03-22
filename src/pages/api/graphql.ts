import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { gql } from 'graphql-tag';
import { MovieType, MyMovieType } from '@/utils/interfaces';

const typeDefs = gql`
  input MyMovieInputObject {
    title: String!
    imageBase64: String!
  }

  type MyMovieMutationObject {
    success: Boolean!
    message: String!
    resource: MyMovie
  }

  type Movie {
    id: String!
    title: String!
    backdropPath: String!
    releaseYear: Int!
    voteAverage: Float!
    youTubeTrailerKey: String!
  }

  type MyMovie {
    id: String!
    title: String!
    imageBase64: String!
    youTubeTrailerKey: String!
  }

  type Mutation {
    addMyMovie(attributes: MyMovieInputObject!): MyMovieMutationObject!
  }

  type Query {
    featuredMovie: Movie
    myMovies: [MyMovie!]!
    popularMovies: [Movie!]!
  }
`;

interface ContextValue {
  supabase: SupabaseClient;
  token?: string;
}

interface MutationAttributes<T> {
  attributes: T;
}

interface MyMovieInputObject {
  title: string;
  imageBase64: string;
}

interface MyMovie {
  id: string;
  title: string;
  image_base64: string;
}

interface TMDBMovie {
  id: number;
  title: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
}

interface TMDBVideo {
  key: string;
  site: string;
  type: string;
}

const toMovieType = async (movie: TMDBMovie) : Promise<MovieType> => {
  const videos = await (await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${process.env.TMDB_KEY}`)).json();
  const video = videos.results.find((video: TMDBVideo) => video.type == 'Trailer' && video.site == 'YouTube');

  return {
    id: movie.id,
    title: movie.title,
    backdropPath: movie.backdrop_path,
    releaseYear: parseInt(movie.release_date.split('-')[0]),
    voteAverage: movie.vote_average,
    youTubeTrailerKey: video?.key || 'oU9F6J1lafY',
  };
}

const resolvers = {
  Mutation: {
    async addMyMovie(_parent: any, args: MutationAttributes<MyMovieInputObject>, contextValue: ContextValue) {
      const title = args.attributes.title.trim();
      const image_base64 = args.attributes.imageBase64.trim();

      if (title.length == 0) {
        return { success: false, message: 'Debes escribir un título' };
      }

      if (title.length > 255) {
        return { success: false, message: 'El título es demasiado largo' };
      }

      if (image_base64.length == 0) {
        return { success: false, message: 'Debes seleccionar una imagen' };
      }

      const result = await contextValue.supabase.from('my_movies')
        .insert({ user_token: contextValue.token, title, image_base64 }).select().single();

      if (result.data) {
        return { success: true, message: 'Película agregada exitosamente', resource: result.data };
      }

      return { success: false, message: 'No se pudo agregar la película' };
    }
  },
  Query: {
    async featuredMovie(_parent: any, _args: any, _contextValue: ContextValue) : Promise<MovieType> {
      const movies = await (await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.TMDB_KEY}`)).json();
      const movie = movies.results[0] as TMDBMovie;

      return await toMovieType(movie);
    },
    async myMovies(_parent: any, _args: any, contextValue: ContextValue) : Promise<MyMovieType[]> {
      const result = await contextValue.supabase?.from('my_movies').select('*').eq('user_token', contextValue.token)
        .order('created_at', { ascending: false}).limit(4);
      const myMovies = result.data as MyMovie[];

      return myMovies.map((movie) => ({
        id: movie.id, title: movie.title, imageBase64: movie.image_base64, youTubeTrailerKey: 'oU9F6J1lafY'
      }));
    },
    async popularMovies(_parent: any, _args: any, _contextValue: ContextValue): Promise<MovieType[]> {
      const movies = (await (await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_KEY}`)).json()).results as TMDBMovie[];

      return await Promise.all(movies.slice(0, 4).map(async (movie) => { return await toMovieType(movie) }));
    }
  },
}

export const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new ApolloServer({
  schema,
});

export default startServerAndCreateNextHandler(server, {
  context: async (req, _res) => {
    let supabase = undefined;
    let token = undefined;

    if (typeof window === 'undefined') {
      supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
    }

    const authorization = req.headers.authorization;

    if (authorization?.toLowerCase().startsWith('bearer ') && authorization.trim().length >= 19) {
      token = authorization!.substring(7).trim();
    }

    return { supabase, token };
  }
});
