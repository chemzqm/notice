/**
 * Notice
 *
 * A notice message at the top of a webpage.
 *
 */

var classes = require('classes');
var events = require('events');

//var hasTouch = 'ontouchend' in window;
var zIndex = 999;

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
  options = options || {};
  if (!container) {
    container = create({
      className: 'notice-container',
      parent: options.parent || document.body
    })
  }
  if (options.type == 'success') options.duration = options.duration || 2000;
  var closable = options.hasOwnProperty('closable')? options.closable : true;
  var duration = options.duration;
  if (!closable && duration == null) duration = 2000;
  options.message = msg;
  var el = createElement(options, closable);
  el.style.zIndex = -- zIndex;
  this.el = el;
  container.appendChild(this.el);
  this.events = events(el, this);
  //this.events.bind('tap .notice-close', 'hide');
  this.events.bind('click .notice-close', 'hide');
  if (duration) {
    setTimeout(this.hide.bind(this), duration);
  }
}

Notice.prototype.hide = function(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  if (this._hide) return;
  this._hide = true;
  var self = this;
  this.events.unbind();
  dismiss(this.el);
}

Notice.prototype.clear = function () {
  var el = this.el;
  if (el && el.parentNode) {
    el.parentNode.removeChild(el);
  }
}

function createElement(options, closable) {
  var className = 'notice-item' + (options.type
    ? ' notice-' + options.type
    : '');
  var item = create({className: className});
  create({
    className: 'notice-content',
    html: options.message,
    parent: item
  });

  if (closable) {
    var close = create({
      className : 'notice-close',
      html: '×',
      parent: item
    });
  }

  return item;
}

function dismiss(el) {
  classes(el).add('notice-dismiss');
  setTimeout(function() {
    if (el && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  }, 200);
}

module.exports = Notice;
