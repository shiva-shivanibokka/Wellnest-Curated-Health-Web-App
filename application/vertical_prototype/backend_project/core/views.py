from rest_framework import generics
from .models import User
from .serializers import UserSerializer, UserCreateSerializer
from django.shortcuts import render
from django.conf import settings
import os

class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

def index(request):
    return render(request, 'home.html')