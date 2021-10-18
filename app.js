/**
 * Copyright 2014, 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict";

const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"), //L.R.
  errorhandler = require("errorhandler"),
  path = require("path"),
  // environmental variable points to demo's json config file
  extend = require("util")._extend;

const AuthorizationV1 = require("ibm-watson/authorization/v1");
const TextToSpeechV1 = require("ibm-watson/text-to-speech/v1");
const { IamAuthenticator } = require("ibm-watson/auth");
const LanguageTranslatorV3 = require("ibm-watson/language-translator/v3");
const conf = require("config")

const textToSpeech = new TextToSpeechV1({
  authenticator: new IamAuthenticator({
    apikey: conf.get("apiKeys.textToSpeech"),
  }),
  url: "https://stream.watsonplatform.net/text-to-speech/api/",
});

console.log(conf.get("apiKeys.languageTranslatorURL"))

const languageTranslator = new LanguageTranslatorV3({
  authenticator: new IamAuthenticator({
    apikey: conf.get("apiKeys.languageTranslator"),
  }),
  url: conf.get("apiKeys.languageTranslatorURL"),
  version: "2020-03-30",
});

const authorization = new AuthorizationV1({
  authenticator: new IamAuthenticator({
    apikey: conf.get("apiKeys.speechToText"),
  }),
  url: "https://stream.watsonplatform.net/speech-to-text/api",
});

// redirect to https if the app is not running locally
if (!!process.env.VCAP_SERVICES) {
  app.enable("trust proxy");
  app.use((req, res, next) => {
    if (req.secure) {
      next();
    } else {
      res.redirect("https://" + req.headers.host + req.url);
    }
  });
}

// Setup static public directory
app.use(express.static(path.join(__dirname, "./public")));

// Get token from Watson using your credentials
app.get("/token", (req, res) => {
  authorization.getToken((err, token) => {
    if (err) {
      console.log("error:", err);
      res.status(err.code);
    }
    res.send(token);
  });
});

// L.R.
// ------------------------------- MT ---------------------------------
app.use(express.urlencoded({ extended: false }));

app.post("/api/translate", async (req, res, next) => {
  const params = extend(
    { "X-WDC-PL-OPT-OUT": req.header("X-WDC-PL-OPT-OUT") },
    req.body
  );
  const result = await languageTranslator.translate(params).catch((err) => {
    return next(err);
  });
  res.json(result);
});
// ----------------------------------------------------------------------

// L.R.
// -------------------------------- TTS ---------------------------------
// Create the service wrappers

app.get("/synthesize", async (req, res) => {
  try {
    req.query["accept"] = "audio/wav";
    const transcript = await textToSpeech.synthesize(req.query);
    const audio = transcript.result;
    const repaired = await textToSpeech.repairWavHeaderStream(audio);
    res.setHeader("Content-Type", "audio/wav");
    res.send(repaired);
  } catch (error) {
    console.log("Synthesize error: ", error);
  }
});

// ----------------------------------------------------------------------

// Add error handling in dev
if (!process.env.VCAP_SERVICES) {
  app.use(errorhandler());
}
const port = process.env.VCAP_APP_PORT || 3000;
app.listen(port);
console.log("listening at:", port);
