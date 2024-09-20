<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="formData">
        <el-form-item prop="username" label="菜单名称">
          <el-input v-model="formData.name" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search">查询</el-button>
          <el-button :icon="Refresh">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card v-loading="loading" class="w-full" style="height: calc(100% - 24px)">
      <div class="flex mb-20px justify-between">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="handleAdd('add')">新增路由</el-button>
          <el-button type="danger" :icon="Delete">批量删除</el-button>
        </div>
        <div>
          <el-tooltip content="下载">
            <el-button type="primary" :icon="Download" circle />
          </el-tooltip>
          <el-tooltip content="刷新当前页">
            <el-button type="primary" :icon="RefreshRight" circle />
          </el-tooltip>
        </div>
      </div>
      <div class="mb-20px">
        <el-table
          ref="multipleTableRef"
          :data="tableData"
          border
          row-key="id"
          :scrollbar-always-on="true"
          style="width: 100%"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="创建时间" width="220">
            <template #default="scope">{{ scope.row.createTime }}</template>
          </el-table-column>
          <el-table-column property="name" label="菜单标题" />
          <el-table-column property="icon" label="菜单图标" />
          <el-table-column property="path" label="路由路径" width="180" />
          <el-table-column property="routeName" label="路由名称" />
          <el-table-column property="component" label="组件路径" min-width="200" />
          <el-table-column property="type" label="类型" width="80" />
          <el-table-column property="hasLink" label="是否外链" />
          <el-table-column property="sort" label="排序" />
          <el-table-column fixed="right" label="操作" width="240">
            <template #default="scope">
              <el-button type="primary" @click="handleUpdate(scope.row)"> 编辑 </el-button>
              <el-button type="success" @click="handleAdd('addChildren', scope.row)"> 新增 </el-button>
              <el-button type="danger" @click="handleDelete(scope.row)"> 删除 </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogConfig === 'add' ? '新增路由' : '修改路由'" width="800">
      <el-form :model="formData" ref="formRef" label-width="160px" @submit.prevent="handleSubmit">
        <el-row>
          <el-col :span="24">
            <el-form-item label="根组件component" prop="component" :rules="formRules.component">
              <el-input
                v-model="formData.component"
                :disabled="formData.parentId ? false : true"
                placeholder="比如 '@/views/example.vue'"
              />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="菜单路径path" prop="path" :rules="formRules.path">
              <el-input v-model="formData.path" placeholder="/example/path" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="路由传参routeName" prop="routeName" :rules="formRules.routeName">
              <el-input v-model="formData.routeName" placeholder="路由传参" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="菜单标题name" prop="name" :rules="formRules.name">
              <el-input v-model="formData.name" placeholder="菜单标题name" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="路由重定向路径redirect" prop="redirect">
              <el-input v-model="formData.redirect" placeholder="路由重定向" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="菜单图标icon" prop="icon">
              <el-input v-model="formData.icon" placeholder="图标" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="formData.parentId">
          <el-col :span="24">
            <el-form-item label="权限" prop="permission" :rules="formRules.permission">
              <el-input v-model="formData.permission" placeholder="授权标识，多个逗号分割 比如: sys:menu:list" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="排序" prop="sort">
              <el-input-number v-model="formData.sort" :min="1" :max="10000" controls-position="right" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="是否外链" prop="hasLink">
              <el-radio-group v-model="formData.hasLink">
                <el-radio :value="1">是</el-radio>
                <el-radio :value="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit(dialogConfig)"> 确认 </el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue"
import { ElForm } from "element-plus"
import { addRoutMenu, getMenuPageApi, updateMenu, deleteMenu } from "@/api/system/menu"
import { MenuItem, addMenu } from "@/api/system/menu/types/menu"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight } from "@element-plus/icons-vue"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { cloneDeep } from "lodash-es"

defineOptions({
  // 命名当前组件
  name: "SystemMenuPage"
})

const loading = ref<boolean>(false)
const formRef = ref<InstanceType<typeof ElForm> | null>(null)
const dialogVisible = ref(false)
const tableData = ref<MenuItem[]>([])

const DEFAULT_FORM_DATA: addMenu = {
  id: undefined,
  parentId: "",
  name: "",
  parentName: "",
  component: "Layouts",
  permission: "",
  type: 0,
  path: "",
  routeName: "",
  sort: 1,
  hasLink: 0,
  icon: "ep:menu",
  redirect: "",
  visible: 1
}
const formData = ref<addMenu>(cloneDeep(DEFAULT_FORM_DATA))
const dialogConfig = ref<"add" | "edit">("add")

// 表单验证规则
const formRules = {
  component: [{ required: true, message: "组件不能为空", trigger: "change" }],
  path: [{ required: true, message: "路径不能为空", trigger: "change" }],
  routeName: [{ required: true, message: "名称不能为空", trigger: "change" }],
  name: [{ required: true, message: "名称不能为空", trigger: "change" }],
  permission: [{ required: true, message: "名称不能为空", trigger: "change" }]
}

// 初始化
async function getApi() {
  const params = {
    name: ""
  }
  loading.value = true
  const { data, success } = await getMenuPageApi(params)
  loading.value = false
  if (!success) return
  tableData.value = data
}

// 增
function handleAdd(type: string, row?: MenuItem) {
  dialogVisible.value = true
  dialogConfig.value = "add"
  // 重置 formData 为默认值
  formData.value = cloneDeep(DEFAULT_FORM_DATA)

  if (row && row.id && type === "addChildren") {
    formData.value.parentId = row.id
    formData.value.parentName = row.name
    formData.value.component = ""
  }
}

// 改
function handleUpdate(row: MenuItem) {
  dialogVisible.value = true
  dialogConfig.value = "edit"
  formData.value = cloneDeep(row)
}

// 提交
async function handleSubmit(configType: string) {
  console.log("提交的路由数据:", formData.value)
  if (configType === "add") {
    const res = await addRoutMenu(formData.value)
    if (res.success) console.log("新增成功")
  } else {
    const res = await updateMenu(formData.value)
    console.log(res)
  }
  dialogVisible.value = false
}

// 删
async function handleDelete(row: MenuItem) {
  const params = {
    menuId: row.id
  }
  ElMessageBox.confirm(`正在删除用户：${row.name}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteMenu(params).then(() => {
      ElMessage.success("删除成功")
      getApi()
    })
  })
  await deleteMenu(params)
}

onMounted(() => {
  getApi()
})
</script>
<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 20px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}
</style>
