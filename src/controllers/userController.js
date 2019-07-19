const userQueries = require("../db/queries.users.js");
const wikiQueries = require("../db/queries.wikis.js");
const collaboratorQueries = require("../db/queries.collaborators.js");
const passport = require("passport");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const stripe = require("stripe")(process.env.STRIPE_API_KEY);

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
    },

    signInForm(req, res, next) {
        res.render("users/signin");
    },

    signIn(req, res, next) {
        passport.authenticate("local")(req, res, function() {
            if (!req.user) {
                req.flash("notice", "Sign in failed. Please try again.");
                res.redirect("/users/signin");
            } else {
                req.flash("notice", "You've successfully signed in!");
                res.redirect("/");
            }
        });
    },

    signOut(req, res, next) {
        req.logout();
        req.flash("notice", "You've successfully signed out!");
        res.redirect("/");
    },

    show(req, res, next) {
        userQueries.getUser(req.params.id, (err, result) => {
            // console.log("result.user", result.user);
            if (err || result === undefined) {
                // console.log("error", err);
                req.flash("notice", "No user found with that ID.");
                res.redirect("/");
            } else {
                // console.log("ELSE", user);
                res.render("users/show", { result });
            }
        });
    },

    upgradeForm(req, res, next) {
        res.render("users/upgradeForm");
    },

    upgrade(req, res, next) {
        userQueries.upgradeUser(req.params.id, (err, result) => {
            const amount = 1499;

            stripe.customers
                .create({
                    email: req.body.stripeEmail,
                    source: req.body.stripeToken
                })
                .then(customer => {
                    return stripe.charges.create({
                        amount,
                        description: "Blocipedia premium upgrade",
                        currency: "usd",
                        customer: customer.id
                    });
                })
                .then(charge => {
                    if (charge) {
                        req.flash(
                            "notice",
                            "Success - You are now a premium member!"
                        );
                        res.redirect("/");
                    } else {
                        req.flash("notice", "Error - upgrade unsuccessful");
                        res.redirect("/users/show", { user });
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        });
    },

    downgradeForm(req, res, next) {
        res.render("users/downgradeForm");
    },

    downgrade(req, res, next) {
        userQueries.downgradeUser(req.params.id, (err, result) => {
            if (result) {
                wikiQueries.downgrade(result.id);
                req.flash(
                    "notice",
                    "You have been successfully downgraded to a standard member"
                );
                res.redirect("/");
            } else {
                req.flash("notice", "Error - downgrade unsuccessful");
                res.redirect("/users/show", { result });
            }
        });
    },

    showCollabs(req, res, next) {
        userQueries.getUserCollabs(req.user.id, (err, result) => {
            if (err || result == null) {
                res.redirect(404, "/");
            } else {
                res.render("users/collaborations", { ...result });
            }
        });
    }
};
