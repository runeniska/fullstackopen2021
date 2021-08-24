import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const Filter = ({ search, searchCountries }) => {
  return (
    <div>
      Find countries: <input value={search} onChange={searchCountries}/>
    </div>
  )
}

const ShowOverTen = () => {
  return (
    <div>
      Too many matches, specify another filter
    </div>
  )
}

const ShowOverOne = ({ countries }) => {
  return (
    <div>
      <ul>
        {countries.map( country => <li key={country.name}>{country.name}</li> )}
      </ul>
    </div>
  )
}

const ShowOne = ({ country }) => {
  return (
    <div>
      <h1>{country.name}</h1>
      <p>capital {country.capital}</p>
      <p>population {country.population}</p>
      <h2>Languages</h2>
      <ul>
        {country.languages.map( language => <li key={language.name}>{language.name}</li>)}
      </ul>
      <img className="App-img" src={country.flag} alt="Flag"/>
    </div>
  )
}

const Countries = ({ countries }) => {
  const size = countries.length
  if (size > 10) {
    return <ShowOverTen />
  } else if (size > 1) {
    return <ShowOverOne countries={countries} />
  } else if (size === 1) {
    return <ShowOne country={countries[0]} />
  } else {
    return (
      <div>
        No countries found
      </div>
    )
  }
}

const App = () => {
  const [ countries, setCountries ] = useState([])
  const [ search, setSearch ] = useState('')

  const results = countries.filter( country =>
    country.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
  )

  const handleSearchChange = (event) => setSearch(event.target.value)

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        console.log(response.data.length)
        setCountries(response.data)
      })
  }, [])

  return (
    <div>
      <Filter search={search} searchCountries={handleSearchChange} />
      <Countries countries={results} />
    </div>
  )
}

export default App
