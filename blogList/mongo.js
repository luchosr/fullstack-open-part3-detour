const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://luchosr:${password}@fsopencluster0.xyz4huo.mongodb.net/Bloglist?retryWrites=true&w=majority&appName=FSOpenCluster0`;

mongoose.set('strictQuery', false);

mongoose.connect(url);

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    minLength: 3,
    required: [true, 'Blog title is required'],
  },
  author: {
    type: String,
    minLength: 3,
    required: [true, 'Author name is required'],
  },
  url: String,
  likes: Number,
  important: Boolean,
});

const Blog = mongoose.model('Blog', blogSchema);

if (process.argv[3]) {
  const blog = new Blog({
    title: process.argv[3],
    author: process.argv[4],
    url: process.argv[5],
    likes: process.argv[6],
  });

  blog.save().then((result) => {
    console.log(
      `added ${process.argv[3]} blog from ${process.argv[4]} to Bloglist`
    );
    mongoose.connection.close();
  });
} else {
  Blog.find({}).then((result) => {
    console.log('Bloglist');
    result.forEach((blog) => {
      console.log(blog.title + ' by ' + blog.author + ', url: ' + blog.url);
    });
    mongoose.connection.close();
  });
}
