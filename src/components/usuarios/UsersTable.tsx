
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Tooltip,
    Spinner,
    Pagination
} from '@nextui-org/react';

import useSWR from 'swr';
import axios from '@/lib/axios'
import Swal from 'sweetalert2'
import { toast } from 'sonner';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { usePathname } from "next/navigation";
import EditUser from './EditUser';

interface User {
    uuid: string;
    name: string;
    email: string;
    password: string;
}

type Props = {
    query: string;
    currentPage: number;
    searchParams: URLSearchParams;
    sort_by: string;
    setSort_by: any;
    sort_order: string;
    setSort_order: any;
    per_page: number;
    setPer_page: any;
};

export default function TableUsers({
    query,
    currentPage,
    searchParams,
    sort_by,
    setSort_by,
    sort_order,
    setSort_order,
    per_page,
    setPer_page,
}: Props) {
    const pathname = usePathname();
    const [page, setPage] = useState(currentPage);
    const [sortDescriptor, setSortDescriptor] = useState<{ column: string; direction: 'ascending' | 'descending' }>({ column: 'created_at', direction: 'descending' });

    const fetcher = () =>
        axios
            .post(`/api/users?page=${page}`, {
                search: query,
                sort_by: sort_by,
                sort_order: sort_order,
                per_page: per_page,
            })
            .then((res) => res.data);

    const { data, mutate, error } = useSWR([`/api/users?page=${page}`, query, sort_by, sort_order, per_page], fetcher, {
        onError: (err) => {
            console.error('Error fetching users:', err);
        }
    });

    useEffect(() => {
        // mutate();
        const newPage = 1;
        setPage(newPage);
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        window.history.pushState(null, "", `${pathname}?${params.toString()}`);
    }, [mutate, per_page]);

    const loadingState = !data ? "loading" : "idle";

    const pages = useMemo(() => {
        return data ? data.last_page : 0;
    }, [data]);

    const onRowsPerPageChange = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            setPer_page(Number(e.target.value));
        },
        []
    );

    const handleDelete = (user: User) => {
        Swal.fire({
            title: 'Advertencia',
            text: 'Desea elminar al usuario: ' + user.name,
            icon: 'warning',
            confirmButtonText: 'Confirmar',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonColor: "#d33",
        }).then((result) => {
            if (result.isConfirmed) {
                if (user) {
                    try {
                        axios
                            .delete(`/api/user/${user.uuid}`)
                            .then((res) => {
                                toast.success("Usuario eliminado correctamente");
                                mutate();
                            })
                            .catch((error) =>
                                toast.error("No se pudo eliminar el registro")
                            );

                    } catch (error) {
                        console.log(error)
                    }
                }
            } else if (result.isDenied) {

            }
        });
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        window.history.pushState(null, "", `${pathname}?${params.toString()}`);
    };

    const handleSortChange = (sortDescriptor: any) => {
        setSortDescriptor((prevSortDescriptor) => ({
            column: sortDescriptor.column,
            direction: prevSortDescriptor.direction === 'ascending' ? 'descending' : 'ascending'
        }));
        setSort_by(sortDescriptor.column);
        setSort_order(mapDirection(sortDescriptor.direction));
    };

    const mapDirection = (direction: string) => {
        if (direction === 'ascending') return 'asc';
        if (direction === 'descending') return 'desc';
        return direction;
    };

    const renderCell = useCallback((item: any, columnKey: any) => {
        const cellValue = item[columnKey];

        switch (columnKey) {
            case "actions":
                return (
                    <div className="relative flex items-right gap-2">
                        <EditUser
                            query={query}
                            page={page}
                            uuid={item.uuid}
                            user={item}
                            sort_by={sort_by}
                            sort_order={sort_order}
                            per_page={per_page} />
                            
                        <Tooltip color="danger" content="Eliminar usuario">
                            <span className="text-lg text-danger cursor-pointer active:opacity-50"
                                onClick={() => handleDelete(item)}>
                                <DeleteOutlineIcon
                                    color='warning' />
                            </span>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    },
        [mutate, page, query, per_page, sort_by, sort_order]
    );

    const columns = [
        { name: "Nombre", key: "name" },
        { name: "Correo", key: "email" },
        { name: "Acciones", key: "actions" },
    ];

    return (
        <>
            <Table
                aria-label="Usuarios"
                sortDescriptor={sortDescriptor}
                onSortChange={(sortDescriptor) => handleSortChange(sortDescriptor)}
                classNames={{
                    th: "bg-delta-green text-white",
                    wrapper: "shadow-none",

                }}
                topContent={
                    <div className="flex justify-between items-center">
                        <span className="text-default-400 text-small">
                            Mostrando{" "}
                            {data?.per_page < data?.data?.length
                                ? data?.per_page
                                : data?.data?.length}{" "}
                            de {data?.total}
                        </span>
                        <label className="flex items-center text-default-400 text-small">
                            Registros por página:
                            <select
                                className="bg-transparent outline-none text-default-400 text-small"
                                onChange={onRowsPerPageChange}
                            >
                                <option value="10">10</option>
                                <option value="15">15</option>
                                <option value="30">30</option>
                            </select>
                        </label>
                    </div>
                }
                bottomContent={
                    pages > 0 ? (
                        <div className="flex w-full justify-start">
                            <Pagination
                                isCompact
                                showControls
                                showShadow
                                color="default"
                                page={page}
                                total={pages}
                                onChange={handlePageChange}
                            />
                        </div>
                    ) : null
                }
            >
                <TableHeader columns={columns} >
                    {(column) => (
                        <TableColumn
                            key={column.key}
                            {...(column.key === "actions" && { width: '100' })}
                            {...(column.key !== "actions" && column.key !== "role" && column.key !== "relevant_name" && { allowsSorting: true })}
                            className='text-regal-blue'
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody
                    emptyContent={"No hay usuarios por mostrar"}
                    items={data ? data.data : []}
                    loadingContent={<Spinner
                        label="Cargando..."
                        color="default"
                    />}
                    loadingState={loadingState}
                >
                    {(item: any) => (
                        <TableRow key={item.uuid}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
}
