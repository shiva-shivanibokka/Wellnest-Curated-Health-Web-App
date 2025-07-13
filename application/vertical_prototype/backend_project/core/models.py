from django.db import models

class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    encrypted_password = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class WaterIntake(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount_ml = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

class FoodIntake(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    type_of_meal_choices = [
        ('Breakfast', 'Breakfast'),
        ('Lunch', 'Lunch'),
        ('Dinner', 'Dinner'),
    ]
    type_of_meal = models.CharField(max_length= 10, choices=type_of_meal_choices)
    calories = models.FloatField()
    meal_type = models.CharField(max_length=50)
    timestamp = models.DateTimeField(auto_now_add=True)

class SleepLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    duration = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

class WorkoutLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    duration_minutes = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

class Custom_Habit(models.Model):
     user = models.ForeignKey(User, on_delete=models.CASCADE)
     name = models.CharField(max_length= 20)
     duration_minutes = models.FloatField()
     timestamp = models.DateTimeField(auto_now_add=True)