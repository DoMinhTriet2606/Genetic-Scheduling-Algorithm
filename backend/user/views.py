from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from user.models import UserAccount, UserNotification, UserProfile
from user.serializer import UserAccountSerializer, UserNotificationSerializer, UserProfileSerializer
from user.permissions import AccessTokenRequired, ManagerOnly

# Create your views here.

# UserAccount


@api_view(['POST'])
def register_user(request):
    if request.method == 'POST':
        serializer = UserAccountSerializer(data=request.data)
        if serializer.is_valid():
            password = make_password(serializer.validated_data['password'])
            serializer.validated_data['password'] = password
            serializer.save()

            user = serializer.instance
            refresh = RefreshToken.for_user(user)

            return Response({
                "success": True,
                "user": serializer.data,
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            }, status=status.HTTP_201_CREATED)
        return Response({"success": False, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login_user(request):
    if request.method == 'POST':
        email = request.data.get('email')
        password = request.data.get('password')

        user = UserAccount.objects.filter(email=email).first()

        if user and check_password(password, user.password):
            serializer = UserAccountSerializer(user)
            refresh = RefreshToken.for_user(user)
            return Response({
                'success': True,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': serializer.data
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'success': False,
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)


@api_view(["GET"])
@AccessTokenRequired
def auth_user(request, user):
    if user is not None:
        serializer = UserAccountSerializer(user)
        return Response({
            "success": True,
            "user": serializer.data,
            "message": "User got authenticated"
        }, status=status.HTTP_200_OK)

    return Response({
        "success": False,
        "message": "User not authenticated"
    }, status=status.HTTP_401_UNAUTHORIZED)


@api_view(["PUT"])
@AccessTokenRequired
def change_password(request, user):
    if request.method == "PUT":
        oldPassword = request.data.get("oldPassword")
        newPassword = request.data.get("newPassword")
        confirmNewPassword = request.data.get("confirmNewPassword")
        user_account = UserAccount.objects.get(id=user.id)

        if not check_password(oldPassword, user.password):
            return Response({
                "success": False,
                "message": "Old password is invalid"
            })
        elif newPassword != confirmNewPassword:
            return Response({
                "success": False,
                "message": "Password confirmation is incorrect"
            })

        password = make_password(newPassword)
        user_account.password = password
        user_account.save()
        return Response({
            "success": True,
            "message": "Password was successfully changed!"
        })

# User Profile


@api_view(['GET'])
@AccessTokenRequired
def get_user_profile(request, user):
    try:
        profile = UserProfile.objects.get(user=user.id)
        serializer = UserProfileSerializer(profile)
        return Response({
            "success": True,
            "profile": serializer.data
        })
    except UserProfile.DoesNotExist:
        return Response({
            "success": False,
            "message": "User profile does not exist for this user account"
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@AccessTokenRequired
def create_user_profile(request, user):
    existing_profile = UserProfile.objects.filter(user=user).exists()
    if existing_profile:
        return Response({
            "success": False,
            "message": "User profile already exists for this user account"
        }, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'POST':
        serializer = UserProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.validated_data['user_id'] = user.id
            serializer.save()

            user_account = UserAccount.objects.get(id=user.id)
            if user_account.account_type == "Staff":
                user_account.modify_profile_enabled = False
                user_account.save()

            manager = UserAccount.objects.get(account_type=UserAccount.MANAGER)
            notification_data = {
                "sender": user.id,
                "receiver": manager.id,
                "message": f"User {user.username} has created a new profile",
            }
            notification_serializer = UserNotificationSerializer(
                data=notification_data)
            if notification_serializer.is_valid():
                notification_serializer.save()
            else:
                print(notification_serializer.errors)

            return Response({
                "success": True,
                "message": "Created user profile successfully",
                "profile": serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            "success": False,
            "errors": serializer.errors,
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@AccessTokenRequired
def staff_modify_profile(request, user):

    if request.method == 'PUT':
        if not user.profile.exists():
            return Response({"success": False, "message": "User profile does not exist"}, status=status.HTTP_404_NOT_FOUND)

        selected_profile = user.profile.first()
        serializer = UserProfileSerializer(
            selected_profile,
            data=request.data,
            partial=True
        )
        if serializer.is_valid():
            serializer.save()

            user_account = UserAccount.objects.get(id=user.id)
            if user_account.account_type == "Staff":
                user_account.modify_profile_enabled = False
                user_account.save()

            sender_account = user_account
            manager = UserAccount.objects.get(account_type=UserAccount.MANAGER)
            UserNotification.objects.create(
                sender=sender_account,
                receiver=manager,
                message=f"Staff user {user.username} has modified their profile."
            )

            return Response({
                "success": True,
                "message": "Modified user profile successfully",
                "profile": serializer.data
            }, status=status.HTTP_200_OK)
        return Response({
            "success": False,
            "message": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@AccessTokenRequired
def request_modify_permission(request, user):

    sender_account = UserAccount.objects.get(id=user.id)
    manager = UserAccount.objects.get(account_type=UserAccount.MANAGER)
    UserNotification.objects.create(
        sender=sender_account,
        receiver=manager,
        message=f"Staff user {user.username} requests permission to modify profile."
    )
    return Response({"success": True, "message": "Request to modify profile sent to manager! <br>Please wait for the response"})


# Notifications
@api_view(['GET'])
@AccessTokenRequired
def get_notifications(request, user):
    user_notifications = UserNotification.objects.filter(receiver=user.id)
    if not user_notifications:
        return Response({
            "success": False,
            "message": "Notifications not found"
        }, status=status.HTTP_404_NOT_FOUND)

    serializer = UserNotificationSerializer(user_notifications, many=True)

    return Response({
        "success": True,
        "message": f"Got {len(serializer.data)} notifications",
        "notifications": serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['PUT'])
@AccessTokenRequired
def tick_notification_read(request, user):
    notification_id = request.data.get('notification_id')

    try:
        notification = UserNotification.objects.get(
            id=notification_id, receiver=user.id)
    except UserNotification.DoesNotExist:
        return Response({
            "success": False,
            "message": "Notification not found or does not belong to the user"
        }, status=status.HTTP_404_NOT_FOUND)

    notification.is_read = True
    notification.save()

    return Response({
        "success": True,
        "message": "Notification marked as read successfully"
    }, status=status.HTTP_200_OK)

# For Manager only


@api_view(['GET'])
@AccessTokenRequired
@ManagerOnly
def list_users(request, user):
    if request.method == 'GET':
        users = UserAccount.objects.all()
        serializer = UserAccountSerializer(users, many=True)
        return Response({
            "CurrentUser": UserAccountSerializer(user).data["username"],
            "List": serializer.data
        }, status=status.HTTP_200_OK)


@api_view(['PUT'])
@AccessTokenRequired
@ManagerOnly
def modify_user(request, user, user_id):
    if request.method == 'PUT':
        try:
            selected_account = UserAccount.objects.get(id=user_id)
        except UserAccount.DoesNotExist:
            return Response({"success": False, "message": "User account does not exist"})

        serializer = UserAccountSerializer(
            selected_account,
            data=request.data,
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "Modify user successfully",
                "user": serializer.data
            }, status=status.HTTP_200_OK)
        return Response({
            "success": False,
            "message": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@AccessTokenRequired
@ManagerOnly
def delete_user(request, user, user_id):
    if request.method == 'DELETE':
        try:
            selected_account = UserAccount.objects.get(id=user_id)
        except UserAccount.DoesNotExist:
            return Response({"success": False, "message": "User account does not exist"}, status=status.HTTP_404_NOT_FOUND)

        selected_account.delete()
        return Response({"success": True, "message": "User account deleted"}, status=status.HTTP_204_NO_CONTENT)


@api_view(['PUT'])
@AccessTokenRequired
@ManagerOnly
def modify_user_profile(request, user, user_id):
    if request.method == 'PUT':
        try:
            selected_account = UserAccount.objects.get(id=user_id)
        except UserAccount.DoesNotExist:
            return Response({"success": False, "message": "User account does not exist"})

        if not selected_account.profile.exists():
            return Response({"success": False, "message": "User profile does not exist"}, status=status.HTTP_404_NOT_FOUND)

        selected_profile = selected_account.profile.first()
        serializer = UserProfileSerializer(
            selected_profile,
            data=request.data,
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "Modified user profile successfully",
                "profile": serializer.data
            }, status=status.HTTP_200_OK)
        return Response({
            "success": False,
            "message": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@AccessTokenRequired
@ManagerOnly
def approve_modify_profile(request, user):
    staff_username = request.data.get('staff_username')
    try:
        staff_account = UserAccount.objects.get(
            username=staff_username, account_type=UserAccount.STAFF)
    except UserAccount.DoesNotExist:
        return Response({
            "success": False,
            "message": "Staff user does not exist"
        }, status=status.HTTP_404_NOT_FOUND)

    new_modify_profile_enabled = not staff_account.modify_profile_enabled
    staff_account.modify_profile_enabled = new_modify_profile_enabled
    staff_account.save()

    if new_modify_profile_enabled:
        message = f"Your profile modification functionality has been enabled by the manager."
    else:
        message = f"Your profile modification functionality has been disabled by the manager."

    UserNotification.objects.create(
        sender=user,
        receiver=staff_account,
        message=message
    )

    return Response({
        "success": True,
        "message": f"Modify profile enabled for user {staff_username} is now {new_modify_profile_enabled}"
    }, status=status.HTTP_200_OK)
