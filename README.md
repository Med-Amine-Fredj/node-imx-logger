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

- The code above establishes a connection to the IMX Logger using the `LOGGER.createConnectionToRabbitMQ()` function.

  - The `options` object contains the RabbitMQ server connection details.
  - The `extraOptions` object is optional and can contain properties to enable/disable logging features and specify reconnect behavior.
  - The `connectToImxLogger()` function attempts to create a connection to the RabbitMQ server using the provided options and extra options. If an error occurs during the connection process, the error will be logged to the console.

  Please ensure to replace the placeholder values (`localhost`, `5672`, `user_name`, `password`, `queueName`) with your actual server details.

  ### Additional Functions

  The `LOGGER` module provides several functions for logging and managing logging settings:

  #### Logging Functions:

  - `LOGGER.error(payload: messagePayloadASArg): void`: Log an error message.
  - `LOGGER.debug(payload: messagePayloadASArg): void`: Log a debug message.

  #### Logging Configuration Functions:

  - `LOGGER.enableErrorLogging(): void`: Enable error logging.
  - `LOGGER.disableErrorLogging(): void`: Disable error logging.
  - `LOGGER.enableDebugLogging(): void`: Enable debug logging.
  - `LOGGER.disableDebugLogging(): void`: Disable debug logging.
  - `LOGGER.checkLoggingStatus(): { errorLoggingStatus: boolean; debugLoggingStatus: boolean; }`: Check the current logging status.
  - `LOGGER.checkErrorLoggingStatus(): boolean`: Check if error logging is enabled.
  - `LOGGER.checkDebugLoggingStatus(): boolean`: Check if debug logging is enabled.
  - `LOGGER.setAppName(appName: string): void`: Set the application name used in log messages.
  - `LOGGER.enableDisableAllLogging(): void`: Disable all logging.
  - `LOGGER.disableDisableAllLogging(): void`: Enable all logging.
  - `LOGGER.checkDisableAllLoggingStatus(): boolean`: Check if all logging is disabled.
  - `LOGGER.enableLogOnly(): void`: Enable log-only mode (logs to console, not to the queue).
  - `LOGGER.disableLogOnly(): void`: Disable log-only mode.
  - `LOGGER.checkLogOnlyStatus(): boolean`: Check if log-only mode is enabled.

  #### Other Functions:

  - `LOGGER.getConnectionObject(): rabbitMqConnectionType`: Get the current RabbitMQ connection object.
  - `LOGGER.getAllExtraOptions(): ExtraOptions`: Get all extra logging options.=
  - `LOGGER.disconnectFromLogger(): void`: Disconnect from the IMX Logger.

  #### Message payload

  The `messagePayloadASArg` type represents the payload when logging error and debug messages. It includes the following properties:

  - `message` (required): A string representing the main message content of the log.
  - `context` (required): A string specifying the context or category of the log, providing additional information about where the log is originating from.
  - `user` (optional): An optional string representing the user associated with the log. This property can be omitted if the log is not specific to a user.
  - `extra` (optional): An optional property that allows additional data or context to be included in the log. This can be of any type (`any`), accommodating various custom data structures or objects.

  Please note that the `rabbitMqConnectionType` can be `null` if the connection to the RabbitMQ server was unsuccessful.
