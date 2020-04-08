# SpeechToSpeech
# Speech to Speech Browser Application

  このアプリケーションは、IBMの音声認識、機械翻訳、音声再生APIを使用して作成する、リアルタイムの音声翻訳アプリケーションです。
  
Node.jsはブラウザへクライアントの認証トークンを提供するために利用されます。

下記のボタンをクリックして、すぐにIBM Cloudでこのアプリケーションを試してみましょう！

[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://github.com/TakumiHongo/SpeechToSpeech)

## Getting Started

1. IBM Cloud (Bluemix) のアカウントを作ります

    IBM Cloudへ新たに[Sign up][sign_up] するか、既にお持ちのアカウントでログインしてください。Watsonサービスを無料で使い始めることができます。
    
2. IBM Cloudにこのアプリケーションをデプロイします

    上記のボタンからBluemixへ遷移した場合、必要なサービスの組み合わせでページが開きます。
    アプリケーション名を指定して、右下のデプロイボタンを押すとアプリケーションがデプロイされます。

3. DevOpsツールチェーンからWeb IDEを起動します

    前の手順から、ツールチェーンの画面になると思うので、「CODE」からWeb IDEを開きます。

4. `manifest.yml` ファイルを確認します

    ３つのWatson APIの定義が記述されています。
    こちらの内容で、あなたのスペースへサービスが作成されます。

  ```none
---
declared-services:
  speech-to-text-service-standard:
    label: speech_to_text
    plan: standard
  language-translation-service:
    label: language_translator
    plan: standard
  text-to-speech-service:
    label: text_to_speech
    plan: standard	
applications:
- name: <application name>
  command: node app.js
  buildpack: sdk-for-nodejs
  path: .
  memory: 256m
  services:
  - speech-to-text-service-standard
  - language-translation-service
  - text-to-speech-service
  ```

IBM Cloudのダッシュボードを開くと、上記の３つのサービスが作成されていることが確認できると思います。
それぞれの資格情報を作成し、内容を控えておいてください。

5. config/default.jsonを修正します
  ```
  {
    "apiKeys": {
        "languageTranslator": "<language-translator service api key>",
        "speechToText": "<speech-to-text service api key>",
        "textToSpeech": "<text-to-speech service api key>"
    }
}
  ```


6. アプリケーションを起動します



## トラブルシューティング

IBM Cloud上のアプリケーションで問題が発生した時はログを確認してください。
下記のコマンドを実行します。

  ```sh
  $ cf logs <application-name> --recent
  ```

## ライセンス

  This sample code is licensed under Apache 2.0. Full license text is available in [LICENSE](LICENSE).

## Contributing

  See [CONTRIBUTING](CONTRIBUTING.md).

## Open Source @ IBM
  Find more open source projects on the [IBM Github Page](http://ibm.github.io/)

[cloud_foundry]: https://github.com/cloudfoundry/cli
[getting_started]: http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/doc/getting_started/
[sign_up]: https://apps.admin.ibmcloud.com/manage/trial/bluemix.html?cm_mmc=WatsonDeveloperCloud-_-LandingSiteGetStarted-_-x-_-CreateAnAccountOnBluemixCLI
