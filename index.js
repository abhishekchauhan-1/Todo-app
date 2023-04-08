const express = require('express');
const http = require('http');
const port = 8080;
const path = require('path')

//We can Say Here We Use Dependencies Or Use of Db with the Help of Mongoose
const db = require("./config/mongoose")
const Task = require("./modal/task")

//Fire Our Express Server
const app = express();

//Setup Of our Views And ViewEngine EJS.
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//For The Using Of Static Views
app.use(express.static("assets"));
app.use(express.urlencoded({extended:true}));



//For the Rendering Data On the Page
app.get("/", async function(request,response){
    let task = await Task.find({});

    return response.render("index",{
        title:"To do App",
        task_s: task

    })
})

//For the Posting and Creating Task In The Database
app.post("/create-to-do", async function (request, response) {

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const date = new Date(request.body.date);
  const formattedDate = `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

    let newContact = await Task.create({
      task: request.body.task,
      date: formattedDate,
      category: request.body.category,
    });
    console.log("******", newContact);
    return response.redirect("back");
  });

 
//For the Deleting Entries In the DataBase
  app.post('/delete-tasks', async function (req, res) {
    const ids = req.body.id; // array of _id values of checked tasks
    console.log(req.body.id)
    await Task.deleteMany({ _id: { $in: ids } }); // delete all tasks with matching _id values
    return res.redirect("back");
  });
  
  
//For the Listening From the Server Is Running Or not
app.listen(port,function(err){
    if(err){
        console.log("Error in Running Server"+ err)
    }
    console.log("Server is Running on port "+ port)
})