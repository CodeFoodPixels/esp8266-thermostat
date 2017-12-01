const util = require('util');

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

            if (a === daySchedule.length -1) {
                end = { hour: 24, minute: 00 };
            } else {
                end = { hour: daySchedule[a + 1].hour, minute: daySchedule[a + 1].minute}
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

        if (builtSchedule[day].length === 1) {
            continue;
        }

        let prevDay = days[i === 0 ? 6 : i - 1];
        let prevDaySchedule = builtSchedule[prevDay];
        let prevDayScheduleLastItem = prevDaySchedule[prevDaySchedule.length - 1];

        builtSchedule[day][0].end = builtSchedule[day][1].start;
        builtSchedule[day][0].on = prevDayScheduleLastItem.on;
    }

    return builtSchedule;
}

const schedule = buildSchedule({
    "Monday": [
        {hour: 10, minute:30, on: true},
        {hour: 11, minute:30, on: false}
    ],
    "Tuesday": [],
    "Wednesday": [],
    "Thursday": [],
    "Friday": [],
    "Saturday": [],
    "Sunday": []
});

console.log(util.inspect(schedule, false, null))
