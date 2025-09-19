import { Post } from "@/lib/types";
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import Image from "next/image";

export default function PostComponent({ post, user_uuid }: { post: Post , user_uuid: string}) {
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
                <div className="flex flex-col">
                    <p className="text-md">{post.user_uuid == user_uuid ? 'Yo': post.creator?.name}</p>
                    <p className="text-small text-default-500 opacity-70">{post.user_uuid == user_uuid ? '': post.creator?.email}</p>
                </div>
            </CardHeader>
            <Divider />
            <CardBody>
                <p className="font-semibold">{post.name}</p>
                <p className="font-normal opacity-60">{post.description}</p>
            </CardBody>
            <Divider />
        </Card>
    )
}
