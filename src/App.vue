<template>
  <div class="dashboard">
    <Sidebar
      :last-update="lastUpdate"
      :loading="loading"
      @nav-click="handleNavClick"
      @refresh="refreshData"
    />

    <div class="stats-container">
      <div class="stat-card">
        <div class="stat-value">{{ totalSurveys }}</div>
        <div class="stat-label">总问卷数</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ avgSatisfaction }}</div>
        <div class="stat-label">平均满意度</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ npsValue }}</div>
        <div class="stat-label">NPS值</div>
      </div>
    </div>

    <div class="main-container">
      <div class="cards-grid">
        <div
          v-for="(card, index) in cards"
          :key="index"
          class="grid-card"
          :class="[card.size, card.position]"
          :style="card.style"
          @click="handleCardClick(index)"
        >
          <h3 class="card-title">{{ card.title }}</h3>
          <div class="card-chart">
            <component :is="card.component" :data="userFeedback" :field="card.field" :is-modal="false" />
          </div>
        </div>
      </div>
    </div>

    <Modal
      :show="modalVisible"
      :title="modalTitle"
      @close="handleModalClose"
    >
      <div class="modal-chart-wrapper">
        <component :is="modalComponent" :data="userFeedback" :field="modalField" :is-modal="true" />
      </div>
    </Modal>

    <div v-if="error" class="error-message">
      <h3>数据加载失败</h3>
      <p>{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useDashboardData } from './composables/useDashboardData.js'
import CONFIG from './utils/config.js'
import Sidebar from './components/Sidebar.vue'
import Modal from './components/Modal.vue'
import UserPersonaChart from './components/UserPersonaChart.vue'
import IndustryChart from './components/IndustryChart.vue'
import SatisfactionTrendChart from './components/SatisfactionTrendChart.vue'
import RadarChart from './components/RadarChart.vue'
import NpsChart from './components/NpsChart.vue'
import WordCloudChart from './components/WordCloudChart.vue'

const {
  userFeedback,
  loading,
  error,
  loadData
} = useDashboardData()

const lastUpdate = ref('--')
const modalVisible = ref(false)
const modalTitle = ref('')
const modalComponent = ref(null)
const modalField = ref(null)

const totalSurveys = computed(() => userFeedback.value.length)

const avgSatisfaction = computed(() => {
  const scores = userFeedback.value
    .map(f => parseInt(f[CONFIG.FIELDS.Q4_SATISFACTION]))
    .filter(s => !isNaN(s))
  if (scores.length === 0) return '0.00'
  return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)
})

const npsValue = computed(() => {
  const scores = userFeedback.value
    .map(f => parseInt(f[CONFIG.FIELDS.Q10_NPS]))
    .filter(s => !isNaN(s))
  if (scores.length === 0) return '0'

  const promoters = scores.filter(s => s >= 9).length
  const detractors = scores.filter(s => s <= 6).length
  const total = scores.length

  return Math.round(((promoters - detractors) / total) * 100).toString()
})

const cards = computed(() => [
  {
    title: '用户画像',
    component: UserPersonaChart,
    size: 'size-large',
    position: 'pos-top-center'
  },
  {
    title: '行业分布',
    component: IndustryChart,
    size: 'size-small',
    position: 'pos-top-left'
  },
  {
    title: '平均满意度趋势',
    component: SatisfactionTrendChart,
    size: 'size-wide',
    position: 'pos-middle-center'
  },
  {
    title: '五维度评分',
    component: RadarChart,
    size: 'size-medium',
    position: 'pos-top-right'
  },
  {
    title: 'NPS分布',
    component: NpsChart,
    size: 'size-small',
    position: 'pos-bottom-left'
  },
  {
    title: '做得好的方面',
    component: WordCloudChart,
    field: 'good',
    size: 'size-medium',
    position: 'pos-bottom-center'
  },
  {
    title: '改进建议',
    component: WordCloudChart,
    field: 'improve',
    size: 'size-medium',
    position: 'pos-bottom-right'
  }
])

const refreshData = async () => {
  await loadData()
  lastUpdate.value = new Date().toLocaleString('zh-CN')
}

const handleNavClick = (index) => {
  const card = cards.value[index]
  modalTitle.value = card.title
  modalComponent.value = card.component
  modalField.value = card.field
  modalVisible.value = true
}

const handleCardClick = (index) => {
  const card = cards.value[index]
  modalTitle.value = card.title
  modalComponent.value = card.component
  modalField.value = card.field
  modalVisible.value = true
}

const handleModalClose = () => {
  modalVisible.value = false
}

