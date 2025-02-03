import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  getUserFolders, 
  createFolder, 
  updateFolder, 
  deleteFolder 
} from '../../../utils/supabase/messageQueries';

export function useFolders(userId) {
  const queryClient = useQueryClient();

  const {
    data: folders = [],
    isLoading,
    isError,
    error
  } = useQuery(
    ['folders', userId],
    () => getUserFolders(userId),
    {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 30,
    }
  );

  const createFolderMutation = useMutation(
    (name) => createFolder(userId, name),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['folders', userId]);
      }
    }
  );

  const updateFolderMutation = useMutation(
    ({ folderId, name }) => updateFolder(folderId, name),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['folders', userId]);
      }
    }
  );

  const deleteFolderMutation = useMutation(
    (folderId) => deleteFolder(folderId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['folders', userId]);
      }
    }
  );

  return {
    folders,
    isLoading,
    isError,
    error,
    createFolder: createFolderMutation.mutate,
    updateFolder: updateFolderMutation.mutate,
    deleteFolder: deleteFolderMutation.mutate
  };
}