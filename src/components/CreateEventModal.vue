<template>
  <div class="action-modal-wrapper" v-if="show">
    <div class="action-modal-overlay" @click="handleOverlayClick"></div>
    <div class="action-modal-card">
      <div class="action-modal-title">Create Event</div>
      <div class="action-modal-text">
        <input v-model="title" placeholder="Event title" />

        <div class="form-group">
          <label for="event-time">Select Event Time</label>
          <select id="event-time" v-model="eventTime">
            <option v-for="time in times" :key="time" :value="time">
              {{ time }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="notification-time">Notify me before (minutes)</label>
          <select id="notification-time" v-model="notificationTime">
            <option value="5">5 minutes</option>
            <option value="10">10 minutes</option>
            <option value="15">15 minutes</option>
            <option value="20">20 minutes</option>
            <option value="25">25 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
          </select>
        </div>
      </div>
      <div class="action-modal-actions">
        <button class="error-color" @click="cancel">Cancel</button>
        <button class="success-color" @click="create">Create</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data() {
    return {
      title: '',
      notificationTime: 0,
      eventTime: '',
      times: this.generateTimeOptions(),
    }
  },
  computed: {
    show: {
      get() {
        return this.modelValue
      },
      set(val) {
        this.$emit('update:modelValue', false)
      },
    },
  },
  emits: ['update:modelValue'],
  methods: {
    create() {
      const { title, eventTime, notificationTime } = this

      if (!title || !eventTime) {
        this.close()
        return
      }

      const [hours, minutes] = eventTime.split(':')
      this.$emit('create', { title, hours, minutes, notificationTime })
      this.close()
    },
    cancel() {
      this.$emit('cancel')
      this.close()
    },
    close() {
      this.title = ''
      this.notificationTime = 0
      this.eventTime = ''
      this.show = false
    },
    handleOverlayClick() {
      this.$emit('click:outside')
      this.close()
    },
    generateTimeOptions() {
      const times = []
      const start = 0
      const end = 24 * 60
      const step = 30
      for (let i = start; i < end; i += step) {
        const hours = String(Math.floor(i / 60)).padStart(2, '0')
        const minutes = String(i % 60).padStart(2, '0')
        times.push(`${hours}:${minutes}`)
      }
      return times
    },
  },
}
</script>

<style scoped>
.action-modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.action-modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: -1;
}

.action-modal-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  width: 300px;
  max-width: 90%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.3s ease-out;
}

.action-modal-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
}

.action-modal-text {
  margin-bottom: 20px;
  padding: 0 5px;
}

.action-modal-text input {
  width: 100%;
  padding: 8px 12px;
  box-sizing: border-box;
  font-size: 14px;
  outline: none;
  margin-bottom: 15px;
}

.action-modal-actions {
  display: flex;
  justify-content: space-between;
}

.action-modal-actions button {
  flex: 1;
  margin: 0 5px;
  padding: 10px;
  font-size: 16px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.action-modal-actions .error-color {
  background-color: #dc3545;
}

.action-modal-actions .success-color {
  background-color: #28a745;
}

.action-modal-actions button:hover {
  opacity: 0.9;
}

.form-group {
  margin-bottom: 15px;
}

.form-group select {
  width: 100%;
}

label {
  display: block;
  font-size: 1em;
  margin-bottom: 5px;
  color: #555;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
