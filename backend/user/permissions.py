import jwt
from django.conf import settings
from rest_framework.response import Response
from rest_framework import status
from user.models import UserAccount


class AccessTokenRequired:
    def __init__(self, func):
        self.func = func
        self.__name__ = func.__name__

    def __call__(self, request, *args, **kwargs):
        authHeader = request.headers.get('Authorization')
        if authHeader is None:
            print("authHeader is None")
            return Response({'error': 'Invalid auth header'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            access_token = authHeader.split(" ")[1]
            # print("Header: ", authHeader)
        if access_token is None:
            return Response({'error': 'Access token is required'}, status=status.HTTP_401_UNAUTHORIZED)

        user = self.authenticate_access_token(access_token)
        if user is None:
            return Response({'error': 'Invalid access token'}, status=status.HTTP_401_UNAUTHORIZED)

        return self.func(request, user, *args, **kwargs)

    def authenticate_access_token(self, access_token):
        try:
            decoded_token = jwt.decode(
                access_token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = decoded_token['user_id']
            user = UserAccount.objects.get(id=user_id)
            return user
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, UserAccount.DoesNotExist, KeyError):
            return None


class ManagerOnly:
    def __init__(self, func):
        self.func = func
        self.__name__ = func.__name__

    def __call__(self, request, user, *args, **kwargs):
        if not self.has_permission(user):
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

        return self.func(request, user, *args, **kwargs)

    def has_permission(self, user):
        return user.account_type == "Manager"
