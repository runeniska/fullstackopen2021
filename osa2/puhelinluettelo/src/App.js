import React, { useState, useEffect } from 'react'
import personService from './services/persons'

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

const Persons = ({ persons, setPersons, search }) => {
  const results = persons.filter( person =>
    person.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
  )

  const deletePerson = (person) => {
    const proceed = window.confirm(`Delete ${person.name}?`)

    if (proceed) {
      personService
        .del(person.id)
        .then(_ => console.log(`${person.name} removed successfully`))
        .catch(_ => console.log(`${person.name} is removed already`))

      setPersons(persons.filter(p => p.id !== person.id))
    }
  }

  return (
    <div>
      <ul>
        {results.map( person =>
          <li key={person.name}>
            {person.name} {person.number} <button onClick={() => deletePerson(person)}>delete</button>
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

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleSearchChange = (event) => setSearch(event.target.value)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => setPersons(initialPersons))
      .catch(_ => console.log('Cannot fetch contacts from server'))
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

      personService
        .create(personObject)
        .then(returnedPersonObject => {
          setPersons(persons.concat(returnedPersonObject))
          setNewName('')
          setNewNumber('')
        })
        .catch(_ => console.log('Failed to add person'))
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
      <Persons persons={persons} setPersons={setPersons} search={search} />
    </div>
  )
}

export default App
