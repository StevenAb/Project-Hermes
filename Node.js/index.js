var twilio = require('twilio');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var google = require('google');
//var dominos = require('dominos');

google.resultsPerPage = 1;
var nextCounter = 0;


mongoose.connect('mongodb://localhost/test');
var group = mongoose.model('groups', {
	name: String, 
	members: [{name: String, number: String}]
});

var client = new twilio.RestClient('AC1855c5ea38c7b8de45e1ce3d85e2caf7','acd884dff899531302bdbd4767b9300e');

app.get('/', function(req, res){
	res.send('<p>Hello World</p>');
});

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

var userName;
var password;

var groupName;

var member0;
var member1;
var member2;
var member3;
var member4;
var member5;
var member6;
var member7;
var member8;
var member9;
var member10;
var member11;

var num0;
var num1;
var num2;
var num3;
var num4;
var num5;
var num6;
var num7;
var num8;
var num9;
var num10;
var num11;

app.post('/signup', function(req, res){
	groupName = req.body.groupName;
	member0 = req.body.name0;
	num0 = req.body.number0;
	member1 = req.body.name1;
	num1 = req.body.number1;
	member2 = req.body.name2;
	num2 = req.body.number2;

	var new_Group = new group({
		name: groupName,
		members: [{name: member0, number: num0}, {name: member1, number: num1}, {name: member2, number: num2}]
	});
	new_Group.save();

	console.log(groupName + "= [" + member0 + ": " + num0 + "]");
	console.log(groupName + "= [" + member1 + ": " + num1 + "]");
}); 

//var hardCodeNumUsers = 3;
var inc = 0;
var polling = false;
var pollResponse;
var thePollResponses = [];
var numArray = [];
var yes = 0;
var no = 0;
//var lastArray = [];

