import * as errorRoutes from './contollers/error';
import User from './models/user';
import adminRoutes from './routes/admin';
import authRoutes from './routes/auth';
import shopRoutes from './routes/shop';

import bodyParser from 'body-parser';
import flash from 'connect-flash';
import MongoDBStore from 'connect-mongodb-session';
import csrf from 'csurf';
import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';

const MONGODB_URI = 'mongodb+srv://rakhmonovshope:J3kyf9C3FH*GwTQ@nodejs.movqxia.mongodb.net/shop';

const app = express();
const store = new MongoDBStore(session)({
  collection: 'sessions',
  uri: MONGODB_URI
});

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: 'my secret',
    store
  })
);

app.use(flash());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage }).single('image'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(csrfProtection);

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  res.locals.isAuthenticated = req.session.isLoggedIn;

  next();
});

app.use((req, res, next) => {
  if (!req.session.user) return next();

  User.findById(req.session.user._id)
    .then(user => {
      if (user) {
        req.user = user;

        return next();
      } else {
        res.redirect('/login');
      }
    })
    .catch(err => {
      next(new Error(err));
    });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use('/500', errorRoutes.get500);
app.use(errorRoutes.get404);

// eslint-disable-next-line n/handle-callback-err
app.use((err, req, res, next) => {
  console.log('server error', err);
  res.status(500).render('500', {
    pageTitle: 'Error page',
    path: '/500'
  });
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected!');
    app.listen(3000);
  })
  .catch(err => {
    console.log('Connection error', err);
  });
