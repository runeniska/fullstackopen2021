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

const Persons = ({ persons, setPersons, search, setMessage }) => {
  const results = persons.filter( person =>
    person.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
  )

  const deletePerson = (person) => {
    const proceed = window.confirm(`Delete ${person.name}?`)

    if (proceed) {
      personService
        .del(person.id)
        .then(_ => {
          setMessage(`Contact '${person.name}' was removed successfully`)
          setTimeout(() => setMessage(null), 5000)
        })
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

const Notification = ({ message }) => {
  if (!message) {
    return null
  }

  if (message.includes('success')) {
    return (
      <div className="success">
        {message}
      </div>
    )
  } else {
    return (
      <div className="error">
        {message}
      </div>
    )
  }
}

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ search, setSearch ] = useState('')
  const [ message, setMessage ] = useState('')

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
    const personObject = {
      name: newName,
      number: newNumber
    }

    if (nameExists) {
      const proceed = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      if (proceed) {
        const existingPerson = persons.find(p => p.name === newName)
        const updatedPerson = {...existingPerson, number: newNumber}
        personService
          .update(updatedPerson)
          .then(returnedPersonObject => {
            setNewName('')
            setNewNumber('')
            setPersons(persons.map(person => {
              return person.id !== existingPerson.id ? person : returnedPersonObject
            }))
            setMessage(`Contact '${existingPerson.name}' was updated successfully`)
            setTimeout(() => setMessage(null), 5000)
          })
          .catch(error => {
            console.log(error)
            setMessage(`Information of '${existingPerson.name}' has already been removed from server`)
            setTimeout(() => setMessage(null), 5000)
            setPersons(persons.filter(person => person.id !== existingPerson.id))
          })
      }
    } else if (numberExists) {
      window.alert(`${newNumber} is already added to phonebook`)
    } else {
      personService
        .create(personObject)
        .then(returnedPersonObject => {
          setNewName('')
          setNewNumber('')
          setPersons(persons.concat(returnedPersonObject))
          setMessage(`Contact '${personObject.name}' was added successfully`)
          setTimeout(() => setMessage(null), 5000)
        })
        .catch(_ => console.log('Failed to add person'))
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
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
      <Persons
        persons={persons}
        setPersons={setPersons}
        search={search}
        setMessage={setMessage}
      />
    </div>
  )
}

export default App
