const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/Expense-tracker", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    mobile: String,
    password: String
});

userSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(this.password, salt);
            this.password = hashedPassword;
            next();
        } catch (err) {
            next(err);
        }
    } else {
        next();
    }
});

const User = mongoose.model('User', userSchema);

app.post('/signup', async (request, response) => {
    try {
        const { username, email, mobile, password } = request.body;
        const newUser = new User({ username, email, mobile, password });
        await newUser.save();
        response.status(201).send("success");
    } catch (error) {
        console.error(error); // Log the error
        response.status(500).send('unsuccessful');
    }
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
