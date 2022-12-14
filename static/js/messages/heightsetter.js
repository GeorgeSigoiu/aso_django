const lastMessagesPrev = document.querySelectorAll("#chat-conversations .last-message")
const roomNameDiv = document.querySelector("#chat-conversations .room-name")
lastMessagesPrev.forEach(el => {
    el.style.height = `${roomNameDiv.clientHeight}px`
    checkLastMessageLength(el.parentNode)
})

function checkLastMessageLength(room) {
    room.querySelector(".three-dots").classList.add("hidden")
    const roomNameDiv = room.querySelector(".room-name")
    const lastMessageDiv = room.querySelector(".last-message")
    if (lastMessageDiv.clientWidth >= roomNameDiv.clientWidth) {
        room.querySelector(".three-dots").classList.remove("hidden")
    }
}

const conversations = document.getElementById("chat-conversations")
const messagesContent = document.getElementById("chat-conversation-message")
const participants = document.getElementById("chat-conversation-participants")
messagesContent.style.height = `${conversations.clientHeight - participants.clientHeight}px`

