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

const StatisticLine = ({ text, value }) => {
  return (<p>{text} {value} {(text==='Positive') ? '%' : ''}</p>)
}

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad
  const average = all ? (good - bad)/all : 0
  const positive = all ? good/all : 0

  if (!all) {
    return (
      <div>
        No feedback given!
      </div>
    )
  }

  return (
    <div>
      <h1>Statistics</h1>
      <StatisticLine text={'Good'} value={good} />
      <StatisticLine text={'Neutral'} value={neutral} />
      <StatisticLine text={'Bad'} value={bad} />
      <StatisticLine text={'All'} value={all} />
      <StatisticLine text={'Average'} value={average} />
      <StatisticLine text={'Positive'} value={positive} />
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
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App
