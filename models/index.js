const Sequelize = require('sequelize')
const fs = require('fs')

const connection = new Sequelize('twitter_uppg', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: () => {},
  operatorsAliases: false
})

const models ={}
let files = fs.readdirSync(__dirname)
//read all files in the models directory. remove the index.js file and remove the .js from rest
files = files.filter(file => file !== 'index.js').map(file =>file.replace('.js',''))

files.forEach(file=>{
    models[file]=connection.import(file)
})

models.Tweets.belongsTo(models.User, { foreignKey: 'userId' })
// connection.authenticate().then(_ => {
//   console.log('Successfully connected to DB! :)')
// }).catch(error => {
//   console.log('Could not connect to DB. Reason: ', error)
// })

// connection.sync({ force: true }).then(_ => {
//   console.log('Database synchronized!')
// })

module.exports = models