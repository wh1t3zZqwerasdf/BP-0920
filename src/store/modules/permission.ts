import { ref } from "vue"
import store from "@/store"
import { defineStore } from "pinia"
import { type RouteRecordRaw } from "vue-router"
import { constantRoutes } from "@/router"
import { flatMultiLevelRoutes } from "@/router/helper"
import routeSettings from "@/config/route"
import { useRouteStore } from "@/store/modules/routeStore"
const Layouts = () => import("@/layouts/index.vue")


const hasPermission = (roles: string[], route: RouteRecordRaw) => {
  const routeRoles = route.meta?.roles
  return routeRoles ? roles.some((role) => routeRoles.includes(role)) : true
}

const filterDynamicRoutes = (routes: RouteRecordRaw[], roles: string[]) => {
  const res: RouteRecordRaw[] = []
  routes.forEach((route) => {
    const tempRoute = { ...route }
    if (hasPermission(roles, tempRoute)) {
      if (tempRoute.children) {
        tempRoute.children = filterDynamicRoutes(tempRoute.children, roles)
      }
      res.push(tempRoute)
    }
  })
  return res
}


// 转换函数
const convertRoutes = (routes: RouteRecordRaw[]): RouteRecordRaw[] => {
  return routes.map(route => {
    const tempRoute = { ...route } as RouteRecordRaw & { component?: any };

    // 处理 component 字段
    if (typeof tempRoute.component === 'string') {
      if (tempRoute.component === "Layouts") {
        tempRoute.component = Layouts;
      } else {
        const componentPath = tempRoute.component.replace(/^@/, '/src'); // 替换路径前缀
        tempRoute.component = () => import(`${componentPath}`); // 动态导入
      }
    }

    // 递归处理子路由
    if (tempRoute.children) {
      tempRoute.children = convertRoutes(tempRoute.children);
    }

    return tempRoute;
  });
};

export const usePermissionStore = defineStore("permission", () => {
  /** 可访问的路由 */
  const routes = ref<RouteRecordRaw[]>([])
  /** 有访问权限的动态路由 */
  const addRoutes = ref<RouteRecordRaw[]>([])

  const routeStore = useRouteStore()

  /** 根据角色生成可访问的 Routes（可访问的路由 = 常驻路由 + 有访问权限的动态路由） */
  const setRoutes = (roles: string[]) => {
    const accessedRoutes = convertRoutes(routeStore.dynamicRoutes)
    console.log(accessedRoutes)
    _set(accessedRoutes)
  }

  /** 所有路由 = 所有常驻路由 + 所有动态路由 */
  const setAllRoutes = () => {
    _set(routeStore.dynamicRoutes)
  }

  const _set = (accessedRoutes: RouteRecordRaw[]) => {
    routes.value = constantRoutes.concat(accessedRoutes)
    addRoutes.value = routeSettings.thirdLevelRouteCache ? flatMultiLevelRoutes(accessedRoutes) : accessedRoutes
  }

  return { routes, addRoutes, setRoutes, setAllRoutes }
})

/** 在 setup 外使用 */
export function usePermissionStoreHook() {
  return usePermissionStore(store)
}
