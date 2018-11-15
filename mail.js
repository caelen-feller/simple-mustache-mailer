const nodemailer = require('nodemailer');
const juice = require('juice');
const mustache = require('mustache');
const fs = require('fs');
const nJwt = require('njwt');
const lineReader = require('line-reader');

// IMAP ACCESS
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user:'email@gmail.com',
        pass:'PASSWORD'
    }
});


fs.readFile("email.html", function (err, html) { 
    if(err){
        console.log(err); 
    } else {
        fs.readFile("secret", function (err, signingKey) { 
            if(err){
                console.log(err); 
            } else {
                lineReader.eachLine('tokens', function(token,last, cb){ 
                    nJwt.verify(token, signingKey, function(err,userJwt){
                        if(err){
                            console.log(err); 
                        } else {
                            var config = {
                                contact: {
                                    lastName: userJwt.body.lastName,
                                    title: userJwt.body.title,
                                    company: userJwt.body.company,
                                },
                                email: {
                                    recipient: userJwt.body.email,
                                    title: "Email Title",
                                    token: token
                                }
                            };
                            
                            var msg = mustache.render(html.toString(), config);

                            msg = juice(msg); 
                            var mailOptions = {
                                from: 'careers-fair@mathsoc.ie',
                                to: config.email.recipient,
                                subject: config.email.title,
                                html: msg
                            };

                            transporter.sendMail(mailOptions, function(error , info) {
                                if(error){
                                    console.log(error);
                                } else {
                                    console.log('Email Sent to '+ config.contact.company +' at ' + config.email.recipient +' : ' + info.response);
                                }
                            });                
                        }
                    });  
                    if (last) {
                    cb(false); // stop reading
                    } else {
                    cb();
                    }
                });
            }
        });
    }
});  