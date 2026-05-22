<template>
  <div class="refund-manage">
    <el-card>
      <template #header>
        <span>退费管理</span>
      </template>
      
      <el-form :model="queryForm" inline>
        <el-form-item label="开始日期">
          <el-date-picker v-model="queryForm.startDate" type="date" placeholder="选择开始日期" value-format="YYYY-MM-DD"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker v-model="queryForm.endDate" type="date" placeholder="选择结束日期" value-format="YYYY-MM-DD"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryChargeList">查询</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="chargeList" border style="margin-top: 20px">
        <el-table-column prop="orderId" label="收费单号"></el-table-column>
        <el-table-column prop="patientName" label="患者姓名"></el-table-column>
        <el-table-column prop="totalAmount" label="总金额"></el-table-column>
        <el-table-column prop="payType" label="支付方式"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column prop="createTime" label="收费时间"></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button 
              type="danger" 
              size="small" 
              @click="handleRefund(scope.row)"
              :disabled="scope.row.status === '已退费'"
            >
              退费
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getChargeList, refundCharge } from '@/api/charge'
import { ElMessage, ElMessageBox } from 'element-plus'

const queryForm = ref({
  startDate: '',
  endDate: ''
})

const chargeList = ref([])

const queryChargeList = async () => {
  const res = await getChargeList(queryForm.value)
  if (res.code === 200) {
    chargeList.value = res.data
  } else {
    ElMessage.error(res.message)
  }
}

const handleRefund = (row) => {
  ElMessageBox.confirm(
    '确定要对该收费单进行退费吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    const res = await refundCharge(row.orderId)
    if (res.code === 200) {
      ElMessage.success('退费成功')
      queryChargeList()
    } else {
      ElMessage.error(res.message)
    }
  }).catch(() => {})
}

// 页面加载时查询
queryChargeList()
</script>