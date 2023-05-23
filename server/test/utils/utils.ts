import User from "../../src/db/user";
import {expect} from "@jest/globals";

const generate_random_username = (length : number) : string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let username = '';

    while (username.length <= length) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        username += characters.charAt(randomIndex);
    }
    return username;
}

const generate_random_password = () : string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = 'A$1';

    while (password.length <= 20) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters.charAt(randomIndex);
    }
    return password;
}

export const generate_users = async (length : number) : Promise<User[]> => {
    let users : User[] = [];
    for (let i : number = 0; i < length; i++)
        users.push(await generate_user(generate_random_username(10), generate_random_password()));
    return users;
}

export const generate_user = async (username : string, password: string, permission : number = 0) : Promise<User> => {
    let init : RequestInit = { method: "POST", headers: { "Content-Type": "application/json" }};
    init.body = JSON.stringify({ username : username, password : password});

    let response : Response = await fetch("http://localhost:8080/api/register", init);
    let json : any = await response.json();

    if (response.status != 201)
        throw new Error("unable to create user : " + json.error);

    let user = await User.findByPk(json.id);
    if (!user)
        throw new Error("user not found");
    else {
        user.setDataValue("permission", permission);
        await user.save();
    }

    return user;
}

export const get_token = async (username : string, password : string) : Promise<string> => {
    let init : RequestInit = { method: "POST", headers: { "Content-Type": "application/json" }};
    init.body = JSON.stringify({ username : username, password : password});

    let response : Response = await fetch("http://localhost:8080/api/login", init);
    let json : any = await response.json();

    return json.token;
}