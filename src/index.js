const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage,generateLocationMessage} =require('./utils/messages')
const {addUser,removeUser,getUser,getUsersInRoom}  =require('./utils/users')

const app = express()
const server= http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))



const welcomeMessage= "Welcome!"

io.on('connection',(socket)=> {
    console.log('New WebSocket connection')

    // socket.emit('countUpdated',count)

    // socket.on('increment',() =>{
    //     count++
    //     // socket.emit('countUpdated',count)  // sends answer to One client( the one who asked)
    //     io.emit('countUpdated',count) // broadcasts the answers to all clientes
    // })

    // socket.emit('message',generateMessage(welcomeMessage))
    // socket.broadcast.emit('message',generateMessage('New user has joined')) //sends message to all clients except for sender socket
    
    socket.on('join', (options,callback) => {

        const {error,user} = addUser ({id:socket.id,...options})

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message',generateMessage('Admin','Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin',`${user.username} has joined!`))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })

        callback()
    })


    socket.on('sendMessage',(message,callback) => {
        
        

        const filter = new Filter()

        if (filter.isProfane(message))
        {
            return callback('Profanity is not allowed')
        }

        const user= getUser(socket.id)
        io.to(user.room).emit('message',generateMessage(user.username,message))
        callback()
    })

    socket.on('sendLoation',(clientCoords,callback)=> {
        const user= getUser(socket.id)
        const url = `https://google.com/maps?q=${clientCoords.latitude},${clientCoords.longitude}`
        io.to(user.room).emit('locationMessage',generateLocationMessage(user.username,url))
        callback()
    })

    socket.on('disconnect',() => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message',generateMessage('Admin',`${user.username} has left the room`))
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getUsersInRoom(user.room)
            })
        }

    })

})




server.listen(port,()=> {

    console.log(`Server is up on port  ${port}!`)
})