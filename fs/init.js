load('api_timer.js');
load('api_arduino_onewire.js');
load('api_arduino_dallas_temp.js');
load('api_pwm.js');
load('config.js');

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

setup();
