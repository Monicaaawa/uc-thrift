const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const fs = require('fs');

mongoose.set('strictQuery', false);

const app = express();
app.use(express.json());
app.use(cors());

const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.use('/uploads', express.static('uploads'));

connection = "mongodb+srv://jayeNay:QTz9GSRJSPTVxG6O@ucthrift-dev.xpujbsq.mongodb.net"

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

// // Get all items
// app.get('/items', async (req, res) => {
//     try {
//         const items = await Item.find();
//         res.json(items);
//     } catch (error) {
//         console.error('Error fetching items:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// Get paginated items
app.get('/items', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 6;
    const skip = (page - 1) * perPage;
  
    try {
      const items = await Item.find().skip(skip).limit(perPage);
      res.json(items);
    } catch (error) {
      console.error('Error fetching paginated items:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get number of items
app.get('/items/count', async (req, res) => {
    try {
      const count = await Item.countDocuments();
      res.json(count);
    } catch (error) {
      console.error('Error fetching item count:', error);
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

// Add item images
app.post('/items/upload-images', upload.array('images', 5), async (req, res) => {
    const item = await Item.findById(req.body.itemId);
    if (!item) {
        return res.status(404).send('Item not found');
    }

    const imagePaths = req.files.map(file => `/uploads/${file.filename}`);
    item.images.push(...imagePaths);
    await item.save();

    res.json({ message: 'Images uploaded successfully', imagePaths: item.images });
});

// Delete item images(individual)
app.delete('/items/delete-image/:itemId/:imageName', async (req, res) => {
    const item = await Item.findById(req.params.itemId);
    if (!item) {
        return res.status(404).send('Item not found');
    }

    const imageToDelete = `/uploads/${req.params.imageName}`;
    item.images = item.images.filter(image => image !== imageToDelete);
    await item.save();

    fs.unlink(path.join(__dirname, imageToDelete), (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error deleting the file');
        }
    });

    res.send('Image deleted successfully');
});
    
// USER ENDPOINTS
const saltRounds = 10;
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
    try 
    {
        const {email, password} = req.body;
        const user = await User.findOne({ email: email });
        if (user && await bcrypt.compare(password, user.password)) 
        {
            res.json('Success');
        } 
        else 
        {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
    } 
    catch (err) 
    {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create new user 
app.post('/register', async (req, res) => {
    try {
        const dupUser = await User.findOne({ email: req.body.email });
        if (dupUser) {
            return res.status(400).json({ error: 'Email address is already registered' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        const user = new User({
            ...req.body,
            password: hashedPassword,
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } 
    catch (err) 
    {
        res.status(500).json({ error: 'Internal Server Error' });
    }
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

        if (!user) 
        {
            return res.status(404).json({ error: 'User not found' });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        user.password = hashedPassword;
        user.username = req.body.username;

        await user.save();
         res.json(user);
    }
    catch (error)
    {
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
  
// Access all bought items of a user
app.get('/users/bought-items', async (req, res) => {
  const user = await User.findById(req.params._id);
  const boughtItems = user.boughtItems;
  
  res.json(boughtItems);
});

// Access all sold items of a user
app.get('/users/:i_id/sold-items', async (req, res) => {
  const user = await User.findById(req.params._id);
  const soldItems = user.soldItems;
  
  res.json(soldItems);
});

// Add profile photo
app.post('/users/upload-profile-picture', upload.single('image'), async (req, res) => {
    const user = await User.findById(req.body.userId);
    if (!user) {
        return res.status(404).send('User not found');
    }

    user.image = `/uploads/${req.file.filename}`;
    await user.save();

    res.json({ message: 'Profile picture uploaded successfully', imagePath: user.image });
});

// Delete profile photo
app.delete('/users/delete-profile-picture/:userId', async (req, res) => {
    const user = await User.findById(req.params.userId);
    if (!user) {
        return res.status(404).send('User not found');
    }

    const imagePath = user.image;
    user.image = "";
    await user.save();

    fs.unlink(path.join(__dirname, imagePath), (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error deleting the file');
        }
    });

    res.send('Profile picture deleted successfully');
});
