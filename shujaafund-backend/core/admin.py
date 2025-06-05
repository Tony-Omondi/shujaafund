from django.contrib import admin
from parler.admin import TranslatableAdmin
from .models import Category, Feedback

@admin.register(Category)
class CategoryAdmin(TranslatableAdmin):
    fieldsets = (
        (None, {
            'fields': ('name', 'slug'),
        }),
    )

    def get_prepopulated_fields(self, request, obj=None):
        return {'slug': ('name',)}

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('user', 'message', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username', 'message')
