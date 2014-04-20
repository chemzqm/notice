/**
 * Notice
 *
 * A notice message at the top of a webpage.
 *
 */

var classes = require('classes');
var events = require('events');

var hasTouch = 'ontouchend' in window;

function create(o) {
  var el = document.createElement(o.tag || 'div');
  el.className = o.className;
  el.innerHTML = o.html || '';
  if (o.parent) o.parent.appendChild(el);
  return el;
}
var container;

function Notice(msg, options) {
  if (! (this instanceof Notice)) return new Notice(msg, options);
  if (!container) {
    container = create({
      className: 'notice-container',
      parent: document.body
    })
  }
  options = options || {};
  var hide = options.hide ||(options.type == 'success' ? 2000 : false);
  if (options.type == 'success') options.hide = 2000;
  options.message = msg;
  var el = createElement(options, hide);
  this.el = el;
  container.appendChild(this.el);
  this.events = events(el, this);
  if (hasTouch) {
    this.events.bind('touchend .notice-close', 'hide');
  } else {
    this.events.bind('click .notice-close', 'hide');
  }
  if (hide) this.hide(hide);
}

Notice.prototype.hide = function(ms) {
  ms = (typeof ms === 'number' ? ms : 0);
  this.events.unbind();
  var self = this;
  setTimeout(function() {
    dismiss(self.el);
  }, ms);
}

Notice.prototype.clear = function () {
  var el = this.el;
  if (el && el.parentNode) {
    el.parentNode.removeChild(el);
  }
}

function createElement(options, hide) {
  var className = 'notice-item' + (options.type
    ? ' notice-' + options.type
    : '');
  var item = create({className: className});
  create({
    className: 'notice-content',
    html: options.message,
    parent: item
  });

  if (!hide) {
    var close = create({
      className : 'notice-close',
      html: '×',
      parent: item
    });
  }

  return item;
}

function dismiss(el) {
  if (classes(el).has('notice-dismiss')) return;
  classes(el).add('notice-dismiss');
  setTimeout(function() {
    if (el && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  }, 200);
}

module.exports = Notice;
