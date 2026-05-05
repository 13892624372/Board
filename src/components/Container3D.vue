<template>
  <div
    class="container-bg"
    ref="containerRef"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <div class="container-glare" ref="glareRef"></div>
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  intensity: {
    type: Number,
    default: 8
  }
})

const containerRef = ref(null)
const glareRef = ref(null)

const handleMouseMove = (e) => {
  if (!containerRef.value) return

  const rect = containerRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left

  const percentage = (x / rect.width) * 100

  if (glareRef.value) {
    glareRef.value.style.setProperty('--per', `${percentage}%`)
    glareRef.value.style.opacity = '1'
  }
}

const handleMouseLeave = () => {
  if (glareRef.value) {
    glareRef.value.style.opacity = '0'
  }
}

onMounted(() => {
  if (glareRef.value) {
    glareRef.value.style.opacity = '0'
  }
})
</script>

<style scoped>
.container-bg {
  position: fixed;
  top: 0;
  left: 260px;
  right: 0;
  bottom: 0;
  background: #000000;
  overflow: hidden;
}

.container-glare {
  --per: 30%;
  position: fixed;
  top: 0;
  left: 260px;
  right: 0;
  bottom: 0;
  pointer-events: none;
  background: linear-gradient(
    115deg,
    transparent 0%,
    rgba(255, 255, 255, 0.04) calc(var(--per) - 15%),
    rgba(255, 255, 255, 0.08) var(--per),
    rgba(255, 255, 255, 0.04) calc(var(--per) + 15%),
    transparent 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 100;
}
</style>