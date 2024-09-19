import { mount } from '@vue/test-utils'
import CreateEventModal from '@/components/CreateEventModal.vue'
import { describe, it, expect, beforeEach } from 'vitest'

describe('CreateEventModal.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(CreateEventModal, {
      props: {
        modelValue: true, // Начальное состояние: модальное окно отображается
      },
    })
  })

  it('renders correctly when show is true', () => {
    expect(wrapper.find('.action-modal-wrapper').exists()).toBe(true)
    expect(wrapper.find('.action-modal-title').text()).toBe('Create Event')
  })

  it('does not render when show is false', async () => {
    await wrapper.setProps({ modelValue: false })
    expect(wrapper.find('.action-modal-wrapper').exists()).toBe(false)
  })

  it('generates correct time options', () => {
    const times = wrapper.vm.generateTimeOptions()
    expect(times).toHaveLength(48)
    expect(times[0]).toBe('00:00')
    expect(times[times.length - 1]).toBe('23:30')
  })
})
