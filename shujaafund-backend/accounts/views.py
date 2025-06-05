from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Profile
import uuid
from .serializers import UserSerializer, ProfileSerializer

@api_view(['POST'])
def register(request):
    try:
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        phone_number = request.data.get('phone_number', '')

        if User.objects.filter(username=username).exists() or User.objects.filter(email=email).exists():
            return Response({'error': 'Username or email already exists'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password)
        profile = Profile.objects.create(user=user, phone_number=phone_number, email_token=str(uuid.uuid4()))

        send_mail(
            'Verify Your ShujaaFund Account',
            f'Click to verify: {request.build_absolute_uri(f"/api/accounts/activate/{profile.email_token}/")}',
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )
        return Response({'message': 'Registration successful. Check your email to verify.'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def activate_email(request, email_token):
    try:
        profile = get_object_or_404(Profile, email_token=email_token)
        profile.is_email_verified = True
        profile.email_token = ''
        profile.save()
        return Response({'message': 'Email verified successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user and user.profile.is_email_verified:
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data
        }, status=status.HTTP_200_OK)
    return Response({'error': 'Invalid credentials or unverified email'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile(request):
    profile = request.user.profile
    if request.method == 'GET':
        return Response(ProfileSerializer(profile).data)
    elif request.method == 'PUT':
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)