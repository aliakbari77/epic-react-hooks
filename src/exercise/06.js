// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {
  PokemonForm,
  fetchPokemon,
  PokemonDataView,
  PokemonInfoFallback,
} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const [error, setError] = React.useState(null)
  const [state, setState] = React.useState({pokemon: null, status: 'idle'})

  React.useEffect(() => {
    if (!pokemonName) return
    setState({...state, pokemon: null})
    setState({...state, status: 'pending'})
    fetchPokemon(pokemonName)
      .then(data => {
        console.log(data)
        setState({...state, pokemon: data})
        setState({...state, status: 'resolved'})
      })
      .catch(err => {
        setError(err.message)
        setState({...state, status: 'rejected'})
      })
  }, [pokemonName, state])

  return (
    <>
      {error && (
        <div>
          <p>There was an error: </p>
          {error}
        </div>
      )}
      {!pokemonName && 'Submit a pokemon'}
      {!error &&
        pokemonName &&
        (state.pokemon ? (
          <PokemonDataView pokemon={state.pokemon} />
        ) : (
          <PokemonInfoFallback name={pokemonName} />
        ))}
    </>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
