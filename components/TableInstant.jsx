import { useMemo } from 'react'

import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from '@tanstack/react-table'

//referensi contoh: https://github.com/TanStack/table/blob/main/examples/react/pagination-controlled/src/main.tsx

export default function TableInstant({
    data,
    columns,
    pageIndex,
    pageSize,
    pageCount,
    setPagination,
    sorting,
    setSorting,
    isLoading,
    isValidating,
}) {
    const pagination = useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    )

    const table = useReactTable({
        data,
        columns,
        pageCount: pageCount ?? -1,
        state: {
            pagination,
            sorting,
        },
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        // getPaginationRowModel: getPaginationRowModel(), // If only doing manual pagination, you don't need this
        debugTable: true,
    })


    return (<>
        {isLoading ? <div>Loading...</div> : (isValidating ? <div>Validating...</div> : null)}
        <div className="overflow-x-auto">
            <table className="table table-zebra table-compact border-collapse w-full">
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => {
                                return (
                                    <th key={header.id} colSpan={header.colSpan}>
                                        {header.isPlaceholder ? null : (
                                            <div
                                                {...{
                                                    className: header.column.getCanSort()
                                                        ? 'cursor-pointer select-none'
                                                        : '',
                                                    onClick: header.column.getToggleSortingHandler(),
                                                }}
                                            >
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                                {{
                                                    asc: ' ↓',
                                                    desc: ' ↑',
                                                }[header.column.getIsSorted()] ?? null}
                                            </div>
                                        )}
                                    </th>
                                )
                            })}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => {
                        return (
                            <tr key={row.id}>
                                {row.getVisibleCells().map((cell, i) => {
                                    const isi = flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )
                                    if(i == 0){
                                        return (
                                            <th key={cell.id} className="border-slate-200">
                                                {isi}
                                            </th>
                                        )
                                    }
                                    return (
                                        <td key={cell.id} className="border-l border-slate-200">
                                            {isi}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
        <div className="h-2" />
        <div className="flex flex-row flex-wrap">
            <div className="basis-full md:basis-1/3">
                <button
                    className="btn btn-sm mx-1"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'<<'}
                </button>
                <button
                    className="btn btn-sm mx-1"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'<'}
                </button>
                <button
                    className="btn btn-sm mx-1"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    {'>'}
                </button>
                <button
                    className="btn btn-sm mx-1"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                >
                    {'>>'}
                </button>
            </div>
            <div className="basis-full md:basis-2/3">
                <span className="">
                    Page&nbsp;
                    <strong>
                        {table.getState().pagination.pageIndex + 1} of{' '}
                        {table.getPageCount()}
                    </strong>
                </span>
                <span className="">
                    &nbsp;| Go to page:
                    <input
                        type="number"
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            table.setPageIndex(page)
                        }}
                        className="input input-bordered input-sm w-16 mx-1"
                    />
                </span>
                <select
                    value={table.getState().pagination.pageSize}
                    onChange={e => {
                        table.setPageSize(Number(e.target.value))
                    }}
                    className="select select-bordered select-sm mx-1"
                >
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </div>
        {isLoading ? <div>Loading...</div> : (isValidating ? <div>Validating...</div> : null)}
        {/* <div>{table.getRowModel().rows.length} Rows</div> */}
        {/* <pre>{JSON.stringify(pagination, null, 2)}</pre> */}
        {/* <pre>{JSON.stringify(sorting, null, 2)}</pre> */}
    </>)
}
