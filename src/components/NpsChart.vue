<template>
  <div class="chart-container">
    <v-chart class="chart" :option="chartOption" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import CONFIG from '../utils/config.js'

use([
  BarChart,
  GridComponent,
  TooltipComponent
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

  const npsDist = { promoters: 0, passives: 0, detractors: 0 }
  props.data.forEach(f => {
    const score = parseInt(f[F.Q10_NPS])
    if (!isNaN(score)) {
      if (score >= 9) npsDist.promoters++
      else if (score >= 7) npsDist.passives++
      else npsDist.detractors++
    }
  })

  const textColor = props.isModal ? '#374151' : '#6b7280'
  const colors = props.isModal
    ? [
        { value: npsDist.detractors, itemStyle: { color: '#ee6666', borderRadius: [6, 6, 0, 0] } },
        { value: npsDist.passives, itemStyle: { color: '#fac858', borderRadius: [6, 6, 0, 0] } },
        { value: npsDist.promoters, itemStyle: { color: '#91cc75', borderRadius: [6, 6, 0, 0] } }
      ]
    : [
        { value: npsDist.detractors, itemStyle: { color: '#4b5563', borderRadius: [6, 6, 0, 0] } },
        { value: npsDist.passives, itemStyle: { color: '#6b7280', borderRadius: [6, 6, 0, 0] } },
        { value: npsDist.promoters, itemStyle: { color: '#9ca3af', borderRadius: [6, 6, 0, 0] } }
      ]

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: '{b}: {c}人'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['贬损者\n(0-6分)', '被动者\n(7-8分)', '推荐者\n(9-10分)'],
      axisLabel: { fontSize: 10, color: textColor }
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      axisLabel: { fontSize: 10, color: textColor }
    },
    series: [{
      type: 'bar',
      data: colors,
      barWidth: '50%',
      label: {
        show: true,
        position: 'top',
        formatter: '{c}人',
        fontSize: 10, color: textColor
      }
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
