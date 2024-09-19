import { mount } from '@vue/test-utils'
import ActionModal from '@/components/ActionModal.vue'
import { describe, it, expect, beforeEach } from 'vitest'

describe('ActionModal.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(ActionModal, {
      props: {
        modelValue: true, // Начальное состояние: модальное окно отображается
      },
    })
  })

  it('renders correctly when show is true', () => {
    expect(wrapper.find('.action-modal-wrapper').exists()).toBe(true)
  })

  it('does not render when show is false', async () => {
    await wrapper.setProps({ modelValue: false })
    expect(wrapper.find('.action-modal-wrapper').exists()).toBe(false)
  })

  it('displays edit form when isEdit is true', async () => {
    await wrapper.vm.handleEdit() // Устанавливаем состояние редактирования
    await wrapper.vm.$nextTick() // Даем время для обновления состояния

    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('.action-modal-title').text()).toBe('Enter new title')
    expect(wrapper.find('.success-color').text()).toBe('Submit')
    expect(wrapper.find('.error-color').text()).toBe('Cancel')
  })

  it('displays action buttons when isEdit is false', async () => {
    await wrapper.vm.$nextTick() // Даем время для обновления состояния

    expect(wrapper.find('input').exists()).toBe(false)
    expect(wrapper.find('.action-modal-title').text()).toBe('Choose action')
    expect(wrapper.find('.success-color').text()).toBe('Edit')
    expect(wrapper.find('.error-color').text()).toBe('Delete')
  })
})
