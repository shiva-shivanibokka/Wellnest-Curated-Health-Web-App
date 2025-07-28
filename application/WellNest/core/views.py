from rest_framework import generics, filters
from .models import User
from .serializers import UserSerializer, UserCreateSerializer
from django.conf import settings
import os
from django.db.models import Q
import calendar
from datetime import datetime, time
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
import json
from .models import RecurringHabit
from .serializers import RecurringHabitSerializer
from .models import HabitLog
from .serializers import HabitLogSerializer
from django.utils import timezone
from .models import FriendRequest, Notification
from .serializers import FriendRequestSerializer, NotificationSerializer
from .models import Friend

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

def wellnest_group_view(request):
    return render(request, 'core/group.html')

#showing habits for that day
@login_required
def get_today_recurring_habits(request):
    user = request.user
    today_weekday = datetime.now().strftime("%A")  # depending on days of the week 
    today_date = timezone.localdate()

    habits = RecurringHabit.objects.filter(user=user)
    today_habits = []
    for habit in habits:
        weekdays = habit.weekdays or []
        if isinstance(weekdays, str):
            try:
                weekdays = json.loads(weekdays)

            except json.JSONDecodeError:
                weekdays = []
        if today_weekday in weekdays:
            today_habits.append(habit)
  

    start = datetime.combine(today_date, time.min).astimezone()
    end   = datetime.combine(today_date, time.max).astimezone()

    logged_names = set( HabitLog.objects.filter(
        user=user,
        timestamp__range=(start, end)
    ).values_list('name', flat=True)
    )

    #accounting for done and to do habits 
    todo = []
    done = []

    # filtering habits that the user says theyve done
    for habit in today_habits:
        habit_data = {
            "name": habit.name,
            "habit_type": habit.habit_type,
            "description": habit.description,
            "color": habit.color,
            "value": habit.value,
            "weekdays": habit.weekdays,
        }
        if habit.name in logged_names:
            done.append(habit_data)
        else:
            todo.append(habit_data)

    return JsonResponse({"todo": todo, "done": done})


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
        start = timezone.make_aware(datetime.strptime(date_str, "%Y-%m-%d"))
        end = start + timedelta(days=1)

        logs = HabitLog.objects.filter(
            user=user,
            name=name,
            habit_type=habit_type,
            timestamp__gte=start,
            timestamp__lt=end
        )

        print(f"[DEBUG] Found {logs.count()} logs to delete for {name} on {date_str}")

        deleted_count, _ = logs.delete()
        return Response({"deleted": deleted_count})
    except Exception as e:
        return Response({"error": str(e)}, status=400)

# Deleting habits

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_recurring_habit(request):
    user = request.user
    name = request.data.get('name')
    habit_type = request.data.get('habit_type')

    if not all([name, habit_type]):
        return Response({"error": "Missing name or habit_type"}, status=400)

    try:
        deleted, _ = RecurringHabit.objects.filter(
            user=user,
            name=name,
            habit_type=habit_type
        ).delete()

        if deleted:
            return Response({"success": True})
        else:
            return Response({"error": "Habit not found"}, status=404)

    except Exception as e:
        return Response({"error": str(e)}, status=500)

# send friend request 

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_friend_request(request):
    receiver_id = request.data.get('receiver_id')
    sender = request.user

    if sender.id == receiver_id:
        return Response({"error": "Cannot send request to yourself"}, status=400)

#not allowing spam
    if FriendRequest.objects.filter(sender=sender, receiver_id=receiver_id).exists():
        return Response({"error": "Friend request already sent"}, status=400)

    FriendRequest.objects.create(sender=sender, receiver_id=receiver_id)
    Notification.objects.create(user_id=receiver_id, message=f"{sender.username} sent you a friend request.")

    return Response({"message": "Request sent"}, status=200)

# upon accepting friend request
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def accept_friend_request(request):
    request_id = request.data.get('request_id')
    try:
        friend_request = FriendRequest.objects.get(id=request_id, receiver=request.user)

            #if alr accepted
        if friend_request.is_accepted:
            return Response({"message": "Already accepted"}, status=200)

        friend_request.is_accepted = True
        friend_request.save()

        Friend.objects.create(user1=request.user, user2=friend_request.sender)

        Notification.objects.create(user=friend_request.sender, message=f"{request.user.username} accepted your friend request.")
        return Response({"message": "Friend request accepted"})
    except FriendRequest.DoesNotExist:
        return Response({"error": "Request not found"}, status=404)

#notifications

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_notifications(request):
    notifications = Notification.objects.filter(user=request.user).order_by('-timestamp')
    serializer = NotificationSerializer(notifications, many=True)
    return Response(serializer.data)