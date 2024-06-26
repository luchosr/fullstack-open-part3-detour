require('dotenv').config();
const config = require('./utils/config');
const logger = require('./utils/logger');
const express = require('express');
const app = express();

const morgan = require('morgan');
const Blog = require('./models/blog');
const blogsRouter = require('./controllers/blogs');

const cors = require('cors');
const mongoose = require('mongoose');

app.use(cors());
app.use(express.json());

app.use(morgan('tiny'));
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.use('/api/blogs', blogsRouter);

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

logger.info('connecting to', config.MONGODB_URI);

mongoose
  .connect(url)
  .then((result) => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.info('error connecting to MongoDB:', error.message);
  });

const date = new Date();

app.get('/info', (request, response) => {
  Blog.estimatedDocumentCount({}).then((count) =>
    response.send(
      `<p>Bloglist has info for ${count} blogs</p><br/><p>${date}</p>`
    )
  );
});

// app.get('/api/blogs', (request, response, next) => {
//   Blog.find({})
//     .then((blogs) => {
//       response.json(blogs);
//     })
//     .catch((error) => next(error));
// });

// app.get('/api/blogs/:id', (request, response, next) => {
//   Blog.findById(request.params.id)
//     .then((blog) => {
//       if (blog) {
//         response.json(blog);
//       } else {
//         response.status(404).end();
//       }
//     })
//     .catch((error) => next(error));
// });

// app.post('/api/blogs', (request, response) => {
//   const { title, author, url, likes } = request.body;

//   if (!title) {
//     return response.status(400).json({ error: 'title missing' });
//   } else if (!author) {
//     return response.status(400).json({ error: 'author missing' });
//   }

//   const blog = new Blog({ title, author, url, likes });
//   blog
//     .save()
//     .then((savedBlog) => {
//       response.json(savedBlog);
//     })
//     .catch((error) => next(error));
// });

// app.delete('/api/blogs/:id', (request, response, next) => {
//   Blog.findByIdAndDelete(request.params.id)
//     .then((result) => {
//       response.status(204).end();
//     })
//     .catch((error) => next(error));
// });

// app.put('/api/blogs/:id', (request, response, next) => {
//   const { title, author, url, likes } = request.body;

//   const blog = {
//     title,
//     author,
//     url,
//     likes,
//   };
//   if (!title || !author) {
//     return response.status(400).json({ error: 'title or author missing' });
//   }

//   Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
//     .then((updatedBlog) => {
//       response.json(updatedBlog);
//     })
//     .catch((error) => next(error));
// });

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }
  next(error);
};
app.use(errorHandler);

module.exports = app;
