const path = require('path')
const request = require(path.join(__dirname, "../db/user"))

const generation = size => {
    final_str = ""
    while (size > 0)
    {
        c = (parseInt(new Date().getTime()/1000 + Math.random() * 128) + 33) % 128
        if ((c >= 48 && c <= 57) || (c >= 65 && c <= 90) || (c >= 97 && c <= 122))
        {
            final_str += String.fromCharCode(c)
            size-=1
        }
    }
    return final_str
}

const key_generation = size =>
    new Promise(resolve => {
        console.log("[scripts/key_generation] Key generation ...")
        var key = generation(size)
        request.get_api_key_validity(key, valid => {
            console.log("[scripts/key_generation] stack with key " + key)
            if (valid) resolve(key)
            else resolve(key_generation(size))
        });
    });

module.exports = key_generation