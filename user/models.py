from django.db import models
import uuid
# Create your models here.


class MyUser(models.Model):
    id = models.UUIDField(default=uuid.uuid4, unique=True,
                          null=False, primary_key=True, editable=False)
    username = models.CharField(
        max_length=40, blank=False, unique=True, null=False)
    password = models.CharField(max_length=40, blank=False, null=False)
    name = models.CharField(max_length=60, blank=False, null=False)
    email = models.CharField(max_length=60, blank=False, null=False)

    def __str__(self) -> str:
        return self.name + " (" + self.username + ")"

    def json(self) -> str:
        return '{"name":"'+self.name+'","id":"'+str(self.id)+'","username":"'+self.username+'","password":"'+self.password+'","email":"'+self.email+'"}'


class Room(models.Model):
    id = models.UUIDField(default=uuid.uuid4, null=False,
                          unique=True, primary_key=True, editable=False)
    name = models.CharField(max_length=100, null=False, blank=False)

    def __str__(self) -> str:
        return self.name+"("+str(self.id)+")"


class UserRoom(models.Model):
    id = models.UUIDField(default=uuid.uuid4, null=False,
                          unique=True, primary_key=True, editable=False)
    # on_delete=models.SET_NULL, CASCADE
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return "U: " + self.user.name + " R: " + self.room.name


class Message(models.Model):
    id = models.UUIDField(default=uuid.uuid4, null=False,
                          unique=True, primary_key=True, editable=False)
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE, null=True)
    room = models.ForeignKey(Room, on_delete=models.CASCADE, null=True)
    created = models.DateTimeField(auto_now_add=True)
    text = models.TextField(null=True, blank=True)
    photo = models.CharField(max_length=200, null=True, blank=True)
