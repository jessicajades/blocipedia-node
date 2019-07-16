module.exports = class ApplicationPolicy {
    constructor(user, record) {
        this.user = user;
        this.record = record;
    }

    _isOwner() {
        return this.record && this.record.userId == this.user.id;
    }

    _isMember() {
        return this.user && this.user.role == 0;
    }

    _isPremium() {
        return this.user && this.user.role == 1;
    }

    _isAdmin() {
        return this.user && this.user.role == 2;
    }

    new() {
        return this.user != null;
    }

    create() {
        return this.new();
    }

    show() {
        return true;
    }

    edit() {
        return (
            this.new() &&
            this.record &&
            (this._isMember() || this._isPremium() || this._isAdmin())
        );
    }

    update() {
        return this.edit();
    }

    destroy() {
        return this.update();
    }
};
