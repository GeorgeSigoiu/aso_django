from django.shortcuts import render
from .models import *
from django.http import HttpResponse
from django.core.files.storage import FileSystemStorage


loggedUser = ""


def renderChat(request):
    global loggedUser
    userRooms = UserRoom.objects.filter(user=loggedUser)
    chats = []
    for userRoom in userRooms:
        room = userRoom.room
        messages = Message.objects.filter(room=room).order_by("created")
        messages_list = []
        for message in messages:
            one_message = {
                "text": message.text,
                "photo": message.photo,
                "user_name": message.user.name,
                "user_id": str(message.user.id),
                "date": message.created.date().isoformat()[0:8],
                "time": message.created.time().isoformat()[0:8]
            }
            messages_list.append(one_message)

        if (len(messages_list) == 0):
            chat = {
                "room_name": userRoom.room.name,
                "messages": [],
                "id": str(userRoom.room.id),
                "last_message": ""
            }
            chats.append(chat)
        else:
            chat = {
                "room_name": userRoom.room.name,
                "messages": messages_list,
                "id": str(userRoom.room.id),
                "last_message": messages_list[-1]["text"]
            }
            chats.append(chat)
    context = {
        "chats": chats,
        "user_name": loggedUser.name
    }
    return render(request, "messages.html", context=context)


def createAccount(request):
    if (request.method == "POST"):
        username = request.POST.get("username")
        password = request.POST.get("password")
        name = request.POST.get("name")
        email = request.POST.get("email")
        user = MyUser()
        user.username = username
        user.password = password
        user.name = name
        user.email = email
        try:
            user.save()
        except:
            return render(request, "login.html", {"error": "creation"})

        return render(request, "dashboard.html", {"user": user})

    return render(request, "main.html")


def login(request):
    if (request.method == "POST"):
        username = request.POST.get("username")
        password = request.POST.get("password")
        try:
            user = MyUser.objects.get(username=username, password=password)
            global loggedUser
            loggedUser = user
        except:
            return render(request, "login.html", {"error": "login"})
        return render(request, "dashboard.html", context={"user": user})

    return render(request, "main.html")


def logout(request):
    global loggedUser
    loggedUser = ""
    return render(request, "login.html")


def renderDashboard(request):
    global loggedUser
    return render(request, "dashboard.html", {"user": loggedUser})


def getUser(request, pk):
    if request.method == "GET":
        try:
            user = MyUser.objects.get(id=pk)
        except:
            return HttpResponse(status=404)
        return HttpResponse(status=200, content={user.json()})

    return HttpResponse(status=405)


def createRoom(request):
    if (request.method == "POST"):
        room_name = request.POST.get("room_name")
        room = Room()
        room.name = room_name
        room.save()
        room_user = UserRoom()
        global loggedUser
        room_user.user = loggedUser
        room_user.room = room
        room_user.save()
        return HttpResponse(status=201, content={str(room.id)})
    return HttpResponse(status=405)


def getParticipants(request, pk):
    if request.method == "GET":
        room = Room.objects.get(id=pk)
        userrooms = UserRoom.objects.filter(room=room)
        mylist = "["
        x = 0
        for user_room in userrooms:
            if x == 0:
                x = 1
                mylist = mylist+"\""+user_room.user.name+"\""
            else:
                mylist = mylist+",\""+user_room.user.name+"\""
        mylist = mylist+"]"
        return HttpResponse(status=200, content={mylist})
    return HttpResponse(status=405)


def usersNotInRoom(request, pk):
    if request.method == "GET":
        room = Room.objects.get(id=pk)
        user_rooms = UserRoom.objects.filter(room=room)

        def mapping(n):
            return n.user

        users = map(mapping, user_rooms)
        all_users1 = MyUser.objects.all()
        all_users = []
        for user in all_users1:
            all_users.append(user)

        for user in users:
            all_users.remove(user)
        resp = []
        for user in all_users:
            resp.append({
                "id": str(user.id),
                "name": user.name
            })
        return HttpResponse(status=200, content={str(resp)})
    return HttpResponse(status=405)


def addUserToRoom(request):
    if request.method == "POST":
        user_id = request.POST.get("user_id")
        room_id = request.POST.get("room_id")
        user = MyUser.objects.get(id=user_id)
        room = Room.objects.get(id=room_id)
        user_room = UserRoom()
        user_room.user = user
        user_room.room = room
        user_room.save()
        return HttpResponse(status=201)
    return HttpResponse(status=405)


def addMessageOrImage(request):
    if request.method == "POST":
        file_url = ""
        try:
            fileToUpload = request.FILES["fileToUpload"]
            fss = FileSystemStorage()
            file = fss.save("ph/"+fileToUpload.name, fileToUpload)
            file_url = fss.url(file)
        except:
            pass
        print("file_url", file_url)

        global loggedUser
        message = request.POST.get("message")
        room_id = request.POST.get("room_id")
        print("message", message)
        newMessage = Message()
        newMessage.user = loggedUser
        newMessage.room = Room.objects.get(id=room_id)
        newMessage.text = message
        newMessage.photo = file_url
        newMessage.save()
        return HttpResponse(status=200, content={str(file_url)})
    return HttpResponse(status=405)


def leaveRoom(request):
    if request.method == "POST":
        room_id = request.POST.get("room_id")
        room = Room.objects.get(id=room_id)
        global loggedUser
        user_room = UserRoom.objects.get(room=room, user=loggedUser)
        user_room.delete()
        return HttpResponse(status=200)
    return HttpResponse(status=405)
