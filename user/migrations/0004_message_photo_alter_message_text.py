# Generated by Django 4.1.4 on 2022-12-13 22:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0003_remove_message_user_room_message_room_message_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='photo',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='message',
            name='text',
            field=models.TextField(blank=True, null=True),
        ),
    ]
