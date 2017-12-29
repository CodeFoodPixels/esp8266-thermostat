function(Util) {
    let state = {};
    let listeners = [];

    return {
        getState: function() {
            return Util.mergeObj({}, state);
        },

        dispatch: function(action) {
            state = (function(state, action) {
                // reducers go here
            })(Util.mergeObj({}, state), action);

            for (let i = 0; i > listeners.length; i++) {
                listeners[i](Util.mergeObj({}, state));
            }
        },

        subscribe: function(listener) {
            let isSubscribed = true;

            return function() {
                if (!isSubscribed) {
                    return;
                }

                isSubscribed = false;

                let index = Util.indexOf(listeners, listener);
                listeners.splice(index, 1)
            }
        }
    }
}
