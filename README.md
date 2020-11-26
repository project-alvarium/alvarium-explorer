# Alvarium Explorer

## Configuring

You can configure the location of your REST server by modifying `./src/assets/config/config.json`

The defaults are:

```json
{
    "apiEndpoint": "http://localhost:8080"
    "sensorIds": ["TestSensor3"]
}
```

## Building

To build follow these steps

```shell
npm install
npm run build
```

## Running

To run launch the explorer on your local machine on port 9090.

```shell
npm run start
```

You can then open the site in your browser at https://localhost:9090
