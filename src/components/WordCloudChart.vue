<template>
  <div class="chart-container">
    <v-chart class="chart" :option="chartOption" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import VChart from 'vue-echarts'
import CONFIG from '../utils/config.js'

const props = defineProps({
  data: Array,
  field: String,
  isModal: {
    type: Boolean,
    default: false
  }
})

// 简单的中文分词
const extractWords = (text) => {
  if (!text) return []
  const cleaned = text
    .replace(/[，。？！；：""''（）【】]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return cleaned.split(' ').filter(word => word.length >= 2)
}

const chartOption = computed(() => {
  const F = CONFIG.FIELDS
  const fieldName = props.field === 'good' ? F.Q11_GOOD : F.Q12_IMPROVE

  // 统计词频
  const wordCount = {}
  props.data.forEach(f => {
    const text = f[fieldName]
    if (text) {
      const words = extractWords(text)
      words.forEach(word => {
        wordCount[word] = (wordCount[word] || 0) + 1
      })
    }
  })

  const wordCloudData = Object.entries(wordCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 30)

  if (wordCloudData.length === 0) {
    return {
      title: {
        text: '暂无数据',
        left: 'center',
        top: 'center',
        textStyle: { color: props.isModal ? '#374151' : '#6b7280', fontSize: 14 }
      }
    }
  }

  const colors = props.isModal
    ? ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4']
    : ['#6b7280', '#9ca3af', '#4b5563', '#374151', '#1f2937', '#d1d5db']

  return {
    series: [{
      type: 'wordCloud',
      shape: 'circle',
      left: 'center',
      top: 'center',
      width: '90%',
      height: '90%',
      right: null,
      bottom: null,
      sizeRange: [14, 40],
      rotationRange: [-45, 45],
      rotationStep: 45,
      gridSize: 8,
      drawOutOfBound: false,
      textStyle: {
        fontFamily: 'Inter, sans-serif',
        fontWeight: '600',
        color: function () {
          return colors[Math.floor(Math.random() * colors.length)]
        }
      },
      emphasis: {
        focus: 'self',
        textStyle: {
          textShadowBlur: 10,
          textShadowColor: '#333'
        }
      },
      data: wordCloudData
    }]
  }
})
</script>

<style scoped>
.chart-container { 
  width: 100%; 
  height: 100%; 
  min-height: 280px;
}
.chart { 
  width: 100%; 
  height: 100%; 
  min-height: 280px;
}
</style>
