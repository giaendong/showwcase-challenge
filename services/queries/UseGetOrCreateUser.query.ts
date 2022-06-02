import {ErrorType, GetOrCreateUserResponse, GetOrCreateUserParams} from 'constants/types'
import {QueryObserverResult, useQuery} from 'react-query';
import { apiHost } from 'config';


export const useGetOrCreateUserQueryKey = 'getOrCreateUser';
export function useGetOrCreateUserQuery(
  params: GetOrCreateUserParams,
): QueryObserverResult<GetOrCreateUserResponse, ErrorType> {
  return useQuery(
    [
      useGetOrCreateUserQueryKey,
      params.name,
    ],
    async () => await fetch(`${apiHost}/users/${params.name}`)
    .then(response => response.json())
    .then(data => {
      return {
        ok: true,
        user: data
      }
    }).catch((error) => {
      return {
        code: 500,
        messages: error
      }
    })
  ,
    {
      keepPreviousData: true,
      enabled: !!params.name
    },
  );
}