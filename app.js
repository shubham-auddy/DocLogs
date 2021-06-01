const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();
var flag = true;

var api = require("./config");
var  dci = api.DCI
var api_key = api.MY_API_KEY;
var audience_key = api.AUDIENCE_KEY;

function about(){
    flag = false;
}

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", function(req, res){
    res.sendFile(__dirname+"/index.html");
});

app.post("/", function(req, res){

    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const data = {
        members : [
            {
                email_address : email,
                status : "subscribed",
                merge_fields : {
                     FNAME : fname,
                     LNAME : lname
                }
               
            }
        ]
    }

    const jsondata = JSON.stringify(data);
    const url = "https://"+ dci + ".api.mailchimp.com/3.0/lists/"+audience_key;
    const options = {
        method : "POST",
         auth : "shubhamauddy:"+api_key
    }
    
    const request = https.request(url, options, function(response){

        var x = response.statusCode;
        if(flag){
             if(x===200){
                res.sendFile(__dirname+"/success.html");
            }else{
                res.sendFile(__dirname+"/failure.html");
            }
        }else{
            res.sendFile(__dirname+"/about.html");
        }
       

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    });

    request.write(jsondata);
    request.end();
})

app.post("/failure", function(req, res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
    console.log("server running");
})

