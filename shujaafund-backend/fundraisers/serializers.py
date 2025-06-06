from rest_framework import serializers
from .models import Fundraiser, Donation, FundBreakdown
from core.models import Category
from core.serializers import CategorySerializer

class FundBreakdownSerializer(serializers.ModelSerializer):
    class Meta:
        model = FundBreakdown
        fields = ['item', 'amount']

class DonationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donation
        fields = ['id', 'amount', 'is_anonymous', 'in_memory_of', 'message', 'created_at']

class FundraiserSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    breakdowns = FundBreakdownSerializer(many=True, read_only=True)
    donations = DonationSerializer(many=True, read_only=True)

    class Meta:
        model = Fundraiser
        fields = ['id', 'title', 'story', 'goal_amount', 'amount_raised', 'category', 'urgency_deadline', 'photo', 'is_verified', 'created_at', 'shareable_link', 'breakdowns', 'donations']

    def create(self, validated_data):
        fundraiser = Fundraiser.objects.create(**validated_data)
        return fundraiser