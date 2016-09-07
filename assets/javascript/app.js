$(document).ready(function() {

	// Game variables
	// Append to api call before pushing to heroku: https://crossorigin.me/
	var apicall = "https://crossorigin.me/http://jservice.io/api/random?count=100";
	var parsedData = "";
	var question = "";
	var qcounter = 0;
	var answers = [];
	var answer = "";
	var correct = 0;
	var wrong = 0;
	var rounds = 1;

	// Audio element variables
	var introAudio = $("#intro-audio")[0];
	var timerAudio = $("#timer-audio")[0];
	var buzzerAudio = $("#buzzer-audio")[0];
	var dingAudio = $("#ding-audio")[0];
	var gameoverAudio = $("#gameover-audio")[0];

	var timerCount = 13;
	var timerInterval = "";
	
	// Array shuffling function to randomize answers
	function shuffle(array) {
  		var currentIndex = array.length, temporaryValue, randomIndex;

  		// While there remain elements to shuffle...
  		while (0 !== currentIndex) {

	    	// Pick a remaining element...
		    randomIndex = Math.floor(Math.random() * currentIndex);
		    currentIndex -= 1;

		    // And swap it with the current element.
		    temporaryValue = array[currentIndex];
		    array[currentIndex] = array[randomIndex];
		    array[randomIndex] = temporaryValue;
		}

  		return array;
	}

	// Set up question and answers and call timer function.
	function startQ() {
		console.log(rounds);
		if(rounds == 14) {
			hide($(".hide"));
			show($(".transition"));
			hide($("header"));
			$("html").css("background-image", "url('assets/images/gameover.jpg')");	
			$("#transition-text").css("background", "none");
			$("#transition-text").html("<p>CORRECT: "+correct+"</p><p>INCORRECT: "+wrong+"</p><p><button class='start-button'>Restart Game</button></p>");
			gameoverAudio.play();
		} else if (rounds < 14) {
    		$("#transition-text").empty();
    		show($("header"));
    		show($(".hide"));
			$("html").css("background-image", "url('assets/images/jasontrebek.gif')");
	    	qcounter+=4;		
			answers = [];
			answer = "";
			clue = parsedData[qcounter];
			$("header").css({"margin-top": "50px", "text-align": "left", "font-size": "75px", "padding-left": "20px"});
			$(".gameplay").css("display", "inline-block");
			$("#category").html("<h2>"+clue.category.title.toUpperCase()+"</h2>");
			$("#question").html("<h2>"+clue.question.toUpperCase()+"</h2>");
			$("#answers").empty();
			for(i=qcounter; i<qcounter+4; i++) {
				answers.push(parsedData[i].answer.toUpperCase());
			}
			shuffle(answers);
			$.each(answers, function(f, v) {
				$("#answers").append("<p><button class='answer'>"+v+"</button></p>");
			});

			timer();
			// Insane work-around to strip out api accidental html tags
			answer = $("<p>").html(clue.answer).text();
			console.log(clue.answer);
			console.log(answer);
    		rounds++;
		}
	}

	// Timer function
	function timer() {
		clearInterval(timerInterval);
		timerCount = 13;
		$(document).on('mousemove', function(e){
			var x = e.pageX;
			var y = e.pageY - 100;
    		$('#time-remaining').css({
       			left: x,
       			top: y
    		});
		});
   		timerAudio.currentTime = 0;
		timerAudio.play();
		timerInterval = setInterval(function() {
			if (timerCount > 0) {
				$("#time-remaining").html(timerCount);
				timerCount--;			
			} else if (timerCount == 0) {
				timerAudio.pause();
				buzzerAudio.play();
    			$("html").css({"background-color": "#0039c4", "background-image": "none"});
    			hide($(".hide"));
		    	hide($("header"));
    			show($(".transition"));
    			$("#transition-text").html("<h1>TIME'S UP.</h1><p>The correct answer is: "+answer.toUpperCase()+"</p>")
    			wrong++;
    			clearInterval(timerInterval);
    			setTimeout(startQ, 5000);
			}
		}, 1000);
	}

	// Hide elements for transitions
	function hide(element) {
		element.removeClass("display-block");
		element.addClass("display-none");
	}

	// Show elements after transitions
	function show(element) {
		element.removeClass("display-none");
		element.addClass("display-block");
	}

	// Click event for game start and restart
	$("body").on("click", ".start-button", function() {
	     		$("#transition-text").empty();
				hide($(".transition"));
				hide($(".intro"));
				introAudio.play();
				if($(this).text() == "Restart Game") {

					// Reload animated gif
					setTimeout(function() {
						show($("header"));
		        		var img = document.createElement('img');
	        			img.src = "assets/images/jasontrebek.gif?p" + new Date().getTime();
						$("html").css("background-image", "url('"+img.src+"')");
					}, 4000);
				} else if ($(this).text() == "Start Game") {
					setTimeout(function() {$("html").css("background-image", "url('assets/images/jasontrebek.gif')")}, 5000);
				}
		// API call
		$.getJSON(apicall, function(data){
	    	parsedData = JSON.parse(JSON.stringify(data));
	    	console.log(parsedData);
				correct = 0;
				wrong = 0;
				qcounter = 0;
				rounds = 1;
				answer = "";
				setTimeout(startQ, 10000);

			// Click event for answer choices
	    	$("body").on("click", ".answer", function(event) {
	    		// Workaround for nested click event mess
	    		event.stopImmediatePropagation();

	    		// Check for correct answer
		    	if(timerCount > 0) {
		    		timerAudio.currentTime = 0;
		    		timerAudio.pause();
		    		if($(this).text() == answer.toUpperCase()) {
			    		dingAudio.play();
		    			$("html").css({"background-color": "#0039c4", "background-image": "none"});
		    			hide($("header"));
		    			hide($(".hide"));
		    			show($(".transition"));
		    			$("#transition-text").html("<h1>CORRECT!</h1>")
		    			correct++;
		    			console.log("Correct: "+correct);
		    			clearInterval(timerInterval);
		    			setTimeout(startQ, 5000);
		    		} else if($(this).text() != answer.toUpperCase()) {
		    			buzzerAudio.play();
		    			$("html").css({"background-color": "#0039c4", "background-image": "none"});
		    			hide($("header"));
		    			hide($(".hide"));
		    			show($(".transition"));
		    			$("#transition-text").html("<h1>The correct answer is: </h1><p>"+answer.toUpperCase()+"</p>")
		    			wrong++;
		    			console.log("Wrong: "+wrong);
		    			clearInterval(timerInterval);
		    			setTimeout(startQ, 5000);
		    		}
	    		} 
	    	});
		});
    });

});