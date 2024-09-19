import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import App from '@/App.vue'
import FullCalendar from '@fullcalendar/vue3'
import CreateEventModal from '@/components/CreateEventModal.vue'
import ActionModal from '@/components/ActionModal.vue'

// Мокаем функции, импортируемые в App.vue
vi.mock('./event-utils', () => ({
  loadEvents: vi.fn(() => []),
  saveEvents: vi.fn(),
  createEventId: vi.fn(() => 'test-id'),
}))

// Мокаем методы FullCalendar
const mockFullCalendarApi = {
  getEvents: vi.fn(() => []),
  addEvent: vi.fn(),
  unselect: vi.fn(),
}

const MockFullCalendar = {
  props: ['options'],
  emits: ['eventsSet', 'eventClick', 'eventAdd', 'eventChange', 'eventRemove'],
  template: '<div></div>',
  methods: {
    getApi: vi.fn(() => mockFullCalendarApi),
  },
}

describe('App.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(App, {
      global: {
        components: { FullCalendar: MockFullCalendar, CreateEventModal, ActionModal },
      },
    })
  })

  it('renders the app and initial state', () => {
    expect(wrapper.find('.demo-app').exists()).toBe(true)
    expect(wrapper.findComponent(MockFullCalendar).exists()).toBe(true)
    expect(wrapper.findComponent(CreateEventModal).exists()).toBe(true)
    expect(wrapper.findComponent(ActionModal).exists()).toBe(true)
  })

})




