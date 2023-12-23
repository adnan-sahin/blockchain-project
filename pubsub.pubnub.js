const PubNub = require("pubnub");

const credentials = {
  publishKey: "pub-c-0e147447-fb98-4dcb-81c7-123b1c9890db",
  subscribeKey: "sub-c-663ba408-d622-4443-b16b-5e2dcca92c21",
  secretKey: "sec-c-MDc3NmU0OTktNzUzZi00MTdlLWIwMzItNWQ1ODA3OGQ5Mzhh",
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
