<template>
  <div class="metric-card">
    <div class="metric-value">{{ value }}</div>
    <div class="metric-label">{{ label }}</div>
  </div>
</template>

<script setup>
defineProps({
  value: [String, Number],
  label: String
})
</script>

<style scoped>
.metric-card {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 32px 24px;
  text-align: center;
  box-shadow: 
    0 8px 32px rgba(99, 102, 241, 0.1),
    0 1px 2px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.5);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 16px 48px rgba(99, 102, 241, 0.15),
    0 1px 2px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.metric-value {
  font-size: 40px;
  font-weight: 700;
  color: #6366F1;
  margin-bottom: 8px;
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.metric-label {
  font-size: 14px;
  color: #6366F1;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
}
</style>
