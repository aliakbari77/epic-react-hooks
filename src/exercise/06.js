// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  PokemonForm,
  fetchPokemon,
  PokemonDataView,
  PokemonInfoFallback,
} from '../pokemon'

function PokemonInfo({pokemonName}) {
  // 🐨 Have state for the pokemon (null)
  const [pokemon, setPokemon] = React.useState(null)
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    console.log('rerendering...')
    if (!pokemonName) return
    setPokemon(null)
    fetchPokemon(pokemonName)
      .then(data => {
        console.log(data)
        setPokemon(data)
      })
      .catch(err => setError(err.message))
  }, [pokemonName])

  return (
    <>
      {error && <div><p>There was an error: </p>{error}</div>}
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
