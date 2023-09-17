import User from "../../../src/db/models/user";
import {expect, it} from "@jest/globals";
import {generate_user, get_token} from "../utils/utils";

let init: RequestInit = { method : "POST", headers: { "Content-Type": "application/json" }},
    url : RequestInfo = "http://localhost:8080/api/user/",
    response : Response,
    json : any,
    user : User | null,
    token : string;

const username = "TEST_USER1234$";
const password = "TEST_PASSWORD1234$";

describe('POST /api/user/', () => {

    beforeEach(async () : Promise<void> => {
        user = await generate_user(username, password, 1);
        token = await get_token(username, password);
        init = { method : "POST", headers: { "Content-Type": "application/json", "Authorization" : "Bearer " + token} };
    });

    afterEach(async () : Promise<void> => {
        await User.destroy({ where : { } });
    });

    it('201 : new user and send the result', async () => {
        init.body = JSON.stringify({ username : username+"NEW", password : password});

        response = await fetch(url, init);
        json = await response.json();

        expect(response.status).toEqual(201);
        expect(json).toEqual({
            username: username+"NEW",
            id : expect.any(Number),
            last_connection: expect.any(String),
            creation_date: expect.any(String),
            permission: 0,
        });

        user = await User.findByPk(json.id);
        expect(user).not.toBeNull();
    });

    it('409 : conflict username already taken and send error response', async () => {
        init.body = JSON.stringify({ username : username, password : password});

        response = await fetch(url, init);
        json = await response.json();

        expect(response.status).toEqual(409);
        expect(json).toEqual({
            status: 409,
            error: "Username already taken",
        });
    });

    it("401 : username is invalid", async () => {
        init.body = JSON.stringify({ username : "user", password : password});

        response = await fetch(url, init);
        json = await response.json();

        expect(response.status).toEqual(401);
        expect(json).toEqual({
            error: "Username did not meet expectations",
            status : 401
        });
    });

    it("401 : password is invalid", async () => {
        init.body = JSON.stringify({ username : username, password : "1234"});

        response = await fetch(url, init);
        json = await response.json();

        expect(response.status).toEqual(401);
        expect(json).toEqual({
            error: "Password did not meet expectations",
            status : 401
        });
    });

    it("400 : password and username not provided", async () => {
        init.body = JSON.stringify({ });

        response = await fetch(url, init);
        json = await response.json();

        expect(response.status).toEqual(400);
        expect(json).toEqual({
            error: "Username and password required",
            status : 400
        });
    });
});
