'use strict';
module.exports = (sequelize, DataTypes) => {
  const OrderProducts = sequelize.define('OrderProducts', {
    orderId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER
  }, {});
  OrderProducts.associate = function(models) {
    OrderProducts.belongsTo(models.Products, {foreignKey: 'productId'});
    OrderProducts.belongsTo(models.Orders, {foreignKey: 'orderId'});
  };
  
  // sequelize.sync()
  // .then(() => {
  //   OrderProducts.create({orderId: 1}, {where:{id:1}});
  //   OrderProducts.create({orderId: 1}, {where:{id:2}});
  //   OrderProducts.create({orderId: 2}, {where:{id:3}});
  //   OrderProducts.create({orderId: 3}, {where:{id:4}});
  //   OrderProducts.create({orderId: 4}, {where:{id:5}});
  // });

  return OrderProducts;
};