import type { Pagination } from "./Pagination";

export type RoomFormData = {
  tenPhong: string;
  khach: number;
  phongNgu: number;
  giuong: number;
  phongTam: number;
  moTa: string;
  giaTien: number;
  mayGiat: boolean;
  banLa: boolean;
  tivi: boolean;
  dieuHoa: boolean;
  wifi: boolean;
  bep: boolean;
  doXe: boolean;
  hoBoi: boolean;
  banUi: boolean;
  maViTri: number;
  hinhAnh: string;
};

export type EditFormData = {
  id: any,
  data: RoomFormData
}
export type Room = {
  id: any;
  tenPhong: string;
  khach: number;
  phongNgu: number;
  giuong: number;
  phongTam: number;
  moTa: string;
  giaTien: number;
  mayGiat: boolean;
  banLa: boolean;
  tivi: boolean;
  dieuHoa: boolean;
  wifi: boolean;
  bep: boolean;
  doXe: boolean;
  hoBoi: boolean;
  banUi: boolean;
  maViTri: number;
  hinhAnh: string;
};

export type RoomState = {
  loading: boolean;
  room: Room | null;
  error: string | null;
}

export type RoomResponse = {
  statusCode: number;
  message: string;
  content: RoomFormData;
  dateTime: string
};

export type RoomPaginationResponse = {
  statusCode: number;
  content: Pagination & {data: Room[]};
  dateTime: string
};