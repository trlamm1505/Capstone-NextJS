import type { Pagination } from "./Pagination";

export type LocationForm = {
  tenViTri: string;
  tinhThanh: string;
  quocGia: string;
  hinhAnh: string;
};

export type Location = LocationForm & {
  id: number;
};

export interface LocationsAPIResponse<T> {
  content: T;
  statusCode: number;
  dateTime: string;
  message?: string;
}

export interface LocationsPaginatedResponse {
  statusCode: number;
  content: Pagination & {
    data: Location[];
  };
  dateTime: string;
}