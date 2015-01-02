matrixdrawing nodejs daemon
===========================

*This respository is a submodule for https://github.com/enfuse/matrixdrawing*

## First time

First time you should install all the dependencies with npm running this command:

```bash
npm install
```

To run this project you MUST have an account in [Firebase](https://www.firebase.com/). Register an account and build your first app, or create a new one if you already registered. Then copy example.config.js to config.js and add the Firebase app url, and your serial port. If you don't know the serial port path launch ListPorts like this:

```bash
node ListPorts
```

You should see all serial ports available on your computer. 

## Running the daemon

Just run ```bash node app```.
