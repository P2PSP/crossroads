let standaloneEngineMode = false;

const isStandaloneEngine = () => {
  return standaloneEngineMode;
};
const setStandaloneEngineMode = m => {
  standaloneEngineMode = m ? true : false;
};

module.exports = {
  isStandaloneEngine,
  setStandaloneEngineMode
};
