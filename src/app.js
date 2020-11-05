'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const {
    App
} = require('jovo-framework');
const {
    Alexa
} = require('jovo-platform-alexa');
const {
    GoogleAssistant
} = require('jovo-platform-googleassistant');
const {
    JovoDebugger
} = require('jovo-plugin-debugger');
const {
    FileDb
} = require('jovo-db-filedb');
const ScreenLogic = require('node-screenlogic');
const { HEAT_MODE_SOLARPREFERRED } = require('node-screenlogic');
const EventEmitter = require("events").EventEmitter;
const emitter = new EventEmitter();

const poolStatus = {
    temperature: ""
};

const app = new App();

app.use(
    new Alexa(),
    new GoogleAssistant(),
    new JovoDebugger(),
    new FileDb()
);

/**
 * Get initial status upon start
 */
getPoolStatus();

/**
 * Get pool status every minute
 */
setInterval(getPoolStatus, 60000);


// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
    LAUNCH() {
        this.toIntent('HelloWorldIntent');
    },

    HelloWorldIntent() {
        this.ask('Hello World! What\'s your name?', 'Please tell me your name.');
    },

    LightsIntent() {
        this.tell("Updating lights");
        // Find units on the network
        var finder = new ScreenLogic.FindUnits();
        var input = this.$inputs.any.value;

        finder.on('serverFound', function (server) {
            finder.close();

            var connectedServer = new ScreenLogic.UnitConnection(server);
            if (input == "on") {
                lightsOn(connectedServer);
            } else {
                lightsOff(connectedServer);
            }
        });

        // Kicks off the finder on a different thread.
        finder.search();
    },

    BarWaterfallIntent() {
        this.tell("Updating bar waterfall");
        // Find units on the network
        var finder = new ScreenLogic.FindUnits();
        var input = this.$inputs.any.value;

        finder.on('serverFound', function (server) {
            finder.close();

            var connectedServer = new ScreenLogic.UnitConnection(server);
            if (input == "on") {
                waterfallOn(connectedServer);
            } else {
                waterfallOff(connectedServer);
            }
        });

        // Kicks off the finder on a different thread.
        finder.search();
    },

    SlideIntent() {
        this.tell("Updating slide");
        // Find units on the network
        var finder = new ScreenLogic.FindUnits();
        var input = this.$inputs.any.value;

        finder.on('serverFound', function (server) {
            finder.close();

            var connectedServer = new ScreenLogic.UnitConnection(server);
            if (input == "on") {
                slideOn(connectedServer);
            } else {
                slideOff(connectedServer);
            }
        });

        // Kicks off the finder on a different thread.
        finder.search();
    },

    SpaIntent() {
        this.tell("Updating spa");
        // Find units on the network
        var finder = new ScreenLogic.FindUnits();
        var input = this.$inputs.any.value;

        finder.on('serverFound', function (server) {
            finder.close();

            var connectedServer = new ScreenLogic.UnitConnection(server);
            if (input == "on") {
                spaOn(connectedServer);
            } else {
                spaOff(connectedServer);
            }
        });

        // Kicks off the finder on a different thread.
        finder.search();
    },

    TempIntent() {
        this.tell(`The current pool temperature is ${poolStatus.temperature}`);
    },

    SetPoolTempIntent() {        
        // Find units on the network
        var finder = new ScreenLogic.FindUnits();
        var input = this.$inputs.any.value;

        this.tell(`Setting pool temperature to ${input} degrees`);

        finder.on('serverFound', function (server) {
            finder.close();

            var connectedServer = new ScreenLogic.UnitConnection(server);
            setTemperature(connectedServer, 0, input);
        });

        // Kicks off the finder on a different thread.
        finder.search();
    },

    SetSpaTempIntent() {        
        // Find units on the network
        var finder = new ScreenLogic.FindUnits();
        var input = this.$inputs.any.value;

        this.tell(`Setting spa temperature to ${input} degrees`);

        finder.on('serverFound', function (server) {
            finder.close();

            var connectedServer = new ScreenLogic.UnitConnection(server);
            setTemperature(connectedServer, 1, input);
        });

        // Kicks off the finder on a different thread.
        finder.search();
    },

    PoolPumpIntent() {
        this.tell("Updating pool pump");
        // Find units on the network
        var finder = new ScreenLogic.FindUnits();
        var input = this.$inputs.any.value;

        finder.on('serverFound', function (server) {
            finder.close();

            var connectedServer = new ScreenLogic.UnitConnection(server);
            if (input == "on") {
                poolPumpOn(connectedServer);
            } else {
                poolPumpOff(connectedServer);
            }
        });

        // Kicks off the finder on a different thread.
        finder.search();
    },

    MyNameIsIntent() {
        this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
    },
});

