const inquirer = require("inquirer");
const axios = require("axios");
const fs = require("fs");
const questions = [
    {
        type: "input",
        message: "What is your github username?",
        name: "username"
    },
    {
        type: "list",
        message: "What is your favorite color?",
        name: "color",
        choices: ["green", "blue", "pink", "red"]
    }
];

function writeToFile(fileName, data)
{
    const queryURL = `https://api.github.com/users/${data.username}`;
    
    axios.get(queryURL).then(response => {
        const info = {
            color: data.color,
            data: response.data
        };

        const proFile = generateHTML(info);

        fs.writeFile(fileName, proFile, err => {
            if (err) throw err;

            console.log("finished writing file");
        })
    })
}

function init()
{
    inquirer.prompt(questions).then(data => {
        const fileName = `${data.username}profile.html`;
        writeToFile(fileName, data);
    });
}

init();
