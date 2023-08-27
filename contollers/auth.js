import User from "../models/user";
import etherealMail from '../utils/mail'; // uses fake smtp server : ethereal.email

import bcrypt from "bcryptjs";
import crypto from 'crypto';

export const getLogin = (req, res) => {
  const [message] = req.flash('error');

  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    isAuthenticated: false,
    errorMessage: message || null
  });
};

export const getReset = (req, res, next) => {
  const [message] = req.flash('error');

  res.render('auth/reset-password', {
    pageTitle: 'Reset Password',
    path: '/reset',
    errorMessage: message || null
  })
};

export const postLogin = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        req.flash('error', 'Email or password is incorrect');
        return res.redirect('/login');
      }

      bcrypt.compare(password, user.password).then((doMatch) => {
        if (!doMatch) {
          req.flash('error', 'Email or password is incorrect');
          return res.redirect("/login");
        }

        req.user = user;
        req.session.isLoggedIn = true;
        req.session.user = user;

        req.session.save((err) => {
          if (err) {
            console.log("Login save session error");
          }

          return res.redirect("/");
        });
      });
    })
    .then((err) => console.log(err));
};

export const getSignup = (req, res, next) => {
  const [message] = req.flash('error');

  res.render("auth/signup", {
    pageTitle: "Signup",
    path: "/signup",
    isAuthenticated: false,
    errorMessage: message || null
  });
};

export const postSignup = (req, res, next) => {
  const { name, email, password } = req.body;

  User.findOne({ email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash('error', 'Email is already exist, please pick another one');
        return res.redirect("/signup");
      }

      return bcrypt.hash(password, 12).then((bcyPassword) => {
        const user = new User({
          name,
          email,
          password: bcyPassword,
          cart: {
            items: [],
          },
        });

        return user.save();
      }).then(result => {
        const message = {
          to: email,
          from: 'shahbozbek10199701@gmail.com',
          subject: 'Welcome',
          text: "Thank you for signing up with us."
        }

        res.redirect('/login');

        return etherealMail(message, messageUrl => console.log(messageUrl));
      });
    })
    .catch((err) => console.log(err));
};

export const postLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("session destroy error");
    }

    res.redirect("/");
  });
};

export const postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      return res.redirect('/reset');
    }

    const token = buffer.toString('hex');

    User
      .findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash('error', 'No account with that email found.');
          res.redirect('/reset');
          return null;
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + (60 * 60 * 1000);
        return user.save();
      })
      .then(result => {
        if (result) {
          etherealMail({
            to: req.body.email,
            from: 'rakhmonovshope0110@mail.ru',
            subject: 'Reset Password',
            html: `<p>You requested password reset.</p>
             <p> Click this link to set a new password:</p>
             <a href="http://localhost:3000/reset/${token}">http://localhost:3000/reset/${token}</a>`
          }, messageUrl => console.log(messageUrl));
          res.redirect('/');
        }
      })
      .catch(err => console.log(err));
  })
};

export const getNewPassword = (req, res, next) => {
  const token = req.params.token;

  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } }).then(user => {
    const [message] = req.flash('error');

    res.render('auth/new-password', {
      path: '/new-password',
      pageTitle: 'New password',
      errorMessage: message || null,
      userId: user._id.toString(),
      resetToken: token,
    })
  }).catch(err => console.log(err))
}

export const postNewPassword = (req, res, next) => {
  const { resetToken, userId, password } = req.body;
  let resetUser;
  User.findOne({ _id: userId, resetToken, resetTokenExpiration: { $gt: Date.now() } }).then(user => {
    resetUser = user;

    return bcrypt.hash(password, 12)
  }).then(hashedPassword => {
    resetUser.password = hashedPassword;
    resetUser.resetToken = undefined;
    resetUser.resetTokenExpiration = undefined;

    return resetUser.save();
  }).then(result => {
    res.redirect('/login');
  }).catch(err => console.log(err))
}
