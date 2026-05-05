<template>
  <div 
    class="card-3d-wrapper" 
    ref="wrapperRef"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <div class="card-3d" ref="cardRef">
      <div class="card-inner">
        <div class="card-glare" ref="glareRef"></div>
        <div class="card-content">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  intensity: {
    type: Number,
    default: 6
  }
})

const cardRef = ref(null)
const wrapperRef = ref(null)
const glareRef = ref(null)

const handleMouseMove = (e) => {
  if (!cardRef.value || !wrapperRef.value) return
  
  const clientRect = wrapperRef.value.getBoundingClientRect()
  const x = e.clientX - clientRect.left
  const y = e.clientY - clientRect.top

  const centerX = clientRect.width / 2
  const centerY = clientRect.height / 2
  
  const calcX = -(y - centerY) / props.intensity
  const calcY = (x - centerX) / props.intensity
  const percentage = (x / clientRect.width) * 100

  cardRef.value.style.transform = `perspective(1200px) rotateX(${calcX}deg) rotateY(${calcY}deg)`
  
  if (glareRef.value) {
    glareRef.value.style.setProperty('--per', `${percentage}%`)
    glareRef.value.style.opacity = '1'
  }
}

const handleMouseLeave = () => {
  if (!cardRef.value) return
  
  cardRef.value.style.transform = 'perspective(1200px) rotateX(0) rotateY(0)'
  
  if (glareRef.value) {
    glareRef.value.style.opacity = '0'
  }
}

onMounted(() => {
  if (cardRef.value) {
    cardRef.value.style.transform = 'perspective(1200px) rotateX(0) rotateY(0)'
  }
})
</script>

<style scoped>
.card-3d-wrapper {
  width: 100%;
  height: 100%;
}

.card-3d {
  width: 100%;
  height: 100%;
  min-height: 280px;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
}

.card-glare {
  --per: 30%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  border-radius: 20px;
  background: linear-gradient(
    115deg,
    transparent 0%,
    rgba(255, 255, 255, 0.4) calc(var(--per) - 20%),
    rgba(255, 255, 255, 0.6) var(--per),
    rgba(255, 255, 255, 0.4) calc(var(--per) + 20%),
    transparent 100%
  );
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 10;
}

.card-content {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 280px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 
    0 4px 20px rgba(99, 102, 241, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.card-content :deep(.chart-container) {
  width: 100%;
  height: 100%;
  min-height: 280px;
}

.card-content :deep(.chart) {
  width: 100%;
  height: 100%;
}
</style>