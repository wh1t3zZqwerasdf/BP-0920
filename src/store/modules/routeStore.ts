import { defineStore } from 'pinia';
import store from "@/store"
import { RouteRecordRaw } from 'vue-router';

export const useRouteStore = defineStore('route', {
  state: () => ({
    dynamicRoutes: [] as RouteRecordRaw[]
  }),
  actions: {
    setDynamicRoutes(routes:RouteRecordRaw[]) {
      this.dynamicRoutes = routes;
    }
  },
  persist: true,
});

/** 在 setup 外使用 */
export function useUserStoreHook() {
  return useRouteStore(store)
}
