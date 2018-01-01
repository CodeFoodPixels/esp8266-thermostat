function(Util) {
    return {
        Util: Util,

        state: {},

        listeners: [],

        initialized: false,

        initializeStore: function(initialState) {
            this.state = this.Util.mergeObj({}, initialState);

            this.initialized = true;
        },

        getState: function() {
            return this.Util.mergeObj({}, this.state);
        },

        dispatch: function(action) {
            if (!this.initialized) {
                return false;
            }

            this.state = (function(state, action) {
                if (action.type === 'UPDATE_TEMPERATURE') {
                    state.temperature = action.temperature;
                } else if (action.type === 'UPDATE_SERVO_STATE') {
                    state.servoOpen = action.servoOpen;
                } else if (action.type === 'UPDATE_CONFIG') {
                    state.config = action.config;
                }

                return state;
            })(this.getState(), action);

            for (let i = 0; i < this.listeners.length; i++) {
                let listener = this.listeners[i].listener;
                let userdata = this.listeners[i].userdata;
                listener(userdata);
            }
        },

        subscribe: function(listener, userdata) {
            let isSubscribed = true;

            this.listeners[this.listeners.length] = {listener: listener, userdata: userdata};
        }
    };
}
