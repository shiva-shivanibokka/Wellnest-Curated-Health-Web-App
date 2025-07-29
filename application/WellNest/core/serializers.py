from rest_framework import serializers
from .models import User
from django.contrib.auth.hashers import make_password
from .models import RecurringHabit
from .models import HabitLog
from .models import FriendRequest, Notification


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, source='encrypted_password')
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name', 'gender', 'created_at']
        extra_kwargs = {
            'password': {'write_only': True},
            'created_at': {'read_only': True},
        }

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'gender']
    
    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            gender=validated_data['gender']
        )
        user.set_password(validated_data['password'])  
        user.save()
        return user

# Recurring Habit
class RecurringHabitSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecurringHabit
        fields = [
            'id',
            'name',
            'habit_type',
            'weekdays',
            'value',
            'description',
            'color',
            'timestamp',
        ]
        read_only_fields = ['id', 'timestamp']

# Logging habit

class HabitLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = HabitLog
        fields = ['habit_type', 'name', 'description', 'color', 'value', 'timestamp']
        read_only_fields = ['timestamp']

# friend request
class FriendRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendRequest
        fields = '__all__'
        read_only_fields = ['timestamp', 'is_accepted']

#notification
class NotificationSerializer(serializers.ModelSerializer):
    # add request_id 
    request_id = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ['timestamp', 'is_read']

    def get_request_id(self, obj):
        # find friend request
        if "sent you a friend request" in obj.message:
            try:
                sender_username = obj.message.split(" ")[0]
                sender = User.objects.get(username=sender_username)
                friend_request = FriendRequest.objects.get(sender=sender, receiver=obj.user, is_accepted=False)
                return friend_request.id
            except:
                return None
        return None