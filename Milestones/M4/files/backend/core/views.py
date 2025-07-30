from rest_framework import generics, filters
from .models import User, Custom_Habit
from .serializers import UserSerializer, UserCreateSerializer
from django.shortcuts import render
from django.conf import settings
import os
from django.db.models import Q
import calendar
from datetime import date, timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password
from django.contrib.auth import login as django_login
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate
from rest_framework.authentication import SessionAuthentication
from collections import defaultdict
from django.utils.timezone import localtime
import json


class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        django_login(self.request, user)


class UserLoginView(APIView):
    authentication_classes = [SessionAuthentication]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        user = authenticate(request=request, username=user.username, password=password)
        if user:
            django_login(request, user)
            return Response(UserSerializer(user).data)
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


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


# @login_required(login_url='/signin/')
def calendar_view(request):
    today = date.today()
    week_days = [today + timedelta(days=offset) for offset in range(-3, 4)]
    return render(request, 'calendar.html', {
        'today': today,
        'week_days': week_days,
        'year': today.year,
        'user': request.user,
    })


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

def wellnest_group_view(request):
    return render(request, 'wellnest_group.html')

def progress_view(request):
    habits = Custom_Habit.objects.all()
    habit_raw_data = defaultdict(lambda: [0] * 7)

    for habit in habits:
        weekday = localtime(habit.timestamp).weekday()
        weekday = (weekday + 1) % 7  # Shift so Sunday = 0
        habit_raw_data[habit.name][weekday] += 1

    habit_data = []
    for name, weekly_counts in habit_raw_data.items():
        max_val = max(weekly_counts)
        avg_completion = (
            (sum(weekly_counts) / (max_val * 7)) * 100 if max_val > 0 else 0
        )
        habit_data.append({
            'name': name,
            'value': round(avg_completion)
        })

    context = {
        'habit_data': habit_data,
    }
    return render(request, 'progress.html', context)




def profile(request):
    return render(request, 'profile.html')
