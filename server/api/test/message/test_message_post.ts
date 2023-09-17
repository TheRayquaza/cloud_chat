import User from "../../../db/models/user";
import ConversationUser from "../../../db/models/conversation_user";
import Conversation from "../../../db/models/conversation";
import Message from "../../../db/models/message";

import {expect, it} from "@jest/globals";
import {generate_conversation, generate_user, get_token} from "../utils/utils";

let init: RequestInit = { method : "POST", headers: { "Content-Type": "application/json" }},
    url : RequestInfo = "http://localhost:8080/api/message/",
    response : Response,
    json : any,
    user : User | null,
    conversation : Conversation | null,
    token : string;

const username = "TEST_USER1234$";
const password = "TEST_PASSWORD1234$";

describe('POST /api/message/', () => {

    beforeEach(async (): Promise<void> => {
        user = await generate_user(username, password, 1);
        token = await get_token(username, password);
        conversation = await generate_conversation('TEST_CONVERSATION', [user.dataValues.id as number], token);
        await conversation.add_user(user.dataValues.id as number);
        init = { method : "POST", headers : { "Content-Type" : "application/json", "Authorization" : "Bearer " + token}};
    });

    afterEach(async (): Promise<void> => {
        await Message.destroy({ where : { } });
        await ConversationUser.destroy({ where : { } });
        await Conversation.destroy({ where : { } });
        await User.destroy({ where : { } });
    });

    it('201 : message is created successfully', async () => {
        if (user && conversation) {
            init.body = JSON.stringify({
                conversation_id: conversation.dataValues.id as number,
                user_id: user.dataValues.id as number,
                content: 'Test message',
            });

            response = await fetch(url, init);
            json = await response.json();

            expect(response.status).toEqual(201);
            expect(json).toEqual({
                id: expect.any(Number),
                conversation_id: conversation.dataValues.id,
                user_id: user.dataValues.id,
                content: 'Test message',
                creation_date: expect.any(String),
                edition_date: expect.any(String)
            });

            const message = await Message.findOne({where: {content: 'Test message'}});
            expect(message).not.toBeNull();

            const conversation_user = await ConversationUser.findOne({
                where: {
                    conversation_id: conversation.dataValues.id,
                    user_id: user.dataValues.id
                }
            });
            expect(conversation_user).not.toBeNull();

            conversation = await Conversation.findOne({where: {id: conversation.dataValues.id}});
            expect(conversation).not.toBeNull();
        } else
            fail("something went wrong : user or conversation is null");
    });

    it('400 : required parameters are missing', async () => {
        init.body = JSON.stringify({});

        response = await fetch(url, init);
        json = await response.json();

        expect(response.status).toEqual(400);
        expect(json).toEqual({
            error: 'Missing parameters',
            status: 400
        });
    });

    it('404 : conversation or user not found', async () => {
        init.body = JSON.stringify({
            conversation_id: 'nonexistent-conversation-id',
            user_id: 'nonexistent-user-id',
            content: 'Test message',
        });

        response = await fetch(url, init);
        json = await response.json();

        expect(response.status).toEqual(404);
        expect(json).toEqual({
            error: 'Conversation or user not found',
            status : 404
        });
    });

    it('404 : user is not in the conversation', async () => {
        if (user && conversation) {
            await conversation.remove_user(user.dataValues.id as number);
            init.body = JSON.stringify({
                conversation_id: conversation.dataValues.id as number,
                user_id: user.dataValues.id as number,
                content: 'Test message',
            });

            response = await fetch(url, init);
            json = await response.json();

            expect(response.status).toEqual(404);
            expect(json).toEqual({
                error: 'User not in conversation',
                status: 404
            });
        } else
            fail("something went wrong : user or conversation is null");
    });
});
