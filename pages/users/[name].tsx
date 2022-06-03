import { Button } from 'components/atoms'
import { apiHost } from 'config'
import { GetOrCreateUserParams, SchoolProps, UserSchoolProps } from 'constants/types'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useState } from 'react'
import { dehydrate, QueryClient, useQueryClient } from 'react-query'
import useUpdateUser from 'services/mutations/UseUpdateUser.mutation'
import { useGetOrCreateUserQuery, useGetOrCreateUserQueryKey, useSearchSchoolListQuery } from 'services/queries'
import styled from 'styled-components'
import theme from 'theme'
import format from 'date-fns/format'
import AddSchoolModal from 'components/organisms/AddSchoolModal/AddSchoolModal.organism'

type ActiveProps = {
  isActive: boolean;
}

const defaultSchoolProps = {
  school:{
    name: "",
  },
  degree: undefined,
  field_of_study: undefined,
  start_year: undefined,
  end_year: undefined,
  end_year_expected: false,
  description: undefined
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
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.colors.lightgray};
  min-height: 300px;
  min-width: 25%;
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
margin-bottom: 2rem; 
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
  const [activeSchool, setActiveSchool] = useState<number>(0);
  const [newEducation, setNewEducation] = useState<UserSchoolProps>(defaultSchoolProps);
  const [isModalOpen, toggleModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

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
      // TODO: try use invalidateQueries or refetch
      queryClient.clear();
    },
    onError: () => {
      console.error('Update User failed')
    },
  });

  const handleSubmit = useCallback(() => {
    if (!newEducation.degree || !newEducation.field_of_study || !newEducation.end_year || ! newEducation.start_year) { // TODO: update error handling
      setErrorMessage("Some fields are required")
    } else {
      if (newEducation?.school?.name) {
        const educations = user?.educations || [];
        educations.push(newEducation)
        updateUser.mutate({
          name: name as string,
          educations
        })
        toggleModal(false)
      } else {
        setErrorMessage("Invalid school. Please select correct school.")
      }
    }
  }, [name, newEducation, updateUser, user?.educations])

  const handleCancel = useCallback(() => {
    toggleModal(false);
    setNewEducation(defaultSchoolProps);
  }, [])

  const renderBookmarks = useMemo(() => user?.educations?.slice(0).reverse().map((education, index) =>
    <Button.Link
      key={index}
      color={activeSchool === index ? theme.colors.black : theme.colors.gray}
      onClick={() => setActiveSchool(index)}
      mb={2}
    >
      {education.school?.name}
    </Button.Link>), [user?.educations, activeSchool])
  
  const renderDescription = useMemo(() => user?.educations?.slice(0).reverse().map((education, index) => {
    const startYear = education.start_year ? format(new Date(education.start_year), 'LLLL yyyy') : '';
    const endYear = education.end_year ? format(new Date(education.end_year), 'LLLL yyyy') : '';
    const endYearExpected = education.end_year_expected;
    return (
      <DescBox key={`${index}-${education.school?.name}`} isActive={activeSchool === index}>
        <h4>{`${endYearExpected ? 'Study' : `${education.degree} of`} ${education.field_of_study} @ ${education.school?.name}`}</h4>
        <h5>{`${startYear} - ${endYearExpected ? `Present (expected finished at ${endYear})` : endYear}`}</h5>
        <small>{`${education.school?.alpha_two_code} - ${education.school?.country}${education.school?.web_pages?.[0] && ` - ${education.school?.web_pages[0]}`}`}</small>
        <p>{education.description}</p>
      </DescBox>
    )
  }), [user?.educations, activeSchool])

  return (
    <Wrapper>
      <h3>Welcome to {name} education showwcase.</h3>
      <Button.Base width={'10rem'} alignSelf={'center'} onClick={() => toggleModal(true)}>Add new education</Button.Base>
      {
        user?.educations && user?.educations?.length > 0 &&
          <>
            <EducationSection>
              <BookmarksSection>
                {renderBookmarks}
              </BookmarksSection>
              <DescSection>
                {renderDescription}
              </DescSection>
            </EducationSection>
          </>
      }
      <AddSchoolModal
        isOpen={isModalOpen}
        onRequestModalClose={handleCancel}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        newEducation={newEducation}
        setNewEducation={setNewEducation}
        schoolList={searchSchoolList}
        setSchoolName={setSchoolName}
        errorMessage={errorMessage}
      />
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
