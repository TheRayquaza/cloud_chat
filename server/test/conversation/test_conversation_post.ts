import User from '../../src/db/user';
import Conversation from "../../src/db/conversation";
import ConversationUser from "../../src/db/conversation_user";
import {expect} from "@jest/globals";
import {generate_user, generate_users, get_token} from "../utils/utils";


let init: RequestInit = { headers: { "Content-Type": "application/json" }},
    url : RequestInfo = "http://localhost:8080/api/conversation/",
    response : Response,
    json : any,
    user : User | null,
    token : string;

let user_list : User[] = [];

const username = "TEST_USER1234$";
const password = "TEST_PASSWORD1234$";
describe('POST /api/conversation/', () => {
    beforeEach(async (): Promise<void> => {
        user = await generate_user(username, password, 1);
        token = await get_token(username, password);
        init = { method: "POST", headers: {"Content-Type": "application/json", 'Authorization': 'Bearer ' + token}}
    });

    afterEach(async () : Promise<void> => {
        await ConversationUser.destroy({ where : { } });
        await Conversation.destroy({ where : { } });
        await User.destroy({ where : { } });
    });

    it('200 : create a new conversation and add users', async () => {
        init.body = JSON.stringify({ name : "default", users_id : user_list.map(user  => user.dataValues.id as number).concat(user?.dataValues.id as number)})
        response = await fetch(url, init);
        json = await response.json();

        expect(response.status).toEqual(200);
        expect(json).toEqual({
            id: expect.any(Number),
            name: expect.any(String),
            admin_id: expect.any(Number),
            creation_date: expect.any(String),
            edition_date: expect.any(String),
        });

        for (let i : number = 0; i < user_list.length; i++) {
            const conversation_user: ConversationUser  | null = await ConversationUser.findOne({
                where: {
                    user_id: user_list[i].dataValues.id as number,
                    conversation_id: json.id
                }
            });
            if (conversation_user && conversation_user.dataValues.user_id && conversation_user.dataValues.conversation_id) {
                expect(conversation_user.dataValues.user_id).toEqual(user_list[i].dataValues.id);
                expect(conversation_user.dataValues.conversation_id).toEqual(json.id);
            } else
                fail("something went wrong : conversation user not generated correctly");
        }
    });

    it('400 : missing parameters', async () => {
        init.body = "";
        response = await fetch(url, init);
        json = await response.json();

        expect(response.status).toEqual(400);
        expect(json).toEqual({
            error: 'Missing parameters',
            status: 400,
        });
    });

    it('404 : non-existing users', async () => {
        init.body = JSON.stringify({ name : "default", users_id : user_list.map((user) => user.dataValues.id).concat([-1])})
        response = await fetch(url, init);
        json = await response.json();

        expect(response.status).toEqual(404);
        expect(json).toEqual({
            error: 'One or multiple users do not exist',
            status: 404,
        });
    });
});
