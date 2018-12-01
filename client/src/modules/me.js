
import gate from '../modules/gate'

const Module = {
    user: null,

    refreshPromise: null,
    refresh () {
        if (this.refreshPromise) return;
        
        this.refreshPromise = gate.ask('/users/me');
        this.refreshPromise.then(this.onSuccess.bind(this));
        this.refreshPromise.then(this.onFailed.bind(this));

		return this.refreshPromise;
    },
    onSuccess (user) {
        this.user = user;
        this.refreshPromise = null;
    },
    onFailed (error) {
        this.refreshPromise = null;
        console.error(error);
    },
};

Module.refresh();

export default Module;
