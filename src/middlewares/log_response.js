
const log_response = (req, res, next) => {
    if (!req.query.transport || req.query.transport !== "polling")
    {
        console.log("========= RESPONSE ==========");
        if (Array.isArray(res.body))
            res.body.forEach(elm => console.log("* " + JSON.stringify(elm)));
        else 
            Object.keys(res.body).forEach(key => console.log("* " + key + " : " + JSON.stringify(res.body[key])));

        if (res.cookies)
        {
            console.log("Cookies :");
            Object.keys(res.cookies).forEach(key => console.log("\t* " + key + " : " + JSON.stringify(res.cookies[key])));
        }
        console.log("=============================");
    }
    next();
}

module.exports = log_response;