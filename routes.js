const router = require('express').Router()
const crypto = require('crypto')

const models = require('./models')

router.use('/secret', require('./secret-routes'))

router.get('/', (req, res) => {
    models.User.findAll({
      attributes: [ 'name', 'username' ]
    }).then(users => {
      res.json({
          authors: users.map(users =>users.username),
      }) 
    }).catch(error=>{
      res.status(500).send("Something went wrong")
    })
  })
 
  
  router.get('/:user', (req, res) => {
    models.User.findOne({
      where: { username: req.params.user }
    }).then(user => {
      // console.log(user)
      if (!user) return res.status(404).send('User! Not found.')
  
      models.Tweets.findAll({
        where: { userId: user.id },
        attributes: [ 'content', 'id' ]
      }).then(tweets => {
        console.log()
        res.json({
          author:user.name,
          username:user.username,
          userId:user.id,
          tweets:tweets
        })
      }).catch(error => {
        res.status(500).send("Something went wrong")
      })
    })
  })
  
  
  //create a new user
  router.post('/register', (req,res)=>{
    // //   res.json(req.body)
    //   console.log(req.body)
      const salt = crypto.randomBytes(256).toString('hex')
      const password = crypto.pbkdf2Sync(req.body.password, salt, 10000, 256, 'sha512').toString('hex')
    models.User.create({
      name: req.body.name,
      username: req.body.username,
      password: password,
      salt: salt
    }).then(user=>{
      res.json({success:true})
  
    }).catch(error=>{
      console.log(error)
      res.status(500).send("Something went wrong")
    })
  })

  module.exports = router