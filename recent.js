"use strict";

var chalk = require('chalk'),
	inquirer = require("inquirer"),
	fs = require('fs'),
	foldername = process.argv[2],
	recent_repos = [],
	final_path = '';

fs.readFile( process.env.HOME + '/.bash_history',{encoding: "utf8", flag: "r"},function(err,data){
	if (err) throw err;
	var slots = [];
	var reggie = new RegExp('\\b' + foldername + '\\/(\\w+)\\b');
	data.split('\n').forEach(function(line,i){
		if ( reggie.test(line) ) {
			var matches = line.match(reggie);
			if (slots.indexOf(matches[1]) === -1) {
				slots.unshift(matches[1]);
			}
		}
	});
	recent_repos = slots.filter(function(fold){
		return fs.existsSync( process.env.HOME + '/' + foldername + '/' + fold );
	});
	var questions = [
		{
			type: "rawlist",
			name: "fold",
			message: "what folder in " + foldername + " do you wanna go to?",
			choices: recent_repos
		}
	];
	inquirer.prompt( questions, function( answers ) {
		final_path = process.env.HOME + '/' + foldername + '/' + answers.fold;
		fs.writeFile(
			process.env.HOME + '/bin/,',
			"#!/bin/bash\nalias recent_recent=\"cd "+final_path+"\"\nrecent_recent\n",
			{mode: '755'},
			function(err){
			if (err) throw err;
			console.log( chalk.dim('type ') + chalk.magenta.bold('. ,') + chalk(' to go there') );
		});
	});
});
