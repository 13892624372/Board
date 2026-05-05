<template>
  <transition name="modal">
    <div v-if="show" class="modal-overlay" @click="handleClose" @mousemove="handleMouseMove" @mouseleave="handleMouseLeave" ref="overlayRef">
      <div
        class="modal-content"
        @click.stop
        ref="modalRef"
      >
        <div class="modal-header">
          <h3 class="modal-title">{{ title }}</h3>
          <button class="modal-close" @click="handleClose">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close'])

const modalRef = ref(null)
const overlayRef = ref(null)

const handleClose = () => {
  emit('close')
}

const handleMouseMove = (e) => {
  if (!modalRef.value) return
  
  const overlayRect = overlayRef.value.getBoundingClientRect()
  const centerX = overlayRect.width / 2
  const centerY = overlayRect.height / 2
  
  const x = e.clientX - overlayRect.left
  const y = e.clientY - overlayRect.top
  
  const offsetX = x - centerX
  const offsetY = y - centerY
  
  let calcX = -offsetY / 60
  let calcY = offsetX / 60
  
  calcX = Math.max(-3, Math.min(3, calcX))
  calcY = Math.max(-3, Math.min(3, calcY))
  
  modalRef.value.style.transform = `perspective(1500px) rotateX(${calcX}deg) rotateY(${calcY}deg)`
}

const handleMouseLeave = () => {
  if (!modalRef.value) return
  modalRef.value.style.transform = 'perspective(1500px) rotateX(0) rotateY(0)'
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
  perspective: 1500px;
}

.modal-content {
  position: relative;
  background: #ffffff;
  border-radius: 24px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.25);
  width: 92%;
  max-width: 1200px;
  height: 85vh;
  display: flex;
  flex-direction: column;
  animation: scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  transform-style: preserve-3d;
  will-change: transform;
  transition: transform 0.1s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 2;
  flex-shrink: 0;
}

.modal-title {
  font-size: 22px;
  font-weight: 600;
  color: #1e1b4b;
  font-family: 'Inter', sans-serif;
}

.modal-close {
  background: rgba(0, 0, 0, 0.05);
  border: none;
  color: #64748b;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.08);
  color: #1e1b4b;
  transform: rotate(90deg);
}

.modal-body {
  flex: 1;
  padding: 32px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
  position: relative;
  z-index: 2;
}

.modal-body :deep(.chart-container) {
  width: 100% !important;
  height: 100% !important;
  flex: 1;
}

.modal-body :deep(.chart) {
  width: 100% !important;
  height: 100% !important;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.92);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: perspective(1500px) scale(0.92);
    opacity: 0;
  }
  to {
    transform: perspective(1500px) scale(1);
    opacity: 1;
  }
}
</style>