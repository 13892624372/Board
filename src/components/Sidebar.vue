<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <h2 class="sidebar-title">AI面试模拟器</h2>
      <p class="sidebar-subtitle">用户反馈数据看板</p>
    </div>

    <nav class="sidebar-nav">
      <div 
        v-for="(item, index) in navItems" 
        :key="index"
        class="nav-item"
        :class="{ active: activeIndex === index }"
        @click="handleNavClick(index)"
      >
        <span class="nav-label">{{ item.label }}</span>
      </div>
    </nav>

    <div class="sidebar-footer">
      <div class="sidebar-info">
        <span class="info-label">最后更新</span>
        <span class="info-value">{{ lastUpdate }}</span>
      </div>
      <button class="sidebar-refresh" @click="refreshData" :disabled="loading">
        {{ loading ? '刷新中...' : '刷新数据' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  lastUpdate: {
    type: String,
    default: '--'
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['navClick', 'refresh'])

const activeIndex = ref(0)

const navItems = [
  { label: '用户画像' },
  { label: '行业分布' },
  { label: '满意度趋势' },
  { label: '五维度评分' },
  { label: 'NPS分布' },
  { label: '做得好的方面' },
  { label: '改进建议' }
]

const handleNavClick = (index) => {
  activeIndex.value = index
  emit('navClick', index)
}

const refreshData = () => {
  emit('refresh')
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 260px;
  height: 100vh;
  background: transparent;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  border-right: none;
  display: flex;
  flex-direction: column;
  z-index: 100;
  transform-origin: left center;
  transition: transform 1.5s cubic-bezier(0.4, 0, 0.2, 1);
  transform: perspective(1500px) rotateY(55deg);
  border-radius: 0 20px 20px 0;
}

.sidebar:hover {
  transform: perspective(1500px) rotateY(0deg);
}

.sidebar-header {
  padding: 28px 24px;
  border-bottom: none;
}

.sidebar-title {
  font-size: 18px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 6px;
  font-family: 'Inter', sans-serif;
}

.sidebar-subtitle {
  font-size: 13px;
  color: #000000;
  font-family: 'Inter', sans-serif;
}

.sidebar-nav {
  flex: 1;
  padding: 16px 12px;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  margin-bottom: 4px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #000000;
  font-family: 'Inter', sans-serif;
}

.nav-item:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #000000;
}

.nav-item.active {
  background: rgba(0, 0, 0, 0.15);
  border: none;
  color: #000000;
}

.nav-label {
  font-size: 14px;
  font-weight: 500;
}

.sidebar-footer {
  padding: 20px 20px 24px;
  border-top: none;
}

.sidebar-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
}

.info-label {
  font-size: 12px;
  color: #000000;
  font-family: 'Inter', sans-serif;
}

.info-value {
  font-size: 13px;
  color: #000000;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
}

.sidebar-refresh {
  width: 100%;
  background: rgba(0, 0, 0, 0.1);
  color: #000000;
  border: none;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Inter', sans-serif;
}

.sidebar-refresh:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

.sidebar-refresh:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
</style>