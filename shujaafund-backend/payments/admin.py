from django.contrib import admin
from .models import Transaction

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('reference', 'donation', 'amount', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('reference', 'donation__fundraiser__title')
    readonly_fields = ('created_at', 'paystack_response')
    fieldsets = (
        (None, {'fields': ('donation', 'reference', 'amount')}),
        ('Status', {'fields': ('status',)}),
        ('Paystack', {'fields': ('paystack_response',)}),
        ('Timestamps', {'fields': ('created_at',)}),
    )