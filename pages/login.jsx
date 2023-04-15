import instanceAxios from "../axios/instance"
import useSWRMutation from 'swr/mutation'
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Login() {
    const router = useRouter()

    useEffect(function() {
        if(window.localStorage.getItem("jwtToken")){
            router.push('/')
        }
    }, [])
    //POST
    async function sendReq(url, data){
        const post = await instanceAxios.post(url, data?.arg).then(res => res.data)
            .catch(function(err){
                alert('Error '+ err.response.status + ' | ' +err.response.data.message)
            })
        if(post?.token){
            window.localStorage.setItem("jwtToken", post.token)
            alert('Selamat datang, '+post?.username)
            router.push('/')
        }else{
            alert('Gagal Login. Token tidak ditemukan.')
        }
    }
    const address = 'auth/login';
    const { trigger, isMutating } = useSWRMutation(address, sendReq)
    
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = data => trigger(data)

    return (
        <div className="flex flex-row justify-center p-2">
            <div className="md:basis-96 grow md:grow-0 mt-9 p-4 bg-slate-50 rounded-md shadow-lg">
                <h1 className='text-4xl font-bold'>Login</h1>
                <form className='mt-4' onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Username:</span>
                        </label>
                        <input {...register("username")} required type="text" placeholder="Username" className="input input-bordered w-full" />
                    </div>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Password:</span>
                        </label>
                        <input {...register("password")} required type="password" placeholder="Password" className="input input-bordered w-full" />
                    </div>

                    <div className="form-control w-full">
                        {isMutating ? 'Loading...' : <button className="btn btn-sm my-3">Login</button>}
                    </div>

                    <div className="text-gray-500">
                        Demo username: <code>atuny0</code> password: <code>9uQFF1Lh</code>
                    </div>

                </form>
            </div>
        </div>
    )
}