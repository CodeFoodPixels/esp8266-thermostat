load('api_timer.js');

function(Util, State) {
    let Schedule = {
        _schedule: {},

        _override: {},

        Util: Util,

        State: State,

        buildSchedule: function() {
            print('building schedule');
            let schedule = this.State.getState().config.schedule;
            let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            let builtSchedule = {
                Monday: [],
                Tuesday: [],
                Wednesday: [],
                Thursday: [],
                Friday: [],
                Saturday: [],
                Sunday: []
            };

            for (let i = 0; i < 7; i++) {
                let day = days[i];
                let daySchedule = schedule[day];

                builtSchedule[day][0] = {
                    start: { hour: 0, minute: 0 },
                    end: { hour: 24, minute: 00 },
                    on: false
                }

                for (let a = 0; a < daySchedule.length; a++) {
                    let startParts = this.Util.split(daySchedule[a].time, ':');
                    let end;

                    if (a === daySchedule.length - 1) {
                        end = { hour: 24, minute: 00 };
                    } else {
                        let endParts = this.Util.split(daySchedule[a + 1].time, ':');
                        end = { hour: this.Util.parseInt(endParts[0]), minute: this.Util.parseInt(endParts[1]) }
                    }

                    builtSchedule[day][a + 1] = {
                        start: { hour: this.Util.parseInt(startParts[0]), minute: this.Util.parseInt(startParts[1]) },
                        end: end,
                        on: daySchedule[a].on
                    }
                }
            }

            for (let i = 0; i < 7; i++) {
                let day = days[i];
                let end = { hour: 24, minute: 00 };

                if (builtSchedule[day].length > 1) {
                    if (
                        builtSchedule[day][1].start.hour === 0 &&
                        builtSchedule[day][1].start.minute === 0
                    ) {
                        builtSchedule[day] = builtSchedule[day].splice(0, 1);
                        continue;
                    }
                    end = builtSchedule[day][1].start
                }

                let prevDay = days[i === 0 ? 6 : i - 1];
                let prevDaySchedule = builtSchedule[prevDay];
                let prevDayScheduleLastItem = prevDaySchedule[prevDaySchedule.length - 1];

                builtSchedule[day][0].end = end;
                builtSchedule[day][0].on = prevDayScheduleLastItem.on;
            }

            this._schedule = builtSchedule;
        },

        currentSchedule: function() {
            let now = Timer.now();
            let day = Timer.fmt('%A', now);
            let time = this.Util.split(Timer.fmt('%H:%M', now), ':');
            let hour = this.Util.parseInt(time[0]);
            let minute = this.Util.parseInt(time[1]);
            let daySchedule = this._schedule[day] || [];

            for (let i = 0; i < daySchedule.length; i++) {
                if (
                    (
                        hour > daySchedule[i].start.hour ||
                        (
                            hour === daySchedule[i].start.hour &&
                            minute >= daySchedule[i].start.minute
                        )
                    ) && (
                        hour < daySchedule[i].end.hour ||
                        (
                            hour === daySchedule[i].end.hour &&
                            minute < daySchedule[i].end.minute
                        )
                    )
                ) {
                    return daySchedule[i];
                }
            }

            return {
                start: { hour: 0, minute: 0 },
                end: { hour: 24, minute: 00 },
                on: false
            };
        },

        buildOverride: function() {
            print('building override');

            let override = this.State.getState().config.override;

            if (!override.start || !override.end) {
                return;
            }

            function parseDate(str, Util) {
                let parts = Util.split(str, ' ');

                let dateParts = Util.split(parts[0], '-');
                let timeParts = Util.split(parts[1], ':');

                let year = Util.parseInt(dateParts[0]);
                let month = Util.parseInt(dateParts[1]);
                let day = Util.parseInt(dateParts[2]);

                let hour = Util.parseInt(timeParts[0]);
                let minute = Util.parseInt(timeParts[1]);

                return Util.buildEpoch(year, month, day, hour, minute, 0);
            }

            this._override = {
                start: parseDate(override.start, Util),
                end: parseDate(override.end, Util),
                on: override.on
            }

            if (override.temperature) {
                this._override.temperature = override.temperature
            }
        },

        currentOverride: function() {
            if (!this._override.start || !this._override.end) {
                return {};
            }

            let now = Timer.now();

            if (now >= this._override.start && now < this._override.end) {
                let override = {
                    on: this._override.on,
                    start: Timer.fmt('%F %R', this._override.start),
                    end: Timer.fmt('%F %R', this._override.end)
                };

                if (this._override.temperature) {
                    override.temperature = this._override.temperature
                }

                return override;
            }

            return {};
        }
    };

    Timer.set(10000, 0, function(userdata) {
        userdata.Schedule.buildSchedule();
        userdata.Schedule.buildOverride();

        userdata.State.subscribe(function(userdata) {
            let state = userdata.State.getState();
            let schedule = state.config.schedule;
            let override = state.config.override;

            if (JSON.stringify(schedule) !== JSON.stringify(userdata.prevConfig.schedule)) {
                userdata.Schedule.buildSchedule();
            }

            if (JSON.stringify(override) !== JSON.stringify(userdata.prevConfig.override)) {
                userdata.Schedule.buildOverride();
            }

            userdata.prevConfig = state.config;
        }, {
            Schedule: Schedule,
            State: State,
            prevConfig: userdata.State.getState().config
        });
    }, {Schedule: Schedule, State: State});

    return Schedule;
}
