const EWGateway = require('ecowitt-gateway');

module.exports = function (RED) {
    function ConfigNode(config) {
        RED.nodes.createNode(this, config);

        const node = this;

        const configRainMethod = config.rainMethod == null ? 'auto' : config.rainMethod.toLowerCase();
        const rainMethod = configRainMethod == 'true' ? true : (configRainMethod == 'false' ? false : null);

        node.gateway = new EWGateway(config.gateway, config.port, rainMethod, config.debug);

        node.gateway.getMacAddr()
            .then(_ => {
                if (config.debug)
                {
                    node.log(`Using get rain method: ${node.gateway.useReadRainData ? 'ReadRainData' : 'ReadRain'}`);
                }
            })
            .catch(err => {
                node.warn(`Gateway ${config.gateway}:${config.port} not found.`);
            });

        node.on('close', done => {
            done();
        });
    }

    RED.nodes.registerType("ew-config-node", ConfigNode);
}