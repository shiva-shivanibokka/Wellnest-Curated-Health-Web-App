from django.urls import path
from . import views

urlpatterns = [
    # path('users/', views.UserListCreateView.as_view(), name='user-list-create'),
    # path('users/<int:pk>/', views.UserDetailView.as_view(), name='user-detail'),

    # API Routes
    path('api/users/', views.UserListView.as_view(), name='user-list'),
    path('api/users/create/', views.UserCreateView.as_view(), name='user-create'),

    # Page Routes
    path('', views.index, name='home'),
    path('signup', views.signup, name='signup'),
    path('login', views.login, name='login'),
    path('about', views.about, name='about'),
    path('socials', views.socials, name='socials'),
    path('review', views.review, name='review'),
]
