const User = require("./models").User;
const Collaborator = require("./models").Collaborators;
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
    },

    // getUserCollabs(id, callback) {
    //     let result = {};
    //     User.findById(id).then(user => {
    //         if (!user) {
    //             callback(404);
    //         } else {
    //             result["user"] = user;
    //             Collaborator.findAll({
    //                 where: {
    //                     userId: user.id
    //                 }
    //             })
    //                 .then(collaborations => {
    //                     result["collaborations"] = collaborations;
    //                     callback(null, result);
    //                 })
    //                 .catch(err => {
    //                     callback(err);
    //                 });
    //         }
    //     });
    // }

    getUserCollabs(id, callback) {
        let result = {};
        User.findById(id).then(user => {
            if (!user) {
                callback(404);
            } else {
                result["user"] = user;
                Collaborator.scope({ method: ["collaborationsFor", id] })
                    .all()
                    .then(collaborations => {
                        result["collaborations"] = collaborations;
                        callback(null, result);
                    })
                    .catch(err => {
                        callback(err);
                    });
            }
        });
    }
};
