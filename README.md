# Watson Assistant Merge Tool

Live at https://wa-merge-tool.mybluemix.net/

## About

The Watson Assistant Skill Update Tool is a Node.js application that will accept a skill ID, API key, skill .json file, and Watson Assistant URL. It will produce a new skill which contains merged data from the target and new skills provided to it. This tool is built using the watson-assistant-skills-merge npm package: https://www.npmjs.com/package/watson-assistant-skills-merger

## Structure

The project contains 2 parts: the client and the API. Each of the two folders has a corresponding README.md that will tell you how to install and run the application. It is advisable to start the API before the client.

    .
    ├── client                  # front-end files
    ├── api                     # api
    └── README.md               # you are here
