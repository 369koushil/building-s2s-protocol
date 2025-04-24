const{createServer}=require('node:net')

const server=createServer((c)=>{
    console.log("client connected")
    c.on('end',c=>{
        console.log(`client ${c} disconnected`)
    })
    c.write('hello from server')
})

server.listen(4000)