const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
mongoose.set('strictQuery', false);

const app = express();
app.use(express.json());
app.use(cors());

// DON'T PUSH THIS CONNECTION STRING AND CHANGE BACK TO DEFAULTS
connection = "mongodb+srv://angela:12345@ucthrift-dev.xpujbsq.mongodb.net/?retryWrites=true&w=majority"

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
    const searchQuery = req.query.search || '';
    const item = await Item.find({ title: { $regex: new RegExp(searchQuery, 'i') } });

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

// Log in to user account
app.post('/login', async (req, res) => {
    const {email, password} = req.body;
    User.findOne({email: email})
    .then(user => {
        if(user) {
            if(user.password === password) {
                res.json('Success');
            } else {
                res.json({'error': 'Incorrect password.'});
            }
        } else {
            res.json({'error': 'Email address is not registered.'});
            return;
        }
    })
});
    
// Create new user 
app.post('/register', async (req, res) => {
    const dupUser = await User.findOne({ email: req.body.email });
    if (dupUser) {
        res.json({ error: 'Email address is already registered.' });
        return;
    }

    User.create(req.body)
    .then(users => res.json(users))
    .catch(err => res.json(err))
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