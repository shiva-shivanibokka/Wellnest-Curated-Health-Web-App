from django.urls import path
from . import views
from .views import UserLoginView

urlpatterns = [
    # API Routes
    path('api/users/', views.UserListView.as_view(), name='user-list'),
    path('api/users/create/', views.UserCreateView.as_view(), name='user-create'),
    path('api/users/search/', views.UserSearchView.as_view(), name='user-search'),

    # Page Routes
    path('', views.index, name='index'),  # ✅ changed from 'home' to 'index'
    path('signup/', views.signup, name='signup'),
    path('signin/', views.login, name='signin'),
    path('about/', views.about, name='about'),
    path('socials/', views.socials, name='socials'),
    path('review/', views.review, name='review'),
    path('calendar/', views.calendar_view, name='calendar'),
    path('progress/', views.progress_view, name='progress'),
    path('profile/', views.profile, name='profile'),
    path('api/users/login/', UserLoginView.as_view(), name='user-login'),
    path('group/', views.wellnest_group_view, name='wellnest_group'),
]
