const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');

const { body, check, validationResult } = require('express-validator');
const {
  getContacts,
  findContactByName,
  addContact,
  deleteContact,
  editContactByName,
} = require('./repository/contactRepository');

const app = express();
const port = 3000;

// Setup EJS
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Method override
app.use(methodOverride('_method'));

// Setup flash
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }),
);
app.use(flash());

app.get('/', (req, res) => {
  res.render('index', { layout: 'layouts/main-layout', title: 'Home' });
});

app.get('/about', (req, res) => {
  res.render('about', { layout: 'layouts/main-layout', title: 'About' });
});

app.get('/contact', async (req, res) => {
  const contacts = await getContacts();
  res.render('contact', {
    layout: 'layouts/main-layout',
    title: 'Contact',
    contacts,
    msg: req.flash('msg'),
  });
});

app.get('/contact/add', (req, res) => {
  res.render('add-contact', { layout: 'layouts/main-layout', title: 'Add Contact Form' });
});

app.post(
  '/contact',
  [
    body('name').custom(async (value) => {
      const duplikat = await findContactByName(value);
      if (duplikat) {
        throw new Error('Contact name already exists');
      }
      return true;
    }),
    check('email', 'Invalid e-mail').isEmail(),
    check('phone', 'Invalid phone number').isMobilePhone('id-ID'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('add-contact', {
        title: 'Add Contact Form',
        layout: 'layouts/main-layout',
        errors: errors.array(),
      });
    } else {
      await addContact(req.body);
      req.flash('msg', 'Contact has been added!');
      res.redirect('/contact');
    }
  },
);

app.delete('/contact', (req, res) => {
  deleteContact(req.body.name);
  req.flash('msg', 'Contact has been deleted!');
  res.redirect('/contact');
});

app.get('/contact/edit/:name', async (req, res) => {
  const contact = await findContactByName(req.params.name);
  res.render('edit-contact', {
    layout: 'layouts/main-layout',
    title: 'Edit Contact Form',
    contact,
  });
});

app.put(
  '/contact',
  [
    body('name').custom(async (value, { req }) => {
      const duplikat = await findContactByName(value);
      if (value !== req.body.oldName && duplikat) {
        throw new Error('Contact name already exists');
      }
      return true;
    }),
    check('email', 'Invalid e-mail').isEmail(),
    check('phone', 'Invalid phone number').isMobilePhone('id-ID'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('edit-contact', {
        title: 'Edit Contact Form',
        layout: 'layouts/main-layout',
        errors: errors.array(),
        contact: req.body,
      });
    } else {
      await editContactByName(req.body);
      req.flash('msg', 'Contact has been edited!');
      res.redirect('/contact');
    }
  },
);

app.get('/contact/:name', async (req, res) => {
  const contact = await findContactByName(req.params.name);

  res.render('detail', { layout: 'layouts/main-layout', title: 'Contact Detail Page', contact });
});

app.listen(port, () => {
  console.log(`MySQL Contact App | listening at http://localhost:${port}`);
});
