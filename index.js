const express = require('express');
const bodyParser = require('body-parser');

var app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');
const uri = "mongodb+srv://bhumi:test123@todolist.ijxvwuf.mongodb.net/?retryWrites=true&w=majority&appName=todoList";
const clientOptions = {
  serverApi: { version: '1', strict: true, deprecationErrors: true }
};

mongoose.connect(uri, clientOptions)
  .then(() => {
    console.log("Connected to MongoDB!");

    // Define your schema and model here
    const tryschema = new mongoose.Schema({
      name: String,
      priority: String
    });
    const Item = mongoose.model('task', tryschema);

    // Define your routes here
   
  })
  .catch(err => {
    console.error("Failed to connect to MongoDB", err);
  });
 app.get('/', async (req, res) => {
      try {
        const selectedPriority = req.query.priority;
        let filter = {};

        if (selectedPriority && selectedPriority !== 'All') {
          filter.priority = selectedPriority;
        }

        const foundItems = await Item.find(filter);
        res.render('index', { todos: foundItems });
      } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      }
    });

    // Start the server after routes are defined
app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
});
app.post("/add-todo", async (req, res) => {
    try {
        const itemName = req.body.title;
        const itemPriority = req.body.priority;
        const todoItem = new item({
            name: itemName,
            priority: itemPriority
        });

        await todoItem.save(); // ✅ wait for it to save
        res.redirect("/");
    } catch (err) {
        console.error("Add failed:", err);
        res.status(500).send("Failed to add todo");
    }
});
app.post("/edit-todo/:id", async function(req,res){
    try {
        const itemId = req.params.id;
        const itemName = req.body.title;
        const itemPriority = req.body.priority;

        await item.findByIdAndUpdate(itemId, { name: itemName, priority: itemPriority });
        console.log("Successfully updated");
        res.redirect("/");
    } catch (err) {
        console.error("Update failed:", err);
        res.status(500).send("Failed to update item");
    }
    
});
app.post("/delete-todo/:id", async function(req, res) {
    try {
        const itemId = req.params.id;
        await item.findByIdAndDelete(itemId); // ✅ use this
        console.log("Successfully deleted");
        res.redirect("/");
    } catch (err) {
        console.error("Delete failed:", err);
        res.status(500).send("Failed to delete item");
    }
});
app.listen(PORT, function() {
    console.log("server is running on port " + PORT);
});