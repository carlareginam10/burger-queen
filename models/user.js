'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Orders, {
      foreignKey: 'uid'
    });
  };
  // sequelize.sync()
  //   .then(() => {
  //     User.create({email:"vanessa@gmail.com"});
  //     User.create({email:"luffy@gmail.com"});
  //     User.create({email:"gon@gmail.com"});
  //     User.create({email:"nami@gmail.com"});
  //   });
    
  return User;
};
