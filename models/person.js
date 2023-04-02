const mongoose = require("mongoose");

// eslint-disable-next-line no-undef
const url = process.env.MONGODB_URL;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [4, "Name is too short"],
    required: [true, "Name is required"]
  },
  number: {
    type: String,
    required: [true, "Number is required"],
    minLength: [8, "Number is too short"],
    validate:  {
      validator: function (v) {
        return /\d{2,3}(-|\d{1})\d{5}/.test(v);
      },
      message: function () { return "This is not a valid phone number"; }
    }
  }
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model("Person", personSchema);