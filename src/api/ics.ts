interface RecurrenceRule {
  freq: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY",
  until?: string,
  interval?: string,
  count?: string,
  byday?: string[],
}

export function createEvent(uid: string, begin: string | number | Date, stop: string | number | Date, subject?: string, description?: string, location?: string, rrule?: string | RecurrenceRule) {
  const start_date = new Date(begin);
  const end_date = new Date(stop);
  const now_date = new Date();

  const start_year = ("0000" + (start_date.getFullYear().toString())).slice(-4);
  const start_month = ("00" + ((start_date.getMonth() + 1).toString())).slice(-2);
  const start_day = ("00" + ((start_date.getDate()).toString())).slice(-2);
  const start_hours = ("00" + (start_date.getHours().toString())).slice(-2);
  const start_minutes = ("00" + (start_date.getMinutes().toString())).slice(-2);
  const start_seconds = ("00" + (start_date.getSeconds().toString())).slice(-2);

  const end_year = ("0000" + (end_date.getFullYear().toString())).slice(-4);
  const end_month = ("00" + ((end_date.getMonth() + 1).toString())).slice(-2);
  const end_day = ("00" + ((end_date.getDate()).toString())).slice(-2);
  const end_hours = ("00" + (end_date.getHours().toString())).slice(-2);
  const end_minutes = ("00" + (end_date.getMinutes().toString())).slice(-2);
  const end_seconds = ("00" + (end_date.getSeconds().toString())).slice(-2);

  const now_year = ("0000" + (now_date.getFullYear().toString())).slice(-4);
  const now_month = ("00" + ((now_date.getMonth() + 1).toString())).slice(-2);
  const now_day = ("00" + ((now_date.getDate()).toString())).slice(-2);
  const now_hours = ("00" + (now_date.getHours().toString())).slice(-2);
  const now_minutes = ("00" + (now_date.getMinutes().toString())).slice(-2);
  const now_seconds = ("00" + (now_date.getSeconds().toString())).slice(-2);

  // Since some calendars don't add 0 second events, we need to remove time if there is none...
  let start_time = '';
  let end_time = '';
  if (start_hours + start_minutes + start_seconds + end_hours + end_minutes + end_seconds) {
    start_time = 'T' + start_hours + start_minutes + start_seconds;
    end_time = 'T' + end_hours + end_minutes + end_seconds;
  }
  const now_time = 'T' + now_hours + now_minutes + now_seconds;

  const start = start_year + start_month + start_day + start_time;
  const end = end_year + end_month + end_day + end_time;
  const now = now_year + now_month + now_day + now_time;

  // recurrence rrule vars
  let rruleString = '';
  if (typeof rrule === 'string') {
    rruleString = rrule
  } else if (rrule) {
    rruleString = 'RRULE:FREQ=' + rrule.freq;

    if (rrule.until) {
      var uDate = new Date(Date.parse(rrule.until)).toISOString();
      rruleString += ';UNTIL=' + uDate.substring(0, uDate.length - 13).replace(/[-]/g, '') + '000000Z';
    }

    if (rrule.interval) {
      rruleString += ';INTERVAL=' + rrule.interval;
    }

    if (rrule.count) {
      rruleString += ';COUNT=' + rrule.count;
    }

    if (rrule.byday && rrule.byday.length > 0) {
      rruleString += ';BYDAY=' + rrule.byday.join(',');
    }
  }
  let calendarEvent = [
    'BEGIN:VEVENT',
    'UID:' + uid,
    'CLASS:PUBLIC',
    rruleString,
    description && 'DESCRIPTION:' + description,
    'DTSTAMP;VALUE=DATE-TIME:' + now,
    'DTSTART;VALUE=DATE-TIME:' + start,
    'DTEND;VALUE=DATE-TIME:' + end,
    location && 'LOCATION:' + location,
    subject && 'SUMMARY:' + subject,
    'TRANSP:TRANSPARENT',
    'END:VEVENT'
  ].filter(<T>(n?: T): n is T => Boolean(n));
  return calendarEvent
}

const calendarStart = [
  'BEGIN:VCALENDAR',
  'PRODID:-//citadel.org//NONSGML Citadel calendar//EN',
  'VERSION:2.0',
  'BEGIN:VTIMEZONE',
  'TZID:Asia/Shanghai',
  'LAST-MODIFIED:20211207T194144Z',
  'X-LIC-LOCATION:Asia/Shanghai',
  'BEGIN:STANDARD',
  'TZNAME:CST',
  'TZOFFSETFROM:+0800',
  'TZOFFSETTO:+0800',
  'DTSTART:19700101T000000',
  'END:STANDARD',
  'END:VTIMEZONE',
]

const calendarEnd = ['END:VCALENDAR']

export function build(events: string[][], separator = '\r\n') {
  events.unshift(calendarStart)
  events.push(calendarEnd)
  return events.flat().join(separator)
}
