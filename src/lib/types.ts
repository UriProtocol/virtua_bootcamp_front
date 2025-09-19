export type Post = {
    uuid: string
    name: string
    description: string
    user_uuid: string
    creator: {
        name: string
        email: string
    }
    comments: Comment[]
    created_at: string
}

export type Comment = {
    comment: string
    uuid: string
    created_at: string
    commented_by_uuid: string
}