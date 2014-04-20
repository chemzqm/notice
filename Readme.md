# notice

A notification message component.

A fork with API rework from [yuehu/notice](https://github.com/yuehu/notice).

Showcase at <http://chemzqm.github.io/notice/>.

## Installation

Install with [component(1)](http://component.io):

    $ component install chemzqm/notice

## API

```js
var Notice = require('notice');
var notice = new Notice('show a notice', {
  type: 'success'
})
notice.hide(4000);
```

### notice(msg, [option])

Show notice with `msg` (String or HTML) and optional option.

* `option.type` could be `success` `warning` `error`.

### .hide([ms])

Hide the message in `ms` millisecond, success notice implies auto hide.

### .remove()

Remove the message without animation.

## License

  MIT
