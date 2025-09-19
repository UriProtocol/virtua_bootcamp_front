'use client'

import React from 'react'
import { Inter } from 'next/font/google';
import axios from '@/lib/axios';
import { toast } from 'sonner';
import useSWR from 'swr';
import { useAuth } from '@/hooks/auth';
import { Spinner } from '@nextui-org/react';
import PostComponent from '../dashboard/PostComponent';
import { Post } from '@/lib/types';
import NewPostComponent from '../dashboard/NewPostComponent';
import SearchComponent from '../misc/SearchComponent';
import { useSearchParams } from 'next/navigation';
import PaginationComponent from '../misc/PaginationComponent';

export const inter = Inter({ subsets: ['latin'] });

async function fetcher([endpoint, user_uuid, search, perPage, page]: [string, string | undefined, string, string, string]) {

  try {

    if (!user_uuid) {
      throw new Error("No se pasó una ID de usuario");
    }

    return await axios.get(`${endpoint}/${user_uuid}`, {params: {search, perPage, page}})
  } catch (error) {
    console.error(error)
    toast.error('Hubo un error al obtener los datos de los posts')
    return null
  }
}

export default function Posts() {

  const { user } = useAuth({ middleware: 'auth' })

  const searchParams = useSearchParams()

  const search = searchParams.get('query') || ''
  const perPage = searchParams.get('perPage') || ''
  const page = searchParams.get('page') || ''


  const { data: posts, isLoading, mutate } = useSWR([`/api/posts`, user?.uuid, search, perPage, page], fetcher)

  console.log(posts?.data)

  return (
    <div className='flex flex-col gap-4'>
      <h1 className={`${inter.className} text-3xl font-semibold text-regal-blue`}>Mis Posts</h1>
      <SearchComponent />
      <PaginationComponent data={posts?.data}>
        {
          isLoading ?
            <Spinner className=' mt-4' color='default' size='lg' />
            : posts?.data?.data?.length
              ? posts.data.data.map((post: Post) => <PostComponent key={post.uuid} post={post} user_uuid={user?.uuid || ''}/>)
              : (
                <div className=' w-full border-4 rounded-lg bg-slate-400/5 text-slate-400/50 border-slate-400/50 border-dashed flex justify-center items-center p-8'>
                  No hay posts para mostrar
                </div>
              )
        }
      </PaginationComponent>
      <NewPostComponent mutate={mutate}/>
    </div>
  )
}
