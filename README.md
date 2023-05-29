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
import { imxNodeLogger } from "node-imx-logger";

const option = {
      hostname: "localhost",
      port: 5672,
      username: "user_name",
      password: "password",
    }

const extraOption={
      enableDebug: true,
      enableError: true,
      enableReconnect: true,
      reconnectTimeout: 30000 // 30 sec
}

async function connectToImxLogger() {
  try {
    await imxNodeLogger.createConnectionToRabbitMQ(options, queueName,extraOption);
  } catch (error) {
    console.error("Error",error);
  }
}
```

- The code above establishes a connection to the IMX Logger using the `imxNodeLogger.createConnectionToRabbitMQ()` function.
  
  - The `options` object contains the following properties:
    
    - `hostname` (string): The hostname of the RabbitMQ server.
    - `port` (number): The port number of the RabbitMQ server.
    - `username` (string): The username for authenticating with the RabbitMQ server.
    - `password` (string): The password for authenticating with the RabbitMQ server.
  
  - The `extraOptions` object is optional and can contain the following properties:
    
    - `enableDebug` (boolean): Set to `true` if you want to enable debug logs. Set to `false` if you want to disable debug logs.
    - `enableError` (boolean): Set to `true` if you want to enable error logs. Set to `false` if you want to disable error logs.
    - `enableReconnect` (boolean): Set to `true` if you want the logger to automatically reconnect in case of errors. Set to `false` if you don't want automatic reconnection.
    - `reconnectTimeout` (number): The delay (in milliseconds) between reconnection attempts. This property is only applicable if `enableReconnect` is set to `true`.
      
      
  
  The `connectToImxLogger()` function attempts to create a connection to the RabbitMQ server using the provided options and extra options. If an error occurs during the connection process, the error will be logged to the console.
  
  Please note that you need to replace the placeholder values (`localhost`, `5672`, `user_name`, `password`, `queueName`) with the actual values specific to your environment.
  
  That's it! You can now use this code to connect to the IMX Logger and start logging your application's debug and error messages.
  
  

Now you can use or import the imxNodeLogger everywhere in the app with default existing methods byo leverage the imxNodeLogger in your application and access its default existing methods, you can either use or import it. The imxNodeLogger is built on the `amqplib` library, which provides the underlying functionality. You can find the `amqplib` package on npm [here](https://www.npmjs.com/package/amqplib).



Here are the additional functions provided by the `connectToImxLogger` returned by the `imxNodeLogger.createMqttConnection()` method, along with their descriptions:

- `error(payload): void`: This function is used to log an error message to the connected RabbitMQ server. It accepts an object as the payload, containing the necessary information for the error log . `appName, message, context AS string` as required and `extra as any, user as string`

- `debug(payload): void`: Use this function to log a debug message to the connected RabbitMQ server. It takes an object as the payload, containing the relevant details for the debug log.

- `enableErrorLogging(): void`: Call this function to enable logging the errors if it was previously disabled. It allows logs to be sent to the RabbitMQ server.

- `disableErrorLogging(): void`: This function disables logging, preventing any error logs from being sent to the RabbitMQ server. Use it when you want to temporarily halt logging.

- `enableDebugLogging(): void`: Call this function to enable debug the errors if it was previously disabled. It allows logs to be sent to the RabbitMQ server.

- `disableDebugLogging(): void`: This function disables logging, preventing any debug logs from being sent to the RabbitMQ server. Use it when you want to temporarily halt logging.

- `checkLoggingStatus(): { errorLoggingStatus: boolean; debugLoggingStatus: boolean;}`: Invoke this function to check whether logging is currently enabled or disabled.

- `checkErrorLoggingStatus():boolean `: Invoke this function to check whether the error logging is currently enabled or disabled.

- `checkDebugLoggingStatus():boolean` : Invoke this function to check whether the debug logging is currently enabled or disabled.



This type is used as the payload when logging error and debug messages to the connected RabbitMQ server. It consists of the following properties:

- `message` (required): A string representing the main message content of the log.

- `context` (required): A string specifying the context or category of the log, providing additional information about where the log is originating from.

- `appName` (required): A string indicating the name of the application or component generating the log.

- `user` (optional): An optional string representing the user associated with the log. This property can be omitted if the log is not specific to a user.

- `extra` (optional): An optional property that allows for additional data or context to be included in the log. This can be of any type (`any`), accommodating various custom data structures or objects.
  
  

Please note that the `rabbitMqConnectionType` can also be `null` if the connection to the RabbitMQ server was unsuccessful.



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

##### To enable ERROR logging:

```
imxNodeLogger.enableErrorLogging()
```

##### To disable ERROR logging:

```
imxNodeLogger.disableErrorLogging()
```

##### To enable DEBUG logging:

```
imxNodeLogger.enableDebugLogging()
```

##### To disable DEBUG logging:

```
imxNodeLogger.disableDebugLogging()
```

##### To check the logging status :

```
imxNodeLogger.checkIsEnaled() //return { errorLoggingStatus: boolean;
  debugLoggingStatus: boolean;
}
```

##### To get the connection result :

```
imxNodeLogger.getConnectionObject()
```

##### To check debug logging status  :

```
imxNodeLogger.checkErrorLoggingStatus() //return bool
```

##### To check eror logging status :

```
imxNodeLogger.checkDebugLoggingStatus() //return bool
```
