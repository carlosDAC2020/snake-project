
from django.shortcuts import render
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from .serializers import UserSerilizer, GameSerializer

from rest_framework import status
from rest_framework.authtoken.models import Token
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
#modelos 
from django.contrib.auth.models import User
from .models import Game

import random


@api_view(['POST'])
def login(request):
    user = get_object_or_404(User, username=request.data['username'])
    if not user.check_password(request.data['password']):
        return Response({"error":"invalid password or username"}, status=status.HTTP_400_BAD_REQUEST)
    
    token, created = Token.objects.get_or_create(user=user)
    serializer = UserSerilizer(instance=user)
    print("logeado el ususrio",request.data['username'])
    return Response({"token":token.key, "user":serializer.data}, status=status.HTTP_200_OK)

@api_view(['POST'])
def register(request):
    print("imprecion de los datos ")
    print(request.data)
    serializer = UserSerilizer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        user = User.objects.get(username=serializer.data['username'])
        user.set_password(serializer.data['password'])
        user.save()
        token = Token.objects.create(user=user)
        return Response({'token':token.key, 'user':serializer.data}, status=status.HTTP_201_CREATED)
        
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def profile(request):
    # Serializa la información del usuario autenticado
    serializer = UserSerilizer(request.user)
    return Response({"user": serializer.data}, status=status.HTTP_200_OK)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def update_profile(request):
    # Obtén el usuario autenticado
    user = request.user

    # Obtén los datos enviados en la solicitud
    username = request.data.get('username', None)
    password = request.data.get('password', None)

    # Verifica si se está intentando cambiar el nombre de usuario
    if username and username != user.username:
        # Validación para asegurarse de que el nuevo nombre de usuario no esté en uso
        if User.objects.filter(username=username).exists():
            return Response({"error": "El nombre de usuario ya está en uso."}, status=status.HTTP_400_BAD_REQUEST)

        # Actualiza el nombre de usuario
        user.username = username

    # Si se proporciona una nueva contraseña, actualízala
    if password:
        user.set_password(password)  # Asegúrate de almacenar la contraseña como hash

    # Guarda los cambios en el usuario
    user.save()

    # Serializa la información del usuario actualizado
    user_data = {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name
    }

    return Response({"user": user_data}, status=status.HTTP_200_OK)

@api_view(['DELETE'])  # Cambiado a DELETE ya que es más adecuado para eliminaciones
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def delete_user(request):
    user = request.user  # Obtiene el usuario autenticado
    user.delete()  # Elimina el usuario
    return Response(status=status.HTTP_204_NO_CONTENT)  # Responde con un 204 No Content

@api_view(['GET'])
def list_all_games(request):

    best_games = []
    # ordenamos las mejores puntuacione spor cada tipo de juego 
    users = User.objects.all()

    dificult = {
        'Easy':[],
        'Half':[],
        'Difficult':[]
    }

    for user in users:
        print(user)
        for dif in dificult.keys():
            games = Game.objects.filter(user=user,difficulty=dif).order_by('-score')
            if len(games) > 0:
                dificult[dif].append(games[0])
                print(games[0])
    
    for dif in dificult.keys():
        # ordenamos de mayor a menor puntaje de juegos 
        dificult[dif].sort(key=lambda x: x.score, reverse=True)
        best_games.extend(dificult[dif])

    serializer = GameSerializer(best_games, many=True)  # Serializa todos los juegos
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])  
@permission_classes([IsAuthenticated])  
def save_game(request):
    # Se toma el usuario autenticado automáticamente
    user = request.user

    print(request.data)
    
    # Crear el juego con el usuario autenticado
    new_game = Game.objects.create(
        user=user,
        score=request.data['score'],
        difficulty=request.data['difficulty'],
        time=request.data['time']
    )
    new_game.save()
    print(" juego creado ")
    # Pasar el objeto del modelo al serializador
    serializer_new_game = GameSerializer(new_game)

    # Devolver los datos serializados
    return Response({"game": serializer_new_game.data}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])  
@permission_classes([IsAuthenticated])  
def list_user_games(request):
    # Obtiene el usuario autenticado
    user = request.user
    # Filtra los juegos del usuario autenticado y los ordena por puntaje (score) de mayor a menor
    games = Game.objects.filter(user=user).order_by('-score')  # Agrega '-' para orden descendente
    serializer = GameSerializer(games, many=True)  # Serializa los juegos filtrados
    return Response(serializer.data, status=status.HTTP_200_OK)