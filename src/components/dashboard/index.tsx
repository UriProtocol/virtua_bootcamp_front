'use client'
import axios from '@/lib/axios';
import { Spinner } from '@nextui-org/react';
import { Inter } from 'next/font/google';
import { toast } from 'sonner';
import useSWR from 'swr';
import PostComponent from './PostComponent';
import { Post } from '@/lib/types';
import { useAuth } from '@/hooks/auth';
import SearchComponent from '../misc/SearchComponent';
import { useSearchParams } from 'next/navigation';
import PaginationComponent from '../misc/PaginationComponent';

export const inter = Inter({ subsets: ['latin'] });

async function fetcher([endpoint, page, perPage, search]: [string, string, string, string]) {
    try {
        return await axios.get(endpoint, { params: { perPage, search, page } })
    } catch (error) {
        console.error(error)
        toast.error('Hubo un error al obtener los datos de los posts')
        return null
    }
}

export default function Dashboard() {


    const searchParams = useSearchParams();

    const search = searchParams.get("query") || "";
    const page = searchParams.get('page') || '1'
    const perPage = searchParams.get('perPage') || '5'


    const { data: posts, isLoading, mutate } = useSWR(['/api/posts', page, perPage, search], fetcher)

    const { user } = useAuth({ middleware: 'auth' })

    return <div className='flex flex-col gap-4'>
        <h1 className={`${inter.className} text-regal-blue text-3xl font-semibold`}>Posts</h1>
        <SearchComponent />
        <PaginationComponent data={posts?.data}>
            {
                isLoading ?
                    <Spinner className=' mt-4' color='default' size='lg' />
                    : posts?.data?.data?.length
                        ? posts.data.data?.map((post: Post) => <PostComponent key={post.uuid} post={post} user_uuid={user?.uuid || ''} mutate={mutate} />)
                        : (
                            <div className=' w-full border-4 rounded-lg bg-slate-400/5 text-slate-400/50 border-slate-400/50 border-dashed flex justify-center items-center p-8'>
                                No hay posts para mostrar
                            </div>
                        )
            }
        </PaginationComponent>
    </div>
}