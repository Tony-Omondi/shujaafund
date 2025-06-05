from django.contrib import admin
from .models import Profile

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone_number', 'is_email_verified', 'is_organizer', 'is_admin', 'created_at')
    list_filter = ('is_email_verified', 'is_organizer', 'is_admin')
    search_fields = ('user__username', 'user__email', 'phone_number')
    readonly_fields = ('created_at',)
    fieldsets = (
        (None, {'fields': ('user', 'phone_number')}),
        ('Verification', {'fields': ('is_email_verified', 'email_token')}),
        ('Roles', {'fields': ('is_organizer', 'is_admin')}),
        ('Timestamps', {'fields': ('created_at',)}),
    )