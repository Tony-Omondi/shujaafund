from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('about/', views.about, name='about'),
    path('terms-privacy/', views.terms_privacy, name='terms_privacy'),
    path('admin/', views.admin_dashboard, name='admin_dashboard'),
    path('feedback/', views.feedback, name='feedback'),
]