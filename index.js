var path = require('path');
var fs = require('fs');

module.exports = (function() {
  var CWD = process.cwd();

  function readEnv(envPath) {
    var envContent = fs.readdirSync(envPath).reduce(function(content, file) {
      if(file === '.env') {
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
      Object.keys(content[key]).forEach(function(value) {
        process[key][value] = content[key][value];
      });
    });
  }

  parseEnv(readEnv(CWD));
})();