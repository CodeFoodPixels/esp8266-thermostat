load('api_timer.js');
load('api_arduino_onewire.js');
load('api_arduino_dallas_temp.js');
load('api_pwm.js');

let tempSensor = DallasTemperature.create(OneWire.create(2));
let tempSensorAddress = '00000000';
let tempSensorFound = false;
let servoOpen = false;

function setup() {
    tempSensor.begin();
    PWM.set(5, 50, 0.15);
    resetPWM();

    Timer.set(2000 /* milliseconds */ , true /* repeat */ , function () {
        if (!tempSensorFound) {
            if (tempSensor.getDeviceCount() > 0) {
                tempSensorFound = tempSensor.getAddress(tempSensorAddress, 0);
            } else {
                return;
            }
        }

        tempSensor.requestTemperatures();

        let temp = tempSensor.getTempC(tempSensorAddress);

        print('Temperature:', temp, '*C');

        if (temp < 18 && servoOpen) {
            PWM.set(5, 50, 0.15);
            resetPWM();
            servoOpen = false;
        } else if (temp >= 18 && !servoOpen) {
            PWM.set(5, 50, 0);
            resetPWM();
            servoOpen = true;
        }
    }, null);
}

function resetPWM() {
    Timer.set(1000, false, function () {
        PWM.set(5, 0, 0);
    }, null)
}

setup();
