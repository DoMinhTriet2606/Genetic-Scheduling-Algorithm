from django.db import models

# Create your models here.
from django.db import models
from user.models import UserAccount


class TimeTable(models.Model):
    tableID = models.AutoField(primary_key=True)
    week = models.IntegerField()
    dateStart = models.DateField()
    dateEnd = models.DateField()

    def __str__(self):
        return f"TimeTable {self.tableID} for {self.week}"


class UserShift(models.Model):
    shiftID = models.AutoField(primary_key=True)
    timeTable = models.ForeignKey(TimeTable, on_delete=models.CASCADE)
    userID = models.ForeignKey(
        UserAccount, on_delete=models.CASCADE, related_name="shift")
    shiftDate = models.DateField()
    shiftName = models.IntegerField()
    timeStart = models.CharField(max_length=5)  # Assuming format: "HH:MM"
    duration = models.IntegerField()  # Duration in hours
    timeEnd = models.CharField(max_length=5)  # Assuming format: "HH:MM"

    def save(self, *args, **kwargs):
        if self.timeStart and self.duration:
            # Calculate end time
            start_hour, start_minute = map(int, self.timeStart.split(':'))
            end_hour = start_hour + self.duration
            end_minute = start_minute

            # Format end time
            self.timeEnd = f"{end_hour:02d}:{end_minute:02d}"

        super().save(*args, **kwargs)

    def __str__(self):
        return f"Shift {self.shiftID} for User {self.userID.username}"
