load('api_rpc.js');

function(Config, Schedule, State) {
    RPC.addHandler('config.set', function (newConfig) {
        if (newConfig === null) {
            return false;
        }

        Config.merge(newConfig);
        Schedule.buildSchedule();
        Schedule.buildOverride();

        return true;
    });

    RPC.addHandler('config.get', function () {
        return Config.get();
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
