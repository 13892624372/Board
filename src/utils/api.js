import CONFIG from './config.js'

class DataAPI {
    constructor() {
        this.baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets'
    }

    // 获取工作表数据
    async fetchSheetData(sheetName) {
        const url = `${this.baseUrl}/${CONFIG.SPREADSHEET_ID}/values/${sheetName}?key=${CONFIG.API_KEY}`

        try {
            const response = await fetch(url)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            return this.parseSheetData(data.values)
        } catch (error) {
            console.error('获取数据失败:', error)
            throw error
        }
    }

    // 解析表格数据
    parseSheetData(values) {
        if (!values || values.length < 2) return []

        const headers = values[0]
        const rows = values.slice(1)

        return rows.map(row => {
            const obj = {}
            headers.forEach((header, index) => {
                obj[header] = row[index] || ''
            })
            return obj
        })
    }

    // 获取用户反馈数据
    async getUserFeedback() {
        return await this.fetchSheetData(CONFIG.SHEETS.USER_FEEDBACK)
    }

    // 获取所有数据
    async getAllData() {
        try {
            const userFeedback = await this.getUserFeedback()
            return { userFeedback }
        } catch (error) {
            console.error('获取所有数据失败:', error)
            throw error
        }
    }
}

export const dataAPI = new DataAPI()
