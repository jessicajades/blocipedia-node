const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {
    new() {
        return this._isPremium() || this._isAdmin() || this._isMember();
    }

    create() {
        return this.new();
    }

    newPrivate() {
        return this._isPremium() || this._isAdmin();
    }

    createPrivate() {
        return this.newPrivate();
    }

    edit() {
        return this._isMember() || this._isPremium() || this._isAdmin();
    }

    update() {
        return this.edit();
    }

    destroy() {
        return this.update();
    }
};
