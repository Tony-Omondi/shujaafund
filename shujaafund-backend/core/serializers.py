from rest_framework import serializers
from .models import Category, Feedback

class CategorySerializer(serializers.ModelSerializer):
    name = serializers.CharField()
    slug = serializers.SlugField(max_length=100)

    class Meta:
        model = Category
        fields = ['name', 'slug']

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ['message', 'created_at']