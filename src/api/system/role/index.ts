import { request } from "@/utils/service"
import type * as role from "./types/role"

/**
 * 获取所有角色
 */
export function getRolesApi(){
  return request<role.GetRolesApiResponse>({
    url: '/system/role/getRoles',
    method: 'post'
  });
}
