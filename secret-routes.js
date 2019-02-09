const router = require('express').Router()
const models = require('./models')
const auth = require('./auth')
const crypto = require('crypto')



router.use('/user/:username/:tweetId', require('./auth'))//fungerar bara på /adressens
//DELETE tweet by username of author and id of tweet */
router.delete('/user/:username/:tweetId', (req,res)=> {
    models.User.findOne({
      where:{username: req.params.username}
    }).then(user =>{
      if(!user) return res.status(404).send('User not found')
  
      if(!req.headers.hasOwnProperty('authorization')) return res.status(401).send('Unauthorized - Error need a username and password')
      if(req.headers.authorization.indexOf('Basic') === -1)return res.status(401).send('Unauthorized')
  
      let credentials = req.headers.authorization.replace('Basic ', '')
      credentials = new Buffer(credentials, 'base64').toString('ascii').split(':')
      // console.log(credentials)
      if(credentials[0] !== user.username) return res.status(401).send('Unauthorized - Error with Username')
      if(crypto.pbkdf2Sync(credentials[1], user.salt, 10000, 256, 'sha512').toString('hex') !==user.password){
        return res.status(401).send('Unauthorized - Error with Password')
      }
  
      models.Tweets.destroy({
        where: { id: req.params.tweetId}      
      }).then(()=>{
        res.json({ success: true })
      })
   
      // console.log(user)
    }).catch(error=>{
      console.log(error)
      res.status(500).send("Something went wrong!!")
    })
  })
  //*** */end Delete tweet*/
  
router.use('/user/:username', require('./auth'))//fungerar bara på /adressens
  //DELETE User from database, requires username and password, Basic Auth
router.delete('/user/:username', (req,res)=> {

    models.User.findOne({
      where:{username: req.params.username}
    }).then(user =>{
      if(!user) return res.status(404).send('User not found')
  
      if(!req.headers.hasOwnProperty('authorization')) return res.status(401).send('Unauthorized')
      if(req.headers.authorization.indexOf('Basic') === -1)return res.status(401).send('Unauthorized')
  
      let credentials = req.headers.authorization.replace('Basic ', '')
      credentials = new Buffer(credentials, 'base64').toString('ascii').split(':')
      // console.log(credentials)
      if(credentials[0] !== user.username) return res.status(401).send('Unauthorized')
      if(crypto.pbkdf2Sync(credentials[1], user.salt, 10000, 256, 'sha512').toString('hex') !==user.password){
        return res.status(401).send('Unauthorized')
      }
  
      models.User.destroy({
        where: { id: user.id}      
      }).then(()=>{
        res.json({ success: true })
      })
   
      // console.log(user)
    }).catch(error=>{
      console.log(error)
      res.status(500).send("Something went wrong!!" + error)
    })
  })
  //*** end DELETE user */
  

  router.use('/:username', require('./auth'))//fungerar bara på /adressens

  //Post a new tweet that is connected to the user
  router.post('/:username', (req,res) => {
      models.User.findOne({
          where: {
              username: req.params.username
          }
      }).then(user=>{
          if(!user) return res.status(404).send('User not found')
    
          models.Tweets.create({
              content: req.body.content,
              userId: user.id        
          }).then(tweet => {
              res.json({success:true})
          }).catch(error =>{
              res.status(500).send("Something went wrong")
          })
    
      }).catch(error =>{
          res.status(500).send("Something went wrong")
          console.log(error)
      })
    })
    //end post new tweet
  

module.exports = router
