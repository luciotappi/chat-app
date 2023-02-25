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
    socket.broadcast.emit('message','New user has joined') //sends message to all clients except for sender socket
    socket.on('sendMessage',(message) => {
        socket.emit('messageConfirmation',"Recepcion OK")
        io.emit('sendMessage',message)
    })

    socket.on('sendLoation',(clientCoords)=> {

        io.emit('message',`https://google.com/maps?q=${clientCoords.latitude},${clientCoords.longitude}`)
    })

    socket.on('disconnect',() => {

        io.emit('message','A user has left')
    })

})



server.listen(port,()=> {

    console.log(`Server is up on port  ${port}!`)
})