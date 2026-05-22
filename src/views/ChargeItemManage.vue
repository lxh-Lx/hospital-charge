<template>
  <div class="charge-item-manage">
    <el-card>
      <template #header>
        <span>收费项目管理</span>
        <el-button type="primary" size="small" style="float: right" @click="openDialog()">新增项目</el-button>
      </template>
      
      <el-table :data="chargeItemList" border style="width: 100%">
        <el-table-column prop="itemId" label="项目ID" width="80"></el-table-column>
        <el-table-column prop="itemName" label="项目名称"></el-table-column>
        <el-table-column prop="itemType" label="项目类型" width="120"></el-table-column>
        <el-table-column prop="price" label="单价" width="100"></el-table-column>
        <el-table-column prop="unit" label="单位" width="80"></el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button type="primary" size="small" @click="openDialog(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row.itemId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog v-model="dialogVisible" title="收费项目信息" width="500px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="项目名称" prop="itemName">
          <el-input v-model="form.itemName" placeholder="请输入项目名称"></el-input>
        </el-form-item>
        <el-form-item label="项目类型" prop="itemType">
          <el-select v-model="form.itemType" placeholder="请选择项目类型">
            <el-option label="药品" value="药品"></el-option>
            <el-option label="检查" value="检查"></el-option>
            <el-option label="检验" value="检验"></el-option>
            <el-option label="治疗" value="治疗"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单价" prop="price">
          <el-input-number v-model="form.price" :min="0.01" :precision="2" placeholder="请输入单价"></el-input-number>
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="form.unit" placeholder="请输入单位"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getChargeItemList, addChargeItem, updateChargeItem, deleteChargeItem } from '@/api/chargeItem'
import { ElMessage, ElMessageBox } from 'element-plus'

const chargeItemList = ref([])
const dialogVisible = ref(false)
const formRef = ref()
const isEdit = ref(false)

const form = ref({
  itemId: null,
  itemName: '',
  itemType: '',
  price: 0.01,
  unit: ''
})

const rules = ref({
  itemName: [
    { required: true, message: '请输入项目名称', trigger: 'blur' }
  ],
  itemType: [
    { required: true, message: '请选择项目类型', trigger: 'change' }
  ],
  price: [
    { required: true, message: '请输入单价', trigger: 'blur' }
  ],
  unit: [
    { required: true, message: '请输入单位', trigger: 'blur' }
  ]
})

// 获取收费项目列表
const getList = async () => {
  const res = await getChargeItemList()
  if (res.code === 200) {
    chargeItemList.value = res.data
  } else {
    ElMessage.error(res.message)
  }
}

// 打开对话框
const openDialog = (row = null) => {
  isEdit.value = !!row
  if (row) {
    form.value = { ...row }
  } else {
    form.value = {
      itemId: null,
      itemName: '',
      itemType: '',
      price: 0.01,
      unit: ''
    }
  }
  dialogVisible.value = true
  formRef.value?.clearValidate()
}

// 提交表单
const handleSubmit = async () => {
  await formRef.value.validate()
  try {
    if (isEdit.value) {
      await updateChargeItem(form.value)
      ElMessage.success('修改成功')
    } else {
      await addChargeItem(form.value)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    getList()
  } catch (e) {
    ElMessage.error('操作失败：' + e.message)
  }
}

// 删除项目
const handleDelete = (itemId) => {
  ElMessageBox.confirm(
    '确定要删除该收费项目吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    const res = await deleteChargeItem(itemId)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      getList()
    } else {
      ElMessage.error(res.message)
    }
  }).catch(() => {})
}

// 页面加载时获取列表
onMounted(() => {
  getList()
})
</script>

<style scoped>
.charge-item-manage {
  width: 100%;
}
</style>