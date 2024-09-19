<template>
  <div class="demo-app">
    <div class="demo-app-sidebar">
      <div class="demo-app-sidebar-section">
        <h2>All Events ({{ currentEvents.length }})</h2>
        <ul>
          <li v-for="event in currentEvents" :key="event.id">
            <b>{{ event.startStr }}</b>
            <i>{{ event.title }}</i>
          </li>
        </ul>
      </div>
    </div>
    <div class="demo-app-main">
      <FullCalendar
        ref="fullCalendar"
        class="demo-app-calendar"
        :options="calendarOptions"
      >
        <template v-slot:eventContent="arg">
          <b>{{ arg.timeText }}</b>
          <i>{{ arg.event.title }}</i>
        </template>
      </FullCalendar>
    </div>

    <CreateEventModal v-model="showCreateModal" @create="createDateEvent" />

    <ActionModal
      v-model="showActionModal"
      @edit="handleEdit"
      @delete="handleDelete"
      @click:outside="clearActiveClickInfo"
    />
  </div>
</template>


<script>
import { defineComponent } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { loadEvents, saveEvents, createEventId } from './event-utils';
import ActionModal from './components/ActionModal.vue';
import CreateEventModal from './components/CreateEventModal.vue';

export default defineComponent({
  components: {
    FullCalendar,
    ActionModal,
    CreateEventModal,
  },
  data() {
    return {
      calendarOptions: {
        plugins: [
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
        ],
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        },
        initialView: 'dayGridMonth',
        events: loadEvents(), 
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        select: this.handleDateSelect,
        eventClick: this.handleEventClick,
        eventsSet: this.handleEvents,
        eventAdd: this.handleEventAdd,
        eventChange: this.handleEventChange,
        eventRemove: this.handleEventRemove,
      },
      currentEvents: [],
      showCreateModal: false,
      showActionModal: false,
      activeClickInfo: null,
      selectInfo: null,
    }
  },
  mounted() {
    this.onCalendarLoad();
  },
  methods: {
    handleWeekendsToggle() {
      this.calendarOptions.weekends = !this.calendarOptions.weekends; 
    },
    handleDateSelect(selectInfo) {
      this.selectInfo = selectInfo;
      this.showCreateModal = true;
    },
    createDateEvent(data) {
      const calendarApi = this.$refs.fullCalendar.getApi();
      calendarApi.unselect(); // clear date selection
      const { title, hours, minutes, notificationTime } = data;
      const startDate = new Date(this.selectInfo.startStr);
      startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      if (title) {
        calendarApi.addEvent({
          id: createEventId(),
          title,
          start: this.formatDateLocal(startDate),
          extendedProps: {
            notificationTime,
          },
        });
      }
    },
    handleEventClick(clickInfo) {
      this.showActionModal = true;
      this.activeClickInfo = clickInfo;
    },
    handleEventAdd(event) {
      this.createNotificationTimerForEvent(event.event);
      this.saveEvents();
    },
    handleEventChange(event) {
      this.saveEvents();
    },
    handleEventRemove(event) {
      this.saveEvents();
    },
    handleEdit(newTitle) {
      if (newTitle) this.activeClickInfo.event.setProp('title', newTitle);
      this.clearActiveClickInfo();
    },
    handleDelete() {
      this.activeClickInfo.event.remove();
      this.clearActiveClickInfo();
      this.saveEvents();
    },
    clearActiveClickInfo() {
      this.activeClickInfo = null;
    },
    handleEvents(events) {
      this.currentEvents = events;
    },
    createNotificationTimerForEvent(event) {
      const { extendedProps, start } = event;
      if (!extendedProps || !extendedProps.notificationTime) return;

      const startTime = new Date(start);
      const now = Date.now();
      const notificationTime = extendedProps.notificationTime * 60000;

      const timeUntilEvent = startTime - now;
      const timeBeforeNotification = timeUntilEvent - notificationTime;
      if (timeUntilEvent > notificationTime) {
        setTimeout(() => {
          this.sendNotification(event, extendedProps.notificationTime);
        }, timeBeforeNotification);
      }
    },
    onCalendarLoad() {
      const calendarApi = this.$refs.fullCalendar.getApi();
      const events = calendarApi.getEvents();
      events.forEach((event) => {
        this.createNotificationTimerForEvent(event);
      });
    },
    sendNotification(event, minutes) {
      alert(`Event notification in ${minutes} minutes, event name: ${event.title}`);
    },
    formatDateLocal(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    },
    saveEvents() {
      const calendarApi = this.$refs.fullCalendar.getApi();
      const events = calendarApi.getEvents().map(event => ({
        id: event.id,
        title: event.title,
        start: event.startStr,
        extendedProps: event.extendedProps,
      }));
      saveEvents(events);
    },
  },
});
</script>



<style lang="css">
h2 {
  margin: 0;
  font-size: 16px;
}

ul {
  margin: 0;
  padding: 0 0 0 1.5em;
}

li {
  margin: 1.5em 0;
  padding: 0;
}

b {
  margin-right: 3px;
}

.demo-app {
  display: flex;
  min-height: 100%;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  font-size: 14px;
}

.demo-app-sidebar {
  width: 300px;
  line-height: 1.5;
  background: #eaf9ff;
  border-right: 1px solid #d3e2e8;
}

.demo-app-sidebar-section {
  padding: 2em;
}

.demo-app-main {
  flex-grow: 1;
  padding: 3em;
}

.fc {
  max-width: 1100px;
  margin: 0 auto;
}
</style>
