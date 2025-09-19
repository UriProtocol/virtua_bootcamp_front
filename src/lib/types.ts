export type Post = {
    uuid: string
    name: string
    description: string
    user_uuid: string
    creator: {
        name: string
        email: string
    }
    created_at: string
}
