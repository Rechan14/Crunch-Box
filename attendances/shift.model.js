// module.exports = (sequelize, DataTypes) => {
//   const Shift = sequelize.define('Shift', {
//     timeIn: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     timeOut: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     userId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//   });

// Shift.associate = (models) => {
//     Shift.belongsTo(models.Account, { foreignKey: 'userId' });
//   };

//   return Shift;
// };

