function(Util, Config) {
    load('api_timer.js');

    let _schedule;

    function buildSchedule(schedule) {
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
                let end;

                if (a === daySchedule.length - 1) {
                    end = { hour: 24, minute: 00 };
                } else {
                    end = { hour: daySchedule[a + 1].hour, minute: daySchedule[a + 1].minute }
                }

                builtSchedule[day][a + 1] = {
                    start: { hour: daySchedule[a].hour, minute: daySchedule[a].minute },
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

        _schedule = builtSchedule;
    }

    buildSchedule(Config.get('schedule'));

    return {
        currentSchedule: function() {
            let now = Timer.now();
            let day = Timer.fmt("%A", now);
            let time = Util.split(Timer.fmt("%H:%M", now), ":");
            let hour = Util.parseInt(time[0]);
            let minute = Util.parseInt(time[1]);
            let daySchedule = _schedule[day] || [];

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
        }
    }
}
