let processMap = new Map();

const setProcessMap = mapp => {
  processMap = mapp;
};

const launch = async channel => {
  if (channel.headerSize) {
    return ['127.0.0.1:12000', '127.0.0.1:12001'];
  } else {
    throw new Error('Engine.launch() error thrown');
  }
};

const stop = url => {};

module.exports = {
  launch,
  stop,
  setProcessMap
};
