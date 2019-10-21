'use strict';
var express = require("express");
var fs = require("fs");
var bodyParser = require("body-parser");
var app = express();
var bleach = require('bleach');
const sessions = require('client-sessions');

var accounts = []; //temporary, used in place of a database, will need to be replaced
const REGEX = [/<username>(.*?)<\/username>/g, /<password>(.*?)<\/password>/g, /<cash>(.*?)<\/cash>/g, /<fname>(.*?)<\/fname>/g, /<lname>(.*?)<\/lname>/g, /<address>(.*?)<\/address>/g,];
const REPLACE = /<\/?[^>]+(>|$)/g;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(sessions({
	cookieName: 'session',
	secret: 'ksdf76s78dHSDKFJSDKF8HJJ737j',
	duration: 24 * 60 * 60 * 1000,
	activeDuration: 1000 * 60 * 5,
	}));//generates cookie and keeps the session active for the alloted duration

var accountStrings = [];

//Main function that handles the dashboard webpage when logged in, raw HTML needs to be insterted to account for changing values.
//Should replace this with templates. This only handles the display of the dashboard page, not the actual logic.
function generateDash(username, money, error){

if(!money)
{
	let x = userIndex(username);
	money = accounts[x].cash;
}



var page = "<html><body><h1>Welcome, " + username + " To the Bank Of Hamesh!</h1>    <h1>Dashboard Actions:</h1>";
page += "<br>Your balance: $" + money;
page += "<form action='/dashboard' method='post'>";
page += "<input type='radio' name='choice' value='deposit'> <label for='user'>Deposit:</label> <input type='text' id='deposit_value' name='deposit_val' placeholder='Enter value to Deposit' /> <br><br>";
page += "<input type='radio' name='choice' value='withdraw'>";
page += "<label for='user'>Withdraw:</label>";
page += "<input type='text' id='Withdraw_value' name='withdraw_val' placeholder='Enter value to Withdraw' />";
page += "<br><br>";
page += "<input type='radio' name='choice' value='transfer'>";
page += "<label for='user'>Transfer:</label>";
page += "<input type='text' id='Withdraw_value' name='transfer_val' placeholder='Enter value to Transfer' />";
page += "<label for='user'>Send to:</label>";
page += "<input type='text' id='Withdraw_value' name='transfer_val' placeholder='Enter Username' />";
page += "<br><br>";
page += "<input type='submit' value='Do The Stuff' />    </form>";
if (error === 1)
{
	page +="<br>You do not have enough money to do that...";
}
if (error === 2)
{
	page +="<br>Target Account Invalid...";
}
if (error === 3)
{
	page +="<br>ERROR: INVALID INPUT";
}
page += "<form action='/logout' method='post'>";
page += "<input type='submit' value='Logout' name='logout' id = 'logout'/></form>";


page += "</body>";
page += "</html>";
return page;


}


//Function that's called every time the txt database is built, will need to be replaced with an actual one.
function buildDB(){
	fs.writeFileSync("out.txt", "<account><username>" + accounts[0].username + "</username><password>"
	 	+ accounts[0].pass + "</password><cash>" + accounts[0].cash + "</cash><fname>" + accounts[0].fname + "</fname><lname>" + accounts[0].lname + "</lname><address>" + accounts[0].address + "</address></account>\n"); 
	 
	 for (let i = 1; i<accounts.length;i++)
	 {
	 	fs.appendFileSync("out.txt", "<account><username>" + accounts[i].username + "</username><password>"
	 	+ accounts[i].pass + "</password><cash>" + accounts[i].cash + "</cash><fname>" + accounts[i].fname + "</fname><lname>" + accounts[i].lname + "</lname><address>" + accounts[i].address + "</address></account>\n"); 
	 
	 }
}

//Converts two strings to ints and returns the sum
function parseAdd(val1, val2){

var a = parseInt(val1, 10);
var b = parseInt(val2, 10);


return a + b;
}

//END OF GLOBALS


