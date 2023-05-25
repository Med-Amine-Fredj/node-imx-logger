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

To establish a connection with the imxLogger server, utilize the following method, ensuring the inclusion of specific options and parameters:

```
mport { imxNodeLogger } from "node-imx-logger";

const option = {
      hostname: "localhost",
      port: 5672,
      username: "user_name",
      password: "password",
    }

async function connectToImxLogger() {
  try {
    await imxNodeLogger.createConnectionToRabbitMQ(options, queueName, enableLogs = true);
  } catch (error) {
    console.error("Error",error);
  }
}


```

- `options`: This parameter should contain the necessary configuration settings for connecting to the imxLogger server. Ensure you provide the appropriate values for host, port, authentication credentials, or any other required details.

- `queueName`: Specify the name of the message queue to which you intend to send log messages. Choose a descriptive and meaningful name that aligns with the purpose or category of the logs.

- `enableLogs` (optional): This boolean argument allows you to control the logging behavior. By default, it is set to `true`, enabling logs to be sent to the imxLogger server. If you wish to disable logging temporarily, set this argument to `false`.

Now you can use or import the imxNodeLogger everywhere in the app with default existing methods byo leverage the imxNodeLogger in your application and access its default existing methods, you can either use or import it. The imxNodeLogger is built on the `amqplib` library, which provides the underlying functionality. You can find the `amqplib` package on npm [here](https://www.npmjs.com/package/amqplib).

Here are the additional functions provided by the `connectToImxLogger` returned by the `imxNodeLogger.createMqttConnection()` method, along with their descriptions:

- `error(payload): void`: This function is used to log an error message to the connected RabbitMQ server. It accepts an object as the payload, containing the necessary information for the error log . `appName, message, context AS string` as required and `extra as any, user as string`

- `debug(payload): void`: Use this function to log a debug message to the connected RabbitMQ server. It takes an object as the payload, containing the relevant details for the debug log.

- `enableLogging(): void`: Call this function to enable logging if it was previously disabled. It allows logs to be sent to the RabbitMQ server.

- `disableLogging(): void`: This function disables logging, preventing any logs from being sent to the RabbitMQ server. Use it when you want to temporarily halt logging.

- `checkIsEnabled(): boolean`: Invoke this function to check whether logging is currently enabled or disabled. It returns a boolean value indicating the current logging state.

Please note that the `rabbitMqConnectionType` can also be `null` if the connection to the RabbitMQ server was unsuccessful.

This type is used as the payload when logging error and debug messages to the connected RabbitMQ server. It consists of the following properties:

- `message` (required): A string representing the main message content of the log.

- `context` (required): A string specifying the context or category of the log, providing additional information about where the log is originating from.

- `appName` (required): A string indicating the name of the application or component generating the log.

- `user` (optional): An optional string representing the user associated with the log. This property can be omitted if the log is not specific to a user.

- `extra` (optional): An optional property that allows for additional data or context to be included in the log. This can be of any type (`any`), accommodating various custom data structures or objects.

### Examples

##### To send debug logs use :

```
 imxNodeLogger.debug({
        appName: "appname_example",
        context: "context_example",
        message: `message_example`,
        user?: "user_example",
      });
```

##### To send errors logs use :

```
 imxNodeLogger.error({
        appName: "appname_example",
        context: "context_example",
        message: `message_example`,
        user?: "user_example",
      });
```

##### To enable logging:

```
imxNodeLogger.enableLogging()
```

##### To disable logging:

```
imxNodeLogger.disableLogging()
```

##### To check the logging status :

```
imxNodeLogger.checkIsEnaled() //return bool
```

#####

##### To get the connection result :

```
imxNodeLogger.getConnectionObject()
```
