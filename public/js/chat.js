const socket = io()

// socket.on('countUpdated',(count) => {
//     console.log('The count has been updated!.Now is ',count)
// })

// document.querySelector('#increment').addEventListener('click',()=>{
//     console.log('clicked')
//     socket.emit('increment')
// })


//elements


const $messageForm = document.querySelector('#message-form')
const $messageInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages= document.querySelector('#messages')

// templates

const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate =document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// options

// const { username, room } = Qs.parse(location.search, {ignoreQueryPrefix:true})
const { username, room } = Object.fromEntries(new URLSearchParams(location.search));

$messageForm.addEventListener('submit',(e) => {

    e.preventDefault()
    
    $messageFormButton.setAttribute('disabled','disabled')

    //disable
    const message = e.target.elements.message.value
   
    socket.emit('sendMessage',message, (error)=> {
        
        //enable   
        $messageFormButton.removeAttribute('disabled')
        $messageInput.value=''
        $messageInput.focus()
        if (error) {
            return console.log(error)
        }

        console.log('Message delivered')
    })

})

const autoscroll =() =>{
  //New message element
  const $newMessage = $messages.lastElementChild

  //Height of the new message
  const newMessageStyles =getComputedStyle($newMessage)
  const newMessageMargin = parseInt(newMessageStyles.marginBottom)
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

  //visible height

  const visibleHeight = $messages.offsetHeight

  // height of messages container
  const containerHeight = $messages.scrollHeight

  //how far have i scrolled?

  const scrollOffset = $messages.scrollTop + visibleHeight


  if (containerHeight - newMessageHeight <=scrollOffset) {
    $messages.scrollTop =$messages.scrollHeight

  }
}
socket.on('message',(message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate,
        {
            username:message.username,
            message:message.text,
            createdAt:moment(message.createdAt).format('h:mm:a')
        })
     $messages.insertAdjacentHTML('beforeend',html)
     autoscroll()
})
// socket.on('sendMessage',(message) => {
//     console.log(message)
//     const html = Mustache.render(messageTemplate,
//         {
//             message:message.text
//         })
//     $messages.insertAdjacentHTML('beforeend',html)
// })

socket.on('locationMessage', (url) => {

    const html = Mustache.render(locationMessageTemplate,
        {
            username:url.username,
            url:url.url,
            createdAt:moment(url.createdAt).format('h:mm:a')
        })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('roomData',({room,users}) => {
   
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML=html
})

$sendLocationButton.addEventListener('click',(e) =>{


    

    if(!navigator.geolocation)
    {
        return alert('Geolocation is not supported by your browser')
    }
    //disable
    $sendLocationButton.setAttribute('disabled','disabled')
    
    navigator.geolocation.getCurrentPosition((position) =>{
        socket.emit('sendLoation',{
           latitude: position.coords.latitude,
            longitude : position.coords.longitude
        },() =>{
          
            console.log('location shared to the other users')

            //enable
            $sendLocationButton.removeAttribute('disabled')
        })
    })



})


socket.emit('join',{username,room},(error) => {

    if (error) {
        alert(error)
        location.href='/'
    }
})