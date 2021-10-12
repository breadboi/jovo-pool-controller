[![Jovo Framework](https://www.jovo.tech/img/github-logo.png)](https://www.jovo.tech)

<p align="center">Voice App written for personal pool control using the <a href="https://github.com/jovotech/jovo-framework-nodejs">Jovo Framework</a></p>

<p align="center">
<a href="https://www.jovo.tech/framework/docs/"><strong>Documentation</strong></a>
<br/>

# Pool Voice App for Google Home

This application utilizes the Jovo framework to allow users to communicate with their pentair swimming pools.


## Getting Started

Here's how you can get the environment setup.

### Install the Jovo CLI

The [Jovo CLI](https://github.com/jovotech/jovo-cli) is the best way to get started with Jovo development:

```sh
$ npm install -g jovo-cli
```

To learn more, please find the [Getting Started Guide](https://www.jovo.tech/framework/docs/installation) in the Jovo Framework Docs.

### Configure your App

You can configure the app and add to its logic in the `src` folder, where you can find a file [`config.js`](./src/config.js), which looks like this:

```javascript
// ------------------------------------------------------------------
// APP CONFIGURATION
// ------------------------------------------------------------------

module.exports = {
   logging: true,

   intentMap: {
      'AMAZON.StopIntent': 'END',
   },
};
```

### Run the Code

The [`index.js`](./index.js) file is responsible for the host configuration.

You can run this code with:
* Webhook ([docs](https://www.jovo.tech/framework/docs/server/webhook)): Do `$ jovo run` and use a tool like [ngrok](https://www.ngrok.com) to point to the local webhook