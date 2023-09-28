"use client"

import instanceAxios from "@/axios/instance";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation"
import useSWRMutation from 'swr/mutation'
import useSWR from 'swr'
import { toast } from "react-toastify";

export default function Edit(){
    const searchParams = useSearchParams()
    const id = searchParams.get('id')
    const router = useRouter()

    //PUT
    async function sendReq(url, data){
        const post = await instanceAxios.put(url, data?.arg).then(res => res.data)
        console.log(url, data)
        if(post?.title){
            toast.success('sukses mengupdate '+post?.title)
            router.push('/posts/detail?id='+id)
        }
    }
    const urlPut = 'auth/posts/'+id;
    const { trigger, isMutating } = useSWRMutation(urlPut, sendReq)
    
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = data => trigger(data)
    //END PUT
    
    //GET
    const fetcher = (url) => instanceAxios.get(url).then(res => res.data)
    const address = 'auth/posts/' + id;
    const { data, error } = useSWR(address, fetcher);
    if (error){
        return <p>Loading failed...</p>;
    }
    if (!data){
        return <h1>Loading...</h1>;
    }
    //END GET

    return (
        <>
            <h1 className="text-2xl font-bold leading-7 text-gray-900">Edit</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xs">                
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Title:</span>
                    </label>
                    <input defaultValue={data?.title} {...register("title", { required: true })} 
                    type="text" placeholder="Title" className="input input-bordered" />
                    {errors.title?.type === 'required' && <span className="text-red-600">This field is required</span>}
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Body:</span>
                    </label>
                    <textarea className="textarea textarea-bordered h-44" 
                        defaultValue={data?.body} {...register("body")}/>
                </div>

                {isMutating ? 'Updating...' : <input className="btn btn-sm m-2" type="submit" />}
            </form>
        </>
    )
}