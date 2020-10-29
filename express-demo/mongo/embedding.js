const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://norberto:norberto@cluster0.5jjd3.mongodb.net/playground2"
  )
  .then(() => {
    console.log("Connected to mongo Db.");
  })
  .catch((err) => console.error("Could not connect to mongo Db."));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String,
});

const Author = mongoose.model("Author", authorSchema);

const Course = mongoose.model(
  "Course",
  new mongoose.Schema({
    name: String,
    authors: [authorSchema]
  })
);

async function createCourse(name, authors) {
  const course = new Course({
    name,
    authors
  });

  const result = await course.save();
  console.log(result);
}

async function addAuthor(courseId, author) {
  const course = await Course.findById(courseId);

  if (course) {
    course.authors.push(author);
    const result = await course.save();

    console.log(result);
  } else {
    console.log('Did not find a course with the given Id');
  }
}

async function removeAuthor(courseId, authorId) {
  const course = await Course.findById(courseId);

  if (course) {
    const author = course.authors.id(authorId);
    author.remove();

    const result = await course.save();

    console.log(result);
  } else {
    console.log('Did not find a course with the given Id');
  }

}

async function updateAuthor(courseId) {
  const course = await Course.update({_id: courseId}, {
    $set: {
      "author.name": "John Smith",
    },
  });
}

async function listCourses() {
  const courses = await Course.find();
  console.log(courses);
}

// createCourse('Compose Course', [
//   new Author({ name: 'napp1' }),
//   new Author({ name: 'napp2' })
// ]);

//updateAuthor("5f752f39b664684e4f3f1fa4");

//addAuthor('5f7890384d29d4036e1f9ebd', new Author({ name: 'napp3' }));

removeAuthor('5f7890384d29d4036e1f9ebd', '5f789248f752ca03d00c44be');
