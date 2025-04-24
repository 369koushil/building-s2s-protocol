const { createConnection } = require("node:net");
const { createWriteStream } = require('fs');

class customTCPClient {
    constructor(port,host="localhost",maxRetries = 3) {
        this.port = port;
        this.host = host;
        this.client = null;
        this.fileWriteStream = null;
        this.maxRetries = maxRetries;
        this.attempts = 0;
        this.handshakeComplete = false;
    }

    start() {
        this.attempts++;
        if (this.attempts <= this.maxRetries) {
            this.client = createConnection({ host: this.host, port: this.port }, () => {
                console.log("Initial handshaking");
                this.client.write('<SOM>\nSYN\n<EOM>');
            });

            this.setUpListeners();
        } else {
            console.log('Max retries reached. Unable to connect.');
        }
    }

    setUpListeners() {
        this.client.on('data', this.handleData.bind(this));
        this.client.on('end', this.handleEnd.bind(this));
        this.client.on('error', this.handleError.bind(this));
    }

    handleError(err) {
        console.error('Connection error:', err.message);
        if (this.attempts < this.maxRetries) {
            console.log(`Retrying... (${this.attempts}/${this.maxRetries})`);
            setTimeout(() => this.start(), 2000);
        } else {
            console.log('Max retries reached. Unable to establish connection.');
        }
    }

    handleEnd() {
        console.log('Connection closed by server.');
        if (this.fileWriteStream) this.fileWriteStream.end();

        if (!this.handshakeComplete) {
            console.log('Handshake failed. Retrying...');
            setTimeout(() => this.start(), 2000);
        }
    }

    handleData(data) {
        const msg = data.toString();

        if (msg.includes('<SOM>\nACK\n<EOM>')) {
            this.client.write('<SOM>\nREADY\n<EOM>');
        } else if (msg.includes('<SOM>\nREADY\n<EOM>')) {
            console.log('Handshake completed successfully.');
            this.handshakeComplete = true;
            this.fileWriteStream = createWriteStream('received.txt');
            this.client.pipe(this.fileWriteStream);
        }
    }
}

const tcpclient = new customTCPClient(4000);
tcpclient.start();
