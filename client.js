const{createConnection}=require("node:net")
const { buffer } = require("node:stream/consumers")

const client=createConnection({host:'localhost',port:'4000'},(()=>{
    client.write(`<SOM>\nSYN\n<EOM>`)
})
)

client.on('data',(data)=>{
    const response=Buffer.from(data)
    const msg=response.toString()
    console.log(msg)
    if (msg.toString().includes('<SOM>\nACK\n<EOM>')) {
        client.write('<SOM>\nREADY\n<EOM>');
    }

    if(msg.toString().includes('<SOM>\nREADY\n<EOM>')){
        console.log('handshake completed succesfully')
        client.end()
    }
    
})

client.on('end',()=>{
    console.log('server connection closed')
})