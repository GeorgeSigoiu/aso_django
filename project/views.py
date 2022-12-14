from django.shortcuts import render


def renderMain(request):
    return render(request, "main.html")


def renderLogin(request):
    return render(request, "login.html")


