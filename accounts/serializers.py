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
        # First, check if the email domain is allowed
        domain = value.split('@')[-1]
        if domain not in settings.ALLOWED_EMAIL_DOMAINS:
            raise ValidationError(f"Tenés que registrate con uno correo de la U. Podés escoger: {', '.join(settings.ALLOWED_EMAIL_DOMAINS)}")
        
        # Then, check if the email is already in use
        if User.objects.filter(email=value).exists():
            raise ValidationError("Este correo electrónico ya está registrado.")
        
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user