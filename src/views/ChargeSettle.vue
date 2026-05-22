<template>
  <div class="charge-settle">
    <el-card>
      <template #header>
        <span>门诊收费结算</span>
      </template>
      
      <el-form :model="queryForm" inline>
        <el-form-item label="患者ID">
          <el-input v-model="queryForm.patientId" placeholder="请输入患者ID" @keyup.enter="queryUnpaidItems"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryUnpaidItems">查询未收费项目</el-button>
        </el-form-item>
      </el-form>

      <!-- 患者姓名显示 -->
      <div v-if="patientName" style="margin: 10px 0; color: #666; font-size: 14px">
        患者姓名：<strong style="color: #333">{{ patientName }}</strong>
      </div>

      <el-table :data="unpaidItems" border style="margin-top: 20px">
        <el-table-column prop="itemName" label="项目名称"></el-table-column>
        <el-table-column prop="itemType" label="项目类型"></el-table-column>
        <el-table-column prop="price" label="单价"></el-table-column>
        <el-table-column prop="quantity" label="数量">
          <template #default="scope">
            <el-input-number v-model="scope.row.quantity" :min="1" @change="calculateTotal"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额"></el-table-column>
      </el-table>

      <div class="settle-info" style="margin-top: 20px">
  <p>总金额：<span style="color: red; font-size: 20px; font-weight: bold">{{ totalAmount.toFixed(2) }} 元</span></p>
  <el-form :model="settleForm" inline style="margin-top: 15px">
    <el-form-item label="支付方式" prop="payType">
      <el-select 
        v-model="settleForm.payType" 
        placeholder="请选择支付方式" 
        style="width: 200px"
        clearable
      >
        <el-option label="现金" value="现金"></el-option>
        <el-option label="微信支付" value="微信"></el-option>
        <el-option label="支付宝" value="支付宝"></el-option>
        <el-option label="医保刷卡" value="医保"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button 
        type="success" 
        @click="settleCharge" 
        :disabled="unpaidItems.length === 0 || !settleForm.payType"
        size="large"
      >
        确认收费
      </el-button>
    </el-form-item>
  </el-form>
</div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getUnpaidItems, settleCharge } from '@/api/charge'
import { getPatientById } from '@/api/patient'
import { ElMessage } from 'element-plus'

const queryForm = ref({
  patientId: ''
})

const settleForm = ref({
  patientId: '',
  payType: ''
})

const unpaidItems = ref([])
const patientName = ref('') // 患者姓名变量

// 计算总金额
const totalAmount = computed(() => {
  return unpaidItems.value.reduce((sum, item) => {
    item.amount = item.price * item.quantity
    return sum + item.amount
  }, 0)
})

// 查询未收费项目（同时获取患者姓名）
const queryUnpaidItems = async () => {
  if (!queryForm.value.patientId) {
    ElMessage.warning('请输入患者ID')
    return
  }
  // 先清空之前的数据
  patientName.value = ''
  unpaidItems.value = []
  settleForm.value.payType = ''

   try {
    // 获取患者姓名
    const patientRes = await getPatientById(queryForm.value.patientId)
    if (patientRes.code === 200 && patientRes.data) {
      patientName.value = patientRes.data.name
      
      // 获取未收费项目
      const res = await getUnpaidItems(queryForm.value.patientId)
      if (res.code === 200) {
        unpaidItems.value = res.data.map(item => ({
          ...item,
          quantity: 1,
          amount: item.price
        }))
        settleForm.value.patientId = queryForm.value.patientId
      } else {
        ElMessage.error(res.message)
      }
    } else {
      ElMessage.error('该患者ID不存在')
      // 患者不存在时清空所有数据
      queryForm.value.patientId = ''
      settleForm.value.patientId = ''
    }
  } catch (e) {
    ElMessage.error('获取患者信息失败')
    // 发生错误时也清空所有数据
    queryForm.value.patientId = ''
    settleForm.value.patientId = ''
    patientName.value = ''
    unpaidItems.value = []
  }
}

// 触发总金额重新计算
const calculateTotal = () => {
  // 空函数，仅用于触发计算属性更新
}

const handleSettleCharge = async () => {
  if (!settleForm.value.payType) {
    ElMessage.warning('请选择支付方式')
    return
  }
  try {
    const res = await settleCharge({
      patientId: parseInt(settleForm.value.patientId),
      payType: settleForm.value.payType,
      totalAmount: totalAmount.value,
      details: unpaidItems.value.map(item => ({
        itemId: item.itemId,
        quantity: item.quantity,
        amount: item.amount
      }))
    })
    if (res.code === 200) {
      ElMessage.success('收费成功')
      // 收费成功后完全重置页面
      queryForm.value.patientId = ''
      settleForm.value.patientId = ''
      settleForm.value.payType = ''
      patientName.value = ''
      unpaidItems.value = []
    } else {
      ElMessage.error(res.message)
    }
  } catch (e) {
    ElMessage.error('收费失败：' + e.message)
  }
}
</script>