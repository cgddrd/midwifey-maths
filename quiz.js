var question_no = 1;
var last_question_index = 0;
var quiz_config = [
	{
		text: "Express {0}g in kilograms to a maximum of two decimal places.",
		answertext: "{answer}kg",
		params: [
			{
				min: 1,
				max: 1000
			}
		],
		calculate: function()
		{		
			return (this.params[0].result / 1000).toFixed(2);
		}
	},
	{
		text: "At the start of the month, a baby's weight is measured as {0}kg. At the end of this same month, they are weighed again. This time, they weigh {1}kg. Calculate the percentage change observed between the two readings to two decimal places.",
		answertext: "{answer}%",
		params: [
			{
				min: 0,
				max: 30
			},
			{
				min: 0,
				max: 30
			}
		],
		calculate: function()
		{		
			var increase = this.params[1].result - this.params[0].result;
			return ((increase / this.params[0].result) * 100).toFixed(2);
		}
	},
	{
		text: "The volume of feed a baby requires is calculated according to the formula:\n" +
		"$$\\frac{150ml \\, x \\, weight \\, of \\, baby \\, (kg)}{No. \\, of \\, feeds \\, in \\, 24 \\, hours}$$\nCalculate the volume of feed required if Ewan, whose weight is {0}kg, is to be fed every {1} hours." ,
		params: [
			{
				min: 2,
				max: 12
			},
			{
				values:[1, 2, 3, 4, 6, 8, 12]
			}
		],
		calculate: function()
		{		
			return ((150.0 * this.params[0].result) / (24.0 / this.params[1].result)).toFixed(2);
		}
	},
	{
		text: "The volume of feed a baby requires in a day is calculated according to the formula:\n" +
		"$$\\frac{150ml \\, x \\, weight \\, of \\, baby \\, (kg)}{No. \\, of \\, feeds \\, in \\, 24 \\, hours}$$\nCalculate the volume of feed required if Ewan, whose weight is {0}g, is to be fed every {1} hours." ,
		params: [
			{
				min: 2000,
				max: 12000
			},
			{
				values:[1, 2, 3, 4, 6, 8, 12]
			}
		],
		calculate: function()
		{		
			return ((150.0 * (this.params[0].result / 1000)) / (24.0 / this.params[1].result)).toFixed(2);
		}
	},
	{
		text: "The formula for calculating body mass index (BMI) is given by:\n" +
		"$$BMI \\, = \\, \\frac{Weight \\, (kg)}{[Height \\, (m)]^2}$$\nIf a patient weighs {0}kg and their height is {1}m, calculate their BMI correct to one decimal place." ,
		params: [
			{
				min: 40,
				max: 75
			},
			{
				type: 'double',
				min: 1.1,
				max: 2.8
			}
		],
		calculate: function()
		{		
			return (this.params[0].result / Math.pow(parseFloat(this.params[1].result), 2)).toFixed(1);
		}
	},
	{
		text: "{3} {2} is weighed on admission to hospital. They are read as weighing {0}kg, and their clothes weigh {1}g. What is their actual weight?" ,
		answertext:"{answer}kg",
		params: [
			{
				min: 20,
				max: 80
			},
			{
				values:[600, 800, 1000, 1200, 1300, 1500, 2000, 2100, 2200]
			},
			{
				values:['Melons', 'Snowden', 'Goddard', 'Angel', 'Black']
			},
			{
				values:['Mr', 'Mrs', 'Ms', 'Lord', 'General', 'Dr.']
			}
		],
		calculate: function()
		{		
			return (this.params[0].result - (this.params[1].result / 1000));
		}
	},
	{
		text: "Jayne organised a 'mother and baby' class at her local hospital. Prior to the event, she received {0} signups. On the day however, {1} people turned up." +
		"What percentage of people attended the event vs. the number expected (to one decimal place)?" ,
		params: [
			{
				values:[40]
			},
			{
				min: 1,
				max: 40
			}
		],
		calculate: function()
		{		
			return ((this.params[1].result / this.params[0].result) * 100).toFixed(1);
		}
	},
	{
		text: "A doctor has {0} patients.\n\n{1} of these patients are male.\n\nWhat percentage of these patients are female (to one decimal place)?",
		params: [
			{
				values:[14500]
			},
			{
				values:[1000, 2500, 4000, 7250, 8000, 4560, 12000, 12500, 5450, 10000]
			}
		],
		calculate: function()
		{		
			return ((this.params[1].result / this.params[0].result) * 100).toFixed(1);
		}
	},
	{
		text: "At the end of the previous year, the total number of patients seen by hospital staff was {0}. By the end of this year, this figure is projected to rise by {1}%. Calculate the total number of patients expected to be treated by the end of the current year.",
		params: [
			{
				values:[24000, 25500, 47000, 50000, 100000, 96000, 85000, 70000, 55250, 62500]
			},
			{
				values:[2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 33, 50]
			}
		],
		calculate: function()
		{		
			return this.params[0].result + (this.params[0].result * (this.params[1].result / 100));
		}
	}
];

$( document ).ready(function() {
   
	var current_question = get_random_question();   
	display_question(current_question);

	MathJax.Hub.Config({
    	tex2jax: {inlineMath: [["$","$"],["\\(","\\)"]]}
  	});

	$('#btn-next-question').on('click', function(evt) {

		$("#answer").removeClass('show');
		$('#btn-reveal-answer').removeClass('hide');

		var current_question = get_random_question();   
		display_question(current_question);

		MathJax.Hub.Queue(["Typeset",MathJax.Hub,"question"]);

	});

	$('#btn-reveal-answer').on('click', function(evt) {

		$("#answer").addClass('show');
		$(this).addClass('hide');

	});

});

function display_question(question)
{
	$('.lead').text('Question: ' + question_no++);

	var question_string = question['text'];
	var answer_string;

	for (var i = 0, len = question['params'].length; i < len; i++ )
	{
		
		if (question.params[i].hasOwnProperty('values'))
		{
			question.params[i]['result'] = question.params[i]['values'][calculate_random_integer(0, question.params[i]['values'].length - 1)];
		} 
		else if (question.params[i].hasOwnProperty('min') && question.params[i].hasOwnProperty('min')) {

			var min = question.params[i].min;
			var max = question.params[i].max;

			if (question.params[i].hasOwnProperty('type') && question.params[i].type === 'double')
			{
				question.params[i]['result'] = calculate_random_double(min, max).toFixed(1);
			} 
			else 
			{
				question.params[i]['result'] = calculate_random_integer(min, max);
			}
			
		} 
		else
		{
			console.error("Unable to calculate parameter for question " + i + ".");
		}

		question_string = question_string.replace('{' + i + '}', question.params[i].result);
	}

	if (question.hasOwnProperty('answertext'))
	{
		answer_string = question['answertext'].replace('{answer}', question.calculate());
	} 
	else 
	{
		answer_string = question.calculate();
	}

    $('#question').text(question_string);
	$('#answer').text("Answer: " + answer_string);
}

function calculate_random_double(min, max)
{
	return Math.random() * (max - min) + min;
}

function calculate_random_integer(min, max)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function get_random_question()
{
	var new_no;

	do 
	{
		new_no = Math.floor(Math.random()*quiz_config.length);
	} while (new_no == last_question_index)

	return quiz_config[last_question_index = new_no];
}