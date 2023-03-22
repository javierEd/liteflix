import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { gql } from 'graphql-tag';

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

  type MyMovie {
    id: String!
    title: String!
    imageBase64: String!
  }

  type Mutation {
    addMyMovie(attributes: MyMovieInputObject!): MyMovieMutationObject!
  }

  type Query {
    myMovies: [MyMovie!]!
    myMovie(id: ID!): MyMovie
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

interface MyMovieQueryArgs {
  id: string;
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
    async myMovies(_parent: any, _args: any, contextValue: ContextValue) {
      const result = await contextValue.supabase.from('my_movies').select('*').eq('user_token', contextValue.token)
        .order('created_at', { ascending: false });

      return result.data?.map((movie) => ({ id: movie.id, title: movie.title, imageBase64: movie.image_base64 }));
    },
    async myMovie(_parent: any, args: MyMovieQueryArgs, contextValue: ContextValue) {
      const result = await contextValue.supabase?.from('my_movies').select('*').eq('user_token', contextValue.token)
        .eq('id', args.id).single();
      const movie = result.data;

      if (!movie) {
        return undefined;
      }

      return { id: movie.id, title: movie.title, imageBase64: movie.image_base64 };
    },
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
