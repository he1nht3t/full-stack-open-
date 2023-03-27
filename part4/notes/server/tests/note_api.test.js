const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Note = require('../models/note')
const helper = require('./test_helper')

const api = supertest(app)


beforeEach(async () => {
  await Note.deleteMany({})

  for (const note of helper.initialNotes) {
    let noteObject = new Note(note)

    await noteObject.save()
  }

})

describe('when there is initially some notes saved', () => {
  test('notes are return as json', async() => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 100000)

  test('all notes are returned', async() => {
    const res = await api.get('/api/notes')

    expect(res.body).toHaveLength(helper.initialNotes.length)
  })

  test('a specific note is within the returned notes', async () => {
    const res = await api.get('/api/notes')

    const contents = res.body.map(r => r.content)

    expect(contents).toContain('Browser can execute only JavaScript')
  })
})

describe('viewing a specific note', () => {
  test('success with a valid id', async () => {
    const noteAtStart = await helper.notesInDb()

    const noteToView = noteAtStart[0]

    const resultNote = await api.get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect('content-type', /application\/json/)

    expect(resultNote.body).toEqual(noteToView)
  })

  test('fail with statuscode 404 if note does not exist', async() => {
    const validNonexistingId = await helper.nonExistingId()
    await api
      .get(`/api/notes/${validNonexistingId}`)
      .expect(404)
  } )

  test('fail with statuscode 400 if id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api
      .get(`/api/notes/${invalidId}`)
      .expect(400)
  })
})

describe('addition of new note', () => {
  test('success with a valid note', async() => {
    const newNote = {
      content: 'async/await simplifies making async calls',
      important: true,
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const notesAtEnd = await helper.notesInDb()
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)

    const contents = notesAtEnd.map(note => note.content)
    expect(contents).toContain('async/await simplifies making async calls')

  })

  test('fail with status code 400 if data is invalid', async() => {
    const newNote = {
      important: true
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(400)

    const notesAtEnd = await helper.notesInDb()

    expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
  })
})

describe('deletion of a note', () => {
  test('success with status code 204 if id is valid', async () => {
    const notesAtStart = await helper.notesInDb()
    const noteToDelete = notesAtStart[0]

    await api.delete(`/api/notes/${noteToDelete.id}`)
      .expect(204)

    const notesAtEnd = await helper.notesInDb()

    expect(notesAtEnd).toHaveLength(helper.initialNotes.length - 1)

    const contents = notesAtEnd.map(note => note.content)

    expect(contents).not.toContain(noteToDelete.content)
  })
})


afterAll(async() => {
  await mongoose.connection.close()
})