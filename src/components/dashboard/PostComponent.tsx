import { Post } from "@/lib/types";
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import Image from "next/image";
import CommentsComponent from "./CommentsComponent";

export default function PostComponent({ post, user_uuid, mutate }: { post: Post, user_uuid: string, mutate: () => void }) {
    return (
        <Card className=" w-full border-2 border-slate-400/50 text-regal-blue" shadow="none">
            <CardHeader className="flex gap-3">
                <Image
                    alt="heroui logo"
                    height={40}
                    src='/images/defaultpfp.jpg'
                    width={40}
                    className=" rounded-full"
                />
                <div className="flex flex-col w-full">
                    <p className="text-md">{post.user_uuid == user_uuid ? 'Yo' : post.creator?.name}</p>
                    <div className=" flex justify-between w-full">
                        <p className="text-small text-default-500 opacity-70">{post.user_uuid == user_uuid ? '' : post.creator?.email}</p>
                        <p className="text-small text-default-500 opacity-50">{new Date(post.created_at).toLocaleString()}</p>
                    </div>
                </div>
            </CardHeader>
            <Divider />
            <CardBody>
                <p className="font-semibold">{post.name}</p>
                <p className="font-normal opacity-60">{post.description}</p>
                <Divider className=" my-4"/>
                <p className="font-normal">Comentarios:</p>
                <div className=" mt-2">
                    <CommentsComponent comments={post.comments}post_uuid={post.uuid} mutate={mutate}/>
                </div>
            </CardBody>

        </Card>
    )
}
