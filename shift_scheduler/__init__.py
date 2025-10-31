"""
Shift Schedule Tool - A flexible employee shift scheduling system.
"""

__version__ = "0.1.0"

from .scheduler import ShiftScheduler
from .employee import Employee
from .shift import Shift
from .schedule import Schedule

__all__ = ["ShiftScheduler", "Employee", "Shift", "Schedule"]
