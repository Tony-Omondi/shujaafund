from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Fundraiser, Donation
from .serializers import FundraiserSerializer, DonationSerializer
from django.shortcuts import get_object_or_404

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_fundraiser(request):
    try:
        serializer = FundraiserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(organizer=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def fundraiser_detail(request, id):
    fundraiser = get_object_or_404(Fundraiser, id=id)
    serializer = FundraiserSerializer(fundraiser)
    return Response(serializer.data)

@api_view(['GET'])
def explore_fundraisers(request):
    category = request.query_params.get('category')
    search = request.query_params.get('search')
    fundraisers = Fundraiser.objects.filter(is_verified=True)
    if category:
        fundraisers = fundraisers.filter(category__slug=category)
    if search:
        fundraisers = fundraisers.filter(title__icontains=search)
    serializer = FundraiserSerializer(fundraisers, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_dashboard(request):
    fundraisers = Fundraiser.objects.filter(organizer=request.user)
    donations = Donation.objects.filter(donor=request.user)
    return Response({
        'fundraisers': FundraiserSerializer(fundraisers, many=True).data,
        'donations': DonationSerializer(donations, many=True).data
    })