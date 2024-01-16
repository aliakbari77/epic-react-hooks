// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'

function useLocalStorageState(
  key,
  defalutValue = '',
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) {
  const [state, setState] = React.useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(key)
    if (valueInLocalStorage) {
      return deserialize(valueInLocalStorage)
    }
    return typeof defalutValue === 'function' ? defalutValue() : defalutValue
  })

  const prevKeyRef = React.useRef(key)

  React.useEffect(() => {
    const prevKey = prevKeyRef.current
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }
    prevKeyRef.current = key
    window.localStorage.setItem(key, serialize(state))
  }, [key, state, serialize])

  return [state, setState]
}

function Board({onClick, squares}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const [currentSquares, setCurrentSquares] = useLocalStorageState(
    'squares',
    Array(9).fill(null),
  )
  const [history, setHistory] = useLocalStorageState('history', [
    currentSquares,
  ])

  const [nextValue, setNextValue] = React.useState(
    calculateNextValue(currentSquares),
  )
  const [winner, setWinner] = React.useState(calculateWinner(currentSquares))
  const [status, setStatus] = React.useState(
    calculateStatus(winner, currentSquares, nextValue),
  )

  React.useEffect(() => {
    setStatus(calculateStatus(winner, currentSquares, nextValue))
  }, [winner, currentSquares, nextValue, status, setCurrentSquares])

  function selectSquare(square) {
    if (currentSquares[square] || winner) return

    const squareCopy = [...currentSquares]
    squareCopy[square] = nextValue

    setCurrentSquares(squareCopy)
    setNextValue(calculateNextValue(squareCopy))
    setWinner(calculateWinner(squareCopy))

    console.log(history.filter(h => h === squareCopy))

    setHistory(p => [...p, squareCopy])
  }

  function restart() {
    setCurrentSquares(Array(9).fill(null))
    setNextValue('X')
    setWinner(null)
    setStatus(calculateStatus(winner, currentSquares, nextValue))
    setHistory([])
  }

  const handleGameInfo = index => {
    setCurrentSquares(history[index])
    setNextValue(calculateNextValue(history[index]))
    setStatus(calculateStatus(winner, history[index], nextValue))
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={currentSquares} onClick={selectSquare} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        {status}
        <ol>
          {history.map((h, index) => (
            <li key={index}>
              <button onClick={() => handleGameInfo(index)}>
                {index === 0 ? 'Go to game start' : `Go to move #${index}`}{' '}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
