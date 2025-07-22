from django.urls import path
from . import views

urlpatterns = [
    # path('users/', views.UserListCreateView.as_view(), name='user-list-create'),
    # path('users/<int:pk>/', views.UserDetailView.as_view(), name='user-detail'),

    # API Routes
    path('api/users/', views.UserListView.as_view(), name='user-list'),
    path('api/users/create/', views.UserCreateView.as_view(), name='user-create'),
    path('api/users/search/', views.UserSearchView.as_view(), name='user-search'),
    
    # Page Routes
    path('', views.index, name='home'),
    path('signup', views.signup, name='signup'),
    path('signin', views.login, name='signin'),
    path('about', views.about, name='about'),
    path('socials', views.socials, name='socials'),
    path('review', views.review, name='review'),
    path('calendar', views.calendar, name='calendar'),
    path('progress', views.progress_view, name='progress'),
]
