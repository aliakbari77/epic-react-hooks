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
  const [pokemon, setPokemon] = React.useState(null)
  const [error, setError] = React.useState(null)
  const [state, setState] = React.useState('idle')

  React.useEffect(() => {
    if (!pokemonName) return
    setPokemon(null)
    setState('pending')
    fetchPokemon(pokemonName)
      .then(data => {
        console.log(data)
        setPokemon(data)
        setState('resolved')
      })
      .catch(err => {
        setError(err.message)
        setState('rejected')
      })
  }, [pokemonName])

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
        (pokemon ? (
          <PokemonDataView pokemon={pokemon} />
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
