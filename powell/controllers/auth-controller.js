const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Styles = require('../models/PowellStyle');
const Style = require('../models/PowellStyle');


exports.getSignup = (req, res) => {
  res.render("auth/signup", { pageTitle: "Sign Up", path: req.baseUrl, messages: req.flash('error') });
};

exports.getLogin = (req, res) => {
  res.render("auth/login", { pageTitle: "Log In", path: req.baseUrl,messages: req.flash('error') });
};

exports.postSignup = (req, res, next) => {
  const username = req.body.username
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash(
          "error",
          "E-Mail exists already, please pick a different one."
        );
        console.log("user already exists!")
        return res.redirect("/auth/signup");
      }
      const user = new User({
        username: username,
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
      });
      return user.save()
        .then((result) => {
          res.redirect("/auth/login");
        });
    })

    .catch((err) => {
      console.log(err);
    });
};

exports.findUser = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        // req.flash('error', 'Invalid email or password.');
        // return res.redirect('/auth/login');
        next();
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          res.locals.doMatch = doMatch;
          res.locals.user = user;
          // Call the next function
          next();
        })
    })
    .catch(err => console.log(err));
}

exports.processLogin = (req, res, next) => {
  let doMatch = res.locals.doMatch;
  let user = res.locals.user;

  if (doMatch && user) {
    req.session.isLoggedIn = true;
    req.session.user = user;
    req.session.firstname = user.firstname;
    return req.session.save(err => {
      console.log(err);
      if (!err) {
        req.flash('success', `Welcome, ${user.firstname}!`);
        // Here, the user.firstName is added to the flash message.
      }
      res.redirect('/');
    });
  }
  req.flash('error', 'Invalid email or password.');
  res.redirect('/auth/login');
};



// exports.postLogin = (req, res, next) => {
//     const email = req.body.email;
//     const password = req.body.password;
//     User.findOne({ email: email })
//       .then(user => {
//         if (!user) {
//           req.flash('error', 'Invalid email or password.');
//           return res.redirect('/auth/login');
//         }
//         bcrypt
//           .compare(password, user.password)
//           .then(doMatch => {
//             if (doMatch) {
//               req.session.isLoggedIn = true;
//               req.session.user = user;
//               return req.session.save(err => {
//                 console.log(err);
//                 if (!err) {
//                   req.flash('success', `Welcome, ${user.firstname}!`)
//                 }
//                 res.redirect('/');
//               });
//             }
//             req.flash('error', 'Invalid email or password.');
//             res.redirect('/auth/login');
//           })
//           .catch(err => {
//             console.log(err);
//             res.redirect('/auth/login');
//           });
//       })
//       .catch(err => console.log(err));
//   };

exports.getLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};



exports.addFavoriteStyle = async (req, res) => {
  const userId = req.session.user._id;
  const styleId = req.params.styleId;

  try {
    const user = await User.findById(userId);

    if (user.favoriteStyles.includes(styleId)) {
      // Style is already in user's favorite styles list
      res.redirect('/styles');
      return;
    }

    user.favoriteStyles.push(styleId);
    await user.save();

    res.redirect('/styles');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving favorite style');
  }
};

//exports.getFavoriteStyles = async (req, res) => {
  //const user = req.session.user;
//}

exports.getFavoriteStyles = async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id, 'favoriteStyles');
    const favoriteStyleIds = user.favoriteStyles;
    const styles = await Style.find({ _id: { $in: favoriteStyleIds } });
    res.render('favorite-styles', { pageTitle: "Favorite Styles", path: req.baseUrl, styles });
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while retrieving favorite styles');
  }
};



exports.getAdminUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.render('/users', {pageTitle: "Users", path: req.baseUrl, users});
  } catch (err) {
    next(err);
  }
};

exports.updateAdminUsers = async (req, res, next) => {
  const users = req.body.users;
  try {
    for (let i = 0; i < users.length; i++) {
      const user = await User.findByIdAndUpdate(
        users[i].id,
        { isAdmin: users[i].isAdmin === 'on' ? true : false },
        { new: true }
      );
    }
    res.redirect('/auth/users');
  } catch (err) {
    return res.status(500).send(err);
  }
};

exports.postComment = async (req, res) => {
  const { content } = req.body;
  const { postId } = req.params;

  if (!req.isAuthenticated()) {
      return res.status(401).send('User must be logged in to post comments');
  }

  try {
      await User.findByIdAndUpdate(req.user._id, {
          $push: {
              comments: {
                  postId,
                  username: req.user.username, // Add the username to each comment
                  content
              }
          }
      });
      res.redirect(`/blog/${postId}`);
  } catch (error) {
      res.status(500).send('Error posting comment');
  }
};