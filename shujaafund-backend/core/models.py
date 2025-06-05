from django.db import models
from django.contrib.auth.models import User
from parler.models import TranslatableModel, TranslatedFields

class Category(TranslatableModel):
    translations = TranslatedFields(
        name=models.CharField(max_length=100),
        slug=models.SlugField(max_length=100, unique=True)
    )

    def __str__(self):
        return self.name

class Feedback(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback from {self.user.username if self.user else 'Guest'}"