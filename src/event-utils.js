let eventGuid = 0;
const STORAGE_KEY = 'events';
let todayStr = new Date().toISOString().replace(/T.*$/, '');

export function loadEvents() {
  const events = localStorage.getItem(STORAGE_KEY);
  return events ? JSON.parse(events) : INITIAL_EVENTS;
}

export function saveEvents(events) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

export const INITIAL_EVENTS = [
  {
    id: createEventId(),
    title: 'All-day event',
    start: todayStr,
  },
  {
    id: createEventId(),
    title: 'Timed event',
    start: todayStr + 'T12:00:00',
  },
  {
    id: createEventId(),
    title: 'My event',
    start: todayStr + 'T18:28:00.00',
    notificationTime: '20',
  },
];

export function createEventId() {
  return String(eventGuid++);
}
