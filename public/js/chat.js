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