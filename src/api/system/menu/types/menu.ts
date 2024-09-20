// 定义请求参数的类型
export interface MenuPageRequestData {
  name: string;     // 菜单名称（可选）
}


// 定义菜单项的类型
export interface MenuItem {
  id: string;          // 菜单项 ID
  parentId: string;    // 父级 ID
  orgId: number;       // 组织 ID
  name: string;        // 菜单名称
  parentName: string;  // 父级名称
  component: string;   // 组件名称
  permission: string;  // 权限
  type: number;        // 类型
  path: string;        // 路径
  routeName: string;   // 路由名称
  icon: string;        // 图标
  sort: number;        // 排序
  hasLink: number;     // 是否有链接
  visible: number;     // 是否可见
  createTime: string;  // 创建时间
  updateTime: string;  // 更新时间
  creator: string;     // 创建者
  updater: string;     // 更新者
  deleted: number;     // 是否删除
}

// 定义响应数据的类型
export interface MenuPageResponseData {
  success: boolean;    // 请求是否成功
  code: number;        // 响应码
  message: string;     // 响应消息
  data: MenuItem[]     // 菜单项列表
}

// 新增路由 子路由 编辑
export interface addMenu {
  id?: string;                  // ID，字符串类型
  parentId: string;           // 父级 ID，字符串类型
  name: string;                // 名称，字符串类型
  icon: string;                // 图标，字符串类型
  parentName: string;          // 父级名称，字符串类型
  component: string;           // 组件，字符串类型
  permission: string;          // 权限，字符串类型
  type: number;                // 类型，数字类型
  path: string;                // 路径，字符串类型
  redirect?: string;            // 重定向，字符串类型
  routeName: string;           // 路由跳转名称，字符串类型
  sort: number;                // 排序，数字类型
  hasLink: number;             // 是否有链接，数字类型
  visible: number;             // 是否可见，数字类型
  version?: number;             // 版本，数字类型
}


// 删除路由
export interface DeleteMenuParams {
  menuId: string;
}
