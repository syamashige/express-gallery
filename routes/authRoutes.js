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
    id: users_table.attributes.id,
    user: users_table.attributes.username
  })
})


// // upon successful authorized request, we will take some information
// // from the session, for example userId, to retrieve
// // the user record from db, and put it into req.user
passport.deserializeUser( (user, done) => {
  console.log('deserializing user', user) 
  Users
    .where({ id: users_table.id})
    .fetch()
    .then( user => {
      done(null, users_table.attributes)
    })
    .catch( err => {
      done(err)
    })
})

passport.use(new LocalStrategy({usernameField: 'username'}, (fullname, username, password, done) => {
  Users
    .where({ fullname, username })
    .fetch()
    .then( user => {
      console.log('user in localstrategy db', user)
      myHackyGlobalStorage = user
      bcrypt.compare(password, users_table.attributes.passwords)
        .then( result => {
          if (result) {
            done(null, user)
          } else {
            done(null, false)
          }
         })
        .catch( err => {
          done(err)
        })
    })
    .catch( err => {
      console.log('err', err)
    })
    
}))

router.post('/register', (req, res) => {
  const {fullname, username, password} = req.body;
  bcrypt.hash(password, 10)
    .then( hashedPassword => {
      console.log('after hash received', hashedPassword)
      console.log('username', username)
      return Users
              .forge({fullname, username, passwords: hashedPassword}) // Need to reference db columns here
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

router.post('/login',passport.authenticate('local', {failureRedirect: '/'}), (req, res) => {
res.send('You Are Authenticated!')
})

// router.post('/login', (req, res) => {
//   const { fullname, username, password } = req.body;
//   Users
//     .where({ fullname, username, password })
//     .fetch()
//     .then( user => {
//       if (password === users_table.attributes.passwords) {
//         res.send('You are authenticated aka logged in!')
//       } else {
//         res.send('Wrong login credentials or no user exist')
//       }
//     })
//     .catch( err => {
//       console.log('err', err)
//       res.send(err)
//     })
// })

router.post('/logout', (req, res) => {
  req.logout()
  res.send('loggedout')
})

// router.get('/protected',isAuthenticated, (req, res) => {
//   res.render('myAwesomeDashboard', {user: req.user} )
//   console.log(req.user);
// })

router.get('/protected', (req, res) => {
  res.send('You Are Authenticated!')
})

// function isAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     next()
//   } else {
//     res.redirect('/')
//   }
// }

module.exports = router