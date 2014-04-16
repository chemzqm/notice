/**
 * Require the module at `name`.
 *
 * @param {String} name
 * @return {Object} exports
 * @api public
 */

function require(name) {
  var module = require.modules[name];
  if (!module) throw new Error('failed to require "' + name + '"');

  if (module.definition) {
    module.client = module.component = true;
    module.definition.call(this, module.exports = {}, module);
    delete module.definition;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Register module at `name` with callback `definition`.
 *
 * @param {String} name
 * @param {Function} definition
 * @api private
 */

require.register = function (name, definition) {
  require.modules[name] = {
    definition: definition
  };
};

/**
 * Define a module's exports immediately with `exports`.
 *
 * @param {String} name
 * @param {Generic} exports
 * @api private
 */

require.define = function (name, exports) {
  require.modules[name] = {
    exports: exports
  };
};

require.register("component~event@0.1.3", function (exports, module) {
var bind = window.addEventListener ? 'addEventListener' : 'attachEvent',
    unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent',
    prefix = bind !== 'addEventListener' ? 'on' : '';

/**
 * Bind `el` event `type` to `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.bind = function(el, type, fn, capture){
  el[bind](prefix + type, fn, capture || false);
  return fn;
};

/**
 * Unbind `el` event `type`'s callback `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.unbind = function(el, type, fn, capture){
  el[unbind](prefix + type, fn, capture || false);
  return fn;
};
});

require.register("component~domify@1.2.2", function (exports, module) {

/**
 * Expose `parse`.
 */

module.exports = parse;

/**
 * Wrap map from jquery.
 */

var map = {
  legend: [1, '<fieldset>', '</fieldset>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  _default: [0, '', '']
};

map.td =
map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

map.option =
map.optgroup = [1, '<select multiple="multiple">', '</select>'];

map.thead =
map.tbody =
map.colgroup =
map.caption =
map.tfoot = [1, '<table>', '</table>'];

map.text =
map.circle =
map.ellipse =
map.line =
map.path =
map.polygon =
map.polyline =
map.rect = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">','</svg>'];

/**
 * Parse `html` and return the children.
 *
 * @param {String} html
 * @return {Array}
 * @api private
 */

function parse(html) {
  if ('string' != typeof html) throw new TypeError('String expected');
  
  // tag name
  var m = /<([\w:]+)/.exec(html);
  if (!m) return document.createTextNode(html);

  html = html.replace(/^\s+|\s+$/g, ''); // Remove leading/trailing whitespace

  var tag = m[1];

  // body support
  if (tag == 'body') {
    var el = document.createElement('html');
    el.innerHTML = html;
    return el.removeChild(el.lastChild);
  }

  // wrap map
  var wrap = map[tag] || map._default;
  var depth = wrap[0];
  var prefix = wrap[1];
  var suffix = wrap[2];
  var el = document.createElement('div');
  el.innerHTML = prefix + html + suffix;
  while (depth--) el = el.lastChild;

  // one element
  if (el.firstChild == el.lastChild) {
    return el.removeChild(el.firstChild);
  }

  // several elements
  var fragment = document.createDocumentFragment();
  while (el.firstChild) {
    fragment.appendChild(el.removeChild(el.firstChild));
  }

  return fragment;
}

});

require.register("component~query@0.0.3", function (exports, module) {
function one(selector, el) {
  return el.querySelector(selector);
}

exports = module.exports = function(selector, el){
  el = el || document;
  return one(selector, el);
};

exports.all = function(selector, el){
  el = el || document;
  return el.querySelectorAll(selector);
};

exports.engine = function(obj){
  if (!obj.one) throw new Error('.one callback required');
  if (!obj.all) throw new Error('.all callback required');
  one = obj.one;
  exports.all = obj.all;
  return exports;
};

});

require.register("notice", function (exports, module) {
/**
 * Notice
 *
 * A notice message at the top of a webpage.
 *
 * Copyright (c) 2014 by Hsiaoming Yang.
 */

var query = require("component~query@0.0.3");
var events = require("component~event@0.1.3");

var COUNT = 0;

function Notice(options) {
  var el = createElement(options);
  el.id = 'notice-' + (COUNT++);
  this.el = el;
}

Notice.prototype.show = function() {
  if (document.getElementById(this.el.id)) return;

  var container = query('.notice-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'notice-container';
    document.body.appendChild(container);
  }
  container.appendChild(this.el);
};

Notice.prototype.hide = Notice.prototype.clear = function() {
  dismiss(this.el);
};

function createElement(options) {
  // div.notice-item
  //   span.notice-close
  //   div.notice-content
  var container = document.createElement('div');
  container.className = 'notice-item';
  if (options.type) {
    container.className += ' ' + options.type;
  }

  var content;
  if (options.url) {
    content = document.createElement('a');
    content.href = options.url;
    content.target = '_blank';
  } else {
    content = document.createElement('div');
  }
  content.className = 'notice-content';
  content.innerHTML = options.message;

  var close = document.createElement('span');
  close.className = 'notice-close';
  close.innerHTML = '×';

  container.appendChild(close);
  container.appendChild(content);

  events.bind(close, 'click', function(e) {
    dismiss(container);
  });
  return container;
}

function dismiss(el) {
  el.className += ' notice-dismiss';
  setTimeout(function() {
    if (el && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  }, 200);
}

function notify(options, cb) {
  if (!options) return;
  if (!options.message) {
    options = {message: options};
  }
  var time = options.duration || 4000;
  var item = new Notice(options);
  item.show();
  setTimeout(function() {
    item.clear();
    cb && cb();
  }, time);
}
notify.Notice = Notice;
module.exports = notify;

});

require("notice")
