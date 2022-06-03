import { Button } from 'components/atoms'
import { apiHost } from 'config'
import { GetOrCreateUserParams } from 'constants/types'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useState } from 'react'
import { dehydrate, QueryClient, useQueryClient } from 'react-query'
import useUpdateUser from 'services/mutations/UseUpdateUser.mutation'
import { useGetOrCreateUserQuery, useGetOrCreateUserQueryKey, useSearchSchoolListQuery } from 'services/queries'
import styled from 'styled-components'
import theme from 'theme'
import format from 'date-fns/format'

type ActiveProps = {
  isActive: boolean;
}

const Wrapper = styled.div`text-align: center;`
const EducationSection = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 5rem 10rem;
`
const BookmarksSection = styled.div`
  flex: 0;
  background-color: ${(props) => props.theme.colors.lightgray};
  min-height: 30rem;
  min-width: 15%;
  text-align: left;
  padding: 2rem;

`
const DescSection = styled.div`
  flex: 1;
  min-width: 60%;
  margin-left: 2rem;
  margin-bottom: 2rem; 
  text-align: left;
`
const DescBox = styled.div<ActiveProps>`
background-color: ${(props) => props.isActive ? props.theme.colors.white : props.theme.colors.lightgray};
border: 1px solid ${(props) => props.theme.colors.lightgray};
padding: 2rem;
h4, h5 {
  margin: 0px;
}
small {
  color: ${(props) => props.theme.colors.gray};
}
`

const UserInfo: NextPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {name} = router.query;
  const [schoolName, setSchoolName] =  useState<string>('');
  const [activeSchool, setActiveSchool] = useState<string>('');

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

  const renderBookmarks = useMemo(() => user?.educations?.map((education, index) =>
    <Button.Link
      key={index}
      color={activeSchool === education.schools.name ? theme.colors.black : theme.colors.gray}
      onClick={() => setActiveSchool(education.schools.name)}
    >
      {education.schools.name}
    </Button.Link>), [user?.educations, activeSchool])
  
  const renderDescription = useMemo(() => user?.educations?.map((education, index) => {
    const startYear = education.start_year ? format(new Date(education.start_year), 'LLLL yyyy') : '';
    const endYear = education.end_year ? format(new Date(education.end_year), 'LLLL yyyy') : '';
    const endYearExpected = education.end_year_expected ? format(new Date(education.end_year_expected), 'LLLL yyyy') : '';
    return (
      <DescBox key={`${index}-${education.schools.name}`} isActive={activeSchool === education.schools.name}>
        <h4>{`${endYearExpected ? 'Study' : `${education.degree} of`} ${education.field_of_study} @ ${education.schools.name}`}</h4>
        <h5>{`${startYear} - ${endYearExpected ? `Present (expected finished at ${endYearExpected})` : endYear}`}</h5>
        <small>{`${education.schools.alpha_two_code} - ${education.schools.country}${education.schools?.web_pages?.[0] && ` - ${education.schools.web_pages[0]}`}`}</small>
        <p>{education.description}</p>
      </DescBox>
    )
  }), [user?.educations, activeSchool])

  return (
    <Wrapper>
      <h3>Welcome to {name} education showwcase.</h3>
      <Button.Base width={'10rem'} alignSelf={'center'} onClick={handleSubmit}>Add new education</Button.Base>
      <EducationSection>
        <BookmarksSection>
          {renderBookmarks}
        </BookmarksSection>
        <DescSection>
          {renderDescription}
        </DescSection>
      </EducationSection>
    </Wrapper>
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
