/*global describe,it*/
var notice = require('notice');
var assert = require('assert');
var styles = window.getComputedStyle;

describe('notice', function () {

  it('should create new notice', function () {
    var n = notice('test');
    assert(/\bnotice-item\b/.test(n.el.className));
    n.hide();
  })

  it('should be created with html', function () {
    var n = notice('<div class="danger">test<div>');
    assert(n.el.querySelector('.danger') !== null);
    n.hide();
  })

  it('should be shown', function () {
    var n = notice('test');
    assert(styles(n.el).display == 'block');
    n.hide();
  })

  it('should removed by hide', function (done) {
    var n = notice('test');
    n.hide();
    setTimeout(function() {
      assert(null === n.el.parentNode);
      done();
    }, 300);
  })

})
