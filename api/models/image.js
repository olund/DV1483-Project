
module.exports = function(sequelize, DataTypes) {
    var image = sequelize.define("image", {
        id: { type: DataTypes.INTEGER, primaryKey: true,  autoIncrement: true },
        reports: DataTypes.INTEGER,
        path: DataTypes.TEXT,
    }, {}
    );

    return image;
};

