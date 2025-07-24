from rest_framework import generics, filters
from .models import User
from .serializers import UserSerializer, UserCreateSerializer
from django.conf import settings
import os
from django.db.models import Q
import calendar
from datetime import date
from datetime import date, timedelta
from datetime import datetime
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password
from django.contrib.auth import login as django_login
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import WaterIntake
from .models import RecurringHabit
from .models import User, WaterIntake, FoodIntake, SleepLog, WorkoutLog, RecurringHabit
from django.http import JsonResponse



class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer

    def perform_create(self, serializer):
        # Save the new user
        user = serializer.save()
        # Auto-log the new user (sets request.session)
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

#simple calendar view python rather than google calendar
@login_required(login_url='/signin/')
def calendar_view(request):
    today = date.today()

    ## place today in the middle box 
    week_days = [ today + timedelta(days=offset) for offset in range(-3, 4) ]
    return render(request, 'calendar.html', {
        'today':     today,
        'week_days': week_days,
        'year': today.year,
        'user' : request.user,
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

def progress_view(request):
    return render(request, 'progress.html')

def profile(request):
    return render(request, 'profile.html')



#adding habits
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_recurring_habit(request):
    habit = RecurringHabit.objects.create(
        user=request.user,
        habit_type=request.data.get("habit_type"),
        name=request.data.get("name"),
        weekdays=request.data.get("weekdays"),  # should be a list like ["Monday", "Wednesday"]
        default_value=request.data.get("default_value")
    )
    return Response({"message": "Recurring habit created.", "id": habit.id}, status=201)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_recurring_habits(request):
    habits = RecurringHabit.objects.filter(user=request.user)
    return Response([
        {
            "name": habit.name,
            "habit_type": habit.habit_type,
            "weekdays": habit.weekdays,
            "default_value": habit.default_value
        } for habit in habits
    ])


#showing habits
@login_required
def get_today_recurring_habits(request):
    user = request.user
    today_weekday = datetime.now().strftime("%A")  # depending on days of the week 
    
    habits = RecurringHabit.objects.filter(user=user)
    today_habits = [
        {
            "name": habit.name,
            "habit_type": habit.habit_type,
        }
        for habit in habits
        if today_weekday in habit.weekdays
    ]
    
    return JsonResponse({"habits": today_habits})

#logging habits
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_water_habit(request):
    WaterIntake.objects.create(user=request.user, amount_ml=250.0)
    return Response({"message": "Water habit added successfully"}, status=201)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_water_habits(request):
    user = request.user
    has_water_log = WaterIntake.objects.filter(user=user).exists()
    return Response({"has_water_habit": has_water_log})