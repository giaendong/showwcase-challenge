import { Button, Input } from 'components/atoms'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  margin-top: 10rem;
  display: flex;
  flex-direction: column;
  width: 100%;
  text-align: center;
`;

const Home: NextPage = () => {
  const router = useRouter();
  const [name, setName] =  useState<string>();

  const handleSubmit = useCallback(() => {
    router.push(`/users/${name}`)
  }, [name, router])

  return (
    <Wrapper>
      <h3>Hi there! Welcome to your education Showwcase.</h3>
      <h3>Type your name and click &quot;Enter&quot; below to begin!</h3>
      <Input.Base type='text' width={1/8} alignSelf={'center'} mb={3} onChange={e => setName(e.target.value)} />
      <Button.Base width={'3rem'} alignSelf={'center'} onClick={handleSubmit}>Enter</Button.Base>
    </Wrapper>
  )
}

export default Home
