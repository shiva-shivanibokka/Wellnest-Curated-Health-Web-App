from rest_framework import generics, filters
from .models import User
from .serializers import UserSerializer, UserCreateSerializer
from django.shortcuts import render
from django.conf import settings
import os
from django.db.models import Q

class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserSearchView(generics.ListAPIView):
    serializer_class = UserSerializer

    def get_queryset(self):
        query = self.request.query_params.get('search')
        
        if query:
            queryset = User.objects.filter(
                Q(username__icontains=query) |
                Q(first_name__icontains=query) |
                Q(last_name__icontains=query)
            )
            return queryset
        
        return User.objects.none()

def index(request):
    return render(request, 'home.html')

def signup(request):
    return render(request, 'signup.html')

def login(request):
    return render(request, 'signin.html')

def about(request):
    return render(request, 'about.html')

def socials(request):
    return render(request, 'socials.html')

def review(request):
    return render(request, 'review.html')

def calendar(request):
    return render(request, 'calendar.html')