const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const fs = require('fs');

mongoose.set('strictQuery', false);

const app = express();
app.use(express.json());
app.use(cors());

// Setup uploading
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

// Setup mailing
let transporter = nodemailer.createTransport({
    service: 'Gmail', // e.g., 'Gmail'
    auth: {
        user: '<email address>',
        pass: '<password>'
    }
});

// Function to send mail
function sendEmail(to, subject, html) {
    let mailOptions = {
        from: '<email address>',
        to: to,
        subject: subject,
        html: html
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

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

// Sold Item Handling
app.post('/items/sold/:itemId', async (req, res) => {
    try {
        const { buyerId } = req.body;
        const itemId = req.params.itemId;

        const item = await Item.findById(itemId);
        const seller = await User.findById(item.seller);
        const buyer = await User.findById(buyerId);

        if (!item || !seller || !buyer) {
            return res.status(404).json({ error: 'Item or users not found' });
        }

        seller.soldItems.push(item._id);
        seller.postedItems.pop(item._id);
        buyer.boughtItems.push(item._id);

        await seller.save();
        await buyer.save();

        sendEmail(
            buyer.email,
            "Item Purchase Confirmation",
            `You have purchased an item. <a href="http://<domain>/items/review/${itemId}/buyer">Click here to review the item</a>.`
        );

        sendEmail(
            seller.email,
            "Item Sold Confirmation",
            `Your item has been sold. <a href="http://<domain>/items/review/${itemId}/seller">Click here to review the buyer</a>.`
        );

        res.json({ message: 'Item sold, users updated, emails sent' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
    
// USER ENDPOINTS
const saltRounds = 10;
// Get all users
app.get('/users', async (req, res) => {
    const users = await User.find();

    res.json(users);
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
            res.status(400).json({ error: 'Invalid email or password.' });
        }
    } 
    catch (err) 
    {
        res.status(500).json({ error: 'Internal server error' });
    }
});
    
// Create new user 
app.post('/register', async (req, res) => {
    try {
        const dupUser = await User.findOne({ email: req.body.email });
        if (dupUser) {
            return res.status(400).json({ error: 'Email address is already registered.' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        const user = new User({
            ...req.body,
            password: hashedPassword,
            confirmedPassword: hashedPassword
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } 
    catch (err) 
    {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete user
app.delete('/users/delete/:_id', async (req, res) => {
    const result = await User.findByIdAndDelete(req.params._id);

    res.json(result);
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
        const hashedConfirmedPassword = await bcrypt.hash(req.body.confirmedPassword, saltRounds);
        user.confirmedPassword = hashedConfirmedPassword;
        user.username = req.body.username;

        user.save();
        res.json({ message: 'User information updated successfully' });
    }
    catch (err)
    {
        res.status(500).json({ error: 'Internal server error'});
    }
});

app.get('/users/posted-items', async (req, res) => {
    const user = await User.findById(req.params._id);
    const postedItems = user.postedItems;

    res.json(postedItems);
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
