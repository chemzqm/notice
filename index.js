/**
 * Notice
 *
 * A notice message at the top of a webpage.
 *
 */

var classes = require('classes')
var events = require('event')
var query = require('query')
var tap = require('tap')

var hasTouch = 'ontouchend' in window
var zIndex = 999

function create(o) {
  var el = document.createElement(o.tag || 'div')
  el.className = o.className
  el.innerHTML = o.html || ''
  if (o.parent) o.parent.appendChild(el)
  return el
}
var container

function Notice(msg, options) {
  if (! (this instanceof Notice)) return new Notice(msg, options)
  options = options || {}
  if (!container) {
    container = create({
      className: 'notice-container',
      parent: options.parent || document.body
    })
  }
  if (options.type == 'success') options.duration = options.duration || 2000
  var closable = options.hasOwnProperty('closable')? options.closable : true
  var duration = options.duration
  if (!closable && duration == null) duration = 2000
  options.message = msg
  var el = createElement(options, closable)
  el.style.zIndex = -- zIndex
  this.el = el
  container.appendChild(this.el)
  this.closeEl = query('.notice-close', el)
  this._hideFn = this.hide.bind(this)
  if (hasTouch) {
    this._tap = tap(this.closeEl, this._hideFn)
  } else {
    events.bind(this.closeEl, 'click', this._hideFn)
  }
  if (duration) {
    setTimeout(this.hide.bind(this), duration)
  }
}

Notice.prototype.hide = function(e) {
  if (e) {
    e.preventDefault()
    e.stopPropagation()
  }
  if (this._hide) return
  this._hide = true
  var self = this
  if (this._tap) {
    this._tap.unbind()
  } else {
    events.bind(this.closeEl, 'click', this._hideFn)
  }
  dismiss(this.el)
}

Notice.prototype.clear = function () {
  var el = this.el
  if (el && el.parentNode) {
    el.parentNode.removeChild(el)
  }
}

function createElement(options, closable) {
  var className = 'notice-item' + (options.type
    ? ' notice-' + options.type
    : '')
  var item = create({className: className})
  create({
    className: 'notice-content',
    html: options.message,
    parent: item
  })

  if (closable) {
    var close = create({
      className : 'notice-close',
      html: '×',
      parent: item
    })
  }

  return item
}

function dismiss(el) {
  classes(el).add('notice-dismiss')
  setTimeout(function() {
    if (el && el.parentNode) {
      el.parentNode.removeChild(el)
    }
  }, 200)
}

module.exports = Notice
