import User from "../../src/db/user";
import {expect} from "@jest/globals";
import {get_token, generate_user} from "../utils/utils";

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
})

