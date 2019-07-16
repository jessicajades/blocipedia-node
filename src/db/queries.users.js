const User = require("./models").User;
const bcrypt = require("bcryptjs");

module.exports = {
    createUser(newUser, callback) {
        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(newUser.password, salt);

        return User.create({
            username: newUser.username,
            email: newUser.email,
            password: hashedPassword
        })
            .then(user => {
                callback(null, user);
            })
            .catch(err => {
                callback(err);
            });
    },

    getUser(id, callback) {
        return User.findOne({
            where: {
                id: id
            }
        })
            .then(user => {
                callback(null, user);
            })
            .catch(err => {
                callback(err);
            });
    },

    upgradeUser(id, callback) {
        User.findById(id)
            .then(user => {
                user.update({
                    role: 1
                });
                callback(null, user);
            })
            .catch(err => {
                callback(err);
            });
    },

    downgradeUser(id, callback) {
        User.findById(id)
            .then(user => {
                user.update({
                    role: 0
                });
                callback(null, user);
            })
            .catch(err => {
                callback(err);
            });
    }
};
