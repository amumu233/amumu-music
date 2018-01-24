const rewire = require("rewire"),
  proxyquire = require("proxyquire");

/**
 *
 * @param {模块路径} module
 * 尝试去加载一个指定的模块, 如果失败返回null
 */
function loadCustomizer(module) {
  try {
    return require(module);
  } catch (e) {
    if (e.code !== "MODULE_NOT_FOUND") {
      throw e;
    }
  }
  return config => config;
}

function rewireModule(modulePath, customizer) {
  let defaults = rewire(modulePath);
  let config = defaults.__get__("config");
  customizer(config);
}

switch (process.argv[2]) {
  case "start":
    rewireModule('react-scripts/scripts/start.js', loadCustomizer('./overrides-config.dev'));
    break;
  case "build":
    rewireModule('react-scripts/scripts/build.js', loadCustomizer('./overrides-config.prod'));
    break;
  case "test":
    let customizer = loadCustomizer('./overrides-config.testing');
    proxyquire('react-scripts/scripts/test.js', {
      '../utils/createJestConfig': (...args) => {
        var createJestConfig = require('react-scripts/utils/createJestConfig');
        return customizer(createJestConfig(...args));
      }
    });
    break;
  default:  
    console.log('客户定制仅支持"start","build","test"三种选项');
    process.exit(-1);
}
