import { apiHost } from 'config';
import {ErrorType, SearchSchoolNameParams, SearchSchoolNameResponse} from 'constants/types'
import {QueryObserverResult, useQuery} from 'react-query';


export const useSearchSchoolListQueryKey = 'searchSchoolList';
export function useSearchSchoolListQuery(
  params: SearchSchoolNameParams,
): QueryObserverResult<SearchSchoolNameResponse, ErrorType> {
  return useQuery(
    [
      useSearchSchoolListQueryKey,
      params.name,
    ],
    async () => await fetch(`${apiHost}/schools/${params.name}`)
    .then(response => response.json())
    .then(data => {
      return {
        ok: true,
        schools: data
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
      enabled: !!params.name,
    },
  );
}
