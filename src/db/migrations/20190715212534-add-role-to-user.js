"use strict";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn("Users", "role", {
            type: Sequelize.STRING,
            defaultValue: 0,
            allowNull: false
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn("Users", "role");
    }
};
