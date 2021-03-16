// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"main.js":[function(require,module,exports) {
var API = 'AIzaSyBLCVZD7ttGVxMh6EEJAkDaBKG6NPpR5T4';
var MAX_RESULTS = 10;
var btn = document.getElementById('btn');
var searchInput = document.getElementById('search');
var output = document.getElementById('output');
form.addEventListener('submit', function (event) {
  event.preventDefault();
});
btn.addEventListener('click', function () {
  var searching = searchInput.value;
  videoSearch(API, MAX_RESULTS, searching);
  output.innerHTML = '';
});

function videoSearch(key, maxResults, search) {
  var promise = new Promise(function (resolve, reject) {
    if (searchInput.value !== '') {
      var requestUrl = requestLink(key, maxResults, search); // console.log('new videos')

      var xhr = new XMLHttpRequest();
      xhr.open('GET', requestUrl, true);
      xhr.responseType = 'json';

      xhr.onload = function () {
        xhr.status >= 400 ? console.error(xhr.response) : resolve(xhr.response);
      };

      xhr.onerror = function () {
        reject(xhr.response);
      };

      xhr.send();
    }
  });
  promise.then(function (data) {
    // console.log(data)
    output.innerHTML = searchWord(searchInput.value);
    var index = 0;
    var containers = new Array();
    var views = new Array(); // getting the number of views for each video
    // Only finished broadcasts and premieres are displayed

    data.items.forEach(function (video) {
      var promiseStats = new Promise(function (resolve, reject) {
        var statUrl = link(video.id.videoId); // console.log('Getting the number of views for a video with id:', video.id.videoId)

        var xhrStats = new XMLHttpRequest();
        xhrStats.open('GET', statUrl, true);
        xhrStats.responseType = 'json';

        xhrStats.onload = function () {
          xhrStats.status >= 400 ? console.error(xhrStats.response) : resolve(xhrStats.response);
        };

        xhrStats.onerror = function () {
          reject(xhrStats.response);
        };

        xhrStats.send();
      }); // sorting new videos by number of views

      promiseStats.then(function (data) {
        index++;
        var viewCount = data.items[0].statistics.viewCount;
        containers.push({
          videos: video,
          viewCounts: viewCount
        });
        views.push(viewCount);

        if (index == maxResults) {
          views.sort(compare);

          for (var viewsCounter = 0; viewsCounter < views.length; viewsCounter++) {
            for (var containerCounter = 0; containerCounter < containers.length; containerCounter++) {
              if (containers[containerCounter].viewCounts == views[viewsCounter]) {
                videoElement(containers[containerCounter].videos); // console.log('viewsCounter)
              }
            }
          }
        }
      });
    });
  });
}

function requestLink(key, maxResults, search) {
  return 'https://www.googleapis.com/youtube/v3/search??eventType=completed&order=date&part=snippet&key=' + key + '&type=video&part=snippet&maxResults=' + maxResults + '&q=' + search;
}

function searchWord(search) {
  return "<p class=\"result\">\u0420\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u043F\u043E\u0438\u0441\u043A\u0430 \u043F\u043E \u0437\u0430\u043F\u0440\u043E\u0441\u0443: <b><span id=\"resultWord\">".concat(search, "</span></b></p>");
}

function compare(a, b) {
  return b - a;
}

function videoElement(array) {
  var videoTitle = array.snippet.title;
  var author = array.snippet.channelTitle;
  var d = new Date(array.snippet.publishedAt);
  var options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    timezone: 'UTC' // hour: 'numeric',
    // minute: 'numeric',
    // second: 'numeric'

  };
  var element = "\n        <div class=\"element mb-3\" style=\"background-color: #c9e3ff\">\n            <div class=\"elementInner d-flex justify-content-start align-items-center\">\n                <img src=\"".concat(array.snippet.thumbnails.medium.url, "\" alt=\"preview\" class=\"preview m-3\" style=\"width: 160px\">\n                <div class=\"elementDesc w-75\">\n                    <h3 class=\"videoTitle\">").concat(videoTitle.length > 60 ? videoTitle.slice(0, 60) + '...' : videoTitle, "</h3>\n                    <p id=\"author\">\u0410\u0432\u0442\u043E\u0440: ").concat(author.length > 40 ? author.slice(0, 40) + '...' : author, "</p>\n                </div>\n                <div class=\"videoInfo d-flex flex-column justify-content-center\">\n                    <p id=\"videoDate\">\u0414\u0430\u0442\u0430 \u043F\u0443\u0431\u043B\u0438\u043A\u0430\u0446\u0438\u0438:</p>\n                    <p id=\"videoDate\">").concat(d.toLocaleString("ru", options), "</p>\n                </div>\n            </div>\n            <div class=\"videoPlayer hidden m-3\">\n                <iframe id=\"ytplayer\" class=\"mx-auto\" type=\"text/html\" width=\"97.5%\" height=\"600\" src=\"https://www.youtube.com/embed/").concat(array.id.videoId, "\" frameborder=\"0\" allowfullscreen></iframe>\n            </div>\n        </div>\n    ");
  output.innerHTML += element;
  searchInput.value = '';
  var title = document.querySelectorAll('.videoTitle');
  var elements = document.querySelectorAll('.element');

  var _loop = function _loop(i) {
    title[i].addEventListener('click', function () {
      for (var y = 0; y < title.length; y++) {
        elements[y].querySelector('.videoPlayer').classList.add('hidden');
      }

      elements[i].querySelector('.videoPlayer').classList.toggle('hidden');
      title[i].addEventListener('click', function () {
        elements[i].querySelector('.videoPlayer').classList.toggle('hidden');
      });
    });
  };

  for (var i = 0; i < title.length; i++) {
    _loop(i);
  }
}

function link(videoId) {
  return "https://www.googleapis.com/youtube/v3/videos?part=snippet%2Cstatistics&id=".concat(videoId, "&fields=items%2Fstatistics(viewCount)&key=").concat(API);
}
},{}],"C:/Users/Xiaomi/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50927" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["C:/Users/Xiaomi/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","main.js"], null)
//# sourceMappingURL=/main.1f19ae8e.js.map