const collaboratorQueries = require("../db/queries.collaborators.js");
const wikiQueries = require("../db/queries.wikis.js");
const Wiki = require("../db/models").Wiki;

module.exports = {
    editPage(req, res, next) {
        collaboratorQueries.getCollaborators(
            req.params.wikiId,
            (err, result) => {
                if (err) {
                    req.flash("error", err);
                    res.redirect(404, "/");
                } else {
                    res.render("collaborators/edit", { ...result });
                }
            }
        );
    },

    create(req, res, next) {
        if (req.user) {
            collaboratorQueries.createCollaborator(req, (err, collaborator) => {
                if (err) {
                    req.flash("error", err);
                }
            });
        }
        res.redirect(req.headers.referer);
    },

    destroy(req, res, next) {
        if (req.user) {
            console.log("hello from req.user");
            collaboratorQueries.deleteCollaborator(req, (err, collaborator) => {
                if (err) {
                    req.flash("error", err);
                }
                res.redirect(req.headers.referer);
            });
        } else {
            req.flash("notice", "You must be signed in to do that.");
            res.redirect(req.headers.referer);
        }
    }
};
