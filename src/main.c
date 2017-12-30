#include <stdio.h>
#include <time.h>

#include "mgos.h"

enum mgos_app_init_result mgos_app_init(void) {
  return MGOS_APP_INIT_SUCCESS;
}

int buildEpoch(int year, int month, int day, int hour, int minute, int second) {
  struct tm t;

  t.tm_year = year - 1900;
  t.tm_mon = month - 1;
  t.tm_mday = day;
  t.tm_hour = hour;
  t.tm_min = minute;
  t.tm_sec = second;
  t.tm_isdst = -1;

  return mktime(&t);
}
