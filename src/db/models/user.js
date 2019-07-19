"use strict";
module.exports = (sequelize, DataTypes) => {
    var User = sequelize.define(
        "User",
        {
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: { msg: "must be a valid email" }
                }
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            role: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            }
        },
        {}
    );
    User.associate = function(models) {
        User.hasMany(models.Wiki, {
            foreignKey: "userId",
            as: "wikis"
        });
        User.hasMany(models.Collaborators, {
            foreignKey: "userId",
            as: "collaborators"
        });
    };
    return User;
};
