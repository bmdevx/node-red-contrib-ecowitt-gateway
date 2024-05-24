module.exports = function (RED) {
    function LiveDataNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        const configNode = (typeof config.config === 'string') ? RED.nodes.getNode(config.config) : config.config;

        if (configNode === undefined) {
            node.error('Config Node not found');
            return;
        }

        const gateway = configNode.gateway;

        const includeRain = config.include_rain || true;
        const filterActiveSensors = config.filter_active_sensors || false;

        node.on('input', (msg, send, done) => {
            gateway.getLiveData(includeRain, filterActiveSensors)
                .then(data => {
                    send({ payload: data });
                })
                .catch(node.warn)
                .finally(done);
        });

        node.on('close', (done) => {
            done();
        });
    }

    RED.nodes.registerType("livedata-node", LiveDataNode);
}
