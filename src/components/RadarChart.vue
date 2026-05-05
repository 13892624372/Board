<template>
  <div class="chart-container">
    <v-chart class="chart" :option="chartOption" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { use } from 'echarts/core'
import { RadarChart } from 'echarts/charts'
import {
  TooltipComponent,
  RadarComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import CONFIG from '../utils/config.js'

use([
  RadarChart,
  TooltipComponent,
  RadarComponent
])

const props = defineProps({
  data: Array,
  isModal: {
    type: Boolean,
    default: false
  }
})

const chartOption = computed(() => {
  const F = CONFIG.FIELDS

  const dimensions = [
    { field: F.Q5_RELEVANCE, name: '问题相关性' },
    { field: F.Q6_UNDERSTANDING, name: 'AI理解准确度' },
    { field: F.Q7_FLUENCY, name: '面试流畅度' },
    { field: F.Q8_FRIENDLINESS, name: '面试官友好度' },
    { field: F.Q9_REFERENCE, name: '评价参考价值' }
  ]

  const averages = dimensions.map(dim => {
    const scores = props.data
      .filter(f => f[dim.field])
      .map(f => parseInt(f[dim.field]))
    return scores.length > 0
      ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
      : 0
  })

  const textColor = props.isModal ? '#374151' : '#6b7280'
  const lineColor = props.isModal ? '#5470c6' : '#6b7280'
  const areaColor = props.isModal ? 'rgba(84, 112, 198, 0.3)' : 'rgba(107, 114, 128, 0.3)'
  const splitColor = props.isModal ? '#e5e7eb' : '#d1d5db'
  const splitAreaColors = props.isModal
    ? ['rgba(84, 112, 198, 0.05)', 'rgba(84, 112, 198, 0.1)']
    : ['rgba(107, 114, 128, 0.05)', 'rgba(107, 114, 128, 0.1)']

  return {
    tooltip: { trigger: 'item' },
    radar: {
      indicator: dimensions.map(dim => ({ name: dim.name, max: 5 })),
      center: ['50%', '55%'],
      radius: '55%',
      axisName: {
        fontSize: 11,
        color: textColor
      },
      splitLine: {
        lineStyle: { color: splitColor }
      },
      splitArea: {
        areaStyle: { color: splitAreaColors }
      },
      axisLine: {
        lineStyle: { color: splitColor }
      },
      splitLine: {
        lineStyle: { color: splitColor }
      }
    },
    series: [{
      type: 'radar',
      data: [{
        value: averages,
        name: '平均分',
        areaStyle: { color: areaColor },
        lineStyle: { color: lineColor, width: 2 },
        itemStyle: { color: lineColor, borderWidth: 2, borderColor: '#fff' }
      }]
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
