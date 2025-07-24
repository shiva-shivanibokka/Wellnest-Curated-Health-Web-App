from django.urls import path
from . import views
from .views import UserLoginView
from .views import add_water_habit
from .views import get_user_water_habits
from .views import get_recurring_habits, create_recurring_habit
from .views import get_today_recurring_habits

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
    #login api
    path('api/users/login/', UserLoginView.as_view(), name='user-login'),
    #creating habit apis
    path('api/habit/recurring/', get_recurring_habits),
    path('api/habit/recurring/create/', create_recurring_habit),

    #logged habit apis
    path('api/water/add/', add_water_habit, name='add-water-habit'),
    path('api/water/', get_user_water_habits, name='get-user-water-habits'),
    
    #show habit api
    path('api/habit/recurring/today/', get_today_recurring_habits),
]
