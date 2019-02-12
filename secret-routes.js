const router = require('express').Router()
const models = require('./models')




router.use('/user/:username/:tweetId', require('./auth'))//fungerar bara på /adressen
//DELETE tweet by username of author and id of tweet */
router.delete('/user/:username/:tweetId', (req,res)=> {
    models.User.findOne({
      where:{username: req.params.username}
    }).then(user =>{
      if(!user) return res.status(404).send('User not found')
  
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
  
router.use('/user/:username', require('./auth'))//fungerar bara på /adressen
  //DELETE User from database, requires username and password, Basic Auth
router.delete('/user/:username', (req,res)=> {

    models.User.findOne({
      where:{username: req.params.username}
    }).then(user =>{
      if(!user) return res.status(404).send('User not found')
  
      models.User.destroy({
        where: { id: user.id}      
      }).then(()=>{
        res.json({ success: true })
      })

    }).catch(error=>{
      console.log(error)
      res.status(500).send("Something went wrong!!" + error)
    })
  })
  //*** end DELETE user */
  

  router.use('/:username', require('./auth'))//fungerar bara på /adressen

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
