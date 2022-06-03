import { Input } from 'components/atoms';
import { Modal } from 'components/molecules';
import { SchoolProps, UserSchoolProps } from 'constants/types';
import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';

type Props = {
  isOpen: boolean;
  onRequestModalClose(): void;
  onCancel(): void;
  onSubmit(): void;
  newEducation: UserSchoolProps;
  setNewEducation(newEducation: UserSchoolProps): void;
  schoolList: SchoolProps[];
  setSchoolName(schoolName: string): void;
  errorMessage: string;
}

const Wrapper = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`
const InputsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 1rem;
  align-items: center;
`
const InputLabel = styled.div`
  width: 10rem;
`
const RequiredInputLabel = styled(InputLabel)`
  :after {
    content:" *";
    color: red;
  }
`
const ErrorMessage = styled.small`
  color: red;
`

const AddSchoolModal: React.FC<Props> = ({
  isOpen,
  onRequestModalClose,
  onCancel,
  onSubmit,
  newEducation,
  setNewEducation,
  schoolList,
  setSchoolName,
  errorMessage,
}) => {
  const handleInput = useCallback((value: Record<string, any>) => setNewEducation({...newEducation, ...value}), [newEducation, setNewEducation])

  const handleSearchInput = useCallback((value: string) => {
    setSchoolName(value)
    const school = schoolList.find((school) => school.name === value);
    setNewEducation({...newEducation, school: school?.name ? school : {name: ''}})
  }, [schoolList, newEducation, setNewEducation, setSchoolName])

  const renderSchoolsAutoComplete = useMemo(() => {
    return (
      <datalist id="schoolList">
        {
          schoolList.map((school, index) => {
            return <option value={school.name} key={index + '-' + school.name}>
                {school.name}
              </option>
          })
        }
      </datalist>
    );
  }, [schoolList]);

  return (
    <Modal.Base 
      isOpen={isOpen}
      onRequestModalClose={onRequestModalClose}
      onCancel={onCancel}
      onSubmit={onSubmit}
      submitText={'Add'}
      cancelText={'Cancel'}
    >
      <h3>Add new Education</h3>
      {
        errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>
      }
      <Wrapper>
        <InputsWrapper>
          <RequiredInputLabel>School :</RequiredInputLabel>
          <>
            <Input.Base
              type="search"
              width={300}
              placeholder="Find your school"
              list="schoolList"
              onChange={(e) => handleSearchInput(e.target.value)}
            />
            {renderSchoolsAutoComplete}
          </>
        </InputsWrapper>
        <InputsWrapper>
          <RequiredInputLabel>Degree :</RequiredInputLabel>
          <Input.Base type='text' width={300} placeholder='e.g. Bachelor , Master etc.' onChange={(e) => handleInput({degree: e.target.value})}/>
        </InputsWrapper>
        <InputsWrapper>
          <RequiredInputLabel>Field of Study :</RequiredInputLabel>
          <Input.Base type='text' width={300} placeholder='e.g. Computer Science, Informatics etc.' onChange={(e) => handleInput({field_of_study: e.target.value})}/>
        </InputsWrapper>
        <InputsWrapper>
          <RequiredInputLabel>Start Year :</RequiredInputLabel>
          <Input.Base type='month' onChange={(e) => handleInput({start_year: e.target.value})}/>
        </InputsWrapper>
        <InputsWrapper>
          <RequiredInputLabel>End Year :</RequiredInputLabel>
          <>
            <Input.Base type='month' onChange={(e) => handleInput({end_year: e.target.value})}/>
            <Input.Base type='checkbox' mr={1} onChange={(e) => handleInput({end_year_expected: e.target.checked})} />
            <InputLabel>expected graduate</InputLabel>
          </>
        </InputsWrapper>
        <InputsWrapper>
          <InputLabel>Description :</InputLabel>
          <Input.TextArea rows={10} width={3/4} placeholder='Tell us more' onChange={(e) => handleInput({description: e.target.value})}/>
        </InputsWrapper>
      </Wrapper>
    </Modal.Base>
  )
}

export default AddSchoolModal;