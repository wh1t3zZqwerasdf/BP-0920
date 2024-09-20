// 定义角色的类型
export interface Role {
  id: number;
  roleCode: string;
}

// 定义接口响应的类型
export interface GetRolesResponseData {
  code: number; // 响应码
  message: string; // 响应消息
  data: Role[]; // 角色数组
}


// 定义通用的 API 响应类型
export interface ApiResponseData<T> {
  code: number;
  message: string;
  data: T;
}

// 具体的响应类型
export type GetRolesApiResponse = ApiResponseData<Role[]>;
