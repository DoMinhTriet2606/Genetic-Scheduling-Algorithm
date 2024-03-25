from django.urls import path
from . import views

from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    path("register/", views.register_user, name="register_user"),
    path("login/", views.login_user, name="login_user"),
    path("auth/", views.auth_user, name="auth_user"),
    path("change_password", views.change_password, name="change_password"),
    path("list/", views.list_users, name="list_users"),
    path("modify/<int:user_id>", views.modify_user, name="modify_user"),
    path("delete/<int:user_id>", views.delete_user, name="delete_user"),

    path("get_profile/", views.get_user_profile, name="get_profile"),
    path("create_profile/", views.create_user_profile, name="create_profile"),
    path("request_modify_permission/", views.request_modify_permission,
         name="request_modify_permission"),
    path("approve_modify_profile/", views.approve_modify_profile,
         name="approve_modify_profile"),
    path("staff_modify_profile/",
         views.staff_modify_profile, name="staff_modify_profile"),
    path("manager_modify_profile/<int:user_id>",
         views.modify_user_profile, name="manager_modify_profile"),

    path("notifications/", views.get_notifications, name="notifications"),
    path("tick_notifications/", views.tick_notification_read,
         name="tick_notifications"),


]
