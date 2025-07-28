from django.urls import path
from . import views
from .views import UserLoginView
from .views import get_today_recurring_habits
from .views import recurring_habits
from .views import log_completed_habit, delete_habit_log


urlpatterns = [
    # path('users/', views.UserListCreateView.as_view(), name='user-list-create'),
    # path('users/<int:pk>/', views.UserDetailView.as_view(), name='user-detail'),

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
    path('group/', views.wellnest_group_view, name='wellnest_group'),
    #login api
    path('api/users/login/', UserLoginView.as_view(), name='user-login'),
    #creating habit apis
    path('api/habit/recurring/', recurring_habits, name='recurring-habits'),
    # log habit
    path('api/habit/log/', log_completed_habit, name='log_completed_habit'),
    #delete habit
    path('api/habit/log/delete/', delete_habit_log, name='delete_habit_log'),
    
    #show habit api
    path('api/habit/recurring/today/', get_today_recurring_habits),
]
