import User from '../../src/db/user';
import {expect} from "@jest/globals";
import {generate_user, get_token} from "../utils/utils";

let init: RequestInit = { headers: { "Content-Type": "application/json" }},
    url : RequestInfo = "http://localhost:8080/api/user/",
    response : Response,
    json : any,
    user : User | null,
    token : string

const username = "TEST_USER1234$";
const password = "TEST_PASSWORD1234$";

describe('DELETE /api/user/{id}', () => {
    beforeEach(async () : Promise<void> => {
        user = await generate_user(username, password, 1);
        token = await get_token(username, password);
        init = { method : "DELETE", headers: { "Content-Type": "application/json", "Authorization" : "Bearer " + token} };
    });

    afterEach(async () : Promise<void> => {
        await User.destroy({ where : { } });
    });

    it('200 : delete the user and send success response', async () => {

        if (user && user.dataValues.id) {
            response = await fetch(url+user.dataValues.id.toString(), init);
            json = await response.json();

            expect(response.status).toEqual(200);
            expect(json).toEqual({
                status : 200,
                success : true
            });
        } else
            fail("user not found");
    });

    it('404 : user not found', async () => {
        if (user && user.dataValues.id) {
            response = await fetch(url+"100", init);
            json = await response.json();

            expect(response.status).toEqual(404);
            expect(json).toEqual({
                error: "Unable to find user 100",
                status : 404
            });
        } else
            fail("user not found");
    });

    it('401 : user with invalid permission', async () => {
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
