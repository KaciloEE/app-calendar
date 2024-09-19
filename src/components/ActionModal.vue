<template>
  <div class="action-modal-wrapper" v-if="show">
    <div class="action-modal-overlay" @click="handleOverlayClick"></div>
    <div class="action-modal-card">
      <div class="action-modal-title">
        <template v-if="!isEdit"> Choose action </template>
        <template v-else>Enter new title</template>
      </div>
      <div class="action-modal-text">
        <div v-if="isEdit">
          <input v-model="title" />
        </div>
      </div>
      <div class="action-modal-actions">
        <template v-if="isEdit">
          <button class="error-color" @click="close">Cancel</button>
          <button class="success-color" @click="handleSubmitEdit">
            Submit
          </button>
        </template>

        <template v-else>
          <button class="error-color" @click="handleDelete">Delete</button>
          <button class="success-color" @click="handleEdit">Edit</button>
        </template>
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
      action: '',
      title: '',
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
    isEdit() {
      return this.action === 'edit'
    },
  },
  emits: ['update:modelValue'],
  methods: {
    handleEdit() {
      this.action = 'edit'
    },
    handleSubmitEdit() {
      this.$emit('edit', this.title)
      this.close()
    },
    handleDelete() {
      this.$emit('delete')
      this.close()
    },
    handleOverlayClick() {
      this.$emit('click:outside')
      this.close()
    },
    close() {
      this.action = ''
      this.title = ''
      this.show = false
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
