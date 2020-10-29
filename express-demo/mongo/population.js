const { func } = require("joi");
const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://norberto:norberto@cluster0.5jjd3.mongodb.net/playground2"
  )
  .then(() => {
    console.log("Connected to mongo Db.");
  })
  .catch((err) => console.error("Could not connect to mongo Db."));

const Author = mongoose.model(
  "Author",
  new mongoose.Schema({
    name: String,
    bio: String,
    website: String,
  })
);

const Course = mongoose.model(
  "Course",
  mongoose.Schema({
    name: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
    },
  })
);

async function createAuthor(name, bio, website) {
  const author = new Author({
    name,
    bio,
    website,
  });

  console.log(await author.save());
}

async function createCourse(name, author) {
  const course = new Course({ name, author });

  console.log(await course.save());
}

async function listCourses() {
  const courses = await Course.find().populate("author", "name website -_id").select("name author");

  console.log(courses);
}

//createAuthor('napp', 'my bio', 'my important website');

//createCourse("Node course", "5f7529cc3123614de3ec3d31");

listCourses();
