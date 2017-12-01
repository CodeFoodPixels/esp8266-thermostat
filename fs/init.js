load('api_timer.js');
load('api_arduino_onewire.js');
load('api_arduino_dallas_temp.js');
load('api_pwm.js');
load('config.js');
load('util.js');

let tempSensor = DallasTemperature.create(OneWire.create(2));
let tempSensorAddress = '00000000';
let tempSensorFound = false;
let servoOpen = false;

function setup() {
    tempSensor.begin();
    PWM.set(5, 50, 0);
    resetPWM();

    if (tempSensor.getDeviceCount() > 0) {
        tempSensorFound = tempSensor.getAddress(tempSensorAddress, 0);
    } else {
        return print('No sensors found. Exiting.');
    }

    Timer.set(2000, true, function() {
        tempSensor.requestTemperatures();

        let temp = tempSensor.getTempC(tempSensorAddress);

        print('Temperature:', temp, '*C');

        controlServo(temp);
    }, null);
}

function controlServo(temp) {
    let targetTemp = Config.get('temperature') || 0;
    let threshold = Config.get('threshold') || 0;

    if (temp < (targetTemp - threshold) && !servoOpen) {
        PWM.set(5, 50, 0.15);
        resetPWM();
        servoOpen = true;
    } else if (temp >=targetTemp && servoOpen) {
        PWM.set(5, 50, 0);
        resetPWM();
        servoOpen = false;
    }
}

function resetPWM() {
    Timer.set(1000, false, function() {
        PWM.set(5, 0, 0);
    }, null)
}

function getScheduleState() {
    let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    let schedule = Config.get('schedule');

    let now = Timer.now();
    let day = Timer.fmt('%A', now);
    let hour = Timer.fmt('%H', now);
    let minute = Timer.fmt('%M', now);

    let offset = Util.indexOf(days, day);

    for (let i = 0; i < 7; i++) {
        let daySchedule = schedule[days[(offset + i) % 7]];

        if (daySchedule.length === 0) {
            continue;
        }

        for (let j = 0; j < daySchedule.length; j++) {
            let slot = daySchedule[j];

            if (slot.t)
        }
    }
}

setup();
