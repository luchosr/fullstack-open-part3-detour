const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(express.json());
app.use(morgan('tiny'));
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

const date = new Date();

app.get('/info', (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p><br/><p>${date}</p>`
  );
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    console.log('Person es: ', person);
    response.json(person);
  } else {
    response.status(404).end();
  }
});

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
  return Math.round(Math.random() * maxId * 2) + 1;
};

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: 'content missing',
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  if (
    persons.some(
      (person) =>
        person.name.toLocaleLowerCase() == body.name.toLocaleLowerCase()
    )
  ) {
    return response.status(400).json({
      error: 'name must be unique',
    });
  } else if (persons.some((person) => person.number == body.number)) {
    return response.status(400).json({
      error: 'number must be unique',
    });
  } else {
    persons = persons.concat(person);

    response.json(person);
  }
});

// app.post('/api/persons', (request, response) => {
//   const person = request.body;

//   person.id = generateId();
//   console.log(person);
//   response.json(person);
// });

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
