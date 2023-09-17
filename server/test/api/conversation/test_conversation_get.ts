import User from '../../../src/db/models/user';
import Conversation from "../../../src/db/models/conversation";
import ConversationUser from "../../../src/db/models/conversation_user";
import Message from "../../../src/db/models/message";

import {expect} from "@jest/globals";
import {generate_message, generate_user, generate_conversation, get_token, generate_users} from "../utils/utils";

let init: RequestInit = { headers: { "Content-Type": "application/json" }},
    url : RequestInfo = "http://localhost:8080/api/conversation/",
    response : Response,
    json : any,
    user : User | null,
    token : string;

const username = "TEST_USER1234$";
const password = "TEST_PASSWORD1234$";

describe('GET /api/conversation', () => {
    beforeEach(async (): Promise<void> => {
        user = await generate_user(username, password, 1);
        token = await get_token(username, password);
        init = { method: "GET", headers: { "Content-Type": "application/json", "Authorization" : "Bearer " + token}};
    });

    afterEach(async () : Promise<void> => {
        await ConversationUser.destroy({ where: {} });
        await Conversation.destroy({ where: {} });
        await User.destroy({ where: {} });
    });

    describe("/{id}/message", () => {

        let conversation : Conversation | null;
        let message : Message | null;

        beforeEach(async () : Promise<void> => {
            if (user?.dataValues.id) {
                conversation = await generate_conversation("TEST_CONVERSATION", [user.dataValues.id as number], token);
                if (conversation?.dataValues.id)
                    message = await generate_message(conversation.dataValues.id, user.dataValues.id, "Test message", token);
                else
                    fail("something went wrong : conversation is null");
            } else
                fail("something went wrong : user is null")
        });

        afterEach(async () : Promise<void> => {
            await Message.destroy({ where: {} });
        })

        it ('200 : retrieve all messages from conversation', async () => {
            if (user?.dataValues.id && conversation?.dataValues.id) {
                response = await fetch(url + conversation.dataValues.id.toString() + "/message", init);
                expect(response.status).toEqual(200);

                json = await response.json();
                expect(json).toEqual([
                    {
                        id: message?.dataValues.id,
                        user_id : message?.dataValues.user_id,
                        content: message?.dataValues.content,
                        conversation_id: message?.dataValues.conversation_id,
                        creation_date: message?.dataValues.creation_date.toISOString(),
                        edition_date: message?.dataValues.edition_date.toISOString()
                    }
                ]);
            } else
                fail("something went wrong : user or conversation is null")
        });

        it("404 : conversation not found", async () => {
            response = await fetch(url + "-1" + "/message", init);
            json = await response.json();

            expect(response.status).toEqual(404);
            expect(json).toEqual({
                status: 404,
                error: "Conversation not found"
            });
        })
    });

    describe("/{id}/user", () => {

        let users : User[];
        let conversation : Conversation | null;

        beforeEach(async () : Promise<void> => {
            users = await generate_users(5);
            if (user?.dataValues.id)
                conversation = await generate_conversation("TEST_CONVERSATION", [user.dataValues.id as number].concat(users.map(user => user.dataValues.id as number)), token);
            else
                fail("something went wrong : user is null")
        });

        it('200 : retrieve all users from conversation', async () => {
            if (user?.dataValues.id && conversation?.dataValues.id) {
                response = await fetch(url + conversation.dataValues.id.toString() + "/user", init);
                json = await response.json();

                expect(response.status).toEqual(200);

                expect(json[0]).toEqual({
                    permission: user?.dataValues.permission,
                    username: user?.dataValues.username,
                    creation_date: user.dataValues.last_connection.toISOString(),
                    last_connection: user.dataValues.last_connection.toISOString()
                });

                for (let i = 0; i < users.length; i++) {
                    expect(json[i+1]).toEqual({
                        permission: users[i].dataValues.permission,
                        username: users[i].dataValues.username,
                        creation_date: users[i].dataValues.last_connection.toISOString(),
                        last_connection: users[i].dataValues.last_connection.toISOString(),
                    });
                }
            } else
                fail("something went wrong : conversation or user is null");
        });

        it("404 : conversation not found", async () => {
            response = await fetch(url + "-1/message", init);
            json = await response.json();

            expect(response.status).toEqual(404);
            expect(json).toEqual({
                status: 404,
                error: "Conversation not found"
            });
        });
    });

    describe("/{id}", () => {

        let conversation : Conversation | null;

        beforeEach(async () : Promise<void> => {
            if (user?.dataValues.id)
                conversation = await generate_conversation("TEST_CONVERSATION", [user?.dataValues.id as number], token);
            else
                fail("something went wrong : user is null");
        });

        it('200 : conversation found', async () => {
            if (user?.dataValues.id && conversation?.dataValues.id) {
                response = await fetch(url + conversation.dataValues.id.toString(), init);
                json = await response.json();

                expect(response.status).toEqual(200);
                expect(json).toEqual({
                    id: conversation.dataValues.id,
                    admin_id: user.dataValues.id,
                    name: "TEST_CONVERSATION",
                    creation_date: conversation.dataValues.creation_date.toISOString(),
                    edition_date: conversation.dataValues.edition_date.toISOString(),
                });
            } else
                fail("something went wrong : unable to create a user in db");
        });

        it('404 : conversation not found', async () => {
            response = await fetch(url + "-1", init);
            json = await response.json();

            expect(response.status).toEqual(404);
            expect(json).toEqual({
                status: 404,
                error: "Conversation not found"
            });
        });
    });
});
