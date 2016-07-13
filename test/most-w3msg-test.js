/** @license MIT License (c) copyright 2016 original author or authors */

import {describe, it} from 'mocha'
import assert from 'assert'
import sinon from 'sinon'

import * as fakes from './helper/fakes'
import * as mostW3msg from '../src/most-w3msg'

const sentinel = { value: 'sentinel' }

describe('most-w3msg', () => {
  describe('fromWebSocket', () => {
    it('should contain messages received by WebSocket', done => {
      const observer = sinon.spy()
      const ws = new fakes.FakeWebSocket()
      const s = mostW3msg.fromWebSocket(ws, ws.close.bind(ws))

      setTimeout(() => ws.send(sentinel), 0)

      return s.take(1).observe(observer).then(() => {
        assert.strictEqual(observer.callCount, 1)
        assert(observer.calledWith(sentinel))
        done()
      })
    })

    it('should call disposer when stream ends', done => {
      const observer = sinon.spy()
      const ws = new fakes.FakeWebSocket()
      const s = mostW3msg.fromWebSocket(ws, observer)

      setTimeout(() => {
        ws.send(sentinel)
      }, 0)

      return s.take(1).drain().then(() => {
        assert.strictEqual(observer.callCount, 1)
        done()
      })
    })
  })

  describe('fromEventSource', () => {
    it('should contain messages received by EventSource', done => {
      const observer = sinon.spy()
      const es = new fakes.FakeEventSource()
      const s = mostW3msg.fromEventSource(es, es.close.bind(es))

      setTimeout(() => {
        es.emit('message', sentinel)
      }, 0)

      return s.take(1).observe(observer).then(() => {
        assert.strictEqual(observer.callCount, 1)
        assert(observer.calledWith(sentinel))
        done()
      })
    })

    it('should call disposer when stream ends', done => {
      const observer = sinon.spy()
      const es = new fakes.FakeEventSource()
      const s = mostW3msg.fromEventSource(es, observer)

      setTimeout(() => {
        es.emit('message', sentinel)
      }, 0)

      return s.take(1).drain().then(() => {
        assert.strictEqual(observer.callCount, 1)
        done()
      })
    })
  })

  describe('fromEventSourceOn', () => {
    it('should contain events received by EventSource', done => {
      const observer = sinon.spy()
      const es = new fakes.FakeEventSource()
      const s = mostW3msg.fromEventSourceOn('test', es, es.close.bind(es))

      setTimeout(() => es.emit('test', sentinel), 0)

      return s.take(1).observe(observer).then(() => {
        assert.strictEqual(observer.callCount, 1)
        assert(observer.calledWith(sentinel))
        done()
      })
    })
  })
})
