const chatsString = localStorage.getItem("chats")
const chats = JSON.parse(chatsString)
localStorage.setItem("chats", "")

let mydict = {}
chats.forEach(chat => {
    mydict[chat.id] = chat.messages
})

//add event listener for each conversation (left side)
const chatConversations = document.querySelectorAll("#chat-conversations .room")
chatConversations.forEach(el => {
    const roomName = el.querySelector(".room-name").innerHTML
    const id = el.id.replace("room-id-", "")
    el.addEventListener("click", () => {
        showConversation(id, roomName, mydict[id])
        showParticipants(id)
        document.getElementById("chat-conversation-invite-person").classList.remove("hidden")
        resetImage()
    })
})

//show the conversation from the chat
function showConversation(id, roomName, messages) {
    selected_room = id
    const messageContent = document.getElementById("chat-conversation-message-content")
    removeChildren(messageContent)
    messageContent.classList.remove("opacity-0")

    document.getElementById("chat-conversation-message-type").classList.remove("opacity-0")
    const messageHeader = document.getElementById("chat-conversation-message-header")
    messageHeader.classList.remove("opacity-0")
    document.getElementById("chat-conversation-message-room-name").innerHTML = roomName

    let logged_user = JSON.parse(localStorage.getItem("logged_user"))
    let user_id = logged_user.id
    messages.forEach(message => {
        if (message.user_id === user_id) {
            addDivMessage("Me", message.text, message.photo, message.time)
        } else {
            addDivMessage(message.user_name, message.photo, message.text, message.time)
        }
    })

    document.getElementById("scroll-down").classList.add("d-flex")
    document.getElementById("scroll-down").classList.remove("hidden")
}

//create div to add in message content
function addDivMessage(person, text, photo_url, time) {
    let divOutsite = document.createElement("div");
    divOutsite.classList.add("rounded", "shadow-sm", "border", "w-75", "d-flex", "flex-column", "px-3", "py-1", "mt-3")
    let divName = document.createElement("div");
    divName.classList.add("text-bold")

    let divTime = document.createElement("div");
    divTime.classList.add("align-self-end")
    divTime.innerHTML = time

    let image = document.createElement("img")
    if (photo_url !== "") {
        image.src = "../static/images" + photo_url
        image.style.maxWidth = "400px"
    }

    let divText = document.createElement("div");
    divText.innerHTML = text
    if (person === "Me") {
        divOutsite.classList.add("align-self-end")
        divName.innerHTML = "Me"
    } else {
        divName.innerHTML = person
    }
    divOutsite.appendChild(divName)
    if (photo_url !== "") {
        divOutsite.appendChild(image)
    }
    divOutsite.appendChild(divText)
    divOutsite.appendChild(divTime)
    const messageContentDiv = document.getElementById("chat-conversation-message-content")
    messageContentDiv.appendChild(divOutsite)
    setTimeout(() => {
        messageContentDiv.scrollTo(0, messageContentDiv.scrollHeight);
    }, 300)
}

// document.getElementById("message-sender-btn").addEventListener("click", sendMessage)
document.getElementById("message-sender-btn").addEventListener("click", () => {
    sendMessage()
})

document.getElementById("message-sender").addEventListener("keydown", (e) => {
    if (e.code === "Enter")
        sendMessage()
})

//send message to chat room
async function sendMessage() {
    //if photo is selected, hide it
    const elem = document.getElementById("chat-conversation-message-type")
    elem.querySelector("div").classList.add("hidden")
    elem.querySelector("span").textContent = ""

    const message = document.getElementById("message-sender").value
    document.getElementById("message-sender").value = ""
    var currentdate = new Date();
    var time = (currentdate.getHours() < 10 ? "0" + currentdate.getHours() : currentdate.getHours()) + ":"
        + (currentdate.getMinutes() < 10 ? "0" + currentdate.getMinutes() : currentdate.getMinutes()) + ":"
        + (currentdate.getSeconds() < 10 ? "0" + currentdate.getSeconds() : currentdate.getSeconds());
    let blobFile = elem.querySelector("input").files[0]
    if (message.length > 0 || blobFile !== undefined) {
        const pathToFile = await addMessageWithImage(message)
        addDivMessage("Me", message, pathToFile, time)
    }
    resetImage()
    updateLastMessageForRoom(message, selected_room)
}

//image send
document.getElementById("message-sender-attach").addEventListener("click", () => {
    console.log("click attach")
    const messageType = document.getElementById("chat-conversation-message-type")
    const inputFile = messageType.querySelector("input")
    inputFile.click()
    inputFile.onchange = () => {
        const selectedFile = inputFile.files[0];
        if (selectedFile !== undefined) {
            const elem = document.getElementById("chat-conversation-message-type")
            elem.querySelector("div").classList.remove("hidden")
            elem.querySelector("span").textContent = selectedFile.name
        }
    }
})

//cancel image upload
document.getElementById("chat-image-cancel").addEventListener("click", () => {
    resetImage()
})

function resetImage() {
    document.getElementById("reset-image-btn").click()
    const elem = document.getElementById("chat-conversation-message-type")
    elem.querySelector("div").classList.add("hidden")
    elem.querySelector("span").textContent = ""
}


//scroll down btn
document.getElementById("scroll-down").addEventListener("click", () => {
    const messageContentDiv = document.getElementById("chat-conversation-message-content")
    messageContentDiv.scrollTo(0, messageContentDiv.scrollHeight);
})

//leave room
document.getElementById("settings-leave-room-option").addEventListener("click", () => {
    leaveRoom()
    exitConversation()
})

function exitConversation() {
    document.getElementById("chat-conversation-message-content").classList.add("opacity-0")
    document.getElementById("chat-conversation-message-header").classList.add("opacity-0")
    document.getElementById("chat-conversation-message-type").classList.add("opacity-0")
    const parent = document.getElementById("chat-invite-people-choose").parentNode
    parent.classList.add("hidden")
    parent.classList.remove("d-flex")
    resetImage()
    document.getElementById("chat-conversation-invite-person").classList.add("hidden")
    const kids = document.getElementById("chat-conversation-participants").children
    for (let i = 0; i < kids.length; i++) {
        kids[i].classList.add("opacity-0")
    }
    document.getElementById("scroll-down").classList.add("hidden")
    document.getElementById("scroll-down").classList.remove("d-flex")
}

function updateLastMessageForRoom(message, room_id) {
    const room = document.getElementById(`room-id-${room_id}`)
    room.querySelector(".last-message").innerHTML = message
    checkLastMessageLength(room)
}