const mongoose = require("mongoose");

if (process.argv.length > 3) {
  console.log(
    "please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://damycofullstack:${password}@cluster0.0xf4b.mongodb.net/note-app?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

// "Note" parameter is the singular name of the model.
const Note = mongoose.model("Note", noteSchema);

const note = new Note({
  content: "HTML is Easydsfsdfasdfdsf",
  date: new Date(),
  important: false,
});

note.save().then((result) => {
  console.log("note saved!");
  console.log(result);
  //If the connection is not closed, the program will never finish its execution.
  mongoose.connection.close();
});

// in .find parameter we can spec object to filter

// Note.find({ important: true }).then(result => {
//     result.forEach(note => {
//       console.log(note)
//     })
//     mongoose.connection.close()
//   })