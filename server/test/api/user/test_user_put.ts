import User from "../../../src/db/models/user";
import {expect, it} from "@jest/globals";
import {get_token, generate_user} from "../utils/utils";

let init: RequestInit,
    url : RequestInfo = "http://localhost:8080/api/user/",
    response : Response,
    json : any,
    user : User | null,
    token : string;

const username = "TEST_USER1234$";
const password = "TEST_PASSWORD1234$";
describe('PUT /api/user/{id}', () => {

    beforeEach(async (): Promise<void> => {
        user = await generate_user(username, password, 1);
        token = await get_token(username, password);
        init = { method : "PUT", headers: { "Content-Type": "application/json", "Authorization" : "Bearer " + token} };
    });

    afterEach(async () : Promise<void> => {
        await User.destroy({ where : { } });
    });

    it('404 : user is not found', async () => {

        response = await fetch(url + "-1", init);
        json = await response.json();

        expect(response.status).toEqual(404);
        expect(json).toEqual({
            status: 404,
            error: 'User not found',
        });
    });

    it('400 : changed permission is greater than user permission', async () => {
        init.body = JSON.stringify({ permission : 2 });

        if (user && user.dataValues.id) {
            response = await fetch(url + user.dataValues.id.toString(), init);
            json = await response.json();

            expect(response.status).toEqual(400);
            expect(json).toEqual({
                status: 400,
                error: 'Unable to change the permission of this user',
            });
        }
    });

    it('401 : token is invalid', async () => {
        if (init.headers)
            init.headers = {"Authorization" : "Bearer " + token + "INVALID", "Content-Type": "application/json"};

        if (user && user.dataValues.id) {
            response = await fetch(url + user.dataValues.id.toString(), init);
            json = await response.json();

            expect(response.status).toEqual(401);
            expect(json).toEqual({
                status: 401,
                error: 'Invalid token',
            });
        }
    })

    it("400 : Password is not valid", async () => {
        init.body = JSON.stringify({ password : "INVALID_PASSWORD" });

        if (user && user.dataValues.id) {
            response = await fetch(url + user.dataValues.id.toString(), init);
            json = await response.json();

            expect(response.status).toEqual(400);
            expect(json).toEqual({
                status: 400,
                error: 'Password did not meet expectations',
            });
        }
    })

    it("400 : Username is not valid", async () => {
        init.body = JSON.stringify({ username : "us" });

        if (user && user.dataValues.id) {
            response = await fetch(url + user.dataValues.id.toString(), init);
            json = await response.json();

            expect(response.status).toEqual(400);
            expect(json).toEqual({
                status: 400,
                error: 'Username did not meet expectations',
            });
        }
    })

    it('200 : change the permission of the user and send success response', async () => {
        init.body = JSON.stringify({ permission : 0 });

        if (user && user.dataValues.id) {
            response = await fetch(url + user.dataValues.id.toString(), init);
            json = await response.json();

            expect(response.status).toEqual(200);
            expect(json).toEqual({
                status: 200,
                success: true,
            });
        }
    })

});
