from django.db import models
from django.contrib.auth.models import User

class Game(models.Model):
    DIFFICULTY_CHOICES = [
        ('Easy', 'Easy'),
        ('Half', 'Half'),
        ('Difficult', 'Difficult'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    score = models.IntegerField()
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES)
    played_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Game by {self.user.username} with score {self.score}"