/**
 * Turns the lights off for the unit connection that's passed.
 */
function getPoolStatus() {
    // Find units on the network
    var finder = new ScreenLogic.FindUnits();

    // Search for a server and get the pool temp
    finder.on('serverFound', function (server) {
        finder.close();
        console.log("Getting pool status");

        var connectedServer = new ScreenLogic.UnitConnection(server);
        
        emitter.on("tempUpdate", function (e) {
            poolStatus.temperature = e;
        });       
    
        connectedServer.on('loggedIn', function () {
            this.getPoolStatus();
        }).on('poolStatus', function (status) {
            emitter.emit("tempUpdate", status.currentTemp[0]);        
            connectedServer.close();
        });
    
        connectedServer.connect();
    });

    // Kicks off the finder on a different thread.
    finder.search();    
}

/**
 * Sets the temperature for either the pool (0) or spa (1)
 * @param {*} client 
 * @param {*} target Pool=0, Spa=1
 * @param {*} temperature 
 */
function setTemperature(client, target, temperature) {
    client.on('loggedIn', function () {
        console.log(`Setting temperature for body ${target} to ${temperature} degrees`);
        client.setSetPoint(0, target, temperature);
        client.setHeatMode(0, target, HEAT);
        client.close();
    });

    client.connect();
}

/**
 * Turns the lights off for the unit connection that's passed.
 * @param {UnitConnection} client 
 */
function lightsOff(client) {
    client.on('loggedIn', function () {
        console.log("Turning on the lights");
        this.setCircuitState(0, 502, 0);
        client.close();
    });

    client.connect();
}

/**
 * Turns the lights on for the unit connection that's passed.
 * @param {UnitConnection} client 
 */
function lightsOn(client) {
    client.on('loggedIn', function () {
        console.log("Turning on the lights");
        this.setCircuitState(0, 502, 1);
        client.close();
    });

    client.connect();
}

/**
 * Turns the waterfall on for the unit connection that's passed.
 * @param {UnitConnection} client 
 */
function waterfallOn(client) {
    client.on('loggedIn', function () {
        console.log("Turning on the waterfall");
        this.setCircuitState(0, 503, 1);
        client.close();
    });

    client.connect();
}

/**
 * Turns the waterfall on for the unit connection that's passed.
 * @param {UnitConnection} client 
 */
function waterfallOff(client) {
    client.on('loggedIn', function () {
        console.log("Turning off the waterfall");
        this.setCircuitState(0, 503, 0);
        client.close();
    });

    client.connect();
}

/**
 * Turns the waterfall on for the unit connection that's passed.
 * @param {UnitConnection} client 
 */
function slideOn(client) {
    client.on('loggedIn', function () {
        console.log("Turning on the slide");
        this.setCircuitState(0, 504, 1);
        client.close();
    });

    client.connect();
}

/**
 * Turns the waterfall on for the unit connection that's passed.
 * @param {UnitConnection} client 
 */
function slideOff(client) {
    client.on('loggedIn', function () {
        console.log("Turning off the slide");
        this.setCircuitState(0, 504, 0);
        client.close();
    });

    client.connect();
}

/**
 * Turns the waterfall on for the unit connection that's passed.
 * @param {UnitConnection} client 
 */
function spaOn(client) {
    client.on('loggedIn', function () {
        console.log("Turning on the spa");
        this.setCircuitState(0, 500, 1);
        client.close();
    });

    client.connect();
}

/**
 * Turns the waterfall on for the unit connection that's passed.
 * @param {UnitConnection} client 
 */
function spaOff(client) {
    client.on('loggedIn', function () {
        console.log("Turning off the spa");
        this.setCircuitState(0, 500, 0);
        client.close();
    });

    client.connect();
}

/**
 * Turns the pool pump on for the unit connection that's passed.
 * @param {UnitConnection} client 
 */
function poolPumpOn(client) {
    client.on('loggedIn', function () {
        console.log("Turning on the pool pump");
        this.setCircuitState(0, 505, 1);
        client.close();
    });

    client.connect();
}

/**
 * Turns the pool pump off for the unit connection that's passed.
 * @param {UnitConnection} client 
 */
function poolPumpOff(client) {
    client.on('loggedIn', function () {
        console.log("Turning on the pool pump");
        this.setCircuitState(0, 505, 0);
        client.close();
    });

    client.connect();
}

module.exports.app = app;