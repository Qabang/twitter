module.exports = (connection, DataTypes) =>{
    return connection.define('user', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          username: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique:true
          },
          name: {
            type: DataTypes.STRING(255),
            allowNull: false
          },
          password: {
              type: DataTypes.STRING(512),
              allowNull:false
          },
          salt: {
              type: DataTypes.STRING(512),
              allowNull:false
          }

    })
}