
export type user = {
    id: number,
    username: string
}

export const transform_user = (user : any) : user => {
    return {
        id : user.id,
        username : user.username
    }
}

export default user;