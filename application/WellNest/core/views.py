from rest_framework import generics, filters
from .models import User
from .serializers import UserSerializer, UserCreateSerializer
from django.conf import settings
import requests
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
from collections import defaultdict
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.utils import timezone
from .models import Wellnest_Circle

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
    today_weekday = timezone.localtime().strftime("%A") # depending on days of the week 
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



# quote of the day
@api_view(['GET'])
def daily_quote_proxy(request):
    try:
        response = requests.get("https://zenquotes.io/api/today", timeout=5)

        return Response(response.json())
    except Exception as e:
        print("[ERROR] Exception occurred:", str(e))
        return Response({"error": "Unable to fetch quote"}, status=500)

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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def progress_by_day(request):
    user = request.user
    today = timezone.localdate()
    week_start = today - timedelta(days=today.weekday())  # Monday
    week_end = week_start + timedelta(days=6)

    # Build day list: Sunday to Saturday
    days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    total = defaultdict(int)
    completed = defaultdict(int)

    # Load logs once
    logs = HabitLog.objects.filter(user=user, timestamp__date__range=(week_start, week_end))
    log_set = set((log.name, log.habit_type, timezone.localtime(log.timestamp).strftime('%A')) for log in logs)

    # Check every habit for scheduled days
    habits = RecurringHabit.objects.filter(user=user)
    for habit in habits:
        weekdays = habit.weekdays or []
        if isinstance(weekdays, str):
            try:
                weekdays = json.loads(weekdays)
            except:
                weekdays = []

        for day in weekdays:
            total[day] += 1
            if (habit.name, habit.habit_type, day) in log_set:
                completed[day] += 1

    # Final % per day
    percentages = []
    for day in days:
        c = completed[day]
        t = total[day]
        pct = min(int((c / t) * 100), 100) if t > 0 else 0
        percentages.append(pct)

    return Response({'labels': days, 'percentages': percentages})



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def progress_by_habit(request):
    user = request.user
    today = timezone.localdate()
    week_start = today - timedelta(days=today.weekday())  # Monday
    week_end = week_start + timedelta(days=6)  # Sunday

    habits = RecurringHabit.objects.filter(user=user)
    logs = HabitLog.objects.filter(user=user, timestamp__date__range=(week_start, today))

    habit_data = []

    for habit in habits:
        scheduled_days = habit.weekdays or []
        if isinstance(scheduled_days, str):
            try:
                scheduled_days = json.loads(scheduled_days)
            except:
                scheduled_days = []

        scheduled_day_names = set(scheduled_days)

        #total expected completions this week (Mon–Sun)
        expected_total = sum(
            1 for i in range(7)
            if (week_start + timedelta(days=i)).strftime('%A') in scheduled_day_names
        )

        # Count completions
        completed_so_far = logs.filter(name=habit.name, habit_type=habit.habit_type).count()

        percent = int((completed_so_far / expected_total) * 100) if expected_total > 0 else 0
        percent = min(percent, 100)

        offset = 339.292 - (339.292 * percent / 100)

        habit_data.append({
            'name': habit.name,
            'value': percent,
            'offset': offset
        })

    return Response(habit_data)

#Get and show friends
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_friends(request):
    user = request.user
    
    friends = Friend.objects.filter(Q(user1=user) | Q(user2=user))
    
    #their info
    friend_data = []
    for f in friends:
        other = f.user2 if f.user1 == user else f.user1
        friend_data.append({
            "id": other.id,
            "username": other.username,
            "first_name": other.first_name,
            "last_name": other.last_name,
            "gender": other.gender
        })
    
    return Response(friend_data)

# Creating Wellnest Circle
# @login_required
@csrf_exempt
def create_wellnest_circle(request):
    if request.method == 'POST':
        if not request.user.is_authenticated:
            return JsonResponse({'success': False, 'error': 'User not logged in'})

        data = json.loads(request.body)
        name = data.get('name')
        description = data.get('description', '')
        
        circle = Wellnest_Circle.objects.create(
            name=name,
            description=description,
            created_by=request.user
        )

        circle.members.add(request.user)
        
        return JsonResponse({
            'success': True,
            'circle_id': circle.id,
            'name': circle.name
        })

# Joining Wellnest Circle
@login_required
@csrf_exempt
def join_wellnest_circle(request, circle_id):
    if request.method == 'POST':
        circle = get_object_or_404(Wellnest_Circle, id=circle_id)
        circle.add_member(request.user)
        
        return JsonResponse({
            'success': True,
        })

@login_required
@csrf_exempt
def get_wellnest_circles(request):
    if request.method == 'GET':
        from django.contrib.auth import get_user_model
        User = get_user_model()
        user = request.user
        
        created_circles = Wellnest_Circle.objects.filter(created_by=user)
        member_circles = Wellnest_Circle.objects.filter(members=user)
        
        all_circles = (created_circles | member_circles).distinct()
        
        circles_data = []
        for circle in all_circles:
            circles_data.append({
                'id': circle.id,
                'name': circle.name,
                'description': circle.description,
                'created_by': circle.created_by.username,
                'member_count': circle.members.count(),
                'created_at': circle.created_at.isoformat(),
                'is_creator': circle.created_by == user
            })
        
        return JsonResponse({
            'success': True,
            'circles': circles_data
        })

@login_required
@csrf_exempt
def search_wellnest_circles(request):
    if request.method == 'GET':
        if not request.user.is_authenticated:
            return JsonResponse({'success': False, 'error': 'User not logged in'})
            
        search_query = request.GET.get('name', '')
        
        if not search_query:
            return JsonResponse({'success': True, 'circles': []})
        
        circles = Wellnest_Circle.objects.filter(name__icontains=search_query)
        
        circles_data = []
        for circle in circles:
            circles_data.append({
                'id': circle.id,
                'name': circle.name,
                'description': circle.description,
                'created_by': circle.created_by.username,
                'member_count': circle.members.count(),
                'created_at': circle.created_at.isoformat(),
                'is_creator': circle.created_by == request.user,
                'is_member': request.user in circle.members.all()
            })
        
        return JsonResponse({
            'success': True,
            'circles': circles_data
        })