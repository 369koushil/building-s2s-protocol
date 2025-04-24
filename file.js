const fs=require('fs')

const filechunks=fs.createReadStream('send.txt')


filechunks.on('data', (chunk) => {
    console.log('Chunk received:', chunk.toString());
});


filechunks.on('end', () => {
    console.log('Finished reading file.');
});