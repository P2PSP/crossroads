const tagCmd = (strings, ...params) => {
  let result = '';
  for (let i = 0; i < strings.length - 1; ++i) {
    result += strings[i] + params[i];
  }
  return result;
};

const genCmdSplitter = (...params) => {
  return tagCmd`--source_addr ${params[0]} --source_port ${params[1]} --splitter_port ${params[2]} --channel ${params[3]} --header_size ${params[4]}`;
};

const genCmdMonitor = (...params) => {
  return tagCmd`--splitter_addr ${params[0]} --splitter_port ${params[1]}`;
};

module.exports = {
  genCmdSplitter,
  genCmdMonitor
};
