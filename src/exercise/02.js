// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import {useEffect} from 'react'

function Greeting() {
  const {name, setName} = useLocalStorage('name')

  function handleChange(event) {
    setName(event.target.value)
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

const useLocalStorage = key => {
  const [name, setName] = React.useState(() => window.localStorage.getItem(key))

  useEffect(() => {
    window.localStorage.setItem(key, name)
  }, [name])

  return {name, setName}
}

function App() {
  return <Greeting />
}

export default App
