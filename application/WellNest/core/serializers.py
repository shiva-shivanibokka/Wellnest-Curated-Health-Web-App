from rest_framework import serializers
from .models import User
from django.contrib.auth.hashers import make_password
from .models import RecurringHabit
from .models import HabitLog


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