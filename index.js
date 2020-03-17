const inquirer = require("inquirer");
const axios = require("axios");
const fs = require("fs");
const pdf = require("html-pdf");
const HTML = require("./generateHTML");
const questions = [
    {
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

async function writeToFile(fileName, data) {
    try {
        const queryURL = `https://api.github.com/users/${data.username}`;

        const gitData = await axios.get(queryURL);

        const starData = await axios.get(`${queryURL}/starred`)

        const info =
        {
            color: data.color,
            avatar_url: gitData.data.avatar_url,
            name: gitData.data.name,
            location: gitData.data.location,
            public_repos: gitData.data.public_repos,
            followers: gitData.data.followers,
            html_url: gitData.data.html_url,
            stars: starData.data.length,
            following: gitData.data.following
        };

        const proFile = HTML(info);

        fs.writeFile(fileName, proFile, err => {
            if (err) throw err;

            console.log("finished writing file");

            const htmlFile = fs.readFileSync(fileName, "utf8");

            pdf.create(htmlFile).toFile("./profile.pdf", (err, res) => {
                if (err) throw err;

                console.log("pdf writen")
            })
        });
    }
    catch (err) {
        throw err;
    }
}

function init() {
    inquirer.prompt(questions).then(data => {
        const fileName = `index.html`;
        writeToFile(fileName, data);
    });
}

init();
