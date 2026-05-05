import { ref, computed } from 'vue'
import { dataAPI } from '../utils/api.js'
import CONFIG from '../utils/config.js'

export function useDashboardData() {
    const userFeedback = ref([])
    const loading = ref(false)
    const error = ref(null)

    // 核心指标计算
    const totalResponses = computed(() => userFeedback.value.length)

    const avgSatisfaction = computed(() => {
        const scores = userFeedback.value
            .map(f => parseInt(f[CONFIG.FIELDS.Q4_SATISFACTION]))
            .filter(s => !isNaN(s))
        if (scores.length === 0) return 0
        return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
    })

    const npsValue = computed(() => {
        const scores = userFeedback.value
            .map(f => parseInt(f[CONFIG.FIELDS.Q10_NPS]))
            .filter(s => !isNaN(s))
        if (scores.length === 0) return 0

        const promoters = scores.filter(s => s >= 9).length
        const detractors = scores.filter(s => s <= 6).length
        const total = scores.length

        return Math.round(((promoters - detractors) / total) * 100)
    })

    // 加载数据
    const loadData = async () => {
        loading.value = true
        error.value = null
        try {
            const data = await dataAPI.getAllData()
            userFeedback.value = data.userFeedback
        } catch (err) {
            error.value = err.message
            console.error('加载数据失败:', err)
        } finally {
            loading.value = false
        }
    }

    return {
        userFeedback,
        loading,
        error,
        totalResponses,
        avgSatisfaction,
        npsValue,
        loadData
    }
}
