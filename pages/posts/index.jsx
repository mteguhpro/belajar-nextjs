import Link from "next/link";
import { createColumnHelper } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import useSWR from 'swr'
import axiosInstance from '../../axios/instance';
import Layout from '../../components/layout';
import TableInstant from '../../components/TableInstant';

export default function Posts() {
    return (
        <Layout>
            <div className="p-2">
                <Link href="/posts/insert" className="btn btn-sm">New Post</Link>
            </div>
            <ListData/>
        </Layout>
    )
}

function ListData() {
    const columnHelper = createColumnHelper()
    const columns = useMemo(() =>[
        columnHelper.accessor('id'),
        columnHelper.accessor('title',{
            cell: info => <Link href={"/posts/"+info.row.original.id} className="link">{info.getValue()}</Link>,
        }),
    ], [])

    const [{ pageIndex, pageSize }, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })

    const fetcher = (url) => axiosInstance.get(url).then(res => res.data)
    const address = 'posts?limit='+pageSize+'&skip='+(pageIndex*pageSize);
    const { data:dataGet, error, isLoading } = useSWR(address, fetcher);

    if (error){
        return <p>Loading failed...</p>;
    }

    const dataList = dataGet?.posts ? dataGet.posts : [];

    return <TableInstant
        data={dataList} 
        columns={columns}
        setPagination={setPagination}
        isFetching={isLoading}
        pageCount={dataGet?.total && Math.ceil(dataGet.total / pageSize)}
        pageSize = {pageSize}
        pageIndex = {pageIndex}
    />
}

