from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings


class User(AbstractUser):
    gender = models.CharField(max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)


    def get_friends(self):
        from .models import Friend
        return User.objects.filter(
            Q(friend_user1__user2=self) | Q(friend_user2__user1=self)
        )

    def __str__(self):
        return self.username

class WaterIntake(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    amount_ml = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

class FoodIntake(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    type_of_meal_choices = [
        ('Breakfast', 'Breakfast'),
        ('Lunch', 'Lunch'),
        ('Dinner', 'Dinner'),
    ]
    type_of_meal = models.CharField(max_length=10, choices=type_of_meal_choices)
    calories = models.FloatField()
    meal_type = models.CharField(max_length=50)
    timestamp = models.DateTimeField(auto_now_add=True)

class SleepLog(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    duration = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)


class WorkoutLog(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    duration_minutes = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)


class Custom_Habit(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=20)
    duration_minutes = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)
  


class RecurringHabit(models.Model):
    HABIT_TYPE_CHOICES = [
        ('water', 'Water Intake'),
        ('food', 'Food Intake'),
        ('sleep', 'Sleep Log'),
        ('workout', 'Workout Log'),
        ('custom', 'Custom'), 
    ]
    COLOR_CHOICES = [
        ('Green', 'Green'),
        ('Purple', 'Purple'),
        ('Gold', 'Gold'),
        ('Red', 'Red'),
        ('Blue', 'Blue'),
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    habit_type = models.CharField(max_length=10, choices=HABIT_TYPE_CHOICES)
    name = models.CharField(max_length=50)
    weekdays = models.JSONField() 
    value = models.FloatField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=20)
    color = models.CharField(max_length=10, choices=COLOR_CHOICES, default='Green')


    def __str__(self):
        return f"{self.user.username} - {self.get_habit_type_display()}"


class HabitLog(models.Model):
    HABIT_TYPE_CHOICES = [
        ('water', 'Water'),
        ('food', 'Food'),
        ('sleep', 'Sleep'),
        ('workout', 'Workout'),
        ('custom', 'Custom'),
    ]

    COLOR_CHOICES = [
        ('Green', 'Green'),
        ('Purple', 'Purple'),
        ('Gold', 'Gold'),
        ('Red', 'Red'),
        ('Blue', 'Blue'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    habit_type = models.CharField(max_length=10, choices=HABIT_TYPE_CHOICES)
    name = models.CharField(max_length=50)
    timestamp = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=100, blank=True)
    color = models.CharField(max_length=10, choices=COLOR_CHOICES, default='Green')
    value = models.FloatField(null=True, blank=True)  # unique fields like ml calorie stuff like that

    def __str__(self):
        return f"{self.user.username} - {self.habit_type} @ {self.timestamp.date()}"

## friend request
class FriendRequest(models.Model):
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_requests')
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_requests')
    timestamp = models.DateTimeField(auto_now_add=True)
    is_accepted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.sender.username} => {self.receiver.username} (Accepted: {self.is_accepted})"

# notifications
class Notification(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    message = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username}: {self.message[:30]}"


## friends table that allows for easier search
class Friend(models.Model):
    user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friend_user1')
    user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friend_user2')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user1', 'user2'],
                name='unique_friendship'
            )
        ]

    def save(self, *args, **kwargs):
        # this makes sure that A and B is the same as B and A, this is prob best practice but w node.js and sql i used to just keep 2 rows
        if self.user1.id > self.user2.id:
            self.user1, self.user2 = self.user2, self.user1
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user1.username} ↔ {self.user2.username}"