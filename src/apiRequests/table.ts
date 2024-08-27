import http from "../lib/http";
import {
	CreateTableBodyType,
	TableListResType,
	TableResType,
	UpdateTableBodyType,
} from "../schemaValidations/table.schema";

const tableApiRequest = {
	list: () => http.get<TableListResType>("/tables"),
	add: (body: CreateTableBodyType) => http.post<TableResType>("/tables", body),
	updateTable: (id: number, body: UpdateTableBodyType) =>
		http.put<TableResType>(`/tables/${id}`, body),
	getTable: (id: number) => http.get<TableResType>(`/tables/${id}`),
	deleteTable: (id: number) => http.delete<TableResType>(`/tables/${id}`),
};

export default tableApiRequest;
