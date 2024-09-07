// Tests for the login function
import {expect} from "@jest/globals";
import User from "../../src/db/user";
import {generate_user} from "../utils/utils";

let init: RequestInit = { method: "POST", headers: { "Content-Type": "application/json" }},
    url : RequestInfo = "http://localhost:8080/api/login",
    response : Response,
    json : any;

const username = "TEST_USER1234$";
const password = "TEST_PASSWORD1234$";

describe("POST /api/login/", () => {

    beforeEach(async () : Promise<void> => {
        await generate_user(username, password);
    });

    afterEach(async () : Promise<void> => {
        await User.destroy({ where : { } });
    });

    it("400 : username or password not provided", async () => {
        init.body = JSON.stringify({});

        response = await fetch(url, init);
        json = await response.json();

        expect(response.status).toBe(400);
        expect(json).toEqual({
            error: "Username or password not provided",
            status : 400
        });
    });

    it("401 : username does not exist", async () => {
        init.body = JSON.stringify({ username: username+"RANDOM", password: password });

        response = await fetch(url, init);
        json = await response.json();

        expect(response.status).toBe(401);
        expect(json).toEqual({
            error: username+"RANDOM does not exist",
            status : 401
        });
    });

    it("401 : password is invalid", async () => {
        let password2 = "another password"

        init.body = JSON.stringify({ username : username, password : password2});

        response = await fetch(url, init);
        json = await response.json();

        expect(response.status).toEqual(401);
        expect(json).toEqual({
            error: "Password is invalid",
            status : 401
        });
    });

    it("201 : login and response with token, username, and id", async () => {
        init.body = JSON.stringify({ username : username, password : password});

        response = await fetch(url, init);
        json = await response.json();

        expect(response.status).toBe(200);
        expect(json).toEqual({
            token: expect.any(String),
            username: username,
            id: expect.any(Number),
        });
    });
});
