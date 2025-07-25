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
from .models import User, WaterIntake, FoodIntake, SleepLog, WorkoutLog, RecurringHabit
from django.http import JsonResponse
from .models import RecurringHabit
from .serializers import RecurringHabitSerializer
from .models import HabitLog
from .serializers import HabitLogSerializer



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

#showing habits for that day
@login_required
def get_today_recurring_habits(request):
    user = request.user
    today_weekday = datetime.now().strftime("%A")  # depending on days of the week 
    
    habits = RecurringHabit.objects.filter(user=user)
    today_habits = [
        {
            "name": habit.name,
            "habit_type": habit.habit_type,
            "description": habit.description,
            "color": habit.color,
            "value": habit.value,
        }
        for habit in habits
        if today_weekday in habit.weekdays
    ]
    
    return JsonResponse({"habits": today_habits})

# recurring habit GET and POST API we can see what habits a user has and post habits they want to create
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def recurring_habits(request):
    if request.method == 'GET':
        habits = RecurringHabit.objects.filter(user=request.user)
        serializer = RecurringHabitSerializer(habits, many=True)
        return Response(serializer.data)

    # POST
    serializer = RecurringHabitSerializer(data=request.data)
    if serializer.is_valid():
        # attach the user before saving
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#Habit log, we keep record of Done Habits
@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
def log_completed_habit(request):
    if request.method == 'POST':
        serializer = HabitLogSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)  # attach user
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    # If GET
    logs = HabitLog.objects.filter(user=request.user).order_by('-timestamp')
    serializer = HabitLogSerializer(logs, many=True)
    return Response(serializer.data)


# Deleting a logged habit if the user says they haven't done it
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_habit_log(request):
    user = request.user
    name = request.data.get('name')
    habit_type = request.data.get('habit_type')
    date_str = request.data.get('date')

    if not all([name, habit_type, date_str]):
        return Response({"error": "Missing data"}, status=400)

    try:
        date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()
        logs = HabitLog.objects.filter(
            user=user,
            name=name,
            habit_type=habit_type,
            timestamp__date=date_obj
        )
        deleted_count, _ = logs.delete()
        return Response({"deleted": deleted_count})
    except Exception as e:
        return Response({"error": str(e)}, status=400)