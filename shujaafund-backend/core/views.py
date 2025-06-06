from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from fundraisers.models import Fundraiser
from fundraisers.serializers import FundraiserSerializer
from .models import Feedback, Category
from .serializers import FeedbackSerializer, CategorySerializer

@api_view(['GET'])
def home(request):
    fundraisers = Fundraiser.objects.filter(is_verified=True).order_by('-amount_raised')[:5]
    return Response({
        'featured_fundraisers': FundraiserSerializer(fundraisers, many=True).data
    })

@api_view(['GET'])
def about(request):
    return Response({
        'mission': 'Empowering Kenyans through emergency fundraising.',
        'faq': [
            {'q': 'How does ShujaaFund work?', 'a': 'Create or donate to fundraisers for emergencies.'},
            {'q': 'Is it secure?', 'a': 'Yes, we use Paystack and HTTPS.'}
        ]
    })

@api_view(['GET'])
def terms_privacy(request):
    return Response({
        'terms': 'Terms of use for ShujaaFund...',
        'privacy': 'Privacy policy for ShujaaFund...'
    })

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_dashboard(request):
    fundraisers = Fundraiser.objects.all()
    feedback = Feedback.objects.all()
    return Response({
        'fundraisers': FundraiserSerializer(fundraisers, many=True).data,
        'feedback': FeedbackSerializer(feedback, many=True).data,
        'stats': {
            'total_fundraisers': fundraisers.count(),
            'total_raised': sum(f.amount_raised for f in fundraisers)
        }
    })

@api_view(['POST'])
def feedback(request):
    serializer = FeedbackSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user if request.user.is_authenticated else None)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)