from rest_framework import serializers
from .models import UserAccount, UserNotification
from .models import UserProfile


class UserAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccount
        fields = ['id', 'username', 'email',
                  'password', 'account_type', 'modify_profile_enabled', 'created_date']
        extra_kwargs = {'password': {'write_only': True}}


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'user_id', 'firstName', 'lastName', 'address',
                  'phone', 'gender', 'birth', 'work_start_date']


class UserNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserNotification
        fields = ['id', 'sender', 'receiver',
                  'message', 'is_read', 'created_at']
