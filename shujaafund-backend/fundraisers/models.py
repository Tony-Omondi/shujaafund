from django.db import models
from django.contrib.auth.models import User
import uuid
from django.utils.text import slugify
from core.models import Category

class Fundraiser(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organizer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='fundraisers')
    title = models.CharField(max_length=200)
    story = models.TextField()
    goal_amount = models.DecimalField(max_digits=12, decimal_places=2)
    amount_raised = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='fundraisers')
    urgency_deadline = models.DateTimeField(null=True, blank=True)
    photo = models.ImageField(upload_to='fundraisers/', null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    shareable_link = models.CharField(max_length=200, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.shareable_link:
            self.shareable_link = f"shujaafund.ke/{slugify(self.title)}-{str(self.id)[:8]}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

class Donation(models.Model):
    fundraiser = models.ForeignKey(Fundraiser, on_delete=models.CASCADE, related_name='donations')
    donor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    is_anonymous = models.BooleanField(default=False)
    in_memory_of = models.CharField(max_length=100, null=True, blank=True)
    message = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.amount} to {self.fundraiser.title}"

class FundBreakdown(models.Model):
    fundraiser = models.ForeignKey(Fundraiser, on_delete=models.CASCADE, related_name='breakdowns')
    item = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f"{self.item} for {self.fundraiser.title}"

class Disbursement(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('PROCESSING', 'Processing'),
        ('COMPLETED', 'Completed'),
    ]

    fundraiser = models.ForeignKey(Fundraiser, on_delete=models.CASCADE, related_name='disbursements')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    recipient_mpesa = models.CharField(max_length=20, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.amount} for {self.fundraiser.title}"