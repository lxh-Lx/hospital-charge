<template>
  <div class="statistics">
    <el-card>
      <template #header>
        <span>收费统计</span>
      </template>
      
      <el-form :model="queryForm" inline>
        <el-form-item label="开始日期">
          <el-date-picker v-model="queryForm.startDate" type="date" placeholder="选择开始日期" value-format="YYYY-MM-DD"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker v-model="queryForm.endDate" type="date" placeholder="选择结束日期" value-format="YYYY-MM-DD"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryStatistics">查询</el-button>
        </el-form-item>
      </el-form>

      <div class="stat-card" style="margin-top: 20px; display: flex; gap: 20px">
        <el-card style="flex: 1">
          <p>总收费笔数</p>
          <p style="font-size: 30px; color: #409eff; font-weight: bold">{{ totalCount }}</p>
        </el-card>
        <el-card style="flex: 1">
          <p>总收费金额</p>
          <p style="font-size: 30px; color: #67c23a; font-weight: bold">{{ totalAmount.toFixed(2) }} 元</p>
        </el-card>
        <el-card style="flex: 1">
          <p>退费笔数</p>
          <p style="font-size: 30px; color: #f56c6c; font-weight: bold">{{ refundCount }}</p>
        </el-card>
      </div>

      <el-table :data="chargeList" border style="margin-top: 20px">
        <el-table-column prop="orderId" label="收费单号"></el-table-column>
        <el-table-column prop="patientName" label="患者姓名"></el-table-column>
        <el-table-column prop="totalAmount" label="总金额"></el-table-column>
        <el-table-column prop="payType" label="支付方式"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column prop="createTime" label="收费时间"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getChargeList } from '@/api/charge'
import { ElMessage } from 'element-plus'

const queryForm = ref({
  startDate: '',
  endDate: ''
})

const chargeList = ref([])

const totalCount = computed(() => {
  return chargeList.value.length
})

const totalAmount = computed(() => {
  return chargeList.value
    .filter(item => item.status === '已支付')
    .reduce((sum, item) => sum + item.totalAmount, 0)
})

const refundCount = computed(() => {
  return chargeList.value.filter(item => item.status === '已退费').length
})

const queryStatistics = async () => {
  const res = await getChargeList(queryForm.value)
  if (res.code === 200) {
    chargeList.value = res.data
  } else {
    ElMessage.error(res.message)
  }
}

// 页面加载时查询
queryStatistics()
</script>