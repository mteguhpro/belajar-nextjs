"use client"

import instanceAxios from "../../../../axios/instance";
import { useRouter, useSearchParams } from "next/navigation"
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import Link from "next/link";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function Post(){
    const searchParams = useSearchParams()
    const id = searchParams.get('id')
    const router = useRouter()
    const address = 'auth/posts/' + id;

    function confirm() {
        Swal.fire({
            title: 'Delete?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
        }).then((result) => {
            if (result.isConfirmed) {
                trigger()
            }
        })
    }

    //DELETE
    async function sendReq(url){
        const result = await instanceAxios.delete(url).then(res => res.data)
            .catch(function(err){
                toast.error('Error '+ err.response.status + ' | ' +err.response.data.message)
            })
        console.log(url)
        if(result?.title){
            toast.success(result?.id + ' - Sukses Delete '+result?.title)
            router.push('/posts')
        }
    }
    const { trigger, isMutating } = useSWRMutation(address, sendReq)
    
    //END DELETE

    //GET
    const fetcher = (url) => instanceAxios.get(url).then(res => res.data)
    const { data, error } = useSWR(address, fetcher);

    if (error){
        return <p>Loading failed...</p>;
    }
    if (!data){
        return <h1>Loading...</h1>;
    }
    return <>
        <h1 className="text-2xl font-bold leading-7 text-gray-900">{data.title}</h1>
        <p className="my-5">{data.body}</p>
        <Link className="btn btn-sm btn-warning mx-1" href={{
                pathname : 'edit',
                query : {id:data.id},
            }}>Edit</Link>
        {isMutating ? 'deleting...' : <button className="btn btn-sm btn-error mx-1" 
        onClick={confirm}>Delete</button>}
    </>
}