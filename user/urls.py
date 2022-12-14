from . import views
from django.urls import path


urlpatterns = [
    path('chat', views.renderChat, name="chat"),
    path('create-user', views.createAccount, name="create-user"),
    path('login-user', views.login, name="login"),
    path('logout', views.logout, name="logout"),
    path('dashboard', views.renderDashboard, name="dashboard"),
    path("get-user/<pk>", views.getUser, name="get-user"),
    path("get-user-not-in-room/<pk>", views.usersNotInRoom,
         name="get-user-not-in-room"),
    path("add-message", views.addMessageOrImage, name="add-message"),
    path("add-user-to-room", views.addUserToRoom, name="add-user-to-room"),
    path("create-room", views.createRoom, name="create-room"),
    path("get-participants/<pk>", views.getParticipants, name="get-participants"),
    path("user-leave-room", views.leaveRoom, name="user-leave-room"),

]
