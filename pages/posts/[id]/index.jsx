import axiosInstance from "../../../axios/instance";
import { useRouter } from "next/router"
import Layout from "../../../components/layout"
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import Link from "next/link";

export default function Post() {
    return (
        <Layout>
            <LoadData/>
        </Layout>
    )
}

function LoadData(){
    const router = useRouter()
    const { id } = router.query
    const address = 'posts/' + id;

    //DELETE
    async function sendReq(url){
        const result = await axiosInstance.delete(url).then(res => res.data)
            .catch(function(err){
                alert('Error '+ err.response.status + ' | ' +err.response.data.message)
            })
        console.log(url)
        if(result?.title){
            alert(result?.id + ' - Sukses Delete '+result?.title)
            router.push('/posts')
        }
    }
    const { trigger, isMutating } = useSWRMutation(address, sendReq)
    
    //END DELETE

    //GET
    const fetcher = (url) => axiosInstance.get(url).then(res => res.data)
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
        <Link className="btn btn-sm btn-warning mx-1" href={data.id+'/edit'}>Edit</Link>
        {isMutating ? 'deleting...' : <button className="btn btn-sm btn-error mx-1" 
        onClick={()=>confirm('Delete?') && trigger()}>Delete</button>}
    </>
}