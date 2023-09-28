"use client"

import useSWR from 'swr'
import instanceAxios from '@/axios/instance'
import { useSearchParams } from 'next/navigation'

export default function Detail() {
    const searchParams = useSearchParams()
    const id = searchParams.get('id')
    const address = 'auth/users/' + id;
    const fetcher = (url) => instanceAxios.get(url).then(res => res.data)
    const { data, error } = useSWR(address, fetcher);

    if (error) {
        return <p>Loading failed...</p>;
    }
    if (!data) {
        return <h1>Loading...</h1>;
    }
    return (
        <div className='flex flex-row justify-center'>
            <div className="card w-96 bg-base-200 shadow-xl border ">
                <figure className="px-10 pt-10">
                    <img src={data.image} alt={data.firstName} className="rounded-xl" />
                </figure>
                <div className="card-body items-center text-center">
                    <h2 className="card-title">{data.firstName + ' ' + data.lastName}</h2>
                    {data.username}<br/>
                    {data.email}<br/>
                    {data.domain}<br/>
                    {data.phone}<br/>
                </div>
            </div>
        </div>
    )

}