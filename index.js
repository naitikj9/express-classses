const express = require('express');
const app = express;
let courses = [
    {id :1 ,name:"java"},
    {id :2 ,name: "express"},
    {id :3, name:"pyhton"}
];
app.length('/courses' , (req,res) =>{
    res.json(courses);

});
