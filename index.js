require('dotenv').config()
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const Person = require("./models/person");

const app = express();

morgan.token("body", (request, response) => {
    if (request.method === "POST") {
        return JSON.stringify(request.body);
    }
});

app.use(express.static("build"));
app.use(express.json());
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));
app.use(cors());


let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

app.get("/info", (request, response) => {
    Person.find({}).estimatedDocumentCount().then(amount => {
        response.send(
            `<div>Phone book has info for ${amount} people</div>
            <div>${new Date()}</div>`
        );
    });
});

app.get("/api/persons", (request, response) => {
    Person.find({}).then(result => {
        response.json(result);
    })
    .catch(error => {
        response.status(404).end();
    });
});

app.post("/api/persons", (request, response, next) => {
    // if (persons.some(p => p.name === request.body.name)) {
    //     return response.status(400).json({
    //         error: "Name must be unique"
    //     });
    // }
    
    // const generatedId = Math.floor(Math.random() * 10000);

    const newPerson = new Person({
        name: request.body.name,
        number: request.body.number
    });

    newPerson.save()
        .then(savedPerson => {
            response.json(savedPerson);
        })
        .catch(error => next(error));
});

app.get("/api/persons/:id", (request, response) => {
    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person);
        } else {
            response.status(404).end();
        }
    });  
});

app.delete("/api/persons/:id", (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end();
        })
        .catch(error => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
    const { name, number } = request.body;

    Person.findByIdAndUpdate(
        request.params.id,
        { name, number },
        { new: true, runValidators: true, context: "query" }
    )
        .then(updatedPerson => {
            response.json(updatedPerson);
        })
        .catch(error => next(error));
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "Unknown endpoint" })
}

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === "CaseError") {
        return response.status(400).send({ error: "Malformatted id" });
    } else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message });
    }

    next(error);
}

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});