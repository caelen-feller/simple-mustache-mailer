const nJwt = require('njwt');
const fs = require('fs');
const secureRandom = require('secure-random');
const csv = require('csvtojson');


fs.readFile("../secret", function (err, signingKey) { 
    if(err){
        console.log(err); 
    } else {
        csv()
        .fromFile("responses.csv")
        .then((jsonObj)=>{
            jsonObj.forEach(function(response){
                nJwt.verify(response.Token, signingKey, function(err,responseJwt){
                    if(err){
                        console.log(err.name + ": " +  err.message); 
                    } else {
                        console.log(responseJwt.body.company + " are interested");
                    }
                });
            }); 
        });
    }
});