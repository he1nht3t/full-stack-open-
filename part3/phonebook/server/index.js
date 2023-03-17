require('dotenv').config()

const express = require('express')

const app = express()

app.use(express.static('dist'))

// CORS
const cors = require('cors')

app.use(cors())

// json-parser middleware
app.use(express.json())

// morgan middleware
const morgan = require('morgan')

const Person = require('./models/persons')

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

app.get('/info', (req, res, next) => {
  Person.estimatedDocumentCount()
    .then((personCount) =>
      res.send(
        `<p>Phonebook has info for ${personCount} peoeple.</p>
                <p> ${new Date()} </p>`
      )
    )
    .catch((error) => next(error))
})

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then((persons) => res.json(persons))
    .catch((error) => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  const { id } = req.params

  Person.findById(id)
    .then((person) => {
      if (person) {
        return res.json(person)
      }
      return res.status(404).end()
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { id } = req.params
  const { name, number } = req.body

  Person.findByIdAndUpdate(
    id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then((person) => {
      if (person) {
        return res.json(person)
      }
      return res.status(404).end()
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  const { id } = req.params

  Person.findByIdAndRemove(id)
    .then((result) => {
      if (result) {
        return res.status(204).end()
      }
      return res.status(404).end()
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  const person = new Person({
    name,
    number,
    date: new Date(),
  })

  person
    .save()
    .then((savedPerson) => res.json(savedPerson))
    .catch((error) => next(error))
})

// unknown endpoint middleware
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'Unknown endpoint' })
}
app.use(unknownEndpoint)

// error handler
const errorHandler = (error, req, res, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const { PORT } = process.env
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
