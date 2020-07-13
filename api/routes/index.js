const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const AssistantV1 = require('ibm-watson/assistant/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
var waMerge = require('watson-assistant-skills-merger');

let namePath = "";
let newNamePath = "";
let originalSkillName = "";
let pathToOldFile = "";
let updatedSkillName = "";
let originalFile = "";
let newFile = "";

// Configure local storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    let fileName = req.file.originalname;
    cb(null, fileName);
  }
});

// create local storage to hold file before uploading
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 50000000
  }
});

// Upload file route
router.post("/upload", upload.single('file'), async (req, res, next) => {

  if (!req.file) {
    const error = new Error('Please select a file')
    error.httpStatusCode = 400
    return next(error)
  }

  if (!req.body.wa_apikey) {
    const error = new Error('Please enter the API key')
    error.httpStatusCode = 400
    return next(error)
  }

  if (!req.body.wa_skillid) {
    const error = new Error('Please enter the skill ID')
    error.httpStatusCode = 400
    return next(error)
  }

  // Extract file data to strings
  let file = req.file;
  let wa_apikey = req.body.wa_apikey;
  let wa_skillid = req.body.wa_skillid;
  let wa_url = req.body.wa_url;

  const assistant = new AssistantV1({
    version: '2020-04-01',
    authenticator: new IamAuthenticator({
        apikey: wa_apikey,
    }),
    url: wa_url,
  });

  const params = {
    workspaceId: wa_skillid,
    _export: true,
    sort: "stable"
  };

  assistant.getWorkspace(params)
    .then(response => {
      namePath = "./uploads/" + file.filename;
      newNamePath = namePath + ".json";
      originalSkillName = response.result.name;

      // convert original file to .json
      fs.renameSync(namePath, newNamePath);

      pathToOldFile = "./uploads/" + response.result.workspace_id + ".json";
      fs.writeFileSync(pathToOldFile, JSON.stringify(response.result));

      let rawdata = fs.readFileSync(newNamePath);
      updatedSkillName = JSON.parse(rawdata).name;

      originalFile = require("." + pathToOldFile);
      newFile = require("." + newNamePath);

      var logs = [];
      let outputLogs = "";

      hook_stream = function(_stream, fn) {
        var old_write = _stream.write;
        _stream.write = fn;

        return function() {
            _stream.write = old_write;
        };
      };

      // hook up standard output
      unhook_stdout = hook_stream(process.stdout, function(string, encoding, fd) {
          logs.push(string);
      });

      // merges two skills and saves them as MERGED_[originalFile]__[newFile]
      waMerge(originalFile, newFile);

      unhook_stdout();

      logs.forEach(function(_log) {
        outputLogs += _log + "<br />";
      });

      let skillName = ("MERGED_" + originalSkillName + "__" + updatedSkillName).substring(0, 64);
      let finalName = "../" + skillName + ".json";
      let finalNameShort = skillName + ".json";

      fs.readFile(path.resolve(__dirname, finalName), 'utf8', function(err, contents) {
        fs.writeFileSync(path.resolve(__dirname, "../public/") + "/" + finalNameShort, contents);
      });

      fs.unlink(pathToOldFile, (err) => {
        if (err) throw err;
        console.log('File was deleted');
      });

      fs.unlink(newNamePath, (err) => {
        if (err) throw err;
        console.log('File was deleted');
      });

      let prodLink = "http://wa-merge-tool-api.mybluemix.net/public/" + finalNameShort;
      res.send("<h3><a href=\"" + prodLink + "\"><b>Right-click here and click \"Save Link As\" to download your new, merged skill.</b></a></h3><br /><br /><b><h3>Logs:</h3></b><br />" + outputLogs);
    }).catch(err => {
      console.log(err)
      res.send({error: err});
    });
});

module.exports = router;
