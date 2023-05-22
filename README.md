# IMX LOGGER FOR NODE JS

![](https://imaxeam.com/assets/images/logo-dark.png)

### Installation

#### Step1

```
yarn add node-imx-logger
```

or

```
npm i node-imx-logger
```

### Usage

Create coonection async function 

```
import { imxNodeLogger } from "node-imx-logger";



async function connectMqtt() {
  try {
    await imxNodeLogger.createMqttConnection({
      hostname: "localhost",
      port: 5672,
      username: "test",
      password: "test",
    });
  } catch (error) {
    console.error("Error",error);
  }


  await connectMqtt();
```

 Now you can use or import the imxNodeLogger everywhere in the app with default existing methods by @AMQLIB [here]((https://www.npmjs.com/package/amqplib)) .

##### To send debug logs use :

```
 imxNodeLogger.debug({
        appName: "appname_example",
        context: "context_example",
        message: `message_example`,
        user?: "user_example",
      });
```

###### To send errors logs use :

```
 imxNodeLogger.error({
        appName: "appname_example",
        context: "context_example",
        message: `message_example`,
        user?: "user_example",
      });
```
