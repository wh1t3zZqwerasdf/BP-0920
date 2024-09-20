<script lang="ts" setup>
import { getRolesApi } from "@/api/system/role"

const tableData = [] as any[]

function handleSelectionChange() {}

async function handleSubmit() {
  const res = await getRolesApi()
  console.log(res)
}
</script>

<template>
  <div class="app-container">
    <el-card style="max-width: 100%">
      <el-table ref="multipleTableRef" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column label="Date" width="120">
          <template #default="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column property="name" label="Name" width="120" />
        <el-table-column property="address" label="Address" />
      </el-table>
    </el-card>
    <el-card style="max-width: 100%">
      <el-button type="primary" @click="handleSubmit"> 确认 </el-button>
    </el-card>
  </div>
</template>

<style scoped></style>
