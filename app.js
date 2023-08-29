import { get404 } from './contollers/error';
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
import path from 'path';

const MONGODB_URI = 'mongodb+srv://rakhmonovshope:J3kyf9C3FH*GwTQ@nodejs.movqxia.mongodb.net/shop';

const app = express();
const store = new MongoDBStore(session)({
  collection: 'sessions',
  uri: MONGODB_URI
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
app.use(express.static(path.join(__dirname, 'public')));
app.use(csrfProtection);

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
      console.log('app.js user err', err);
    });
});

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  res.locals.isAuthenticated = req.session.isLoggedIn;

  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(get404);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected!');
    app.listen(3000);
  })
  .catch(err => {
    console.log('Connection error', err);
  });
