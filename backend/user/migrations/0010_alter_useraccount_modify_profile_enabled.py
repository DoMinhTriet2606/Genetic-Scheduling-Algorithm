# Generated by Django 5.0.1 on 2024-03-25 07:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0009_rename_firstname_userprofile_firstname_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='useraccount',
            name='modify_profile_enabled',
            field=models.BooleanField(default=True),
        ),
    ]
