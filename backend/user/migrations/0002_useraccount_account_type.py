# Generated by Django 5.0.1 on 2024-02-07 11:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='useraccount',
            name='account_type',
            field=models.CharField(default='Staff', max_length=20),
        ),
    ]
