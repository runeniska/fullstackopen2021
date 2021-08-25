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

const Weather = ({ country }) => {
  const [ weather, setWeather] = useState([])
  const key = process.env.REACT_APP_API_KEY

  useEffect(() => {
    axios
      .get(`http://api.weatherstack.com/current?access_key=${key}&query=${country.capital}`)
      .then(response => {
        console.log(response.data)
        setWeather(response.data)
      })
  }, [country.capital, key])

  if (weather.length !== 0) {
    return (
    <div>
      <h2>Weather in {weather.location.name}</h2>
      <p>Temperature: {weather.current.temperature}</p>
      <img className="App-img" src={weather.current.weather_icons[0]} alt="Weather icon"/>
      <p>Wind: {weather.current.wind_speed} mph direction {weather.current.wind_dir}</p>
    </div>
    )
  } else {
    return <></>
  }
}

const ShowOverTen = () => {
  return (
    <div>
      Too many matches, specify another filter
    </div>
  )
}

const ShowOverOne = ({ countries, search }) => {
  return (
    <div>
      <ul>
        {countries.map( country =>
          <li key={country.name}>
            {country.name} <button value={country.name} onClick={search}>show</button>
          </li>
        )}
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
      <Weather country={country} />
    </div>
  )
}

const Countries = ({ countries, search }) => {
  const size = countries.length
  if (size > 10) {
    return <ShowOverTen />
  } else if (size > 1) {
    return <ShowOverOne countries={countries} search={search} />
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
        setCountries(response.data)
      })
  }, [])

  return (
    <div>
      <Filter search={search} searchCountries={handleSearchChange} />
      <Countries countries={results} search={handleSearchChange} />
    </div>
  )
}

export default App
