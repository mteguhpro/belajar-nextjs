import instanceAxios from "../axios/instance"
import useSWRMutation from 'swr/mutation'
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from 'react-toastify';

export default function Login() {
    const router = useRouter()

    useEffect(function () {
        if (window.localStorage.getItem("jwtToken")) {
            router.push('/')
        }
    }, [])
    //POST
    async function sendReq(url, data) {
        const post = await instanceAxios.post(url, data?.arg).then(res => res.data)
            .catch(function (err) {
                toast.error('Error ' + err.response.status + ' | ' + err.response.data.message)
            })
        if (post?.token) {
            window.localStorage.setItem("jwtToken", post.token)
            toast.success('Selamat datang, ' + post?.username)
            router.push('/')
        } else {
            toast.error('Gagal Login. Token tidak ditemukan.')
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

                    <div className="alert shadow-lg">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span>
                                <b className="text-bold">Tips: </b>Anda bisa menggunakan akun berikut untuk kebutuhan demo,
                                <br/>
                                username: <code>atuny0</code> password: <code>9uQFF1Lh</code>
                            </span>
                        </div>
                    </div>
                    <div className="alert alert-warning shadow-lg mt-2">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            <span>
                                <b className="text-bold">Peringatan: </b>Ini adalah web demo. Insert data, Update data dan Delete data Tidak akan mengubah data pada server!
                            </span>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    )
}