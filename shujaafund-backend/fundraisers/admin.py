from django.contrib import admin
from .models import Fundraiser, Donation, FundBreakdown, Disbursement

@admin.register(Fundraiser)
class FundraiserAdmin(admin.ModelAdmin):
    list_display = ('title', 'organizer', 'category', 'goal_amount', 'amount_raised', 'is_verified', 'created_at')
    list_filter = ('is_verified', 'category')
    search_fields = ('title', 'organizer__username', 'story')
    readonly_fields = ('created_at', 'shareable_link')
    fieldsets = (
        (None, {'fields': ('organizer', 'title', 'story', 'category')}),
        ('Financials', {'fields': ('goal_amount', 'amount_raised')}),
        ('Details', {'fields': ('urgency_deadline', 'photo', 'is_verified', 'shareable_link')}),
        ('Timestamps', {'fields': ('created_at',)}),
    )
    prepopulated_fields = {'shareable_link': ('title',)}

@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    list_display = ('fundraiser', 'donor', 'amount', 'is_anonymous', 'created_at')
    list_filter = ('is_anonymous',)
    search_fields = ('fundraiser__title', 'donor__username', 'in_memory_of')
    readonly_fields = ('created_at',)
    fieldsets = (
        (None, {'fields': ('fundraiser', 'donor', 'amount')}),
        ('Details', {'fields': ('is_anonymous', 'in_memory_of', 'message')}),
        ('Timestamps', {'fields': ('created_at',)}),
    )

@admin.register(FundBreakdown)
class FundBreakdownAdmin(admin.ModelAdmin):
    list_display = ('fundraiser', 'item', 'amount')
    search_fields = ('fundraiser__title', 'item')
    list_filter = ('fundraiser',)

@admin.register(Disbursement)
class DisbursementAdmin(admin.ModelAdmin):
    list_display = ('fundraiser', 'amount', 'recipient_mpesa', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('fundraiser__title', 'recipient_mpesa')
    readonly_fields = ('created_at',)
    fieldsets = (
        (None, {'fields': ('fundraiser', 'amount', 'recipient_mpesa')}),
        ('Status', {'fields': ('status',)}),
        ('Timestamps', {'fields': ('created_at',)}),
    )