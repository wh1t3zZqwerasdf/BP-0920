import { request } from "@/utils/service"
import type * as menu from "./types/menu"

/** 新增路由菜单 */
export function addRoutMenu(data:any) {
  return request<any>({
    url: "/system/menu/create",
    method: "post",
    data
  })
}

/** 获取路由列表  */
export function getMenuPageApi(data: menu.MenuPageRequestData){
  return request<menu.MenuPageResponseData>({
    url: '/system/menu/list',
    method: 'post',
    data
  });
}

/** 更新路由信息 */
export function updateMenu(data: menu.addMenu) {
  return request<menu.addMenu>({
    url: '/system/menu/update',
    method: 'post',
    data
  });
}

/** 路由删除 */
export function deleteMenu(params:menu.DeleteMenuParams) {
  return request<menu.MenuPageResponseData>({
    url: '/system/menu/delete',
    method: 'get',
    params
  });
}
