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
// Number of sensors found on the 1-Wire bus
let n = 0;
// Sensors addresses
let sens = [];
let servoOpen = false;

PWM.set(5, 50, 0);
// Timer.set(1 /* milliseconds */ , false /* repeat */ , function () {
//     PWM.set(5, 50, 1.0);
// }, null);

// This function reads data from the DS sensors every 2 seconds
Timer.set(2000 /* milliseconds */, true /* repeat */, function() {
  if (n === 0) {
    n = dt.getDeviceCount();
    print('Sensors found:', n);

    for (let i = 0; i < n; i++) {
      sens[i] = '01234567';
      if (dt.getAddress(sens[i], i) === 1) {
        print('Sensor#', i, 'address:', dt.toHexStr(sens[i]));
      }
    }
  }

  dt.requestTemperatures();
  let temp = dt.getTempC(sens[0]);
  print('Sensor#', 0, 'Temperature:', temp, '*C');
  if (temp >= 26 && !servoOpen) {
    servoOpen = true;
  } else if (temp < 26 && servoOpen) {
    servoOpen = false;
  }
}, null);
