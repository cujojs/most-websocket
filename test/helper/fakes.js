/** @license MIT License (c) copyright 2016 original author or authors */

export function FakeEventTarget () {
  this._events = {}
}

FakeEventTarget.prototype.emit = function (e, x) {
  const handler = this._events[e]

  if (typeof handler !== 'function') {
    return
  }

  handler(x)
}

FakeEventTarget.prototype.addEventListener = function (e, handler) {
  this._events[e] = handler
}

FakeEventTarget.prototype.removeEventListener = function (e, handler) {
  if (handler !== this._events[e]) {
    throw new Error('removed wrong handler')
  }

  this._events[e] = void 0
}

export function FakeEventSource () {
  FakeEventTarget.call(this)
  this.isOpen = true
}

FakeEventSource.prototype = Object.create(FakeEventTarget.prototype)

FakeEventSource.prototype.close = function () {
  if (!this.isOpen) {
    throw new Error('closed more than once')
  }

  this.isOpen = false
  this.emit('close', void 0)
}

export function FakeWebSocket () {
  FakeEventSource.call(this)
}

FakeWebSocket.prototype = Object.create(FakeEventSource.prototype)

FakeWebSocket.prototype.send = function (x) {
  this.emit('message', x)
}

export function FakeMessagePort () {
  FakeEventTarget.call(this)
}

FakeMessagePort.prototype = Object.create(FakeEventTarget.prototype)

FakeMessagePort.prototype.postMessage = function (x) {
  this.emit('message', x)
}
