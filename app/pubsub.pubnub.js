const PubNub = require("pubnub");

const credentials = {
  publishKey: "",
  subscribeKey: "",
  secretKey: "",
  userId: "Rv7Q8kr3dvQ4o1ZQbp0JAw==",
};

const CHANNELS = {
  TEST: "TEST",
  TESTTWO: "TESTTWO",
};

class PubSub {
  constructor() {
    this.pubnub = new PubNub(credentials);
    this.pubnub.subscribe({ channels: Object.values(CHANNELS) });
    this.pubnub.addListener(this.listener);
  }
  listener() {
    return {
      message: (messageObject) => {
        const { channel, message } = messageObject;

        console.log(`Message received. Channel:${channel}. Message:${message}`);
      },
    };
  }

  publish({ channel, message }) {
    this.pubnub.publish({ channel, message });
  }
}

// const testPubSub = new PubSub();
// testPubSub.publish({ channel: CHANNELS.TEST, message: "hello pubnub" });

// module.exports = PubSub;
