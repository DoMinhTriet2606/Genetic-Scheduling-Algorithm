from django.test import TestCase
from django.test.utils import override_settings
from .models import TimeTable, UserShift
from user.models import UserAccount
from datetime import date


@override_settings(DATABASES={
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:'
    }
})
class TimeTableTestCase(TestCase):
    def setUp(self):
        # Tạo một bảng thời gian mới
        self.table = TimeTable.objects.create(
            week=1,
            dateStart=date(2024, 1, 1),
            dateEnd=date(2024, 1, 7)
        )

    def test_table_creation(self):
        # Kiểm tra xem bảng thời gian đã được tạo thành công hay không
        self.assertEqual(self.table.week, 1)
        self.assertEqual(self.table.dateStart, date(2024, 1, 1))
        self.assertEqual(self.table.dateEnd, date(2024, 1, 7))


@override_settings(DATABASES={
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:'
    }
})
class UserShiftTestCase(TestCase):
    def setUp(self):
        # Tạo một người dùng mới
        self.user = UserAccount.objects.create(
            username="test_user", email="test@example.com")

        # Tạo một bảng thời gian mới
        self.table = TimeTable.objects.create(
            week=1,
            dateStart=date(2024, 1, 1),
            dateEnd=date(2024, 1, 7)
        )

        # Tạo một ca làm việc mới cho người dùng
        self.shift = UserShift.objects.create(
            timeTable=self.table,
            userID=self.user,
            shiftDate=date(2024, 1, 2),
            shiftName=21,
            timeStart="08:00",
            duration=8
        )

    def test_shift_creation(self):
        # Kiểm tra xem ca làm việc đã được tạo thành công hay không
        self.assertEqual(self.shift.timeTable, self.table)
        self.assertEqual(self.shift.userID, self.user)
        self.assertEqual(self.shift.shiftDate, date(2024, 1, 2))
        self.assertEqual(self.shift.shiftName, 21)
        self.assertEqual(self.shift.timeStart, "08:00")
        self.assertEqual(self.shift.duration, 8)
        # Kiểm tra xem timeEnd đã được tính toán đúng không
        self.assertEqual(self.shift.timeEnd, "16:00")

    def test_shift_end_time(self):
        # Kiểm tra tính toán của thời gian kết thúc
        self.assertEqual(self.shift.timeEnd, "16:00")

    def test_related_name(self):
        # Kiểm tra related_name đã được thiết lập chính xác không
        shifts = self.user.shift.all()
        self.assertEqual(len(shifts), 1)
        self.assertEqual(shifts[0], self.shift)
