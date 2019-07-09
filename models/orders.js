'use strict';
module.exports = (sequelize, DataTypes) => {
  const Orders = sequelize.define('Orders', {
    status: DataTypes.STRING,
    uid: DataTypes.INTEGER
  }, {});
  Orders.associate = function(models) {
    Orders.belongsTo(models.User, {foreignKey: 'uid'});
    Orders.hasMany(models.OrderProducts, {foreignKey: 'orderId'});
  };
  // sequelize.sync()
  // .then(() => {
  //   Orders.create({status: 'PENDING', uid: 1});
  //   Orders.create({status: 'DELIVERED', uid: 2});
  //   Orders.create({status: 'DELIVERED', uid: 3});
  //   Orders.create({status: 'PENDING', uid: 4});
  // });
  return Orders;
};