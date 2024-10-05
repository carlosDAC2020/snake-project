from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login, name='login'),
    path('profile/', views.profile, name='profile'),
    path('register/',views.register, name='register'),
    path('update-profile/',views.update_profile, name='ipdateUser'),
    path('delete-user/',views.delete_user, name='deleteUser'),
    path('games/',views.list_all_games, name='getGames'),
    path('save-games/',views.save_game, name='saveGames'),
    path('my-games/',views.list_user_games, name='myGames'),
]