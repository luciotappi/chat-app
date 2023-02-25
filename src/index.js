const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server= http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))


let count = 0 
const message= "Welcome!"

io.on('connection',(socket)=> {
    console.log('New WebSocket connection')

    // socket.emit('countUpdated',count)

    // socket.on('increment',() =>{
    //     count++
    //     // socket.emit('countUpdated',count)  // sends answer to One client( the one who asked)
    //     io.emit('countUpdated',count) // broadcasts the answers to all clientes
    // })

    socket.emit('message',message)

    socket.on('sendMessage',(message) => {
        socket.emit('messageConfirmation',"Recepcion OK")
        io.emit('sendMessage',message)
    })

})



server.listen(port,()=> {

    console.log(`Server is up on port  ${port}!`)
})