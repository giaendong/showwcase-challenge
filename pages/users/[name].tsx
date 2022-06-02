import { apiHost } from 'config'
import { GetOrCreateUserParams } from 'constants/types'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useState } from 'react'
import { dehydrate, QueryClient, useQueryClient } from 'react-query'
import useUpdateUser from 'services/mutations/UseUpdateUser.mutation'
import { useGetOrCreateUserQuery, useGetOrCreateUserQueryKey, useSearchSchoolListQuery } from 'services/queries'

const UserInfo: NextPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {name} = router.query;
  const [schoolName, setSchoolName] =  useState<string>('');

  const userQuery = useGetOrCreateUserQuery({name} as GetOrCreateUserParams);

  const user = useMemo(
    () => (userQuery.data ? userQuery.data.user : undefined),
    [userQuery.data]
  );

  const searchSchoolListQuery = useSearchSchoolListQuery({
    name: schoolName,
  });

  const searchSchoolList = useMemo(
    () => (searchSchoolListQuery.data ? searchSchoolListQuery.data.schools : []),
    [searchSchoolListQuery.data],
  );

  const updateUser = useUpdateUser({
    onSuccess: () => {
      queryClient.invalidateQueries(useGetOrCreateUserQueryKey);
    },
    onError: () => {
      console.error('Update User failed')
    },
  });

  const handleSubmit = useCallback(() => {
    name && updateUser.mutate({name: name as string, educations: [{schools: {name: Math.random().toString()}}]})
  }, [name, updateUser])

  console.log(user,searchSchoolList)

  return (
    <div>
      <h3>Welcome to {name} education showwcase.</h3>
      {/* {
        searchSchoolList.map((item, index) => <p key={item.name + '-' + index}>{item.name}</p>)
      } */}
      <button onClick={handleSubmit}>Enter</button>
    </div>
  )
}

export const getServerSideProps = async ({params} : any) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([
    useGetOrCreateUserQueryKey,
    params.name
  ], async () => await fetch(`${apiHost}/users/${params.name}`)
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
    }
  ));
  return {
      props: {
        dehydratedState: dehydrate(queryClient)
      }
  }
}

export default UserInfo
