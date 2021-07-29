const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const Note = require("../models/note");

// clear test DB and populate with expected entries
const initialNotes = [
  {
    content: "HTML is easy",
    date: new Date(),
    important: false,
  },
  {
    content: "Browser can execute only Javascript",
    date: new Date(),
    important: true,
  },
];
beforeEach(async () => {
  await Note.deleteMany({});
  let noteObject = new Note(initialNotes[0]);
  await noteObject.save();
  noteObject = new Note(initialNotes[1]);
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

test("there are two notes", async () => {
  const response = await api.get("/api/notes");

  expect(response.body).toHaveLength(2);
});

test("the first note is about HTTP methods", async () => {
  const response = await api.get("/api/notes");

  expect(response.body[0].content).toBe("HTML is easy");
});

test("all notes are returned", async () => {
  const response = await api.get("/api/notes");

  expect(response.body).toHaveLength(initialNotes.length);
});

test("a specific note is within the returned notes", async () => {
  const response = await api.get("/api/notes");

  const contents = response.body.map((r) => r.content);
  // The toContain method is used for checking that the note given to it as a parameter is in the list of notes returned by the API.
  expect(contents).toContain("Browser can execute only Javascript");
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
