const crypto = require('crypto')
const models = require('./models')
// const bodyParser = require('body-parser')

module.exports = (req,res,next)=>{
    models.User.findOne({
        where:{username: req.params.username}
    }).then(user =>{
        if(!req.headers.hasOwnProperty('authorization')) return res.status(401).send('Unauthorized you need to have a username and password registred')
        if(req.headers.authorization.indexOf('Basic') === -1)return res.status(401).send('Unauthorized')

        let credentials = req.headers.authorization.replace('Basic ', '')
        credentials = new Buffer(credentials, 'base64').toString('ascii').split(':')
        // console.log(credentials)
        if(credentials[0] !== user.username) return res.status(401).send('Unauthorized,Error: Username')
        if(crypto.pbkdf2Sync(credentials[1], user.salt, 10000, 256, 'sha512').toString('hex') !==user.password){
        return res.status(401).send('Unauthorized,Error: Password')
        }
        next()
    }).catch(error=>{
        console.log(error)
        res.status(500).send("Something went wrong!!")
    })
    
}