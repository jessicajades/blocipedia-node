const Wiki = require("./models").Wiki;
const Collaborator = require("./models").Collaborators;
const User = require("./models").User;
const Authorizer = require("../policies/application");

module.exports = {
    createCollaborator(req, callback) {
        if (req.user.username == req.body.collaborator) {
            return callback("Cannot add yourself as a collaborator");
        }

        User.findOne({
            where: {
                username: req.body.collaborator
            }
        }).then(user => {
            if (!user) {
                return callback("Unable to locate user");
            }

            Collaborator.findOne({
                where: {
                    userId: user.id,
                    wikiId: req.params.wikiId
                }
            }).then(collaborator => {
                if (collaborator) {
                    return callback(
                        "The user you selected is already a collaborator on this wiki"
                    );
                }

                let newCollaborator = {
                    userId: user.id,
                    wikiId: req.params.wikiId
                };

                return Collaborator.create(newCollaborator)
                    .then(collaborator => {
                        callback(null, collaborator);
                    })
                    .catch(err => {
                        callback(err);
                    });
            });
        });
    },

    deleteCollaborator(req, callback) {
        let userId = req.body.collaborator;
        let wikiId = req.params.wikiId;

        console.log("req.body: ", req.body);

        Collaborator.destroy({
            where: {
                userId: userId,
                wikiId: wikiId
            }
        })
            .then(deletedRecordsCount => {
                callback(null, deletedRecordsCount);
            })
            .catch(err => {
                callback(err);
            });
    },

    getCollaborators(id, callback) {
        let result = {};

        Wiki.findOne({
            where: { id: id }
        }).then(wiki => {
            if (!wiki) {
                callback(404);
            } else {
                result["wiki"] = wiki;
                Collaborator.scope({ method: ["collaboratorsFor", wiki.id] })
                    .findAll()
                    .then(collaborators => {
                        result["collaborators"] = collaborators;
                        callback(null, result);
                    })
                    .catch(err => {
                        callback(err);
                    });
            }
        });
    }
};
