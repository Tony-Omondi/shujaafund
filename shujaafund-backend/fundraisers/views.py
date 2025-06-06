from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Fundraiser, Donation
from .serializers import FundraiserSerializer, DonationSerializer

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
    try:
        fundraiser = Fundraiser.objects.get(id=id)
        serializer = FundraiserSerializer(fundraiser)
        return Response(serializer.data)
    except Fundraiser.DoesNotExist:
        return Response({'error': 'Fundraiser not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def explore_fundraisers(request):
    fundraisers = Fundraiser.objects.filter(is_verified=True)
    serializer = FundraiserSerializer(fundraisers, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard(request):
    try:
        # Get user's fundraisers
        fundraisers = Fundraiser.objects.filter(organizer=request.user)
        fundraiser_serializer = FundraiserSerializer(fundraisers, many=True)
        
        # Get user's donations
        donations = Donation.objects.filter(donor=request.user)
        donation_serializer = DonationSerializer(donations, many=True)
        
        return Response({
            'fundraisers': fundraiser_serializer.data,
            'donations': donation_serializer.data
        })
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)