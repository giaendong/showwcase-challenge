import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  const router = useRouter();
  const [name, setName] =  useState<string>();

  const handleSubmit = useCallback(() => {
    router.push(`/users/${name}`)
  }, [name, router])

  return (
    <div className={styles.container}>
      <h3>Hi there! Welcome to your education showwcase.</h3>
      <h3>Type your name and click &quot;Enter&quot; below to begin!</h3>
      <input type='text' onChange={e => setName(e.target.value)} />
      <button onClick={handleSubmit}>Enter</button>
    </div>
  )
}

export default Home
