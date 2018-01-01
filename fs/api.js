load('api_rpc.js');

function(Config, Schedule, State, Util) {
    RPC.addHandler('config.set', function (newConfig) {
        if (newConfig === null) {
            return false;
        }

        let config = State.getState().config;

        State.dispatch(Config.save(Util.mergeObj(config, newConfig)));

        return true;
    });

    RPC.addHandler('config.get', function () {
        let state = State.getState();
        return state.config;
    });

    RPC.addHandler('status', function () {
        let currentSchedule = Schedule.currentSchedule();
        let state = State.getState();

        return {
            schedule: {
                start: currentSchedule.start,
                end: currentSchedule.end,
                state: currentSchedule.on ? 'on' : 'off'
            },
            override: Schedule.currentOverride(),
            state: state.servoOpen ? 'on' : 'off',
            temperature: state.temperature
        };
    })
}
