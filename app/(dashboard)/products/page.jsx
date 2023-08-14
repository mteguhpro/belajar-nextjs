"use client"

import { createColumnHelper } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import useSWR from 'swr'
import instanceAxios from '../../../axios/instance';
import TableInstant from '../../../components/TableInstant';
import Select from 'react-select';

export default function Products() {
    const [category, setCategory] = useState('')
    const columnHelper = createColumnHelper()
    const columns = useMemo(() =>[
        columnHelper.accessor('id'),
        columnHelper.accessor('title'),
        columnHelper.accessor('thumbnail', {
            cell: info => <img className="w-14" src={info.getValue()} alt={info.row.original.title} loading="lazy"/>,
        }),
    ], [])

    const [{ pageIndex, pageSize }, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })
    const [sorting, setSorting] = useState([])

    const fetcher = (url) => instanceAxios.get(url).then(res => res.data)
    let address = 'auth/products';
    if(category){
        address += '/category/' + category
    }

    address += '?limit='+pageSize+'&skip='+(pageIndex*pageSize);
    
    const { data:dataGet, error, isLoading, isValidating } = useSWR(address, fetcher);

    const addressCategory = 'auth/products/categories'
    const { data:dataSelect } = useSWR(addressCategory, fetcher);

    const optionSelect = dataSelect?.map(data => ({
        value : data,
        label : data,
    }));

    if (error){
        return <p>Loading failed...</p>;
    }

    const dataList = dataGet?.products ? dataGet.products : [];

    return <>
        <form className="w-full">
            <div className="form-control sm:w-64">
                {dataSelect ? <Select isClearable onChange={(data)=>setCategory(data?.value)} options={optionSelect} className="z-[12]"/> : 'Loading...'}
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