app.get('/smsReply', function(req, res){
	console.log('Message Sent to Twilio Number');
	res.send('Message Sent to Twilio Number');
	console.log(req.query.From + ": " + req.query.Body);

	group.find({'members.number': req.query.From}, function(err, docs) {
		console.log(docs.length);
		if (docs.length != 0){
			console.log(docs[4].members);
			for (var p = 0; p < docs[4].members.length; p += 1){
				console.log(docs[4].members[p].number);
				numArray[p] = docs[4].members[p].number;
				//lastArray[p] = req.query.Body;
			}
			console.log(numArray.length);
		}
	});

	
	if (polling) {
		console.log(numArray.length);

			//numArray[inc] = req.query.From;
	
			pollResponse = req.query.Body;
			thePollResponses[inc] = pollResponse;
			inc += 1;
			if (pollResponse.toUpperCase() == "YES") {
				yes += 1;
			}
			else {
				no += 1;
			}
			if (inc == numArray.length){
				console.log("Polling Complete");
				var resultMessage = "Polling Results:\nYes: " + yes + " No: " + no;
				for (var i = 0; i < numArray.length; i += 1) {
					client.sendSms({
					to: numArray[i],
					from: '+17324918329',
					body: resultMessage
				}, function (err, data) {
					console.log(err);
					console.log(data);
				});
				}
			}
		
	}

	var numInd
	var googleQuery;
	var reminderConfirm;
	var userText = req.query.Body;
	var hermesCheck = userText.indexOf("Hermes");
	if (hermesCheck == 0) {
		console.log("YES");
		if (userText.indexOf("set reminder for") != -1 || userText.indexOf("Set reminder for") != -1) {
			var reminderText = userText.replace("set reminder for", "");
			reminderText = reminderText.replace("Set reminder for", "");
			reminderText = reminderText.replace("Hermes", "");
			var parts = reminderText.split("at");
			console.log(parts[0]);
			console.log(parts[1]);
			reminderConfirm = "Reminder set for " + parts[0] + " at " + parts[1];
			console.log(reminderConfirm);
			//console.log(client);
			client.messages.create({
				to: '+17327427351',
				from: '+17324918329',
				body: reminderConfirm
			});
			var reminderMessage = "Reminder for " + parts[0] + "!";
			var hour = parts[1].split(":");
			var hourInt = parseInt(hour[0]);
			console.log(hourInt);
			var otherHalf = hour[1].split(" ");
			console.log("otherHalf[0] = " + otherHalf[0]);
			console.log("otherHalf[1] = " + otherHalf[1]);
			var minute = parseInt(otherHalf[0]);
			minute = minute/1;
			if (otherHalf[1].indexOf("p") != -1) {
				hourInt += 12;
			}
			var now = new Date();
			var millisTill10 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hourInt, minute, 0, 0) - now;
			var hermesCheck = userText.indexOf("Hermes");
			if (millisTill10 < 0) {
		     millisTill10 += 86400000; // it's after 10am, try 10am tomorrow.
			}
			setTimeout(function(){for (var b = 0; b < numArray.length; b += 1) {
				client.messages.create({
				to: numArray[b],
				from: '+17324918329',
				body: reminderMessage
			})}}, millisTill10);
		}
		if (userText.indexOf("order pizza") != -1) {
			/*
			var order=new dominos.class.Order();
			order.Order.Phone = req.query.From;
			order.Order.FirstName = 'Rishi';
			order.Order.LastName='Masand';
			order.Order.Email='test@email.com';
			var product=new dominos.class.Product();
			product.Code='14SCREEN';
			order.Order.Products.push(product);
			dominos.order.validate(
    			order,
    			function(data){
        			console.log(data);
    			}
			);
			dominos.order.price(
    			order,
    			function(data){
        			console.log(data);
    			}
			);
			var cardInfo=new dominos.class.Payment();
			cardInfo.Amount=42.50; 
			//get amount from dominos.order.price request 
			//data.result.Order.Amounts.Customer

			cardInfo.Number='4444888888888888';
			cardInfo.CardType='VISA';
			cardInfo.Expiration='1017';
			cardInfo.SecurityCode='189';
			cardInfo.PostalCode='20500';

			order.Order.Payments.push(cardInfo);
			dominos.order.place(
			    order,
			    function(data){
			        console.log(data);

			        if(data.result.Order.Status==-1){
			            console.log(
			                '\n###### NO PIZZA FOR YOU! ######\n',
			                orderData.result.Order.StatusItems,
			                '\n#########################\n\n'
			            );
			            return;
			        }

			    }
			);
			*/
			console.log("pizza ordered.");
			for (var h = 0; h < numArray.length; h += 1){
				console.log(numArray[h]);
				client.sendSms({
				to: numArray[h],
				from: '+17324918329',
				body: "Ordered a pizza!"
				}, function (err, data){
					console.log(err);
					console.log(data);
				});
			}
			
		}
		/*
		if (userText.indexOf("last message" != -1)){
			var lmText = userText.replace("Hermes", "");
			var lmText = lmText.replace("last message", "");
			group.find({'members.name': lmText}, function(err, docs){
				if (docs.length != 0){
					for (var p = 0; p < docs[0].members.length; p += 1){
						console.log(docs[0].members[p].number);
						numArray.indexOf(req.query.From);
					}
				}
			});
			
			console.log(lastArray[numInd]);
		};
		*/
		if (userText.indexOf("google") != -1 || userText.indexOf("Google") != -1){
			var googleQuery = userText.replace("Hermes", "");
			console.log(googleQuery);
			var googleQuery = googleQuery.replace("google", "");
			console.log(googleQuery);
			var googleQuery = googleQuery.replace("Google", "");
			console.log(googleQuery);
			var googleQuery = googleQuery.replace(":", "");
			console.log(googleQuery);
			var googleQuery = googleQuery.replace(",", "");
			console.log(googleQuery);
			google(googleQuery, function (err, next, links){
				  if (err) console.error(err);

				  for (var i = 0; i < 1; ++i) {
				    //console.log(links[i].title + ' - ' + links[i].link); 
				    //console.log(links[i].description + "\n");
				    var googleMessage = links[i].title + ' - ' + links[i].link + "\n" + links[i].description + "\n";
				    console.log(googleMessage);
				    var collinDoesntTrustGM = googleMessage;
				    if (googleMessage.indexOf("News") == 0 || googleMessage.indexOf("Images") == 0) {
				    	next();
				    }
				    else {
				    	for (var j = 0; j < numArray.length; j += 1) {
							console.log(numArray[j]);
							client.sendSms({
								to: numArray[j],
								from: '+17324918329',
								body: googleMessage
							});
							console.log("Sent");
				  		}
				    }
					

				}
				for (var r = 0; r < numArray.length; r += 1) {
					client.sendSms({
					to: numArray[r],
					from: '+17324918329',
					body: googleMessage
				});
				}
			});

			
		}
		if (userText.indexOf("poll") != -1) {
			console.log("Polling");
			polling = true;
		}
	}
	else {
		console.log("NO");
	}
});

http.listen(80, function(){
	console.log('listening on *:80');
});