import User from "../../src/db/user";
import {expect} from "@jest/globals";
import Conversation from "../../src/db/conversation";
import Message from "../../src/db/message";

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

export const generate_conversation = async (name : string, users_id : number[], token : string) : Promise<Conversation> => {
    let init : RequestInit = { method: "POST", headers: { "Content-Type": "application/json", "Authorization" : "Bearer " + token }};
    init.body = JSON.stringify({ name : name, users_id : users_id});

    let response : Response = await fetch("http://localhost:8080/api/conversation/", init);
    let json : any = await response.json();

    if (response.status != 201)
        throw new Error("unable to create conversation : " + json.error);

    let conversation = await Conversation.findByPk(json.id);
    if (!conversation)
        throw new Error("conversation not found");
    return conversation;
}

export const generate_message = async (conversation_id : number, user_id : number, content : string, token : string) : Promise<Message> => {
    let init : RequestInit = { method: "POST", headers: { "Content-Type": "application/json", "Authorization" : "Bearer " + token }};
    init.body = JSON.stringify({ conversation_id : conversation_id, user_id : user_id, content : content});

    let response : Response = await fetch("http://localhost:8080/api/message/", init);
    let json : any = await response.json();

    if (response.status != 201)
        throw new Error("something went wrong : " + json.error);

    let message = await Message.findByPk(json.id);
    if (!message)
        throw new Error("something went wrong : message not found");
    return message;
}

export const get_token = async (username : string, password : string) : Promise<string> => {
    let init : RequestInit = { method: "POST", headers: { "Content-Type": "application/json" }};
    init.body = JSON.stringify({ username : username, password : password});

    let response : Response = await fetch("http://localhost:8080/api/login", init);
    let json : any = await response.json();

    return json.token;
}