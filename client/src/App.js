import React, { Component } from 'react';
import './App.css';

// For testing locally
// let uploadUrl = "http://localhost:9000/";

// For deployment
let uploadUrl = "http://wa-merge-tool-api.mybluemix.net/"

class App extends Component {
  state = {
    error: ''
  };

  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h2>Watson Assistant Merge Tool</h2>
          <h5>Download the code here: <a href="https://github.com/public-data-and-ai-csm/Public-DataAI-Assets">https://github.com/public-data-and-ai-csm/Public-DataAI-Assets</a></h5>
          <h5>Disclaimer: This tool is provided as-is with no implied warranty or liability and is not directly supported by IBM.</h5>
        </header>
        <div className="bordered">
          <p><b>This tool uses the <a href="https://www.npmjs.com/package/watson-assistant-skills-merger">Watson Assistant Skills Merger npm package</a> to merge two Watson Assistant Skills.</b>
          <ol>
            <lh><b>How it Works:</b></lh>
            <li>Check that both skills files are JSON</li>
            <li>Checks for properties usually found in exported Watson Assistant Skills e.g. workspaceId, skillID etc.</li>
            <li>Merges Skill2 to Skill1</li>
            <li>Copy or merge intents and entities in skill1 and skill2</li>
            <li>Merge Dialogs in skill1 and skill2</li>
            <li>Rename duplicates/conflicts</li>
            <li>Generates a newly merged skill which can be reuploaded to IBM Cloud.</li>
          </ol></p>
          <p><b>Directions: </b> Enter the API Key, Skill ID, and URL from your credentials page of the skill you would like to target. Then upload the .json of the NEW skill. Once you click 'Upload' you will be redirected to your new skill .json. Right-click on the page then and click "Save as" to download the newly merged skill .json.
          </p>
          <p> Note: Your URL maybe in the format of https://gateway.watsonplatform.net/assistant/api OR https://api.us-east.assistant.watson.cloud.ibm.com/instances/[instance-id], etc. depending on your version of Watson Assistant. It's a good idea to start with "https://gateway.watsonplatform.net/assistant/api" and if that doesn't work, use the URL from your service credentials page.
          </p>
          <form action={uploadUrl + "upload"} method="post" encType="multipart/form-data">
            <p>WARNING: Do NOT use this tool for a production skill. You may setup a copy of the skill and call it "dev" then perform this operation on that skill. Once you verify the changes are accurate, then you can upload to your production skill.</p>
            <p>
              <label>New Skill: </label><input type="file" name="file" />
            </p>
            <p>
              <label>API Key: </label>
              <input type="text" name="wa_apikey" size="75" />
            </p>
            <p>
              <label>Skill ID: </label>
              <input type="text" name="wa_skillid" size="75" />
            </p>
            <p>
              <label>Watson Assistant URL: </label>
              <input type="text" name="wa_url" size="75" />
            </p>
            <p>
              <button type="submit" value="submit" className="btn btn-success btn-block">Upload</button>
              <input type="reset"></input>
            </p>
          </form>
          <p>{this.state.error}</p>
          <br />
        </div>
      </div>
    );
  }
}

export default App;
