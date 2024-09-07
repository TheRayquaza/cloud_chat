import User from "../../src/db/user";
import ConversationUser from "../../src/db/conversation_user";
import Conversation from "../../src/db/conversation";
import Message from "../../src/db/message";

import {expect, it} from "@jest/globals";
import {generate_conversation, generate_message, generate_user, get_token} from "../utils/utils";

let init: RequestInit = { method : "PUT", headers: { "Content-Type": "application/json" }},
    url : RequestInfo = "http://localhost:8080/api/message/",
    response : Response,
    json : any,
    user : User | null,
    conversation : Conversation | null,
    message : Message | null,
    token : string;

const username = "TEST_USER1234$";
const password = "TEST_PASSWORD1234$";


describe('DELETE /api/message/{id}', () => {

    beforeEach(async (): Promise<void> => {
        user = await generate_user(username, password, 1);
        token = await get_token(username, password);
        conversation = await generate_conversation('TEST_CONVERSATION', [user.dataValues.id as number], token);
        await conversation.add_user(user.dataValues.id as number);
        message = await generate_message(conversation.dataValues.id as number, user.dataValues.id as number, 'Test message', token);
        init = { method : "DELETE", headers : { "Content-Type" : "application/json", "Authorization" : "Bearer " + token}};
    });

    afterEach(async (): Promise<void> => {
        await Message.destroy({ where : { } });
        await ConversationUser.destroy({ where : { } });
        await Conversation.destroy({ where : { } });
        await User.destroy({ where : { } });
    });


    it('200 : delete the message and send a success response', async () => {
        if (message?.dataValues.id && conversation?.dataValues.id && user?.dataValues.id) {
            response = await fetch(url + message.dataValues.id.toString(), init);
            json = await response.json();

            expect(response.status).toEqual(200);
            expect(json).toEqual({
                success: true,
                status : 200
            });
        } else
            fail("something went wrong : message not found");
    });

    it('404 : the message does not exist', async () => {
        response = await fetch(url + '-1', init);
        json = await response.json();

        expect(response.status).toEqual(404);
        expect(json).toEqual({
            error: "Message not found",
            status : 404
        });
    });
});
