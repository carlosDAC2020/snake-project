# script para crear usuarios y partidas: create_users_and_games.py

from django.contrib.auth.models import User
from main.models import Game
import random

def create_users_and_games(num_users=10, num_games_per_user=5):
    difficulties = ['Easy', 'Half', 'Difficult']

    for i in range(num_users):
        # Crear un usuario
        username = f'user{i}'
        password = '123'  # Contraseña por defecto
        user = User.objects.create_user(username=username, password=password)
        print(f"Usuario creado: {username}")

        # Crear varias partidas para cada usuario
        for j in range(num_games_per_user):
            score = random.randint(0, 100)  # Puntaje aleatorio entre 0 y 100
            difficulty = random.choice(difficulties)  # Dificultad aleatoria
            game = Game.objects.create(user=user, score=score, difficulty=difficulty)
            print(f"  Partida creada para {username}: Score={score}, Difficulty={difficulty}")

if __name__ == "__main__":
    create_users_and_games()


