"use client";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import SearchComponent from "../search-component";
import React, { useState } from 'react';
import { Button, useDisclosure } from "@nextui-org/react";
import TableUsers from "./UsersTable";
import { useSearchParams } from "next/navigation";
import CreateUser from "./CreateUser";


interface User {
    uuid: string;
    name: string;
    email: string;
    password: string;
}

export default function Users() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [per_page, setPer_page] = useState(10);
    const [sort_by, setSort_by] = useState<string>('created_at');
    const [sort_order, setSort_order] = useState<string>('desc');
    const searchParams = useSearchParams();
    const query = searchParams.get("query") || "";
    const page = Number(searchParams.get("page")) || 1;
    const title = "Usuarios";
    const description = "Listado de usuarios";

    return (
        <Card className={"m-5 bg-white grid-rows-3 gap-3 p-3"}>
            <CardHeader className="grid px-8">
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="font-normal">{description}</p>
            </CardHeader>
            <CardBody>
                <div className="grid grid-cols-1">
                    <div className="grid grid-col-1 lg:grid-cols-6 lg:justify-between gap-3">
                        <div className="grid lg:col-span-2 lg:justify-items-start gap-3">
                            <SearchComponent />
                        </div>
                        <div className="grid lg:grid-cols-subgrid lg:col-span-4 lg:justify-items-end gap-3">
                            <div className="lg:col-start-4">
                                <Button
                                    size="lg"
                                    className="bg-regal-blue text-white align-top mr-4"
                                    onPress={onOpen}
                                >
                                    Nuevo usuario
                                </Button>
                                <CreateUser
                                    isOpen={isOpen}
                                    onOpenChange={onOpenChange}
                                    query={query}
                                    page={page}
                                    sort_by={sort_by}
                                    sort_order={sort_order}
                                    per_page={per_page}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid mt-5">
                    <TableUsers
                        query={query}
                        currentPage={page}
                        searchParams={searchParams}
                        sort_by={sort_by}
                        setSort_by={setSort_by}
                        sort_order={sort_order}
                        setSort_order={setSort_order}
                        per_page={per_page}
                        setPer_page={setPer_page}
                    />
                </div>
            </CardBody>
        </Card>
    );
}
