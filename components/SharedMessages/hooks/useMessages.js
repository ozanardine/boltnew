import { useInfiniteQuery, useMutation, useQueryClient } from 'react-query';
import { getAllResponses, getUserResponses, getFavoriteResponses } from '../../../utils/supabase/sharedResponsesQueries';

const PAGE_SIZE = 10;

export function useMessages(userId, type = 'all', filters = {}) {
  const queryClient = useQueryClient();

  const fetchMessages = async ({ pageParam = 0 }) => {
    const fetchFunction = {
      all: getAllResponses,
      user: getUserResponses,
      favorites: getFavoriteResponses
    }[type];

    const response = await fetchFunction(userId, {
      ...filters,
      offset: pageParam * PAGE_SIZE,
      limit: PAGE_SIZE
    });

    return {
      messages: response,
      nextPage: response.length === PAGE_SIZE ? pageParam + 1 : undefined
    };
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error
  } = useInfiniteQuery(
    ['messages', type, filters, userId],
    fetchMessages,
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
      staleTime: 1000 * 60 * 5, // Cache válido por 5 minutos
      cacheTime: 1000 * 60 * 30, // Manter no cache por 30 minutos
    }
  );

  // Mutations para ações nas mensagens
  const toggleFavoriteMutation = useMutation(
    async (messageId) => {
      // Implementação do toggle favorite
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['messages']);
      }
    }
  );

  const copyMessageMutation = useMutation(
    async ({ messageId, content }) => {
      // Implementação da cópia
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['messages']);
      }
    }
  );

  return {
    messages: data?.pages.flatMap(page => page.messages) ?? [],
    isLoading,
    isError,
    error,
    hasMore: hasNextPage,
    loadMore: fetchNextPage,
    isLoadingMore: isFetchingNextPage,
    toggleFavorite: toggleFavoriteMutation.mutate,
    copyMessage: copyMessageMutation.mutate
  };
}