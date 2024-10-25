const dgram = require("node:dgram");

const dnspacket = require("dns-packet");

const db = {
  "piyushgarg.dev": {
    type: "A",
    data: "1.2.3.4",
  },
  "blog.piyushgarg.dev": {
    type: "A",
    data: "hashnode.network",
  },
};

const server = dgram.createSocket("udp4");

server.on("message", (msg, rinfo) => {
  const incomingReq = dnsPacket.decode(msg);
  const ipFromDb = db[incomingReq.questions[0].name];

  const ans = dnsPacket.encode({
    type: "response",
    id: incomingReq.id,
    flags: dnsPacket.AUTHORITATIVE_ANSWER,
    questions: incomingReq.questions,
    answers: [
      {
        type: ipFromDb.type,
        class: "IN",
        name: incomingReq.questions[0].name,
        data: ipFromDb.data,
      },
    ],
  });
});

server.bind(53, () => console.log("DNS Server is running on port 53"));
