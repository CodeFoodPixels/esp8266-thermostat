load('api_rpc.js');
load('api_timer.js');
load('api_arduino_onewire.js');
load('api_arduino_dallas_temp.js');
load('api_pwm.js');
load('config.js');
load('util.js');
load('schedule.js');

let tempSensor = DallasTemperature.create(OneWire.create(2));
let tempSensorAddress = '00000000';
let tempSensorFound = false;
let servoOpen = false;

function setup() {
    Schedule.buildSchedule(Config.get('schedule'));

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

        controlServo(temp, Schedule.currentState());
    }, null);

    RPC.addHandler('setconfig', function(newConfig) {
        Config.merge(newConfig);
        Schedule.buildSchedule(Config.get('schedule'));
        return true;
    });

    RPC.addHandler('getconfig', function () {
        return Config.get();
    });
}

function controlServo(temp, on) {
    let targetTemp = Config.get('temperature') || 0;
    let threshold = Config.get('threshold') || 0;

    if (on && temp < (targetTemp - threshold) && !servoOpen) {
        PWM.set(5, 50, 0.15);
        resetPWM();
        servoOpen = true;
    } else if ((!on || temp >=targetTemp) && servoOpen) {
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

setup();
