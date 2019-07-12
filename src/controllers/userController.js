const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
    index(req, res, next) {
        res.send("TODO: list all users");
    },

    signup(req, res, next) {
        res.render("users/signup");
    },

    create(req, res, next) {
        let newUser = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            passwordConfirmation: req.body.passwordConfirmation
        };
        const msg = {
            to: newUser.email,
            from: "jessicajadecodes@gmail.com",
            subject: "Welcome to Blocipedia!",
            text: "You can now create unlimited public wikis!",
            html:
                "<strong>upgrade to premium for access to private wikis</strong>"
        };
        userQueries.createUser(newUser, (err, user) => {
            if (err) {
                req.flash("error", err);
                res.redirect("/users/signup");
            } else {
                passport.authenticate("local")(req, res, () => {
                    req.flash("notice", "You've successfully signed in!");
                    res.redirect("/");
                });
            }
        });
        sgMail.send(msg);
    }
};
