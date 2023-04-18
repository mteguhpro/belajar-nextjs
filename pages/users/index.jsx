import { createColumnHelper } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import useSWR from 'swr'
import instanceAxios from '../../axios/instance';
import Layout from '../../components/layout';
import TableInstant from '../../components/TableInstant';
import Link from "next/link";

export default function Users(){
    return (
        <>
            <ListData/>
        </>
    )
}
Users.layout = Layout

function ListData() {
    const columnHelper = createColumnHelper()
    const columns = useMemo(() =>[
        columnHelper.accessor('id'),
        columnHelper.accessor('username'),
        columnHelper.accessor('firstName', {
            header: () => <span>First Name</span>,
        }),
        columnHelper.accessor('lastName', {
            header: () => <span>Last Name</span>,
        }),
        columnHelper.accessor('email'),
        columnHelper.accessor('phone'),
        columnHelper.accessor('gender'),
        columnHelper.accessor('aksi',{
            cell: info => <Link href={"/users/"+info.row.original.id} className="btn btn-sm btn-primary">Detail</Link>,
        }),
    ], [])

    const [{ pageIndex, pageSize }, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })

    const fetcher = (url) => instanceAxios.get(url).then(res => res.data)
    const address = 'auth/users?limit='+pageSize+'&skip='+(pageIndex*pageSize);
    const { data:dataGet, error, isLoading, isValidating } = useSWR(address, fetcher);

    if (error){
        return <p>Loading failed...</p>;
    }

    const dataList = dataGet?.users ? dataGet.users : [];

    return <TableInstant
        data={dataList} 
        columns={columns}
        setPagination={setPagination}
        isLoading={isLoading}
        isValidating={isValidating}
        pageCount={dataGet?.total && Math.ceil(dataGet.total / pageSize)}
        pageSize = {pageSize}
        pageIndex = {pageIndex}
    />
}
