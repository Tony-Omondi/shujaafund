from django.urls import path
from . import views
from social_django.views import auth, complete

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('activate/<str:email_token>/', views.activate_email, name='activate_email'),
    path('profile/', views.profile, name='profile'),
    path('auth/google/', auth, {'backend': 'google-oauth2'}, name='google_login'),
    path('auth/google/callback/', complete, {'backend': 'google-oauth2'}, name='google_complete'),
]