//Takes the data from the out.txt file and removes XML tags.
function parseUser(list, index, reg){

let final = list[index].match(REGEX[reg]).map(function(val){
	return val.replace(REPLACE, '');
});
return final[0];
}


//Returns the index value of the specified user
function userIndex(user){
for (let i = 0; i<accounts.length;++i){
	if (user === accounts[i].username)
		return i;
	}

}



//Password verification
function check_pass(val)
{
    var no = 0;
    if(val!="")
    {
        // If the password length is less than or equal to 6
        if(val.length<=6){
            no=1;
        }

        // If the password length is greater than 6 and contain any lowercase alphabet or any number or any special character
        if(val.length>6 && (val.match(/[a-z]/) || val.match(/\d+/) || val.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/))){
            no=2;
        }

        // If the password length is greater than 6 and contain alphabet,number,special character respectively
        if(val.length>6 && ((val.match(/[a-z]/) && val.match(/\d+/)) || (val.match(/\d+/) && val.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/)) || (val.match(/[a-z]/) && val.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/)))){
            no=3;
        }

        // If the password length is greater than 6 and must contain alphabets,numbers and special characters
        if(val.length>6 && val.match(/[a-z]/) && val.match(/\d+/) && val.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/)){
            no=4;
        }
    }

    if (no === 3 || no === 4){
        //console.log("is strong");
        return true;
    }
    else{
        //console.log("NOT strong");
        return false;
    }
}







//Testing function, doesn't do anything needed
function escape(input){
let final = input.replace(REPLACE, '');
console.log("Escape results: " + final);
return final;

}

//Account creation function, simply creates an instance of an object and assigns it.
function createAccount(username, pass, cash, fname, lname, address){
	this.username = username;
	this.pass = pass;
	this.cash = cash;
	this.fname = fname;
	this.lname = lname;
	this.address = address;
}
//Creates an instance of an account object


//Function that checks if a username is already entered in the database.
function accountValid(user){


for (let i = 0; i<accounts.length;i++){
	console.log(user + accounts[i]);
	if (user === accounts[i].username){
		return false;
		}
	}

return true;
}
//RETURNS FALSE ON ACCOUNT MATCH, TRUE ON NO MATCH






//
function accountVerify(user,pass){


for (let i = 0; i<accounts.length; i++){

	if (user === accounts[i].username){
	
		if (pass === accounts[i].pass){
			return true;
		}
	}
}
return false;

}



//The "main" of the webpage, the first function that will resolve when the index page is generated. Not the first function called
//in control flow, but the first thing the user will "see".
app.get("/", function(req,res){

	res.sendFile(__dirname + "/index.html");
	});
//Called when the user requests the index page.


//Handles the "logic" of the dashboard page that is generated in a function above.
app.post("/dashboard", function(req, resp){
	if (req.session.username)
	{
		let error = 0;
		let index = userIndex(req.session.username);
	
		if (req.body.choice === 'deposit')
		{
			let result = bleach.sanitize(req.body.deposit_val);
			if (result < 0){
			result = 0;
			error = 3;
			}
			accounts[index].cash = parseAdd(accounts[index].cash,result);
			buildDB();
		}
		else if (req.body.choice === 'withdraw')
		{
			let result = bleach.sanitize(req.body.withdraw_val);
			if (result < 0){
			result = 0;
			error = 3;
			}
		
			if (result <= accounts[index].cash)
			{
				accounts[index].cash -= result;
				buildDB();
				
			}
			else
			{
				error = 1;
			}
	
		}
	
		else if (req.body.choice === 'transfer')
		{
			let value = bleach.sanitize(req.body.transfer_val[0]);
			if (value < 0){
			value = 0;
			}
			let target = bleach.sanitize(req.body.transfer_val[1]);
		
		
			if (value <= accounts[index].cash)
			{
			
				if(!accountValid(target))
				{
					let x = userIndex(target);
					accounts[index].cash -= value;
					accounts[x].cash = parseAdd(accounts[x].cash,value);
					buildDB();
				}
			
			}
			else
			{
				error = 1;
			}
		
			if(accountValid(target))
			{
				error = 2;
			}

		}
	
		switch(error)
		{
			case 0: 
				resp.send(generateDash(req.session.username,accounts[index].cash));
				break;
			case 1:
				resp.send(generateDash(req.session.username,accounts[index].cash, error));
				break;
			case 2:
				resp.send(generateDash(req.session.username,accounts[index].cash, error));
				break;
			case 3:
				resp.send(generateDash(req.session.username,accounts[index].cash, error));
				break;
		}
	
	}
	else
	{
		resp.redirect('/');
	}
});

