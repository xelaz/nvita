const path = require('path');
const fs = require('fs');

module.exports = (function() {
  const CWD = process.cwd();

  function readEnv(envPath) {
    const envContent = fs.readdirSync(envPath).reduce(function(content, file) {
      if (file === '.env') {
        try {
          content = JSON.parse(fs.readFileSync(envPath + '/' + file));
        } catch(err) {
          console.error('Error on parse .env', err.message);
        }
      }

      return content;
    }, null);

    if(envPath === '/' && !envContent) {
      return {};
    } else if(!envContent) {
      return readEnv(path.resolve(envPath, '..'));
    } else if(envContent) {
      return envContent;
    } else {
      return {};
    }
  }

  function parseEnv(content) {
    Object.keys(content).forEach(function(key) {
      if (!process[key]) {
        process[key] = {};
      }

      content[key] && Object.keys(content[key]).forEach(function(deepKey) {
        process[key][deepKey] = content[key][deepKey];
      });
    });
  }

  parseEnv(readEnv(CWD));
})();