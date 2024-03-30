const EWGateway = require('ecowitt-gateway');

module.exports = function (RED) {
    function ConfigNode(config) {
        RED.nodes.createNode(this, config);

        const node = this;

        node.gateway = new EWGateway(config.gateway, config.port);

        node.gateway.getMacAddr()
            .catch(err => {
                node.warn(`Gateway ${config.gateway}:${config.port} not found.`);
            });

        node.on('close', done => {
            done();
        });
    }

    RED.nodes.registerType("ew-config-node", ConfigNode);
}