//Logout function, resets the session and sends the user to the main index
app.post("/logout", function(req, resp){
	req.session.reset();
	resp.redirect('/');

});

//HTML login function called on HTML action, sanitizes input and runs checks to see if the account is valid
app.post("/login", function(req, resp){
	console.log("login function");
	let user = bleach.sanitize(req.body.user1);
	let pass = bleach.sanitize(req.body.pass1);
	let result = accountVerify(user,pass);
	console.log("Login successful " + result);
	if (result){
	let x = userIndex(user);
	req.session.username = accounts[x].username;
	
	resp.send(generateDash(user, accounts[x].cash)); //CHANGE INDEX.HTML TO DASHBOARD
	}
	else{
	resp.send("<p>Login failed: Incorrect Username/Password</p><button onclick='goBack()'>Go Back</button>" +
	"<script>function goBack(){window.history.back();}</script>");
	}

});

//Fetches data from the txt database, this will need to be overhauled.
app.post("/getData", function(req, resp){
	let user = bleach.sanitize(req.body.user);
	let pass = bleach.sanitize(req.body.pass);
	let fname = bleach.sanitize(req.body.fname);
	let lname = bleach.sanitize(req.body.lname);
	let address = bleach.sanitize(req.body.address);
	if (accountValid(user,pass) && check_pass(pass) && fname && lname && address){
	

		console.log("Got user input: " + user);
		console.log("Got user input: " + pass);
		let temp = new createAccount(user, pass, 500, fname, lname, address);
		accounts.push(temp);
		console.log(accounts);
		fs.appendFileSync("out.txt", "<account><username>" + temp.username + "</username><password>"
	 	+ temp.pass + "</password><cash>" + temp.cash + "</cash><fname>" + temp.fname + "</fname><lname>" + temp.lname + "</lname><address>" + temp.address + "</address></account>\n"); 
		
		
		let x = userIndex(user);
		req.session.username = accounts[x].username;
		resp.send(generateDash(user, 500));
		}
		
		
	else{
	resp.send("<p>Login failed: Account Exists, missing information, or weak password (minimum of 6 characters with one capital letter and one special character)</p><button onclick='goBack()'>Go Back</button>" +
	"<script>function goBack(){window.history.back();}</script>");
}



});

//Generic console activity, first code to actually run on startup. Final action is to set it to listen on port 3000 which is what
//the browser will search for. Again this is the first place control flow starts at.
let result = fs.readFileSync("out.txt", 'utf8');
if (result){
	var parse_list = result.split("\n");



	for (let i = 0; i<parse_list.length; ++i){
		if (parse_list[i] === ""){
		parse_list.splice(i, 1);
		}
	}
	
	
	for (let i = 0; i<parse_list.length; ++i){
		let temp = new createAccount(parseUser(parse_list,i,0), parseUser(parse_list,i,1), parseUser(parse_list,i,2), parseUser(parse_list,i,3), parseUser(parse_list,i,4), parseUser(parse_list,i,5));
		accounts.push(temp);
	}
	console.log(accounts);



//	console.log(parseUser(parse_list, 0, 1));
	
	
}
else{
	console.log("Result empty");
}

//for (let i = 0; i<parse_list.length(); i++){

app.listen(3000);
//	console.log(parseUser(parse_list,0,0));
