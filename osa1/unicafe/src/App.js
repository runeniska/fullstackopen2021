import React, { useState } from 'react'

const Header = () => {
  return (
    <div>
      <h1>Give feedback!</h1>
    </div>
  )
}

const Button = ({ handleClick, text }) => {
  return (
    <button onClick={handleClick}>
      {text}
    </button>
  )
}

const Content = ({ good, neutral, bad }) => {
  return (
    <div>
      <h1>Statistics</h1>
      <p>Good {good}</p>
      <p>Neutral {neutral}</p>
      <p>Bad {bad}</p>
    </div>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const addGood = () => setGood(good + 1)
  const addNeutral = () => setNeutral(neutral + 1)
  const addBad = () => setBad(bad + 1)

  return (
    <div>
      <Header />
      <Button handleClick={addGood} text={'Good'} />
      <Button handleClick={addNeutral} text={'Neutral'} />
      <Button handleClick={addBad} text={'Bad'} />
      <Content good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App
