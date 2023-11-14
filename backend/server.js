const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
mongoose.set('strictQuery', false);

const app = express();
app.use(express.json());
app.use(cors());

connection = "mongodb+srv://<username>:<password>@ucthrift-dev.xpujbsq.mongodb.net/"

// INIT CONNECTION
mongoose
    .connect (connection,
        {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
        }
    )
    .then (() => console. log("Connected to DB"))
    .catch (console.error);

const Item = require('./models/item');
const User = require('./models/user');

app.listen(8080, () => console.log('Server listening on port 8080: http://localhost:8080'));
    
// ITEMS ENDPOINTS

// Get items
app.get('/items', async (req, res) => {
    const item = await Item.find();

    res.json(item);
});

// Create new item
app.post('/items/new', (req, res) => {
    const currentUser = req.user;

    const item = new Item({
        title: req.body.title,
        seller: currentUser._id,
        price: req.body.price,
        condition: req.body.condition,
        description: req.body.description,
        timestamp: Date.now(),
    });

    item.save();

    res.json(item);
});
    
// Edit item details
app.put('/items/edit/:_id', async (req, res) => {
    const item = await Item.findById(req.params._id);

    item.price = req.body.price,
    item.condition = req.body.condition,
    item.description = req.body.description,

    item.save();

    res.json(item);
});
    
// Delete item
app.delete('/items/delete/:_id', async (req, res) => {
    const result = await Item.findByIdAndDelete(req.params._id);

    res.json(result);
});
    
// USER ENDPOINTS

// Get all users
app.get('/users', async (req, res) => {
    const users = await User.find();

    res.json(users);
});
    
// Create new user 
app.post('/users/new', async (req, res) => {
    const dupUser = await User.findOne({ email: req.body.email });
    if (dupUser) {
        res.json({ error: 'Email address is already registered.' });
        return;
    }

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    await user.save();

    res.json(user);
});

// Delete user
app.delete('/users/delete/:_id', async (req, res) => {
    const result = await User.findByIdAndDelete(req.params._id);

    res.json(result);
});

// Edit user information
app.put('/users/edit/:_id', async (req, res) => {
    const user = await User.findById(req.params._id);

    user.username = req.body.username;
    user.password = req.body.password;
    user.save();

    res.json(user);
});

app.get('/users/posted-items', async (req, res) => {
    const user = await User.findById(req.params._id);
    const postedItems = user.postedItems;

    res.json(postedItems);
});

// Log in user account
app.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        res.json({ 'error': 'Email address is not registered.'})
        return;
    }
    
    if (user.password === req.body.password) {
        res.json(user);
    }
    else {
        res.json({ 'error': 'Incorrect password.'})
    }
});