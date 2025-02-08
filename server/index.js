require('dotenv').config();

const bcrypt = require('bcryptjs');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'ghtudfkpouWRYIOXCuyewrcjhonhgfpoiqw'
const app = express();

// Now you can access your environment variables:
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Connection Error:", err));
  
app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {res.send('Weather Project Backend')});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {console.log('Server running on port ${PORT}')});


//app.get('/api/weather', (req, res) => {
//    res.json({message: "Weather data will be here."});
//});

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  });
  
const User = mongoose.model('User', UserSchema);

app.post('/signup', async (req, res) => {
    try {
        const { username, email, password} = req.body;

        if (!username || !password || !email){
            return res.status(400).json({message: 'Please provide username, email, and password.'});
        }

        const existingUser = await User.findOne({ username });
        if (existingUser){
            return res.status(400).json({message: 'User with this email already exists, please log in instead.'});
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({message: "User created successfully"});
    }
    catch (error){
        console.error('Error during user sign-up: ', error);
        res.status(500).json({message: 'Server error during sign-up'});
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id, username }, SECRET_KEY, { expiresIn: '1h' });

        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
});

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'Access denied, no token provided' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; // Store user info in req.user
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

app.get('/user/locations', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        res.json(user.savedLocations);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching locations' });
    }
});