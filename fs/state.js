function(Util) {
    return {
        Util: Util,

        state: {
            servoOpen: false,
            temperature: 0
        },

        listeners: [],

        getState: function() {
            return this.Util.mergeObj({}, this.state);
        },

        dispatch: function(action) {
            this.state = (function(state, action) {
                if (action.type === 'UPDATE_TEMPERATURE') {
                    state.temperature = action.temperature;
                } else if (action.type === 'UPDATE_SERVO_STATE') {
                    state.servoOpen = action.servoOpen;
                }

                return state;
            })(this.getState(), action);

            for (let i = 0; i < this.listeners.length; i++) {
                let listener = this.listeners[i];
                listener();
            }
        },

        subscribe: function(listener) {
            let isSubscribed = true;

            this.listeners[this.listeners.length] = listener;
        }
    };
}
