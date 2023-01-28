// Load net module to enable TCP Servers
const net = require('net')

//define port and localhost as my server
const port = 3303;
const host = 'localhost';


const server = net.createServer();
server.listen(port, host, () => {
    console.log('TCP Server is running on port ' + port +'.');

    //Tracing the number of clients connected
    let counter = 0;
});

// handling clientsconnections:empty array of clients that connect to the server
let clients = [];
let clientRank = [];

//setting the maximum number of clients:Where N rep the number of maximum clients
const N = 10
//set the first rank to be 1
let rank = 0

server.on('connection', function(client) {
    console.log('CONNECTED: ' + client.remoteAddress + ':' + client.remotePort);
    clients.push(client);

    //update counter
    counter++;

    //add a condition if the number of clients exeeds the max,Reject
    if(counter >= N){
        client.end("Limited number of clients,cannot connect,Try again later")

    }
    //Looping through the clients and assign each a rank
    clients.forEach(client => {
        rank++
        clientRank.push(rank)

    });
    //Execution of commands
   

    client.on('data', function(data) {
        console.log('DATA ' + client.remoteAddress + ': ' + data);
        // Write the data back to all the connected, the client will receive it as data from the server
        clients.forEach(function(client, index, array) {
            client.write(client.remoteAddress + ':' + client.remotePort + " said " + data + '\n');
        });
    });

    // handler to handle disconnection of a client
    client.on('close', function(data) {
        let index = clients.findIndex(function(o) {
            return o.remoteAddress === client.remoteAddress && o.remotePort === client.remotePort;
        })
        if (index !== -1) clients.splice(index, 1);
        console.log('CLOSED: ' + client.remoteAddress + ' ' + client.remotePort);
    });


});

