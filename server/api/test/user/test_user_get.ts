import User from "../../../db/models/user";
import Conversation from "../../../db/models/conversation";
import ConversationUser from "../../../db/models/conversation_user";
import {controller_logger} from "../../src/logger";
import {expect} from "@jest/globals";
import {get_token, generate_user, generate_conversation} from "../utils/utils";


let init: RequestInit = { headers: { "Content-Type": "application/json" }},
    url : RequestInfo = "http://localhost:8080/api/user/",
    response : Response,
    json : any,
    user : User | null,
    token : string;

const username = "TEST_USER1234$";
const password = "TEST_PASSWORD1234$";

describe("GET /api/user", () => {
    beforeEach(async () : Promise<void> => {
        user = await generate_user(username, password, 1);
        token = await get_token(username, password);
        init = { method: "GET", headers: { "Content-Type": "application/json", "Authorization" : "Bearer " + token }};
    });

    afterEach(async () : Promise<void> => {
        await User.destroy({ where : { } });
    });

    describe("/", () => {

        it('200 : retrieve all users', async () => {
            response = await fetch(url, init);
            json = await response.json();

            expect(response.status).toEqual(200);
            expect(json).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    username: expect.any(String),
                    permission: expect.any(Number),
                    last_connection: expect.any(String),
                    creation_date: expect.any(String)
                }),
            ]));
        });

        it('401 : no authorization', async () => {
            init.headers = { "Content-Type": "application/json" };
            response = await fetch(url, init);
            json = await response.json();

            expect(response.status).toEqual(401);
            expect(json).toEqual({
                error: "No token provided",
                status : 401
            });
        });

        it('401 : wrong token', async () => {
            if (!user)
                fail("user not found");
            else {
                user.setDataValue("permission", 0);
                await user.save();

                response = await fetch(url, init);
                json = await response.json();

                expect(response.status).toEqual(401);
                expect(json).toEqual({
                    error: "Unauthorized access",
                    status: 401
                });
            }
        });
    });

    describe("/{id}", () => {

        it('200 : retrieve a user', async () => {

            if (user && user.dataValues.id) {
                response = await fetch(url+user.dataValues.id.toString(), init);
                json = await response.json();

                expect(response.status).toEqual(200);
                expect(json).toEqual({
                    id: user.dataValues.id,
                    username: user.dataValues.username,
                    permission: user.dataValues.permission,
                    last_connection: user.dataValues.last_connection.toISOString(),
                    creation_date: user.dataValues.creation_date.toISOString(),
                });
            }
            else
                fail("user not found");
        });

        it('401 : no authorization', async () => {
            init.headers = { "Content-Type": "application/json"};

            if (user && user.dataValues.id) {
                response = await fetch(url + user.dataValues.id.toString(), init);
                json = await response.json();

                expect(response.status).toEqual(401);
                expect(json).toEqual({
                    error: "No token provided",
                    status: 401
                });
            } else
                fail("user not found");
        });

        it('401 : wrong token', async () => {
            if (user && user.dataValues.id) {
                user.setDataValue("permission", 0);
                await user.save();

                response = await fetch(url+user.dataValues.id.toString(), init);
                json = await response.json();

                expect(response.status).toEqual(401);
                expect(json).toEqual({
                    error: "Unauthorized access",
                    status : 401
                });
            } else
                fail("user not found");
        });
    });

    describe("/{id}/conversation", () => {

        let conversations : Conversation[];

        beforeEach(async () : Promise<void> => {
            conversations = []
            if (user?.dataValues.id) {
                for (let i = 0; i < 5; i++) {
                    let conversation = await generate_conversation("TEST", [user?.dataValues.id as number], token);
                    if (conversation) {
                        conversation.add_user(user?.dataValues.id as number);
                        conversations.push(conversation);
                    } else
                        fail("something went wrong : conversation not created");
                }
            } else
                fail("something went wrong : user not found");
        });

        afterEach(async () : Promise<void> => {
            await ConversationUser.destroy({ where : {}});
            await Conversation.destroy({ where : {}});
        });

        it('200 : retrieve all conversations of a user', async () => {
            if (user && user.dataValues.id) {
                response = await fetch(url + user.dataValues.id.toString() + "/conversation", init);
                json = await response.json();

                expect(response.status).toEqual(200);
                for (let i = 0; i < conversations.length; i++)
                    expect(json[i]).toEqual({
                            id: conversations[i].dataValues.id,
                            name: conversations[i].dataValues.name,
                            creation_date: conversations[i].dataValues.creation_date.toISOString(),
                            edition_date: conversations[i].dataValues.edition_date.toISOString(),
                            admin_id : conversations[i].dataValues.admin_id,
                        }
                    );
            } else
                fail("something went wrong : user not found");
        });

        it('404 : user not found', async () => {
           response = await fetch(url + "-1/conversation", init);
           json = await response.json();

           expect(response.status).toEqual(404);
           expect(json).toEqual({
               error: "User not found",
               status : 404
           })
        });
    });
})

