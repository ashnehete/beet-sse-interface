const kafkaSse = require('kafka-sse');
const server = require('http').createServer();

function customDeserializer(kafkaMessage) {
    let value = kafkaMessage.value.toString();
    kafkaMessage.message = value.substring(1, value.length - 1)
    return kafkaMessage
}

const options = {
    kafkaConfig: {'metadata.broker.list': 'localhost:9092'},
    deserializer: customDeserializer
}
 
server.on('request', (req, res) => {
    const topics = req.url.replace('/', '').split(',');
    console.log(`Handling SSE request for topics ${topics}`);
    kafkaSse(req, res, topics, options)
    // This won't happen unless client disconnects or kafkaSse encounters an error.
    .then(() => {
        console.log('Finished handling SSE request.');
    });
});
 
server.listen(6917);
console.log('Listening for SSE connections at http://localhost:6917/:topics');