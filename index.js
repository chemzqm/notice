/**
 * Notice
 *
 * A notice message at the top of a webpage.
 *
 */

var classes = require('classes');
var events = require('events');

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
  options.message = msg;
  var el = createElement(options);
  this.el = el;
  container.appendChild(this.el);
  this.events = events(el, this);
  this.events.bind('click .notice-close', 'hide');
  if (options.type == 'success') this.hide(2000);
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

function createElement(options) {
  var className = 'notice-item' + (options.type
    ? ' notice-' + options.type
    : '');
  var item = create({className: className});
  create({
    className: 'notice-content',
    html: options.message,
    parent: item
  });

  if (options.type !== 'success') {
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
