import axios from 'axios'


class ClovaSpeechClient {
  // Clova Speech invoke URL 본인의 URL
  invoke_url = 'https://clovaspeech-gw.ncloud.com/external/v1/5357/b90bb4731ecc409aa579999f389d46cfbef942820f6e071baeba6c9be6a31249';
  // Clova Speech secret key 본인의  시크릿키
  secret = 'e35292a1c7ba43e190ce81365057bfad';
  

  async req_upload(file, completion, callback = null, userdata = null, forbiddens = null, boostings = null,
    wordAlignment = true, fullText = true, diarization = null,  language = 'ko-KR') {
    const request_body = {
      language: language,
      completion: completion,
      callback: callback,
      userdata: userdata,
      wordAlignment: wordAlignment,
      fullText: fullText,
      forbiddens: forbiddens,
      boostings: boostings,
      diarization: diarization,
    };

    const formData = new FormData();
    formData.append('media', file);
    formData.append('params', JSON.stringify(request_body));

    try {
      const response = await axios.post(this.invoke_url + '/recognizer/upload', formData, {//this.invoke_url + '/recognizer/upload'
        headers: {
          'Accept': 'application/json;UTF-8',
          'X-CLOVASPEECH-API-KEY': this.secret,
        },
      });
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

export default ClovaSpeechClient;
