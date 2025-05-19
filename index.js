const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
var app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(express.json());
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://bhumi:test123@todolist.ijxvwuf.mongodb.net/todoList?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


const tryschema = new mongoose.Schema({
     name: String,
     priority: String
});
const Item = mongoose.model('task', tryschema);
const todo = new Item({ 
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

        const foundItems = await Item.find(filter);
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
        const todoItem = new Item({
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
app.put("/edit-todo/:id", async (req, res) => {
    const { id } = req.params;
    const { title, priority } = req.body;

    try {
        await Item.findByIdAndUpdate(id, { name: title, priority });
        console.log("Successfully updated");
        res.redirect("/");
    } catch (err) {
        console.error("Update failed:", err);
        res.status(500).send("Failed to update item");
    }
});

// DELETE - Delete Todo
app.delete("/delete-todo/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await Item.findByIdAndDelete(id);
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