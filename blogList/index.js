const express = require('express');
const app = express();
app.use(express.json());

let blogs = [
  {
    title: 'My first blog',
    author: 'Luciano',
    url: 'www.global.com',
    likes: 2,
    id: 1,
  },
  {
    title: 'My second blog',
    author: 'Alberto',
    url: 'www.globalactions.com',
    likes: 6,
    id: 2,
  },
];
// const cors = require('cors');
// const mongoose = require('mongoose');

// const blogSchema = new mongoose.Schema({
//   title: String,
//   author: String,
//   url: String,
//   likes: Number,
// });

// const Blog = mongoose.model('Blog', blogSchema);

// const mongoUrl = 'mongodb://localhost/bloglist';
// mongoose.connect(mongoUrl);

// app.use(cors());

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/api/blogs', (request, response) => {
  response.json(blogs);
});

app.get('/api/blogs/:id', (request, response) => {
  const id = Number(request.params.id);
  const blog = blogs.find((blog) => blog.id === id);
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/blogs/:id', (request, response) => {
  const id = Number(request.params.id);
  blogs = blogs.filter((blog) => blog.id !== id);

  response.status(204).end();
});

const generateId = () => {
  const maxId = blogs.length > 0 ? Math.max(...blogs.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post('/api/blogs', (request, response) => {
  const body = request.body;
  if (!body.title) {
    return response.status(400).json({
      error: 'title missing',
    });
  }

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    id: generateId(),
  };

  blogs = blogs.concat(blog);

  response.json(blog);
});
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

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
