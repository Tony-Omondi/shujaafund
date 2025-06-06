from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_fundraiser, name='create_fundraiser'),
    path('<uuid:id>/', views.fundraiser_detail, name='fundraiser_detail'),
    path('explore/', views.explore_fundraisers, name='explore_fundraisers'),
    path('dashboard/', views.dashboard, name='dashboard'),
]