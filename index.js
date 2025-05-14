const express = require('express');
const bodyParser = require('body-parser');

var app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');
const { name } = require('ejs');
const uri='mongodb+srv://bhumi:test%40123@todolist.ijxvwuf.mongodb.net/?retryWrites=true&w=majority&appName=todoList';
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await mongoose.disconnect();
  }
}
run().catch(console.dir);

const tryschema = new mongoose.Schema({
     name: String,
     priority: String
});
const item = mongoose.model('task', tryschema);
const todo = new item({ 
    name: "create some videos",
    priority: "High"
});
//todo.save();

app.get('/', async (req, res) => {
     try {
        const selectedPriority = req.query.priority;
        let filter = {};

        if (selectedPriority && selectedPriority !== 'All') {
            filter.priority = selectedPriority;
        }

        const foundItems = await item.find(filter);
        res.render('index', { todos: foundItems });
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
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