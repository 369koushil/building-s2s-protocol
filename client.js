const{createConnection}=require("node:net")

const client=createConnection({
    host:'localhost',
    port:'4000',
}
)

client.on('data',(data)=>{
    console.log(`${data.toString()} received from server`)
})

client.on('end',()=>{
    console.log('server connection closed')
})