"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import useSidebarStore from "../../zustand/sidebar"
import { useRouter } from "next/navigation";

function logout(){
    window.localStorage.removeItem("jwtToken")
    window.location.href = '/login'
}

function Navbar() {
    const toggle = useSidebarStore((state) => state.toggle)

    return (
        <div className="navbar bg-slate-100 drop-shadow-md sticky top-0 z-20">
            <div className="flex-none">
                <button onClick={toggle} className="btn btn-square btn-ghost">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button>
            </div>
            <div className="flex-1">
                <a className="btn btn-ghost normal-case text-xl">Dashboard</a>
            </div>
            <div className="flex-none">
                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-square btn-ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
                    </label>
                    <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                        <li><button onClick={logout}>Logout</button></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

function ListIcon(props){
    const {isActive, toggle} = useSidebarStore((state) => state)
    const handleClick = function(){
        if(!(window.innerWidth >= 768) && isActive){
            toggle()
        }
    }
    return(
        <li>
            <Link href={props.href} onClick={handleClick}>
                {props.children}
                {isActive && props.info}
            </Link>
        </li>
    )
}

function SidebarMenu() {    
    return (
        <ul className="menu p-1">
            <ListIcon href="/" info="Home">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            </ListIcon>
            <ListIcon href="/posts" info="Posts">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-earmark-post-fill" viewBox="0 0 16 16">
                    <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zm-5-.5H7a.5.5 0 0 1 0 1H4.5a.5.5 0 0 1 0-1zm0 3h7a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5z"/>
                </svg>
            </ListIcon>
            <ListIcon href="/users" info="Users">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-people-fill" viewBox="0 0 16 16">
                    <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
                </svg>
            </ListIcon>
            <ListIcon href="/products" info="Products">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bag" viewBox="0 0 16 16">
                    <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
                </svg>
            </ListIcon>
        </ul>
    )
}


export default function Layout({ children }) {
    const { isActive, toggle, setActive } = useSidebarStore((state) => state)
    const router = useRouter()

    const [login, setLogin] = useState(false)

    useEffect(function() {
        if(!window.localStorage.getItem("jwtToken")){
            router.push('/login')
        }else{
            setLogin(true)
        }
        setActive(window.innerWidth >= 768)
    }, [])

    if(!login){
        return (
            <div className="m-2">
                <h1 className="text-2xl">Belum login</h1>
                <p>Silahkan login terlebih dahulu</p>
                <Link href="/login" className="btn btn-sm">Login</Link>
            </div>
        )
    }
    
    let sidebarClass = 'bg-gray-900 text-slate-50 h-screen overflow-x-auto fixed z-30 w-full '
    sidebarClass += isActive ? 'sm:w-64' : 'sm:w-16 hidden sm:block'

    let contentClass = 'w-full '
    contentClass += isActive ? 'sm:pl-64' : 'sm:pl-16'

    let footerClass = 'mt-auto '
    footerClass += isActive ? 'sm:pl-64' : 'sm:pl-16'

    return (
        <div className="flex flex-col min-h-screen">
            <div className={sidebarClass}>

                <button onClick={toggle} className="btn btn-square btn-sm fixed right-0 z-10 m-1 sm:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <SidebarMenu/>

            </div>

            <div className={contentClass}>
                <Navbar/>
                <div className="m-2">
                    {children}
                </div>
            </div>

            <div className={footerClass}>
                {/* <Footer/> */}
            </div>

        </div>
    )
}