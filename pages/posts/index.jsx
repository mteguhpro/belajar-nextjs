import Link from "next/link";
import { createColumnHelper } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import useSWR from 'swr'
import axiosInstance from '../../axios/instance';
import Layout from '../../components/layout';
import TableInstant from '../../components/TableInstant';
import { useForm } from "react-hook-form";

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
    const [search, setSearch] = useState('')
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
    const [sorting, setSorting] = useState([])

    const fetcher = (url) => axiosInstance.get(url).then(res => res.data)
    let address = 'posts';
    if(search){
        address += '/search?q='+search+'&limit='+pageSize+'&skip='+(pageIndex*pageSize);
    }else{
        address += '?limit='+pageSize+'&skip='+(pageIndex*pageSize);
    }
    const { data:dataGet, error, isLoading, isValidating } = useSWR(address, fetcher);

    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = data => setSearch(data?.search)

    if (error){
        return <p>Loading failed...</p>;
    }

    const dataList = dataGet?.posts ? dataGet.posts : [];

    return<>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xs">
            <div className="form-control my-1">
                <div className="input-group input-group-sm">
                    <input {...register("search")} type="text" placeholder="Search…" className="input input-bordered input-sm" />
                    <button className="btn btn-square btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </button>
                </div>
            </div>
        </form>
        <TableInstant
            data={dataList} 
            columns={columns}
            setPagination={setPagination}
            sorting={sorting}
            setSorting={setSorting}
            isLoading={isLoading}
            isValidating={isValidating}
            pageCount={dataGet?.total && Math.ceil(dataGet.total / pageSize)}
            pageSize = {pageSize}
            pageIndex = {pageIndex}
        />
    </> 
}

