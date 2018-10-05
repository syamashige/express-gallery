const express = require('express');
const router = express.Router();
const Users = require('../models/Users');
const Content = require('../models/Content');
const passport = require('passport');
const LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt')


// // upon successful login, get user from database, save
// // user data into session, which is in Redis.
passport.serializeUser( (user, done) => {
  console.log('serializing user', user)
  done(null, {
    username: user.username,
    fullname: user.fullname,
    zomg: 'randomData'
  })
})


// // upon successful authorized request, we will take some information
// // from the session, for example userId, to retrieve
// // the user record from db, and put it into req.user
passport.deserializeUser( (user, done) => {
  console.log('01 - deserializing User', user)
  Users
    .where({username: user.username})
    .fetch()
    .then( user => {
      user = user.toJSON();
      done(null, user)
    })
    .catch( err => {
      console.log('err', err)
    })
})

passport.use(new LocalStrategy((username, password, done) => {
  console.log('02 - local is being called', username)
  Users
    .where({username})
    .fetch()
    .then( user => {
      console.log('user in local strategy', user)
      user = user.toJSON();
      bcrypt.compare(password, user.passwords)
        .then( res => {
          if (res) {
            done(null, user)
          } else {
            done(null, false)
          }
        })
    })
    .catch( err => {
      done(null, false)
    })
}))


router.post('/register', (req, res) => {
  const {fullname, username, password} = req.body;
  bcrypt.hash(password, 10)
    .then( hashedPassword => {
      console.log('after hash received', hashedPassword)
      console.log('username', username)
      return Users
        .forge({
          fullname: req.body.fullname,
          username: req.body.username,
          passwords: hashedPassword
        }) // Need to reference db columns here
              .save()
    })
    .then( result => {
      if (result) {
        res.send('New User Created')
      } else {
        res.send('Error Making User!!!')
      }
    })
    .catch( err=> {
      console.log('error', err)
      res.send(err)
    })
})

router.post('/login', passport.authenticate('local', {
  successRedirect: './protected',
  failureRedirect: './login',
  failureFlash: true })
)

router.post('/logout', (req, res) => {
  req.logout()
  console.log('loggedout');
  res.redirect('/')

  // res.send('loggedout')
})

router.get('/protected',isAuthenticated, (req, res) => {
  console.log('STARS!!!!!!!!**88*****', req.session)
  // username: user.username,
  // fullname: user.fullname,
  
  // console.log('THIS IS ALL THE USERS', req.user)
  // console.log('THIS IS ONE USER', req.session.passport.user.fullname)
  // console.log('THIS IS ALL THE USERS', req.session.passport.user)
  
  res.render('../views/edituser', {
    user: req.session.passport.user
    // fullname: req.session.passport.user.fullname

  })
})



function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect('/')
  }
}

module.exports = router