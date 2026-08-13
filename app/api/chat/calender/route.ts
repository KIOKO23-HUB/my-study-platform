import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { providerToken, events, calendarEmail } = await req.json();

    if (!providerToken) {
      return NextResponse.json(
        { error: 'Google Calendar Access Token missing. Please reconnect Google.' },
        { status: 401 }
      );
    }

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const syncedEvents: string[] = [];

    for (const session of events) {
      // Calculate target date for the upcoming day
      const targetDayIndex = daysOfWeek.indexOf(session.day);
      const now = new Date();
      const currentDayIndex = now.getDay();
      
      let daysAhead = targetDayIndex - currentDayIndex;
      if (daysAhead < 0) daysAhead += 7;

      const startDate = new Date();
      startDate.setDate(now.getDate() + daysAhead);

      // Parse time string e.g. "08:00 - 10:00"
      const [startTime, endTime] = (session.time || '08:00 - 10:00').split(' - ');
      const [startHour, startMin] = (startTime || '08:00').split(':').map(Number);
      const [endHour, endMin] = (endTime || '10:00').split(':').map(Number);

      startDate.setHours(startHour, startMin, 0, 0);
      
      const endDate = new Date(startDate);
      endDate.setHours(endHour, endMin, 0, 0);

      // Google Calendar API Event Payload
      const calendarEvent = {
        summary: session.unit || session.title || 'Study Session',
        location: session.room || 'Campus Room',
        description: `Automated study reminder synced via StudyPlatform for ${calendarEmail}`,
        start: {
          dateTime: startDate.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: endDate.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        recurrence: [
          'RRULE:FREQ=WEEKLY;COUNT=15' // Recurs weekly for 15 weeks
        ],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 15 }, // 15-minute push alert on phone
            { method: 'email', minutes: 60 }   // 1-hour email notification
          ],
        },
      };

      // Direct HTTP POST to Google Calendar API
      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${providerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(calendarEvent),
      });

      if (response.ok) {
        const data = await response.json();
        syncedEvents.push(data.summary);
      }
    }

    return NextResponse.json({ 
      success: true, 
      count: syncedEvents.length,
      synced: syncedEvents 
    });

  } catch (error: any) {
    console.error("Google Calendar Sync Error:", error);
    return NextResponse.json({ error: error.message || 'Failed to sync calendar' }, { status: 500 });
  }
}