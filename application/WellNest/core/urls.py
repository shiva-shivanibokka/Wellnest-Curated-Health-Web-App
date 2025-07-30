from django.urls import path
from . import views
from .views import UserLoginView
from .views import get_today_recurring_habits
from .views import recurring_habits
from .views import log_completed_habit, delete_habit_log
from .views import daily_quote_proxy


urlpatterns = [
    # path('users/', views.UserListCreateView.as_view(), name='user-list-create'),
    # path('users/<int:pk>/', views.UserDetailView.as_view(), name='user-detail'),

    #daily quote proxy API
    path('quote/', daily_quote_proxy),

    # API Routes
    path('api/users/', views.UserListView.as_view(), name='user-list'),
    path('api/users/create/', views.UserCreateView.as_view(), name='user-create'),
    path('api/users/search/', views.UserSearchView.as_view(), name='user-search'),
    
    # Page Routes
    path('', views.index, name='home'),
    path('signup/', views.signup, name='signup'),
    path('signin/', views.login, name='signin'),
    path('about/', views.about, name='about'),
    path('socials/', views.socials, name='socials'),
    path('review/', views.review, name='review'),
    path('calendar/', views.calendar_view, name='calendar'),
    path('progress/', views.progress_view, name='progress'),
    path('profile/', views.profile, name='profile'),
    #login api
    path('api/users/login/', UserLoginView.as_view(), name='user-login'),
    #creating habit apis
    path('api/habit/recurring/', recurring_habits, name='recurring-habits'),
    # log habit
    path('api/habit/log/', log_completed_habit, name='log_completed_habit'),
    #delete habit log
    path('api/habit/log/delete/', delete_habit_log, name='delete_habit_log'),
    
    #show habit api
    path('api/habit/recurring/today/', get_today_recurring_habits),

    #delet habit
    path('api/habit/recurring/delete/', views.delete_recurring_habit, name='delete_recurring_habit'),

    # notification and friend request APIS
    path('api/friends/send/', views.send_friend_request, name='send_friend_request'),
    path('api/friends/accept/', views.accept_friend_request, name='accept_friend_request'),
    path('api/notifications/', views.get_notifications, name='get_notifications'),

    path('api/progress/days/', views.progress_by_day, name='progress_by_day'),
    path('api/progress/habits/', views.progress_by_habit, name='progress_by_habit'),

    # get friends API
    path('api/friends/list/', views.get_friends, name='get_friends'),

]
