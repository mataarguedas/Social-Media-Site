from django.contrib.auth.models import User
from rest_framework import serializers
from django.core.exceptions import ValidationError
from django.conf import settings

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_email(self, value):
        domain = value.split('@')[-1]
        if domain not in settings.ALLOWED_EMAIL_DOMAINS:
            raise ValidationError(f"Tenés que registrate con uno correo de la U. Podés escoger: {', '.join(settings.ALLOWED_EMAIL_DOMAINS)}")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user