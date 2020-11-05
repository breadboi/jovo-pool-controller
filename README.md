[![Jovo Framework](https://www.jovo.tech/img/github-logo.png)](https://www.jovo.tech)

<p align="center">Sample Voice App for the <a href="https://github.com/jovotech/jovo-framework-nodejs">Jovo Framework</a> ⭐️</p>

<p align="center">
<a href="https://www.jovo.tech/framework/docs/"><strong>Documentation</strong></a> -
<a href="https://github.com/jovotech/jovo-cli"><strong>CLI </strong></a> - <a href="https://github.com/jovotech/jovo-templates"><strong>Templates </strong></a> -<a href="https://github.com/jovotech/jovo-framework-nodejs/blob/master/CONTRIBUTING.md"><strong>Contributing</strong></a> - <a href="https://twitter.com/jovotech"><strong>Twitter</strong></a></p>
<br/>

# Pool Voice App for Google Home

[Jovo](https://www.jovo.tech "Jovo's website") is a development framework for cross-platform voice apps. Use this repository as a starting point to create a voice application for Amazon Alexa and Google Assistant.


## Getting Started

In this guide, you will learn how to create a "Hello World" voice app for both Amazon Alexa and Google Assistant.

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