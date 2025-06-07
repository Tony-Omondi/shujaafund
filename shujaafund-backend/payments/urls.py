from django.urls import path
from . import views

urlpatterns = [
    path('initiate/', views.initiate_payment, name='initiate_payment'),
    path('callback/', views.payment_callback, name='payment_callback'),
    path('api/csrf-token/', views.get_csrf_token, name='csrf-token'),
]