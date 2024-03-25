from django.test import TestCase
from django.utils import timezone
from django.test.utils import override_settings
from .models import UserAccount, UserProfile, UserNotification
from datetime import date


@override_settings(DATABASES={
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:'
    }
})
class UserAccountModelTest(TestCase):
    def setUp(self):
        self.user_account = UserAccount.objects.create(
            username='test_user',
            email='test@example.com',
            password='testpassword',
            account_type=UserAccount.STAFF,
            created_date=timezone.now()
        )

    def test_user_account_creation(self):
        """
        Test user account creation
        """
        self.assertEqual(self.user_account.username, 'test_user')
        self.assertEqual(self.user_account.email, 'test@example.com')
        self.assertEqual(self.user_account.password, 'testpassword')
        self.assertEqual(self.user_account.account_type, UserAccount.STAFF)

    def test_unique_username_constraint(self):
        """
        Test unique username
        """
        with self.assertRaises(Exception):
            UserAccount.objects.create(
                username='test_user',
                email='test2@example.com',
                password='testpassword2',
                account_type=UserAccount.STAFF,
                created_date=timezone.now()
            )

    def test_unique_email_constraint(self):
        """
        Test unique email
        """
        with self.assertRaises(Exception):
            UserAccount.objects.create(
                username='test_user2',
                email='test@example.com',
                password='testpassword2',
                account_type=UserAccount.STAFF,
                created_date=timezone.now()
            )

    def test_default_account_type(self):
        """
        Test default account type is Staff
        """
        user_account = UserAccount.objects.create(
            username='test_user3',
            email='test3@example.com',
            password='testpassword3',
            created_date=timezone.now()
        )
        self.assertEqual(user_account.account_type, UserAccount.STAFF)


@override_settings(DATABASES={
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:'
    }
})
class UserProfileModelTest(TestCase):
    def setUp(self):
        self.user_account = UserAccount.objects.create(
            username='test_user',
            email='test@example.com',
            password='testpassword'
        )

        UserProfile.objects.create(
            user=self.user_account,
            firstName='John',
            lastName='Doe',
            address='123 Main St',
            phone='1234567890',
            gender='Male',
            birth=date(1990, 1, 1),
            work_start_date=date(2020, 1, 1)
        )

    def test_user_profile_creation(self):
        """
        Test user profile creation
        """
        user_profile = UserProfile.objects.get(user=self.user_account)
        self.assertEqual(user_profile.firstName, 'John')
        self.assertEqual(user_profile.lastName, 'Doe')
        self.assertEqual(user_profile.address, '123 Main St')
        self.assertEqual(user_profile.phone, '1234567890')
        self.assertEqual(user_profile.gender, 'Male')
        self.assertEqual(user_profile.birth, date(1990, 1, 1))
        self.assertEqual(user_profile.work_start_date, date(2020, 1, 1))

    def test_str_representation(self):
        """
        Test first_name and last_name
        """
        user_profile = UserProfile.objects.get(id=1)
        self.assertEqual(str(user_profile), 'John Doe')


# @override_settings(DATABASES={
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': ':memory:'
#     }
# })
# class UserNotificationTestCase(TestCase):
#     def setUp(self):
#         self.sender_user = UserAccount.objects.create(
#             username='sender_user', email='sender@example.com', password='testpassword')
#         self.receiver_user = UserAccount.objects.create(
#             username='receiver_user', email='receiver@example.com', password='testpassword')
#         self.now = timezone.now()

#     def test_user_notification_creation(self):
#         """
#         Test create a new user notification
#         """
#         notification = UserNotification.objects.create(
#             sender=self.sender_user,
#             receiver=self.receiver_user,
#             message="Test message",
#             is_read=False
#         )
#         self.assertIsInstance(notification, UserNotification)
#         self.assertEqual(notification.sender, self.sender_user)
#         self.assertEqual(notification.receiver, self.receiver_user)
#         self.assertEqual(notification.message, "Test message")
#         self.assertFalse(notification.is_read)
#         self.assertIsNotNone(notification.created_at)

#     def test_notification_default_is_read(self):
#         """
#         Test default is_read is False
#         """
#         notification = UserNotification.objects.create(
#             sender=self.sender_user,
#             receiver=self.receiver_user,
#             message="Test message"
#         )
#         self.assertFalse(notification.is_read)

#     def test_notification_created_at_auto_now_add(self):
#         """
#         Test created_at after now
#         """
#         now = timezone.now()
#         notification = UserNotification.objects.create(
#             sender=self.sender_user,
#             receiver=self.receiver_user,
#             message="Test message"
#         )
#         self.assertGreaterEqual(notification.created_at, self.now)

#     def test_notification_relationships(self):
#         """
#         Test relationship between notification and user
#         """
#         sent_notification = UserNotification.objects.create(
#             sender=self.sender_user,
#             receiver=self.receiver_user,
#             message="Test message from sender"
#         )
#         received_notification = UserNotification.objects.create(
#             sender=self.sender_user,
#             receiver=self.receiver_user,
#             message="Test message to receiver"
#         )

#         self.assertIn(sent_notification,
#                       self.sender_user.sent_notifications.all())
#         self.assertIn(received_notification,
#                       self.receiver_user.received_notifications.all())
