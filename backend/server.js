const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
mongoose.set('strictQuery', false);

const app = express();
app.use(express.json());
app.use(cors());

connection = "mongodb+srv://<username>:<password>@ucthrift-dev.xpujbsq.mongodb.net"

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

// Get all items
app.get('/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get item by id
app.get('/items/:_id', async (req, res) => {
    try {
        const item = await Item.findById(req.params._id);

        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.json(item);
    } catch (error) {
        console.error('Error fetching item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create new item
app.post('/items/new', async (req, res) => {
    // const currentUser = req.user;

    const item = new Item({
        title: req.body.title,
        // sellerId: currentUser._id,
        sellerId: req.body.sellerId,
        price: req.body.price,
        condition: req.body.condition,
        description: req.body.description,
        timestamp: Date.now(),
    });

    try {
        await item.save();

        // Update the seller's postedItemIds array with the new item's _id
        const seller = await User.findById(req.body.sellerId);
        if (seller) {
            seller.postedItemIds.push(item._id);
            await seller.save();
        }

        res.json(item);
    } catch (error) {
        console.error('Error creating a new item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
    
// Edit item details
app.put('/items/edit/:_id', async (req, res) => {
    try {
        const item = await Item.findById(req.params._id);

        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        item.price = req.body.price;
        item.condition = req.body.condition;
        item.description = req.body.description;

        await item.save();

        res.json(item);
    } catch (error) {
        console.error('Error editing item details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
    
// Delete item
app.delete('/items/delete/:_id', async (req, res) => {
    try {
        const result = await Item.findByIdAndDelete(req.params._id);

        if (!result) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.json(result);
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
    
// USER ENDPOINTS

// Get all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get user by id
app.get('/users/:_id', async (req, res) => {
    try {
        const user = await User.findById(req.params._id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
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
    try {
        const result = await User.findByIdAndDelete(req.params._id);

        if (!result) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(result);
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Edit user information
app.put('/users/edit/:_id', async (req, res) => {
    try {
        const user = await User.findById(req.params._id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.username = req.body.username;
        user.password = req.body.password;
        await user.save();

        res.json(user);
    } catch (error) {
        console.error('Error editing user information:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Access all posted items of a user
app.get('/users/posted-items/:_id', async (req, res) => {
    try {
        const user = await User.findById(req.params._id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const postedItems = await Item.find({ _id: { $in: user.postedItemIds } });

        res.json(postedItems);
    } catch (error) {
        console.error('Error fetching posted items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});