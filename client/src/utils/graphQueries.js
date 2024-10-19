// src/utils/graphQueries.js
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const GRAPH_API_URL = 'YOUR_SUBGRAPH_URL';

export const client = new ApolloClient({
  uri: GRAPH_API_URL,
  cache: new InMemoryCache(),
});

export const GET_USER_DATA = gql`
  query GetUserData($userAddress: ID!) {
    user(id: $userAddress) {
      id
      totalStaked
      currentStake
      totalRewardsClaimed
      lastUpdateTime
      stakes(orderBy: timestamp, orderDirection: desc) {
        id
        amount
        timestamp
        action
      }
      rewards(orderBy: timestamp, orderDirection: desc) {
        id
        amount
        timestamp
      }
    }
  }
`;

export const GET_GLOBAL_STATS = gql`
  query GetGlobalStats {
    globalStat(id: "global") {
      totalStaked
      totalRewardsPaid
      totalUsers
      lastUpdateTime
    }
  }
`;

// Example hook for user data
export function useUserData(userAddress) {
  const { loading, error, data, refetch } = useQuery(GET_USER_DATA, {
    variables: { userAddress: userAddress?.toLowerCase() },
    pollInterval: 5000, // Poll every 5 seconds
  });

  return {
    loading,
    error,
    userData: data?.user,
    refetch,
  };
}

// Example hook for global stats
export function useGlobalStats() {
  const { loading, error, data, refetch } = useQuery(GET_GLOBAL_STATS, {
    pollInterval: 5000,
  });

  return {
    loading,
    error,
    stats: data?.globalStat,
    refetch,
  };
}