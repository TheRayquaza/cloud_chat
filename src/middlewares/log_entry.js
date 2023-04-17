const log_entry = (req, res, next) => {
    if (req.query.transport && req.query.transport =="polling") 
    {
        console.log("[websocket]")
    }
    else
    {
        console.log("\n==== " + req.url + " ====");
        console.log("Method : " + req.method);
        
        if (req.headers)
        {
            console.log("Headers :");
            Object.keys(req.headers).forEach(key => console.log("\t* " + key + " : " + JSON.stringify(req.headers[key])));
        }
        if (req.query)
        {
            console.log("Queries :");
            Object.keys(req.query).forEach(key => console.log("\t* " + key + " : " + JSON.stringify(req.query[key])));
        }
        if (req.body)
        {
            console.log("Body :");
            Object.keys(req.body).forEach(key => console.log("\t* " + key + " : " + JSON.stringify(req.body[key])));
        }
        if (req.cookies)
        {
            console.log("Cookies :");
            Object.keys(req.cookies).forEach(key => console.log("\t* " + key + " : " + JSON.stringify(req.cookies[key])));
        }

        console.log("========= ENTRIES ==========");
    }
    next();
}

module.exports = log_entry;