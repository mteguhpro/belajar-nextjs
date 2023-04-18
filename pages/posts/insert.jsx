import Layout from "../../components/layout"
import instanceAxios from "../../axios/instance"
import useSWRMutation from 'swr/mutation'
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

export default function Insert() {
    const router = useRouter()
    //POST
    async function sendReq(url, data){
        const post = await instanceAxios.post(url, data?.arg).then(res => res.data)
            .catch(function(err){
                toast.error('Error '+ err.response.status + ' | ' +err.response.data.message)
            })
        console.log(url, data)
        if(post?.title){
            toast.success(post?.id + ' - Sukses insert '+post?.title)
            router.push('/posts')
        }
    }
    const address = 'auth/posts/add';
    const { trigger, isMutating } = useSWRMutation(address, sendReq)
    
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = data => trigger(data)
    //END POST

    return (
        <>
            <h1 className="text-2xl font-bold leading-7 text-gray-900">Insert Post Data</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xs">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">User ID:</span>
                    </label>
                    <input {...register("userId", { required: true })} 
                    type="text" className="input input-bordered" />
                    {errors.userId?.type === 'required' && <span className="text-red-600">This field is required</span>}
                </div>
                
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Title:</span>
                    </label>
                    <input {...register("title", { required: true })} 
                    type="text" placeholder="Title" className="input input-bordered" />
                    {errors.title?.type === 'required' && <span className="text-red-600">This field is required</span>}
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Body:</span>
                    </label>
                    <textarea className="textarea textarea-bordered h-44" {...register("body")}/>
                </div>

                {isMutating ? 'Sending...' : <input className="btn btn-sm m-2" type="submit" />}
            </form>
        </>
    )
}
Insert.layout = Layout
