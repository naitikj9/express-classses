const express = require('express');
const fs = require('fs').promises; // Using promises version of fs for async/await
const app = express();
const port = 3000;
// Define logger middleware function
const loggerMiddleware = (req, res, next) => {
    const method = req.method;
    const ip = req.ip;
    const hostname = req.hostname;
    const currentDate = new Date().toUTCString();

    console.log(`Method: ${method} | IP: ${ip} | Hostname: ${hostname} | Date: ${currentDate}`);

    next();
};


// Middleware to parse JSON bodies
app.use(express.json());

let courses = []; // Empty array to hold courses data

// Middleware to read data from file on server startup
const readCoursesFromFile = async () => {
    try {
        const data = await fs.readFile('courses.json', 'utf8');
        courses = JSON.parse(data);
        console.log('Courses data loaded from file.');
    } catch (err) {
        console.error('Error reading courses file:', err);
    }
};

// Function call to load courses data from file
readCoursesFromFile();

// Middleware to write courses data to file after each modification
const writeCoursesToFile = async () => {
    try {
        await fs.writeFile('courses.json', JSON.stringify(courses, null, 2), 'utf8');
        console.log('Courses data saved to file.');
    } catch (err) {
        console.error('Error writing courses file:', err);
    }
};

// GET all courses
app.get('/courses', (req, res) => {
    res.json(courses);
});

// POST a new course
app.post('/courses', (req, res) => {
    const { name } = req.body;
    const newCourse = {
        id: courses.length > 0 ? courses[courses.length - 1].id + 1 : 1,
        name: name
    };
    courses.push(newCourse);
    writeCoursesToFile(); 
    res.status(201).json(newCourse);
});

// DELETE a course by ID
app.delete('/courses/:id', (req, res) => {
    const courseId = parseInt(req.params.id);
    const courseIndex = courses.findIndex(c => c.id === courseId);

   

    const deletedCourse = courses.splice(courseIndex, 1)[0];
    writeCoursesToFile(); 
    res.json(deletedCourse);
});

// PUT/update a course by ID
app.put('/courses/:id', (req, res) => {
    const courseId = parseInt(req.params.id);
    const course = courses.find(c => c.id === courseId);



    course.name = req.body.name;
    writeCoursesToFile(); 
    res.json(course);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
