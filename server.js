const{createServer}=require('node:net')
const {createReadStream}=require('fs')

const server=createServer((c)=>{
    console.log(`client ${c.remotePort} connected`)
    c.on('end',()=>{
        console.log(`client ${c.remotePort} disconnected`)
    })
    
    
    c.on('data',(data)=>{
        const response=Buffer.from(data)
        const msg=response.toString()
        console.log(msg)
        if(msg.includes("<SOM>\nSYN\n<EOM>")){
           c.write(Buffer.from("<SOM>\nACK\n<EOM>"))
        }
        if(msg.includes('<SOM>\nREADY\n<EOM>')){
            c.write(Buffer.from('<SOM>\nREADY\n<EOM>'))

            const filestream=createReadStream('send.txt')
            filestream.pipe(c)
            filestream.on('end',()=>{
                c.end();
                console.log("file sent and connection closed")
            })
        }
    })
})

server.listen(4000,()=>{
    console.log('TCP server running on port 4000')
})