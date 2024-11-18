from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Game
from django.utils import timezone

class UserSerilizer(serializers.ModelSerializer):

    is_new_player = serializers.SerializerMethodField()

    def get_is_new_player(self, obj):
        # Comparar fechas aware con timezone.now()
        return (timezone.now() - obj.date_joined).days < 30

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name', 'is_new_player']


class GameSerializer(serializers.ModelSerializer):
    # Campo personalizado para formatear la fecha
    played_at = serializers.SerializerMethodField()

    class Meta:
        model = Game
        fields = ['id', 'user', 'score','time', 'difficulty', 'played_at']
        read_only_fields = ['played_at']

    user = serializers.StringRelatedField()

    def get_played_at(self, obj):
        # Devolver solo la fecha en formato YYYY-MM-DD
        return obj.played_at.strftime('%Y-%m-%d') if obj.played_at else None