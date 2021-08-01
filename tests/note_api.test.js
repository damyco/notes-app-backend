const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);

const Note = require("../models/note");

beforeEach(async () => {
  await Note.deleteMany({});

  let noteObject = new Note(helper.initialNotes[0]);
  await noteObject.save();

  noteObject = new Note(helper.initialNotes[1]);
  await noteObject.save();
});

// tests starts here

test("notes are returned as json", async () => {
  await api
    .get("/api/notes")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

// if longer timeout is needed than the default 5000 ms use this instead, sets it to 100000 ms.
// test('notes are returned as json', async () => {
//     await api
//       .get('/api/notes')
//       .expect(200)
//       .expect('Content-Type', /application\/json/)
//   }, 100000)

test("the first note is about HTTP methods", async () => {
  const response = await api.get("/api/notes");

  expect(response.body[0].content).toBe("HTML is easy");
});

test("all notes are returned", async () => {
  const response = await api.get("/api/notes");

  expect(response.body).toHaveLength(helper.initialNotes.length);
});

test("a specific note is within the returned notes", async () => {
  const response = await api.get("/api/notes");

  const contents = response.body.map((r) => r.content);
  // The toContain method is used for checking that the note given to it as a parameter is in the list of notes returned by the API.
  expect(contents).toContain("Browser can execute only Javascript");
});

// test that adds a new note and verifies that the amount of notes returned by the API increases, and that the newly added note is in the list.
test("a valid note can be added", async () => {
  const newNote = {
    content: "async/await simplifies making async calls",
    important: true,
  };

  await api
    .post("/api/notes")
    .send(newNote)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const notesAtEnd = await helper.notesInDb();

  expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)
  const contents = notesAtEnd.map(n => n.content)
  expect(contents).toContain(
    'async/await simplifies making async calls'
  )
});

// test that verifies that a note without content will not be saved into the database
test("note without content is not added", async () => {
  const newNote = {
    important: true,
  };
  await api.post("/api/notes").send(newNote).expect(400);

  const notesAtEnd = await helper.notesInDb()

  expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
});

// to run single test from one file use command:
// ♦ npm test -- tests/note_api.test.js
// The -t option can be used for running tests with a specific name:
// ♦ npm test -- -t "a specific note is within the returned notes"
// run all of the tests that contain notes in their name:
// ♦ npm test -- -t 'notes'

afterAll(() => {
  mongoose.connection.close();
});
