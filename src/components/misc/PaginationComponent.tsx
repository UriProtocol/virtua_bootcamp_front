'use client'
import { Pagination } from '@nextui-org/react'
import { usePathname, useSearchParams } from 'next/navigation';
import React from 'react'

export default function PaginationComponent({ children, data }: { children: React.ReactNode, data: { per_page: number, last_page: number, total: number, data: any[] } }) {

    const searchParams = useSearchParams()
    const pathname = usePathname()

    function handlePageChange (newPage: number) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        window.history.pushState(null, "", `${pathname}?${params.toString()}`);
    }
    function onRowsPerPageChange (e: React.ChangeEvent<HTMLSelectElement>) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("perPage", e.target.value);
        params.set("page", "1");
        window.history.pushState(null, "", `${pathname}?${params.toString()}`);
    }

    const page = searchParams.get('page') || '1'

    return (
        <div className='flex flex-col gap-3'>
            <div className="flex justify-between items-center">
                <span className="text-default-400 text-small">
                    Mostrando{" "}
                    {data?.per_page < data?.data.length
                        ? data?.per_page
                        : data?.data.length}{" "}
                    de {data?.total}
                </span>
                <label className="flex items-center text-default-400 text-small">
                    Registros por página:
                    <select
                        className="bg-transparent outline-none text-default-400 text-small"
                        onChange={onRowsPerPageChange}
                        defaultValue={"5"}
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                    </select>
                </label>
            </div>
            {children}
            {
                (data?.last_page > 0) && (
                    <div className="flex w-full justify-center">
                        <Pagination
                            isCompact
                            showControls
                            showShadow
                            page={parseInt(page)}
                            total={data?.last_page}
                            onChange={handlePageChange}
                            color='default'
                        />
                    </div>
                )
            }
        </div>
    )
}
