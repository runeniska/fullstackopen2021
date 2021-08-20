import React, { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])

  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ search, setSearch ] = useState('')
  const [ results, setResults ] = useState(persons)

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)

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
      setPersons(persons.concat(personObject))
      setNewName('')
      setNewNumber('')
    }
  }

  const searchNames = (event) => {
    const query = event.target.value
    setSearch(query)
    setResults(persons.filter( person =>
      person.name.toLocaleLowerCase().includes(query.toLocaleLowerCase())
    ))
  }

  return (
    <div>
      <h2>Phonebook</h2>
      Filter shown with <input value={search} onChange={searchNames}/>
      <h2>Add new contact</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {results.map( person =>
          <li key={person.name}>{person.name} {person.number}</li> )}
      </ul>
    </div>
  )

}

export default App
