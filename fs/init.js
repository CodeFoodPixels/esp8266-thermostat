// Load Mongoose OS API
load('api_timer.js');
load('api_arduino_onewire.js');
load('api_arduino_dallas_temp.js');
load('api_pwm.js');

// GPIO pin which has sensors data wire connected
let pin = 2;

// Initialize 1-Wire bus
let ow = OneWire.create(pin);
// Initialize DallasTemperature library
let dt = DallasTemperature.create(ow);
// Start up the library
dt.begin();

let sensorAddress = '00000000';
let sensorFound = false;
let servoOpen = false;

PWM.set(5, 50, 0);

// This function reads data from the DS sensors every 2 seconds
Timer.set(2000 /* milliseconds */, true /* repeat */, function() {
    if (!sensorFound) {
        if (dt.getDeviceCount() > 0) {
            sensorFound = dt.getAddress(sensorAddress, 0);
        } else {
            return;
        }
    }

    dt.requestTemperatures();

    let temp = dt.getTempC(sensorAddress);

    print('Temperature:', temp, '*C');

    if (temp >= 18 && !servoOpen) {
        PWM.set(5, 50, 0.15);
        servoOpen = true;
    } else if (temp < 18 && servoOpen) {
        PWM.set(5, 50, 0);
        servoOpen = false;
    }
}, null);
