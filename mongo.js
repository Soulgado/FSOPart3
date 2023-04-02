/* eslint-disable no-undef */
const mongoose = require("mongoose");

if (process.argv.length < 3 || process.argv.length === 4) {
  console.log("Not enough arguments");
  process.exit(1);
}

const password = process.argv[2];

const url =
    `mongodb+srv://nleonovq:${password}@fullstackopen.xy6cvi6.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log("Phonebook:")
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
}

if (process.argv.length === 5) {
  const name = process.argv[3];
  const number = process.argv[4];

  const newPerson = new Person({
    name: name,
    number: number
  });

  newPerson.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
}
