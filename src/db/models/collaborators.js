"use strict";
module.exports = (sequelize, DataTypes) => {
    const Collaborators = sequelize.define(
        "Collaborators",
        {
            wikiId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {}
    );
    Collaborators.associate = function(models) {
        Collaborators.belongsTo(models.Wiki, {
            foreignKey: "wikiId",
            onDelete: "CASCADE"
        });

        Collaborators.belongsTo(models.User, {
            foreignKey: "userId",
            onDelete: "CASCADE"
        });

        Collaborators.addScope("collaboratorsFor", wikiId => {
            return {
                include: [
                    {
                        model: models.User
                    }
                ],
                where: { wikiId: wikiId },
                order: [["createdAt", "ASC"]]
            };
        });

        Collaborators.addScope("collaborationsFor", userId => {
            return {
                include: [
                    {
                        model: models.Wiki
                    }
                ],
                where: { userId: userId },
                order: [["createdAt", "ASC"]]
            };
        });
    };
    return Collaborators;
};