onMounted(() => {
  refreshData()
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Source+Serif+4:ital,wght@0,400;0,500;0,600;1,400&display=swap');

:root {
  --color-primary: #6b7280;
  --color-primary-light: #9ca3af;
  --color-primary-dark: #4b5563;
  --color-secondary: #6b7280;
  --color-accent: #4b5563;
  --color-foreground: #111827;
  --color-card: rgba(255, 255, 255, 0.7);
  --color-card-foreground: #111827;
  --color-muted: rgba(209, 213, 219, 0.6);
  --color-muted-foreground: #6b7280;
  --color-border: rgba(156, 163, 175, 0.3);
  --color-destructive: #991b1b;
  --color-success: #065f46;
  --color-warning: #92400e;
  --color-ring: #4b5563;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: url('/1.jpg') center center / cover no-repeat fixed;
  min-height: 100vh;
  overflow: hidden;
}

.dashboard {
  display: flex;
  min-height: 100vh;
}

.stats-container {
  position: fixed;
  left: 260px;
  top: 0;
  width: 150px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 40px;
  padding: 20px;
}

.stat-card {
  text-align: center;
  font-family: 'Inter', sans-serif;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #000000;
  font-weight: 500;
}

.main-container {
  margin-left: 410px;
  flex: 1;
  min-height: 100vh;
  background: radial-gradient(ellipse at 50% 50%, rgba(107, 114, 128, 0.15) 0%, transparent 70%);
  padding: 20px 30px;
  overflow-y: auto;
}

.cards-grid {
  position: relative;
  width: 100%;
  min-height: calc(100vh - 150px);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.grid-card {
  background: transparent;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  border-radius: 24px;
  padding: 16px;
  border: none;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: none;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.grid-card::before {
  display: none;
}

.grid-card::after {
  display: none;
}

@keyframes crystalShimmer {
  0%, 100% {
    transform: translate(-30%, -30%) rotate(0deg);
    opacity: 0.5;
  }
  50% {
    transform: translate(0%, 0%) rotate(180deg);
    opacity: 0.8;
  }
}

.grid-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 
    0 16px 48px rgba(0, 0, 0, 0.4),
    inset 0 3px 6px rgba(255, 255, 255, 0.4),
    inset 0 -3px 12px rgba(0, 0, 0, 0.3);
  border-color: rgba(107, 114, 128, 0.8);
}

.grid-card.size-small {
  width: 200px;
  min-height: 160px;
}

.grid-card.size-medium {
  width: 260px;
  min-height: 220px;
}

.grid-card.size-large {
  width: 320px;
  min-height: 280px;
}

.grid-card.size-wide {
  width: 540px;
  min-height: 200px;
}

.grid-card.pos-top-left {
  align-self: flex-start;
  margin-right: auto;
}

.grid-card.pos-top-center {
  align-self: flex-start;
}

.grid-card.pos-top-right {
  align-self: flex-start;
  margin-left: auto;
}

.grid-card.pos-middle-center {
  align-self: center;
}

.grid-card.pos-bottom-left {
  align-self: flex-end;
  margin-right: auto;
}

.grid-card.pos-bottom-center {
  align-self: flex-end;
}

.grid-card.pos-bottom-right {
  align-self: flex-end;
  margin-left: auto;
}

.card-title {
  font-size: 13px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 10px;
  font-family: 'Inter', sans-serif;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  z-index: 1;
}

.card-chart {
  flex: 1;
  width: 100%;
  min-height: 0;
  position: relative;
  z-index: 1;
}

.card-chart :deep(.chart-container) {
  width: 100%;
  height: 100%;
  min-height: 120px;
}

.card-chart :deep(.chart) {
  width: 100%;
  height: 100%;
}

.modal-chart-wrapper {
  width: 100%;
  min-height: 500px;
}

.error-message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(15, 15, 20, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 48px 32px;
  text-align: center;
  color: #ef4444;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4);
  z-index: 2000;
}

.error-message h3 {
  margin-bottom: 12px;
  font-size: 18px;
  font-family: 'Inter', sans-serif;
}

.error-message p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}

@media (max-width: 1200px) {
  .cards-grid {
    padding: 20px;
    gap: 15px;
  }

  .grid-card.size-wide {
    width: calc(100% - 40px);
    max-width: 540px;
  }

  .grid-card.size-large {
    width: 280px;
  }
}

@media (max-width: 768px) {
  .main-container {
    margin-left: 0;
  }

  .cards-grid {
    padding: 15px;
    flex-direction: column;
    gap: 12px;
  }

  .grid-card {
    width: 100%;
    min-height: 200px;
  }

  .grid-card.size-wide,
  .grid-card.size-large,
  .grid-card.size-medium {
    width: 100%;
  }
}
</style>