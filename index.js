'use strict';

const ScreenLogic = require('node-screenlogic');

var myArgs = process.argv.slice(2);

var device = myArgs[0];

var state = myArgs[1] == "on" ? true : false;

// Find units on the network
var finder = new ScreenLogic.FindUnits();

/**
 * Event Listner: serverFound
 * Once a server is found, turn the lights on or off
 */
finder.on('serverFound', function (server) {
  finder.close();

  var connectedServer = new ScreenLogic.UnitConnection(server);

  if (device == "waterfall") {
    if (state) {
      waterfallOn(connectedServer);
    } else {
      waterfallOff(connectedServer);
    }
  } else if (device == "lights") {
    if (state) {
      lightsOn(connectedServer);
    } else {
      lightsOff(connectedServer);
    }
  }
});

// Kicks off the finder on a different thread.
finder.search();

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

//https://github.com/actions-on-google/smart-home-nodejs