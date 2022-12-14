//show 'select' to select new people
document.getElementById("chat-conversation-invite-person").addEventListener("click", (e) => {
    const parent = document.getElementById("chat-invite-people-choose").parentNode
    parent.classList.remove("hidden")
    parent.classList.add("d-flex")
    const select = document.getElementById("chat-invite-people-choose")
    removeChildren(select)
    let option = document.createElement("option")
    option.innerHTML = "Choose"
    select.appendChild(option)
    setPossibleParticipants()
})

//hide the 'select'
document.getElementById("close-mark").addEventListener("click", () => {
    const parent = document.getElementById("chat-invite-people-choose").parentNode
    parent.classList.add("hidden")
    parent.classList.remove("d-flex")
})

//on change add the user to the room
document.getElementById("chat-invite-people-choose").addEventListener("change", (e) => {
    const select = e.target
    const option = select.options[select.selectedIndex];
    const id = option.classList[0]
    addUserToRoom(id)
    const container = document.getElementById("chat-conversation-participants")
    appendParticipantDiv(container, option.value)
    const selectDiv = document.getElementById("chat-invite-people-choose").parentNode
    selectDiv.classList.add("hidden")
    selectDiv.classList.remove("d-flex")
})

//create a new room
document.getElementById("settings-add-new-room-option").addEventListener("click", () => {
    const container = document.getElementById("chat-conversations")
    let newDiv = document.createElement("div")
    newDiv.id = "theNewDiv"
    newDiv.classList.add("border", "py-2", "px-4", "room", "overflow-not-allowed")

    let roomNameDiv = document.createElement("div")
    roomNameDiv.classList.add("room-name")
    roomNameDiv.innerHTML = "<input class='form form-input' type='text' placeholder='Room name...'></input>"

    let lastMessageDiv = document.createElement("div")
    lastMessageDiv.classList.add("last-message", "overflow-not-allowed")
    lastMessageDiv.style.display = "inline-block"

    let dots3Div = document.createElement("div")
    dots3Div.classList.add("three-dots", "hidden")
    dots3Div.innerHTML = '<i class="fa-solid fa-ellipsis"></i>'

    newDiv.appendChild(roomNameDiv)
    newDiv.appendChild(lastMessageDiv)
    newDiv.appendChild(dots3Div)

    const kid = container.children[0]
    container.insertBefore(newDiv, kid)

    roomNameDiv.children[0].focus()
    roomNameDiv.children[0].addEventListener("keydown", (k) => {
        if (k.code === "Enter") {
            const name = roomNameDiv.children[0].value
            roomNameDiv.innerHtml = roomNameDiv.children[0].value
            roomNameDiv.children[0].remove()
            roomNameDiv.textContent = name
            createNewRoom(name)
        }
    })

})