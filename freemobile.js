const axios = require('axios');

class FreeMobile {
  constructor(credentials) {
    this.user = credentials.user;
    this.pass = credentials.pass;
    this.maxMessageLength = 999;
  }

  send(message) {
    // Split the message into chunks of maxMessageLength
    const messageChunks = this._chunkString(message, this.maxMessageLength);

    // Use reduce to chain promises and send each chunk sequentially
    return messageChunks.reduce((promiseChain, chunk) => {
      return promiseChain.then(() => this._sendSingleSMS(chunk));
    }, Promise.resolve());
  }

  // Function to send a single SMS
  _sendSingleSMS(chunk) {
    const url = 'https://smsapi.free-mobile.fr/sendmsg';
    const data = {
      user: this.user,
      pass: this.pass,
      msg: chunk
    };

    return axios.post(url, data)
      .then(response => response.data)
      .catch(error => {
        throw new Error(`Failed to send SMS: ${error.message}`);
      });
  }

  // Function to split a string into chunks of a specified length
  _chunkString(str, length) {
    const chunks = [];
    for (let i = 0; i < str.length; i += length) {
      chunks.push(str.substring(i, i + length));
    }
    return chunks;
  }
}

module.exports = FreeMobile;