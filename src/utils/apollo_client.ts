import { useMemo } from 'react';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { SchemaLink } from '@apollo/client/link/schema';
import { schema } from '../pages/api/graphql';
import merge from 'deepmerge';
import randomstring from 'randomstring';

let apolloClient : ApolloClient<any>;

function createIsomorphLink() {
  if (typeof window === 'undefined') {
    return new SchemaLink({ schema })
  } else {
    let userToken = window.localStorage.getItem('userToken');

    if (!userToken) {
      window.localStorage.setItem('userToken', randomstring.generate());

      userToken = window.localStorage.getItem('userToken');
    }

    return new HttpLink({
      uri: '/api/graphql',
      credentials: 'same-origin',
      headers: { 'Authorization': `Bearer ${userToken}` }
    })
  }
}

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: createIsomorphLink(),
    cache: new InMemoryCache(),
  })
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient()

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract()

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = merge(initialState, existingCache);

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data)
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}

export function useApollo(initialState: any) {
  const store = useMemo(() => initializeApollo(initialState), [initialState])
  return store
}
