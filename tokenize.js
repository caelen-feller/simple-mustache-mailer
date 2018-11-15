const nJwt = require('njwt');
const fs = require('fs');
const secureRandom = require('secure-random');
const csv = require('csvtojson');

var signingKey = secureRandom(256, {type: 'Buffer'}); 

fs.writeFile("secret", signingKey, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("JWT Signing Key was saved in secret");
}); 

fs.readFile("mailing-list.csv",function (err, users) { 
    if(err){
        console.log(err); // Token has expired, has been tampered with, etc
    } else {
        fs.writeFile("tokens", "", function(err) {
            csv()
            .fromFile("mailing-list.csv")
            .then((jsonObj)=>{
                jsonObj.forEach(function(user){
                    var jwt = nJwt.create(user,signingKey);
                    jwt.setExpiration();
                    fs.appendFile("tokens", jwt.compact()+"\n", function(err) {
                    if(err) {
                        return console.log(err);
                    }
                    console.log("Token for " + user.company +  " was saved in tokens");
                    });
                }); 
            });
        });
    }
});