load('api_timer.js');
load('api_arduino_onewire.js');
load('api_arduino_dallas_temp.js');
load('api_pwm.js');

let Config = (load('config.js'))();
let Util = (load('util.js'))();
let Broadcast = (load('broadcast.js'))();
let State = (load('state.js'))(Util);
let Schedule = (load('schedule.js'))(Util, State);
let Api = (load('api.js'))(Config, Schedule, State, Util);

function setup() {
    State.initializeStore({
        servoOpen: false,
        temperature: 0,
        config: Config.load()
    });

    let tempSensor = DallasTemperature.create(OneWire.create(2));
    let tempSensorAddress = '00000000';

    tempSensor.begin();

    PWM.set(5, 50, 0);
    resetPWM();

    if (tempSensor.getDeviceCount() > 0) {
        tempSensor.getAddress(tempSensorAddress, 0);
    } else {
        return print('No sensors found. Exiting.');
    }

    Timer.set(2000, true, function(sensorData) {
        sensorData.tempSensor.requestTemperatures();

        let temp =  sensorData.tempSensor.getTempC(sensorData.tempSensorAddress);

        print('Temperature:', temp, '*C');

        State.dispatch({ type: 'UPDATE_TEMPERATURE', temperature: temp });
    }, {tempSensor: tempSensor, tempSensorAddress: tempSensorAddress});

    State.subscribe(function() {
        controlServo();
    });
}

function controlServo() {
    let override = Schedule.currentOverride();

    let on = typeof override.on !== 'undefined' ? override.on : Schedule.currentSchedule().on;
    let state = State.getState();

    let targetTemp = typeof override.temperature !== 'undefined' ? override.temperature : (state.config.temperature || 0);
    let threshold = state.config.threshold || 0;

    if (on && state.temperature < (targetTemp - threshold) && !state.servoOpen) {
        PWM.set(5, 50, 0.15);
        resetPWM();
        State.dispatch({ type: 'UPDATE_SERVO_STATE', servoOpen: true });
    } else if ((!on || state.temperature >=targetTemp) && state.servoOpen) {
        PWM.set(5, 50, 0);
        resetPWM();
        State.dispatch({ type: 'UPDATE_SERVO_STATE', servoOpen: false });
    }
}

function resetPWM() {
    Timer.set(1000, false, function() {
        PWM.set(5, 0, 0);
    }, null)
}

setup();
