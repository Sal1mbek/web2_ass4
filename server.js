const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const helmet = require('helmet');
const methodOverride = require('method-override');
const tourRoutes = require('./routes/tour-routes');
const contactRoutes = require('./routes/contact-routes');
const createPath = require('./helpers/create-path');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');

const PORT = 3000;
const connectionString = 'mongodb+srv://Salimbek:m0ngo221100@cluster0.iaxvqwl.mongodb.net/final'

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB Atlas');
});

app.listen(PORT, (error) => {
  error ? console.log(error) : console.log(`listening port ${PORT}`);
});

app.use(express.urlencoded({ extended: false }));

app.use(express.static('styles'));

app.use(methodOverride('_method'));

app.use(helmet());

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      // styleSrc: ["'self'", 'maxcdn.bootstrapcdn.com'],
      // scriptSrc: ["'self'", 'code.jquery.com', 'cdn.jsdelivr.net']
    }
  }
}));


app.get('/', (req, res) => {
  const title = 'Home';
  res.render(createPath('index'), { title });
});

app.get('/login', (req, res) => {
  const title = 'Login';
  res.render(createPath('login'), {title });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('Invalid email or password');
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).send('Invalid email or password');
    }
    res.redirect('/');
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/signup', (req, res) => {
  const title = 'Signup';

  res.render(createPath('signup'), {title });
});

app.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(error);
      res.render(createPath('error'), {title: 'Error'})
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.redirect('/login');
  } catch (err) {
    console.error('Error signing up:', err);
    res.render(createPath('error'), {title: 'Error'})
  }
});

app.use(tourRoutes);
app.use(contactRoutes);

app.use((req, res) => {
  const title = 'Error Page';
  res
    .status(404)
    .render(createPath('error'), { title });
});
