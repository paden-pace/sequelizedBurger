


module.exports = function(sequelize, DataTypes) {
  var Burger = sequelize.define("Burger", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 140]
      }
    },
    devoured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    } 
  });
  return Burger;
}; 
 

  // , 
  //   {
  //   classMethods: {
  //     associate: function(models) {
  //       // Using additional options like CASCADE etc for demonstration
  //       // Can also simply do Task.belongsTo(models.User);
  //       Post.belongsTo(models.Customer, {
  //         foreignKey: {
  //           allowNull: false
  //         }
  //       })
  //     }
  //   }
  // }