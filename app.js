require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');

// npm uninstall express-flash-message
//const { flash } = require('express-flash-message');

// npm install connect-flash
const flash = require('connect-flash');

const session = require('express-session');
const connectDB = require('./server/config/db');

const app = express();
const port = process.env.PORT || 5000;

// Connect to Database  
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// Static Files
app.use(express.static('public'));

// Express Session
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    }
  })
);

// Flash Messages
app.use(flash({ sessionKeyName: 'flashMessage' }));

// Templating Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// Routes
// app.use('/', require('./server/routes/customer'))
// api
app.use('/api', require('./server/routes/api'))


// frontend
// customer

app.get('/customers', (req, res) => {
  res.render('customer/view');
});

app.get('/customers/:id', (req, res) => {
  res.render('customer/edit');
});
app.get('/customer/add', (req, res) => {
  res.render('customer/add');
});


// categories
app.get("/categories", (req, res) => {
  res.render("category/view")
})
app.get("/categories/add", (req, res) => {
  res.render("category/add")
})

app.get("/categories/:id", (req, res) => {
  res.render("category/edit")
})


// assets
app.get("/assets", (req, res) => {
  res.render("assets/view")
})
app.get("/assets/add", (req, res) => {
  res.render("assets/add")
})

app.get("/assets/:edit", (req, res) => {
  res.render("assets/edit")
})

// dashboard
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/auth', (req, res) => {
  res.render('auth', { layout: false });
});


app.get('/register', (req, res) => {
  res.render('register', { layout: false });
});

app.get('/system', (req, res) => {
  res.render('system/view');
});


// Handle 404
app.get('*', (req, res) => {
  res.status(404).render('404', {
    layout: false
  });
});



app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});
