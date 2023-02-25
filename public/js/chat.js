const socket = io()

// socket.on('countUpdated',(count) => {
//     console.log('The count has been updated!.Now is ',count)
// })

// document.querySelector('#increment').addEventListener('click',()=>{
//     console.log('clicked')
//     socket.emit('increment')
// })


const messageForm = document.querySelector('#message-form')
const messageInput = document.querySelector('input')

messageForm.addEventListener('submit',(e) => {

    e.preventDefault()
    
    const message = e.target.elements.message.value
   
    socket.emit('sendMessage',message)

})

socket.on('message',(message) => {
    console.log(message)
})
socket.on('sendMessage',(message) => {
    console.log(message)
})

socket.on('messageConfirmation',(message) => {
    console.log(message)
})

document.querySelector('#send-location').addEventListener('click',(e) =>{

    if(!navigator.geolocation)
    {
        return alert('Geolocation is not supported by your browser')
    }

    navigator.geolocation.getCurrentPosition((position) =>{
        socket.emit('sendLoation',{
           latitude: position.coords.latitude,
            longitude : position.coords.longitude
        })
    })



})
