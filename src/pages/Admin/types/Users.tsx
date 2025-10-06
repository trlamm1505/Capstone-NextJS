export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string | null;
  birthday: string;
  avatar?: string | null;
  gender: boolean;
  role: 'ADMIN' | 'USER' | string;
}

export type RawUserAPI = {
  name: string;
  email: string;
  password: string;
  phone: string | null;
  birthday: string;
  avatar?: string | null;
  gender: boolean;
  role: 'ADMIN' | 'USER' | string;
};

export type UserType = {
   code: string;
    name: string;
}

export const UserTypeValue:UserType[] = [
  {
    code: "USER",
    name: "Người dùng"
  },
  {
    code: "ADMIN",
    name: "Quản trị"
  }
]

export interface UsersAPIResponse<T> {
  content: T;
  statusCode: number;
  dateTime: string;
  message?: string;
}

export type UserForm = {
  name: string;
  password: string;
  email: string;
  phone: string;
  birthday: string;
  avatar?: string;
  gender: boolean;
  role: 'ADMIN' | 'USER' | string;
};

export type UserFormEdit = UserForm & {
  id: string;
};

export type UserAction = "themmoi" | "sua"| "chitiet" | string;