from rest_framework import permissions


class HasERPermission(permissions.BasePermission):
    def has_permission(self, request, view):

        
        # 1. Superusers (Django Admin users) always pass
        if request.user.is_superuser:
            return True

        # 2. Get the required permission from the view
        required_perm = getattr(view, 'required_permission', None)
        if not required_perm:
            return True  # If no permission is set, allow access (or change to False for strictness)

        # 3. Check if the user's roles actually contain this permission
        # This calls the method you wrote in UserExtension
        user_perms = request.user.user_extension.get_custom_permissions()


        return required_perm in user_perms