import User from '../../src/db/user';
import Conversation from "../../src/db/conversation";
import ConversationUser from "../../src/db/conversation_user";
import {expect} from "@jest/globals";
import {generate_user, get_token} from "../utils/utils";


let init: RequestInit = { headers: { "Content-Type": "application/json" }},
    url : RequestInfo = "http://localhost:8080/api/conversation/",
    response : Response,
    json : any,
    user : User | null,
    token : string,
    conversation : Conversation | null;

const username = "TEST_USER1234$";
const username2 = "TEST_USER1234$$";
const password = "TEST_PASSWORD1234$";

describe('DELETE /api/conversation', () => {
    beforeEach(async (): Promise<void> => {
        user = await generate_user(username, password, 1);
        token = await get_token(username, password);
        init = { method: "DELETE", headers: { "Content-Type": "application/json", "Authorization" : "Bearer " + token}};

        conversation = await Conversation.create({
            name: "TEST_CONVERSATION",
            admin_id: user.dataValues.id,
            creation_date: new Date(),
            edition_date: new Date()
        });
    });

    afterEach(async () : Promise<void> => {
        await ConversationUser.destroy({ where: {} });
        await Conversation.destroy({ where: {} });
        await User.destroy({ where: {} });
    });

    describe("/{id}", () => {
        it('200 : conversation deleted', async () => {
            if (user?.dataValues.id && conversation?.dataValues.id) {
                response = await fetch(url + conversation.dataValues.id.toString(), init);
                json = await response.json();

                expect(response.status).toEqual(200);
                expect(json).toEqual({
                    status : 200,
                    success : true
                });

                const conversation_user : ConversationUser | null = await ConversationUser.findOne({ where : { conversation_id : conversation.dataValues.id }});
                expect(conversation_user).toBeNull();

                conversation = await Conversation.findByPk(conversation.dataValues.id);
                expect(conversation).toBeNull();
            } else
                fail("something went wrong : unable to create a user in db");
        });

        it('401 : unauthorized', async () : Promise<void> => {
            const user2 = await generate_user(username2, password, 1);
            const token2 = await get_token(username2, password);
            init = { method: "DELETE", headers: { "Content-Type": "application/json", "Authorization" : "Bearer " + token2}};

            if (user2?.dataValues.id && conversation?.dataValues.id) {
                response = await fetch(url + conversation.dataValues.id.toString(), init);
                json = await response.json();

                expect(response.status).toEqual(401);
                expect(json).toEqual({
                    status : 401,
                    error : "Unauthorized"
                });
            } else
                fail("something went wrong : unable to create a user or a conversation in db");
        });

        it('404 : conversation not found', async () : Promise<void> => {
            response = await fetch(url+"-1", init);
            json = await response.json();

            expect(response.status).toEqual(404);
            expect(json).toEqual({
                status : 404,
                error : "Conversation not found"
            });
        });
    });

    describe("/{id}/leave", () => {
        it('200 : conversation left', async () => {
            if (user?.dataValues.id && conversation?.dataValues.id) {
                response = await fetch(url + conversation.dataValues.id.toString() + "/leave", init);
                json = await response.json();

                expect(response.status).toEqual(200);
                expect(json).toEqual({
                    status : 200,
                    success : true
                });

                const conversation_user_tmp : ConversationUser | null = await ConversationUser.findOne({ where : { conversation_id : conversation.dataValues.id }});
                expect(conversation_user_tmp).toBeNull();
            } else
                fail("something went wrong : unable to create a user in db");
        });

        it('404 : conversation not found', async () : Promise<void> => {
            response = await fetch(url+"-1", init);
            json = await response.json();

            expect(response.status).toEqual(404);
            expect(json).toEqual({
                status : 404,
                error : "Conversation not found"
            });
        });
    })

});
