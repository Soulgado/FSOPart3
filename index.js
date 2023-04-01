const express = require("express");
const morgan = require("morgan");

const app = express();

morgan.token("body", (request, response) => {
    if (request.method === "POST") {
        return JSON.stringify(request.body);
    }
});

app.use(express.json());
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));

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
    response.send(
        `<div>Phone book has info for ${persons.length} people</div>
        <div>${new Date()}</div>`
    );
});

app.get("/api/persons", (request, response) => {
    response.json(persons);
});

app.post("/api/persons", (request, response) => {
    if (!request.body.name || !request.body.number) {
        return response.status(400).json({
            error: "Not enough data"
        });
    }

    if (persons.some(p => p.name === request.body.name)) {
        return response.status(400).json({
            error: "Name must be unique"
        });
    }
    
    const generatedId = Math.floor(Math.random() * 10000);

    const newPerson = {
        id: generatedId,
        name: request.body.name,
        number: request.body.number
    };

    persons = persons.concat(newPerson);

    response.json(newPerson);
});

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(p => p.id === id);

    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(p => p.id !== id);

    response.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});