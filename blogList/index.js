require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const Blog = require('./models/blog');

const app = express();

const cors = require('cors');
const mongoose = require('mongoose');

app.use(cors());
app.use(express.json());

app.use(morgan('tiny'));
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

// let blogs = [
//   {
//     title: 'My first blog',
//     author: 'Luciano',
//     url: 'www.global.com',
//     likes: 2,
//     id: 1,
//   },
//   {
//     title: 'My second blog',
//     author: 'Alberto',
//     url: 'www.globalactions.com',
//     likes: 6,
//     id: 2,
//   },
// ];

const mongoose = require('mongoose');

const password = process.argv[2];

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

console.log('connecting to', url);

// const Blog = mongoose.model('Blog', blogSchema);

// const mongoUrl = 'mongodb://localhost/bloglist';
// mongoose.connect(mongoUrl);

// app.use(cors());

// const password = process.argv[2];

// const url = `mongodb+srv://luchosr:${password}@fsopencluster0.xyz4huo.mongodb.net/Bloglist?retryWrites=true&w=majority&appName=FSOpenCluster0`;

// mongoose.set('strictQuery', false);
// mongoose.connect(url);

// const blogSchema = new mongoose.Schema({
//   title: String,
//   author: String,
//   url: String,
//   likes: Number,
// });

// blogSchema.set('toJSON', {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString();
//     delete returnedObject._id;
//     delete returnedObject.__v;
//   },
// });

// const Blog = mongoose.model('Blog', blogSchema);

mongoose
  .connect(url)
  .then((result) => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

const date = new Date();

app.get('/info', (request, response) => {
  Blog.estimatedDocumentCount({}).then((count) =>
    response.send(
      `<p>Bloglist has info for ${count} blogs</p><br/><p>${date}</p>`
    )
  );
});

app.get('/api/blogs', (request, response, next) => {
  Blog.find({})
    .then((blog) => {
      response.json(blogs);
    })
    .catch((error) => next(error));
});

app.get('/api/blogs/:id', (request, response, next) => {
  // const id = Number(request.params.id);
  // const blog = blogs.find((blog) => blog.id === id);
  // if (blog) {
  //   response.json(blog);
  // } else {
  //   response.status(404).end();
  // }

  Blog.findById(request.params.id)
    .then((blog) => {
      if (blog) {
        response.json(blog);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.post('/api/blogs', (request, response) => {
  // const body = request.body;
  // if (!body.title) {
  //   return response.status(400).json({
  //     error: 'title missing',
  //   });
  // }

  // const blog = {
  //   title: body.title,
  //   author: body.author,
  //   url: body.url,
  //   likes: body.likes,
  //   id: generateId(),
  // };

  // blogs = blogs.concat(blog);

  // response.json(blog);
  const { title, author, url, likes } = request.body;

  if (!title) {
    return response.status(400).json({ error: 'title missing' });
  } else if (!author) {
    return response.status(400).json({ error: 'author missing' });
  }

  const blog = new Blog({ title, author, url, likes });
  blog
    .save()
    .then((savedBlog) => {
      response.json(savedBlog);
    })
    .catch((error) => next(error));
});

app.delete('/api/blogs/:id', (request, response, next) => {
  // const id = Number(request.params.id);
  // blogs = blogs.filter((blog) => blog.id !== id);

  // response.status(204).end();

  Blog.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

const generateId = () => {
  const maxId = blogs.length > 0 ? Math.max(...blogs.map((n) => n.id)) : 0;
  return maxId + 1;
};

// app.get('/api/blogs', (request, response) => {
//   Blog.find({}).then((blogs) => {
//     response.json(blogs);
//   });
// });

// app.post('/api/blogs', (request, response) => {
//   const blog = new Blog(request.body);

//   blog.save().then((result) => {
//     response.status(201).json(result);
//   });
// });

app.put('/api/blogs/:id', (request, response, next) => {
  const { title, author, url, likes } = request.body;

  const blog = {
    title,
    author,
    url,
    likes,
  };
  if (!title || !author) {
    return response.status(400).json({ error: 'title or author missing' });
  }

  Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .then((updatedBlog) => {
      response.json(updatedBlog);
    })
    .catch((error) => next(error));
});

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

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
