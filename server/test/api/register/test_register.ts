import { it, expect, describe } from "@jest/globals";
import User from "../../../src/db/models/user";

let init : RequestInit = { method: "POST", headers: { "Content-Type": "application/json" }},
    url : RequestInfo = "http://localhost:8080/api/register",
    response : Response,
    json : any;

describe("POST /api/register/", () => {

    beforeAll(async () => {
        await User.destroy({ where : { } });
    });

    it("400 : username or password are missing", async () => {
        init.body = JSON.stringify({});

        response = await fetch(url, init);
        json = await response.json();

        expect(response.status).toEqual(400);
        expect(json).toEqual({
            error: "Both username and password are required",
            status : 400
        });
    });

    it("401 : username is invalid", async () => {
        const username = "user";
        const password = "TEST_PASSWORD1234$";

        init.body = JSON.stringify({ username : username, password : password});

        response = await fetch(url, init);
        json = await response.json();

        expect(response.status).toEqual(401);
        expect(json).toEqual({
            error: "Username did not meet expectations",
            status : 401
        });
    });

    it("401 : password is invalid", async () => {
        const username = "TEST_USER1234$";
        const password = "1234";

        init.body = JSON.stringify({ username : username, password : password});

        response = await fetch(url, init);
        json = await response.json();

        expect(response.status).toEqual(401);
        expect(json).toEqual({
            error: "Password did not meet expectations",
            status : 401
        });
    });

    it("409 : username already exists", async () => {
        const username = "ALREADY_EXIST1234$";
        const password = "TEST_PASSWORD1234$";

        init.body = JSON.stringify({ username : username, password : password});

        response = await fetch(url, init);
        json = await response.json();

        expect(response.status).toEqual(201);
        expect(json).toEqual({
            token: expect.any(String),
            username: username,
            id: expect.any(Number),
        });

        response = await fetch(url, init);
        json = await response.json();

        expect(response.status).toEqual(409);
        expect(json).toEqual({
            error: "User already exists",
            status : 409
        });
    });

    it("201 : create a new user and return a token", async () => {
        const username = "TEST_USER1234$";
        const password = "TEST_PASSWORD1234$";

        init.body = JSON.stringify({ username : username, password : password});

        response = await fetch(url, init);
        json = await response.json();

        expect(response.status).toEqual(201);
        expect(json).toEqual({
            token: expect.any(String),
            username: username,
            id: expect.any(Number),
        });
    });
});
