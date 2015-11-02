require('../notice.css')
function $(id) { return document.getElementById(id) };
var notice = require('..');
$('show').onclick = function() {
  notice('Show a simple message');
};
$('hide').onclick = function() {
notice('Show auto hide message', {
  duration: 2000
});
};
$('warning').onclick = function() {
  notice('warning notice', {type: 'warning'});
};
$('success').onclick = function() {
  notice('success notice', {type: 'success'});
};
$('error').onclick = function() {
  notice('error notice', {type: 'error'});
};

document.body.addEventListener('click', function(e) {
  console.log('click');
}, false);
