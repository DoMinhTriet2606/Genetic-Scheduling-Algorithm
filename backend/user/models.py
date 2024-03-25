from django.utils import timezone
from django.db import models

# Create your models here.


class UserAccount(models.Model):
    MANAGER = 'Manager'
    STAFF = 'Staff'
    ACCOUNT_TYPE_CHOICES = [
        (MANAGER, 'Manager'),
        (STAFF, 'Staff'),
    ]

    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    account_type = models.CharField(
        max_length=20, choices=ACCOUNT_TYPE_CHOICES, default=STAFF)
    created_date = models.DateTimeField(default=timezone.now)

    modify_profile_enabled = models.BooleanField(default=True)

    def __str__(self):
        return self.username


class UserProfile(models.Model):
    user = models.ForeignKey(
        UserAccount, on_delete=models.CASCADE, related_name="profile")
    firstName = models.CharField(max_length=50)
    lastName = models.CharField(max_length=50)
    address = models.CharField(max_length=255)
    phone = models.CharField(max_length=15)
    gender = models.CharField(max_length=10)
    birth = models.DateField()
    work_start_date = models.DateField()

    def __str__(self):
        return f"{self.firstName} {self.lastName}"


class UserNotification(models.Model):
    sender = models.ForeignKey(
        UserAccount, on_delete=models.CASCADE, related_name="sent_notifications")
    receiver = models.ForeignKey(
        UserAccount, on_delete=models.CASCADE, related_name="received_notifications")
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
