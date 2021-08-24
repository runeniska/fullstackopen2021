import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({ search, searchNames }) => {
  return (
    <div>
      Filter shown with <input value={search} onChange={searchNames}/>
    </div>
  )
}

const PersonForm = (props) => {
  return (
    <div>
      <form onSubmit={props.addPerson}>
          <div>
            name: <input value={props.newName} onChange={props.handleNameChange} />
          </div>
          <div>
            number: <input value={props.newNumber} onChange={props.handleNumberChange}/>
          </div>
          <div>
            <button type="submit">add</button>
          </div>
        </form>
    </div>
  )
}

const Persons = ({ results }) => {
  return (
    <div>
      <ul>
        {results.map( person =>
          <li key={person.name}>
            {person.name} {person.number}
          </li>
        )}
      </ul>
    </div>
  )
}

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ search, setSearch ] = useState('')

  const results = persons.filter( person =>
    person.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
  )

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleSearchChange = (event) => setSearch(event.target.value)

  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const nameExists = persons.map( person => person.name ).includes(newName)
    const numberExists = persons.map( person => person.number ).includes(newNumber)

    if (nameExists || numberExists) {
      window.alert(
        (nameExists ? newName : newNumber) +
        ' is already added to phonebook'
      )
    } else {
      const personObject = {
        name: newName,
        number: newNumber
      }
      const newPersons = persons.concat(personObject)
      setPersons(newPersons)
      setNewName('')
      setNewNumber('')
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter search={search} searchNames={handleSearchChange} />
      <h2>Add new contact</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons results={results} />
    </div>
  )
}

export default App
