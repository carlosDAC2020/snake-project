# Generated by Django 5.0.4 on 2024-11-12 21:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_game_delete_task'),
    ]

    operations = [
        migrations.AddField(
            model_name='game',
            name='time',
            field=models.IntegerField(default=10),
        ),
    ]
