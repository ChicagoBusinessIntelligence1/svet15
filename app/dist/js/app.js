define("famous/core/Entity", ["require", "exports", "module"], function (require, exports, module) {
    function get(id) {
        return entities[id]
    }

    function set(id, entity) {
        entities[id] = entity
    }

    function register(entity) {
        var id = entities.length;
        return set(id, entity), id
    }

    function unregister(id) {
        set(id, null)
    }

    var entities = [];
    module.exports = {register: register, unregister: unregister, get: get, set: set}
}), define("famous/core/Transform", ["require", "exports", "module"], function (require, exports, module) {
    function _normSquared(v) {
        return 2 === v.length ? v[0] * v[0] + v[1] * v[1] : v[0] * v[0] + v[1] * v[1] + v[2] * v[2]
    }

    function _norm(v) {
        return Math.sqrt(_normSquared(v))
    }

    function _sign(n) {
        return 0 > n ? -1 : 1
    }

    var Transform = {};
    Transform.precision = 1e-6, Transform.identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], Transform.multiply4x4 = function (a, b) {
        return [a[0] * b[0] + a[4] * b[1] + a[8] * b[2] + a[12] * b[3], a[1] * b[0] + a[5] * b[1] + a[9] * b[2] + a[13] * b[3], a[2] * b[0] + a[6] * b[1] + a[10] * b[2] + a[14] * b[3], a[3] * b[0] + a[7] * b[1] + a[11] * b[2] + a[15] * b[3], a[0] * b[4] + a[4] * b[5] + a[8] * b[6] + a[12] * b[7], a[1] * b[4] + a[5] * b[5] + a[9] * b[6] + a[13] * b[7], a[2] * b[4] + a[6] * b[5] + a[10] * b[6] + a[14] * b[7], a[3] * b[4] + a[7] * b[5] + a[11] * b[6] + a[15] * b[7], a[0] * b[8] + a[4] * b[9] + a[8] * b[10] + a[12] * b[11], a[1] * b[8] + a[5] * b[9] + a[9] * b[10] + a[13] * b[11], a[2] * b[8] + a[6] * b[9] + a[10] * b[10] + a[14] * b[11], a[3] * b[8] + a[7] * b[9] + a[11] * b[10] + a[15] * b[11], a[0] * b[12] + a[4] * b[13] + a[8] * b[14] + a[12] * b[15], a[1] * b[12] + a[5] * b[13] + a[9] * b[14] + a[13] * b[15], a[2] * b[12] + a[6] * b[13] + a[10] * b[14] + a[14] * b[15], a[3] * b[12] + a[7] * b[13] + a[11] * b[14] + a[15] * b[15]]
    }, Transform.multiply = function (a, b) {
        return [a[0] * b[0] + a[4] * b[1] + a[8] * b[2], a[1] * b[0] + a[5] * b[1] + a[9] * b[2], a[2] * b[0] + a[6] * b[1] + a[10] * b[2], 0, a[0] * b[4] + a[4] * b[5] + a[8] * b[6], a[1] * b[4] + a[5] * b[5] + a[9] * b[6], a[2] * b[4] + a[6] * b[5] + a[10] * b[6], 0, a[0] * b[8] + a[4] * b[9] + a[8] * b[10], a[1] * b[8] + a[5] * b[9] + a[9] * b[10], a[2] * b[8] + a[6] * b[9] + a[10] * b[10], 0, a[0] * b[12] + a[4] * b[13] + a[8] * b[14] + a[12], a[1] * b[12] + a[5] * b[13] + a[9] * b[14] + a[13], a[2] * b[12] + a[6] * b[13] + a[10] * b[14] + a[14], 1]
    }, Transform.thenMove = function (m, t) {
        return t[2] || (t[2] = 0), [m[0], m[1], m[2], 0, m[4], m[5], m[6], 0, m[8], m[9], m[10], 0, m[12] + t[0], m[13] + t[1], m[14] + t[2], 1]
    }, Transform.moveThen = function (v, m) {
        v[2] || (v[2] = 0);
        var t0 = v[0] * m[0] + v[1] * m[4] + v[2] * m[8], t1 = v[0] * m[1] + v[1] * m[5] + v[2] * m[9], t2 = v[0] * m[2] + v[1] * m[6] + v[2] * m[10];
        return Transform.thenMove(m, [t0, t1, t2])
    }, Transform.translate = function (x, y, z) {
        return void 0 === z && (z = 0), [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]
    }, Transform.thenScale = function (m, s) {
        return [s[0] * m[0], s[1] * m[1], s[2] * m[2], 0, s[0] * m[4], s[1] * m[5], s[2] * m[6], 0, s[0] * m[8], s[1] * m[9], s[2] * m[10], 0, s[0] * m[12], s[1] * m[13], s[2] * m[14], 1]
    }, Transform.scale = function (x, y, z) {
        return void 0 === z && (z = 1), void 0 === y && (y = x), [x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1]
    }, Transform.rotateX = function (theta) {
        var cosTheta = Math.cos(theta), sinTheta = Math.sin(theta);
        return [1, 0, 0, 0, 0, cosTheta, sinTheta, 0, 0, -sinTheta, cosTheta, 0, 0, 0, 0, 1]
    }, Transform.rotateY = function (theta) {
        var cosTheta = Math.cos(theta), sinTheta = Math.sin(theta);
        return [cosTheta, 0, -sinTheta, 0, 0, 1, 0, 0, sinTheta, 0, cosTheta, 0, 0, 0, 0, 1]
    }, Transform.rotateZ = function (theta) {
        var cosTheta = Math.cos(theta), sinTheta = Math.sin(theta);
        return [cosTheta, sinTheta, 0, 0, -sinTheta, cosTheta, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
    }, Transform.rotate = function (phi, theta, psi) {
        var cosPhi = Math.cos(phi), sinPhi = Math.sin(phi), cosTheta = Math.cos(theta), sinTheta = Math.sin(theta), cosPsi = Math.cos(psi), sinPsi = Math.sin(psi), result = [cosTheta * cosPsi, cosPhi * sinPsi + sinPhi * sinTheta * cosPsi, sinPhi * sinPsi - cosPhi * sinTheta * cosPsi, 0, -cosTheta * sinPsi, cosPhi * cosPsi - sinPhi * sinTheta * sinPsi, sinPhi * cosPsi + cosPhi * sinTheta * sinPsi, 0, sinTheta, -sinPhi * cosTheta, cosPhi * cosTheta, 0, 0, 0, 0, 1];
        return result
    }, Transform.rotateAxis = function (v, theta) {
        var sinTheta = Math.sin(theta), cosTheta = Math.cos(theta), verTheta = 1 - cosTheta, xxV = v[0] * v[0] * verTheta, xyV = v[0] * v[1] * verTheta, xzV = v[0] * v[2] * verTheta, yyV = v[1] * v[1] * verTheta, yzV = v[1] * v[2] * verTheta, zzV = v[2] * v[2] * verTheta, xs = v[0] * sinTheta, ys = v[1] * sinTheta, zs = v[2] * sinTheta, result = [xxV + cosTheta, xyV + zs, xzV - ys, 0, xyV - zs, yyV + cosTheta, yzV + xs, 0, xzV + ys, yzV - xs, zzV + cosTheta, 0, 0, 0, 0, 1];
        return result
    }, Transform.aboutOrigin = function (v, m) {
        var t0 = v[0] - (v[0] * m[0] + v[1] * m[4] + v[2] * m[8]), t1 = v[1] - (v[0] * m[1] + v[1] * m[5] + v[2] * m[9]), t2 = v[2] - (v[0] * m[2] + v[1] * m[6] + v[2] * m[10]);
        return Transform.thenMove(m, [t0, t1, t2])
    }, Transform.skew = function (phi, theta, psi) {
        return [1, Math.tan(theta), 0, 0, Math.tan(psi), 1, 0, 0, 0, Math.tan(phi), 1, 0, 0, 0, 0, 1]
    }, Transform.skewX = function (angle) {
        return [1, 0, 0, 0, Math.tan(angle), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
    }, Transform.skewY = function (angle) {
        return [1, Math.tan(angle), 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
    }, Transform.perspective = function (focusZ) {
        return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, -1 / focusZ, 0, 0, 0, 1]
    }, Transform.getTranslate = function (m) {
        return [m[12], m[13], m[14]]
    }, Transform.inverse = function (m) {
        var c0 = m[5] * m[10] - m[6] * m[9], c1 = m[4] * m[10] - m[6] * m[8], c2 = m[4] * m[9] - m[5] * m[8], c4 = m[1] * m[10] - m[2] * m[9], c5 = m[0] * m[10] - m[2] * m[8], c6 = m[0] * m[9] - m[1] * m[8], c8 = m[1] * m[6] - m[2] * m[5], c9 = m[0] * m[6] - m[2] * m[4], c10 = m[0] * m[5] - m[1] * m[4], detM = m[0] * c0 - m[1] * c1 + m[2] * c2, invD = 1 / detM, result = [invD * c0, -invD * c4, invD * c8, 0, -invD * c1, invD * c5, -invD * c9, 0, invD * c2, -invD * c6, invD * c10, 0, 0, 0, 0, 1];
        return result[12] = -m[12] * result[0] - m[13] * result[4] - m[14] * result[8], result[13] = -m[12] * result[1] - m[13] * result[5] - m[14] * result[9], result[14] = -m[12] * result[2] - m[13] * result[6] - m[14] * result[10], result
    }, Transform.transpose = function (m) {
        return [m[0], m[4], m[8], m[12], m[1], m[5], m[9], m[13], m[2], m[6], m[10], m[14], m[3], m[7], m[11], m[15]]
    }, Transform.interpret = function (M) {
        var x = [M[0], M[1], M[2]], sgn = _sign(x[0]), xNorm = _norm(x), v = [x[0] + sgn * xNorm, x[1], x[2]], mult = 2 / _normSquared(v);
        if (mult >= 1 / 0)return {
            translate: Transform.getTranslate(M),
            rotate: [0, 0, 0],
            scale: [0, 0, 0],
            skew: [0, 0, 0]
        };
        var Q1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
        Q1[0] = 1 - mult * v[0] * v[0], Q1[5] = 1 - mult * v[1] * v[1], Q1[10] = 1 - mult * v[2] * v[2], Q1[1] = -mult * v[0] * v[1], Q1[2] = -mult * v[0] * v[2], Q1[6] = -mult * v[1] * v[2], Q1[4] = Q1[1], Q1[8] = Q1[2], Q1[9] = Q1[6];
        var MQ1 = Transform.multiply(Q1, M), x2 = [MQ1[5], MQ1[6]], sgn2 = _sign(x2[0]), x2Norm = _norm(x2), v2 = [x2[0] + sgn2 * x2Norm, x2[1]], mult2 = 2 / _normSquared(v2), Q2 = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
        Q2[5] = 1 - mult2 * v2[0] * v2[0], Q2[10] = 1 - mult2 * v2[1] * v2[1], Q2[6] = -mult2 * v2[0] * v2[1], Q2[9] = Q2[6];
        var Q = Transform.multiply(Q2, Q1), R = Transform.multiply(Q, M), remover = Transform.scale(R[0] < 0 ? -1 : 1, R[5] < 0 ? -1 : 1, R[10] < 0 ? -1 : 1);
        R = Transform.multiply(R, remover), Q = Transform.multiply(remover, Q);
        var result = {};
        return result.translate = Transform.getTranslate(M), result.rotate = [Math.atan2(-Q[6], Q[10]), Math.asin(Q[2]), Math.atan2(-Q[1], Q[0])], result.rotate[0] || (result.rotate[0] = 0, result.rotate[2] = Math.atan2(Q[4], Q[5])), result.scale = [R[0], R[5], R[10]], result.skew = [Math.atan2(R[9], result.scale[2]), Math.atan2(R[8], result.scale[2]), Math.atan2(R[4], result.scale[0])], Math.abs(result.rotate[0]) + Math.abs(result.rotate[2]) > 1.5 * Math.PI && (result.rotate[1] = Math.PI - result.rotate[1], result.rotate[1] > Math.PI && (result.rotate[1] -= 2 * Math.PI), result.rotate[1] < -Math.PI && (result.rotate[1] += 2 * Math.PI), result.rotate[0] < 0 ? result.rotate[0] += Math.PI : result.rotate[0] -= Math.PI, result.rotate[2] < 0 ? result.rotate[2] += Math.PI : result.rotate[2] -= Math.PI), result
    }, Transform.average = function (M1, M2, t) {
        t = void 0 === t ? .5 : t;
        for (var specM1 = Transform.interpret(M1), specM2 = Transform.interpret(M2), specAvg = {
            translate: [0, 0, 0],
            rotate: [0, 0, 0],
            scale: [0, 0, 0],
            skew: [0, 0, 0]
        }, i = 0; 3 > i; i++)specAvg.translate[i] = (1 - t) * specM1.translate[i] + t * specM2.translate[i], specAvg.rotate[i] = (1 - t) * specM1.rotate[i] + t * specM2.rotate[i], specAvg.scale[i] = (1 - t) * specM1.scale[i] + t * specM2.scale[i], specAvg.skew[i] = (1 - t) * specM1.skew[i] + t * specM2.skew[i];
        return Transform.build(specAvg)
    }, Transform.build = function (spec) {
        var scaleMatrix = Transform.scale(spec.scale[0], spec.scale[1], spec.scale[2]), skewMatrix = Transform.skew(spec.skew[0], spec.skew[1], spec.skew[2]), rotateMatrix = Transform.rotate(spec.rotate[0], spec.rotate[1], spec.rotate[2]);
        return Transform.thenMove(Transform.multiply(Transform.multiply(rotateMatrix, skewMatrix), scaleMatrix), spec.translate)
    }, Transform.equals = function (a, b) {
        return !Transform.notEquals(a, b)
    }, Transform.notEquals = function (a, b) {
        return a === b ? !1 : !(a && b) || a[12] !== b[12] || a[13] !== b[13] || a[14] !== b[14] || a[0] !== b[0] || a[1] !== b[1] || a[2] !== b[2] || a[4] !== b[4] || a[5] !== b[5] || a[6] !== b[6] || a[8] !== b[8] || a[9] !== b[9] || a[10] !== b[10]
    }, Transform.normalizeRotation = function (rotation) {
        var result = rotation.slice(0);
        for ((result[0] === .5 * Math.PI || result[0] === .5 * -Math.PI) && (result[0] = -result[0], result[1] = Math.PI - result[1], result[2] -= Math.PI), result[0] > .5 * Math.PI && (result[0] = result[0] - Math.PI, result[1] = Math.PI - result[1], result[2] -= Math.PI), result[0] < .5 * -Math.PI && (result[0] = result[0] + Math.PI, result[1] = -Math.PI - result[1], result[2] -= Math.PI); result[1] < -Math.PI;)result[1] += 2 * Math.PI;
        for (; result[1] >= Math.PI;)result[1] -= 2 * Math.PI;
        for (; result[2] < -Math.PI;)result[2] += 2 * Math.PI;
        for (; result[2] >= Math.PI;)result[2] -= 2 * Math.PI;
        return result
    }, Transform.inFront = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, .001, 1], Transform.behind = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -.001, 1], module.exports = Transform
}), define("famous/core/SpecParser", ["require", "exports", "module", "./Transform"], function (require, exports, module) {
    function SpecParser() {
        this.result = {}
    }

    function _vecInContext(v, m) {
        return [v[0] * m[0] + v[1] * m[4] + v[2] * m[8], v[0] * m[1] + v[1] * m[5] + v[2] * m[9], v[0] * m[2] + v[1] * m[6] + v[2] * m[10]]
    }

    var Transform = require("./Transform");
    SpecParser._instance = new SpecParser, SpecParser.parse = function (spec, context) {
        return SpecParser._instance.parse(spec, context)
    }, SpecParser.prototype.parse = function (spec, context) {
        return this.reset(), this._parseSpec(spec, context, Transform.identity), this.result
    }, SpecParser.prototype.reset = function () {
        this.result = {}
    };
    var _zeroZero = [0, 0];
    SpecParser.prototype._parseSpec = function (spec, parentContext, sizeContext) {
        var id, target, transform, opacity, origin, align, size;
        if ("number" == typeof spec) {
            if (id = spec, transform = parentContext.transform, align = parentContext.align || _zeroZero, parentContext.size && align && (align[0] || align[1])) {
                var alignAdjust = [align[0] * parentContext.size[0], align[1] * parentContext.size[1], 0];
                transform = Transform.thenMove(transform, _vecInContext(alignAdjust, sizeContext))
            }
            this.result[id] = {
                transform: transform,
                opacity: parentContext.opacity,
                origin: parentContext.origin || _zeroZero,
                align: parentContext.align || _zeroZero,
                size: parentContext.size
            }
        } else {
            if (!spec)return;
            if (spec instanceof Array)for (var i = 0; i < spec.length; i++)this._parseSpec(spec[i], parentContext, sizeContext); else {
                target = spec.target, transform = parentContext.transform, opacity = parentContext.opacity, origin = parentContext.origin, align = parentContext.align, size = parentContext.size;
                var nextSizeContext = sizeContext;
                if (void 0 !== spec.opacity && (opacity = parentContext.opacity * spec.opacity), spec.transform && (transform = Transform.multiply(parentContext.transform, spec.transform)), spec.origin && (origin = spec.origin, nextSizeContext = parentContext.transform), spec.align && (align = spec.align), spec.size || spec.proportions) {
                    var parentSize = size;
                    size = [size[0], size[1]], spec.size && (void 0 !== spec.size[0] && (size[0] = spec.size[0]), void 0 !== spec.size[1] && (size[1] = spec.size[1])), spec.proportions && (void 0 !== spec.proportions[0] && (size[0] = size[0] * spec.proportions[0]), void 0 !== spec.proportions[1] && (size[1] = size[1] * spec.proportions[1])), parentSize && (align && (align[0] || align[1]) && (transform = Transform.thenMove(transform, _vecInContext([align[0] * parentSize[0], align[1] * parentSize[1], 0], sizeContext))), origin && (origin[0] || origin[1]) && (transform = Transform.moveThen([-origin[0] * size[0], -origin[1] * size[1], 0], transform))), nextSizeContext = parentContext.transform, origin = null, align = null
                }
                this._parseSpec(target, {
                    transform: transform,
                    opacity: opacity,
                    origin: origin,
                    align: align,
                    size: size
                }, nextSizeContext)
            }
        }
    }, module.exports = SpecParser
}), define("famous/core/RenderNode", ["require", "exports", "module", "./Entity", "./SpecParser"], function (require, exports, module) {
    function RenderNode(object) {
        this._object = null, this._child = null, this._hasMultipleChildren = !1, this._isRenderable = !1, this._isModifier = !1, this._resultCache = {}, this._prevResults = {}, this._childResult = null, object && this.set(object)
    }

    function _applyCommit(spec, context, cacheStorage) {
        for (var result = SpecParser.parse(spec, context), keys = Object.keys(result), i = 0; i < keys.length; i++) {
            var id = keys[i], childNode = Entity.get(id), commitParams = result[id];
            commitParams.allocator = context.allocator;
            var commitResult = childNode.commit(commitParams);
            commitResult ? _applyCommit(commitResult, context, cacheStorage) : cacheStorage[id] = commitParams
        }
    }

    var Entity = require("./Entity"), SpecParser = require("./SpecParser");
    RenderNode.prototype.add = function (child) {
        var childNode = child instanceof RenderNode ? child : new RenderNode(child);
        return this._child instanceof Array ? this._child.push(childNode) : this._child ? (this._child = [this._child, childNode], this._hasMultipleChildren = !0, this._childResult = []) : this._child = childNode, childNode
    }, RenderNode.prototype.get = function () {
        return this._object || (this._hasMultipleChildren ? null : this._child ? this._child.get() : null)
    }, RenderNode.prototype.set = function (child) {
        return this._childResult = null, this._hasMultipleChildren = !1, this._isRenderable = child.render ? !0 : !1, this._isModifier = child.modify ? !0 : !1, this._object = child, this._child = null, child instanceof RenderNode ? child : this
    }, RenderNode.prototype.getSize = function () {
        var result = null, target = this.get();
        return target && target.getSize && (result = target.getSize()), !result && this._child && this._child.getSize && (result = this._child.getSize()), result
    }, RenderNode.prototype.commit = function (context) {
        for (var prevKeys = Object.keys(this._prevResults), i = 0; i < prevKeys.length; i++) {
            var id = prevKeys[i];
            if (void 0 === this._resultCache[id]) {
                var object = Entity.get(id);
                object.cleanup && object.cleanup(context.allocator)
            }
        }
        this._prevResults = this._resultCache, this._resultCache = {}, _applyCommit(this.render(), context, this._resultCache)
    }, RenderNode.prototype.render = function () {
        if (this._isRenderable)return this._object.render();
        var result = null;
        if (this._hasMultipleChildren) {
            result = this._childResult;
            for (var children = this._child, i = 0; i < children.length; i++)result[i] = children[i].render()
        } else this._child && (result = this._child.render());
        return this._isModifier ? this._object.modify(result) : result
    }, module.exports = RenderNode
}), define("famous/core/EventEmitter", ["require", "exports", "module"], function (require, exports, module) {
    function EventEmitter() {
        this.listeners = {}, this._owner = this
    }

    EventEmitter.prototype.emit = function (type, event) {
        var handlers = this.listeners[type];
        if (handlers)for (var i = 0; i < handlers.length; i++)handlers[i].call(this._owner, event);
        return this
    }, EventEmitter.prototype.on = function (type, handler) {
        type in this.listeners || (this.listeners[type] = []);
        var index = this.listeners[type].indexOf(handler);
        return 0 > index && this.listeners[type].push(handler), this
    }, EventEmitter.prototype.addListener = EventEmitter.prototype.on, EventEmitter.prototype.removeListener = function (type, handler) {
        var listener = this.listeners[type];
        if (void 0 !== listener) {
            var index = listener.indexOf(handler);
            index >= 0 && listener.splice(index, 1)
        }
        return this
    }, EventEmitter.prototype.bindThis = function (owner) {
        this._owner = owner
    }, module.exports = EventEmitter
}), define("famous/core/EventHandler", ["require", "exports", "module", "./EventEmitter"], function (require, exports, module) {
    function EventHandler() {
        EventEmitter.apply(this, arguments), this.downstream = [], this.downstreamFn = [], this.upstream = [], this.upstreamListeners = {}
    }

    var EventEmitter = require("./EventEmitter");
    EventHandler.prototype = Object.create(EventEmitter.prototype), EventHandler.prototype.constructor = EventHandler, EventHandler.setInputHandler = function (object, handler) {
        object.trigger = handler.trigger.bind(handler), handler.subscribe && handler.unsubscribe && (object.subscribe = handler.subscribe.bind(handler), object.unsubscribe = handler.unsubscribe.bind(handler))
    }, EventHandler.setOutputHandler = function (object, handler) {
        handler instanceof EventHandler && handler.bindThis(object), object.pipe = handler.pipe.bind(handler), object.unpipe = handler.unpipe.bind(handler), object.on = handler.on.bind(handler), object.addListener = object.on, object.removeListener = handler.removeListener.bind(handler)
    }, EventHandler.prototype.emit = function (type, event) {
        EventEmitter.prototype.emit.apply(this, arguments);
        var i = 0;
        for (i = 0; i < this.downstream.length; i++)this.downstream[i].trigger && this.downstream[i].trigger(type, event);
        for (i = 0; i < this.downstreamFn.length; i++)this.downstreamFn[i](type, event);
        return this
    }, EventHandler.prototype.trigger = EventHandler.prototype.emit, EventHandler.prototype.pipe = function (target) {
        if (target.subscribe instanceof Function)return target.subscribe(this);
        var downstreamCtx = target instanceof Function ? this.downstreamFn : this.downstream, index = downstreamCtx.indexOf(target);
        return 0 > index && downstreamCtx.push(target), target instanceof Function ? target("pipe", null) : target.trigger && target.trigger("pipe", null), target
    }, EventHandler.prototype.unpipe = function (target) {
        if (target.unsubscribe instanceof Function)return target.unsubscribe(this);
        var downstreamCtx = target instanceof Function ? this.downstreamFn : this.downstream, index = downstreamCtx.indexOf(target);
        return index >= 0 ? (downstreamCtx.splice(index, 1), target instanceof Function ? target("unpipe", null) : target.trigger && target.trigger("unpipe", null), target) : !1
    }, EventHandler.prototype.on = function (type) {
        if (EventEmitter.prototype.on.apply(this, arguments), !(type in this.upstreamListeners)) {
            var upstreamListener = this.trigger.bind(this, type);
            this.upstreamListeners[type] = upstreamListener;
            for (var i = 0; i < this.upstream.length; i++)this.upstream[i].on(type, upstreamListener)
        }
        return this
    }, EventHandler.prototype.addListener = EventHandler.prototype.on, EventHandler.prototype.subscribe = function (source) {
        var index = this.upstream.indexOf(source);
        if (0 > index) {
            this.upstream.push(source);
            for (var type in this.upstreamListeners)source.on(type, this.upstreamListeners[type])
        }
        return this
    }, EventHandler.prototype.unsubscribe = function (source) {
        var index = this.upstream.indexOf(source);
        if (index >= 0) {
            this.upstream.splice(index, 1);
            for (var type in this.upstreamListeners)source.removeListener(type, this.upstreamListeners[type])
        }
        return this
    }, module.exports = EventHandler
}), define("famous/core/ElementAllocator", ["require", "exports", "module"], function (require, exports, module) {
    function ElementAllocator(container) {
        container || (container = document.createDocumentFragment()), this.container = container, this.detachedNodes = {}, this.nodeCount = 0
    }

    ElementAllocator.prototype.migrate = function (container) {
        var oldContainer = this.container;
        if (container !== oldContainer) {
            if (oldContainer instanceof DocumentFragment)container.appendChild(oldContainer); else for (; oldContainer.hasChildNodes();)container.appendChild(oldContainer.firstChild);
            this.container = container
        }
    }, ElementAllocator.prototype.allocate = function (type) {
        type = type.toLowerCase(), type in this.detachedNodes || (this.detachedNodes[type] = []);
        var result, nodeStore = this.detachedNodes[type];
        return nodeStore.length > 0 ? result = nodeStore.pop() : (result = document.createElement(type), this.container.appendChild(result)), this.nodeCount++, result
    }, ElementAllocator.prototype.deallocate = function (element) {
        var nodeType = element.nodeName.toLowerCase(), nodeStore = this.detachedNodes[nodeType];
        nodeStore.push(element), this.nodeCount--
    }, ElementAllocator.prototype.getNodeCount = function () {
        return this.nodeCount
    }, module.exports = ElementAllocator
}), define("famous/utilities/Utility", ["require", "exports", "module"], function (require, exports, module) {
    var Utility = {};
    Utility.Direction = {X: 0, Y: 1, Z: 2}, Utility.after = function (count, callback) {
        var counter = count;
        return function () {
            counter--, 0 === counter && callback.apply(this, arguments)
        }
    }, Utility.loadURL = function (url, callback) {
        var xhr = new XMLHttpRequest;
        xhr.onreadystatechange = function () {
            4 === this.readyState && callback && callback(this.responseText)
        }, xhr.open("GET", url), xhr.send()
    }, Utility.createDocumentFragmentFromHTML = function (html) {
        var element = document.createElement("div");
        element.innerHTML = html;
        for (var result = document.createDocumentFragment(); element.hasChildNodes();)result.appendChild(element.firstChild);
        return result
    }, Utility.clone = function (b) {
        var a;
        if ("object" == typeof b) {
            a = b instanceof Array ? [] : {};
            for (var key in b)if ("object" == typeof b[key] && null !== b[key])if (b[key]instanceof Array) {
                a[key] = new Array(b[key].length);
                for (var i = 0; i < b[key].length; i++)a[key][i] = Utility.clone(b[key][i])
            } else a[key] = Utility.clone(b[key]); else a[key] = b[key]
        } else a = b;
        return a
    }, module.exports = Utility
}), define("famous/transitions/MultipleTransition", ["require", "exports", "module", "../utilities/Utility"], function (require, exports, module) {
    function MultipleTransition(method) {
        this.method = method, this._instances = [], this.state = []
    }

    var Utility = require("../utilities/Utility");
    MultipleTransition.SUPPORTS_MULTIPLE = !0, MultipleTransition.prototype.get = function () {
        for (var i = 0; i < this._instances.length; i++)this.state[i] = this._instances[i].get();
        return this.state
    }, MultipleTransition.prototype.set = function (endState, transition, callback) {
        for (var _allCallback = Utility.after(endState.length, callback), i = 0; i < endState.length; i++)this._instances[i] || (this._instances[i] = new this.method), this._instances[i].set(endState[i], transition, _allCallback)
    }, MultipleTransition.prototype.reset = function (startState) {
        for (var i = 0; i < startState.length; i++)this._instances[i] || (this._instances[i] = new this.method), this._instances[i].reset(startState[i])
    }, module.exports = MultipleTransition
}), define("famous/transitions/TweenTransition", ["require", "exports", "module"], function (require, exports, module) {
    function TweenTransition(options) {
        this.options = Object.create(TweenTransition.DEFAULT_OPTIONS), options && this.setOptions(options), this._startTime = 0, this._startValue = 0, this._updateTime = 0, this._endValue = 0, this._curve = void 0, this._duration = 0, this._active = !1, this._callback = void 0, this.state = 0, this.velocity = void 0
    }

    function _interpolate(a, b, t) {
        return (1 - t) * a + t * b
    }

    function _clone(obj) {
        return obj instanceof Object ? obj instanceof Array ? obj.slice(0) : Object.create(obj) : obj
    }

    function _normalize(transition, defaultTransition) {
        var result = {curve: defaultTransition.curve};
        return defaultTransition.duration && (result.duration = defaultTransition.duration), defaultTransition.speed && (result.speed = defaultTransition.speed), transition instanceof Object && (void 0 !== transition.duration && (result.duration = transition.duration), transition.curve && (result.curve = transition.curve), transition.speed && (result.speed = transition.speed)), "string" == typeof result.curve && (result.curve = TweenTransition.getCurve(result.curve)), result
    }

    function _calculateVelocity(current, start, curve, duration, t) {
        var velocity, eps = 1e-7, speed = (curve(t) - curve(t - eps)) / eps;
        if (current instanceof Array) {
            velocity = [];
            for (var i = 0; i < current.length; i++)velocity[i] = "number" == typeof current[i] ? speed * (current[i] - start[i]) / duration : 0
        } else velocity = speed * (current - start) / duration;
        return velocity
    }

    function _calculateState(start, end, t) {
        var state;
        if (start instanceof Array) {
            state = [];
            for (var i = 0; i < start.length; i++)state[i] = "number" == typeof start[i] ? _interpolate(start[i], end[i], t) : start[i]
        } else state = _interpolate(start, end, t);
        return state
    }

    TweenTransition.Curves = {
        linear: function (t) {
            return t
        }, easeIn: function (t) {
            return t * t
        }, easeOut: function (t) {
            return t * (2 - t)
        }, easeInOut: function (t) {
            return .5 >= t ? 2 * t * t : -2 * t * t + 4 * t - 1
        }, easeOutBounce: function (t) {
            return t * (3 - 2 * t)
        }, spring: function (t) {
            return (1 - t) * Math.sin(6 * Math.PI * t) + t
        }
    }, TweenTransition.SUPPORTS_MULTIPLE = !0, TweenTransition.DEFAULT_OPTIONS = {
        curve: TweenTransition.Curves.linear,
        duration: 500,
        speed: 0
    };
    var registeredCurves = {};
    TweenTransition.registerCurve = function (curveName, curve) {
        return registeredCurves[curveName] ? !1 : (registeredCurves[curveName] = curve, !0)
    }, TweenTransition.unregisterCurve = function (curveName) {
        return registeredCurves[curveName] ? (delete registeredCurves[curveName], !0) : !1
    }, TweenTransition.getCurve = function (curveName) {
        var curve = registeredCurves[curveName];
        if (void 0 !== curve)return curve;
        throw new Error("curve not registered")
    }, TweenTransition.getCurves = function () {
        return registeredCurves
    }, TweenTransition.prototype.setOptions = function (options) {
        void 0 !== options.curve && (this.options.curve = options.curve), void 0 !== options.duration && (this.options.duration = options.duration), void 0 !== options.speed && (this.options.speed = options.speed)
    }, TweenTransition.prototype.set = function (endValue, transition, callback) {
        if (!transition)return this.reset(endValue), void(callback && callback());
        if (this._startValue = _clone(this.get()), transition = _normalize(transition, this.options), transition.speed) {
            var startValue = this._startValue;
            if (startValue instanceof Object) {
                var variance = 0;
                for (var i in startValue)variance += (endValue[i] - startValue[i]) * (endValue[i] - startValue[i]);
                transition.duration = Math.sqrt(variance) / transition.speed
            } else transition.duration = Math.abs(endValue - startValue) / transition.speed
        }
        this._startTime = Date.now(), this._endValue = _clone(endValue), this._startVelocity = _clone(transition.velocity), this._duration = transition.duration, this._curve = transition.curve, this._active = !0, this._callback = callback
    }, TweenTransition.prototype.reset = function (startValue, startVelocity) {
        if (this._callback) {
            var callback = this._callback;
            this._callback = void 0, callback()
        }
        this.state = _clone(startValue), this.velocity = _clone(startVelocity), this._startTime = 0, this._duration = 0, this._updateTime = 0, this._startValue = this.state, this._startVelocity = this.velocity, this._endValue = this.state, this._active = !1
    }, TweenTransition.prototype.getVelocity = function () {
        return this.velocity
    }, TweenTransition.prototype.get = function (timestamp) {
        return this.update(timestamp), this.state
    }, TweenTransition.prototype.update = function (timestamp) {
        if (this._active) {
            if (timestamp || (timestamp = Date.now()), !(this._updateTime >= timestamp)) {
                this._updateTime = timestamp;
                var timeSinceStart = timestamp - this._startTime;
                if (timeSinceStart >= this._duration)this.state = this._endValue, this.velocity = _calculateVelocity(this.state, this._startValue, this._curve, this._duration, 1), this._active = !1; else if (0 > timeSinceStart)this.state = this._startValue, this.velocity = this._startVelocity; else {
                    var t = timeSinceStart / this._duration;
                    this.state = _calculateState(this._startValue, this._endValue, this._curve(t)), this.velocity = _calculateVelocity(this.state, this._startValue, this._curve, this._duration, t)
                }
            }
        } else if (this._callback) {
            var callback = this._callback;
            this._callback = void 0, callback()
        }
    }, TweenTransition.prototype.isActive = function () {
        return this._active
    }, TweenTransition.prototype.halt = function () {
        this.reset(this.get())
    }, TweenTransition.registerCurve("linear", TweenTransition.Curves.linear), TweenTransition.registerCurve("easeIn", TweenTransition.Curves.easeIn), TweenTransition.registerCurve("easeOut", TweenTransition.Curves.easeOut), TweenTransition.registerCurve("easeInOut", TweenTransition.Curves.easeInOut), TweenTransition.registerCurve("easeOutBounce", TweenTransition.Curves.easeOutBounce), TweenTransition.registerCurve("spring", TweenTransition.Curves.spring), TweenTransition.customCurve = function (v1, v2) {
        return v1 = v1 || 0, v2 = v2 || 0, function (t) {
            return v1 * t + (-2 * v1 - v2 + 3) * t * t + (v1 + v2 - 2) * t * t * t
        }
    }, module.exports = TweenTransition
}), define("famous/transitions/Transitionable", ["require", "exports", "module", "./MultipleTransition", "./TweenTransition"], function (require, exports, module) {
    function Transitionable(start) {
        this.currentAction = null, this.actionQueue = [], this.callbackQueue = [], this.state = 0, this.velocity = void 0, this._callback = void 0, this._engineInstance = null, this._currentMethod = null, this.set(start)
    }

    function _loadNext() {
        if (this._callback) {
            var callback = this._callback;
            this._callback = void 0, callback()
        }
        if (this.actionQueue.length <= 0)return void this.set(this.get());
        this.currentAction = this.actionQueue.shift(), this._callback = this.callbackQueue.shift();
        var method = null, endValue = this.currentAction[0], transition = this.currentAction[1];
        transition instanceof Object && transition.method ? (method = transition.method, "string" == typeof method && (method = transitionMethods[method])) : method = TweenTransition, this._currentMethod !== method && (this._engineInstance = !(endValue instanceof Object) || method.SUPPORTS_MULTIPLE === !0 || endValue.length <= method.SUPPORTS_MULTIPLE ? new method : new MultipleTransition(method), this._currentMethod = method), this._engineInstance.reset(this.state, this.velocity), void 0 !== this.velocity && (transition.velocity = this.velocity), this._engineInstance.set(endValue, transition, _loadNext.bind(this))
    }

    var MultipleTransition = require("./MultipleTransition"), TweenTransition = require("./TweenTransition"), transitionMethods = {};
    Transitionable.register = function (methods) {
        var success = !0;
        for (var method in methods)Transitionable.registerMethod(method, methods[method]) || (success = !1);
        return success
    }, Transitionable.registerMethod = function (name, engineClass) {
        return name in transitionMethods ? !1 : (transitionMethods[name] = engineClass, !0)
    }, Transitionable.unregisterMethod = function (name) {
        return name in transitionMethods ? (delete transitionMethods[name], !0) : !1
    }, Transitionable.prototype.set = function (endState, transition, callback) {
        if (!transition)return this.reset(endState), callback && callback(), this;
        var action = [endState, transition];
        return this.actionQueue.push(action), this.callbackQueue.push(callback), this.currentAction || _loadNext.call(this), this
    }, Transitionable.prototype.reset = function (startState, startVelocity) {
        this._currentMethod = null, this._engineInstance = null, this._callback = void 0, this.state = startState, this.velocity = startVelocity, this.currentAction = null, this.actionQueue = [], this.callbackQueue = []
    }, Transitionable.prototype.delay = function (duration, callback) {
        this.set(this.get(), {
            duration: duration, curve: function () {
                return 0
            }
        }, callback)
    }, Transitionable.prototype.get = function (timestamp) {
        return this._engineInstance && (this._engineInstance.getVelocity && (this.velocity = this._engineInstance.getVelocity()), this.state = this._engineInstance.get(timestamp)), this.state
    }, Transitionable.prototype.isActive = function () {
        return !!this.currentAction
    }, Transitionable.prototype.halt = function () {
        return this.set(this.get())
    }, module.exports = Transitionable
}), define("famous/core/Context", ["require", "exports", "module", "./RenderNode", "./EventHandler", "./ElementAllocator", "./Transform", "../transitions/Transitionable"], function (require, exports, module) {
    function _getElementSize(element) {
        return [element.clientWidth, element.clientHeight]
    }

    function Context(container) {
        this.container = container, this._allocator = new ElementAllocator(container), this._node = new RenderNode, this._eventOutput = new EventHandler, this._size = _getElementSize(this.container), this._perspectiveState = new Transitionable(0), this._perspective = void 0, this._nodeContext = {
            allocator: this._allocator,
            transform: Transform.identity,
            opacity: 1,
            origin: _zeroZero,
            align: _zeroZero,
            size: this._size
        }, this._eventOutput.on("resize", function () {
            this.setSize(_getElementSize(this.container))
        }.bind(this))
    }

    var RenderNode = require("./RenderNode"), EventHandler = require("./EventHandler"), ElementAllocator = require("./ElementAllocator"), Transform = require("./Transform"), Transitionable = require("../transitions/Transitionable"), _zeroZero = [0, 0], usePrefix = !("perspective"in document.documentElement.style), _setPerspective = usePrefix ? function (element, perspective) {
        element.style.webkitPerspective = perspective ? perspective.toFixed() + "px" : ""
    } : function (element, perspective) {
        element.style.perspective = perspective ? perspective.toFixed() + "px" : ""
    };
    Context.prototype.getAllocator = function () {
        return this._allocator
    }, Context.prototype.add = function (obj) {
        return this._node.add(obj)
    }, Context.prototype.migrate = function (container) {
        container !== this.container && (this.container = container, this._allocator.migrate(container))
    }, Context.prototype.getSize = function () {
        return this._size
    }, Context.prototype.setSize = function (size) {
        size || (size = _getElementSize(this.container)), this._size[0] = size[0], this._size[1] = size[1]
    }, Context.prototype.update = function (contextParameters) {
        contextParameters && (contextParameters.transform && (this._nodeContext.transform = contextParameters.transform), contextParameters.opacity && (this._nodeContext.opacity = contextParameters.opacity), contextParameters.origin && (this._nodeContext.origin = contextParameters.origin), contextParameters.align && (this._nodeContext.align = contextParameters.align), contextParameters.size && (this._nodeContext.size = contextParameters.size));
        var perspective = this._perspectiveState.get();
        perspective !== this._perspective && (_setPerspective(this.container, perspective), this._perspective = perspective), this._node.commit(this._nodeContext)
    }, Context.prototype.getPerspective = function () {
        return this._perspectiveState.get()
    }, Context.prototype.setPerspective = function (perspective, transition, callback) {
        return this._perspectiveState.set(perspective, transition, callback)
    }, Context.prototype.emit = function (type, event) {
        return this._eventOutput.emit(type, event)
    }, Context.prototype.on = function (type, handler) {
        return this._eventOutput.on(type, handler)
    }, Context.prototype.removeListener = function (type, handler) {
        return this._eventOutput.removeListener(type, handler)
    }, Context.prototype.pipe = function (target) {
        return this._eventOutput.pipe(target)
    }, Context.prototype.unpipe = function (target) {
        return this._eventOutput.unpipe(target)
    }, module.exports = Context
}), define("famous/core/OptionsManager", ["require", "exports", "module", "./EventHandler"], function (require, exports, module) {
    function OptionsManager(value) {
        this._value = value, this.eventOutput = null
    }

    function _createEventOutput() {
        this.eventOutput = new EventHandler, this.eventOutput.bindThis(this), EventHandler.setOutputHandler(this, this.eventOutput)
    }

    var EventHandler = require("./EventHandler");
    OptionsManager.patch = function (source) {
        for (var manager = new OptionsManager(source), i = 1; i < arguments.length; i++)manager.patch(arguments[i]);
        return source
    }, OptionsManager.prototype.patch = function () {
        for (var myState = this._value, i = 0; i < arguments.length; i++) {
            var data = arguments[i];
            for (var k in data)k in myState && data[k] && data[k].constructor === Object && myState[k] && myState[k].constructor === Object ? (myState.hasOwnProperty(k) || (myState[k] = Object.create(myState[k])), this.key(k).patch(data[k]), this.eventOutput && this.eventOutput.emit("change", {
                id: k,
                value: this.key(k).value()
            })) : this.set(k, data[k])
        }
        return this
    }, OptionsManager.prototype.setOptions = OptionsManager.prototype.patch, OptionsManager.prototype.key = function (identifier) {
        var result = new OptionsManager(this._value[identifier]);
        return (!(result._value instanceof Object) || result._value instanceof Array) && (result._value = {}), result
    }, OptionsManager.prototype.get = function (key) {
        return key ? this._value[key] : this._value
    }, OptionsManager.prototype.getOptions = OptionsManager.prototype.get, OptionsManager.prototype.set = function (key, value) {
        var originalValue = this.get(key);
        return this._value[key] = value, this.eventOutput && value !== originalValue && this.eventOutput.emit("change", {
            id: key,
            value: value
        }), this
    }, OptionsManager.prototype.on = function () {
        return _createEventOutput.call(this), this.on.apply(this, arguments)
    }, OptionsManager.prototype.removeListener = function () {
        return _createEventOutput.call(this), this.removeListener.apply(this, arguments)
    }, OptionsManager.prototype.pipe = function () {
        return _createEventOutput.call(this), this.pipe.apply(this, arguments)
    }, OptionsManager.prototype.unpipe = function () {
        return _createEventOutput.call(this), this.unpipe.apply(this, arguments)
    }, module.exports = OptionsManager
}), define("famous/core/Engine", ["require", "exports", "module", "./Context", "./EventHandler", "./OptionsManager"], function (require, exports, module) {
    function loop() {
        options.runLoop ? (Engine.step(), window.requestAnimationFrame(loop)) : loopEnabled = !1
    }

    function handleResize() {
        for (var i = 0; i < contexts.length; i++)contexts[i].emit("resize");
        eventHandler.emit("resize")
    }

    function initialize() {
        window.addEventListener("touchmove", function (event) {
            event.preventDefault()
        }, !0), addRootClasses()
    }

    function addRootClasses() {
        return document.body ? (document.body.classList.add("famous-root"), void document.documentElement.classList.add("famous-root")) : void Engine.nextTick(addRootClasses)
    }

    function addEngineListener(type, forwarder) {
        return document.body ? void document.body.addEventListener(type, forwarder) : void Engine.nextTick(addEventListener.bind(this, type, forwarder))
    }

    function mount(context, el) {
        return document.body ? (document.body.appendChild(el), void context.emit("resize")) : void Engine.nextTick(mount.bind(this, context, el))
    }

    var frameTime, frameTimeLimit, Context = require("./Context"), EventHandler = require("./EventHandler"), OptionsManager = require("./OptionsManager"), Engine = {}, contexts = [], nextTickQueue = [], currentFrame = 0, nextTickFrame = 0, deferQueue = [], lastTime = Date.now(), loopEnabled = !0, eventForwarders = {}, eventHandler = new EventHandler, options = {
        containerType: "div",
        containerClass: "famous-container",
        fpsCap: void 0,
        runLoop: !0,
        appMode: !0
    }, optionsManager = new OptionsManager(options), MAX_DEFER_FRAME_TIME = 10;
    Engine.step = function () {
        currentFrame++, nextTickFrame = currentFrame;
        var currentTime = Date.now();
        if (!(frameTimeLimit && frameTimeLimit > currentTime - lastTime)) {
            var i = 0;
            frameTime = currentTime - lastTime, lastTime = currentTime, eventHandler.emit("prerender");
            for (var numFunctions = nextTickQueue.length; numFunctions--;)nextTickQueue.shift()(currentFrame);
            for (; deferQueue.length && Date.now() - currentTime < MAX_DEFER_FRAME_TIME;)deferQueue.shift().call(this);
            for (i = 0; i < contexts.length; i++)contexts[i].update();
            eventHandler.emit("postrender")
        }
    }, window.requestAnimationFrame(loop), window.addEventListener("resize", handleResize, !1), handleResize();
    var initialized = !1;
    Engine.pipe = function (target) {
        return target.subscribe instanceof Function ? target.subscribe(Engine) : eventHandler.pipe(target)
    }, Engine.unpipe = function (target) {
        return target.unsubscribe instanceof Function ? target.unsubscribe(Engine) : eventHandler.unpipe(target)
    }, Engine.on = function (type, handler) {
        return type in eventForwarders || (eventForwarders[type] = eventHandler.emit.bind(eventHandler, type), addEngineListener(type, eventForwarders[type])), eventHandler.on(type, handler)
    }, Engine.emit = function (type, event) {
        return eventHandler.emit(type, event)
    }, Engine.removeListener = function (type, handler) {
        return eventHandler.removeListener(type, handler)
    }, Engine.getFPS = function () {
        return 1e3 / frameTime
    }, Engine.setFPSCap = function (fps) {
        frameTimeLimit = Math.floor(1e3 / fps)
    }, Engine.getOptions = function (key) {
        return optionsManager.getOptions(key)
    }, Engine.setOptions = function () {
        return optionsManager.setOptions.apply(optionsManager, arguments)
    }, Engine.createContext = function (el) {
        !initialized && options.appMode && Engine.nextTick(initialize);
        var needMountContainer = !1;
        el || (el = document.createElement(options.containerType), el.classList.add(options.containerClass), needMountContainer = !0);
        var context = new Context(el);
        return Engine.registerContext(context), needMountContainer && mount(context, el), context
    }, Engine.registerContext = function (context) {
        return contexts.push(context), context
    }, Engine.getContexts = function () {
        return contexts
    }, Engine.deregisterContext = function (context) {
        var i = contexts.indexOf(context);
        i >= 0 && contexts.splice(i, 1)
    }, Engine.nextTick = function (fn) {
        nextTickQueue.push(fn)
    }, Engine.defer = function (fn) {
        deferQueue.push(fn)
    }, optionsManager.on("change", function (data) {
        "fpsCap" === data.id ? Engine.setFPSCap(data.value) : "runLoop" === data.id && !loopEnabled && data.value && (loopEnabled = !0, window.requestAnimationFrame(loop))
    }), module.exports = Engine
}), define("famous/core/ElementOutput", ["require", "exports", "module", "./Entity", "./EventHandler", "./Transform"], function (require, exports, module) {
    function ElementOutput(element) {
        this._matrix = null, this._opacity = 1, this._origin = null, this._size = null, this._eventOutput = new EventHandler, this._eventOutput.bindThis(this), this.eventForwarder = function (event) {
            this._eventOutput.emit(event.type, event)
        }.bind(this), this.id = Entity.register(this), this._element = null, this._sizeDirty = !1, this._originDirty = !1, this._transformDirty = !1, this._invisible = !1, element && this.attach(element)
    }

    function _addEventListeners(target) {
        for (var i in this._eventOutput.listeners)target.addEventListener(i, this.eventForwarder)
    }

    function _removeEventListeners(target) {
        for (var i in this._eventOutput.listeners)target.removeEventListener(i, this.eventForwarder)
    }

    function _formatCSSTransform(m) {
        m[12] = Math.round(m[12] * devicePixelRatio) / devicePixelRatio, m[13] = Math.round(m[13] * devicePixelRatio) / devicePixelRatio;
        for (var result = "matrix3d(", i = 0; 15 > i; i++)result += m[i] < 1e-6 && m[i] > -1e-6 ? "0," : m[i] + ",";
        return result += m[15] + ")"
    }

    function _formatCSSOrigin(origin) {
        return 100 * origin[0] + "% " + 100 * origin[1] + "%"
    }

    function _xyNotEquals(a, b) {
        return a && b ? a[0] !== b[0] || a[1] !== b[1] : a !== b
    }

    var Entity = require("./Entity"), EventHandler = require("./EventHandler"), Transform = require("./Transform"), usePrefix = !("transform"in document.documentElement.style), devicePixelRatio = window.devicePixelRatio || 1;
    ElementOutput.prototype.on = function (type, fn) {
        this._element && this._element.addEventListener(type, this.eventForwarder), this._eventOutput.on(type, fn)
    }, ElementOutput.prototype.removeListener = function (type, fn) {
        this._eventOutput.removeListener(type, fn)
    }, ElementOutput.prototype.emit = function (type, event) {
        event && !event.origin && (event.origin = this);
        var handled = this._eventOutput.emit(type, event);
        return handled && event && event.stopPropagation && event.stopPropagation(), handled
    }, ElementOutput.prototype.pipe = function (target) {
        return this._eventOutput.pipe(target)
    }, ElementOutput.prototype.unpipe = function (target) {
        return this._eventOutput.unpipe(target)
    }, ElementOutput.prototype.render = function () {
        return this.id
    };
    var _setMatrix;
    _setMatrix = navigator.userAgent.toLowerCase().indexOf("firefox") > -1 ? function (element, matrix) {
        element.style.zIndex = 1e6 * matrix[14] | 0, element.style.transform = _formatCSSTransform(matrix)
    } : usePrefix ? function (element, matrix) {
        element.style.webkitTransform = _formatCSSTransform(matrix)
    } : function (element, matrix) {
        element.style.transform = _formatCSSTransform(matrix)
    };
    var _setOrigin = usePrefix ? function (element, origin) {
        element.style.webkitTransformOrigin = _formatCSSOrigin(origin)
    } : function (element, origin) {
        element.style.transformOrigin = _formatCSSOrigin(origin)
    }, _setInvisible = usePrefix ? function (element) {
        element.style.webkitTransform = "scale3d(0.0001,0.0001,0.0001)", element.style.opacity = 0
    } : function (element) {
        element.style.transform = "scale3d(0.0001,0.0001,0.0001)", element.style.opacity = 0
    };
    ElementOutput.prototype.commit = function (context) {
        var target = this._element;
        if (target) {
            {
                var matrix = context.transform, opacity = context.opacity, origin = context.origin;
                context.size
            }
            if (!matrix && this._matrix)return this._matrix = null, this._opacity = 0, void _setInvisible(target);
            if (_xyNotEquals(this._origin, origin) && (this._originDirty = !0), Transform.notEquals(this._matrix, matrix) && (this._transformDirty = !0), this._invisible && (this._invisible = !1, this._element.style.display = ""), this._opacity !== opacity && (this._opacity = opacity, target.style.opacity = opacity >= 1 ? "0.999999" : opacity), this._transformDirty || this._originDirty || this._sizeDirty) {
                this._sizeDirty && (this._sizeDirty = !1), this._originDirty && (origin ? (this._origin || (this._origin = [0, 0]), this._origin[0] = origin[0], this._origin[1] = origin[1]) : this._origin = null, _setOrigin(target, this._origin), this._originDirty = !1), matrix || (matrix = Transform.identity), this._matrix = matrix;
                var aaMatrix = this._size ? Transform.thenMove(matrix, [-this._size[0] * origin[0], -this._size[1] * origin[1], 0]) : matrix;
                _setMatrix(target, aaMatrix), this._transformDirty = !1
            }
        }
    }, ElementOutput.prototype.cleanup = function () {
        this._element && (this._invisible = !0, this._element.style.display = "none")
    }, ElementOutput.prototype.attach = function (target) {
        this._element = target, _addEventListeners.call(this, target)
    }, ElementOutput.prototype.detach = function () {
        var target = this._element;
        return target && (_removeEventListeners.call(this, target), this._invisible && (this._invisible = !1, this._element.style.display = "")), this._element = null, target
    }, module.exports = ElementOutput
}), define("famous/core/Surface", ["require", "exports", "module", "./ElementOutput"], function (require, exports, module) {
    function Surface(options) {
        ElementOutput.call(this), this.options = {}, this.properties = {}, this.attributes = {}, this.content = "", this.classList = [], this.size = null, this._classesDirty = !0, this._stylesDirty = !0, this._attributesDirty = !0, this._sizeDirty = !0, this._contentDirty = !0, this._trueSizeCheck = !0, this._dirtyClasses = [], options && this.setOptions(options), this._currentTarget = null
    }

    function _cleanupClasses(target) {
        for (var i = 0; i < this._dirtyClasses.length; i++)target.classList.remove(this._dirtyClasses[i]);
        this._dirtyClasses = []
    }

    function _applyStyles(target) {
        for (var n in this.properties)target.style[n] = this.properties[n]
    }

    function _cleanupStyles(target) {
        for (var n in this.properties)target.style[n] = ""
    }

    function _applyAttributes(target) {
        for (var n in this.attributes)target.setAttribute(n, this.attributes[n])
    }

    function _cleanupAttributes(target) {
        for (var n in this.attributes)target.removeAttribute(n)
    }

    function _xyNotEquals(a, b) {
        return a && b ? a[0] !== b[0] || a[1] !== b[1] : a !== b
    }

    var ElementOutput = require("./ElementOutput");
    Surface.prototype = Object.create(ElementOutput.prototype), Surface.prototype.constructor = Surface, Surface.prototype.elementType = "div", Surface.prototype.elementClass = "famous-surface", Surface.prototype.setAttributes = function (attributes) {
        for (var n in attributes) {
            if ("style" === n)throw new Error('Cannot set styles via "setAttributes" as it will break Famo.us.  Use "setProperties" instead.');
            this.attributes[n] = attributes[n]
        }
        this._attributesDirty = !0
    }, Surface.prototype.getAttributes = function () {
        return this.attributes
    }, Surface.prototype.setProperties = function (properties) {
        for (var n in properties)this.properties[n] = properties[n];
        return this._stylesDirty = !0, this
    }, Surface.prototype.getProperties = function () {
        return this.properties
    }, Surface.prototype.addClass = function (className) {
        return this.classList.indexOf(className) < 0 && (this.classList.push(className), this._classesDirty = !0), this
    }, Surface.prototype.removeClass = function (className) {
        var i = this.classList.indexOf(className);
        return i >= 0 && (this._dirtyClasses.push(this.classList.splice(i, 1)[0]), this._classesDirty = !0), this
    }, Surface.prototype.toggleClass = function (className) {
        var i = this.classList.indexOf(className);
        return i >= 0 ? this.removeClass(className) : this.addClass(className), this
    }, Surface.prototype.setClasses = function (classList) {
        var i = 0, removal = [];
        for (i = 0; i < this.classList.length; i++)classList.indexOf(this.classList[i]) < 0 && removal.push(this.classList[i]);
        for (i = 0; i < removal.length; i++)this.removeClass(removal[i]);
        for (i = 0; i < classList.length; i++)this.addClass(classList[i]);
        return this
    }, Surface.prototype.getClassList = function () {
        return this.classList
    }, Surface.prototype.setContent = function (content) {
        return this.content !== content && (this.content = content, this._contentDirty = !0), this
    }, Surface.prototype.getContent = function () {
        return this.content
    }, Surface.prototype.setOptions = function (options) {
        return options.size && this.setSize(options.size), options.classes && this.setClasses(options.classes), options.properties && this.setProperties(options.properties), options.attributes && this.setAttributes(options.attributes), options.content && this.setContent(options.content), this
    }, Surface.prototype.setup = function (allocator) {
        var target = allocator.allocate(this.elementType);
        if (this.elementClass)if (this.elementClass instanceof Array)for (var i = 0; i < this.elementClass.length; i++)target.classList.add(this.elementClass[i]); else target.classList.add(this.elementClass);
        target.style.display = "", this.attach(target), this._opacity = null, this._currentTarget = target, this._stylesDirty = !0, this._classesDirty = !0, this._attributesDirty = !0, this._sizeDirty = !0, this._contentDirty = !0, this._originDirty = !0, this._transformDirty = !0
    }, Surface.prototype.commit = function (context) {
        this._currentTarget || this.setup(context.allocator);
        var target = this._currentTarget, size = context.size;
        if (this._classesDirty) {
            _cleanupClasses.call(this, target);
            for (var classList = this.getClassList(), i = 0; i < classList.length; i++)target.classList.add(classList[i]);
            this._classesDirty = !1, this._trueSizeCheck = !0
        }
        if (this._stylesDirty && (_applyStyles.call(this, target), this._stylesDirty = !1, this._trueSizeCheck = !0), this._attributesDirty && (_applyAttributes.call(this, target), this._attributesDirty = !1, this._trueSizeCheck = !0), this.size) {
            var origSize = context.size;
            if (size = [this.size[0], this.size[1]], void 0 === size[0] && (size[0] = origSize[0]), void 0 === size[1] && (size[1] = origSize[1]), size[0] === !0 || size[1] === !0) {
                if (size[0] === !0)if (this._trueSizeCheck || 0 === this._size[0]) {
                    var width = target.offsetWidth;
                    this._size && this._size[0] !== width && (this._size[0] = width, this._sizeDirty = !0), size[0] = width
                } else this._size && (size[0] = this._size[0]);
                if (size[1] === !0)if (this._trueSizeCheck || 0 === this._size[1]) {
                    var height = target.offsetHeight;
                    this._size && this._size[1] !== height && (this._size[1] = height, this._sizeDirty = !0), size[1] = height
                } else this._size && (size[1] = this._size[1]);
                this._trueSizeCheck = !1
            }
        }
        _xyNotEquals(this._size, size) && (this._size || (this._size = [0, 0]), this._size[0] = size[0], this._size[1] = size[1], this._sizeDirty = !0), this._sizeDirty && (this._size && (target.style.width = this.size && this.size[0] === !0 ? "" : this._size[0] + "px", target.style.height = this.size && this.size[1] === !0 ? "" : this._size[1] + "px"), this._eventOutput.emit("resize")), this._contentDirty && (this.deploy(target), this._eventOutput.emit("deploy"), this._contentDirty = !1, this._trueSizeCheck = !0), ElementOutput.prototype.commit.call(this, context)
    }, Surface.prototype.cleanup = function (allocator) {
        var i = 0, target = this._currentTarget;
        this._eventOutput.emit("recall"), this.recall(target), target.style.display = "none", target.style.opacity = "", target.style.width = "", target.style.height = "", _cleanupStyles.call(this, target), _cleanupAttributes.call(this, target);
        var classList = this.getClassList();
        for (_cleanupClasses.call(this, target), i = 0; i < classList.length; i++)target.classList.remove(classList[i]);
        if (this.elementClass)if (this.elementClass instanceof Array)for (i = 0; i < this.elementClass.length; i++)target.classList.remove(this.elementClass[i]); else target.classList.remove(this.elementClass);
        this.detach(target), this._currentTarget = null, allocator.deallocate(target)
    }, Surface.prototype.deploy = function (target) {
        var content = this.getContent();
        if (content instanceof Node) {
            for (; target.hasChildNodes();)target.removeChild(target.firstChild);
            target.appendChild(content)
        } else target.innerHTML = content
    }, Surface.prototype.recall = function (target) {
        for (var df = document.createDocumentFragment(); target.hasChildNodes();)df.appendChild(target.firstChild);
        this.setContent(df)
    }, Surface.prototype.getSize = function () {
        return this._size ? this._size : this.size
    }, Surface.prototype.setSize = function (size) {
        return this.size = size ? [size[0], size[1]] : null, this._sizeDirty = !0, this
    }, module.exports = Surface
}), define("famous/transitions/TransitionableTransform", ["require", "exports", "module", "./Transitionable", "../core/Transform", "../utilities/Utility"], function (require, exports, module) {
    function TransitionableTransform(transform) {
        this._final = Transform.identity.slice(), this._finalTranslate = [0, 0, 0], this._finalRotate = [0, 0, 0], this._finalSkew = [0, 0, 0], this._finalScale = [1, 1, 1], this.translate = new Transitionable(this._finalTranslate), this.rotate = new Transitionable(this._finalRotate), this.skew = new Transitionable(this._finalSkew), this.scale = new Transitionable(this._finalScale), transform && this.set(transform)
    }

    function _build() {
        return Transform.build({
            translate: this.translate.get(),
            rotate: this.rotate.get(),
            skew: this.skew.get(),
            scale: this.scale.get()
        })
    }

    function _buildFinal() {
        return Transform.build({
            translate: this._finalTranslate,
            rotate: this._finalRotate,
            skew: this._finalSkew,
            scale: this._finalScale
        })
    }

    var Transitionable = require("./Transitionable"), Transform = require("../core/Transform"), Utility = require("../utilities/Utility");
    TransitionableTransform.prototype.setTranslate = function (translate, transition, callback) {
        return this._finalTranslate = translate, this._final = _buildFinal.call(this), this.translate.set(translate, transition, callback), this
    }, TransitionableTransform.prototype.setScale = function (scale, transition, callback) {
        return this._finalScale = scale, this._final = _buildFinal.call(this), this.scale.set(scale, transition, callback), this
    }, TransitionableTransform.prototype.setRotate = function (eulerAngles, transition, callback) {
        return this._finalRotate = eulerAngles, this._final = _buildFinal.call(this), this.rotate.set(eulerAngles, transition, callback), this
    }, TransitionableTransform.prototype.setSkew = function (skewAngles, transition, callback) {
        return this._finalSkew = skewAngles, this._final = _buildFinal.call(this), this.skew.set(skewAngles, transition, callback), this
    }, TransitionableTransform.prototype.set = function (transform, transition, callback) {
        var components = Transform.interpret(transform);
        this._finalTranslate = components.translate, this._finalRotate = components.rotate, this._finalSkew = components.skew, this._finalScale = components.scale, this._final = transform;
        var _callback = callback ? Utility.after(4, callback) : null;
        return this.translate.set(components.translate, transition, _callback), this.rotate.set(components.rotate, transition, _callback), this.skew.set(components.skew, transition, _callback), this.scale.set(components.scale, transition, _callback), this
    }, TransitionableTransform.prototype.setDefaultTransition = function (transition) {
        this.translate.setDefault(transition), this.rotate.setDefault(transition), this.skew.setDefault(transition), this.scale.setDefault(transition)
    }, TransitionableTransform.prototype.get = function () {
        return this.isActive() ? _build.call(this) : this._final
    }, TransitionableTransform.prototype.getFinal = function () {
        return this._final
    }, TransitionableTransform.prototype.isActive = function () {
        return this.translate.isActive() || this.rotate.isActive() || this.scale.isActive() || this.skew.isActive()
    }, TransitionableTransform.prototype.halt = function () {
        return this.translate.halt(), this.rotate.halt(), this.skew.halt(), this.scale.halt(), this._final = this.get(), this._finalTranslate = this.translate.get(), this._finalRotate = this.rotate.get(), this._finalSkew = this.skew.get(), this._finalScale = this.scale.get(), this
    }, module.exports = TransitionableTransform
}), define("famous/core/Modifier", ["require", "exports", "module", "./Transform", "../transitions/Transitionable", "../transitions/TransitionableTransform"], function (require, exports, module) {
    function Modifier(options) {
        this._transformGetter = null, this._opacityGetter = null, this._originGetter = null, this._alignGetter = null, this._sizeGetter = null, this._proportionGetter = null, this._legacyStates = {}, this._output = {
            transform: Transform.identity,
            opacity: 1,
            origin: null,
            align: null,
            size: null,
            proportions: null,
            target: null
        }, options && (options.transform && this.transformFrom(options.transform), void 0 !== options.opacity && this.opacityFrom(options.opacity), options.origin && this.originFrom(options.origin), options.align && this.alignFrom(options.align), options.size && this.sizeFrom(options.size), options.proportions && this.proportionsFrom(options.proportions))
    }

    function _update() {
        this._transformGetter && (this._output.transform = this._transformGetter()), this._opacityGetter && (this._output.opacity = this._opacityGetter()), this._originGetter && (this._output.origin = this._originGetter()), this._alignGetter && (this._output.align = this._alignGetter()), this._sizeGetter && (this._output.size = this._sizeGetter()), this._proportionGetter && (this._output.proportions = this._proportionGetter())
    }

    var Transform = require("./Transform"), Transitionable = require("../transitions/Transitionable"), TransitionableTransform = require("../transitions/TransitionableTransform");
    Modifier.prototype.transformFrom = function (transform) {
        return transform instanceof Function ? this._transformGetter = transform : transform instanceof Object && transform.get ? this._transformGetter = transform.get.bind(transform) : (this._transformGetter = null, this._output.transform = transform), this
    }, Modifier.prototype.opacityFrom = function (opacity) {
        return opacity instanceof Function ? this._opacityGetter = opacity : opacity instanceof Object && opacity.get ? this._opacityGetter = opacity.get.bind(opacity) : (this._opacityGetter = null, this._output.opacity = opacity), this
    }, Modifier.prototype.originFrom = function (origin) {
        return origin instanceof Function ? this._originGetter = origin : origin instanceof Object && origin.get ? this._originGetter = origin.get.bind(origin) : (this._originGetter = null, this._output.origin = origin), this
    }, Modifier.prototype.alignFrom = function (align) {
        return align instanceof Function ? this._alignGetter = align : align instanceof Object && align.get ? this._alignGetter = align.get.bind(align) : (this._alignGetter = null, this._output.align = align), this
    }, Modifier.prototype.sizeFrom = function (size) {
        return size instanceof Function ? this._sizeGetter = size : size instanceof Object && size.get ? this._sizeGetter = size.get.bind(size) : (this._sizeGetter = null, this._output.size = size), this
    }, Modifier.prototype.proportionsFrom = function (proportions) {
        return proportions instanceof Function ? this._proportionGetter = proportions : proportions instanceof Object && proportions.get ? this._proportionGetter = proportions.get.bind(proportions) : (this._proportionGetter = null, this._output.proportions = proportions), this
    }, Modifier.prototype.setTransform = function (transform, transition, callback) {
        return transition || this._legacyStates.transform ? (this._legacyStates.transform || (this._legacyStates.transform = new TransitionableTransform(this._output.transform)), this._transformGetter || this.transformFrom(this._legacyStates.transform), this._legacyStates.transform.set(transform, transition, callback), this) : this.transformFrom(transform)
    }, Modifier.prototype.setOpacity = function (opacity, transition, callback) {
        return transition || this._legacyStates.opacity ? (this._legacyStates.opacity || (this._legacyStates.opacity = new Transitionable(this._output.opacity)), this._opacityGetter || this.opacityFrom(this._legacyStates.opacity), this._legacyStates.opacity.set(opacity, transition, callback)) : this.opacityFrom(opacity)
    }, Modifier.prototype.setOrigin = function (origin, transition, callback) {
        return transition || this._legacyStates.origin ? (this._legacyStates.origin || (this._legacyStates.origin = new Transitionable(this._output.origin || [0, 0])), this._originGetter || this.originFrom(this._legacyStates.origin), this._legacyStates.origin.set(origin, transition, callback), this) : this.originFrom(origin)
    }, Modifier.prototype.setAlign = function (align, transition, callback) {
        return transition || this._legacyStates.align ? (this._legacyStates.align || (this._legacyStates.align = new Transitionable(this._output.align || [0, 0])), this._alignGetter || this.alignFrom(this._legacyStates.align), this._legacyStates.align.set(align, transition, callback), this) : this.alignFrom(align)
    }, Modifier.prototype.setSize = function (size, transition, callback) {
        return size && (transition || this._legacyStates.size) ? (this._legacyStates.size || (this._legacyStates.size = new Transitionable(this._output.size || [0, 0])), this._sizeGetter || this.sizeFrom(this._legacyStates.size), this._legacyStates.size.set(size, transition, callback), this) : this.sizeFrom(size)
    }, Modifier.prototype.setProportions = function (proportions, transition, callback) {
        return proportions && (transition || this._legacyStates.proportions) ? (this._legacyStates.proportions || (this._legacyStates.proportions = new Transitionable(this._output.proportions || [0, 0])), this._proportionGetter || this.proportionsFrom(this._legacyStates.proportions), this._legacyStates.proportions.set(proportions, transition, callback), this) : this.proportionsFrom(proportions)
    }, Modifier.prototype.halt = function () {
        this._legacyStates.transform && this._legacyStates.transform.halt(), this._legacyStates.opacity && this._legacyStates.opacity.halt(), this._legacyStates.origin && this._legacyStates.origin.halt(), this._legacyStates.align && this._legacyStates.align.halt(), this._legacyStates.size && this._legacyStates.size.halt(), this._legacyStates.proportions && this._legacyStates.proportions.halt(), this._transformGetter = null, this._opacityGetter = null, this._originGetter = null, this._alignGetter = null, this._sizeGetter = null, this._proportionGetter = null
    }, Modifier.prototype.getTransform = function () {
        return this._transformGetter()
    }, Modifier.prototype.getFinalTransform = function () {
        return this._legacyStates.transform ? this._legacyStates.transform.getFinal() : this._output.transform
    }, Modifier.prototype.getOpacity = function () {
        return this._opacityGetter()
    }, Modifier.prototype.getOrigin = function () {
        return this._originGetter()
    }, Modifier.prototype.getAlign = function () {
        return this._alignGetter()
    }, Modifier.prototype.getSize = function () {
        return this._sizeGetter ? this._sizeGetter() : this._output.size
    }, Modifier.prototype.getProportions = function () {
        return this._proportionGetter ? this._proportionGetter() : this._output.proportions
    }, Modifier.prototype.modify = function (target) {
        return _update.call(this), this._output.target = target, this._output
    }, module.exports = Modifier
}), define("famous/core/View", ["require", "exports", "module", "./EventHandler", "./OptionsManager", "./RenderNode", "../utilities/Utility"], function (require, exports, module) {
    function View(options) {
        this._node = new RenderNode, this._eventInput = new EventHandler, this._eventOutput = new EventHandler, EventHandler.setInputHandler(this, this._eventInput), EventHandler.setOutputHandler(this, this._eventOutput), this.options = Utility.clone(this.constructor.DEFAULT_OPTIONS || View.DEFAULT_OPTIONS), this._optionsManager = new OptionsManager(this.options), options && this.setOptions(options)
    }

    var EventHandler = require("./EventHandler"), OptionsManager = require("./OptionsManager"), RenderNode = require("./RenderNode"), Utility = require("../utilities/Utility");
    View.DEFAULT_OPTIONS = {}, View.prototype.getOptions = function (key) {
        return this._optionsManager.getOptions(key)
    }, View.prototype.setOptions = function (options) {
        this._optionsManager.patch(options)
    }, View.prototype.add = function () {
        return this._node.add.apply(this._node, arguments)
    }, View.prototype._add = View.prototype.add, View.prototype.render = function () {
        return this._node.render()
    }, View.prototype.getSize = function () {
        return this._node && this._node.getSize ? this._node.getSize.apply(this._node, arguments) || this.options.size : this.options.size
    }, module.exports = View
}), define("famous/inputs/SyncUtils", ["require", "exports", "module"], function (require, exports, module) {
    module.exports = {
        getTimeHistoryPosition: function (history, timeSampleDuration) {
            for (var lastHist, hist, diffTime, len = history.length - 1, index = len, searching = !0, timeSearched = 0; searching;) {
                if (hist = history[index], 0 > index)return lastHist;
                if (hist && lastHist && (diffTime = lastHist.timestamp - hist.timestamp, timeSearched += diffTime, timeSearched >= timeSampleDuration))return searching = !1, hist;
                index--, lastHist = hist
            }
        }
    }
}), define("famous/inputs/MouseSync", ["require", "exports", "module", "../core/EventHandler", "../core/OptionsManager", "./SyncUtils"], function (require, exports, module) {
    function MouseSync(options) {
        this.options = Object.create(MouseSync.DEFAULT_OPTIONS), this._optionsManager = new OptionsManager(this.options), options && this.setOptions(options), this._eventInput = new EventHandler, this._eventOutput = new EventHandler, EventHandler.setInputHandler(this, this._eventInput), EventHandler.setOutputHandler(this, this._eventOutput), this._eventInput.on("mousedown", _handleStart.bind(this)), this._eventInput.on("mousemove", _handleMove.bind(this)), this._eventInput.on("mouseup", _handleEnd.bind(this)), this.options.propogate ? this._eventInput.on("mouseleave", _handleLeave.bind(this)) : this._eventInput.on("mouseleave", _handleEnd.bind(this)), this.options.clickThreshold && window.addEventListener("click", function (event) {
            Math.sqrt(Math.pow(this._displacement[0], 2) + Math.pow(this._displacement[1], 2)) > this.options.clickThreshold && event.stopPropagation()
        }.bind(this), !0), this._payload = {
            delta: null,
            position: null,
            velocity: null,
            clientX: 0,
            clientY: 0,
            offsetX: 0,
            offsetY: 0
        }, this._positionHistory = [], this._position = null, this._down = !1, this._moved = !1, this._displacement = [0, 0], this._documentActive = !1
    }

    function _handleStart(event) {
        var delta, velocity;
        this.options.preventDefault && event.preventDefault();
        var x = event.clientX, y = event.clientY, currTime = Date.now();
        this._down = !0, this._move = !1, void 0 !== this.options.direction ? (this._position = 0, delta = 0, velocity = 0) : (this._position = [0, 0], delta = [0, 0], velocity = [0, 0]), this.options.clickThreshold && (this._displacement = [0, 0]);
        var payload = this._payload;
        payload.delta = delta, payload.position = this._position, payload.velocity = velocity, payload.clientX = x, payload.clientY = y, payload.offsetX = event.offsetX, payload.offsetY = event.offsetY, this._positionHistory.push({
            position: payload.position.slice ? payload.position.slice(0) : payload.position,
            clientPosition: [x, y],
            timestamp: currTime
        }), this._eventOutput.emit("start", payload), this._documentActive = !1
    }

    function _handleMove(event) {
        if (0 !== this._positionHistory.length) {
            var payload = calculatePayload.call(this, event);
            this._eventOutput.emit("update", payload), this._move = !0
        }
    }

    function _handleEnd(event) {
        if (this._down) {
            var payload = calculatePayload.call(this, event);
            this._eventOutput.emit("end", payload), this._down = !1, this._move = !1, this._positionHistory = []
        }
    }

    function _handleLeave() {
        if (this._down && this._move && !this._documentActive) {
            var boundMove = _handleMove.bind(this), boundEnd = function (event) {
                _handleEnd.call(this, event), document.removeEventListener("mousemove", boundMove), document.removeEventListener("mouseup", boundEnd)
            }.bind(this);
            document.addEventListener("mousemove", boundMove), document.addEventListener("mouseup", boundEnd), this._documentActive = !0
        }
    }

    function calculatePayload(event) {
        var nextVel, nextDelta, payload = this._payload, scale = this.options.scale, x = event.clientX, y = event.clientY, currTime = Date.now(), lastPos = this._positionHistory[this._positionHistory.length - 1], diffX = x * scale - lastPos.clientPosition[0], diffY = y * scale - lastPos.clientPosition[1];
        this.options.rails && (Math.abs(diffX) > Math.abs(diffY) ? diffY = 0 : diffX = 0), this.options.direction === MouseSync.DIRECTION_X ? (nextDelta = diffX, this._position += nextDelta) : this.options.direction === MouseSync.DIRECTION_Y ? (nextDelta = diffY, this._position += nextDelta) : (nextDelta = [diffX, diffY], this._position[0] += diffX, this._position[1] += diffY), this.options.clickThreshold !== !1 && (this._displacement[0] += diffX, this._displacement[1] += diffY), payload.delta = nextDelta, payload.position = this._position, payload.clientX = x, payload.clientY = y, payload.offsetX = event.offsetX, payload.offsetY = event.offsetY, this._positionHistory.length === this.options.velocitySampleLength && this._positionHistory.shift(), this._positionHistory.push({
            position: payload.position.slice ? payload.position.slice(0) : payload.position,
            clientPosition: [x, y],
            timestamp: currTime
        });
        var lastPositionHistory = SyncUtils.getTimeHistoryPosition(this._positionHistory, this.options.timeSampleDuration), diffTime = Math.max(currTime - lastPositionHistory.timestamp, MINIMUM_TICK_TIME);
        return nextVel = void 0 !== this.options.direction ? scale * (this._position - lastPositionHistory.position) / diffTime : [scale * (this._position[0] - lastPositionHistory.position[0]) / diffTime, scale * (this._position[1] - lastPositionHistory.position[1]) / diffTime], payload.velocity = nextVel, payload
    }

    var EventHandler = require("../core/EventHandler"), OptionsManager = require("../core/OptionsManager"), SyncUtils = require("./SyncUtils");
    MouseSync.DEFAULT_OPTIONS = {
        clickThreshold: void 0,
        direction: void 0,
        rails: !1,
        scale: 1,
        propogate: !0,
        velocitySampleLength: 10,
        timeSampleDuration: 400,
        preventDefault: !0
    }, MouseSync.DIRECTION_X = 0, MouseSync.DIRECTION_Y = 1;
    var MINIMUM_TICK_TIME = 8;
    MouseSync.prototype.getOptions = function () {
        return this.options
    }, MouseSync.prototype.setOptions = function (options) {
        return this._optionsManager.setOptions(options)
    }, module.exports = MouseSync
}), define("famous/inputs/GenericSync", ["require", "exports", "module", "../core/EventHandler"], function (require, exports, module) {
    function GenericSync(syncs, options) {
        this._eventInput = new EventHandler, this._eventOutput = new EventHandler, EventHandler.setInputHandler(this, this._eventInput), EventHandler.setOutputHandler(this, this._eventOutput), this._syncs = {}, syncs && this.addSync(syncs), options && this.setOptions(options)
    }

    function _addSingleSync(key, options) {
        registry[key] && (this._syncs[key] = new registry[key](options), this.pipeSync(key))
    }

    var EventHandler = require("../core/EventHandler");
    GenericSync.DIRECTION_X = 0, GenericSync.DIRECTION_Y = 1, GenericSync.DIRECTION_Z = 2;
    var registry = {};
    GenericSync.register = function (syncObject) {
        for (var key in syncObject)if (registry[key]) {
            if (registry[key] !== syncObject[key])throw new Error("Conflicting sync classes for key: " + key)
        } else registry[key] = syncObject[key]
    }, GenericSync.prototype.setOptions = function (options) {
        for (var key in this._syncs)this._syncs[key].setOptions(options)
    }, GenericSync.prototype.pipeSync = function (key) {
        var sync = this._syncs[key];
        this._eventInput.pipe(sync), sync.pipe(this._eventOutput)
    }, GenericSync.prototype.unpipeSync = function (key) {
        var sync = this._syncs[key];
        this._eventInput.unpipe(sync), sync.unpipe(this._eventOutput)
    }, GenericSync.prototype.addSync = function (syncs) {
        if (syncs instanceof Array)for (var i = 0; i < syncs.length; i++)_addSingleSync.call(this, syncs[i]); else if (syncs instanceof Object)for (var key in syncs)_addSingleSync.call(this, key, syncs[key])
    }, module.exports = GenericSync
}), define("famous/views/HeaderFooterLayout", ["require", "exports", "module", "../core/Entity", "../core/RenderNode", "../core/Transform", "../core/OptionsManager"], function (require, exports, module) {
    function HeaderFooterLayout(options) {
        this.options = Object.create(HeaderFooterLayout.DEFAULT_OPTIONS), this._optionsManager = new OptionsManager(this.options), options && this.setOptions(options), this._entityId = Entity.register(this), this.header = new RenderNode, this.footer = new RenderNode, this.content = new RenderNode
    }

    function _resolveNodeSize(node, defaultSize) {
        var nodeSize = node.getSize();
        return nodeSize ? nodeSize[this.options.direction] : defaultSize
    }

    function _outputTransform(offset) {
        return this.options.direction === HeaderFooterLayout.DIRECTION_X ? Transform.translate(offset, 0, 0) : Transform.translate(0, offset, 0)
    }

    function _finalSize(directionSize, size) {
        return this.options.direction === HeaderFooterLayout.DIRECTION_X ? [directionSize, size[1]] : [size[0], directionSize]
    }

    var Entity = require("../core/Entity"), RenderNode = require("../core/RenderNode"), Transform = require("../core/Transform"), OptionsManager = require("../core/OptionsManager");
    HeaderFooterLayout.DIRECTION_X = 0, HeaderFooterLayout.DIRECTION_Y = 1, HeaderFooterLayout.DEFAULT_OPTIONS = {
        direction: HeaderFooterLayout.DIRECTION_Y,
        headerSize: void 0,
        footerSize: void 0,
        defaultHeaderSize: 0,
        defaultFooterSize: 0
    }, HeaderFooterLayout.prototype.render = function () {
        return this._entityId
    }, HeaderFooterLayout.prototype.setOptions = function (options) {
        return this._optionsManager.setOptions(options)
    }, HeaderFooterLayout.prototype.commit = function (context) {
        var transform = context.transform, origin = context.origin, size = context.size, opacity = context.opacity, headerSize = void 0 !== this.options.headerSize ? this.options.headerSize : _resolveNodeSize.call(this, this.header, this.options.defaultHeaderSize), footerSize = void 0 !== this.options.footerSize ? this.options.footerSize : _resolveNodeSize.call(this, this.footer, this.options.defaultFooterSize), contentSize = size[this.options.direction] - headerSize - footerSize;
        size && (transform = Transform.moveThen([-size[0] * origin[0], -size[1] * origin[1], 0], transform));
        var result = [{
            size: _finalSize.call(this, headerSize, size),
            target: this.header.render()
        }, {
            transform: _outputTransform.call(this, headerSize),
            size: _finalSize.call(this, contentSize, size),
            target: this.content.render()
        }, {
            transform: _outputTransform.call(this, headerSize + contentSize),
            size: _finalSize.call(this, footerSize, size),
            target: this.footer.render()
        }];
        return {transform: transform, opacity: opacity, size: size, target: result}
    }, module.exports = HeaderFooterLayout
}), define("famous/utilities/Timer", ["require", "exports", "module", "../core/Engine"], function (require, exports, module) {
    function addTimerFunction(fn) {
        return FamousEngine.on(_event, fn), fn
    }

    function setTimeout(fn, duration) {
        var t = getTime(), callback = function () {
            var t2 = getTime();
            t2 - t >= duration && (fn.apply(this, arguments), FamousEngine.removeListener(_event, callback))
        };
        return addTimerFunction(callback)
    }

    function setInterval(fn, duration) {
        var t = getTime(), callback = function () {
            var t2 = getTime();
            t2 - t >= duration && (fn.apply(this, arguments), t = getTime())
        };
        return addTimerFunction(callback)
    }

    function after(fn, numTicks) {
        if (void 0 === numTicks)return void 0;
        var callback = function () {
            numTicks--, 0 >= numTicks && (fn.apply(this, arguments), clear(callback))
        };
        return addTimerFunction(callback)
    }

    function every(fn, numTicks) {
        numTicks = numTicks || 1;
        var initial = numTicks, callback = function () {
            numTicks--, 0 >= numTicks && (fn.apply(this, arguments), numTicks = initial)
        };
        return addTimerFunction(callback)
    }

    function clear(fn) {
        FamousEngine.removeListener(_event, fn)
    }

    function debounce(func, wait) {
        var timeout, ctx, timestamp, result, args;
        return function () {
            ctx = this, args = arguments, timestamp = getTime();
            var fn = function () {
                var last = getTime - timestamp;
                wait > last ? timeout = setTimeout(fn, wait - last) : (timeout = null, result = func.apply(ctx, args))
            };
            return clear(timeout), timeout = setTimeout(fn, wait), result
        }
    }

    var FamousEngine = require("../core/Engine"), _event = "prerender", getTime = window.performance && window.performance.now ? function () {
        return window.performance.now()
    } : function () {
        return Date.now()
    };
    module.exports = {
        setTimeout: setTimeout,
        setInterval: setInterval,
        debounce: debounce,
        after: after,
        every: every,
        clear: clear
    }
}), define("views/NavigationView", ["require", "exports", "module", "famous/core/Surface", "famous/core/Modifier", "famous/core/Transform", "famous/core/EventHandler", "famous/core/View"], function (require, exports, module) {
    function NavigationView() {
        View.apply(this, arguments), this.eventOutput = new EventHandler, EventHandler.setOutputHandler(this, this.eventOutput), _createIcon.call(this)
    }

    function _createIcon() {
        var that = this, iconSurface = new Surface({content: '<img width="191" src="' + this.options.iconUrl + '"/>'});
        iconSurface.on("click", function () {
            that.eventOutput.emit("pageChange", that.options.index)
        }), this._add(iconSurface)
    }

    var Surface = require("famous/core/Surface"), EventHandler = (require("famous/core/Modifier"), require("famous/core/Transform"), require("famous/core/EventHandler")), View = require("famous/core/View");
    NavigationView.prototype = Object.create(View.prototype), NavigationView.prototype.constructor = NavigationView, NavigationView.DEFAULT_OPTIONS = {
        width: 1e3,
        height: null,
        iconUrl: null,
        index: null
    }, module.exports = NavigationView
}), define("views/MenuView", ["require", "exports", "module", "famous/core/Surface", "famous/core/Modifier", "famous/core/Transform", "famous/core/View", "famous/utilities/Timer", "famous/core/EventHandler", "./NavigationView"], function (require, exports, module) {
    function MenuView() {
        var that = this;
        View.apply(this, arguments), this.eventInput = new EventHandler, this.eventOutput = new EventHandler, EventHandler.setInputHandler(this, this.eventInput), EventHandler.setOutputHandler(this, this.eventOutput), this.eventInput.on("pageChange", function (index) {
            that.eventOutput.emit("navigateTo", index)
        }), _createBacking.call(this), _createNavigationViews.call(this)
    }

    function _createBacking() {
        var backSurface = new Surface({
            size: [this.options.width, this.options.height],
            properties: {backgroundColor: "#595153"}
        });
        this._add(backSurface)
    }

    function _createNavigationViews() {
        this.navModifiers = [];
        for (var navData = [{iconUrl: "img/nav-icons/home.png"}, {iconUrl: "img/nav-icons/about-us.png"}, {iconUrl: "img/nav-icons/demographics.png"}, {iconUrl: "img/nav-icons/clients.png"}, {iconUrl: "img/nav-icons/radio.png"}, {iconUrl: "img/nav-icons/contact-us.png"}], i = 0; i < navData.length; i++) {
            var navView = new NavigationView({
                width: this.options.navWidth,
                height: this.options.navHeight,
                iconUrl: navData[i].iconUrl,
                index: i
            });
            navView.pipe(this);
            var yOffset = this.options.topOffset + this.options.navItemOffset * i, navModifier = new Modifier({transform: Transform.translate(0, yOffset, 0)});
            this.navModifiers.push(navModifier), this._add(navModifier).add(navView)
        }
    }

    var Surface = require("famous/core/Surface"), Modifier = require("famous/core/Modifier"), Transform = require("famous/core/Transform"), View = require("famous/core/View"), Timer = require("famous/utilities/Timer"), EventHandler = require("famous/core/EventHandler"), NavigationView = require("./NavigationView");
    MenuView.prototype = Object.create(View.prototype), MenuView.prototype.constructor = MenuView, MenuView.prototype.resetNavItems = function () {
        for (var i = 0; i < this.navModifiers.length; i++) {
            var initX = -this.options.navWidth / 4, initY = this.options.topOffset + this.options.navItemOffset * i + 2 * this.options.navHeight;
            this.navModifiers[i].setOpacity(0), this.navModifiers[i].setTransform(Transform.translate(initX, initY, 0))
        }
    }, MenuView.prototype.animateNavItems = function () {
        this.resetNavItems();
        for (var i = 0; i < this.navModifiers.length; i++)Timer.setTimeout(function (i) {
            var yOffset = this.options.topOffset + this.options.navItemOffset * i;
            this.navModifiers[i].setOpacity(1, {
                duration: this.options.duration,
                curve: "easeOut"
            }), this.navModifiers[i].setTransform(Transform.translate(0, yOffset, 0), {
                duration: this.options.duration,
                curve: "easeOut"
            })
        }.bind(this, i), i * this.options.staggerDelay)
    }, MenuView.DEFAULT_OPTIONS = {
        navWidth: 191,
        navHeight: 81,
        topOffset: 10,
        navItemOffset: 90,
        duration: 400,
        staggerDelay: 35
    }, module.exports = MenuView
}), !function () {
    function d3_ascending(a, b) {
        return b > a ? -1 : a > b ? 1 : a >= b ? 0 : 0 / 0
    }

    function d3_number(x) {
        return null === x ? 0 / 0 : +x
    }

    function d3_numeric(x) {
        return !isNaN(x)
    }

    function d3_bisector(compare) {
        return {
            left: function (a, x, lo, hi) {
                for (arguments.length < 3 && (lo = 0), arguments.length < 4 && (hi = a.length); hi > lo;) {
                    var mid = lo + hi >>> 1;
                    compare(a[mid], x) < 0 ? lo = mid + 1 : hi = mid
                }
                return lo
            }, right: function (a, x, lo, hi) {
                for (arguments.length < 3 && (lo = 0), arguments.length < 4 && (hi = a.length); hi > lo;) {
                    var mid = lo + hi >>> 1;
                    compare(a[mid], x) > 0 ? hi = mid : lo = mid + 1
                }
                return lo
            }
        }
    }

    function d3_zipLength(d) {
        return d.length
    }

    function d3_range_integerScale(x) {
        for (var k = 1; x * k % 1;)k *= 10;
        return k
    }

    function d3_class(ctor, properties) {
        for (var key in properties)Object.defineProperty(ctor.prototype, key, {value: properties[key], enumerable: !1})
    }

    function d3_Map() {
        this._ = Object.create(null)
    }

    function d3_map_escape(key) {
        return (key += "") === d3_map_proto || key[0] === d3_map_zero ? d3_map_zero + key : key
    }

    function d3_map_unescape(key) {
        return (key += "")[0] === d3_map_zero ? key.slice(1) : key
    }

    function d3_map_has(key) {
        return d3_map_escape(key)in this._
    }

    function d3_map_remove(key) {
        return (key = d3_map_escape(key))in this._ && delete this._[key]
    }

    function d3_map_keys() {
        var keys = [];
        for (var key in this._)keys.push(d3_map_unescape(key));
        return keys
    }

    function d3_map_size() {
        var size = 0;
        for (var key in this._)++size;
        return size
    }

    function d3_map_empty() {
        for (var key in this._)return !1;
        return !0
    }

    function d3_Set() {
        this._ = Object.create(null)
    }

    function d3_rebind(target, source, method) {
        return function () {
            var value = method.apply(source, arguments);
            return value === source ? target : value
        }
    }

    function d3_vendorSymbol(object, name) {
        if (name in object)return name;
        name = name.charAt(0).toUpperCase() + name.slice(1);
        for (var i = 0, n = d3_vendorPrefixes.length; n > i; ++i) {
            var prefixName = d3_vendorPrefixes[i] + name;
            if (prefixName in object)return prefixName
        }
    }

    function d3_noop() {
    }

    function d3_dispatch() {
    }

    function d3_dispatch_event(dispatch) {
        function event() {
            for (var l, z = listeners, i = -1, n = z.length; ++i < n;)(l = z[i].on) && l.apply(this, arguments);
            return dispatch
        }

        var listeners = [], listenerByName = new d3_Map;
        return event.on = function (name, listener) {
            var i, l = listenerByName.get(name);
            return arguments.length < 2 ? l && l.on : (l && (l.on = null, listeners = listeners.slice(0, i = listeners.indexOf(l)).concat(listeners.slice(i + 1)), listenerByName.remove(name)), listener && listeners.push(listenerByName.set(name, {on: listener})), dispatch)
        }, event
    }

    function d3_eventPreventDefault() {
        d3.event.preventDefault()
    }

    function d3_eventSource() {
        for (var s, e = d3.event; s = e.sourceEvent;)e = s;
        return e
    }

    function d3_eventDispatch(target) {
        for (var dispatch = new d3_dispatch, i = 0, n = arguments.length; ++i < n;)dispatch[arguments[i]] = d3_dispatch_event(dispatch);
        return dispatch.of = function (thiz, argumentz) {
            return function (e1) {
                try {
                    var e0 = e1.sourceEvent = d3.event;
                    e1.target = target, d3.event = e1, dispatch[e1.type].apply(thiz, argumentz)
                } finally {
                    d3.event = e0
                }
            }
        }, dispatch
    }

    function d3_selection(groups) {
        return d3_subclass(groups, d3_selectionPrototype), groups
    }

    function d3_selection_selector(selector) {
        return "function" == typeof selector ? selector : function () {
            return d3_select(selector, this)
        }
    }

    function d3_selection_selectorAll(selector) {
        return "function" == typeof selector ? selector : function () {
            return d3_selectAll(selector, this)
        }
    }

    function d3_selection_attr(name, value) {
        function attrNull() {
            this.removeAttribute(name)
        }

        function attrNullNS() {
            this.removeAttributeNS(name.space, name.local)
        }

        function attrConstant() {
            this.setAttribute(name, value)
        }

        function attrConstantNS() {
            this.setAttributeNS(name.space, name.local, value)
        }

        function attrFunction() {
            var x = value.apply(this, arguments);
            null == x ? this.removeAttribute(name) : this.setAttribute(name, x)
        }

        function attrFunctionNS() {
            var x = value.apply(this, arguments);
            null == x ? this.removeAttributeNS(name.space, name.local) : this.setAttributeNS(name.space, name.local, x)
        }

        return name = d3.ns.qualify(name), null == value ? name.local ? attrNullNS : attrNull : "function" == typeof value ? name.local ? attrFunctionNS : attrFunction : name.local ? attrConstantNS : attrConstant
    }

    function d3_collapse(s) {
        return s.trim().replace(/\s+/g, " ")
    }

    function d3_selection_classedRe(name) {
        return new RegExp("(?:^|\\s+)" + d3.requote(name) + "(?:\\s+|$)", "g")
    }

    function d3_selection_classes(name) {
        return (name + "").trim().split(/^|\s+/)
    }

    function d3_selection_classed(name, value) {
        function classedConstant() {
            for (var i = -1; ++i < n;)name[i](this, value)
        }

        function classedFunction() {
            for (var i = -1, x = value.apply(this, arguments); ++i < n;)name[i](this, x)
        }

        name = d3_selection_classes(name).map(d3_selection_classedName);
        var n = name.length;
        return "function" == typeof value ? classedFunction : classedConstant
    }

    function d3_selection_classedName(name) {
        var re = d3_selection_classedRe(name);
        return function (node, value) {
            if (c = node.classList)return value ? c.add(name) : c.remove(name);
            var c = node.getAttribute("class") || "";
            value ? (re.lastIndex = 0, re.test(c) || node.setAttribute("class", d3_collapse(c + " " + name))) : node.setAttribute("class", d3_collapse(c.replace(re, " ")))
        }
    }

    function d3_selection_style(name, value, priority) {
        function styleNull() {
            this.style.removeProperty(name)
        }

        function styleConstant() {
            this.style.setProperty(name, value, priority)
        }

        function styleFunction() {
            var x = value.apply(this, arguments);
            null == x ? this.style.removeProperty(name) : this.style.setProperty(name, x, priority)
        }

        return null == value ? styleNull : "function" == typeof value ? styleFunction : styleConstant
    }

    function d3_selection_property(name, value) {
        function propertyNull() {
            delete this[name]
        }

        function propertyConstant() {
            this[name] = value
        }

        function propertyFunction() {
            var x = value.apply(this, arguments);
            null == x ? delete this[name] : this[name] = x
        }

        return null == value ? propertyNull : "function" == typeof value ? propertyFunction : propertyConstant
    }

    function d3_selection_creator(name) {
        return "function" == typeof name ? name : (name = d3.ns.qualify(name)).local ? function () {
            return this.ownerDocument.createElementNS(name.space, name.local)
        } : function () {
            return this.ownerDocument.createElementNS(this.namespaceURI, name)
        }
    }

    function d3_selectionRemove() {
        var parent = this.parentNode;
        parent && parent.removeChild(this)
    }

    function d3_selection_dataNode(data) {
        return {__data__: data}
    }

    function d3_selection_filter(selector) {
        return function () {
            return d3_selectMatches(this, selector)
        }
    }

    function d3_selection_sortComparator(comparator) {
        return arguments.length || (comparator = d3_ascending), function (a, b) {
            return a && b ? comparator(a.__data__, b.__data__) : !a - !b
        }
    }

    function d3_selection_each(groups, callback) {
        for (var j = 0, m = groups.length; m > j; j++)for (var node, group = groups[j], i = 0, n = group.length; n > i; i++)(node = group[i]) && callback(node, i, j);
        return groups
    }

    function d3_selection_enter(selection) {
        return d3_subclass(selection, d3_selection_enterPrototype), selection
    }

    function d3_selection_enterInsertBefore(enter) {
        var i0, j0;
        return function (d, i, j) {
            var node, group = enter[j].update, n = group.length;
            for (j != j0 && (j0 = j, i0 = 0), i >= i0 && (i0 = i + 1); !(node = group[i0]) && ++i0 < n;);
            return node
        }
    }

    function d3_selection_on(type, listener, capture) {
        function onRemove() {
            var l = this[name];
            l && (this.removeEventListener(type, l, l.$), delete this[name])
        }

        function onAdd() {
            var l = wrap(listener, d3_array(arguments));
            onRemove.call(this), this.addEventListener(type, this[name] = l, l.$ = capture), l._ = listener
        }

        function removeAll() {
            var match, re = new RegExp("^__on([^.]+)" + d3.requote(type) + "$");
            for (var name in this)if (match = name.match(re)) {
                var l = this[name];
                this.removeEventListener(match[1], l, l.$), delete this[name]
            }
        }

        var name = "__on" + type, i = type.indexOf("."), wrap = d3_selection_onListener;
        i > 0 && (type = type.slice(0, i));
        var filter = d3_selection_onFilters.get(type);
        return filter && (type = filter, wrap = d3_selection_onFilter), i ? listener ? onAdd : onRemove : listener ? d3_noop : removeAll
    }

    function d3_selection_onListener(listener, argumentz) {
        return function (e) {
            var o = d3.event;
            d3.event = e, argumentz[0] = this.__data__;
            try {
                listener.apply(this, argumentz)
            } finally {
                d3.event = o
            }
        }
    }

    function d3_selection_onFilter(listener, argumentz) {
        var l = d3_selection_onListener(listener, argumentz);
        return function (e) {
            var target = this, related = e.relatedTarget;
            related && (related === target || 8 & related.compareDocumentPosition(target)) || l.call(target, e)
        }
    }

    function d3_event_dragSuppress() {
        var name = ".dragsuppress-" + ++d3_event_dragId, click = "click" + name, w = d3.select(d3_window).on("touchmove" + name, d3_eventPreventDefault).on("dragstart" + name, d3_eventPreventDefault).on("selectstart" + name, d3_eventPreventDefault);
        if (d3_event_dragSelect) {
            var style = d3_documentElement.style, select = style[d3_event_dragSelect];
            style[d3_event_dragSelect] = "none"
        }
        return function (suppressClick) {
            if (w.on(name, null), d3_event_dragSelect && (style[d3_event_dragSelect] = select), suppressClick) {
                var off = function () {
                    w.on(click, null)
                };
                w.on(click, function () {
                    d3_eventPreventDefault(), off()
                }, !0), setTimeout(off, 0)
            }
        }
    }

    function d3_mousePoint(container, e) {
        e.changedTouches && (e = e.changedTouches[0]);
        var svg = container.ownerSVGElement || container;
        if (svg.createSVGPoint) {
            var point = svg.createSVGPoint();
            if (0 > d3_mouse_bug44083 && (d3_window.scrollX || d3_window.scrollY)) {
                svg = d3.select("body").append("svg").style({
                    position: "absolute",
                    top: 0,
                    left: 0,
                    margin: 0,
                    padding: 0,
                    border: "none"
                }, "important");
                var ctm = svg[0][0].getScreenCTM();
                d3_mouse_bug44083 = !(ctm.f || ctm.e), svg.remove()
            }
            return d3_mouse_bug44083 ? (point.x = e.pageX, point.y = e.pageY) : (point.x = e.clientX, point.y = e.clientY), point = point.matrixTransform(container.getScreenCTM().inverse()), [point.x, point.y]
        }
        var rect = container.getBoundingClientRect();
        return [e.clientX - rect.left - container.clientLeft, e.clientY - rect.top - container.clientTop]
    }

    function d3_behavior_dragTouchId() {
        return d3.event.changedTouches[0].identifier
    }

    function d3_behavior_dragTouchSubject() {
        return d3.event.target
    }

    function d3_behavior_dragMouseSubject() {
        return d3_window
    }

    function d3_sgn(x) {
        return x > 0 ? 1 : 0 > x ? -1 : 0
    }

    function d3_cross2d(a, b, c) {
        return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
    }

    function d3_acos(x) {
        return x > 1 ? 0 : -1 > x ? π : Math.acos(x)
    }

    function d3_asin(x) {
        return x > 1 ? halfπ : -1 > x ? -halfπ : Math.asin(x)
    }

    function d3_sinh(x) {
        return ((x = Math.exp(x)) - 1 / x) / 2
    }

    function d3_cosh(x) {
        return ((x = Math.exp(x)) + 1 / x) / 2
    }

    function d3_tanh(x) {
        return ((x = Math.exp(2 * x)) - 1) / (x + 1)
    }

    function d3_haversin(x) {
        return (x = Math.sin(x / 2)) * x
    }

    function d3_color() {
    }

    function d3_hsl(h, s, l) {
        return this instanceof d3_hsl ? (this.h = +h, this.s = +s, void(this.l = +l)) : arguments.length < 2 ? h instanceof d3_hsl ? new d3_hsl(h.h, h.s, h.l) : d3_rgb_parse("" + h, d3_rgb_hsl, d3_hsl) : new d3_hsl(h, s, l)
    }

    function d3_hsl_rgb(h, s, l) {
        function v(h) {
            return h > 360 ? h -= 360 : 0 > h && (h += 360), 60 > h ? m1 + (m2 - m1) * h / 60 : 180 > h ? m2 : 240 > h ? m1 + (m2 - m1) * (240 - h) / 60 : m1
        }

        function vv(h) {
            return Math.round(255 * v(h))
        }

        var m1, m2;
        return h = isNaN(h) ? 0 : (h %= 360) < 0 ? h + 360 : h, s = isNaN(s) ? 0 : 0 > s ? 0 : s > 1 ? 1 : s, l = 0 > l ? 0 : l > 1 ? 1 : l, m2 = .5 >= l ? l * (1 + s) : l + s - l * s, m1 = 2 * l - m2, new d3_rgb(vv(h + 120), vv(h), vv(h - 120))
    }

    function d3_hcl(h, c, l) {
        return this instanceof d3_hcl ? (this.h = +h, this.c = +c, void(this.l = +l)) : arguments.length < 2 ? h instanceof d3_hcl ? new d3_hcl(h.h, h.c, h.l) : h instanceof d3_lab ? d3_lab_hcl(h.l, h.a, h.b) : d3_lab_hcl((h = d3_rgb_lab((h = d3.rgb(h)).r, h.g, h.b)).l, h.a, h.b) : new d3_hcl(h, c, l)
    }

    function d3_hcl_lab(h, c, l) {
        return isNaN(h) && (h = 0), isNaN(c) && (c = 0), new d3_lab(l, Math.cos(h *= d3_radians) * c, Math.sin(h) * c)
    }

    function d3_lab(l, a, b) {
        return this instanceof d3_lab ? (this.l = +l, this.a = +a, void(this.b = +b)) : arguments.length < 2 ? l instanceof d3_lab ? new d3_lab(l.l, l.a, l.b) : l instanceof d3_hcl ? d3_hcl_lab(l.h, l.c, l.l) : d3_rgb_lab((l = d3_rgb(l)).r, l.g, l.b) : new d3_lab(l, a, b)
    }

    function d3_lab_rgb(l, a, b) {
        var y = (l + 16) / 116, x = y + a / 500, z = y - b / 200;
        return x = d3_lab_xyz(x) * d3_lab_X, y = d3_lab_xyz(y) * d3_lab_Y, z = d3_lab_xyz(z) * d3_lab_Z, new d3_rgb(d3_xyz_rgb(3.2404542 * x - 1.5371385 * y - .4985314 * z), d3_xyz_rgb(-.969266 * x + 1.8760108 * y + .041556 * z), d3_xyz_rgb(.0556434 * x - .2040259 * y + 1.0572252 * z))
    }

    function d3_lab_hcl(l, a, b) {
        return l > 0 ? new d3_hcl(Math.atan2(b, a) * d3_degrees, Math.sqrt(a * a + b * b), l) : new d3_hcl(0 / 0, 0 / 0, l)
    }

    function d3_lab_xyz(x) {
        return x > .206893034 ? x * x * x : (x - 4 / 29) / 7.787037
    }

    function d3_xyz_lab(x) {
        return x > .008856 ? Math.pow(x, 1 / 3) : 7.787037 * x + 4 / 29
    }

    function d3_xyz_rgb(r) {
        return Math.round(255 * (.00304 >= r ? 12.92 * r : 1.055 * Math.pow(r, 1 / 2.4) - .055))
    }

    function d3_rgb(r, g, b) {
        return this instanceof d3_rgb ? (this.r = ~~r, this.g = ~~g, void(this.b = ~~b)) : arguments.length < 2 ? r instanceof d3_rgb ? new d3_rgb(r.r, r.g, r.b) : d3_rgb_parse("" + r, d3_rgb, d3_hsl_rgb) : new d3_rgb(r, g, b)
    }

    function d3_rgbNumber(value) {
        return new d3_rgb(value >> 16, value >> 8 & 255, 255 & value)
    }

    function d3_rgbString(value) {
        return d3_rgbNumber(value) + ""
    }

    function d3_rgb_hex(v) {
        return 16 > v ? "0" + Math.max(0, v).toString(16) : Math.min(255, v).toString(16)
    }

    function d3_rgb_parse(format, rgb, hsl) {
        var m1, m2, color, r = 0, g = 0, b = 0;
        if (m1 = /([a-z]+)\((.*)\)/i.exec(format))switch (m2 = m1[2].split(","), m1[1]) {
            case"hsl":
                return hsl(parseFloat(m2[0]), parseFloat(m2[1]) / 100, parseFloat(m2[2]) / 100);
            case"rgb":
                return rgb(d3_rgb_parseNumber(m2[0]), d3_rgb_parseNumber(m2[1]), d3_rgb_parseNumber(m2[2]))
        }
        return (color = d3_rgb_names.get(format)) ? rgb(color.r, color.g, color.b) : (null == format || "#" !== format.charAt(0) || isNaN(color = parseInt(format.slice(1), 16)) || (4 === format.length ? (r = (3840 & color) >> 4, r = r >> 4 | r, g = 240 & color, g = g >> 4 | g, b = 15 & color, b = b << 4 | b) : 7 === format.length && (r = (16711680 & color) >> 16, g = (65280 & color) >> 8, b = 255 & color)), rgb(r, g, b))
    }

    function d3_rgb_hsl(r, g, b) {
        var h, s, min = Math.min(r /= 255, g /= 255, b /= 255), max = Math.max(r, g, b), d = max - min, l = (max + min) / 2;
        return d ? (s = .5 > l ? d / (max + min) : d / (2 - max - min), h = r == max ? (g - b) / d + (b > g ? 6 : 0) : g == max ? (b - r) / d + 2 : (r - g) / d + 4, h *= 60) : (h = 0 / 0, s = l > 0 && 1 > l ? 0 : h), new d3_hsl(h, s, l)
    }

    function d3_rgb_lab(r, g, b) {
        r = d3_rgb_xyz(r), g = d3_rgb_xyz(g), b = d3_rgb_xyz(b);
        var x = d3_xyz_lab((.4124564 * r + .3575761 * g + .1804375 * b) / d3_lab_X), y = d3_xyz_lab((.2126729 * r + .7151522 * g + .072175 * b) / d3_lab_Y), z = d3_xyz_lab((.0193339 * r + .119192 * g + .9503041 * b) / d3_lab_Z);
        return d3_lab(116 * y - 16, 500 * (x - y), 200 * (y - z))
    }

    function d3_rgb_xyz(r) {
        return (r /= 255) <= .04045 ? r / 12.92 : Math.pow((r + .055) / 1.055, 2.4)
    }

    function d3_rgb_parseNumber(c) {
        var f = parseFloat(c);
        return "%" === c.charAt(c.length - 1) ? Math.round(2.55 * f) : f
    }

    function d3_functor(v) {
        return "function" == typeof v ? v : function () {
            return v
        }
    }

    function d3_identity(d) {
        return d
    }

    function d3_xhrType(response) {
        return function (url, mimeType, callback) {
            return 2 === arguments.length && "function" == typeof mimeType && (callback = mimeType, mimeType = null), d3_xhr(url, mimeType, response, callback)
        }
    }

    function d3_xhr(url, mimeType, response, callback) {
        function respond() {
            var result, status = request.status;
            if (!status && d3_xhrHasResponse(request) || status >= 200 && 300 > status || 304 === status) {
                try {
                    result = response.call(xhr, request)
                } catch (e) {
                    return void dispatch.error.call(xhr, e)
                }
                dispatch.load.call(xhr, result)
            } else dispatch.error.call(xhr, request)
        }

        var xhr = {}, dispatch = d3.dispatch("beforesend", "progress", "load", "error"), headers = {}, request = new XMLHttpRequest, responseType = null;
        return !d3_window.XDomainRequest || "withCredentials"in request || !/^(http(s)?:)?\/\//.test(url) || (request = new XDomainRequest), "onload"in request ? request.onload = request.onerror = respond : request.onreadystatechange = function () {
            request.readyState > 3 && respond()
        }, request.onprogress = function (event) {
            var o = d3.event;
            d3.event = event;
            try {
                dispatch.progress.call(xhr, request)
            } finally {
                d3.event = o
            }
        }, xhr.header = function (name, value) {
            return name = (name + "").toLowerCase(), arguments.length < 2 ? headers[name] : (null == value ? delete headers[name] : headers[name] = value + "", xhr)
        }, xhr.mimeType = function (value) {
            return arguments.length ? (mimeType = null == value ? null : value + "", xhr) : mimeType
        }, xhr.responseType = function (value) {
            return arguments.length ? (responseType = value, xhr) : responseType
        }, xhr.response = function (value) {
            return response = value, xhr
        }, ["get", "post"].forEach(function (method) {
            xhr[method] = function () {
                return xhr.send.apply(xhr, [method].concat(d3_array(arguments)))
            }
        }), xhr.send = function (method, data, callback) {
            if (2 === arguments.length && "function" == typeof data && (callback = data, data = null), request.open(method, url, !0), null == mimeType || "accept"in headers || (headers.accept = mimeType + ",*/*"), request.setRequestHeader)for (var name in headers)request.setRequestHeader(name, headers[name]);
            return null != mimeType && request.overrideMimeType && request.overrideMimeType(mimeType), null != responseType && (request.responseType = responseType), null != callback && xhr.on("error", callback).on("load", function (request) {
                callback(null, request)
            }), dispatch.beforesend.call(xhr, request), request.send(null == data ? null : data), xhr
        }, xhr.abort = function () {
            return request.abort(), xhr
        }, d3.rebind(xhr, dispatch, "on"), null == callback ? xhr : xhr.get(d3_xhr_fixCallback(callback))
    }

    function d3_xhr_fixCallback(callback) {
        return 1 === callback.length ? function (error, request) {
            callback(null == error ? request : null)
        } : callback
    }

    function d3_xhrHasResponse(request) {
        var type = request.responseType;
        return type && "text" !== type ? request.response : request.responseText
    }

    function d3_timer_step() {
        var now = d3_timer_mark(), delay = d3_timer_sweep() - now;
        delay > 24 ? (isFinite(delay) && (clearTimeout(d3_timer_timeout), d3_timer_timeout = setTimeout(d3_timer_step, delay)), d3_timer_interval = 0) : (d3_timer_interval = 1, d3_timer_frame(d3_timer_step))
    }

    function d3_timer_mark() {
        var now = Date.now();
        for (d3_timer_active = d3_timer_queueHead; d3_timer_active;)now >= d3_timer_active.t && (d3_timer_active.f = d3_timer_active.c(now - d3_timer_active.t)), d3_timer_active = d3_timer_active.n;
        return now
    }

    function d3_timer_sweep() {
        for (var t0, t1 = d3_timer_queueHead, time = 1 / 0; t1;)t1.f ? t1 = t0 ? t0.n = t1.n : d3_timer_queueHead = t1.n : (t1.t < time && (time = t1.t), t1 = (t0 = t1).n);
        return d3_timer_queueTail = t0, time
    }

    function d3_format_precision(x, p) {
        return p - (x ? Math.ceil(Math.log(x) / Math.LN10) : 1)
    }

    function d3_formatPrefix(d, i) {
        var k = Math.pow(10, 3 * abs(8 - i));
        return {
            scale: i > 8 ? function (d) {
                return d / k
            } : function (d) {
                return d * k
            }, symbol: d
        }
    }

    function d3_locale_numberFormat(locale) {
        var locale_decimal = locale.decimal, locale_thousands = locale.thousands, locale_grouping = locale.grouping, locale_currency = locale.currency, formatGroup = locale_grouping && locale_thousands ? function (value, width) {
            for (var i = value.length, t = [], j = 0, g = locale_grouping[0], length = 0; i > 0 && g > 0 && (length + g + 1 > width && (g = Math.max(1, width - length)), t.push(value.substring(i -= g, i + g)), !((length += g + 1) > width));)g = locale_grouping[j = (j + 1) % locale_grouping.length];
            return t.reverse().join(locale_thousands)
        } : d3_identity;
        return function (specifier) {
            var match = d3_format_re.exec(specifier), fill = match[1] || " ", align = match[2] || ">", sign = match[3] || "-", symbol = match[4] || "", zfill = match[5], width = +match[6], comma = match[7], precision = match[8], type = match[9], scale = 1, prefix = "", suffix = "", integer = !1, exponent = !0;
            switch (precision && (precision = +precision.substring(1)), (zfill || "0" === fill && "=" === align) && (zfill = fill = "0", align = "="), type) {
                case"n":
                    comma = !0, type = "g";
                    break;
                case"%":
                    scale = 100, suffix = "%", type = "f";
                    break;
                case"p":
                    scale = 100, suffix = "%", type = "r";
                    break;
                case"b":
                case"o":
                case"x":
                case"X":
                    "#" === symbol && (prefix = "0" + type.toLowerCase());
                case"c":
                    exponent = !1;
                case"d":
                    integer = !0, precision = 0;
                    break;
                case"s":
                    scale = -1, type = "r"
            }
            "$" === symbol && (prefix = locale_currency[0], suffix = locale_currency[1]), "r" != type || precision || (type = "g"), null != precision && ("g" == type ? precision = Math.max(1, Math.min(21, precision)) : ("e" == type || "f" == type) && (precision = Math.max(0, Math.min(20, precision)))), type = d3_format_types.get(type) || d3_format_typeDefault;
            var zcomma = zfill && comma;
            return function (value) {
                var fullSuffix = suffix;
                if (integer && value % 1)return "";
                var negative = 0 > value || 0 === value && 0 > 1 / value ? (value = -value, "-") : "-" === sign ? "" : sign;
                if (0 > scale) {
                    var unit = d3.formatPrefix(value, precision);
                    value = unit.scale(value), fullSuffix = unit.symbol + suffix
                } else value *= scale;
                value = type(value, precision);
                var before, after, i = value.lastIndexOf(".");
                if (0 > i) {
                    var j = exponent ? value.lastIndexOf("e") : -1;
                    0 > j ? (before = value, after = "") : (before = value.substring(0, j), after = value.substring(j))
                } else before = value.substring(0, i), after = locale_decimal + value.substring(i + 1);
                !zfill && comma && (before = formatGroup(before, 1 / 0));
                var length = prefix.length + before.length + after.length + (zcomma ? 0 : negative.length), padding = width > length ? new Array(length = width - length + 1).join(fill) : "";
                return zcomma && (before = formatGroup(padding + before, padding.length ? width - after.length : 1 / 0)), negative += prefix, value = before + after, ("<" === align ? negative + value + padding : ">" === align ? padding + negative + value : "^" === align ? padding.substring(0, length >>= 1) + negative + value + padding.substring(length) : negative + (zcomma ? value : padding + value)) + fullSuffix
            }
        }
    }

    function d3_format_typeDefault(x) {
        return x + ""
    }

    function d3_date_utc() {
        this._ = new Date(arguments.length > 1 ? Date.UTC.apply(this, arguments) : arguments[0])
    }

    function d3_time_interval(local, step, number) {
        function round(date) {
            var d0 = local(date), d1 = offset(d0, 1);
            return d1 - date > date - d0 ? d0 : d1
        }

        function ceil(date) {
            return step(date = local(new d3_date(date - 1)), 1), date
        }

        function offset(date, k) {
            return step(date = new d3_date(+date), k), date
        }

        function range(t0, t1, dt) {
            var time = ceil(t0), times = [];
            if (dt > 1)for (; t1 > time;)number(time) % dt || times.push(new Date(+time)), step(time, 1); else for (; t1 > time;)times.push(new Date(+time)), step(time, 1);
            return times
        }

        function range_utc(t0, t1, dt) {
            try {
                d3_date = d3_date_utc;
                var utc = new d3_date_utc;
                return utc._ = t0, range(utc, t1, dt)
            } finally {
                d3_date = Date
            }
        }

        local.floor = local, local.round = round, local.ceil = ceil, local.offset = offset, local.range = range;
        var utc = local.utc = d3_time_interval_utc(local);
        return utc.floor = utc, utc.round = d3_time_interval_utc(round), utc.ceil = d3_time_interval_utc(ceil), utc.offset = d3_time_interval_utc(offset), utc.range = range_utc, local
    }

    function d3_time_interval_utc(method) {
        return function (date, k) {
            try {
                d3_date = d3_date_utc;
                var utc = new d3_date_utc;
                return utc._ = date, method(utc, k)._
            } finally {
                d3_date = Date
            }
        }
    }

    function d3_locale_timeFormat(locale) {
        function d3_time_format(template) {
            function format(date) {
                for (var c, p, f, string = [], i = -1, j = 0; ++i < n;)37 === template.charCodeAt(i) && (string.push(template.slice(j, i)), null != (p = d3_time_formatPads[c = template.charAt(++i)]) && (c = template.charAt(++i)), (f = d3_time_formats[c]) && (c = f(date, null == p ? "e" === c ? " " : "0" : p)), string.push(c), j = i + 1);
                return string.push(template.slice(j, i)), string.join("")
            }

            var n = template.length;
            return format.parse = function (string) {
                var d = {
                    y: 1900,
                    m: 0,
                    d: 1,
                    H: 0,
                    M: 0,
                    S: 0,
                    L: 0,
                    Z: null
                }, i = d3_time_parse(d, template, string, 0);
                if (i != string.length)return null;
                "p"in d && (d.H = d.H % 12 + 12 * d.p);
                var localZ = null != d.Z && d3_date !== d3_date_utc, date = new (localZ ? d3_date_utc : d3_date);
                return "j"in d ? date.setFullYear(d.y, 0, d.j) : "w"in d && ("W"in d || "U"in d) ? (date.setFullYear(d.y, 0, 1), date.setFullYear(d.y, 0, "W"in d ? (d.w + 6) % 7 + 7 * d.W - (date.getDay() + 5) % 7 : d.w + 7 * d.U - (date.getDay() + 6) % 7)) : date.setFullYear(d.y, d.m, d.d), date.setHours(d.H + (d.Z / 100 | 0), d.M + d.Z % 100, d.S, d.L), localZ ? date._ : date
            }, format.toString = function () {
                return template
            }, format
        }

        function d3_time_parse(date, template, string, j) {
            for (var c, p, t, i = 0, n = template.length, m = string.length; n > i;) {
                if (j >= m)return -1;
                if (c = template.charCodeAt(i++), 37 === c) {
                    if (t = template.charAt(i++), p = d3_time_parsers[t in d3_time_formatPads ? template.charAt(i++) : t], !p || (j = p(date, string, j)) < 0)return -1
                } else if (c != string.charCodeAt(j++))return -1
            }
            return j
        }

        function d3_time_parseWeekdayAbbrev(date, string, i) {
            d3_time_dayAbbrevRe.lastIndex = 0;
            var n = d3_time_dayAbbrevRe.exec(string.slice(i));
            return n ? (date.w = d3_time_dayAbbrevLookup.get(n[0].toLowerCase()), i + n[0].length) : -1
        }

        function d3_time_parseWeekday(date, string, i) {
            d3_time_dayRe.lastIndex = 0;
            var n = d3_time_dayRe.exec(string.slice(i));
            return n ? (date.w = d3_time_dayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1
        }

        function d3_time_parseMonthAbbrev(date, string, i) {
            d3_time_monthAbbrevRe.lastIndex = 0;
            var n = d3_time_monthAbbrevRe.exec(string.slice(i));
            return n ? (date.m = d3_time_monthAbbrevLookup.get(n[0].toLowerCase()), i + n[0].length) : -1
        }

        function d3_time_parseMonth(date, string, i) {
            d3_time_monthRe.lastIndex = 0;
            var n = d3_time_monthRe.exec(string.slice(i));
            return n ? (date.m = d3_time_monthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1
        }

        function d3_time_parseLocaleFull(date, string, i) {
            return d3_time_parse(date, d3_time_formats.c.toString(), string, i)
        }

        function d3_time_parseLocaleDate(date, string, i) {
            return d3_time_parse(date, d3_time_formats.x.toString(), string, i)
        }

        function d3_time_parseLocaleTime(date, string, i) {
            return d3_time_parse(date, d3_time_formats.X.toString(), string, i)
        }

        function d3_time_parseAmPm(date, string, i) {
            var n = d3_time_periodLookup.get(string.slice(i, i += 2).toLowerCase());
            return null == n ? -1 : (date.p = n, i)
        }

        var locale_dateTime = locale.dateTime, locale_date = locale.date, locale_time = locale.time, locale_periods = locale.periods, locale_days = locale.days, locale_shortDays = locale.shortDays, locale_months = locale.months, locale_shortMonths = locale.shortMonths;
        d3_time_format.utc = function (template) {
            function format(date) {
                try {
                    d3_date = d3_date_utc;
                    var utc = new d3_date;
                    return utc._ = date, local(utc)
                } finally {
                    d3_date = Date
                }
            }

            var local = d3_time_format(template);
            return format.parse = function (string) {
                try {
                    d3_date = d3_date_utc;
                    var date = local.parse(string);
                    return date && date._
                } finally {
                    d3_date = Date
                }
            }, format.toString = local.toString, format
        }, d3_time_format.multi = d3_time_format.utc.multi = d3_time_formatMulti;
        var d3_time_periodLookup = d3.map(), d3_time_dayRe = d3_time_formatRe(locale_days), d3_time_dayLookup = d3_time_formatLookup(locale_days), d3_time_dayAbbrevRe = d3_time_formatRe(locale_shortDays), d3_time_dayAbbrevLookup = d3_time_formatLookup(locale_shortDays), d3_time_monthRe = d3_time_formatRe(locale_months), d3_time_monthLookup = d3_time_formatLookup(locale_months), d3_time_monthAbbrevRe = d3_time_formatRe(locale_shortMonths), d3_time_monthAbbrevLookup = d3_time_formatLookup(locale_shortMonths);
        locale_periods.forEach(function (p, i) {
            d3_time_periodLookup.set(p.toLowerCase(), i)
        });
        var d3_time_formats = {
            a: function (d) {
                return locale_shortDays[d.getDay()]
            }, A: function (d) {
                return locale_days[d.getDay()]
            }, b: function (d) {
                return locale_shortMonths[d.getMonth()]
            }, B: function (d) {
                return locale_months[d.getMonth()]
            }, c: d3_time_format(locale_dateTime), d: function (d, p) {
                return d3_time_formatPad(d.getDate(), p, 2)
            }, e: function (d, p) {
                return d3_time_formatPad(d.getDate(), p, 2)
            }, H: function (d, p) {
                return d3_time_formatPad(d.getHours(), p, 2)
            }, I: function (d, p) {
                return d3_time_formatPad(d.getHours() % 12 || 12, p, 2)
            }, j: function (d, p) {
                return d3_time_formatPad(1 + d3_time.dayOfYear(d), p, 3)
            }, L: function (d, p) {
                return d3_time_formatPad(d.getMilliseconds(), p, 3)
            }, m: function (d, p) {
                return d3_time_formatPad(d.getMonth() + 1, p, 2)
            }, M: function (d, p) {
                return d3_time_formatPad(d.getMinutes(), p, 2)
            }, p: function (d) {
                return locale_periods[+(d.getHours() >= 12)]
            }, S: function (d, p) {
                return d3_time_formatPad(d.getSeconds(), p, 2)
            }, U: function (d, p) {
                return d3_time_formatPad(d3_time.sundayOfYear(d), p, 2)
            }, w: function (d) {
                return d.getDay()
            }, W: function (d, p) {
                return d3_time_formatPad(d3_time.mondayOfYear(d), p, 2)
            }, x: d3_time_format(locale_date), X: d3_time_format(locale_time), y: function (d, p) {
                return d3_time_formatPad(d.getFullYear() % 100, p, 2)
            }, Y: function (d, p) {
                return d3_time_formatPad(d.getFullYear() % 1e4, p, 4)
            }, Z: d3_time_zone, "%": function () {
                return "%"
            }
        }, d3_time_parsers = {
            a: d3_time_parseWeekdayAbbrev,
            A: d3_time_parseWeekday,
            b: d3_time_parseMonthAbbrev,
            B: d3_time_parseMonth,
            c: d3_time_parseLocaleFull,
            d: d3_time_parseDay,
            e: d3_time_parseDay,
            H: d3_time_parseHour24,
            I: d3_time_parseHour24,
            j: d3_time_parseDayOfYear,
            L: d3_time_parseMilliseconds,
            m: d3_time_parseMonthNumber,
            M: d3_time_parseMinutes,
            p: d3_time_parseAmPm,
            S: d3_time_parseSeconds,
            U: d3_time_parseWeekNumberSunday,
            w: d3_time_parseWeekdayNumber,
            W: d3_time_parseWeekNumberMonday,
            x: d3_time_parseLocaleDate,
            X: d3_time_parseLocaleTime,
            y: d3_time_parseYear,
            Y: d3_time_parseFullYear,
            Z: d3_time_parseZone,
            "%": d3_time_parseLiteralPercent
        };
        return d3_time_format
    }

    function d3_time_formatPad(value, fill, width) {
        var sign = 0 > value ? "-" : "", string = (sign ? -value : value) + "", length = string.length;
        return sign + (width > length ? new Array(width - length + 1).join(fill) + string : string)
    }

    function d3_time_formatRe(names) {
        return new RegExp("^(?:" + names.map(d3.requote).join("|") + ")", "i")
    }

    function d3_time_formatLookup(names) {
        for (var map = new d3_Map, i = -1, n = names.length; ++i < n;)map.set(names[i].toLowerCase(), i);
        return map
    }

    function d3_time_parseWeekdayNumber(date, string, i) {
        d3_time_numberRe.lastIndex = 0;
        var n = d3_time_numberRe.exec(string.slice(i, i + 1));
        return n ? (date.w = +n[0], i + n[0].length) : -1
    }

    function d3_time_parseWeekNumberSunday(date, string, i) {
        d3_time_numberRe.lastIndex = 0;
        var n = d3_time_numberRe.exec(string.slice(i));
        return n ? (date.U = +n[0], i + n[0].length) : -1
    }

    function d3_time_parseWeekNumberMonday(date, string, i) {
        d3_time_numberRe.lastIndex = 0;
        var n = d3_time_numberRe.exec(string.slice(i));
        return n ? (date.W = +n[0], i + n[0].length) : -1
    }

    function d3_time_parseFullYear(date, string, i) {
        d3_time_numberRe.lastIndex = 0;
        var n = d3_time_numberRe.exec(string.slice(i, i + 4));
        return n ? (date.y = +n[0], i + n[0].length) : -1
    }

    function d3_time_parseYear(date, string, i) {
        d3_time_numberRe.lastIndex = 0;
        var n = d3_time_numberRe.exec(string.slice(i, i + 2));
        return n ? (date.y = d3_time_expandYear(+n[0]), i + n[0].length) : -1
    }

    function d3_time_parseZone(date, string, i) {
        return /^[+-]\d{4}$/.test(string = string.slice(i, i + 5)) ? (date.Z = -string, i + 5) : -1
    }

    function d3_time_expandYear(d) {
        return d + (d > 68 ? 1900 : 2e3)
    }

    function d3_time_parseMonthNumber(date, string, i) {
        d3_time_numberRe.lastIndex = 0;
        var n = d3_time_numberRe.exec(string.slice(i, i + 2));
        return n ? (date.m = n[0] - 1, i + n[0].length) : -1
    }

    function d3_time_parseDay(date, string, i) {
        d3_time_numberRe.lastIndex = 0;
        var n = d3_time_numberRe.exec(string.slice(i, i + 2));
        return n ? (date.d = +n[0], i + n[0].length) : -1
    }

    function d3_time_parseDayOfYear(date, string, i) {
        d3_time_numberRe.lastIndex = 0;
        var n = d3_time_numberRe.exec(string.slice(i, i + 3));
        return n ? (date.j = +n[0], i + n[0].length) : -1
    }

    function d3_time_parseHour24(date, string, i) {
        d3_time_numberRe.lastIndex = 0;
        var n = d3_time_numberRe.exec(string.slice(i, i + 2));
        return n ? (date.H = +n[0], i + n[0].length) : -1
    }

    function d3_time_parseMinutes(date, string, i) {
        d3_time_numberRe.lastIndex = 0;
        var n = d3_time_numberRe.exec(string.slice(i, i + 2));
        return n ? (date.M = +n[0], i + n[0].length) : -1
    }

    function d3_time_parseSeconds(date, string, i) {
        d3_time_numberRe.lastIndex = 0;
        var n = d3_time_numberRe.exec(string.slice(i, i + 2));
        return n ? (date.S = +n[0], i + n[0].length) : -1
    }

    function d3_time_parseMilliseconds(date, string, i) {
        d3_time_numberRe.lastIndex = 0;
        var n = d3_time_numberRe.exec(string.slice(i, i + 3));
        return n ? (date.L = +n[0], i + n[0].length) : -1
    }

    function d3_time_zone(d) {
        var z = d.getTimezoneOffset(), zs = z > 0 ? "-" : "+", zh = abs(z) / 60 | 0, zm = abs(z) % 60;
        return zs + d3_time_formatPad(zh, "0", 2) + d3_time_formatPad(zm, "0", 2)
    }

    function d3_time_parseLiteralPercent(date, string, i) {
        d3_time_percentRe.lastIndex = 0;
        var n = d3_time_percentRe.exec(string.slice(i, i + 1));
        return n ? i + n[0].length : -1
    }

    function d3_time_formatMulti(formats) {
        for (var n = formats.length, i = -1; ++i < n;)formats[i][0] = this(formats[i][0]);
        return function (date) {
            for (var i = 0, f = formats[i]; !f[1](date);)f = formats[++i];
            return f[0](date)
        }
    }

    function d3_adder() {
    }

    function d3_adderSum(a, b, o) {
        var x = o.s = a + b, bv = x - a, av = x - bv;
        o.t = a - av + (b - bv)
    }

    function d3_geo_streamGeometry(geometry, listener) {
        geometry && d3_geo_streamGeometryType.hasOwnProperty(geometry.type) && d3_geo_streamGeometryType[geometry.type](geometry, listener)
    }

    function d3_geo_streamLine(coordinates, listener, closed) {
        var coordinate, i = -1, n = coordinates.length - closed;
        for (listener.lineStart(); ++i < n;)coordinate = coordinates[i], listener.point(coordinate[0], coordinate[1], coordinate[2]);
        listener.lineEnd()
    }

    function d3_geo_streamPolygon(coordinates, listener) {
        var i = -1, n = coordinates.length;
        for (listener.polygonStart(); ++i < n;)d3_geo_streamLine(coordinates[i], listener, 1);
        listener.polygonEnd()
    }

    function d3_geo_areaRingStart() {
        function nextPoint(λ, φ) {
            λ *= d3_radians, φ = φ * d3_radians / 2 + π / 4;
            var dλ = λ - λ0, sdλ = dλ >= 0 ? 1 : -1, adλ = sdλ * dλ, cosφ = Math.cos(φ), sinφ = Math.sin(φ), k = sinφ0 * sinφ, u = cosφ0 * cosφ + k * Math.cos(adλ), v = k * sdλ * Math.sin(adλ);
            d3_geo_areaRingSum.add(Math.atan2(v, u)), λ0 = λ, cosφ0 = cosφ, sinφ0 = sinφ
        }

        var λ00, φ00, λ0, cosφ0, sinφ0;
        d3_geo_area.point = function (λ, φ) {
            d3_geo_area.point = nextPoint, λ0 = (λ00 = λ) * d3_radians, cosφ0 = Math.cos(φ = (φ00 = φ) * d3_radians / 2 + π / 4), sinφ0 = Math.sin(φ)
        }, d3_geo_area.lineEnd = function () {
            nextPoint(λ00, φ00)
        }
    }

    function d3_geo_cartesian(spherical) {
        var λ = spherical[0], φ = spherical[1], cosφ = Math.cos(φ);
        return [cosφ * Math.cos(λ), cosφ * Math.sin(λ), Math.sin(φ)]
    }

    function d3_geo_cartesianDot(a, b) {
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
    }

    function d3_geo_cartesianCross(a, b) {
        return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
    }

    function d3_geo_cartesianAdd(a, b) {
        a[0] += b[0], a[1] += b[1], a[2] += b[2]
    }

    function d3_geo_cartesianScale(vector, k) {
        return [vector[0] * k, vector[1] * k, vector[2] * k]
    }

    function d3_geo_cartesianNormalize(d) {
        var l = Math.sqrt(d[0] * d[0] + d[1] * d[1] + d[2] * d[2]);
        d[0] /= l, d[1] /= l, d[2] /= l
    }

    function d3_geo_spherical(cartesian) {
        return [Math.atan2(cartesian[1], cartesian[0]), d3_asin(cartesian[2])]
    }

    function d3_geo_sphericalEqual(a, b) {
        return abs(a[0] - b[0]) < ε && abs(a[1] - b[1]) < ε
    }

    function d3_geo_centroidPoint(λ, φ) {
        λ *= d3_radians;
        var cosφ = Math.cos(φ *= d3_radians);
        d3_geo_centroidPointXYZ(cosφ * Math.cos(λ), cosφ * Math.sin(λ), Math.sin(φ))
    }

    function d3_geo_centroidPointXYZ(x, y, z) {
        ++d3_geo_centroidW0, d3_geo_centroidX0 += (x - d3_geo_centroidX0) / d3_geo_centroidW0, d3_geo_centroidY0 += (y - d3_geo_centroidY0) / d3_geo_centroidW0, d3_geo_centroidZ0 += (z - d3_geo_centroidZ0) / d3_geo_centroidW0
    }

    function d3_geo_centroidLineStart() {
        function nextPoint(λ, φ) {
            λ *= d3_radians;
            var cosφ = Math.cos(φ *= d3_radians), x = cosφ * Math.cos(λ), y = cosφ * Math.sin(λ), z = Math.sin(φ), w = Math.atan2(Math.sqrt((w = y0 * z - z0 * y) * w + (w = z0 * x - x0 * z) * w + (w = x0 * y - y0 * x) * w), x0 * x + y0 * y + z0 * z);
            d3_geo_centroidW1 += w, d3_geo_centroidX1 += w * (x0 + (x0 = x)), d3_geo_centroidY1 += w * (y0 + (y0 = y)), d3_geo_centroidZ1 += w * (z0 + (z0 = z)), d3_geo_centroidPointXYZ(x0, y0, z0)
        }

        var x0, y0, z0;
        d3_geo_centroid.point = function (λ, φ) {
            λ *= d3_radians;
            var cosφ = Math.cos(φ *= d3_radians);
            x0 = cosφ * Math.cos(λ), y0 = cosφ * Math.sin(λ), z0 = Math.sin(φ), d3_geo_centroid.point = nextPoint, d3_geo_centroidPointXYZ(x0, y0, z0)
        }
    }

    function d3_geo_centroidLineEnd() {
        d3_geo_centroid.point = d3_geo_centroidPoint
    }

    function d3_geo_centroidRingStart() {
        function nextPoint(λ, φ) {
            λ *= d3_radians;
            var cosφ = Math.cos(φ *= d3_radians), x = cosφ * Math.cos(λ), y = cosφ * Math.sin(λ), z = Math.sin(φ), cx = y0 * z - z0 * y, cy = z0 * x - x0 * z, cz = x0 * y - y0 * x, m = Math.sqrt(cx * cx + cy * cy + cz * cz), u = x0 * x + y0 * y + z0 * z, v = m && -d3_acos(u) / m, w = Math.atan2(m, u);
            d3_geo_centroidX2 += v * cx, d3_geo_centroidY2 += v * cy, d3_geo_centroidZ2 += v * cz, d3_geo_centroidW1 += w, d3_geo_centroidX1 += w * (x0 + (x0 = x)), d3_geo_centroidY1 += w * (y0 + (y0 = y)), d3_geo_centroidZ1 += w * (z0 + (z0 = z)), d3_geo_centroidPointXYZ(x0, y0, z0)
        }

        var λ00, φ00, x0, y0, z0;
        d3_geo_centroid.point = function (λ, φ) {
            λ00 = λ, φ00 = φ, d3_geo_centroid.point = nextPoint, λ *= d3_radians;
            var cosφ = Math.cos(φ *= d3_radians);
            x0 = cosφ * Math.cos(λ), y0 = cosφ * Math.sin(λ), z0 = Math.sin(φ), d3_geo_centroidPointXYZ(x0, y0, z0)
        }, d3_geo_centroid.lineEnd = function () {
            nextPoint(λ00, φ00), d3_geo_centroid.lineEnd = d3_geo_centroidLineEnd, d3_geo_centroid.point = d3_geo_centroidPoint
        }
    }

    function d3_geo_compose(a, b) {
        function compose(x, y) {
            return x = a(x, y), b(x[0], x[1])
        }

        return a.invert && b.invert && (compose.invert = function (x, y) {
            return x = b.invert(x, y), x && a.invert(x[0], x[1])
        }), compose
    }

    function d3_true() {
        return !0
    }

    function d3_geo_clipPolygon(segments, compare, clipStartInside, interpolate, listener) {
        var subject = [], clip = [];
        if (segments.forEach(function (segment) {
                if (!((n = segment.length - 1) <= 0)) {
                    var n, p0 = segment[0], p1 = segment[n];
                    if (d3_geo_sphericalEqual(p0, p1)) {
                        listener.lineStart();
                        for (var i = 0; n > i; ++i)listener.point((p0 = segment[i])[0], p0[1]);
                        return void listener.lineEnd()
                    }
                    var a = new d3_geo_clipPolygonIntersection(p0, segment, null, !0), b = new d3_geo_clipPolygonIntersection(p0, null, a, !1);
                    a.o = b, subject.push(a), clip.push(b), a = new d3_geo_clipPolygonIntersection(p1, segment, null, !1), b = new d3_geo_clipPolygonIntersection(p1, null, a, !0), a.o = b, subject.push(a), clip.push(b)
                }
            }), clip.sort(compare), d3_geo_clipPolygonLinkCircular(subject), d3_geo_clipPolygonLinkCircular(clip), subject.length) {
            for (var i = 0, entry = clipStartInside, n = clip.length; n > i; ++i)clip[i].e = entry = !entry;
            for (var points, point, start = subject[0]; ;) {
                for (var current = start, isSubject = !0; current.v;)if ((current = current.n) === start)return;
                points = current.z, listener.lineStart();
                do {
                    if (current.v = current.o.v = !0, current.e) {
                        if (isSubject)for (var i = 0, n = points.length; n > i; ++i)listener.point((point = points[i])[0], point[1]); else interpolate(current.x, current.n.x, 1, listener);
                        current = current.n
                    } else {
                        if (isSubject) {
                            points = current.p.z;
                            for (var i = points.length - 1; i >= 0; --i)listener.point((point = points[i])[0], point[1])
                        } else interpolate(current.x, current.p.x, -1, listener);
                        current = current.p
                    }
                    current = current.o, points = current.z, isSubject = !isSubject
                } while (!current.v);
                listener.lineEnd()
            }
        }
    }

    function d3_geo_clipPolygonLinkCircular(array) {
        if (n = array.length) {
            for (var n, b, i = 0, a = array[0]; ++i < n;)a.n = b = array[i], b.p = a, a = b;
            a.n = b = array[0], b.p = a
        }
    }

    function d3_geo_clipPolygonIntersection(point, points, other, entry) {
        this.x = point, this.z = points, this.o = other, this.e = entry, this.v = !1, this.n = this.p = null
    }

    function d3_geo_clip(pointVisible, clipLine, interpolate, clipStart) {
        return function (rotate, listener) {
            function point(λ, φ) {
                var point = rotate(λ, φ);
                pointVisible(λ = point[0], φ = point[1]) && listener.point(λ, φ)
            }

            function pointLine(λ, φ) {
                var point = rotate(λ, φ);
                line.point(point[0], point[1])
            }

            function lineStart() {
                clip.point = pointLine, line.lineStart()
            }

            function lineEnd() {
                clip.point = point, line.lineEnd()
            }

            function pointRing(λ, φ) {
                ring.push([λ, φ]);
                var point = rotate(λ, φ);
                ringListener.point(point[0], point[1])
            }

            function ringStart() {
                ringListener.lineStart(), ring = []
            }

            function ringEnd() {
                pointRing(ring[0][0], ring[0][1]), ringListener.lineEnd();
                var segment, clean = ringListener.clean(), ringSegments = buffer.buffer(), n = ringSegments.length;
                if (ring.pop(), polygon.push(ring), ring = null, n)if (1 & clean) {
                    segment = ringSegments[0];
                    var point, n = segment.length - 1, i = -1;
                    if (n > 0) {
                        for (polygonStarted || (listener.polygonStart(), polygonStarted = !0), listener.lineStart(); ++i < n;)listener.point((point = segment[i])[0], point[1]);
                        listener.lineEnd()
                    }
                } else n > 1 && 2 & clean && ringSegments.push(ringSegments.pop().concat(ringSegments.shift())), segments.push(ringSegments.filter(d3_geo_clipSegmentLength1))
            }

            var segments, polygon, ring, line = clipLine(listener), rotatedClipStart = rotate.invert(clipStart[0], clipStart[1]), clip = {
                point: point,
                lineStart: lineStart,
                lineEnd: lineEnd,
                polygonStart: function () {
                    clip.point = pointRing, clip.lineStart = ringStart, clip.lineEnd = ringEnd, segments = [], polygon = []
                },
                polygonEnd: function () {
                    clip.point = point, clip.lineStart = lineStart, clip.lineEnd = lineEnd, segments = d3.merge(segments);
                    var clipStartInside = d3_geo_pointInPolygon(rotatedClipStart, polygon);
                    segments.length ? (polygonStarted || (listener.polygonStart(), polygonStarted = !0), d3_geo_clipPolygon(segments, d3_geo_clipSort, clipStartInside, interpolate, listener)) : clipStartInside && (polygonStarted || (listener.polygonStart(), polygonStarted = !0), listener.lineStart(), interpolate(null, null, 1, listener), listener.lineEnd()), polygonStarted && (listener.polygonEnd(), polygonStarted = !1), segments = polygon = null
                },
                sphere: function () {
                    listener.polygonStart(), listener.lineStart(), interpolate(null, null, 1, listener), listener.lineEnd(), listener.polygonEnd()
                }
            }, buffer = d3_geo_clipBufferListener(), ringListener = clipLine(buffer), polygonStarted = !1;
            return clip
        }
    }

    function d3_geo_clipSegmentLength1(segment) {
        return segment.length > 1
    }

    function d3_geo_clipBufferListener() {
        var line, lines = [];
        return {
            lineStart: function () {
                lines.push(line = [])
            }, point: function (λ, φ) {
                line.push([λ, φ])
            }, lineEnd: d3_noop, buffer: function () {
                var buffer = lines;
                return lines = [], line = null, buffer
            }, rejoin: function () {
                lines.length > 1 && lines.push(lines.pop().concat(lines.shift()))
            }
        }
    }

    function d3_geo_clipSort(a, b) {
        return ((a = a.x)[0] < 0 ? a[1] - halfπ - ε : halfπ - a[1]) - ((b = b.x)[0] < 0 ? b[1] - halfπ - ε : halfπ - b[1])
    }

    function d3_geo_clipAntimeridianLine(listener) {
        var clean, λ0 = 0 / 0, φ0 = 0 / 0, sλ0 = 0 / 0;
        return {
            lineStart: function () {
                listener.lineStart(), clean = 1
            }, point: function (λ1, φ1) {
                var sλ1 = λ1 > 0 ? π : -π, dλ = abs(λ1 - λ0);
                abs(dλ - π) < ε ? (listener.point(λ0, φ0 = (φ0 + φ1) / 2 > 0 ? halfπ : -halfπ), listener.point(sλ0, φ0), listener.lineEnd(), listener.lineStart(), listener.point(sλ1, φ0), listener.point(λ1, φ0), clean = 0) : sλ0 !== sλ1 && dλ >= π && (abs(λ0 - sλ0) < ε && (λ0 -= sλ0 * ε), abs(λ1 - sλ1) < ε && (λ1 -= sλ1 * ε), φ0 = d3_geo_clipAntimeridianIntersect(λ0, φ0, λ1, φ1), listener.point(sλ0, φ0), listener.lineEnd(), listener.lineStart(), listener.point(sλ1, φ0), clean = 0), listener.point(λ0 = λ1, φ0 = φ1), sλ0 = sλ1
            }, lineEnd: function () {
                listener.lineEnd(), λ0 = φ0 = 0 / 0
            }, clean: function () {
                return 2 - clean
            }
        }
    }

    function d3_geo_clipAntimeridianIntersect(λ0, φ0, λ1, φ1) {
        var cosφ0, cosφ1, sinλ0_λ1 = Math.sin(λ0 - λ1);
        return abs(sinλ0_λ1) > ε ? Math.atan((Math.sin(φ0) * (cosφ1 = Math.cos(φ1)) * Math.sin(λ1) - Math.sin(φ1) * (cosφ0 = Math.cos(φ0)) * Math.sin(λ0)) / (cosφ0 * cosφ1 * sinλ0_λ1)) : (φ0 + φ1) / 2
    }

    function d3_geo_clipAntimeridianInterpolate(from, to, direction, listener) {
        var φ;
        if (null == from)φ = direction * halfπ, listener.point(-π, φ), listener.point(0, φ), listener.point(π, φ), listener.point(π, 0), listener.point(π, -φ), listener.point(0, -φ), listener.point(-π, -φ), listener.point(-π, 0), listener.point(-π, φ); else if (abs(from[0] - to[0]) > ε) {
            var s = from[0] < to[0] ? π : -π;
            φ = direction * s / 2, listener.point(-s, φ), listener.point(0, φ), listener.point(s, φ)
        } else listener.point(to[0], to[1])
    }

    function d3_geo_pointInPolygon(point, polygon) {
        var meridian = point[0], parallel = point[1], meridianNormal = [Math.sin(meridian), -Math.cos(meridian), 0], polarAngle = 0, winding = 0;
        d3_geo_areaRingSum.reset();
        for (var i = 0, n = polygon.length; n > i; ++i) {
            var ring = polygon[i], m = ring.length;
            if (m)for (var point0 = ring[0], λ0 = point0[0], φ0 = point0[1] / 2 + π / 4, sinφ0 = Math.sin(φ0), cosφ0 = Math.cos(φ0), j = 1; ;) {
                j === m && (j = 0), point = ring[j];
                var λ = point[0], φ = point[1] / 2 + π / 4, sinφ = Math.sin(φ), cosφ = Math.cos(φ), dλ = λ - λ0, sdλ = dλ >= 0 ? 1 : -1, adλ = sdλ * dλ, antimeridian = adλ > π, k = sinφ0 * sinφ;
                if (d3_geo_areaRingSum.add(Math.atan2(k * sdλ * Math.sin(adλ), cosφ0 * cosφ + k * Math.cos(adλ))), polarAngle += antimeridian ? dλ + sdλ * τ : dλ, antimeridian ^ λ0 >= meridian ^ λ >= meridian) {
                    var arc = d3_geo_cartesianCross(d3_geo_cartesian(point0), d3_geo_cartesian(point));
                    d3_geo_cartesianNormalize(arc);
                    var intersection = d3_geo_cartesianCross(meridianNormal, arc);
                    d3_geo_cartesianNormalize(intersection);
                    var φarc = (antimeridian ^ dλ >= 0 ? -1 : 1) * d3_asin(intersection[2]);
                    (parallel > φarc || parallel === φarc && (arc[0] || arc[1])) && (winding += antimeridian ^ dλ >= 0 ? 1 : -1)
                }
                if (!j++)break;
                λ0 = λ, sinφ0 = sinφ, cosφ0 = cosφ, point0 = point
            }
        }
        return (-ε > polarAngle || ε > polarAngle && 0 > d3_geo_areaRingSum) ^ 1 & winding
    }

    function d3_geo_clipCircle(radius) {
        function visible(λ, φ) {
            return Math.cos(λ) * Math.cos(φ) > cr
        }

        function clipLine(listener) {
            var point0, c0, v0, v00, clean;
            return {
                lineStart: function () {
                    v00 = v0 = !1, clean = 1
                }, point: function (λ, φ) {
                    var point2, point1 = [λ, φ], v = visible(λ, φ), c = smallRadius ? v ? 0 : code(λ, φ) : v ? code(λ + (0 > λ ? π : -π), φ) : 0;
                    if (!point0 && (v00 = v0 = v) && listener.lineStart(), v !== v0 && (point2 = intersect(point0, point1), (d3_geo_sphericalEqual(point0, point2) || d3_geo_sphericalEqual(point1, point2)) && (point1[0] += ε, point1[1] += ε, v = visible(point1[0], point1[1]))), v !== v0)clean = 0, v ? (listener.lineStart(), point2 = intersect(point1, point0), listener.point(point2[0], point2[1])) : (point2 = intersect(point0, point1), listener.point(point2[0], point2[1]), listener.lineEnd()), point0 = point2; else if (notHemisphere && point0 && smallRadius ^ v) {
                        var t;
                        c & c0 || !(t = intersect(point1, point0, !0)) || (clean = 0, smallRadius ? (listener.lineStart(), listener.point(t[0][0], t[0][1]), listener.point(t[1][0], t[1][1]), listener.lineEnd()) : (listener.point(t[1][0], t[1][1]), listener.lineEnd(), listener.lineStart(), listener.point(t[0][0], t[0][1])))
                    }
                    !v || point0 && d3_geo_sphericalEqual(point0, point1) || listener.point(point1[0], point1[1]), point0 = point1, v0 = v, c0 = c
                }, lineEnd: function () {
                    v0 && listener.lineEnd(), point0 = null
                }, clean: function () {
                    return clean | (v00 && v0) << 1
                }
            }
        }

        function intersect(a, b, two) {
            var pa = d3_geo_cartesian(a), pb = d3_geo_cartesian(b), n1 = [1, 0, 0], n2 = d3_geo_cartesianCross(pa, pb), n2n2 = d3_geo_cartesianDot(n2, n2), n1n2 = n2[0], determinant = n2n2 - n1n2 * n1n2;
            if (!determinant)return !two && a;
            var c1 = cr * n2n2 / determinant, c2 = -cr * n1n2 / determinant, n1xn2 = d3_geo_cartesianCross(n1, n2), A = d3_geo_cartesianScale(n1, c1), B = d3_geo_cartesianScale(n2, c2);
            d3_geo_cartesianAdd(A, B);
            var u = n1xn2, w = d3_geo_cartesianDot(A, u), uu = d3_geo_cartesianDot(u, u), t2 = w * w - uu * (d3_geo_cartesianDot(A, A) - 1);
            if (!(0 > t2)) {
                var t = Math.sqrt(t2), q = d3_geo_cartesianScale(u, (-w - t) / uu);
                if (d3_geo_cartesianAdd(q, A), q = d3_geo_spherical(q), !two)return q;
                var z, λ0 = a[0], λ1 = b[0], φ0 = a[1], φ1 = b[1];
                λ0 > λ1 && (z = λ0, λ0 = λ1, λ1 = z);
                var δλ = λ1 - λ0, polar = abs(δλ - π) < ε, meridian = polar || ε > δλ;
                if (!polar && φ0 > φ1 && (z = φ0, φ0 = φ1, φ1 = z), meridian ? polar ? φ0 + φ1 > 0 ^ q[1] < (abs(q[0] - λ0) < ε ? φ0 : φ1) : φ0 <= q[1] && q[1] <= φ1 : δλ > π ^ (λ0 <= q[0] && q[0] <= λ1)) {
                    var q1 = d3_geo_cartesianScale(u, (-w + t) / uu);
                    return d3_geo_cartesianAdd(q1, A), [q, d3_geo_spherical(q1)]
                }
            }
        }

        function code(λ, φ) {
            var r = smallRadius ? radius : π - radius, code = 0;
            return -r > λ ? code |= 1 : λ > r && (code |= 2), -r > φ ? code |= 4 : φ > r && (code |= 8), code
        }

        var cr = Math.cos(radius), smallRadius = cr > 0, notHemisphere = abs(cr) > ε, interpolate = d3_geo_circleInterpolate(radius, 6 * d3_radians);
        return d3_geo_clip(visible, clipLine, interpolate, smallRadius ? [0, -radius] : [-π, radius - π])
    }

    function d3_geom_clipLine(x0, y0, x1, y1) {
        return function (line) {
            var r, a = line.a, b = line.b, ax = a.x, ay = a.y, bx = b.x, by = b.y, t0 = 0, t1 = 1, dx = bx - ax, dy = by - ay;
            if (r = x0 - ax, dx || !(r > 0)) {
                if (r /= dx, 0 > dx) {
                    if (t0 > r)return;
                    t1 > r && (t1 = r)
                } else if (dx > 0) {
                    if (r > t1)return;
                    r > t0 && (t0 = r)
                }
                if (r = x1 - ax, dx || !(0 > r)) {
                    if (r /= dx, 0 > dx) {
                        if (r > t1)return;
                        r > t0 && (t0 = r)
                    } else if (dx > 0) {
                        if (t0 > r)return;
                        t1 > r && (t1 = r)
                    }
                    if (r = y0 - ay, dy || !(r > 0)) {
                        if (r /= dy, 0 > dy) {
                            if (t0 > r)return;
                            t1 > r && (t1 = r)
                        } else if (dy > 0) {
                            if (r > t1)return;
                            r > t0 && (t0 = r)
                        }
                        if (r = y1 - ay, dy || !(0 > r)) {
                            if (r /= dy, 0 > dy) {
                                if (r > t1)return;
                                r > t0 && (t0 = r)
                            } else if (dy > 0) {
                                if (t0 > r)return;
                                t1 > r && (t1 = r)
                            }
                            return t0 > 0 && (line.a = {
                                x: ax + t0 * dx,
                                y: ay + t0 * dy
                            }), 1 > t1 && (line.b = {x: ax + t1 * dx, y: ay + t1 * dy}), line
                        }
                    }
                }
            }
        }
    }

    function d3_geo_clipExtent(x0, y0, x1, y1) {
        function corner(p, direction) {
            return abs(p[0] - x0) < ε ? direction > 0 ? 0 : 3 : abs(p[0] - x1) < ε ? direction > 0 ? 2 : 1 : abs(p[1] - y0) < ε ? direction > 0 ? 1 : 0 : direction > 0 ? 3 : 2
        }

        function compare(a, b) {
            return comparePoints(a.x, b.x)
        }

        function comparePoints(a, b) {
            var ca = corner(a, 1), cb = corner(b, 1);
            return ca !== cb ? ca - cb : 0 === ca ? b[1] - a[1] : 1 === ca ? a[0] - b[0] : 2 === ca ? a[1] - b[1] : b[0] - a[0]
        }

        return function (listener) {
            function insidePolygon(p) {
                for (var wn = 0, n = polygon.length, y = p[1], i = 0; n > i; ++i)for (var b, j = 1, v = polygon[i], m = v.length, a = v[0]; m > j; ++j)b = v[j], a[1] <= y ? b[1] > y && d3_cross2d(a, b, p) > 0 && ++wn : b[1] <= y && d3_cross2d(a, b, p) < 0 && --wn, a = b;
                return 0 !== wn
            }

            function interpolate(from, to, direction, listener) {
                var a = 0, a1 = 0;
                if (null == from || (a = corner(from, direction)) !== (a1 = corner(to, direction)) || comparePoints(from, to) < 0 ^ direction > 0) {
                    do listener.point(0 === a || 3 === a ? x0 : x1, a > 1 ? y1 : y0); while ((a = (a + direction + 4) % 4) !== a1)
                } else listener.point(to[0], to[1])
            }

            function pointVisible(x, y) {
                return x >= x0 && x1 >= x && y >= y0 && y1 >= y
            }

            function point(x, y) {
                pointVisible(x, y) && listener.point(x, y)
            }

            function lineStart() {
                clip.point = linePoint, polygon && polygon.push(ring = []), first = !0, v_ = !1, x_ = y_ = 0 / 0
            }

            function lineEnd() {
                segments && (linePoint(x__, y__), v__ && v_ && bufferListener.rejoin(), segments.push(bufferListener.buffer())), clip.point = point, v_ && listener.lineEnd()
            }

            function linePoint(x, y) {
                x = Math.max(-d3_geo_clipExtentMAX, Math.min(d3_geo_clipExtentMAX, x)), y = Math.max(-d3_geo_clipExtentMAX, Math.min(d3_geo_clipExtentMAX, y));
                var v = pointVisible(x, y);
                if (polygon && ring.push([x, y]), first)x__ = x, y__ = y, v__ = v, first = !1, v && (listener.lineStart(), listener.point(x, y)); else if (v && v_)listener.point(x, y); else {
                    var l = {a: {x: x_, y: y_}, b: {x: x, y: y}};
                    clipLine(l) ? (v_ || (listener.lineStart(), listener.point(l.a.x, l.a.y)), listener.point(l.b.x, l.b.y), v || listener.lineEnd(), clean = !1) : v && (listener.lineStart(), listener.point(x, y), clean = !1)
                }
                x_ = x, y_ = y, v_ = v
            }

            var segments, polygon, ring, x__, y__, v__, x_, y_, v_, first, clean, listener_ = listener, bufferListener = d3_geo_clipBufferListener(), clipLine = d3_geom_clipLine(x0, y0, x1, y1), clip = {
                point: point,
                lineStart: lineStart,
                lineEnd: lineEnd,
                polygonStart: function () {
                    listener = bufferListener, segments = [], polygon = [], clean = !0
                },
                polygonEnd: function () {
                    listener = listener_, segments = d3.merge(segments);
                    var clipStartInside = insidePolygon([x0, y1]), inside = clean && clipStartInside, visible = segments.length;
                    (inside || visible) && (listener.polygonStart(), inside && (listener.lineStart(), interpolate(null, null, 1, listener), listener.lineEnd()), visible && d3_geo_clipPolygon(segments, compare, clipStartInside, interpolate, listener), listener.polygonEnd()), segments = polygon = ring = null
                }
            };
            return clip
        }
    }

    function d3_geo_conic(projectAt) {
        var φ0 = 0, φ1 = π / 3, m = d3_geo_projectionMutator(projectAt), p = m(φ0, φ1);
        return p.parallels = function (_) {
            return arguments.length ? m(φ0 = _[0] * π / 180, φ1 = _[1] * π / 180) : [φ0 / π * 180, φ1 / π * 180]
        }, p
    }

    function d3_geo_conicEqualArea(φ0, φ1) {
        function forward(λ, φ) {
            var ρ = Math.sqrt(C - 2 * n * Math.sin(φ)) / n;
            return [ρ * Math.sin(λ *= n), ρ0 - ρ * Math.cos(λ)]
        }

        var sinφ0 = Math.sin(φ0), n = (sinφ0 + Math.sin(φ1)) / 2, C = 1 + sinφ0 * (2 * n - sinφ0), ρ0 = Math.sqrt(C) / n;
        return forward.invert = function (x, y) {
            var ρ0_y = ρ0 - y;
            return [Math.atan2(x, ρ0_y) / n, d3_asin((C - (x * x + ρ0_y * ρ0_y) * n * n) / (2 * n))]
        }, forward
    }

    function d3_geo_pathAreaRingStart() {
        function nextPoint(x, y) {
            d3_geo_pathAreaPolygon += y0 * x - x0 * y, x0 = x, y0 = y
        }

        var x00, y00, x0, y0;
        d3_geo_pathArea.point = function (x, y) {
            d3_geo_pathArea.point = nextPoint, x00 = x0 = x, y00 = y0 = y
        }, d3_geo_pathArea.lineEnd = function () {
            nextPoint(x00, y00)
        }
    }

    function d3_geo_pathBoundsPoint(x, y) {
        d3_geo_pathBoundsX0 > x && (d3_geo_pathBoundsX0 = x), x > d3_geo_pathBoundsX1 && (d3_geo_pathBoundsX1 = x), d3_geo_pathBoundsY0 > y && (d3_geo_pathBoundsY0 = y), y > d3_geo_pathBoundsY1 && (d3_geo_pathBoundsY1 = y)
    }

    function d3_geo_pathBuffer() {
        function point(x, y) {
            buffer.push("M", x, ",", y, pointCircle)
        }

        function pointLineStart(x, y) {
            buffer.push("M", x, ",", y), stream.point = pointLine
        }

        function pointLine(x, y) {
            buffer.push("L", x, ",", y)
        }

        function lineEnd() {
            stream.point = point
        }

        function lineEndPolygon() {
            buffer.push("Z")
        }

        var pointCircle = d3_geo_pathBufferCircle(4.5), buffer = [], stream = {
            point: point, lineStart: function () {
                stream.point = pointLineStart
            }, lineEnd: lineEnd, polygonStart: function () {
                stream.lineEnd = lineEndPolygon
            }, polygonEnd: function () {
                stream.lineEnd = lineEnd, stream.point = point
            }, pointRadius: function (_) {
                return pointCircle = d3_geo_pathBufferCircle(_), stream
            }, result: function () {
                if (buffer.length) {
                    var result = buffer.join("");
                    return buffer = [], result
                }
            }
        };
        return stream
    }

    function d3_geo_pathBufferCircle(radius) {
        return "m0," + radius + "a" + radius + "," + radius + " 0 1,1 0," + -2 * radius + "a" + radius + "," + radius + " 0 1,1 0," + 2 * radius + "z"
    }

    function d3_geo_pathCentroidPoint(x, y) {
        d3_geo_centroidX0 += x, d3_geo_centroidY0 += y, ++d3_geo_centroidZ0
    }

    function d3_geo_pathCentroidLineStart() {
        function nextPoint(x, y) {
            var dx = x - x0, dy = y - y0, z = Math.sqrt(dx * dx + dy * dy);
            d3_geo_centroidX1 += z * (x0 + x) / 2, d3_geo_centroidY1 += z * (y0 + y) / 2, d3_geo_centroidZ1 += z, d3_geo_pathCentroidPoint(x0 = x, y0 = y)
        }

        var x0, y0;
        d3_geo_pathCentroid.point = function (x, y) {
            d3_geo_pathCentroid.point = nextPoint, d3_geo_pathCentroidPoint(x0 = x, y0 = y)
        }
    }

    function d3_geo_pathCentroidLineEnd() {
        d3_geo_pathCentroid.point = d3_geo_pathCentroidPoint
    }

    function d3_geo_pathCentroidRingStart() {
        function nextPoint(x, y) {
            var dx = x - x0, dy = y - y0, z = Math.sqrt(dx * dx + dy * dy);
            d3_geo_centroidX1 += z * (x0 + x) / 2, d3_geo_centroidY1 += z * (y0 + y) / 2, d3_geo_centroidZ1 += z, z = y0 * x - x0 * y, d3_geo_centroidX2 += z * (x0 + x), d3_geo_centroidY2 += z * (y0 + y), d3_geo_centroidZ2 += 3 * z, d3_geo_pathCentroidPoint(x0 = x, y0 = y)
        }

        var x00, y00, x0, y0;
        d3_geo_pathCentroid.point = function (x, y) {
            d3_geo_pathCentroid.point = nextPoint, d3_geo_pathCentroidPoint(x00 = x0 = x, y00 = y0 = y)
        }, d3_geo_pathCentroid.lineEnd = function () {
            nextPoint(x00, y00)
        }
    }

    function d3_geo_pathContext(context) {
        function point(x, y) {
            context.moveTo(x + pointRadius, y), context.arc(x, y, pointRadius, 0, τ)
        }

        function pointLineStart(x, y) {
            context.moveTo(x, y), stream.point = pointLine
        }

        function pointLine(x, y) {
            context.lineTo(x, y)
        }

        function lineEnd() {
            stream.point = point
        }

        function lineEndPolygon() {
            context.closePath()
        }

        var pointRadius = 4.5, stream = {
            point: point, lineStart: function () {
                stream.point = pointLineStart
            }, lineEnd: lineEnd, polygonStart: function () {
                stream.lineEnd = lineEndPolygon
            }, polygonEnd: function () {
                stream.lineEnd = lineEnd, stream.point = point
            }, pointRadius: function (_) {
                return pointRadius = _, stream
            }, result: d3_noop
        };
        return stream
    }

    function d3_geo_resample(project) {
        function resample(stream) {
            return (maxDepth ? resampleRecursive : resampleNone)(stream)
        }

        function resampleNone(stream) {
            return d3_geo_transformPoint(stream, function (x, y) {
                x = project(x, y), stream.point(x[0], x[1])
            })
        }

        function resampleRecursive(stream) {
            function point(x, y) {
                x = project(x, y), stream.point(x[0], x[1])
            }

            function lineStart() {
                x0 = 0 / 0, resample.point = linePoint, stream.lineStart()
            }

            function linePoint(λ, φ) {
                var c = d3_geo_cartesian([λ, φ]), p = project(λ, φ);
                resampleLineTo(x0, y0, λ0, a0, b0, c0, x0 = p[0], y0 = p[1], λ0 = λ, a0 = c[0], b0 = c[1], c0 = c[2], maxDepth, stream), stream.point(x0, y0)
            }

            function lineEnd() {
                resample.point = point, stream.lineEnd()
            }

            function ringStart() {
                lineStart(), resample.point = ringPoint, resample.lineEnd = ringEnd
            }

            function ringPoint(λ, φ) {
                linePoint(λ00 = λ, φ00 = φ), x00 = x0, y00 = y0, a00 = a0, b00 = b0, c00 = c0, resample.point = linePoint
            }

            function ringEnd() {
                resampleLineTo(x0, y0, λ0, a0, b0, c0, x00, y00, λ00, a00, b00, c00, maxDepth, stream), resample.lineEnd = lineEnd, lineEnd()
            }

            var λ00, φ00, x00, y00, a00, b00, c00, λ0, x0, y0, a0, b0, c0, resample = {
                point: point,
                lineStart: lineStart,
                lineEnd: lineEnd,
                polygonStart: function () {
                    stream.polygonStart(), resample.lineStart = ringStart
                },
                polygonEnd: function () {
                    stream.polygonEnd(), resample.lineStart = lineStart
                }
            };
            return resample
        }

        function resampleLineTo(x0, y0, λ0, a0, b0, c0, x1, y1, λ1, a1, b1, c1, depth, stream) {
            var dx = x1 - x0, dy = y1 - y0, d2 = dx * dx + dy * dy;
            if (d2 > 4 * δ2 && depth--) {
                var a = a0 + a1, b = b0 + b1, c = c0 + c1, m = Math.sqrt(a * a + b * b + c * c), φ2 = Math.asin(c /= m), λ2 = abs(abs(c) - 1) < ε || abs(λ0 - λ1) < ε ? (λ0 + λ1) / 2 : Math.atan2(b, a), p = project(λ2, φ2), x2 = p[0], y2 = p[1], dx2 = x2 - x0, dy2 = y2 - y0, dz = dy * dx2 - dx * dy2;
                (dz * dz / d2 > δ2 || abs((dx * dx2 + dy * dy2) / d2 - .5) > .3 || cosMinDistance > a0 * a1 + b0 * b1 + c0 * c1) && (resampleLineTo(x0, y0, λ0, a0, b0, c0, x2, y2, λ2, a /= m, b /= m, c, depth, stream), stream.point(x2, y2), resampleLineTo(x2, y2, λ2, a, b, c, x1, y1, λ1, a1, b1, c1, depth, stream))
            }
        }

        var δ2 = .5, cosMinDistance = Math.cos(30 * d3_radians), maxDepth = 16;
        return resample.precision = function (_) {
            return arguments.length ? (maxDepth = (δ2 = _ * _) > 0 && 16, resample) : Math.sqrt(δ2)
        }, resample
    }

    function d3_geo_pathProjectStream(project) {
        var resample = d3_geo_resample(function (x, y) {
            return project([x * d3_degrees, y * d3_degrees])
        });
        return function (stream) {
            return d3_geo_projectionRadians(resample(stream))
        }
    }

    function d3_geo_transform(stream) {
        this.stream = stream
    }

    function d3_geo_transformPoint(stream, point) {
        return {
            point: point, sphere: function () {
                stream.sphere()
            }, lineStart: function () {
                stream.lineStart()
            }, lineEnd: function () {
                stream.lineEnd()
            }, polygonStart: function () {
                stream.polygonStart()
            }, polygonEnd: function () {
                stream.polygonEnd()
            }
        }
    }

    function d3_geo_projection(project) {
        return d3_geo_projectionMutator(function () {
            return project
        })()
    }

    function d3_geo_projectionMutator(projectAt) {
        function projection(point) {
            return point = projectRotate(point[0] * d3_radians, point[1] * d3_radians), [point[0] * k + δx, δy - point[1] * k]
        }

        function invert(point) {
            return point = projectRotate.invert((point[0] - δx) / k, (δy - point[1]) / k), point && [point[0] * d3_degrees, point[1] * d3_degrees]
        }

        function reset() {
            projectRotate = d3_geo_compose(rotate = d3_geo_rotation(δλ, δφ, δγ), project);
            var center = project(λ, φ);
            return δx = x - center[0] * k, δy = y + center[1] * k, invalidate()
        }

        function invalidate() {
            return stream && (stream.valid = !1, stream = null), projection
        }

        var project, rotate, projectRotate, δx, δy, stream, projectResample = d3_geo_resample(function (x, y) {
            return x = project(x, y), [x[0] * k + δx, δy - x[1] * k]
        }), k = 150, x = 480, y = 250, λ = 0, φ = 0, δλ = 0, δφ = 0, δγ = 0, preclip = d3_geo_clipAntimeridian, postclip = d3_identity, clipAngle = null, clipExtent = null;
        return projection.stream = function (output) {
            return stream && (stream.valid = !1), stream = d3_geo_projectionRadians(preclip(rotate, projectResample(postclip(output)))), stream.valid = !0, stream
        }, projection.clipAngle = function (_) {
            return arguments.length ? (preclip = null == _ ? (clipAngle = _, d3_geo_clipAntimeridian) : d3_geo_clipCircle((clipAngle = +_) * d3_radians), invalidate()) : clipAngle
        }, projection.clipExtent = function (_) {
            return arguments.length ? (clipExtent = _, postclip = _ ? d3_geo_clipExtent(_[0][0], _[0][1], _[1][0], _[1][1]) : d3_identity, invalidate()) : clipExtent
        }, projection.scale = function (_) {
            return arguments.length ? (k = +_, reset()) : k
        }, projection.translate = function (_) {
            return arguments.length ? (x = +_[0], y = +_[1], reset()) : [x, y]
        }, projection.center = function (_) {
            return arguments.length ? (λ = _[0] % 360 * d3_radians, φ = _[1] % 360 * d3_radians, reset()) : [λ * d3_degrees, φ * d3_degrees]
        }, projection.rotate = function (_) {
            return arguments.length ? (δλ = _[0] % 360 * d3_radians, δφ = _[1] % 360 * d3_radians, δγ = _.length > 2 ? _[2] % 360 * d3_radians : 0, reset()) : [δλ * d3_degrees, δφ * d3_degrees, δγ * d3_degrees]
        }, d3.rebind(projection, projectResample, "precision"), function () {
            return project = projectAt.apply(this, arguments), projection.invert = project.invert && invert, reset()
        }
    }

    function d3_geo_projectionRadians(stream) {
        return d3_geo_transformPoint(stream, function (x, y) {
            stream.point(x * d3_radians, y * d3_radians)
        })
    }

    function d3_geo_equirectangular(λ, φ) {
        return [λ, φ]
    }

    function d3_geo_identityRotation(λ, φ) {
        return [λ > π ? λ - τ : -π > λ ? λ + τ : λ, φ]
    }

    function d3_geo_rotation(δλ, δφ, δγ) {
        return δλ ? δφ || δγ ? d3_geo_compose(d3_geo_rotationλ(δλ), d3_geo_rotationφγ(δφ, δγ)) : d3_geo_rotationλ(δλ) : δφ || δγ ? d3_geo_rotationφγ(δφ, δγ) : d3_geo_identityRotation
    }

    function d3_geo_forwardRotationλ(δλ) {
        return function (λ, φ) {
            return λ += δλ, [λ > π ? λ - τ : -π > λ ? λ + τ : λ, φ]
        }
    }

    function d3_geo_rotationλ(δλ) {
        var rotation = d3_geo_forwardRotationλ(δλ);
        return rotation.invert = d3_geo_forwardRotationλ(-δλ), rotation
    }

    function d3_geo_rotationφγ(δφ, δγ) {
        function rotation(λ, φ) {
            var cosφ = Math.cos(φ), x = Math.cos(λ) * cosφ, y = Math.sin(λ) * cosφ, z = Math.sin(φ), k = z * cosδφ + x * sinδφ;
            return [Math.atan2(y * cosδγ - k * sinδγ, x * cosδφ - z * sinδφ), d3_asin(k * cosδγ + y * sinδγ)]
        }

        var cosδφ = Math.cos(δφ), sinδφ = Math.sin(δφ), cosδγ = Math.cos(δγ), sinδγ = Math.sin(δγ);
        return rotation.invert = function (λ, φ) {
            var cosφ = Math.cos(φ), x = Math.cos(λ) * cosφ, y = Math.sin(λ) * cosφ, z = Math.sin(φ), k = z * cosδγ - y * sinδγ;
            return [Math.atan2(y * cosδγ + z * sinδγ, x * cosδφ + k * sinδφ), d3_asin(k * cosδφ - x * sinδφ)]
        }, rotation
    }

    function d3_geo_circleInterpolate(radius, precision) {
        var cr = Math.cos(radius), sr = Math.sin(radius);
        return function (from, to, direction, listener) {
            var step = direction * precision;
            null != from ? (from = d3_geo_circleAngle(cr, from), to = d3_geo_circleAngle(cr, to), (direction > 0 ? to > from : from > to) && (from += direction * τ)) : (from = radius + direction * τ, to = radius - .5 * step);
            for (var point, t = from; direction > 0 ? t > to : to > t; t -= step)listener.point((point = d3_geo_spherical([cr, -sr * Math.cos(t), -sr * Math.sin(t)]))[0], point[1])
        }
    }

    function d3_geo_circleAngle(cr, point) {
        var a = d3_geo_cartesian(point);
        a[0] -= cr, d3_geo_cartesianNormalize(a);
        var angle = d3_acos(-a[1]);
        return ((-a[2] < 0 ? -angle : angle) + 2 * Math.PI - ε) % (2 * Math.PI)
    }

    function d3_geo_graticuleX(y0, y1, dy) {
        var y = d3.range(y0, y1 - ε, dy).concat(y1);
        return function (x) {
            return y.map(function (y) {
                return [x, y]
            })
        }
    }

    function d3_geo_graticuleY(x0, x1, dx) {
        var x = d3.range(x0, x1 - ε, dx).concat(x1);
        return function (y) {
            return x.map(function (x) {
                return [x, y]
            })
        }
    }

    function d3_source(d) {
        return d.source
    }

    function d3_target(d) {
        return d.target
    }

    function d3_geo_interpolate(x0, y0, x1, y1) {
        var cy0 = Math.cos(y0), sy0 = Math.sin(y0), cy1 = Math.cos(y1), sy1 = Math.sin(y1), kx0 = cy0 * Math.cos(x0), ky0 = cy0 * Math.sin(x0), kx1 = cy1 * Math.cos(x1), ky1 = cy1 * Math.sin(x1), d = 2 * Math.asin(Math.sqrt(d3_haversin(y1 - y0) + cy0 * cy1 * d3_haversin(x1 - x0))), k = 1 / Math.sin(d), interpolate = d ? function (t) {
            var B = Math.sin(t *= d) * k, A = Math.sin(d - t) * k, x = A * kx0 + B * kx1, y = A * ky0 + B * ky1, z = A * sy0 + B * sy1;
            return [Math.atan2(y, x) * d3_degrees, Math.atan2(z, Math.sqrt(x * x + y * y)) * d3_degrees]
        } : function () {
            return [x0 * d3_degrees, y0 * d3_degrees]
        };
        return interpolate.distance = d, interpolate
    }

    function d3_geo_lengthLineStart() {
        function nextPoint(λ, φ) {
            var sinφ = Math.sin(φ *= d3_radians), cosφ = Math.cos(φ), t = abs((λ *= d3_radians) - λ0), cosΔλ = Math.cos(t);
            d3_geo_lengthSum += Math.atan2(Math.sqrt((t = cosφ * Math.sin(t)) * t + (t = cosφ0 * sinφ - sinφ0 * cosφ * cosΔλ) * t), sinφ0 * sinφ + cosφ0 * cosφ * cosΔλ), λ0 = λ, sinφ0 = sinφ, cosφ0 = cosφ
        }

        var λ0, sinφ0, cosφ0;
        d3_geo_length.point = function (λ, φ) {
            λ0 = λ * d3_radians, sinφ0 = Math.sin(φ *= d3_radians), cosφ0 = Math.cos(φ), d3_geo_length.point = nextPoint
        }, d3_geo_length.lineEnd = function () {
            d3_geo_length.point = d3_geo_length.lineEnd = d3_noop
        }
    }

    function d3_geo_azimuthal(scale, angle) {
        function azimuthal(λ, φ) {
            var cosλ = Math.cos(λ), cosφ = Math.cos(φ), k = scale(cosλ * cosφ);
            return [k * cosφ * Math.sin(λ), k * Math.sin(φ)]
        }

        return azimuthal.invert = function (x, y) {
            var ρ = Math.sqrt(x * x + y * y), c = angle(ρ), sinc = Math.sin(c), cosc = Math.cos(c);
            return [Math.atan2(x * sinc, ρ * cosc), Math.asin(ρ && y * sinc / ρ)]
        }, azimuthal
    }

    function d3_geo_conicConformal(φ0, φ1) {
        function forward(λ, φ) {
            F > 0 ? -halfπ + ε > φ && (φ = -halfπ + ε) : φ > halfπ - ε && (φ = halfπ - ε);
            var ρ = F / Math.pow(t(φ), n);
            return [ρ * Math.sin(n * λ), F - ρ * Math.cos(n * λ)]
        }

        var cosφ0 = Math.cos(φ0), t = function (φ) {
            return Math.tan(π / 4 + φ / 2)
        }, n = φ0 === φ1 ? Math.sin(φ0) : Math.log(cosφ0 / Math.cos(φ1)) / Math.log(t(φ1) / t(φ0)), F = cosφ0 * Math.pow(t(φ0), n) / n;
        return n ? (forward.invert = function (x, y) {
            var ρ0_y = F - y, ρ = d3_sgn(n) * Math.sqrt(x * x + ρ0_y * ρ0_y);
            return [Math.atan2(x, ρ0_y) / n, 2 * Math.atan(Math.pow(F / ρ, 1 / n)) - halfπ]
        }, forward) : d3_geo_mercator
    }

    function d3_geo_conicEquidistant(φ0, φ1) {
        function forward(λ, φ) {
            var ρ = G - φ;
            return [ρ * Math.sin(n * λ), G - ρ * Math.cos(n * λ)]
        }

        var cosφ0 = Math.cos(φ0), n = φ0 === φ1 ? Math.sin(φ0) : (cosφ0 - Math.cos(φ1)) / (φ1 - φ0), G = cosφ0 / n + φ0;
        return abs(n) < ε ? d3_geo_equirectangular : (forward.invert = function (x, y) {
            var ρ0_y = G - y;
            return [Math.atan2(x, ρ0_y) / n, G - d3_sgn(n) * Math.sqrt(x * x + ρ0_y * ρ0_y)]
        }, forward)
    }

    function d3_geo_mercator(λ, φ) {
        return [λ, Math.log(Math.tan(π / 4 + φ / 2))]
    }

    function d3_geo_mercatorProjection(project) {
        var clipAuto, m = d3_geo_projection(project), scale = m.scale, translate = m.translate, clipExtent = m.clipExtent;
        return m.scale = function () {
            var v = scale.apply(m, arguments);
            return v === m ? clipAuto ? m.clipExtent(null) : m : v
        }, m.translate = function () {
            var v = translate.apply(m, arguments);
            return v === m ? clipAuto ? m.clipExtent(null) : m : v
        }, m.clipExtent = function (_) {
            var v = clipExtent.apply(m, arguments);
            if (v === m) {
                if (clipAuto = null == _) {
                    var k = π * scale(), t = translate();
                    clipExtent([[t[0] - k, t[1] - k], [t[0] + k, t[1] + k]])
                }
            } else clipAuto && (v = null);
            return v
        }, m.clipExtent(null)
    }

    function d3_geo_transverseMercator(λ, φ) {
        return [Math.log(Math.tan(π / 4 + φ / 2)), -λ]
    }

    function d3_geom_pointX(d) {
        return d[0]
    }

    function d3_geom_pointY(d) {
        return d[1]
    }

    function d3_geom_hullUpper(points) {
        for (var n = points.length, hull = [0, 1], hs = 2, i = 2; n > i; i++) {
            for (; hs > 1 && d3_cross2d(points[hull[hs - 2]], points[hull[hs - 1]], points[i]) <= 0;)--hs;
            hull[hs++] = i
        }
        return hull.slice(0, hs)
    }

    function d3_geom_hullOrder(a, b) {
        return a[0] - b[0] || a[1] - b[1]
    }

    function d3_geom_polygonInside(p, a, b) {
        return (b[0] - a[0]) * (p[1] - a[1]) < (b[1] - a[1]) * (p[0] - a[0])
    }

    function d3_geom_polygonIntersect(c, d, a, b) {
        var x1 = c[0], x3 = a[0], x21 = d[0] - x1, x43 = b[0] - x3, y1 = c[1], y3 = a[1], y21 = d[1] - y1, y43 = b[1] - y3, ua = (x43 * (y1 - y3) - y43 * (x1 - x3)) / (y43 * x21 - x43 * y21);
        return [x1 + ua * x21, y1 + ua * y21]
    }

    function d3_geom_polygonClosed(coordinates) {
        var a = coordinates[0], b = coordinates[coordinates.length - 1];
        return !(a[0] - b[0] || a[1] - b[1])
    }

    function d3_geom_voronoiBeach() {
        d3_geom_voronoiRedBlackNode(this), this.edge = this.site = this.circle = null
    }

    function d3_geom_voronoiCreateBeach(site) {
        var beach = d3_geom_voronoiBeachPool.pop() || new d3_geom_voronoiBeach;
        return beach.site = site, beach
    }

    function d3_geom_voronoiDetachBeach(beach) {
        d3_geom_voronoiDetachCircle(beach), d3_geom_voronoiBeaches.remove(beach), d3_geom_voronoiBeachPool.push(beach), d3_geom_voronoiRedBlackNode(beach)
    }

    function d3_geom_voronoiRemoveBeach(beach) {
        var circle = beach.circle, x = circle.x, y = circle.cy, vertex = {
            x: x,
            y: y
        }, previous = beach.P, next = beach.N, disappearing = [beach];
        d3_geom_voronoiDetachBeach(beach);
        for (var lArc = previous; lArc.circle && abs(x - lArc.circle.x) < ε && abs(y - lArc.circle.cy) < ε;)previous = lArc.P, disappearing.unshift(lArc), d3_geom_voronoiDetachBeach(lArc), lArc = previous;
        disappearing.unshift(lArc), d3_geom_voronoiDetachCircle(lArc);
        for (var rArc = next; rArc.circle && abs(x - rArc.circle.x) < ε && abs(y - rArc.circle.cy) < ε;)next = rArc.N, disappearing.push(rArc), d3_geom_voronoiDetachBeach(rArc), rArc = next;
        disappearing.push(rArc), d3_geom_voronoiDetachCircle(rArc);
        var iArc, nArcs = disappearing.length;
        for (iArc = 1; nArcs > iArc; ++iArc)rArc = disappearing[iArc], lArc = disappearing[iArc - 1], d3_geom_voronoiSetEdgeEnd(rArc.edge, lArc.site, rArc.site, vertex);
        lArc = disappearing[0], rArc = disappearing[nArcs - 1], rArc.edge = d3_geom_voronoiCreateEdge(lArc.site, rArc.site, null, vertex), d3_geom_voronoiAttachCircle(lArc), d3_geom_voronoiAttachCircle(rArc)
    }

    function d3_geom_voronoiAddBeach(site) {
        for (var lArc, rArc, dxl, dxr, x = site.x, directrix = site.y, node = d3_geom_voronoiBeaches._; node;)if (dxl = d3_geom_voronoiLeftBreakPoint(node, directrix) - x, dxl > ε)node = node.L; else {
            if (dxr = x - d3_geom_voronoiRightBreakPoint(node, directrix), !(dxr > ε)) {
                dxl > -ε ? (lArc = node.P, rArc = node) : dxr > -ε ? (lArc = node, rArc = node.N) : lArc = rArc = node;
                break
            }
            if (!node.R) {
                lArc = node;
                break
            }
            node = node.R
        }
        var newArc = d3_geom_voronoiCreateBeach(site);
        if (d3_geom_voronoiBeaches.insert(lArc, newArc), lArc || rArc) {
            if (lArc === rArc)return d3_geom_voronoiDetachCircle(lArc), rArc = d3_geom_voronoiCreateBeach(lArc.site), d3_geom_voronoiBeaches.insert(newArc, rArc), newArc.edge = rArc.edge = d3_geom_voronoiCreateEdge(lArc.site, newArc.site), d3_geom_voronoiAttachCircle(lArc), void d3_geom_voronoiAttachCircle(rArc);
            if (!rArc)return void(newArc.edge = d3_geom_voronoiCreateEdge(lArc.site, newArc.site));
            d3_geom_voronoiDetachCircle(lArc), d3_geom_voronoiDetachCircle(rArc);
            var lSite = lArc.site, ax = lSite.x, ay = lSite.y, bx = site.x - ax, by = site.y - ay, rSite = rArc.site, cx = rSite.x - ax, cy = rSite.y - ay, d = 2 * (bx * cy - by * cx), hb = bx * bx + by * by, hc = cx * cx + cy * cy, vertex = {
                x: (cy * hb - by * hc) / d + ax,
                y: (bx * hc - cx * hb) / d + ay
            };
            d3_geom_voronoiSetEdgeEnd(rArc.edge, lSite, rSite, vertex), newArc.edge = d3_geom_voronoiCreateEdge(lSite, site, null, vertex), rArc.edge = d3_geom_voronoiCreateEdge(site, rSite, null, vertex), d3_geom_voronoiAttachCircle(lArc), d3_geom_voronoiAttachCircle(rArc)
        }
    }

    function d3_geom_voronoiLeftBreakPoint(arc, directrix) {
        var site = arc.site, rfocx = site.x, rfocy = site.y, pby2 = rfocy - directrix;
        if (!pby2)return rfocx;
        var lArc = arc.P;
        if (!lArc)return -1 / 0;
        site = lArc.site;
        var lfocx = site.x, lfocy = site.y, plby2 = lfocy - directrix;
        if (!plby2)return lfocx;
        var hl = lfocx - rfocx, aby2 = 1 / pby2 - 1 / plby2, b = hl / plby2;
        return aby2 ? (-b + Math.sqrt(b * b - 2 * aby2 * (hl * hl / (-2 * plby2) - lfocy + plby2 / 2 + rfocy - pby2 / 2))) / aby2 + rfocx : (rfocx + lfocx) / 2
    }

    function d3_geom_voronoiRightBreakPoint(arc, directrix) {
        var rArc = arc.N;
        if (rArc)return d3_geom_voronoiLeftBreakPoint(rArc, directrix);
        var site = arc.site;
        return site.y === directrix ? site.x : 1 / 0
    }

    function d3_geom_voronoiCell(site) {
        this.site = site, this.edges = []
    }

    function d3_geom_voronoiCloseCells(extent) {
        for (var x2, y2, x3, y3, cell, iHalfEdge, halfEdges, nHalfEdges, start, end, x0 = extent[0][0], x1 = extent[1][0], y0 = extent[0][1], y1 = extent[1][1], cells = d3_geom_voronoiCells, iCell = cells.length; iCell--;)if (cell = cells[iCell], cell && cell.prepare())for (halfEdges = cell.edges, nHalfEdges = halfEdges.length, iHalfEdge = 0; nHalfEdges > iHalfEdge;)end = halfEdges[iHalfEdge].end(), x3 = end.x, y3 = end.y, start = halfEdges[++iHalfEdge % nHalfEdges].start(), x2 = start.x, y2 = start.y, (abs(x3 - x2) > ε || abs(y3 - y2) > ε) && (halfEdges.splice(iHalfEdge, 0, new d3_geom_voronoiHalfEdge(d3_geom_voronoiCreateBorderEdge(cell.site, end, abs(x3 - x0) < ε && y1 - y3 > ε ? {
            x: x0,
            y: abs(x2 - x0) < ε ? y2 : y1
        } : abs(y3 - y1) < ε && x1 - x3 > ε ? {
            x: abs(y2 - y1) < ε ? x2 : x1,
            y: y1
        } : abs(x3 - x1) < ε && y3 - y0 > ε ? {
            x: x1,
            y: abs(x2 - x1) < ε ? y2 : y0
        } : abs(y3 - y0) < ε && x3 - x0 > ε ? {
            x: abs(y2 - y0) < ε ? x2 : x0,
            y: y0
        } : null), cell.site, null)), ++nHalfEdges)
    }

    function d3_geom_voronoiHalfEdgeOrder(a, b) {
        return b.angle - a.angle
    }

    function d3_geom_voronoiCircle() {
        d3_geom_voronoiRedBlackNode(this), this.x = this.y = this.arc = this.site = this.cy = null
    }

    function d3_geom_voronoiAttachCircle(arc) {
        var lArc = arc.P, rArc = arc.N;
        if (lArc && rArc) {
            var lSite = lArc.site, cSite = arc.site, rSite = rArc.site;
            if (lSite !== rSite) {
                var bx = cSite.x, by = cSite.y, ax = lSite.x - bx, ay = lSite.y - by, cx = rSite.x - bx, cy = rSite.y - by, d = 2 * (ax * cy - ay * cx);
                if (!(d >= -ε2)) {
                    var ha = ax * ax + ay * ay, hc = cx * cx + cy * cy, x = (cy * ha - ay * hc) / d, y = (ax * hc - cx * ha) / d, cy = y + by, circle = d3_geom_voronoiCirclePool.pop() || new d3_geom_voronoiCircle;
                    circle.arc = arc, circle.site = cSite, circle.x = x + bx, circle.y = cy + Math.sqrt(x * x + y * y), circle.cy = cy, arc.circle = circle;
                    for (var before = null, node = d3_geom_voronoiCircles._; node;)if (circle.y < node.y || circle.y === node.y && circle.x <= node.x) {
                        if (!node.L) {
                            before = node.P;
                            break
                        }
                        node = node.L
                    } else {
                        if (!node.R) {
                            before = node;
                            break
                        }
                        node = node.R
                    }
                    d3_geom_voronoiCircles.insert(before, circle), before || (d3_geom_voronoiFirstCircle = circle)
                }
            }
        }
    }

    function d3_geom_voronoiDetachCircle(arc) {
        var circle = arc.circle;
        circle && (circle.P || (d3_geom_voronoiFirstCircle = circle.N), d3_geom_voronoiCircles.remove(circle), d3_geom_voronoiCirclePool.push(circle), d3_geom_voronoiRedBlackNode(circle), arc.circle = null)
    }

    function d3_geom_voronoiClipEdges(extent) {
        for (var e, edges = d3_geom_voronoiEdges, clip = d3_geom_clipLine(extent[0][0], extent[0][1], extent[1][0], extent[1][1]), i = edges.length; i--;)e = edges[i], (!d3_geom_voronoiConnectEdge(e, extent) || !clip(e) || abs(e.a.x - e.b.x) < ε && abs(e.a.y - e.b.y) < ε) && (e.a = e.b = null, edges.splice(i, 1))
    }

    function d3_geom_voronoiConnectEdge(edge, extent) {
        var vb = edge.b;
        if (vb)return !0;
        var fm, fb, va = edge.a, x0 = extent[0][0], x1 = extent[1][0], y0 = extent[0][1], y1 = extent[1][1], lSite = edge.l, rSite = edge.r, lx = lSite.x, ly = lSite.y, rx = rSite.x, ry = rSite.y, fx = (lx + rx) / 2, fy = (ly + ry) / 2;
        if (ry === ly) {
            if (x0 > fx || fx >= x1)return;
            if (lx > rx) {
                if (va) {
                    if (va.y >= y1)return
                } else va = {x: fx, y: y0};
                vb = {x: fx, y: y1}
            } else {
                if (va) {
                    if (va.y < y0)return
                } else va = {x: fx, y: y1};
                vb = {x: fx, y: y0}
            }
        } else if (fm = (lx - rx) / (ry - ly), fb = fy - fm * fx, -1 > fm || fm > 1)if (lx > rx) {
            if (va) {
                if (va.y >= y1)return
            } else va = {x: (y0 - fb) / fm, y: y0};
            vb = {x: (y1 - fb) / fm, y: y1}
        } else {
            if (va) {
                if (va.y < y0)return
            } else va = {x: (y1 - fb) / fm, y: y1};
            vb = {x: (y0 - fb) / fm, y: y0}
        } else if (ry > ly) {
            if (va) {
                if (va.x >= x1)return
            } else va = {x: x0, y: fm * x0 + fb};
            vb = {x: x1, y: fm * x1 + fb}
        } else {
            if (va) {
                if (va.x < x0)return
            } else va = {x: x1, y: fm * x1 + fb};
            vb = {x: x0, y: fm * x0 + fb}
        }
        return edge.a = va, edge.b = vb, !0
    }

    function d3_geom_voronoiEdge(lSite, rSite) {
        this.l = lSite, this.r = rSite, this.a = this.b = null
    }

    function d3_geom_voronoiCreateEdge(lSite, rSite, va, vb) {
        var edge = new d3_geom_voronoiEdge(lSite, rSite);
        return d3_geom_voronoiEdges.push(edge), va && d3_geom_voronoiSetEdgeEnd(edge, lSite, rSite, va), vb && d3_geom_voronoiSetEdgeEnd(edge, rSite, lSite, vb), d3_geom_voronoiCells[lSite.i].edges.push(new d3_geom_voronoiHalfEdge(edge, lSite, rSite)), d3_geom_voronoiCells[rSite.i].edges.push(new d3_geom_voronoiHalfEdge(edge, rSite, lSite)), edge
    }

    function d3_geom_voronoiCreateBorderEdge(lSite, va, vb) {
        var edge = new d3_geom_voronoiEdge(lSite, null);
        return edge.a = va, edge.b = vb, d3_geom_voronoiEdges.push(edge), edge
    }

    function d3_geom_voronoiSetEdgeEnd(edge, lSite, rSite, vertex) {
        edge.a || edge.b ? edge.l === rSite ? edge.b = vertex : edge.a = vertex : (edge.a = vertex, edge.l = lSite, edge.r = rSite)
    }

    function d3_geom_voronoiHalfEdge(edge, lSite, rSite) {
        var va = edge.a, vb = edge.b;
        this.edge = edge, this.site = lSite, this.angle = rSite ? Math.atan2(rSite.y - lSite.y, rSite.x - lSite.x) : edge.l === lSite ? Math.atan2(vb.x - va.x, va.y - vb.y) : Math.atan2(va.x - vb.x, vb.y - va.y)
    }

    function d3_geom_voronoiRedBlackTree() {
        this._ = null
    }

    function d3_geom_voronoiRedBlackNode(node) {
        node.U = node.C = node.L = node.R = node.P = node.N = null
    }

    function d3_geom_voronoiRedBlackRotateLeft(tree, node) {
        var p = node, q = node.R, parent = p.U;
        parent ? parent.L === p ? parent.L = q : parent.R = q : tree._ = q, q.U = parent, p.U = q, p.R = q.L, p.R && (p.R.U = p), q.L = p
    }

    function d3_geom_voronoiRedBlackRotateRight(tree, node) {
        var p = node, q = node.L, parent = p.U;
        parent ? parent.L === p ? parent.L = q : parent.R = q : tree._ = q, q.U = parent, p.U = q, p.L = q.R, p.L && (p.L.U = p), q.R = p
    }

    function d3_geom_voronoiRedBlackFirst(node) {
        for (; node.L;)node = node.L;
        return node
    }

    function d3_geom_voronoi(sites, bbox) {
        var x0, y0, circle, site = sites.sort(d3_geom_voronoiVertexOrder).pop();
        for (d3_geom_voronoiEdges = [], d3_geom_voronoiCells = new Array(sites.length), d3_geom_voronoiBeaches = new d3_geom_voronoiRedBlackTree, d3_geom_voronoiCircles = new d3_geom_voronoiRedBlackTree; ;)if (circle = d3_geom_voronoiFirstCircle, site && (!circle || site.y < circle.y || site.y === circle.y && site.x < circle.x))(site.x !== x0 || site.y !== y0) && (d3_geom_voronoiCells[site.i] = new d3_geom_voronoiCell(site), d3_geom_voronoiAddBeach(site), x0 = site.x, y0 = site.y), site = sites.pop(); else {
            if (!circle)break;
            d3_geom_voronoiRemoveBeach(circle.arc)
        }
        bbox && (d3_geom_voronoiClipEdges(bbox), d3_geom_voronoiCloseCells(bbox));
        var diagram = {cells: d3_geom_voronoiCells, edges: d3_geom_voronoiEdges};
        return d3_geom_voronoiBeaches = d3_geom_voronoiCircles = d3_geom_voronoiEdges = d3_geom_voronoiCells = null, diagram
    }

    function d3_geom_voronoiVertexOrder(a, b) {
        return b.y - a.y || b.x - a.x
    }

    function d3_geom_voronoiTriangleArea(a, b, c) {
        return (a.x - c.x) * (b.y - a.y) - (a.x - b.x) * (c.y - a.y)
    }

    function d3_geom_quadtreeCompatX(d) {
        return d.x
    }

    function d3_geom_quadtreeCompatY(d) {
        return d.y
    }

    function d3_geom_quadtreeNode() {
        return {leaf: !0, nodes: [], point: null, x: null, y: null}
    }

    function d3_geom_quadtreeVisit(f, node, x1, y1, x2, y2) {
        if (!f(node, x1, y1, x2, y2)) {
            var sx = .5 * (x1 + x2), sy = .5 * (y1 + y2), children = node.nodes;
            children[0] && d3_geom_quadtreeVisit(f, children[0], x1, y1, sx, sy), children[1] && d3_geom_quadtreeVisit(f, children[1], sx, y1, x2, sy), children[2] && d3_geom_quadtreeVisit(f, children[2], x1, sy, sx, y2), children[3] && d3_geom_quadtreeVisit(f, children[3], sx, sy, x2, y2)
        }
    }

    function d3_geom_quadtreeFind(root, x, y, x0, y0, x3, y3) {
        var closestPoint, minDistance2 = 1 / 0;
        return function find(node, x1, y1, x2, y2) {
            if (!(x1 > x3 || y1 > y3 || x0 > x2 || y0 > y2)) {
                if (point = node.point) {
                    var point, dx = x - point[0], dy = y - point[1], distance2 = dx * dx + dy * dy;
                    if (minDistance2 > distance2) {
                        var distance = Math.sqrt(minDistance2 = distance2);
                        x0 = x - distance, y0 = y - distance, x3 = x + distance, y3 = y + distance, closestPoint = point
                    }
                }
                for (var children = node.nodes, xm = .5 * (x1 + x2), ym = .5 * (y1 + y2), right = x >= xm, below = y >= ym, i = below << 1 | right, j = i + 4; j > i; ++i)if (node = children[3 & i])switch (3 & i) {
                    case 0:
                        find(node, x1, y1, xm, ym);
                        break;
                    case 1:
                        find(node, xm, y1, x2, ym);
                        break;
                    case 2:
                        find(node, x1, ym, xm, y2);
                        break;
                    case 3:
                        find(node, xm, ym, x2, y2)
                }
            }
        }(root, x0, y0, x3, y3), closestPoint
    }

    function d3_interpolateRgb(a, b) {
        a = d3.rgb(a), b = d3.rgb(b);
        var ar = a.r, ag = a.g, ab = a.b, br = b.r - ar, bg = b.g - ag, bb = b.b - ab;
        return function (t) {
            return "#" + d3_rgb_hex(Math.round(ar + br * t)) + d3_rgb_hex(Math.round(ag + bg * t)) + d3_rgb_hex(Math.round(ab + bb * t))
        }
    }

    function d3_interpolateObject(a, b) {
        var k, i = {}, c = {};
        for (k in a)k in b ? i[k] = d3_interpolate(a[k], b[k]) : c[k] = a[k];
        for (k in b)k in a || (c[k] = b[k]);
        return function (t) {
            for (k in i)c[k] = i[k](t);
            return c
        }
    }

    function d3_interpolateNumber(a, b) {
        return a = +a, b = +b, function (t) {
            return a * (1 - t) + b * t
        }
    }

    function d3_interpolateString(a, b) {
        var am, bm, bs, bi = d3_interpolate_numberA.lastIndex = d3_interpolate_numberB.lastIndex = 0, i = -1, s = [], q = [];
        for (a += "", b += ""; (am = d3_interpolate_numberA.exec(a)) && (bm = d3_interpolate_numberB.exec(b));)(bs = bm.index) > bi && (bs = b.slice(bi, bs), s[i] ? s[i] += bs : s[++i] = bs), (am = am[0]) === (bm = bm[0]) ? s[i] ? s[i] += bm : s[++i] = bm : (s[++i] = null, q.push({
            i: i,
            x: d3_interpolateNumber(am, bm)
        })), bi = d3_interpolate_numberB.lastIndex;
        return bi < b.length && (bs = b.slice(bi), s[i] ? s[i] += bs : s[++i] = bs), s.length < 2 ? q[0] ? (b = q[0].x, function (t) {
            return b(t) + ""
        }) : function () {
            return b
        } : (b = q.length, function (t) {
            for (var o, i = 0; b > i; ++i)s[(o = q[i]).i] = o.x(t);
            return s.join("")
        })
    }

    function d3_interpolate(a, b) {
        for (var f, i = d3.interpolators.length; --i >= 0 && !(f = d3.interpolators[i](a, b)););
        return f
    }

    function d3_interpolateArray(a, b) {
        var i, x = [], c = [], na = a.length, nb = b.length, n0 = Math.min(a.length, b.length);
        for (i = 0; n0 > i; ++i)x.push(d3_interpolate(a[i], b[i]));
        for (; na > i; ++i)c[i] = a[i];
        for (; nb > i; ++i)c[i] = b[i];
        return function (t) {
            for (i = 0; n0 > i; ++i)c[i] = x[i](t);
            return c
        }
    }

    function d3_ease_clamp(f) {
        return function (t) {
            return 0 >= t ? 0 : t >= 1 ? 1 : f(t)
        }
    }

    function d3_ease_reverse(f) {
        return function (t) {
            return 1 - f(1 - t)
        }
    }

    function d3_ease_reflect(f) {
        return function (t) {
            return .5 * (.5 > t ? f(2 * t) : 2 - f(2 - 2 * t))
        }
    }

    function d3_ease_quad(t) {
        return t * t
    }

    function d3_ease_cubic(t) {
        return t * t * t
    }

    function d3_ease_cubicInOut(t) {
        if (0 >= t)return 0;
        if (t >= 1)return 1;
        var t2 = t * t, t3 = t2 * t;
        return 4 * (.5 > t ? t3 : 3 * (t - t2) + t3 - .75)
    }

    function d3_ease_poly(e) {
        return function (t) {
            return Math.pow(t, e)
        }
    }

    function d3_ease_sin(t) {
        return 1 - Math.cos(t * halfπ)
    }

    function d3_ease_exp(t) {
        return Math.pow(2, 10 * (t - 1))
    }

    function d3_ease_circle(t) {
        return 1 - Math.sqrt(1 - t * t)
    }

    function d3_ease_elastic(a, p) {
        var s;
        return arguments.length < 2 && (p = .45), arguments.length ? s = p / τ * Math.asin(1 / a) : (a = 1, s = p / 4), function (t) {
            return 1 + a * Math.pow(2, -10 * t) * Math.sin((t - s) * τ / p)
        }
    }

    function d3_ease_back(s) {
        return s || (s = 1.70158), function (t) {
            return t * t * ((s + 1) * t - s)
        }
    }

    function d3_ease_bounce(t) {
        return 1 / 2.75 > t ? 7.5625 * t * t : 2 / 2.75 > t ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : 2.5 / 2.75 > t ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375
    }

    function d3_interpolateHcl(a, b) {
        a = d3.hcl(a), b = d3.hcl(b);
        var ah = a.h, ac = a.c, al = a.l, bh = b.h - ah, bc = b.c - ac, bl = b.l - al;
        return isNaN(bc) && (bc = 0, ac = isNaN(ac) ? b.c : ac), isNaN(bh) ? (bh = 0, ah = isNaN(ah) ? b.h : ah) : bh > 180 ? bh -= 360 : -180 > bh && (bh += 360), function (t) {
            return d3_hcl_lab(ah + bh * t, ac + bc * t, al + bl * t) + ""
        }
    }

    function d3_interpolateHsl(a, b) {
        a = d3.hsl(a), b = d3.hsl(b);
        var ah = a.h, as = a.s, al = a.l, bh = b.h - ah, bs = b.s - as, bl = b.l - al;
        return isNaN(bs) && (bs = 0, as = isNaN(as) ? b.s : as), isNaN(bh) ? (bh = 0, ah = isNaN(ah) ? b.h : ah) : bh > 180 ? bh -= 360 : -180 > bh && (bh += 360), function (t) {
            return d3_hsl_rgb(ah + bh * t, as + bs * t, al + bl * t) + ""
        }
    }

    function d3_interpolateLab(a, b) {
        a = d3.lab(a), b = d3.lab(b);
        var al = a.l, aa = a.a, ab = a.b, bl = b.l - al, ba = b.a - aa, bb = b.b - ab;
        return function (t) {
            return d3_lab_rgb(al + bl * t, aa + ba * t, ab + bb * t) + ""
        }
    }

    function d3_interpolateRound(a, b) {
        return b -= a, function (t) {
            return Math.round(a + b * t)
        }
    }

    function d3_transform(m) {
        var r0 = [m.a, m.b], r1 = [m.c, m.d], kx = d3_transformNormalize(r0), kz = d3_transformDot(r0, r1), ky = d3_transformNormalize(d3_transformCombine(r1, r0, -kz)) || 0;
        r0[0] * r1[1] < r1[0] * r0[1] && (r0[0] *= -1, r0[1] *= -1, kx *= -1, kz *= -1), this.rotate = (kx ? Math.atan2(r0[1], r0[0]) : Math.atan2(-r1[0], r1[1])) * d3_degrees, this.translate = [m.e, m.f], this.scale = [kx, ky], this.skew = ky ? Math.atan2(kz, ky) * d3_degrees : 0
    }

    function d3_transformDot(a, b) {
        return a[0] * b[0] + a[1] * b[1]
    }

    function d3_transformNormalize(a) {
        var k = Math.sqrt(d3_transformDot(a, a));
        return k && (a[0] /= k, a[1] /= k), k
    }

    function d3_transformCombine(a, b, k) {
        return a[0] += k * b[0], a[1] += k * b[1], a
    }

    function d3_interpolateTransform(a, b) {
        var n, s = [], q = [], A = d3.transform(a), B = d3.transform(b), ta = A.translate, tb = B.translate, ra = A.rotate, rb = B.rotate, wa = A.skew, wb = B.skew, ka = A.scale, kb = B.scale;
        return ta[0] != tb[0] || ta[1] != tb[1] ? (s.push("translate(", null, ",", null, ")"), q.push({
            i: 1,
            x: d3_interpolateNumber(ta[0], tb[0])
        }, {
            i: 3,
            x: d3_interpolateNumber(ta[1], tb[1])
        })) : s.push(tb[0] || tb[1] ? "translate(" + tb + ")" : ""), ra != rb ? (ra - rb > 180 ? rb += 360 : rb - ra > 180 && (ra += 360), q.push({
            i: s.push(s.pop() + "rotate(", null, ")") - 2,
            x: d3_interpolateNumber(ra, rb)
        })) : rb && s.push(s.pop() + "rotate(" + rb + ")"), wa != wb ? q.push({
            i: s.push(s.pop() + "skewX(", null, ")") - 2,
            x: d3_interpolateNumber(wa, wb)
        }) : wb && s.push(s.pop() + "skewX(" + wb + ")"), ka[0] != kb[0] || ka[1] != kb[1] ? (n = s.push(s.pop() + "scale(", null, ",", null, ")"), q.push({
            i: n - 4,
            x: d3_interpolateNumber(ka[0], kb[0])
        }, {
            i: n - 2,
            x: d3_interpolateNumber(ka[1], kb[1])
        })) : (1 != kb[0] || 1 != kb[1]) && s.push(s.pop() + "scale(" + kb + ")"), n = q.length, function (t) {
            for (var o, i = -1; ++i < n;)s[(o = q[i]).i] = o.x(t);
            return s.join("")
        }
    }

    function d3_uninterpolateNumber(a, b) {
        return b = (b -= a = +a) || 1 / b, function (x) {
            return (x - a) / b
        }
    }

    function d3_uninterpolateClamp(a, b) {
        return b = (b -= a = +a) || 1 / b, function (x) {
            return Math.max(0, Math.min(1, (x - a) / b))
        }
    }

    function d3_layout_bundlePath(link) {
        for (var start = link.source, end = link.target, lca = d3_layout_bundleLeastCommonAncestor(start, end), points = [start]; start !== lca;)start = start.parent, points.push(start);
        for (var k = points.length; end !== lca;)points.splice(k, 0, end), end = end.parent;
        return points
    }

    function d3_layout_bundleAncestors(node) {
        for (var ancestors = [], parent = node.parent; null != parent;)ancestors.push(node), node = parent, parent = parent.parent;
        return ancestors.push(node), ancestors
    }

    function d3_layout_bundleLeastCommonAncestor(a, b) {
        if (a === b)return a;
        for (var aNodes = d3_layout_bundleAncestors(a), bNodes = d3_layout_bundleAncestors(b), aNode = aNodes.pop(), bNode = bNodes.pop(), sharedNode = null; aNode === bNode;)sharedNode = aNode, aNode = aNodes.pop(), bNode = bNodes.pop();
        return sharedNode
    }

    function d3_layout_forceDragstart(d) {
        d.fixed |= 2
    }

    function d3_layout_forceDragend(d) {
        d.fixed &= -7
    }

    function d3_layout_forceMouseover(d) {
        d.fixed |= 4, d.px = d.x, d.py = d.y
    }

    function d3_layout_forceMouseout(d) {
        d.fixed &= -5
    }

    function d3_layout_forceAccumulate(quad, alpha, charges) {
        var cx = 0, cy = 0;
        if (quad.charge = 0, !quad.leaf)for (var c, nodes = quad.nodes, n = nodes.length, i = -1; ++i < n;)c = nodes[i], null != c && (d3_layout_forceAccumulate(c, alpha, charges), quad.charge += c.charge, cx += c.charge * c.cx, cy += c.charge * c.cy);
        if (quad.point) {
            quad.leaf || (quad.point.x += Math.random() - .5, quad.point.y += Math.random() - .5);
            var k = alpha * charges[quad.point.index];
            quad.charge += quad.pointCharge = k, cx += k * quad.point.x, cy += k * quad.point.y
        }
        quad.cx = cx / quad.charge, quad.cy = cy / quad.charge
    }

    function d3_layout_hierarchyRebind(object, hierarchy) {
        return d3.rebind(object, hierarchy, "sort", "children", "value"), object.nodes = object, object.links = d3_layout_hierarchyLinks, object
    }

    function d3_layout_hierarchyVisitBefore(node, callback) {
        for (var nodes = [node]; null != (node = nodes.pop());)if (callback(node), (children = node.children) && (n = children.length))for (var n, children; --n >= 0;)nodes.push(children[n])
    }

    function d3_layout_hierarchyVisitAfter(node, callback) {
        for (var nodes = [node], nodes2 = []; null != (node = nodes.pop());)if (nodes2.push(node), (children = node.children) && (n = children.length))for (var n, children, i = -1; ++i < n;)nodes.push(children[i]);
        for (; null != (node = nodes2.pop());)callback(node)
    }

    function d3_layout_hierarchyChildren(d) {
        return d.children
    }

    function d3_layout_hierarchyValue(d) {
        return d.value
    }

    function d3_layout_hierarchySort(a, b) {
        return b.value - a.value
    }

    function d3_layout_hierarchyLinks(nodes) {
        return d3.merge(nodes.map(function (parent) {
            return (parent.children || []).map(function (child) {
                return {source: parent, target: child}
            })
        }))
    }

    function d3_layout_stackX(d) {
        return d.x
    }

    function d3_layout_stackY(d) {
        return d.y
    }

    function d3_layout_stackOut(d, y0, y) {
        d.y0 = y0, d.y = y
    }

    function d3_layout_stackOrderDefault(data) {
        return d3.range(data.length)
    }

    function d3_layout_stackOffsetZero(data) {
        for (var j = -1, m = data[0].length, y0 = []; ++j < m;)y0[j] = 0;
        return y0
    }

    function d3_layout_stackMaxIndex(array) {
        for (var k, i = 1, j = 0, v = array[0][1], n = array.length; n > i; ++i)(k = array[i][1]) > v && (j = i, v = k);
        return j
    }

    function d3_layout_stackReduceSum(d) {
        return d.reduce(d3_layout_stackSum, 0)
    }

    function d3_layout_stackSum(p, d) {
        return p + d[1]
    }

    function d3_layout_histogramBinSturges(range, values) {
        return d3_layout_histogramBinFixed(range, Math.ceil(Math.log(values.length) / Math.LN2 + 1))
    }

    function d3_layout_histogramBinFixed(range, n) {
        for (var x = -1, b = +range[0], m = (range[1] - b) / n, f = []; ++x <= n;)f[x] = m * x + b;
        return f
    }

    function d3_layout_histogramRange(values) {
        return [d3.min(values), d3.max(values)]
    }

    function d3_layout_packSort(a, b) {
        return a.value - b.value
    }

    function d3_layout_packInsert(a, b) {
        var c = a._pack_next;
        a._pack_next = b, b._pack_prev = a, b._pack_next = c, c._pack_prev = b
    }

    function d3_layout_packSplice(a, b) {
        a._pack_next = b, b._pack_prev = a
    }

    function d3_layout_packIntersects(a, b) {
        var dx = b.x - a.x, dy = b.y - a.y, dr = a.r + b.r;
        return .999 * dr * dr > dx * dx + dy * dy
    }

    function d3_layout_packSiblings(node) {
        function bound(node) {
            xMin = Math.min(node.x - node.r, xMin), xMax = Math.max(node.x + node.r, xMax), yMin = Math.min(node.y - node.r, yMin), yMax = Math.max(node.y + node.r, yMax)
        }

        if ((nodes = node.children) && (n = nodes.length)) {
            var nodes, a, b, c, i, j, k, n, xMin = 1 / 0, xMax = -1 / 0, yMin = 1 / 0, yMax = -1 / 0;
            if (nodes.forEach(d3_layout_packLink), a = nodes[0], a.x = -a.r, a.y = 0, bound(a), n > 1 && (b = nodes[1], b.x = b.r, b.y = 0, bound(b), n > 2))for (c = nodes[2], d3_layout_packPlace(a, b, c), bound(c), d3_layout_packInsert(a, c), a._pack_prev = c, d3_layout_packInsert(c, b), b = a._pack_next, i = 3; n > i; i++) {
                d3_layout_packPlace(a, b, c = nodes[i]);
                var isect = 0, s1 = 1, s2 = 1;
                for (j = b._pack_next; j !== b; j = j._pack_next, s1++)if (d3_layout_packIntersects(j, c)) {
                    isect = 1;
                    break
                }
                if (1 == isect)for (k = a._pack_prev; k !== j._pack_prev && !d3_layout_packIntersects(k, c); k = k._pack_prev, s2++);
                isect ? (s2 > s1 || s1 == s2 && b.r < a.r ? d3_layout_packSplice(a, b = j) : d3_layout_packSplice(a = k, b), i--) : (d3_layout_packInsert(a, c), b = c, bound(c))
            }
            var cx = (xMin + xMax) / 2, cy = (yMin + yMax) / 2, cr = 0;
            for (i = 0; n > i; i++)c = nodes[i], c.x -= cx, c.y -= cy, cr = Math.max(cr, c.r + Math.sqrt(c.x * c.x + c.y * c.y));
            node.r = cr, nodes.forEach(d3_layout_packUnlink)
        }
    }

    function d3_layout_packLink(node) {
        node._pack_next = node._pack_prev = node
    }

    function d3_layout_packUnlink(node) {
        delete node._pack_next, delete node._pack_prev
    }

    function d3_layout_packTransform(node, x, y, k) {
        var children = node.children;
        if (node.x = x += k * node.x, node.y = y += k * node.y, node.r *= k, children)for (var i = -1, n = children.length; ++i < n;)d3_layout_packTransform(children[i], x, y, k)
    }

    function d3_layout_packPlace(a, b, c) {
        var db = a.r + c.r, dx = b.x - a.x, dy = b.y - a.y;
        if (db && (dx || dy)) {
            var da = b.r + c.r, dc = dx * dx + dy * dy;
            da *= da, db *= db;
            var x = .5 + (db - da) / (2 * dc), y = Math.sqrt(Math.max(0, 2 * da * (db + dc) - (db -= dc) * db - da * da)) / (2 * dc);
            c.x = a.x + x * dx + y * dy, c.y = a.y + x * dy - y * dx
        } else c.x = a.x + db, c.y = a.y
    }

    function d3_layout_treeSeparation(a, b) {
        return a.parent == b.parent ? 1 : 2
    }

    function d3_layout_treeLeft(v) {
        var children = v.children;
        return children.length ? children[0] : v.t
    }

    function d3_layout_treeRight(v) {
        var n, children = v.children;
        return (n = children.length) ? children[n - 1] : v.t
    }

    function d3_layout_treeMove(wm, wp, shift) {
        var change = shift / (wp.i - wm.i);
        wp.c -= change, wp.s += shift, wm.c += change, wp.z += shift, wp.m += shift
    }

    function d3_layout_treeShift(v) {
        for (var w, shift = 0, change = 0, children = v.children, i = children.length; --i >= 0;)w = children[i], w.z += shift, w.m += shift, shift += w.s + (change += w.c)
    }

    function d3_layout_treeAncestor(vim, v, ancestor) {
        return vim.a.parent === v.parent ? vim.a : ancestor
    }

    function d3_layout_clusterY(children) {
        return 1 + d3.max(children, function (child) {
                return child.y
            })
    }

    function d3_layout_clusterX(children) {
        return children.reduce(function (x, child) {
                return x + child.x
            }, 0) / children.length
    }

    function d3_layout_clusterLeft(node) {
        var children = node.children;
        return children && children.length ? d3_layout_clusterLeft(children[0]) : node
    }

    function d3_layout_clusterRight(node) {
        var n, children = node.children;
        return children && (n = children.length) ? d3_layout_clusterRight(children[n - 1]) : node
    }

    function d3_layout_treemapPadNull(node) {
        return {x: node.x, y: node.y, dx: node.dx, dy: node.dy}
    }

    function d3_layout_treemapPad(node, padding) {
        var x = node.x + padding[3], y = node.y + padding[0], dx = node.dx - padding[1] - padding[3], dy = node.dy - padding[0] - padding[2];
        return 0 > dx && (x += dx / 2, dx = 0), 0 > dy && (y += dy / 2, dy = 0), {x: x, y: y, dx: dx, dy: dy}
    }

    function d3_scaleExtent(domain) {
        var start = domain[0], stop = domain[domain.length - 1];
        return stop > start ? [start, stop] : [stop, start]
    }

    function d3_scaleRange(scale) {
        return scale.rangeExtent ? scale.rangeExtent() : d3_scaleExtent(scale.range())
    }

    function d3_scale_bilinear(domain, range, uninterpolate, interpolate) {
        var u = uninterpolate(domain[0], domain[1]), i = interpolate(range[0], range[1]);
        return function (x) {
            return i(u(x))
        }
    }

    function d3_scale_nice(domain, nice) {
        var dx, i0 = 0, i1 = domain.length - 1, x0 = domain[i0], x1 = domain[i1];
        return x0 > x1 && (dx = i0, i0 = i1, i1 = dx, dx = x0, x0 = x1, x1 = dx), domain[i0] = nice.floor(x0), domain[i1] = nice.ceil(x1), domain
    }

    function d3_scale_niceStep(step) {
        return step ? {
            floor: function (x) {
                return Math.floor(x / step) * step
            }, ceil: function (x) {
                return Math.ceil(x / step) * step
            }
        } : d3_scale_niceIdentity
    }

    function d3_scale_polylinear(domain, range, uninterpolate, interpolate) {
        var u = [], i = [], j = 0, k = Math.min(domain.length, range.length) - 1;
        for (domain[k] < domain[0] && (domain = domain.slice().reverse(), range = range.slice().reverse()); ++j <= k;)u.push(uninterpolate(domain[j - 1], domain[j])), i.push(interpolate(range[j - 1], range[j]));
        return function (x) {
            var j = d3.bisect(domain, x, 1, k) - 1;
            return i[j](u[j](x))
        }
    }

    function d3_scale_linear(domain, range, interpolate, clamp) {
        function rescale() {
            var linear = Math.min(domain.length, range.length) > 2 ? d3_scale_polylinear : d3_scale_bilinear, uninterpolate = clamp ? d3_uninterpolateClamp : d3_uninterpolateNumber;
            return output = linear(domain, range, uninterpolate, interpolate), input = linear(range, domain, uninterpolate, d3_interpolate), scale
        }

        function scale(x) {
            return output(x)
        }

        var output, input;
        return scale.invert = function (y) {
            return input(y)
        }, scale.domain = function (x) {
            return arguments.length ? (domain = x.map(Number), rescale()) : domain
        }, scale.range = function (x) {
            return arguments.length ? (range = x, rescale()) : range
        }, scale.rangeRound = function (x) {
            return scale.range(x).interpolate(d3_interpolateRound)
        }, scale.clamp = function (x) {
            return arguments.length ? (clamp = x, rescale()) : clamp
        }, scale.interpolate = function (x) {
            return arguments.length ? (interpolate = x, rescale()) : interpolate
        }, scale.ticks = function (m) {
            return d3_scale_linearTicks(domain, m)
        }, scale.tickFormat = function (m, format) {
            return d3_scale_linearTickFormat(domain, m, format)
        }, scale.nice = function (m) {
            return d3_scale_linearNice(domain, m), rescale()
        }, scale.copy = function () {
            return d3_scale_linear(domain, range, interpolate, clamp)
        }, rescale()
    }

    function d3_scale_linearRebind(scale, linear) {
        return d3.rebind(scale, linear, "range", "rangeRound", "interpolate", "clamp")
    }

    function d3_scale_linearNice(domain, m) {
        return d3_scale_nice(domain, d3_scale_niceStep(d3_scale_linearTickRange(domain, m)[2]))
    }

    function d3_scale_linearTickRange(domain, m) {
        null == m && (m = 10);
        var extent = d3_scaleExtent(domain), span = extent[1] - extent[0], step = Math.pow(10, Math.floor(Math.log(span / m) / Math.LN10)), err = m / span * step;
        return .15 >= err ? step *= 10 : .35 >= err ? step *= 5 : .75 >= err && (step *= 2), extent[0] = Math.ceil(extent[0] / step) * step, extent[1] = Math.floor(extent[1] / step) * step + .5 * step, extent[2] = step, extent
    }

    function d3_scale_linearTicks(domain, m) {
        return d3.range.apply(d3, d3_scale_linearTickRange(domain, m))
    }

    function d3_scale_linearTickFormat(domain, m, format) {
        var range = d3_scale_linearTickRange(domain, m);
        if (format) {
            var match = d3_format_re.exec(format);
            if (match.shift(), "s" === match[8]) {
                var prefix = d3.formatPrefix(Math.max(abs(range[0]), abs(range[1])));
                return match[7] || (match[7] = "." + d3_scale_linearPrecision(prefix.scale(range[2]))), match[8] = "f", format = d3.format(match.join("")), function (d) {
                    return format(prefix.scale(d)) + prefix.symbol
                }
            }
            match[7] || (match[7] = "." + d3_scale_linearFormatPrecision(match[8], range)), format = match.join("")
        } else format = ",." + d3_scale_linearPrecision(range[2]) + "f";
        return d3.format(format)
    }

    function d3_scale_linearPrecision(value) {
        return -Math.floor(Math.log(value) / Math.LN10 + .01)
    }

    function d3_scale_linearFormatPrecision(type, range) {
        var p = d3_scale_linearPrecision(range[2]);
        return type in d3_scale_linearFormatSignificant ? Math.abs(p - d3_scale_linearPrecision(Math.max(abs(range[0]), abs(range[1])))) + +("e" !== type) : p - 2 * ("%" === type)
    }

    function d3_scale_log(linear, base, positive, domain) {
        function log(x) {
            return (positive ? Math.log(0 > x ? 0 : x) : -Math.log(x > 0 ? 0 : -x)) / Math.log(base)
        }

        function pow(x) {
            return positive ? Math.pow(base, x) : -Math.pow(base, -x)
        }

        function scale(x) {
            return linear(log(x))
        }

        return scale.invert = function (x) {
            return pow(linear.invert(x))
        }, scale.domain = function (x) {
            return arguments.length ? (positive = x[0] >= 0, linear.domain((domain = x.map(Number)).map(log)), scale) : domain
        }, scale.base = function (_) {
            return arguments.length ? (base = +_, linear.domain(domain.map(log)), scale) : base
        }, scale.nice = function () {
            var niced = d3_scale_nice(domain.map(log), positive ? Math : d3_scale_logNiceNegative);
            return linear.domain(niced), domain = niced.map(pow), scale
        }, scale.ticks = function () {
            var extent = d3_scaleExtent(domain), ticks = [], u = extent[0], v = extent[1], i = Math.floor(log(u)), j = Math.ceil(log(v)), n = base % 1 ? 2 : base;
            if (isFinite(j - i)) {
                if (positive) {
                    for (; j > i; i++)for (var k = 1; n > k; k++)ticks.push(pow(i) * k);
                    ticks.push(pow(i))
                } else for (ticks.push(pow(i)); i++ < j;)for (var k = n - 1; k > 0; k--)ticks.push(pow(i) * k);
                for (i = 0; ticks[i] < u; i++);
                for (j = ticks.length; ticks[j - 1] > v; j--);
                ticks = ticks.slice(i, j)
            }
            return ticks
        }, scale.tickFormat = function (n, format) {
            if (!arguments.length)return d3_scale_logFormat;
            arguments.length < 2 ? format = d3_scale_logFormat : "function" != typeof format && (format = d3.format(format));
            var e, k = Math.max(.1, n / scale.ticks().length), f = positive ? (e = 1e-12, Math.ceil) : (e = -1e-12, Math.floor);
            return function (d) {
                return d / pow(f(log(d) + e)) <= k ? format(d) : ""
            }
        }, scale.copy = function () {
            return d3_scale_log(linear.copy(), base, positive, domain)
        }, d3_scale_linearRebind(scale, linear)
    }

    function d3_scale_pow(linear, exponent, domain) {
        function scale(x) {
            return linear(powp(x))
        }

        var powp = d3_scale_powPow(exponent), powb = d3_scale_powPow(1 / exponent);
        return scale.invert = function (x) {
            return powb(linear.invert(x))
        }, scale.domain = function (x) {
            return arguments.length ? (linear.domain((domain = x.map(Number)).map(powp)), scale) : domain
        }, scale.ticks = function (m) {
            return d3_scale_linearTicks(domain, m)
        }, scale.tickFormat = function (m, format) {
            return d3_scale_linearTickFormat(domain, m, format)
        }, scale.nice = function (m) {
            return scale.domain(d3_scale_linearNice(domain, m))
        }, scale.exponent = function (x) {
            return arguments.length ? (powp = d3_scale_powPow(exponent = x), powb = d3_scale_powPow(1 / exponent), linear.domain(domain.map(powp)), scale) : exponent
        }, scale.copy = function () {
            return d3_scale_pow(linear.copy(), exponent, domain)
        }, d3_scale_linearRebind(scale, linear)
    }

    function d3_scale_powPow(e) {
        return function (x) {
            return 0 > x ? -Math.pow(-x, e) : Math.pow(x, e)
        }
    }

    function d3_scale_ordinal(domain, ranger) {
        function scale(x) {
            return range[((index.get(x) || ("range" === ranger.t ? index.set(x, domain.push(x)) : 0 / 0)) - 1) % range.length]
        }

        function steps(start, step) {
            return d3.range(domain.length).map(function (i) {
                return start + step * i
            })
        }

        var index, range, rangeBand;
        return scale.domain = function (x) {
            if (!arguments.length)return domain;
            domain = [], index = new d3_Map;
            for (var xi, i = -1, n = x.length; ++i < n;)index.has(xi = x[i]) || index.set(xi, domain.push(xi));
            return scale[ranger.t].apply(scale, ranger.a)
        }, scale.range = function (x) {
            return arguments.length ? (range = x, rangeBand = 0, ranger = {t: "range", a: arguments}, scale) : range
        }, scale.rangePoints = function (x, padding) {
            arguments.length < 2 && (padding = 0);
            var start = x[0], stop = x[1], step = domain.length < 2 ? (start = (start + stop) / 2, 0) : (stop - start) / (domain.length - 1 + padding);
            return range = steps(start + step * padding / 2, step), rangeBand = 0, ranger = {
                t: "rangePoints",
                a: arguments
            }, scale
        }, scale.rangeRoundPoints = function (x, padding) {
            arguments.length < 2 && (padding = 0);
            var start = x[0], stop = x[1], step = domain.length < 2 ? (start = stop = Math.round((start + stop) / 2), 0) : (stop - start) / (domain.length - 1 + padding) | 0;
            return range = steps(start + Math.round(step * padding / 2 + (stop - start - (domain.length - 1 + padding) * step) / 2), step), rangeBand = 0, ranger = {
                t: "rangeRoundPoints",
                a: arguments
            }, scale
        }, scale.rangeBands = function (x, padding, outerPadding) {
            arguments.length < 2 && (padding = 0), arguments.length < 3 && (outerPadding = padding);
            var reverse = x[1] < x[0], start = x[reverse - 0], stop = x[1 - reverse], step = (stop - start) / (domain.length - padding + 2 * outerPadding);
            return range = steps(start + step * outerPadding, step), reverse && range.reverse(), rangeBand = step * (1 - padding), ranger = {
                t: "rangeBands",
                a: arguments
            }, scale
        }, scale.rangeRoundBands = function (x, padding, outerPadding) {
            arguments.length < 2 && (padding = 0), arguments.length < 3 && (outerPadding = padding);
            var reverse = x[1] < x[0], start = x[reverse - 0], stop = x[1 - reverse], step = Math.floor((stop - start) / (domain.length - padding + 2 * outerPadding));
            return range = steps(start + Math.round((stop - start - (domain.length - padding) * step) / 2), step), reverse && range.reverse(), rangeBand = Math.round(step * (1 - padding)), ranger = {
                t: "rangeRoundBands",
                a: arguments
            }, scale
        }, scale.rangeBand = function () {
            return rangeBand
        }, scale.rangeExtent = function () {
            return d3_scaleExtent(ranger.a[0])
        }, scale.copy = function () {
            return d3_scale_ordinal(domain, ranger)
        }, scale.domain(domain)
    }

    function d3_scale_quantile(domain, range) {
        function rescale() {
            var k = 0, q = range.length;
            for (thresholds = []; ++k < q;)thresholds[k - 1] = d3.quantile(domain, k / q);
            return scale
        }

        function scale(x) {
            return isNaN(x = +x) ? void 0 : range[d3.bisect(thresholds, x)]
        }

        var thresholds;
        return scale.domain = function (x) {
            return arguments.length ? (domain = x.map(d3_number).filter(d3_numeric).sort(d3_ascending), rescale()) : domain
        }, scale.range = function (x) {
            return arguments.length ? (range = x, rescale()) : range
        }, scale.quantiles = function () {
            return thresholds
        }, scale.invertExtent = function (y) {
            return y = range.indexOf(y), 0 > y ? [0 / 0, 0 / 0] : [y > 0 ? thresholds[y - 1] : domain[0], y < thresholds.length ? thresholds[y] : domain[domain.length - 1]]
        }, scale.copy = function () {
            return d3_scale_quantile(domain, range)
        }, rescale()
    }

    function d3_scale_quantize(x0, x1, range) {
        function scale(x) {
            return range[Math.max(0, Math.min(i, Math.floor(kx * (x - x0))))]
        }

        function rescale() {
            return kx = range.length / (x1 - x0), i = range.length - 1, scale
        }

        var kx, i;
        return scale.domain = function (x) {
            return arguments.length ? (x0 = +x[0], x1 = +x[x.length - 1], rescale()) : [x0, x1]
        }, scale.range = function (x) {
            return arguments.length ? (range = x, rescale()) : range
        }, scale.invertExtent = function (y) {
            return y = range.indexOf(y), y = 0 > y ? 0 / 0 : y / kx + x0, [y, y + 1 / kx]
        }, scale.copy = function () {
            return d3_scale_quantize(x0, x1, range)
        }, rescale()
    }

    function d3_scale_threshold(domain, range) {
        function scale(x) {
            return x >= x ? range[d3.bisect(domain, x)] : void 0
        }

        return scale.domain = function (_) {
            return arguments.length ? (domain = _, scale) : domain
        }, scale.range = function (_) {
            return arguments.length ? (range = _, scale) : range
        }, scale.invertExtent = function (y) {
            return y = range.indexOf(y), [domain[y - 1], domain[y]]
        }, scale.copy = function () {
            return d3_scale_threshold(domain, range)
        }, scale
    }

    function d3_scale_identity(domain) {
        function identity(x) {
            return +x
        }

        return identity.invert = identity, identity.domain = identity.range = function (x) {
            return arguments.length ? (domain = x.map(identity), identity) : domain
        }, identity.ticks = function (m) {
            return d3_scale_linearTicks(domain, m)
        }, identity.tickFormat = function (m, format) {
            return d3_scale_linearTickFormat(domain, m, format)
        }, identity.copy = function () {
            return d3_scale_identity(domain)
        }, identity
    }

    function d3_zero() {
        return 0
    }

    function d3_svg_arcInnerRadius(d) {
        return d.innerRadius
    }

    function d3_svg_arcOuterRadius(d) {
        return d.outerRadius
    }

    function d3_svg_arcStartAngle(d) {
        return d.startAngle
    }

    function d3_svg_arcEndAngle(d) {
        return d.endAngle
    }

    function d3_svg_arcPadAngle(d) {
        return d && d.padAngle
    }

    function d3_svg_arcSweep(x0, y0, x1, y1) {
        return (x0 - x1) * y0 - (y0 - y1) * x0 > 0 ? 0 : 1
    }

    function d3_svg_arcCornerTangents(p0, p1, r1, rc, cw) {
        var x01 = p0[0] - p1[0], y01 = p0[1] - p1[1], lo = (cw ? rc : -rc) / Math.sqrt(x01 * x01 + y01 * y01), ox = lo * y01, oy = -lo * x01, x1 = p0[0] + ox, y1 = p0[1] + oy, x2 = p1[0] + ox, y2 = p1[1] + oy, x3 = (x1 + x2) / 2, y3 = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, d2 = dx * dx + dy * dy, r = r1 - rc, D = x1 * y2 - x2 * y1, d = (0 > dy ? -1 : 1) * Math.sqrt(r * r * d2 - D * D), cx0 = (D * dy - dx * d) / d2, cy0 = (-D * dx - dy * d) / d2, cx1 = (D * dy + dx * d) / d2, cy1 = (-D * dx + dy * d) / d2, dx0 = cx0 - x3, dy0 = cy0 - y3, dx1 = cx1 - x3, dy1 = cy1 - y3;
        return dx0 * dx0 + dy0 * dy0 > dx1 * dx1 + dy1 * dy1 && (cx0 = cx1, cy0 = cy1), [[cx0 - ox, cy0 - oy], [cx0 * r1 / r, cy0 * r1 / r]]
    }

    function d3_svg_line(projection) {
        function line(data) {
            function segment() {
                segments.push("M", interpolate(projection(points), tension))
            }

            for (var d, segments = [], points = [], i = -1, n = data.length, fx = d3_functor(x), fy = d3_functor(y); ++i < n;)defined.call(this, d = data[i], i) ? points.push([+fx.call(this, d, i), +fy.call(this, d, i)]) : points.length && (segment(), points = []);
            return points.length && segment(), segments.length ? segments.join("") : null
        }

        var x = d3_geom_pointX, y = d3_geom_pointY, defined = d3_true, interpolate = d3_svg_lineLinear, interpolateKey = interpolate.key, tension = .7;
        return line.x = function (_) {
            return arguments.length ? (x = _, line) : x
        }, line.y = function (_) {
            return arguments.length ? (y = _, line) : y
        }, line.defined = function (_) {
            return arguments.length ? (defined = _, line) : defined
        }, line.interpolate = function (_) {
            return arguments.length ? (interpolateKey = "function" == typeof _ ? interpolate = _ : (interpolate = d3_svg_lineInterpolators.get(_) || d3_svg_lineLinear).key, line) : interpolateKey
        }, line.tension = function (_) {
            return arguments.length ? (tension = _, line) : tension
        }, line
    }

    function d3_svg_lineLinear(points) {
        return points.join("L")
    }

    function d3_svg_lineLinearClosed(points) {
        return d3_svg_lineLinear(points) + "Z"
    }

    function d3_svg_lineStep(points) {
        for (var i = 0, n = points.length, p = points[0], path = [p[0], ",", p[1]]; ++i < n;)path.push("H", (p[0] + (p = points[i])[0]) / 2, "V", p[1]);
        return n > 1 && path.push("H", p[0]), path.join("")
    }

    function d3_svg_lineStepBefore(points) {
        for (var i = 0, n = points.length, p = points[0], path = [p[0], ",", p[1]]; ++i < n;)path.push("V", (p = points[i])[1], "H", p[0]);
        return path.join("")
    }

    function d3_svg_lineStepAfter(points) {
        for (var i = 0, n = points.length, p = points[0], path = [p[0], ",", p[1]]; ++i < n;)path.push("H", (p = points[i])[0], "V", p[1]);
        return path.join("")
    }

    function d3_svg_lineCardinalOpen(points, tension) {
        return points.length < 4 ? d3_svg_lineLinear(points) : points[1] + d3_svg_lineHermite(points.slice(1, -1), d3_svg_lineCardinalTangents(points, tension))
    }

    function d3_svg_lineCardinalClosed(points, tension) {
        return points.length < 3 ? d3_svg_lineLinear(points) : points[0] + d3_svg_lineHermite((points.push(points[0]), points), d3_svg_lineCardinalTangents([points[points.length - 2]].concat(points, [points[1]]), tension))
    }

    function d3_svg_lineCardinal(points, tension) {
        return points.length < 3 ? d3_svg_lineLinear(points) : points[0] + d3_svg_lineHermite(points, d3_svg_lineCardinalTangents(points, tension))
    }

    function d3_svg_lineHermite(points, tangents) {
        if (tangents.length < 1 || points.length != tangents.length && points.length != tangents.length + 2)return d3_svg_lineLinear(points);
        var quad = points.length != tangents.length, path = "", p0 = points[0], p = points[1], t0 = tangents[0], t = t0, pi = 1;
        if (quad && (path += "Q" + (p[0] - 2 * t0[0] / 3) + "," + (p[1] - 2 * t0[1] / 3) + "," + p[0] + "," + p[1], p0 = points[1], pi = 2), tangents.length > 1) {
            t = tangents[1], p = points[pi], pi++, path += "C" + (p0[0] + t0[0]) + "," + (p0[1] + t0[1]) + "," + (p[0] - t[0]) + "," + (p[1] - t[1]) + "," + p[0] + "," + p[1];
            for (var i = 2; i < tangents.length; i++, pi++)p = points[pi], t = tangents[i], path += "S" + (p[0] - t[0]) + "," + (p[1] - t[1]) + "," + p[0] + "," + p[1]
        }
        if (quad) {
            var lp = points[pi];
            path += "Q" + (p[0] + 2 * t[0] / 3) + "," + (p[1] + 2 * t[1] / 3) + "," + lp[0] + "," + lp[1]
        }
        return path
    }

    function d3_svg_lineCardinalTangents(points, tension) {
        for (var p0, tangents = [], a = (1 - tension) / 2, p1 = points[0], p2 = points[1], i = 1, n = points.length; ++i < n;)p0 = p1, p1 = p2, p2 = points[i], tangents.push([a * (p2[0] - p0[0]), a * (p2[1] - p0[1])]);
        return tangents
    }

    function d3_svg_lineBasis(points) {
        if (points.length < 3)return d3_svg_lineLinear(points);
        var i = 1, n = points.length, pi = points[0], x0 = pi[0], y0 = pi[1], px = [x0, x0, x0, (pi = points[1])[0]], py = [y0, y0, y0, pi[1]], path = [x0, ",", y0, "L", d3_svg_lineDot4(d3_svg_lineBasisBezier3, px), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier3, py)];
        for (points.push(points[n - 1]); ++i <= n;)pi = points[i], px.shift(), px.push(pi[0]), py.shift(), py.push(pi[1]), d3_svg_lineBasisBezier(path, px, py);
        return points.pop(), path.push("L", pi), path.join("")
    }

    function d3_svg_lineBasisOpen(points) {
        if (points.length < 4)return d3_svg_lineLinear(points);
        for (var pi, path = [], i = -1, n = points.length, px = [0], py = [0]; ++i < 3;)pi = points[i], px.push(pi[0]), py.push(pi[1]);
        for (path.push(d3_svg_lineDot4(d3_svg_lineBasisBezier3, px) + "," + d3_svg_lineDot4(d3_svg_lineBasisBezier3, py)), --i; ++i < n;)pi = points[i], px.shift(), px.push(pi[0]), py.shift(), py.push(pi[1]), d3_svg_lineBasisBezier(path, px, py);
        return path.join("")
    }

    function d3_svg_lineBasisClosed(points) {
        for (var path, pi, i = -1, n = points.length, m = n + 4, px = [], py = []; ++i < 4;)pi = points[i % n], px.push(pi[0]), py.push(pi[1]);
        for (path = [d3_svg_lineDot4(d3_svg_lineBasisBezier3, px), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier3, py)], --i; ++i < m;)pi = points[i % n], px.shift(), px.push(pi[0]), py.shift(), py.push(pi[1]), d3_svg_lineBasisBezier(path, px, py);
        return path.join("")
    }

    function d3_svg_lineBundle(points, tension) {
        var n = points.length - 1;
        if (n)for (var p, t, x0 = points[0][0], y0 = points[0][1], dx = points[n][0] - x0, dy = points[n][1] - y0, i = -1; ++i <= n;)p = points[i], t = i / n, p[0] = tension * p[0] + (1 - tension) * (x0 + t * dx), p[1] = tension * p[1] + (1 - tension) * (y0 + t * dy);
        return d3_svg_lineBasis(points)
    }

    function d3_svg_lineDot4(a, b) {
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]
    }

    function d3_svg_lineBasisBezier(path, x, y) {
        path.push("C", d3_svg_lineDot4(d3_svg_lineBasisBezier1, x), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier1, y), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier2, x), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier2, y), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier3, x), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier3, y))
    }

    function d3_svg_lineSlope(p0, p1) {
        return (p1[1] - p0[1]) / (p1[0] - p0[0])
    }

    function d3_svg_lineFiniteDifferences(points) {
        for (var i = 0, j = points.length - 1, m = [], p0 = points[0], p1 = points[1], d = m[0] = d3_svg_lineSlope(p0, p1); ++i < j;)m[i] = (d + (d = d3_svg_lineSlope(p0 = p1, p1 = points[i + 1]))) / 2;
        return m[i] = d, m
    }

    function d3_svg_lineMonotoneTangents(points) {
        for (var d, a, b, s, tangents = [], m = d3_svg_lineFiniteDifferences(points), i = -1, j = points.length - 1; ++i < j;)d = d3_svg_lineSlope(points[i], points[i + 1]), abs(d) < ε ? m[i] = m[i + 1] = 0 : (a = m[i] / d, b = m[i + 1] / d, s = a * a + b * b, s > 9 && (s = 3 * d / Math.sqrt(s), m[i] = s * a, m[i + 1] = s * b));
        for (i = -1; ++i <= j;)s = (points[Math.min(j, i + 1)][0] - points[Math.max(0, i - 1)][0]) / (6 * (1 + m[i] * m[i])), tangents.push([s || 0, m[i] * s || 0]);
        return tangents
    }

    function d3_svg_lineMonotone(points) {
        return points.length < 3 ? d3_svg_lineLinear(points) : points[0] + d3_svg_lineHermite(points, d3_svg_lineMonotoneTangents(points))
    }

    function d3_svg_lineRadial(points) {
        for (var point, r, a, i = -1, n = points.length; ++i < n;)point = points[i], r = point[0], a = point[1] - halfπ, point[0] = r * Math.cos(a), point[1] = r * Math.sin(a);
        return points
    }

    function d3_svg_area(projection) {
        function area(data) {
            function segment() {
                segments.push("M", interpolate(projection(points1), tension), L, interpolateReverse(projection(points0.reverse()), tension), "Z")
            }

            for (var d, x, y, segments = [], points0 = [], points1 = [], i = -1, n = data.length, fx0 = d3_functor(x0), fy0 = d3_functor(y0), fx1 = x0 === x1 ? function () {
                return x
            } : d3_functor(x1), fy1 = y0 === y1 ? function () {
                return y
            } : d3_functor(y1); ++i < n;)defined.call(this, d = data[i], i) ? (points0.push([x = +fx0.call(this, d, i), y = +fy0.call(this, d, i)]), points1.push([+fx1.call(this, d, i), +fy1.call(this, d, i)])) : points0.length && (segment(), points0 = [], points1 = []);
            return points0.length && segment(), segments.length ? segments.join("") : null
        }

        var x0 = d3_geom_pointX, x1 = d3_geom_pointX, y0 = 0, y1 = d3_geom_pointY, defined = d3_true, interpolate = d3_svg_lineLinear, interpolateKey = interpolate.key, interpolateReverse = interpolate, L = "L", tension = .7;
        return area.x = function (_) {
            return arguments.length ? (x0 = x1 = _, area) : x1
        }, area.x0 = function (_) {
            return arguments.length ? (x0 = _, area) : x0
        }, area.x1 = function (_) {
            return arguments.length ? (x1 = _, area) : x1
        }, area.y = function (_) {
            return arguments.length ? (y0 = y1 = _, area) : y1
        }, area.y0 = function (_) {
            return arguments.length ? (y0 = _, area) : y0
        }, area.y1 = function (_) {
            return arguments.length ? (y1 = _, area) : y1
        }, area.defined = function (_) {
            return arguments.length ? (defined = _, area) : defined
        }, area.interpolate = function (_) {
            return arguments.length ? (interpolateKey = "function" == typeof _ ? interpolate = _ : (interpolate = d3_svg_lineInterpolators.get(_) || d3_svg_lineLinear).key, interpolateReverse = interpolate.reverse || interpolate, L = interpolate.closed ? "M" : "L", area) : interpolateKey
        }, area.tension = function (_) {
            return arguments.length ? (tension = _, area) : tension
        }, area
    }

    function d3_svg_chordRadius(d) {
        return d.radius
    }

    function d3_svg_diagonalProjection(d) {
        return [d.x, d.y]
    }

    function d3_svg_diagonalRadialProjection(projection) {
        return function () {
            var d = projection.apply(this, arguments), r = d[0], a = d[1] - halfπ;
            return [r * Math.cos(a), r * Math.sin(a)]
        }
    }

    function d3_svg_symbolSize() {
        return 64
    }

    function d3_svg_symbolType() {
        return "circle"
    }

    function d3_svg_symbolCircle(size) {
        var r = Math.sqrt(size / π);
        return "M0," + r + "A" + r + "," + r + " 0 1,1 0," + -r + "A" + r + "," + r + " 0 1,1 0," + r + "Z"
    }

    function d3_selection_interruptNS(ns) {
        return function () {
            var lock, active;
            (lock = this[ns]) && (active = lock[lock.active]) && (--lock.count ? delete lock[lock.active] : delete this[ns], lock.active += .5, active.event && active.event.interrupt.call(this, this.__data__, active.index))
        }
    }

    function d3_transition(groups, ns, id) {
        return d3_subclass(groups, d3_transitionPrototype), groups.namespace = ns, groups.id = id, groups
    }

    function d3_transition_tween(groups, name, value, tween) {
        var id = groups.id, ns = groups.namespace;
        return d3_selection_each(groups, "function" == typeof value ? function (node, i, j) {
            node[ns][id].tween.set(name, tween(value.call(node, node.__data__, i, j)))
        } : (value = tween(value), function (node) {
            node[ns][id].tween.set(name, value)
        }))
    }

    function d3_transition_text(b) {
        return null == b && (b = ""), function () {
            this.textContent = b
        }
    }

    function d3_transitionNamespace(name) {
        return null == name ? "__transition__" : "__transition_" + name + "__"
    }

    function d3_transitionNode(node, i, ns, id, inherit) {
        var lock = node[ns] || (node[ns] = {active: 0, count: 0}), transition = lock[id];
        if (!transition) {
            var time = inherit.time;
            transition = lock[id] = {
                tween: new d3_Map,
                time: time,
                delay: inherit.delay,
                duration: inherit.duration,
                ease: inherit.ease,
                index: i
            }, inherit = null, ++lock.count, d3.timer(function (elapsed) {
                function start(elapsed) {
                    if (lock.active > id)return stop();
                    var active = lock[lock.active];
                    active && (--lock.count, delete lock[lock.active], active.event && active.event.interrupt.call(node, node.__data__, active.index)), lock.active = id, transition.event && transition.event.start.call(node, node.__data__, i), transition.tween.forEach(function (key, value) {
                        (value = value.call(node, node.__data__, i)) && tweened.push(value)
                    }), ease = transition.ease, duration = transition.duration, d3.timer(function () {
                        return timer.c = tick(elapsed || 1) ? d3_true : tick, 1
                    }, 0, time)
                }

                function tick(elapsed) {
                    if (lock.active !== id)return 1;
                    for (var t = elapsed / duration, e = ease(t), n = tweened.length; n > 0;)tweened[--n].call(node, e);
                    return t >= 1 ? (transition.event && transition.event.end.call(node, node.__data__, i), stop()) : void 0
                }

                function stop() {
                    return --lock.count ? delete lock[id] : delete node[ns], 1
                }

                var duration, ease, delay = transition.delay, timer = d3_timer_active, tweened = [];
                return timer.t = delay + time, elapsed >= delay ? start(elapsed - delay) : void(timer.c = start)
            }, 0, time)
        }
    }

    function d3_svg_axisX(selection, x0, x1) {
        selection.attr("transform", function (d) {
            var v0 = x0(d);
            return "translate(" + (isFinite(v0) ? v0 : x1(d)) + ",0)"
        })
    }

    function d3_svg_axisY(selection, y0, y1) {
        selection.attr("transform", function (d) {
            var v0 = y0(d);
            return "translate(0," + (isFinite(v0) ? v0 : y1(d)) + ")"
        })
    }

    function d3_time_formatIsoNative(date) {
        return date.toISOString()
    }

    function d3_time_scale(linear, methods, format) {
        function scale(x) {
            return linear(x)
        }

        function tickMethod(extent, count) {
            var span = extent[1] - extent[0], target = span / count, i = d3.bisect(d3_time_scaleSteps, target);
            return i == d3_time_scaleSteps.length ? [methods.year, d3_scale_linearTickRange(extent.map(function (d) {
                return d / 31536e6
            }), count)[2]] : i ? methods[target / d3_time_scaleSteps[i - 1] < d3_time_scaleSteps[i] / target ? i - 1 : i] : [d3_time_scaleMilliseconds, d3_scale_linearTickRange(extent, count)[2]]
        }

        return scale.invert = function (x) {
            return d3_time_scaleDate(linear.invert(x))
        }, scale.domain = function (x) {
            return arguments.length ? (linear.domain(x), scale) : linear.domain().map(d3_time_scaleDate)
        }, scale.nice = function (interval, skip) {
            function skipped(date) {
                return !isNaN(date) && !interval.range(date, d3_time_scaleDate(+date + 1), skip).length
            }

            var domain = scale.domain(), extent = d3_scaleExtent(domain), method = null == interval ? tickMethod(extent, 10) : "number" == typeof interval && tickMethod(extent, interval);
            return method && (interval = method[0], skip = method[1]), scale.domain(d3_scale_nice(domain, skip > 1 ? {
                floor: function (date) {
                    for (; skipped(date = interval.floor(date));)date = d3_time_scaleDate(date - 1);
                    return date
                }, ceil: function (date) {
                    for (; skipped(date = interval.ceil(date));)date = d3_time_scaleDate(+date + 1);
                    return date
                }
            } : interval))
        }, scale.ticks = function (interval, skip) {
            var extent = d3_scaleExtent(scale.domain()), method = null == interval ? tickMethod(extent, 10) : "number" == typeof interval ? tickMethod(extent, interval) : !interval.range && [{range: interval}, skip];
            return method && (interval = method[0], skip = method[1]), interval.range(extent[0], d3_time_scaleDate(+extent[1] + 1), 1 > skip ? 1 : skip)
        }, scale.tickFormat = function () {
            return format
        }, scale.copy = function () {
            return d3_time_scale(linear.copy(), methods, format)
        }, d3_scale_linearRebind(scale, linear)
    }

    function d3_time_scaleDate(t) {
        return new Date(t)
    }

    function d3_json(request) {
        return JSON.parse(request.responseText)
    }

    function d3_html(request) {
        var range = d3_document.createRange();
        return range.selectNode(d3_document.body), range.createContextualFragment(request.responseText)
    }

    var d3 = {version: "3.5.3"};
    Date.now || (Date.now = function () {
        return +new Date
    });
    var d3_arraySlice = [].slice, d3_array = function (list) {
        return d3_arraySlice.call(list)
    }, d3_document = document, d3_documentElement = d3_document.documentElement, d3_window = window;
    try {
        d3_array(d3_documentElement.childNodes)[0].nodeType
    } catch (e) {
        d3_array = function (list) {
            for (var i = list.length, array = new Array(i); i--;)array[i] = list[i];
            return array
        }
    }
    try {
        d3_document.createElement("div").style.setProperty("opacity", 0, "")
    } catch (error) {
        var d3_element_prototype = d3_window.Element.prototype, d3_element_setAttribute = d3_element_prototype.setAttribute, d3_element_setAttributeNS = d3_element_prototype.setAttributeNS, d3_style_prototype = d3_window.CSSStyleDeclaration.prototype, d3_style_setProperty = d3_style_prototype.setProperty;
        d3_element_prototype.setAttribute = function (name, value) {
            d3_element_setAttribute.call(this, name, value + "")
        }, d3_element_prototype.setAttributeNS = function (space, local, value) {
            d3_element_setAttributeNS.call(this, space, local, value + "")
        }, d3_style_prototype.setProperty = function (name, value, priority) {
            d3_style_setProperty.call(this, name, value + "", priority)
        }
    }
    d3.ascending = d3_ascending, d3.descending = function (a, b) {
        return a > b ? -1 : b > a ? 1 : b >= a ? 0 : 0 / 0
    }, d3.min = function (array, f) {
        var a, b, i = -1, n = array.length;
        if (1 === arguments.length) {
            for (; ++i < n;)if (null != (b = array[i]) && b >= b) {
                a = b;
                break
            }
            for (; ++i < n;)null != (b = array[i]) && a > b && (a = b)
        } else {
            for (; ++i < n;)if (null != (b = f.call(array, array[i], i)) && b >= b) {
                a = b;
                break
            }
            for (; ++i < n;)null != (b = f.call(array, array[i], i)) && a > b && (a = b)
        }
        return a
    }, d3.max = function (array, f) {
        var a, b, i = -1, n = array.length;
        if (1 === arguments.length) {
            for (; ++i < n;)if (null != (b = array[i]) && b >= b) {
                a = b;
                break
            }
            for (; ++i < n;)null != (b = array[i]) && b > a && (a = b)
        } else {
            for (; ++i < n;)if (null != (b = f.call(array, array[i], i)) && b >= b) {
                a = b;
                break
            }
            for (; ++i < n;)null != (b = f.call(array, array[i], i)) && b > a && (a = b)
        }
        return a
    }, d3.extent = function (array, f) {
        var a, b, c, i = -1, n = array.length;
        if (1 === arguments.length) {
            for (; ++i < n;)if (null != (b = array[i]) && b >= b) {
                a = c = b;
                break
            }
            for (; ++i < n;)null != (b = array[i]) && (a > b && (a = b), b > c && (c = b))
        } else {
            for (; ++i < n;)if (null != (b = f.call(array, array[i], i)) && b >= b) {
                a = c = b;
                break
            }
            for (; ++i < n;)null != (b = f.call(array, array[i], i)) && (a > b && (a = b), b > c && (c = b))
        }
        return [a, c]
    }, d3.sum = function (array, f) {
        var a, s = 0, n = array.length, i = -1;
        if (1 === arguments.length)for (; ++i < n;)d3_numeric(a = +array[i]) && (s += a); else for (; ++i < n;)d3_numeric(a = +f.call(array, array[i], i)) && (s += a);
        return s
    }, d3.mean = function (array, f) {
        var a, s = 0, n = array.length, i = -1, j = n;
        if (1 === arguments.length)for (; ++i < n;)d3_numeric(a = d3_number(array[i])) ? s += a : --j; else for (; ++i < n;)d3_numeric(a = d3_number(f.call(array, array[i], i))) ? s += a : --j;
        return j ? s / j : void 0
    }, d3.quantile = function (values, p) {
        var H = (values.length - 1) * p + 1, h = Math.floor(H), v = +values[h - 1], e = H - h;
        return e ? v + e * (values[h] - v) : v
    }, d3.median = function (array, f) {
        var a, numbers = [], n = array.length, i = -1;
        if (1 === arguments.length)for (; ++i < n;)d3_numeric(a = d3_number(array[i])) && numbers.push(a); else for (; ++i < n;)d3_numeric(a = d3_number(f.call(array, array[i], i))) && numbers.push(a);
        return numbers.length ? d3.quantile(numbers.sort(d3_ascending), .5) : void 0
    }, d3.variance = function (array, f) {
        var a, d, n = array.length, m = 0, s = 0, i = -1, j = 0;
        if (1 === arguments.length)for (; ++i < n;)d3_numeric(a = d3_number(array[i])) && (d = a - m, m += d / ++j, s += d * (a - m)); else for (; ++i < n;)d3_numeric(a = d3_number(f.call(array, array[i], i))) && (d = a - m, m += d / ++j, s += d * (a - m));
        return j > 1 ? s / (j - 1) : void 0
    }, d3.deviation = function () {
        var v = d3.variance.apply(this, arguments);
        return v ? Math.sqrt(v) : v
    };
    var d3_bisect = d3_bisector(d3_ascending);
    d3.bisectLeft = d3_bisect.left, d3.bisect = d3.bisectRight = d3_bisect.right, d3.bisector = function (f) {
        return d3_bisector(1 === f.length ? function (d, x) {
            return d3_ascending(f(d), x)
        } : f)
    }, d3.shuffle = function (array, i0, i1) {
        (m = arguments.length) < 3 && (i1 = array.length, 2 > m && (i0 = 0));
        for (var t, i, m = i1 - i0; m;)i = Math.random() * m-- | 0, t = array[m + i0], array[m + i0] = array[i + i0], array[i + i0] = t;
        return array
    }, d3.permute = function (array, indexes) {
        for (var i = indexes.length, permutes = new Array(i); i--;)permutes[i] = array[indexes[i]];
        return permutes
    }, d3.pairs = function (array) {
        for (var p0, i = 0, n = array.length - 1, p1 = array[0], pairs = new Array(0 > n ? 0 : n); n > i;)pairs[i] = [p0 = p1, p1 = array[++i]];
        return pairs
    }, d3.zip = function () {
        if (!(n = arguments.length))return [];
        for (var i = -1, m = d3.min(arguments, d3_zipLength), zips = new Array(m); ++i < m;)for (var n, j = -1, zip = zips[i] = new Array(n); ++j < n;)zip[j] = arguments[j][i];
        return zips
    }, d3.transpose = function (matrix) {
        return d3.zip.apply(d3, matrix)
    }, d3.keys = function (map) {
        var keys = [];
        for (var key in map)keys.push(key);
        return keys
    }, d3.values = function (map) {
        var values = [];
        for (var key in map)values.push(map[key]);
        return values
    }, d3.entries = function (map) {
        var entries = [];
        for (var key in map)entries.push({key: key, value: map[key]});
        return entries
    }, d3.merge = function (arrays) {
        for (var m, merged, array, n = arrays.length, i = -1, j = 0; ++i < n;)j += arrays[i].length;
        for (merged = new Array(j); --n >= 0;)for (array = arrays[n], m = array.length; --m >= 0;)merged[--j] = array[m];
        return merged
    };
    var abs = Math.abs;
    d3.range = function (start, stop, step) {
        if (arguments.length < 3 && (step = 1, arguments.length < 2 && (stop = start, start = 0)), (stop - start) / step === 1 / 0)throw new Error("infinite range");
        var j, range = [], k = d3_range_integerScale(abs(step)), i = -1;
        if (start *= k, stop *= k, step *= k, 0 > step)for (; (j = start + step * ++i) > stop;)range.push(j / k); else for (; (j = start + step * ++i) < stop;)range.push(j / k);
        return range
    }, d3.map = function (object, f) {
        var map = new d3_Map;
        if (object instanceof d3_Map)object.forEach(function (key, value) {
            map.set(key, value)
        }); else if (Array.isArray(object)) {
            var o, i = -1, n = object.length;
            if (1 === arguments.length)for (; ++i < n;)map.set(i, object[i]); else for (; ++i < n;)map.set(f.call(object, o = object[i], i), o)
        } else for (var key in object)map.set(key, object[key]);
        return map
    };
    var d3_map_proto = "__proto__", d3_map_zero = "\x00";
    d3_class(d3_Map, {
        has: d3_map_has, get: function (key) {
            return this._[d3_map_escape(key)]
        }, set: function (key, value) {
            return this._[d3_map_escape(key)] = value
        }, remove: d3_map_remove, keys: d3_map_keys, values: function () {
            var values = [];
            for (var key in this._)values.push(this._[key]);
            return values
        }, entries: function () {
            var entries = [];
            for (var key in this._)entries.push({key: d3_map_unescape(key), value: this._[key]});
            return entries
        }, size: d3_map_size, empty: d3_map_empty, forEach: function (f) {
            for (var key in this._)f.call(this, d3_map_unescape(key), this._[key])
        }
    }), d3.nest = function () {
        function map(mapType, array, depth) {
            if (depth >= keys.length)return rollup ? rollup.call(nest, array) : sortValues ? array.sort(sortValues) : array;
            for (var keyValue, object, setter, values, i = -1, n = array.length, key = keys[depth++], valuesByKey = new d3_Map; ++i < n;)(values = valuesByKey.get(keyValue = key(object = array[i]))) ? values.push(object) : valuesByKey.set(keyValue, [object]);
            return mapType ? (object = mapType(), setter = function (keyValue, values) {
                object.set(keyValue, map(mapType, values, depth))
            }) : (object = {}, setter = function (keyValue, values) {
                object[keyValue] = map(mapType, values, depth)
            }), valuesByKey.forEach(setter), object
        }

        function entries(map, depth) {
            if (depth >= keys.length)return map;
            var array = [], sortKey = sortKeys[depth++];
            return map.forEach(function (key, keyMap) {
                array.push({key: key, values: entries(keyMap, depth)})
            }), sortKey ? array.sort(function (a, b) {
                return sortKey(a.key, b.key)
            }) : array
        }

        var sortValues, rollup, nest = {}, keys = [], sortKeys = [];
        return nest.map = function (array, mapType) {
            return map(mapType, array, 0)
        }, nest.entries = function (array) {
            return entries(map(d3.map, array, 0), 0)
        }, nest.key = function (d) {
            return keys.push(d), nest
        }, nest.sortKeys = function (order) {
            return sortKeys[keys.length - 1] = order, nest
        }, nest.sortValues = function (order) {
            return sortValues = order, nest
        }, nest.rollup = function (f) {
            return rollup = f, nest
        }, nest
    }, d3.set = function (array) {
        var set = new d3_Set;
        if (array)for (var i = 0, n = array.length; n > i; ++i)set.add(array[i]);
        return set
    }, d3_class(d3_Set, {
        has: d3_map_has, add: function (key) {
            return this._[d3_map_escape(key += "")] = !0, key
        }, remove: d3_map_remove, values: d3_map_keys, size: d3_map_size, empty: d3_map_empty, forEach: function (f) {
            for (var key in this._)f.call(this, d3_map_unescape(key))
        }
    }), d3.behavior = {}, d3.rebind = function (target, source) {
        for (var method, i = 1, n = arguments.length; ++i < n;)target[method = arguments[i]] = d3_rebind(target, source, source[method]);
        return target
    };
    var d3_vendorPrefixes = ["webkit", "ms", "moz", "Moz", "o", "O"];
    d3.dispatch = function () {
        for (var dispatch = new d3_dispatch, i = -1, n = arguments.length; ++i < n;)dispatch[arguments[i]] = d3_dispatch_event(dispatch);
        return dispatch
    }, d3_dispatch.prototype.on = function (type, listener) {
        var i = type.indexOf("."), name = "";
        if (i >= 0 && (name = type.slice(i + 1), type = type.slice(0, i)), type)return arguments.length < 2 ? this[type].on(name) : this[type].on(name, listener);
        if (2 === arguments.length) {
            if (null == listener)for (type in this)this.hasOwnProperty(type) && this[type].on(name, null);
            return this
        }
    }, d3.event = null, d3.requote = function (s) {
        return s.replace(d3_requote_re, "\\$&")
    };
    var d3_requote_re = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g, d3_subclass = {}.__proto__ ? function (object, prototype) {
        object.__proto__ = prototype
    } : function (object, prototype) {
        for (var property in prototype)object[property] = prototype[property]
    }, d3_select = function (s, n) {
        return n.querySelector(s)
    }, d3_selectAll = function (s, n) {
        return n.querySelectorAll(s)
    }, d3_selectMatcher = d3_documentElement.matches || d3_documentElement[d3_vendorSymbol(d3_documentElement, "matchesSelector")], d3_selectMatches = function (n, s) {
        return d3_selectMatcher.call(n, s)
    };
    "function" == typeof Sizzle && (d3_select = function (s, n) {
        return Sizzle(s, n)[0] || null
    }, d3_selectAll = Sizzle, d3_selectMatches = Sizzle.matchesSelector), d3.selection = function () {
        return d3_selectionRoot
    };
    var d3_selectionPrototype = d3.selection.prototype = [];
    d3_selectionPrototype.select = function (selector) {
        var subgroup, subnode, group, node, subgroups = [];
        selector = d3_selection_selector(selector);
        for (var j = -1, m = this.length; ++j < m;) {
            subgroups.push(subgroup = []), subgroup.parentNode = (group = this[j]).parentNode;
            for (var i = -1, n = group.length; ++i < n;)(node = group[i]) ? (subgroup.push(subnode = selector.call(node, node.__data__, i, j)), subnode && "__data__"in node && (subnode.__data__ = node.__data__)) : subgroup.push(null)
        }
        return d3_selection(subgroups)
    }, d3_selectionPrototype.selectAll = function (selector) {
        var subgroup, node, subgroups = [];
        selector = d3_selection_selectorAll(selector);
        for (var j = -1, m = this.length; ++j < m;)for (var group = this[j], i = -1, n = group.length; ++i < n;)(node = group[i]) && (subgroups.push(subgroup = d3_array(selector.call(node, node.__data__, i, j))), subgroup.parentNode = node);
        return d3_selection(subgroups)
    };
    var d3_nsPrefix = {
        svg: "http://www.w3.org/2000/svg",
        xhtml: "http://www.w3.org/1999/xhtml",
        xlink: "http://www.w3.org/1999/xlink",
        xml: "http://www.w3.org/XML/1998/namespace",
        xmlns: "http://www.w3.org/2000/xmlns/"
    };
    d3.ns = {
        prefix: d3_nsPrefix, qualify: function (name) {
            var i = name.indexOf(":"), prefix = name;
            return i >= 0 && (prefix = name.slice(0, i), name = name.slice(i + 1)), d3_nsPrefix.hasOwnProperty(prefix) ? {
                space: d3_nsPrefix[prefix],
                local: name
            } : name
        }
    }, d3_selectionPrototype.attr = function (name, value) {
        if (arguments.length < 2) {
            if ("string" == typeof name) {
                var node = this.node();
                return name = d3.ns.qualify(name), name.local ? node.getAttributeNS(name.space, name.local) : node.getAttribute(name)
            }
            for (value in name)this.each(d3_selection_attr(value, name[value]));
            return this
        }
        return this.each(d3_selection_attr(name, value))
    }, d3_selectionPrototype.classed = function (name, value) {
        if (arguments.length < 2) {
            if ("string" == typeof name) {
                var node = this.node(), n = (name = d3_selection_classes(name)).length, i = -1;
                if (value = node.classList) {
                    for (; ++i < n;)if (!value.contains(name[i]))return !1
                } else for (value = node.getAttribute("class"); ++i < n;)if (!d3_selection_classedRe(name[i]).test(value))return !1;
                return !0
            }
            for (value in name)this.each(d3_selection_classed(value, name[value]));
            return this
        }
        return this.each(d3_selection_classed(name, value))
    }, d3_selectionPrototype.style = function (name, value, priority) {
        var n = arguments.length;
        if (3 > n) {
            if ("string" != typeof name) {
                2 > n && (value = "");
                for (priority in name)this.each(d3_selection_style(priority, name[priority], value));
                return this
            }
            if (2 > n)return d3_window.getComputedStyle(this.node(), null).getPropertyValue(name);
            priority = ""
        }
        return this.each(d3_selection_style(name, value, priority))
    }, d3_selectionPrototype.property = function (name, value) {
        if (arguments.length < 2) {
            if ("string" == typeof name)return this.node()[name];
            for (value in name)this.each(d3_selection_property(value, name[value]));
            return this
        }
        return this.each(d3_selection_property(name, value))
    }, d3_selectionPrototype.text = function (value) {
        return arguments.length ? this.each("function" == typeof value ? function () {
            var v = value.apply(this, arguments);
            this.textContent = null == v ? "" : v
        } : null == value ? function () {
            this.textContent = ""
        } : function () {
            this.textContent = value
        }) : this.node().textContent
    }, d3_selectionPrototype.html = function (value) {
        return arguments.length ? this.each("function" == typeof value ? function () {
            var v = value.apply(this, arguments);
            this.innerHTML = null == v ? "" : v
        } : null == value ? function () {
            this.innerHTML = ""
        } : function () {
            this.innerHTML = value
        }) : this.node().innerHTML
    }, d3_selectionPrototype.append = function (name) {
        return name = d3_selection_creator(name), this.select(function () {
            return this.appendChild(name.apply(this, arguments))
        })
    }, d3_selectionPrototype.insert = function (name, before) {
        return name = d3_selection_creator(name), before = d3_selection_selector(before), this.select(function () {
            return this.insertBefore(name.apply(this, arguments), before.apply(this, arguments) || null)
        })
    }, d3_selectionPrototype.remove = function () {
        return this.each(d3_selectionRemove)
    }, d3_selectionPrototype.data = function (value, key) {
        function bind(group, groupData) {
            var i, node, nodeData, n = group.length, m = groupData.length, n0 = Math.min(n, m), updateNodes = new Array(m), enterNodes = new Array(m), exitNodes = new Array(n);
            if (key) {
                var keyValue, nodeByKeyValue = new d3_Map, keyValues = new Array(n);
                for (i = -1; ++i < n;)nodeByKeyValue.has(keyValue = key.call(node = group[i], node.__data__, i)) ? exitNodes[i] = node : nodeByKeyValue.set(keyValue, node), keyValues[i] = keyValue;
                for (i = -1; ++i < m;)(node = nodeByKeyValue.get(keyValue = key.call(groupData, nodeData = groupData[i], i))) ? node !== !0 && (updateNodes[i] = node, node.__data__ = nodeData) : enterNodes[i] = d3_selection_dataNode(nodeData), nodeByKeyValue.set(keyValue, !0);
                for (i = -1; ++i < n;)nodeByKeyValue.get(keyValues[i]) !== !0 && (exitNodes[i] = group[i])
            } else {
                for (i = -1; ++i < n0;)node = group[i], nodeData = groupData[i], node ? (node.__data__ = nodeData, updateNodes[i] = node) : enterNodes[i] = d3_selection_dataNode(nodeData);
                for (; m > i; ++i)enterNodes[i] = d3_selection_dataNode(groupData[i]);
                for (; n > i; ++i)exitNodes[i] = group[i]
            }
            enterNodes.update = updateNodes, enterNodes.parentNode = updateNodes.parentNode = exitNodes.parentNode = group.parentNode, enter.push(enterNodes), update.push(updateNodes), exit.push(exitNodes)
        }

        var group, node, i = -1, n = this.length;
        if (!arguments.length) {
            for (value = new Array(n = (group = this[0]).length); ++i < n;)(node = group[i]) && (value[i] = node.__data__);
            return value
        }
        var enter = d3_selection_enter([]), update = d3_selection([]), exit = d3_selection([]);
        if ("function" == typeof value)for (; ++i < n;)bind(group = this[i], value.call(group, group.parentNode.__data__, i)); else for (; ++i < n;)bind(group = this[i], value);
        return update.enter = function () {
            return enter
        }, update.exit = function () {
            return exit
        }, update
    }, d3_selectionPrototype.datum = function (value) {
        return arguments.length ? this.property("__data__", value) : this.property("__data__")
    }, d3_selectionPrototype.filter = function (filter) {
        var subgroup, group, node, subgroups = [];
        "function" != typeof filter && (filter = d3_selection_filter(filter));
        for (var j = 0, m = this.length; m > j; j++) {
            subgroups.push(subgroup = []), subgroup.parentNode = (group = this[j]).parentNode;
            for (var i = 0, n = group.length; n > i; i++)(node = group[i]) && filter.call(node, node.__data__, i, j) && subgroup.push(node)
        }
        return d3_selection(subgroups)
    }, d3_selectionPrototype.order = function () {
        for (var j = -1, m = this.length; ++j < m;)for (var node, group = this[j], i = group.length - 1, next = group[i]; --i >= 0;)(node = group[i]) && (next && next !== node.nextSibling && next.parentNode.insertBefore(node, next), next = node);
        return this
    }, d3_selectionPrototype.sort = function (comparator) {
        comparator = d3_selection_sortComparator.apply(this, arguments);
        for (var j = -1, m = this.length; ++j < m;)this[j].sort(comparator);
        return this.order()
    }, d3_selectionPrototype.each = function (callback) {
        return d3_selection_each(this, function (node, i, j) {
            callback.call(node, node.__data__, i, j)
        })
    }, d3_selectionPrototype.call = function (callback) {
        var args = d3_array(arguments);
        return callback.apply(args[0] = this, args), this
    }, d3_selectionPrototype.empty = function () {
        return !this.node()
    }, d3_selectionPrototype.node = function () {
        for (var j = 0, m = this.length; m > j; j++)for (var group = this[j], i = 0, n = group.length; n > i; i++) {
            var node = group[i];
            if (node)return node
        }
        return null
    }, d3_selectionPrototype.size = function () {
        var n = 0;
        return d3_selection_each(this, function () {
            ++n
        }), n
    };
    var d3_selection_enterPrototype = [];
    d3.selection.enter = d3_selection_enter, d3.selection.enter.prototype = d3_selection_enterPrototype, d3_selection_enterPrototype.append = d3_selectionPrototype.append, d3_selection_enterPrototype.empty = d3_selectionPrototype.empty, d3_selection_enterPrototype.node = d3_selectionPrototype.node, d3_selection_enterPrototype.call = d3_selectionPrototype.call, d3_selection_enterPrototype.size = d3_selectionPrototype.size, d3_selection_enterPrototype.select = function (selector) {
        for (var subgroup, subnode, upgroup, group, node, subgroups = [], j = -1, m = this.length; ++j < m;) {
            upgroup = (group = this[j]).update, subgroups.push(subgroup = []), subgroup.parentNode = group.parentNode;
            for (var i = -1, n = group.length; ++i < n;)(node = group[i]) ? (subgroup.push(upgroup[i] = subnode = selector.call(group.parentNode, node.__data__, i, j)), subnode.__data__ = node.__data__) : subgroup.push(null)
        }
        return d3_selection(subgroups)
    }, d3_selection_enterPrototype.insert = function (name, before) {
        return arguments.length < 2 && (before = d3_selection_enterInsertBefore(this)), d3_selectionPrototype.insert.call(this, name, before)
    }, d3.select = function (node) {
        var group = ["string" == typeof node ? d3_select(node, d3_document) : node];
        return group.parentNode = d3_documentElement, d3_selection([group])
    }, d3.selectAll = function (nodes) {
        var group = d3_array("string" == typeof nodes ? d3_selectAll(nodes, d3_document) : nodes);
        return group.parentNode = d3_documentElement, d3_selection([group])
    };
    var d3_selectionRoot = d3.select(d3_documentElement);
    d3_selectionPrototype.on = function (type, listener, capture) {
        var n = arguments.length;
        if (3 > n) {
            if ("string" != typeof type) {
                2 > n && (listener = !1);
                for (capture in type)this.each(d3_selection_on(capture, type[capture], listener));
                return this
            }
            if (2 > n)return (n = this.node()["__on" + type]) && n._;
            capture = !1
        }
        return this.each(d3_selection_on(type, listener, capture))
    };
    var d3_selection_onFilters = d3.map({mouseenter: "mouseover", mouseleave: "mouseout"});
    d3_selection_onFilters.forEach(function (k) {
        "on" + k in d3_document && d3_selection_onFilters.remove(k)
    });
    var d3_event_dragSelect = "onselectstart"in d3_document ? null : d3_vendorSymbol(d3_documentElement.style, "userSelect"), d3_event_dragId = 0;
    d3.mouse = function (container) {
        return d3_mousePoint(container, d3_eventSource())
    };
    var d3_mouse_bug44083 = /WebKit/.test(d3_window.navigator.userAgent) ? -1 : 0;
    d3.touch = function (container, touches, identifier) {
        if (arguments.length < 3 && (identifier = touches, touches = d3_eventSource().changedTouches), touches)for (var touch, i = 0, n = touches.length; n > i; ++i)if ((touch = touches[i]).identifier === identifier)return d3_mousePoint(container, touch)
    }, d3.behavior.drag = function () {
        function drag() {
            this.on("mousedown.drag", mousedown).on("touchstart.drag", touchstart)
        }

        function dragstart(id, position, subject, move, end) {
            return function () {
                function moved() {
                    var dx, dy, position1 = position(parent, dragId);
                    position1 && (dx = position1[0] - position0[0], dy = position1[1] - position0[1], dragged |= dx | dy, position0 = position1, dispatch({
                        type: "drag",
                        x: position1[0] + dragOffset[0],
                        y: position1[1] + dragOffset[1],
                        dx: dx,
                        dy: dy
                    }))
                }

                function ended() {
                    position(parent, dragId) && (dragSubject.on(move + dragName, null).on(end + dragName, null), dragRestore(dragged && d3.event.target === target), dispatch({type: "dragend"}))
                }

                var dragOffset, that = this, target = d3.event.target, parent = that.parentNode, dispatch = event.of(that, arguments), dragged = 0, dragId = id(), dragName = ".drag" + (null == dragId ? "" : "-" + dragId), dragSubject = d3.select(subject()).on(move + dragName, moved).on(end + dragName, ended), dragRestore = d3_event_dragSuppress(), position0 = position(parent, dragId);
                origin ? (dragOffset = origin.apply(that, arguments), dragOffset = [dragOffset.x - position0[0], dragOffset.y - position0[1]]) : dragOffset = [0, 0], dispatch({type: "dragstart"})
            }
        }

        var event = d3_eventDispatch(drag, "drag", "dragstart", "dragend"), origin = null, mousedown = dragstart(d3_noop, d3.mouse, d3_behavior_dragMouseSubject, "mousemove", "mouseup"), touchstart = dragstart(d3_behavior_dragTouchId, d3.touch, d3_behavior_dragTouchSubject, "touchmove", "touchend");
        return drag.origin = function (x) {
            return arguments.length ? (origin = x, drag) : origin
        }, d3.rebind(drag, event, "on")
    }, d3.touches = function (container, touches) {
        return arguments.length < 2 && (touches = d3_eventSource().touches), touches ? d3_array(touches).map(function (touch) {
            var point = d3_mousePoint(container, touch);
            return point.identifier = touch.identifier, point
        }) : []
    };
    var ε = 1e-6, ε2 = ε * ε, π = Math.PI, τ = 2 * π, τε = τ - ε, halfπ = π / 2, d3_radians = π / 180, d3_degrees = 180 / π, ρ = Math.SQRT2, ρ2 = 2, ρ4 = 4;
    d3.interpolateZoom = function (p0, p1) {
        function interpolate(t) {
            var s = t * S;
            if (dr) {
                var coshr0 = d3_cosh(r0), u = w0 / (ρ2 * d1) * (coshr0 * d3_tanh(ρ * s + r0) - d3_sinh(r0));
                return [ux0 + u * dx, uy0 + u * dy, w0 * coshr0 / d3_cosh(ρ * s + r0)]
            }
            return [ux0 + t * dx, uy0 + t * dy, w0 * Math.exp(ρ * s)]
        }

        var ux0 = p0[0], uy0 = p0[1], w0 = p0[2], ux1 = p1[0], uy1 = p1[1], w1 = p1[2], dx = ux1 - ux0, dy = uy1 - uy0, d2 = dx * dx + dy * dy, d1 = Math.sqrt(d2), b0 = (w1 * w1 - w0 * w0 + ρ4 * d2) / (2 * w0 * ρ2 * d1), b1 = (w1 * w1 - w0 * w0 - ρ4 * d2) / (2 * w1 * ρ2 * d1), r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0), r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1), dr = r1 - r0, S = (dr || Math.log(w1 / w0)) / ρ;
        return interpolate.duration = 1e3 * S, interpolate
    }, d3.behavior.zoom = function () {
        function zoom(g) {
            g.on(mousedown, mousedowned).on(d3_behavior_zoomWheel + ".zoom", mousewheeled).on("dblclick.zoom", dblclicked).on(touchstart, touchstarted)
        }

        function location(p) {
            return [(p[0] - view.x) / view.k, (p[1] - view.y) / view.k]
        }

        function point(l) {
            return [l[0] * view.k + view.x, l[1] * view.k + view.y]
        }

        function scaleTo(s) {
            view.k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], s))
        }

        function translateTo(p, l) {
            l = point(l), view.x += p[0] - l[0], view.y += p[1] - l[1]
        }

        function zoomTo(that, p, l, k) {
            that.__chart__ = {
                x: view.x,
                y: view.y,
                k: view.k
            }, scaleTo(Math.pow(2, k)), translateTo(center0 = p, l), that = d3.select(that), duration > 0 && (that = that.transition().duration(duration)), that.call(zoom.event)
        }

        function rescale() {
            x1 && x1.domain(x0.range().map(function (x) {
                return (x - view.x) / view.k
            }).map(x0.invert)), y1 && y1.domain(y0.range().map(function (y) {
                return (y - view.y) / view.k
            }).map(y0.invert))
        }

        function zoomstarted(dispatch) {
            zooming++ || dispatch({type: "zoomstart"})
        }

        function zoomed(dispatch) {
            rescale(), dispatch({type: "zoom", scale: view.k, translate: [view.x, view.y]})
        }

        function zoomended(dispatch) {
            --zooming || dispatch({type: "zoomend"}), center0 = null
        }

        function mousedowned() {
            function moved() {
                dragged = 1, translateTo(d3.mouse(that), location0), zoomed(dispatch)
            }

            function ended() {
                subject.on(mousemove, null).on(mouseup, null), dragRestore(dragged && d3.event.target === target), zoomended(dispatch)
            }

            var that = this, target = d3.event.target, dispatch = event.of(that, arguments), dragged = 0, subject = d3.select(d3_window).on(mousemove, moved).on(mouseup, ended), location0 = location(d3.mouse(that)), dragRestore = d3_event_dragSuppress();
            d3_selection_interrupt.call(that), zoomstarted(dispatch)
        }

        function touchstarted() {
            function relocate() {
                var touches = d3.touches(that);
                return scale0 = view.k, touches.forEach(function (t) {
                    t.identifier in locations0 && (locations0[t.identifier] = location(t))
                }), touches
            }

            function started() {
                var target = d3.event.target;
                d3.select(target).on(touchmove, moved).on(touchend, ended), targets.push(target);
                for (var changed = d3.event.changedTouches, i = 0, n = changed.length; n > i; ++i)locations0[changed[i].identifier] = null;
                var touches = relocate(), now = Date.now();
                if (1 === touches.length) {
                    if (500 > now - touchtime) {
                        var p = touches[0];
                        zoomTo(that, p, locations0[p.identifier], Math.floor(Math.log(view.k) / Math.LN2) + 1), d3_eventPreventDefault()
                    }
                    touchtime = now
                } else if (touches.length > 1) {
                    var p = touches[0], q = touches[1], dx = p[0] - q[0], dy = p[1] - q[1];
                    distance0 = dx * dx + dy * dy
                }
            }

            function moved() {
                var p0, l0, p1, l1, touches = d3.touches(that);
                d3_selection_interrupt.call(that);
                for (var i = 0, n = touches.length; n > i; ++i, l1 = null)if (p1 = touches[i], l1 = locations0[p1.identifier]) {
                    if (l0)break;
                    p0 = p1, l0 = l1
                }
                if (l1) {
                    var distance1 = (distance1 = p1[0] - p0[0]) * distance1 + (distance1 = p1[1] - p0[1]) * distance1, scale1 = distance0 && Math.sqrt(distance1 / distance0);
                    p0 = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2], l0 = [(l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2], scaleTo(scale1 * scale0)
                }
                touchtime = null, translateTo(p0, l0), zoomed(dispatch)
            }

            function ended() {
                if (d3.event.touches.length) {
                    for (var changed = d3.event.changedTouches, i = 0, n = changed.length; n > i; ++i)delete locations0[changed[i].identifier];
                    for (var identifier in locations0)return void relocate()
                }
                d3.selectAll(targets).on(zoomName, null), subject.on(mousedown, mousedowned).on(touchstart, touchstarted), dragRestore(), zoomended(dispatch)
            }

            var scale0, that = this, dispatch = event.of(that, arguments), locations0 = {}, distance0 = 0, zoomName = ".zoom-" + d3.event.changedTouches[0].identifier, touchmove = "touchmove" + zoomName, touchend = "touchend" + zoomName, targets = [], subject = d3.select(that), dragRestore = d3_event_dragSuppress();
            started(), zoomstarted(dispatch), subject.on(mousedown, null).on(touchstart, started)
        }

        function mousewheeled() {
            var dispatch = event.of(this, arguments);
            mousewheelTimer ? clearTimeout(mousewheelTimer) : (translate0 = location(center0 = center || d3.mouse(this)), d3_selection_interrupt.call(this), zoomstarted(dispatch)), mousewheelTimer = setTimeout(function () {
                mousewheelTimer = null, zoomended(dispatch)
            }, 50), d3_eventPreventDefault(), scaleTo(Math.pow(2, .002 * d3_behavior_zoomDelta()) * view.k), translateTo(center0, translate0), zoomed(dispatch)
        }

        function dblclicked() {
            var p = d3.mouse(this), k = Math.log(view.k) / Math.LN2;
            zoomTo(this, p, location(p), d3.event.shiftKey ? Math.ceil(k) - 1 : Math.floor(k) + 1)
        }

        var translate0, center0, center, mousewheelTimer, touchtime, x0, x1, y0, y1, view = {
            x: 0,
            y: 0,
            k: 1
        }, size = [960, 500], scaleExtent = d3_behavior_zoomInfinity, duration = 250, zooming = 0, mousedown = "mousedown.zoom", mousemove = "mousemove.zoom", mouseup = "mouseup.zoom", touchstart = "touchstart.zoom", event = d3_eventDispatch(zoom, "zoomstart", "zoom", "zoomend");
        return zoom.event = function (g) {
            g.each(function () {
                var dispatch = event.of(this, arguments), view1 = view;
                d3_transitionInheritId ? d3.select(this).transition().each("start.zoom", function () {
                    view = this.__chart__ || {x: 0, y: 0, k: 1}, zoomstarted(dispatch)
                }).tween("zoom:zoom", function () {
                    var dx = size[0], dy = size[1], cx = center0 ? center0[0] : dx / 2, cy = center0 ? center0[1] : dy / 2, i = d3.interpolateZoom([(cx - view.x) / view.k, (cy - view.y) / view.k, dx / view.k], [(cx - view1.x) / view1.k, (cy - view1.y) / view1.k, dx / view1.k]);
                    return function (t) {
                        var l = i(t), k = dx / l[2];
                        this.__chart__ = view = {x: cx - l[0] * k, y: cy - l[1] * k, k: k}, zoomed(dispatch)
                    }
                }).each("interrupt.zoom", function () {
                    zoomended(dispatch)
                }).each("end.zoom", function () {
                    zoomended(dispatch)
                }) : (this.__chart__ = view, zoomstarted(dispatch), zoomed(dispatch), zoomended(dispatch))
            })
        }, zoom.translate = function (_) {
            return arguments.length ? (view = {x: +_[0], y: +_[1], k: view.k}, rescale(), zoom) : [view.x, view.y]
        }, zoom.scale = function (_) {
            return arguments.length ? (view = {x: view.x, y: view.y, k: +_}, rescale(), zoom) : view.k
        }, zoom.scaleExtent = function (_) {
            return arguments.length ? (scaleExtent = null == _ ? d3_behavior_zoomInfinity : [+_[0], +_[1]], zoom) : scaleExtent
        }, zoom.center = function (_) {
            return arguments.length ? (center = _ && [+_[0], +_[1]], zoom) : center
        }, zoom.size = function (_) {
            return arguments.length ? (size = _ && [+_[0], +_[1]], zoom) : size
        }, zoom.duration = function (_) {
            return arguments.length ? (duration = +_, zoom) : duration
        }, zoom.x = function (z) {
            return arguments.length ? (x1 = z, x0 = z.copy(), view = {x: 0, y: 0, k: 1}, zoom) : x1
        }, zoom.y = function (z) {
            return arguments.length ? (y1 = z, y0 = z.copy(), view = {x: 0, y: 0, k: 1}, zoom) : y1
        }, d3.rebind(zoom, event, "on")
    };
    var d3_behavior_zoomDelta, d3_behavior_zoomInfinity = [0, 1 / 0], d3_behavior_zoomWheel = "onwheel"in d3_document ? (d3_behavior_zoomDelta = function () {
        return -d3.event.deltaY * (d3.event.deltaMode ? 120 : 1)
    }, "wheel") : "onmousewheel"in d3_document ? (d3_behavior_zoomDelta = function () {
        return d3.event.wheelDelta
    }, "mousewheel") : (d3_behavior_zoomDelta = function () {
        return -d3.event.detail
    }, "MozMousePixelScroll");
    d3.color = d3_color, d3_color.prototype.toString = function () {
        return this.rgb() + ""
    }, d3.hsl = d3_hsl;
    var d3_hslPrototype = d3_hsl.prototype = new d3_color;
    d3_hslPrototype.brighter = function (k) {
        return k = Math.pow(.7, arguments.length ? k : 1), new d3_hsl(this.h, this.s, this.l / k)
    }, d3_hslPrototype.darker = function (k) {
        return k = Math.pow(.7, arguments.length ? k : 1), new d3_hsl(this.h, this.s, k * this.l)
    }, d3_hslPrototype.rgb = function () {
        return d3_hsl_rgb(this.h, this.s, this.l)
    }, d3.hcl = d3_hcl;
    var d3_hclPrototype = d3_hcl.prototype = new d3_color;
    d3_hclPrototype.brighter = function (k) {
        return new d3_hcl(this.h, this.c, Math.min(100, this.l + d3_lab_K * (arguments.length ? k : 1)))
    }, d3_hclPrototype.darker = function (k) {
        return new d3_hcl(this.h, this.c, Math.max(0, this.l - d3_lab_K * (arguments.length ? k : 1)))
    }, d3_hclPrototype.rgb = function () {
        return d3_hcl_lab(this.h, this.c, this.l).rgb()
    }, d3.lab = d3_lab;
    var d3_lab_K = 18, d3_lab_X = .95047, d3_lab_Y = 1, d3_lab_Z = 1.08883, d3_labPrototype = d3_lab.prototype = new d3_color;
    d3_labPrototype.brighter = function (k) {
        return new d3_lab(Math.min(100, this.l + d3_lab_K * (arguments.length ? k : 1)), this.a, this.b)
    }, d3_labPrototype.darker = function (k) {
        return new d3_lab(Math.max(0, this.l - d3_lab_K * (arguments.length ? k : 1)), this.a, this.b)
    }, d3_labPrototype.rgb = function () {
        return d3_lab_rgb(this.l, this.a, this.b)
    }, d3.rgb = d3_rgb;
    var d3_rgbPrototype = d3_rgb.prototype = new d3_color;
    d3_rgbPrototype.brighter = function (k) {
        k = Math.pow(.7, arguments.length ? k : 1);
        var r = this.r, g = this.g, b = this.b, i = 30;
        return r || g || b ? (r && i > r && (r = i), g && i > g && (g = i), b && i > b && (b = i), new d3_rgb(Math.min(255, r / k), Math.min(255, g / k), Math.min(255, b / k))) : new d3_rgb(i, i, i)
    }, d3_rgbPrototype.darker = function (k) {
        return k = Math.pow(.7, arguments.length ? k : 1), new d3_rgb(k * this.r, k * this.g, k * this.b)
    }, d3_rgbPrototype.hsl = function () {
        return d3_rgb_hsl(this.r, this.g, this.b)
    }, d3_rgbPrototype.toString = function () {
        return "#" + d3_rgb_hex(this.r) + d3_rgb_hex(this.g) + d3_rgb_hex(this.b)
    };
    var d3_rgb_names = d3.map({
        aliceblue: 15792383,
        antiquewhite: 16444375,
        aqua: 65535,
        aquamarine: 8388564,
        azure: 15794175,
        beige: 16119260,
        bisque: 16770244,
        black: 0,
        blanchedalmond: 16772045,
        blue: 255,
        blueviolet: 9055202,
        brown: 10824234,
        burlywood: 14596231,
        cadetblue: 6266528,
        chartreuse: 8388352,
        chocolate: 13789470,
        coral: 16744272,
        cornflowerblue: 6591981,
        cornsilk: 16775388,
        crimson: 14423100,
        cyan: 65535,
        darkblue: 139,
        darkcyan: 35723,
        darkgoldenrod: 12092939,
        darkgray: 11119017,
        darkgreen: 25600,
        darkgrey: 11119017,
        darkkhaki: 12433259,
        darkmagenta: 9109643,
        darkolivegreen: 5597999,
        darkorange: 16747520,
        darkorchid: 10040012,
        darkred: 9109504,
        darksalmon: 15308410,
        darkseagreen: 9419919,
        darkslateblue: 4734347,
        darkslategray: 3100495,
        darkslategrey: 3100495,
        darkturquoise: 52945,
        darkviolet: 9699539,
        deeppink: 16716947,
        deepskyblue: 49151,
        dimgray: 6908265,
        dimgrey: 6908265,
        dodgerblue: 2003199,
        firebrick: 11674146,
        floralwhite: 16775920,
        forestgreen: 2263842,
        fuchsia: 16711935,
        gainsboro: 14474460,
        ghostwhite: 16316671,
        gold: 16766720,
        goldenrod: 14329120,
        gray: 8421504,
        green: 32768,
        greenyellow: 11403055,
        grey: 8421504,
        honeydew: 15794160,
        hotpink: 16738740,
        indianred: 13458524,
        indigo: 4915330,
        ivory: 16777200,
        khaki: 15787660,
        lavender: 15132410,
        lavenderblush: 16773365,
        lawngreen: 8190976,
        lemonchiffon: 16775885,
        lightblue: 11393254,
        lightcoral: 15761536,
        lightcyan: 14745599,
        lightgoldenrodyellow: 16448210,
        lightgray: 13882323,
        lightgreen: 9498256,
        lightgrey: 13882323,
        lightpink: 16758465,
        lightsalmon: 16752762,
        lightseagreen: 2142890,
        lightskyblue: 8900346,
        lightslategray: 7833753,
        lightslategrey: 7833753,
        lightsteelblue: 11584734,
        lightyellow: 16777184,
        lime: 65280,
        limegreen: 3329330,
        linen: 16445670,
        magenta: 16711935,
        maroon: 8388608,
        mediumaquamarine: 6737322,
        mediumblue: 205,
        mediumorchid: 12211667,
        mediumpurple: 9662683,
        mediumseagreen: 3978097,
        mediumslateblue: 8087790,
        mediumspringgreen: 64154,
        mediumturquoise: 4772300,
        mediumvioletred: 13047173,
        midnightblue: 1644912,
        mintcream: 16121850,
        mistyrose: 16770273,
        moccasin: 16770229,
        navajowhite: 16768685,
        navy: 128,
        oldlace: 16643558,
        olive: 8421376,
        olivedrab: 7048739,
        orange: 16753920,
        orangered: 16729344,
        orchid: 14315734,
        palegoldenrod: 15657130,
        palegreen: 10025880,
        paleturquoise: 11529966,
        palevioletred: 14381203,
        papayawhip: 16773077,
        peachpuff: 16767673,
        peru: 13468991,
        pink: 16761035,
        plum: 14524637,
        powderblue: 11591910,
        purple: 8388736,
        red: 16711680,
        rosybrown: 12357519,
        royalblue: 4286945,
        saddlebrown: 9127187,
        salmon: 16416882,
        sandybrown: 16032864,
        seagreen: 3050327,
        seashell: 16774638,
        sienna: 10506797,
        silver: 12632256,
        skyblue: 8900331,
        slateblue: 6970061,
        slategray: 7372944,
        slategrey: 7372944,
        snow: 16775930,
        springgreen: 65407,
        steelblue: 4620980,
        tan: 13808780,
        teal: 32896,
        thistle: 14204888,
        tomato: 16737095,
        turquoise: 4251856,
        violet: 15631086,
        wheat: 16113331,
        white: 16777215,
        whitesmoke: 16119285,
        yellow: 16776960,
        yellowgreen: 10145074
    });
    d3_rgb_names.forEach(function (key, value) {
        d3_rgb_names.set(key, d3_rgbNumber(value))
    }), d3.functor = d3_functor, d3.xhr = d3_xhrType(d3_identity), d3.dsv = function (delimiter, mimeType) {
        function dsv(url, row, callback) {
            arguments.length < 3 && (callback = row, row = null);
            var xhr = d3_xhr(url, mimeType, null == row ? response : typedResponse(row), callback);
            return xhr.row = function (_) {
                return arguments.length ? xhr.response(null == (row = _) ? response : typedResponse(_)) : row
            }, xhr
        }

        function response(request) {
            return dsv.parse(request.responseText)
        }

        function typedResponse(f) {
            return function (request) {
                return dsv.parse(request.responseText, f)
            }
        }

        function formatRow(row) {
            return row.map(formatValue).join(delimiter)
        }

        function formatValue(text) {
            return reFormat.test(text) ? '"' + text.replace(/\"/g, '""') + '"' : text
        }

        var reFormat = new RegExp('["' + delimiter + "\n]"), delimiterCode = delimiter.charCodeAt(0);
        return dsv.parse = function (text, f) {
            var o;
            return dsv.parseRows(text, function (row, i) {
                if (o)return o(row, i - 1);
                var a = new Function("d", "return {" + row.map(function (name, i) {
                    return JSON.stringify(name) + ": d[" + i + "]"
                }).join(",") + "}");
                o = f ? function (row, i) {
                    return f(a(row), i)
                } : a
            })
        }, dsv.parseRows = function (text, f) {
            function token() {
                if (I >= N)return EOF;
                if (eol)return eol = !1, EOL;
                var j = I;
                if (34 === text.charCodeAt(j)) {
                    for (var i = j; i++ < N;)if (34 === text.charCodeAt(i)) {
                        if (34 !== text.charCodeAt(i + 1))break;
                        ++i
                    }
                    I = i + 2;
                    var c = text.charCodeAt(i + 1);
                    return 13 === c ? (eol = !0, 10 === text.charCodeAt(i + 2) && ++I) : 10 === c && (eol = !0), text.slice(j + 1, i).replace(/""/g, '"')
                }
                for (; N > I;) {
                    var c = text.charCodeAt(I++), k = 1;
                    if (10 === c)eol = !0; else if (13 === c)eol = !0, 10 === text.charCodeAt(I) && (++I, ++k); else if (c !== delimiterCode)continue;
                    return text.slice(j, I - k)
                }
                return text.slice(j)
            }

            for (var t, eol, EOL = {}, EOF = {}, rows = [], N = text.length, I = 0, n = 0; (t = token()) !== EOF;) {
                for (var a = []; t !== EOL && t !== EOF;)a.push(t), t = token();
                f && null == (a = f(a, n++)) || rows.push(a)
            }
            return rows
        }, dsv.format = function (rows) {
            if (Array.isArray(rows[0]))return dsv.formatRows(rows);
            var fieldSet = new d3_Set, fields = [];
            return rows.forEach(function (row) {
                for (var field in row)fieldSet.has(field) || fields.push(fieldSet.add(field))
            }), [fields.map(formatValue).join(delimiter)].concat(rows.map(function (row) {
                return fields.map(function (field) {
                    return formatValue(row[field])
                }).join(delimiter)
            })).join("\n")
        }, dsv.formatRows = function (rows) {
            return rows.map(formatRow).join("\n")
        }, dsv
    }, d3.csv = d3.dsv(",", "text/csv"), d3.tsv = d3.dsv("	", "text/tab-separated-values");
    var d3_timer_queueHead, d3_timer_queueTail, d3_timer_interval, d3_timer_timeout, d3_timer_active, d3_timer_frame = d3_window[d3_vendorSymbol(d3_window, "requestAnimationFrame")] || function (callback) {
            setTimeout(callback, 17)
        };
    d3.timer = function (callback, delay, then) {
        var n = arguments.length;
        2 > n && (delay = 0), 3 > n && (then = Date.now());
        var time = then + delay, timer = {c: callback, t: time, f: !1, n: null};
        d3_timer_queueTail ? d3_timer_queueTail.n = timer : d3_timer_queueHead = timer, d3_timer_queueTail = timer, d3_timer_interval || (d3_timer_timeout = clearTimeout(d3_timer_timeout), d3_timer_interval = 1, d3_timer_frame(d3_timer_step))
    }, d3.timer.flush = function () {
        d3_timer_mark(), d3_timer_sweep()
    }, d3.round = function (x, n) {
        return n ? Math.round(x * (n = Math.pow(10, n))) / n : Math.round(x)
    };
    var d3_formatPrefixes = ["y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"].map(d3_formatPrefix);
    d3.formatPrefix = function (value, precision) {
        var i = 0;
        return value && (0 > value && (value *= -1), precision && (value = d3.round(value, d3_format_precision(value, precision))), i = 1 + Math.floor(1e-12 + Math.log(value) / Math.LN10), i = Math.max(-24, Math.min(24, 3 * Math.floor((i - 1) / 3)))), d3_formatPrefixes[8 + i / 3]
    };
    var d3_format_re = /(?:([^{])?([<>=^]))?([+\- ])?([$#])?(0)?(\d+)?(,)?(\.-?\d+)?([a-z%])?/i, d3_format_types = d3.map({
        b: function (x) {
            return x.toString(2)
        }, c: function (x) {
            return String.fromCharCode(x)
        }, o: function (x) {
            return x.toString(8)
        }, x: function (x) {
            return x.toString(16)
        }, X: function (x) {
            return x.toString(16).toUpperCase()
        }, g: function (x, p) {
            return x.toPrecision(p)
        }, e: function (x, p) {
            return x.toExponential(p)
        }, f: function (x, p) {
            return x.toFixed(p)
        }, r: function (x, p) {
            return (x = d3.round(x, d3_format_precision(x, p))).toFixed(Math.max(0, Math.min(20, d3_format_precision(x * (1 + 1e-15), p))))
        }
    }), d3_time = d3.time = {}, d3_date = Date;
    d3_date_utc.prototype = {
        getDate: function () {
            return this._.getUTCDate()
        }, getDay: function () {
            return this._.getUTCDay()
        }, getFullYear: function () {
            return this._.getUTCFullYear()
        }, getHours: function () {
            return this._.getUTCHours()
        }, getMilliseconds: function () {
            return this._.getUTCMilliseconds()
        }, getMinutes: function () {
            return this._.getUTCMinutes()
        }, getMonth: function () {
            return this._.getUTCMonth()
        }, getSeconds: function () {
            return this._.getUTCSeconds()
        }, getTime: function () {
            return this._.getTime()
        }, getTimezoneOffset: function () {
            return 0
        }, valueOf: function () {
            return this._.valueOf()
        }, setDate: function () {
            d3_time_prototype.setUTCDate.apply(this._, arguments)
        }, setDay: function () {
            d3_time_prototype.setUTCDay.apply(this._, arguments)
        }, setFullYear: function () {
            d3_time_prototype.setUTCFullYear.apply(this._, arguments)
        }, setHours: function () {
            d3_time_prototype.setUTCHours.apply(this._, arguments)
        }, setMilliseconds: function () {
            d3_time_prototype.setUTCMilliseconds.apply(this._, arguments)
        }, setMinutes: function () {
            d3_time_prototype.setUTCMinutes.apply(this._, arguments)
        }, setMonth: function () {
            d3_time_prototype.setUTCMonth.apply(this._, arguments)
        }, setSeconds: function () {
            d3_time_prototype.setUTCSeconds.apply(this._, arguments)
        }, setTime: function () {
            d3_time_prototype.setTime.apply(this._, arguments)
        }
    };
    var d3_time_prototype = Date.prototype;
    d3_time.year = d3_time_interval(function (date) {
        return date = d3_time.day(date), date.setMonth(0, 1), date
    }, function (date, offset) {
        date.setFullYear(date.getFullYear() + offset)
    }, function (date) {
        return date.getFullYear()
    }), d3_time.years = d3_time.year.range, d3_time.years.utc = d3_time.year.utc.range, d3_time.day = d3_time_interval(function (date) {
        var day = new d3_date(2e3, 0);
        return day.setFullYear(date.getFullYear(), date.getMonth(), date.getDate()), day
    }, function (date, offset) {
        date.setDate(date.getDate() + offset)
    }, function (date) {
        return date.getDate() - 1
    }), d3_time.days = d3_time.day.range, d3_time.days.utc = d3_time.day.utc.range, d3_time.dayOfYear = function (date) {
        var year = d3_time.year(date);
        return Math.floor((date - year - 6e4 * (date.getTimezoneOffset() - year.getTimezoneOffset())) / 864e5)
    }, ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"].forEach(function (day, i) {
        i = 7 - i;
        var interval = d3_time[day] = d3_time_interval(function (date) {
            return (date = d3_time.day(date)).setDate(date.getDate() - (date.getDay() + i) % 7), date
        }, function (date, offset) {
            date.setDate(date.getDate() + 7 * Math.floor(offset))
        }, function (date) {
            var day = d3_time.year(date).getDay();
            return Math.floor((d3_time.dayOfYear(date) + (day + i) % 7) / 7) - (day !== i)
        });
        d3_time[day + "s"] = interval.range, d3_time[day + "s"].utc = interval.utc.range, d3_time[day + "OfYear"] = function (date) {
            var day = d3_time.year(date).getDay();
            return Math.floor((d3_time.dayOfYear(date) + (day + i) % 7) / 7)
        }
    }), d3_time.week = d3_time.sunday, d3_time.weeks = d3_time.sunday.range, d3_time.weeks.utc = d3_time.sunday.utc.range, d3_time.weekOfYear = d3_time.sundayOfYear;
    var d3_time_formatPads = {"-": "", _: " ", 0: "0"}, d3_time_numberRe = /^\s*\d+/, d3_time_percentRe = /^%/;
    d3.locale = function (locale) {
        return {numberFormat: d3_locale_numberFormat(locale), timeFormat: d3_locale_timeFormat(locale)}
    };
    var d3_locale_enUS = d3.locale({
        decimal: ".",
        thousands: ",",
        grouping: [3],
        currency: ["$", ""],
        dateTime: "%a %b %e %X %Y",
        date: "%m/%d/%Y",
        time: "%H:%M:%S",
        periods: ["AM", "PM"],
        days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    });
    d3.format = d3_locale_enUS.numberFormat, d3.geo = {}, d3_adder.prototype = {
        s: 0, t: 0, add: function (y) {
            d3_adderSum(y, this.t, d3_adderTemp), d3_adderSum(d3_adderTemp.s, this.s, this), this.s ? this.t += d3_adderTemp.t : this.s = d3_adderTemp.t
        }, reset: function () {
            this.s = this.t = 0
        }, valueOf: function () {
            return this.s
        }
    };
    var d3_adderTemp = new d3_adder;
    d3.geo.stream = function (object, listener) {
        object && d3_geo_streamObjectType.hasOwnProperty(object.type) ? d3_geo_streamObjectType[object.type](object, listener) : d3_geo_streamGeometry(object, listener)
    };
    var d3_geo_streamObjectType = {
        Feature: function (feature, listener) {
            d3_geo_streamGeometry(feature.geometry, listener)
        }, FeatureCollection: function (object, listener) {
            for (var features = object.features, i = -1, n = features.length; ++i < n;)d3_geo_streamGeometry(features[i].geometry, listener)
        }
    }, d3_geo_streamGeometryType = {
        Sphere: function (object, listener) {
            listener.sphere()
        }, Point: function (object, listener) {
            object = object.coordinates, listener.point(object[0], object[1], object[2])
        }, MultiPoint: function (object, listener) {
            for (var coordinates = object.coordinates, i = -1, n = coordinates.length; ++i < n;)object = coordinates[i], listener.point(object[0], object[1], object[2])
        }, LineString: function (object, listener) {
            d3_geo_streamLine(object.coordinates, listener, 0)
        }, MultiLineString: function (object, listener) {
            for (var coordinates = object.coordinates, i = -1, n = coordinates.length; ++i < n;)d3_geo_streamLine(coordinates[i], listener, 0)
        }, Polygon: function (object, listener) {
            d3_geo_streamPolygon(object.coordinates, listener)
        }, MultiPolygon: function (object, listener) {
            for (var coordinates = object.coordinates, i = -1, n = coordinates.length; ++i < n;)d3_geo_streamPolygon(coordinates[i], listener)
        }, GeometryCollection: function (object, listener) {
            for (var geometries = object.geometries, i = -1, n = geometries.length; ++i < n;)d3_geo_streamGeometry(geometries[i], listener)
        }
    };
    d3.geo.area = function (object) {
        return d3_geo_areaSum = 0, d3.geo.stream(object, d3_geo_area), d3_geo_areaSum
    };
    var d3_geo_areaSum, d3_geo_areaRingSum = new d3_adder, d3_geo_area = {
        sphere: function () {
            d3_geo_areaSum += 4 * π
        }, point: d3_noop, lineStart: d3_noop, lineEnd: d3_noop, polygonStart: function () {
            d3_geo_areaRingSum.reset(), d3_geo_area.lineStart = d3_geo_areaRingStart
        }, polygonEnd: function () {
            var area = 2 * d3_geo_areaRingSum;
            d3_geo_areaSum += 0 > area ? 4 * π + area : area, d3_geo_area.lineStart = d3_geo_area.lineEnd = d3_geo_area.point = d3_noop
        }
    };
    d3.geo.bounds = function () {
        function point(λ, φ) {
            ranges.push(range = [λ0 = λ, λ1 = λ]), φ0 > φ && (φ0 = φ), φ > φ1 && (φ1 = φ)
        }

        function linePoint(λ, φ) {
            var p = d3_geo_cartesian([λ * d3_radians, φ * d3_radians]);
            if (p0) {
                var normal = d3_geo_cartesianCross(p0, p), equatorial = [normal[1], -normal[0], 0], inflection = d3_geo_cartesianCross(equatorial, normal);
                d3_geo_cartesianNormalize(inflection), inflection = d3_geo_spherical(inflection);
                var dλ = λ - λ_, s = dλ > 0 ? 1 : -1, λi = inflection[0] * d3_degrees * s, antimeridian = abs(dλ) > 180;
                if (antimeridian ^ (λi > s * λ_ && s * λ > λi)) {
                    var φi = inflection[1] * d3_degrees;
                    φi > φ1 && (φ1 = φi)
                } else if (λi = (λi + 360) % 360 - 180, antimeridian ^ (λi > s * λ_ && s * λ > λi)) {
                    var φi = -inflection[1] * d3_degrees;
                    φ0 > φi && (φ0 = φi)
                } else φ0 > φ && (φ0 = φ), φ > φ1 && (φ1 = φ);
                antimeridian ? λ_ > λ ? angle(λ0, λ) > angle(λ0, λ1) && (λ1 = λ) : angle(λ, λ1) > angle(λ0, λ1) && (λ0 = λ) : λ1 >= λ0 ? (λ0 > λ && (λ0 = λ), λ > λ1 && (λ1 = λ)) : λ > λ_ ? angle(λ0, λ) > angle(λ0, λ1) && (λ1 = λ) : angle(λ, λ1) > angle(λ0, λ1) && (λ0 = λ)
            } else point(λ, φ);
            p0 = p, λ_ = λ
        }

        function lineStart() {
            bound.point = linePoint
        }

        function lineEnd() {
            range[0] = λ0, range[1] = λ1, bound.point = point, p0 = null
        }

        function ringPoint(λ, φ) {
            if (p0) {
                var dλ = λ - λ_;
                dλSum += abs(dλ) > 180 ? dλ + (dλ > 0 ? 360 : -360) : dλ
            } else λ__ = λ, φ__ = φ;
            d3_geo_area.point(λ, φ), linePoint(λ, φ)
        }

        function ringStart() {
            d3_geo_area.lineStart()
        }

        function ringEnd() {
            ringPoint(λ__, φ__), d3_geo_area.lineEnd(), abs(dλSum) > ε && (λ0 = -(λ1 = 180)), range[0] = λ0, range[1] = λ1, p0 = null
        }

        function angle(λ0, λ1) {
            return (λ1 -= λ0) < 0 ? λ1 + 360 : λ1
        }

        function compareRanges(a, b) {
            return a[0] - b[0]
        }

        function withinRange(x, range) {
            return range[0] <= range[1] ? range[0] <= x && x <= range[1] : x < range[0] || range[1] < x
        }

        var λ0, φ0, λ1, φ1, λ_, λ__, φ__, p0, dλSum, ranges, range, bound = {
            point: point,
            lineStart: lineStart,
            lineEnd: lineEnd,
            polygonStart: function () {
                bound.point = ringPoint, bound.lineStart = ringStart, bound.lineEnd = ringEnd, dλSum = 0, d3_geo_area.polygonStart()
            },
            polygonEnd: function () {
                d3_geo_area.polygonEnd(), bound.point = point, bound.lineStart = lineStart, bound.lineEnd = lineEnd, 0 > d3_geo_areaRingSum ? (λ0 = -(λ1 = 180), φ0 = -(φ1 = 90)) : dλSum > ε ? φ1 = 90 : -ε > dλSum && (φ0 = -90), range[0] = λ0, range[1] = λ1
            }
        };
        return function (feature) {
            φ1 = λ1 = -(λ0 = φ0 = 1 / 0), ranges = [], d3.geo.stream(feature, bound);
            var n = ranges.length;
            if (n) {
                ranges.sort(compareRanges);
                for (var b, i = 1, a = ranges[0], merged = [a]; n > i; ++i)b = ranges[i], withinRange(b[0], a) || withinRange(b[1], a) ? (angle(a[0], b[1]) > angle(a[0], a[1]) && (a[1] = b[1]), angle(b[0], a[1]) > angle(a[0], a[1]) && (a[0] = b[0])) : merged.push(a = b);
                for (var dλ, b, best = -1 / 0, n = merged.length - 1, i = 0, a = merged[n]; n >= i; a = b, ++i)b = merged[i], (dλ = angle(a[1], b[0])) > best && (best = dλ, λ0 = b[0], λ1 = a[1])
            }
            return ranges = range = null, 1 / 0 === λ0 || 1 / 0 === φ0 ? [[0 / 0, 0 / 0], [0 / 0, 0 / 0]] : [[λ0, φ0], [λ1, φ1]]
        }
    }(), d3.geo.centroid = function (object) {
        d3_geo_centroidW0 = d3_geo_centroidW1 = d3_geo_centroidX0 = d3_geo_centroidY0 = d3_geo_centroidZ0 = d3_geo_centroidX1 = d3_geo_centroidY1 = d3_geo_centroidZ1 = d3_geo_centroidX2 = d3_geo_centroidY2 = d3_geo_centroidZ2 = 0, d3.geo.stream(object, d3_geo_centroid);
        var x = d3_geo_centroidX2, y = d3_geo_centroidY2, z = d3_geo_centroidZ2, m = x * x + y * y + z * z;
        return ε2 > m && (x = d3_geo_centroidX1, y = d3_geo_centroidY1, z = d3_geo_centroidZ1, ε > d3_geo_centroidW1 && (x = d3_geo_centroidX0, y = d3_geo_centroidY0, z = d3_geo_centroidZ0), m = x * x + y * y + z * z, ε2 > m) ? [0 / 0, 0 / 0] : [Math.atan2(y, x) * d3_degrees, d3_asin(z / Math.sqrt(m)) * d3_degrees]
    };
    var d3_geo_centroidW0, d3_geo_centroidW1, d3_geo_centroidX0, d3_geo_centroidY0, d3_geo_centroidZ0, d3_geo_centroidX1, d3_geo_centroidY1, d3_geo_centroidZ1, d3_geo_centroidX2, d3_geo_centroidY2, d3_geo_centroidZ2, d3_geo_centroid = {
        sphere: d3_noop,
        point: d3_geo_centroidPoint,
        lineStart: d3_geo_centroidLineStart,
        lineEnd: d3_geo_centroidLineEnd,
        polygonStart: function () {
            d3_geo_centroid.lineStart = d3_geo_centroidRingStart
        },
        polygonEnd: function () {
            d3_geo_centroid.lineStart = d3_geo_centroidLineStart
        }
    }, d3_geo_clipAntimeridian = d3_geo_clip(d3_true, d3_geo_clipAntimeridianLine, d3_geo_clipAntimeridianInterpolate, [-π, -π / 2]), d3_geo_clipExtentMAX = 1e9;
    d3.geo.clipExtent = function () {
        var x0, y0, x1, y1, stream, clip, clipExtent = {
            stream: function (output) {
                return stream && (stream.valid = !1), stream = clip(output), stream.valid = !0, stream
            }, extent: function (_) {
                return arguments.length ? (clip = d3_geo_clipExtent(x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1]), stream && (stream.valid = !1, stream = null), clipExtent) : [[x0, y0], [x1, y1]]
            }
        };
        return clipExtent.extent([[0, 0], [960, 500]])
    }, (d3.geo.conicEqualArea = function () {
        return d3_geo_conic(d3_geo_conicEqualArea)
    }).raw = d3_geo_conicEqualArea, d3.geo.albers = function () {
        return d3.geo.conicEqualArea().rotate([96, 0]).center([-.6, 38.7]).parallels([29.5, 45.5]).scale(1070)
    }, d3.geo.albersUsa = function () {
        function albersUsa(coordinates) {
            var x = coordinates[0], y = coordinates[1];
            return point = null, lower48Point(x, y), point || (alaskaPoint(x, y), point) || hawaiiPoint(x, y), point
        }

        var point, lower48Point, alaskaPoint, hawaiiPoint, lower48 = d3.geo.albers(), alaska = d3.geo.conicEqualArea().rotate([154, 0]).center([-2, 58.5]).parallels([55, 65]), hawaii = d3.geo.conicEqualArea().rotate([157, 0]).center([-3, 19.9]).parallels([8, 18]), pointStream = {
            point: function (x, y) {
                point = [x, y]
            }
        };
        return albersUsa.invert = function (coordinates) {
            var k = lower48.scale(), t = lower48.translate(), x = (coordinates[0] - t[0]) / k, y = (coordinates[1] - t[1]) / k;
            return (y >= .12 && .234 > y && x >= -.425 && -.214 > x ? alaska : y >= .166 && .234 > y && x >= -.214 && -.115 > x ? hawaii : lower48).invert(coordinates)
        }, albersUsa.stream = function (stream) {
            var lower48Stream = lower48.stream(stream), alaskaStream = alaska.stream(stream), hawaiiStream = hawaii.stream(stream);
            return {
                point: function (x, y) {
                    lower48Stream.point(x, y), alaskaStream.point(x, y), hawaiiStream.point(x, y)
                }, sphere: function () {
                    lower48Stream.sphere(), alaskaStream.sphere(), hawaiiStream.sphere()
                }, lineStart: function () {
                    lower48Stream.lineStart(), alaskaStream.lineStart(), hawaiiStream.lineStart()
                }, lineEnd: function () {
                    lower48Stream.lineEnd(), alaskaStream.lineEnd(), hawaiiStream.lineEnd()
                }, polygonStart: function () {
                    lower48Stream.polygonStart(), alaskaStream.polygonStart(), hawaiiStream.polygonStart()
                }, polygonEnd: function () {
                    lower48Stream.polygonEnd(), alaskaStream.polygonEnd(), hawaiiStream.polygonEnd()
                }
            }
        }, albersUsa.precision = function (_) {
            return arguments.length ? (lower48.precision(_), alaska.precision(_), hawaii.precision(_), albersUsa) : lower48.precision()
        }, albersUsa.scale = function (_) {
            return arguments.length ? (lower48.scale(_), alaska.scale(.35 * _), hawaii.scale(_), albersUsa.translate(lower48.translate())) : lower48.scale()
        }, albersUsa.translate = function (_) {
            if (!arguments.length)return lower48.translate();
            var k = lower48.scale(), x = +_[0], y = +_[1];
            return lower48Point = lower48.translate(_).clipExtent([[x - .455 * k, y - .238 * k], [x + .455 * k, y + .238 * k]]).stream(pointStream).point, alaskaPoint = alaska.translate([x - .307 * k, y + .201 * k]).clipExtent([[x - .425 * k + ε, y + .12 * k + ε], [x - .214 * k - ε, y + .234 * k - ε]]).stream(pointStream).point, hawaiiPoint = hawaii.translate([x - .205 * k, y + .212 * k]).clipExtent([[x - .214 * k + ε, y + .166 * k + ε], [x - .115 * k - ε, y + .234 * k - ε]]).stream(pointStream).point, albersUsa
        }, albersUsa.scale(1070)
    };
    var d3_geo_pathAreaSum, d3_geo_pathAreaPolygon, d3_geo_pathBoundsX0, d3_geo_pathBoundsY0, d3_geo_pathBoundsX1, d3_geo_pathBoundsY1, d3_geo_pathArea = {
        point: d3_noop,
        lineStart: d3_noop,
        lineEnd: d3_noop,
        polygonStart: function () {
            d3_geo_pathAreaPolygon = 0, d3_geo_pathArea.lineStart = d3_geo_pathAreaRingStart
        },
        polygonEnd: function () {
            d3_geo_pathArea.lineStart = d3_geo_pathArea.lineEnd = d3_geo_pathArea.point = d3_noop, d3_geo_pathAreaSum += abs(d3_geo_pathAreaPolygon / 2)
        }
    }, d3_geo_pathBounds = {
        point: d3_geo_pathBoundsPoint,
        lineStart: d3_noop,
        lineEnd: d3_noop,
        polygonStart: d3_noop,
        polygonEnd: d3_noop
    }, d3_geo_pathCentroid = {
        point: d3_geo_pathCentroidPoint,
        lineStart: d3_geo_pathCentroidLineStart,
        lineEnd: d3_geo_pathCentroidLineEnd,
        polygonStart: function () {
            d3_geo_pathCentroid.lineStart = d3_geo_pathCentroidRingStart
        },
        polygonEnd: function () {
            d3_geo_pathCentroid.point = d3_geo_pathCentroidPoint, d3_geo_pathCentroid.lineStart = d3_geo_pathCentroidLineStart, d3_geo_pathCentroid.lineEnd = d3_geo_pathCentroidLineEnd
        }
    };
    d3.geo.path = function () {
        function path(object) {
            return object && ("function" == typeof pointRadius && contextStream.pointRadius(+pointRadius.apply(this, arguments)), cacheStream && cacheStream.valid || (cacheStream = projectStream(contextStream)), d3.geo.stream(object, cacheStream)), contextStream.result()
        }

        function reset() {
            return cacheStream = null, path
        }

        var projection, context, projectStream, contextStream, cacheStream, pointRadius = 4.5;
        return path.area = function (object) {
            return d3_geo_pathAreaSum = 0, d3.geo.stream(object, projectStream(d3_geo_pathArea)), d3_geo_pathAreaSum
        }, path.centroid = function (object) {
            return d3_geo_centroidX0 = d3_geo_centroidY0 = d3_geo_centroidZ0 = d3_geo_centroidX1 = d3_geo_centroidY1 = d3_geo_centroidZ1 = d3_geo_centroidX2 = d3_geo_centroidY2 = d3_geo_centroidZ2 = 0, d3.geo.stream(object, projectStream(d3_geo_pathCentroid)), d3_geo_centroidZ2 ? [d3_geo_centroidX2 / d3_geo_centroidZ2, d3_geo_centroidY2 / d3_geo_centroidZ2] : d3_geo_centroidZ1 ? [d3_geo_centroidX1 / d3_geo_centroidZ1, d3_geo_centroidY1 / d3_geo_centroidZ1] : d3_geo_centroidZ0 ? [d3_geo_centroidX0 / d3_geo_centroidZ0, d3_geo_centroidY0 / d3_geo_centroidZ0] : [0 / 0, 0 / 0]
        }, path.bounds = function (object) {
            return d3_geo_pathBoundsX1 = d3_geo_pathBoundsY1 = -(d3_geo_pathBoundsX0 = d3_geo_pathBoundsY0 = 1 / 0), d3.geo.stream(object, projectStream(d3_geo_pathBounds)), [[d3_geo_pathBoundsX0, d3_geo_pathBoundsY0], [d3_geo_pathBoundsX1, d3_geo_pathBoundsY1]]
        }, path.projection = function (_) {
            return arguments.length ? (projectStream = (projection = _) ? _.stream || d3_geo_pathProjectStream(_) : d3_identity, reset()) : projection
        }, path.context = function (_) {
            return arguments.length ? (contextStream = null == (context = _) ? new d3_geo_pathBuffer : new d3_geo_pathContext(_), "function" != typeof pointRadius && contextStream.pointRadius(pointRadius), reset()) : context
        }, path.pointRadius = function (_) {
            return arguments.length ? (pointRadius = "function" == typeof _ ? _ : (contextStream.pointRadius(+_), +_), path) : pointRadius
        }, path.projection(d3.geo.albersUsa()).context(null)
    }, d3.geo.transform = function (methods) {
        return {
            stream: function (stream) {
                var transform = new d3_geo_transform(stream);
                for (var k in methods)transform[k] = methods[k];
                return transform
            }
        }
    }, d3_geo_transform.prototype = {
        point: function (x, y) {
            this.stream.point(x, y)
        }, sphere: function () {
            this.stream.sphere()
        }, lineStart: function () {
            this.stream.lineStart()
        }, lineEnd: function () {
            this.stream.lineEnd()
        }, polygonStart: function () {
            this.stream.polygonStart()
        }, polygonEnd: function () {
            this.stream.polygonEnd()
        }
    }, d3.geo.projection = d3_geo_projection, d3.geo.projectionMutator = d3_geo_projectionMutator, (d3.geo.equirectangular = function () {
        return d3_geo_projection(d3_geo_equirectangular)
    }).raw = d3_geo_equirectangular.invert = d3_geo_equirectangular, d3.geo.rotation = function (rotate) {
        function forward(coordinates) {
            return coordinates = rotate(coordinates[0] * d3_radians, coordinates[1] * d3_radians), coordinates[0] *= d3_degrees, coordinates[1] *= d3_degrees, coordinates
        }

        return rotate = d3_geo_rotation(rotate[0] % 360 * d3_radians, rotate[1] * d3_radians, rotate.length > 2 ? rotate[2] * d3_radians : 0), forward.invert = function (coordinates) {
            return coordinates = rotate.invert(coordinates[0] * d3_radians, coordinates[1] * d3_radians), coordinates[0] *= d3_degrees, coordinates[1] *= d3_degrees, coordinates
        }, forward
    }, d3_geo_identityRotation.invert = d3_geo_equirectangular, d3.geo.circle = function () {
        function circle() {
            var center = "function" == typeof origin ? origin.apply(this, arguments) : origin, rotate = d3_geo_rotation(-center[0] * d3_radians, -center[1] * d3_radians, 0).invert, ring = [];
            return interpolate(null, null, 1, {
                point: function (x, y) {
                    ring.push(x = rotate(x, y)), x[0] *= d3_degrees, x[1] *= d3_degrees
                }
            }), {type: "Polygon", coordinates: [ring]}
        }

        var angle, interpolate, origin = [0, 0], precision = 6;
        return circle.origin = function (x) {
            return arguments.length ? (origin = x, circle) : origin
        }, circle.angle = function (x) {
            return arguments.length ? (interpolate = d3_geo_circleInterpolate((angle = +x) * d3_radians, precision * d3_radians), circle) : angle
        }, circle.precision = function (_) {
            return arguments.length ? (interpolate = d3_geo_circleInterpolate(angle * d3_radians, (precision = +_) * d3_radians), circle) : precision
        }, circle.angle(90)
    }, d3.geo.distance = function (a, b) {
        var t, Δλ = (b[0] - a[0]) * d3_radians, φ0 = a[1] * d3_radians, φ1 = b[1] * d3_radians, sinΔλ = Math.sin(Δλ), cosΔλ = Math.cos(Δλ), sinφ0 = Math.sin(φ0), cosφ0 = Math.cos(φ0), sinφ1 = Math.sin(φ1), cosφ1 = Math.cos(φ1);
        return Math.atan2(Math.sqrt((t = cosφ1 * sinΔλ) * t + (t = cosφ0 * sinφ1 - sinφ0 * cosφ1 * cosΔλ) * t), sinφ0 * sinφ1 + cosφ0 * cosφ1 * cosΔλ)
    }, d3.geo.graticule = function () {
        function graticule() {
            return {type: "MultiLineString", coordinates: lines()}
        }

        function lines() {
            return d3.range(Math.ceil(X0 / DX) * DX, X1, DX).map(X).concat(d3.range(Math.ceil(Y0 / DY) * DY, Y1, DY).map(Y)).concat(d3.range(Math.ceil(x0 / dx) * dx, x1, dx).filter(function (x) {
                return abs(x % DX) > ε
            }).map(x)).concat(d3.range(Math.ceil(y0 / dy) * dy, y1, dy).filter(function (y) {
                return abs(y % DY) > ε
            }).map(y))
        }

        var x1, x0, X1, X0, y1, y0, Y1, Y0, x, y, X, Y, dx = 10, dy = dx, DX = 90, DY = 360, precision = 2.5;
        return graticule.lines = function () {
            return lines().map(function (coordinates) {
                return {type: "LineString", coordinates: coordinates}
            })
        }, graticule.outline = function () {
            return {
                type: "Polygon",
                coordinates: [X(X0).concat(Y(Y1).slice(1), X(X1).reverse().slice(1), Y(Y0).reverse().slice(1))]
            }
        }, graticule.extent = function (_) {
            return arguments.length ? graticule.majorExtent(_).minorExtent(_) : graticule.minorExtent()
        }, graticule.majorExtent = function (_) {
            return arguments.length ? (X0 = +_[0][0], X1 = +_[1][0], Y0 = +_[0][1], Y1 = +_[1][1], X0 > X1 && (_ = X0, X0 = X1, X1 = _), Y0 > Y1 && (_ = Y0, Y0 = Y1, Y1 = _), graticule.precision(precision)) : [[X0, Y0], [X1, Y1]]
        }, graticule.minorExtent = function (_) {
            return arguments.length ? (x0 = +_[0][0], x1 = +_[1][0], y0 = +_[0][1], y1 = +_[1][1], x0 > x1 && (_ = x0, x0 = x1, x1 = _), y0 > y1 && (_ = y0, y0 = y1, y1 = _), graticule.precision(precision)) : [[x0, y0], [x1, y1]]
        }, graticule.step = function (_) {
            return arguments.length ? graticule.majorStep(_).minorStep(_) : graticule.minorStep()
        }, graticule.majorStep = function (_) {
            return arguments.length ? (DX = +_[0], DY = +_[1], graticule) : [DX, DY]
        }, graticule.minorStep = function (_) {
            return arguments.length ? (dx = +_[0], dy = +_[1], graticule) : [dx, dy]
        }, graticule.precision = function (_) {
            return arguments.length ? (precision = +_, x = d3_geo_graticuleX(y0, y1, 90), y = d3_geo_graticuleY(x0, x1, precision), X = d3_geo_graticuleX(Y0, Y1, 90), Y = d3_geo_graticuleY(X0, X1, precision), graticule) : precision
        }, graticule.majorExtent([[-180, -90 + ε], [180, 90 - ε]]).minorExtent([[-180, -80 - ε], [180, 80 + ε]])
    }, d3.geo.greatArc = function () {
        function greatArc() {
            return {
                type: "LineString",
                coordinates: [source_ || source.apply(this, arguments), target_ || target.apply(this, arguments)]
            }
        }

        var source_, target_, source = d3_source, target = d3_target;
        return greatArc.distance = function () {
            return d3.geo.distance(source_ || source.apply(this, arguments), target_ || target.apply(this, arguments))
        }, greatArc.source = function (_) {
            return arguments.length ? (source = _, source_ = "function" == typeof _ ? null : _, greatArc) : source
        }, greatArc.target = function (_) {
            return arguments.length ? (target = _, target_ = "function" == typeof _ ? null : _, greatArc) : target
        }, greatArc.precision = function () {
            return arguments.length ? greatArc : 0
        }, greatArc
    }, d3.geo.interpolate = function (source, target) {
        return d3_geo_interpolate(source[0] * d3_radians, source[1] * d3_radians, target[0] * d3_radians, target[1] * d3_radians)
    }, d3.geo.length = function (object) {
        return d3_geo_lengthSum = 0, d3.geo.stream(object, d3_geo_length), d3_geo_lengthSum
    };
    var d3_geo_lengthSum, d3_geo_length = {
        sphere: d3_noop,
        point: d3_noop,
        lineStart: d3_geo_lengthLineStart,
        lineEnd: d3_noop,
        polygonStart: d3_noop,
        polygonEnd: d3_noop
    }, d3_geo_azimuthalEqualArea = d3_geo_azimuthal(function (cosλcosφ) {
        return Math.sqrt(2 / (1 + cosλcosφ))
    }, function (ρ) {
        return 2 * Math.asin(ρ / 2)
    });
    (d3.geo.azimuthalEqualArea = function () {
        return d3_geo_projection(d3_geo_azimuthalEqualArea)
    }).raw = d3_geo_azimuthalEqualArea;
    var d3_geo_azimuthalEquidistant = d3_geo_azimuthal(function (cosλcosφ) {
        var c = Math.acos(cosλcosφ);
        return c && c / Math.sin(c)
    }, d3_identity);
    (d3.geo.azimuthalEquidistant = function () {
        return d3_geo_projection(d3_geo_azimuthalEquidistant)
    }).raw = d3_geo_azimuthalEquidistant, (d3.geo.conicConformal = function () {
        return d3_geo_conic(d3_geo_conicConformal)
    }).raw = d3_geo_conicConformal, (d3.geo.conicEquidistant = function () {
        return d3_geo_conic(d3_geo_conicEquidistant)
    }).raw = d3_geo_conicEquidistant;
    var d3_geo_gnomonic = d3_geo_azimuthal(function (cosλcosφ) {
        return 1 / cosλcosφ
    }, Math.atan);
    (d3.geo.gnomonic = function () {
        return d3_geo_projection(d3_geo_gnomonic)
    }).raw = d3_geo_gnomonic, d3_geo_mercator.invert = function (x, y) {
        return [x, 2 * Math.atan(Math.exp(y)) - halfπ]
    }, (d3.geo.mercator = function () {
        return d3_geo_mercatorProjection(d3_geo_mercator)
    }).raw = d3_geo_mercator;
    var d3_geo_orthographic = d3_geo_azimuthal(function () {
        return 1
    }, Math.asin);
    (d3.geo.orthographic = function () {
        return d3_geo_projection(d3_geo_orthographic)
    }).raw = d3_geo_orthographic;
    var d3_geo_stereographic = d3_geo_azimuthal(function (cosλcosφ) {
        return 1 / (1 + cosλcosφ)
    }, function (ρ) {
        return 2 * Math.atan(ρ)
    });
    (d3.geo.stereographic = function () {
        return d3_geo_projection(d3_geo_stereographic)
    }).raw = d3_geo_stereographic, d3_geo_transverseMercator.invert = function (x, y) {
        return [-y, 2 * Math.atan(Math.exp(x)) - halfπ]
    }, (d3.geo.transverseMercator = function () {
        var projection = d3_geo_mercatorProjection(d3_geo_transverseMercator), center = projection.center, rotate = projection.rotate;
        return projection.center = function (_) {
            return _ ? center([-_[1], _[0]]) : (_ = center(), [_[1], -_[0]])
        }, projection.rotate = function (_) {
            return _ ? rotate([_[0], _[1], _.length > 2 ? _[2] + 90 : 90]) : (_ = rotate(), [_[0], _[1], _[2] - 90])
        }, rotate([0, 0, 90])
    }).raw = d3_geo_transverseMercator, d3.geom = {}, d3.geom.hull = function (vertices) {
        function hull(data) {
            if (data.length < 3)return [];
            var i, fx = d3_functor(x), fy = d3_functor(y), n = data.length, points = [], flippedPoints = [];
            for (i = 0; n > i; i++)points.push([+fx.call(this, data[i], i), +fy.call(this, data[i], i), i]);
            for (points.sort(d3_geom_hullOrder), i = 0; n > i; i++)flippedPoints.push([points[i][0], -points[i][1]]);
            var upper = d3_geom_hullUpper(points), lower = d3_geom_hullUpper(flippedPoints), skipLeft = lower[0] === upper[0], skipRight = lower[lower.length - 1] === upper[upper.length - 1], polygon = [];
            for (i = upper.length - 1; i >= 0; --i)polygon.push(data[points[upper[i]][2]]);
            for (i = +skipLeft; i < lower.length - skipRight; ++i)polygon.push(data[points[lower[i]][2]]);
            return polygon
        }

        var x = d3_geom_pointX, y = d3_geom_pointY;
        return arguments.length ? hull(vertices) : (hull.x = function (_) {
            return arguments.length ? (x = _, hull) : x
        }, hull.y = function (_) {
            return arguments.length ? (y = _, hull) : y
        }, hull)
    }, d3.geom.polygon = function (coordinates) {
        return d3_subclass(coordinates, d3_geom_polygonPrototype), coordinates
    };
    var d3_geom_polygonPrototype = d3.geom.polygon.prototype = [];
    d3_geom_polygonPrototype.area = function () {
        for (var a, i = -1, n = this.length, b = this[n - 1], area = 0; ++i < n;)a = b, b = this[i], area += a[1] * b[0] - a[0] * b[1];
        return .5 * area
    }, d3_geom_polygonPrototype.centroid = function (k) {
        var a, c, i = -1, n = this.length, x = 0, y = 0, b = this[n - 1];
        for (arguments.length || (k = -1 / (6 * this.area())); ++i < n;)a = b, b = this[i], c = a[0] * b[1] - b[0] * a[1], x += (a[0] + b[0]) * c, y += (a[1] + b[1]) * c;
        return [x * k, y * k]
    }, d3_geom_polygonPrototype.clip = function (subject) {
        for (var input, j, m, b, c, d, closed = d3_geom_polygonClosed(subject), i = -1, n = this.length - d3_geom_polygonClosed(this), a = this[n - 1]; ++i < n;) {
            for (input = subject.slice(), subject.length = 0, b = this[i], c = input[(m = input.length - closed) - 1], j = -1; ++j < m;)d = input[j], d3_geom_polygonInside(d, a, b) ? (d3_geom_polygonInside(c, a, b) || subject.push(d3_geom_polygonIntersect(c, d, a, b)), subject.push(d)) : d3_geom_polygonInside(c, a, b) && subject.push(d3_geom_polygonIntersect(c, d, a, b)), c = d;
            closed && subject.push(subject[0]), a = b
        }
        return subject
    };
    var d3_geom_voronoiEdges, d3_geom_voronoiCells, d3_geom_voronoiBeaches, d3_geom_voronoiFirstCircle, d3_geom_voronoiCircles, d3_geom_voronoiBeachPool = [], d3_geom_voronoiCirclePool = [];
    d3_geom_voronoiCell.prototype.prepare = function () {
        for (var edge, halfEdges = this.edges, iHalfEdge = halfEdges.length; iHalfEdge--;)edge = halfEdges[iHalfEdge].edge, edge.b && edge.a || halfEdges.splice(iHalfEdge, 1);
        return halfEdges.sort(d3_geom_voronoiHalfEdgeOrder), halfEdges.length
    }, d3_geom_voronoiHalfEdge.prototype = {
        start: function () {
            return this.edge.l === this.site ? this.edge.a : this.edge.b
        }, end: function () {
            return this.edge.l === this.site ? this.edge.b : this.edge.a
        }
    }, d3_geom_voronoiRedBlackTree.prototype = {
        insert: function (after, node) {
            var parent, grandpa, uncle;
            if (after) {
                if (node.P = after, node.N = after.N, after.N && (after.N.P = node), after.N = node, after.R) {
                    for (after = after.R; after.L;)after = after.L;
                    after.L = node
                } else after.R = node;
                parent = after
            } else this._ ? (after = d3_geom_voronoiRedBlackFirst(this._), node.P = null, node.N = after, after.P = after.L = node, parent = after) : (node.P = node.N = null, this._ = node, parent = null);
            for (node.L = node.R = null, node.U = parent, node.C = !0, after = node; parent && parent.C;)grandpa = parent.U, parent === grandpa.L ? (uncle = grandpa.R, uncle && uncle.C ? (parent.C = uncle.C = !1, grandpa.C = !0, after = grandpa) : (after === parent.R && (d3_geom_voronoiRedBlackRotateLeft(this, parent), after = parent, parent = after.U), parent.C = !1, grandpa.C = !0, d3_geom_voronoiRedBlackRotateRight(this, grandpa))) : (uncle = grandpa.L, uncle && uncle.C ? (parent.C = uncle.C = !1, grandpa.C = !0, after = grandpa) : (after === parent.L && (d3_geom_voronoiRedBlackRotateRight(this, parent), after = parent, parent = after.U), parent.C = !1, grandpa.C = !0, d3_geom_voronoiRedBlackRotateLeft(this, grandpa))), parent = after.U;
            this._.C = !1
        }, remove: function (node) {
            node.N && (node.N.P = node.P), node.P && (node.P.N = node.N), node.N = node.P = null;
            var sibling, next, red, parent = node.U, left = node.L, right = node.R;
            if (next = left ? right ? d3_geom_voronoiRedBlackFirst(right) : left : right, parent ? parent.L === node ? parent.L = next : parent.R = next : this._ = next, left && right ? (red = next.C, next.C = node.C, next.L = left, left.U = next, next !== right ? (parent = next.U, next.U = node.U, node = next.R, parent.L = node, next.R = right, right.U = next) : (next.U = parent, parent = next, node = next.R)) : (red = node.C, node = next), node && (node.U = parent), !red) {
                if (node && node.C)return void(node.C = !1);
                do {
                    if (node === this._)break;
                    if (node === parent.L) {
                        if (sibling = parent.R, sibling.C && (sibling.C = !1, parent.C = !0, d3_geom_voronoiRedBlackRotateLeft(this, parent), sibling = parent.R), sibling.L && sibling.L.C || sibling.R && sibling.R.C) {
                            sibling.R && sibling.R.C || (sibling.L.C = !1, sibling.C = !0, d3_geom_voronoiRedBlackRotateRight(this, sibling), sibling = parent.R), sibling.C = parent.C, parent.C = sibling.R.C = !1, d3_geom_voronoiRedBlackRotateLeft(this, parent), node = this._;
                            break
                        }
                    } else if (sibling = parent.L, sibling.C && (sibling.C = !1, parent.C = !0, d3_geom_voronoiRedBlackRotateRight(this, parent), sibling = parent.L), sibling.L && sibling.L.C || sibling.R && sibling.R.C) {
                        sibling.L && sibling.L.C || (sibling.R.C = !1, sibling.C = !0, d3_geom_voronoiRedBlackRotateLeft(this, sibling), sibling = parent.L), sibling.C = parent.C, parent.C = sibling.L.C = !1, d3_geom_voronoiRedBlackRotateRight(this, parent), node = this._;
                        break
                    }
                    sibling.C = !0, node = parent, parent = parent.U
                } while (!node.C);
                node && (node.C = !1)
            }
        }
    }, d3.geom.voronoi = function (points) {
        function voronoi(data) {
            var polygons = new Array(data.length), x0 = clipExtent[0][0], y0 = clipExtent[0][1], x1 = clipExtent[1][0], y1 = clipExtent[1][1];
            return d3_geom_voronoi(sites(data), clipExtent).cells.forEach(function (cell, i) {
                var edges = cell.edges, site = cell.site, polygon = polygons[i] = edges.length ? edges.map(function (e) {
                    var s = e.start();
                    return [s.x, s.y]
                }) : site.x >= x0 && site.x <= x1 && site.y >= y0 && site.y <= y1 ? [[x0, y1], [x1, y1], [x1, y0], [x0, y0]] : [];
                polygon.point = data[i]
            }), polygons
        }

        function sites(data) {
            return data.map(function (d, i) {
                return {x: Math.round(fx(d, i) / ε) * ε, y: Math.round(fy(d, i) / ε) * ε, i: i}
            })
        }

        var x = d3_geom_pointX, y = d3_geom_pointY, fx = x, fy = y, clipExtent = d3_geom_voronoiClipExtent;
        return points ? voronoi(points) : (voronoi.links = function (data) {
            return d3_geom_voronoi(sites(data)).edges.filter(function (edge) {
                return edge.l && edge.r
            }).map(function (edge) {
                return {source: data[edge.l.i], target: data[edge.r.i]}
            })
        }, voronoi.triangles = function (data) {
            var triangles = [];
            return d3_geom_voronoi(sites(data)).cells.forEach(function (cell, i) {
                for (var e0, s0, site = cell.site, edges = cell.edges.sort(d3_geom_voronoiHalfEdgeOrder), j = -1, m = edges.length, e1 = edges[m - 1].edge, s1 = e1.l === site ? e1.r : e1.l; ++j < m;)e0 = e1, s0 = s1, e1 = edges[j].edge, s1 = e1.l === site ? e1.r : e1.l, i < s0.i && i < s1.i && d3_geom_voronoiTriangleArea(site, s0, s1) < 0 && triangles.push([data[i], data[s0.i], data[s1.i]])
            }), triangles
        }, voronoi.x = function (_) {
            return arguments.length ? (fx = d3_functor(x = _), voronoi) : x
        }, voronoi.y = function (_) {
            return arguments.length ? (fy = d3_functor(y = _), voronoi) : y
        }, voronoi.clipExtent = function (_) {
            return arguments.length ? (clipExtent = null == _ ? d3_geom_voronoiClipExtent : _, voronoi) : clipExtent === d3_geom_voronoiClipExtent ? null : clipExtent
        }, voronoi.size = function (_) {
            return arguments.length ? voronoi.clipExtent(_ && [[0, 0], _]) : clipExtent === d3_geom_voronoiClipExtent ? null : clipExtent && clipExtent[1]
        }, voronoi)
    };
    var d3_geom_voronoiClipExtent = [[-1e6, -1e6], [1e6, 1e6]];
    d3.geom.delaunay = function (vertices) {
        return d3.geom.voronoi().triangles(vertices)
    }, d3.geom.quadtree = function (points, x1, y1, x2, y2) {
        function quadtree(data) {
            function insert(n, d, x, y, x1, y1, x2, y2) {
                if (!isNaN(x) && !isNaN(y))if (n.leaf) {
                    var nx = n.x, ny = n.y;
                    if (null != nx)if (abs(nx - x) + abs(ny - y) < .01)insertChild(n, d, x, y, x1, y1, x2, y2); else {
                        var nPoint = n.point;
                        n.x = n.y = n.point = null, insertChild(n, nPoint, nx, ny, x1, y1, x2, y2), insertChild(n, d, x, y, x1, y1, x2, y2)
                    } else n.x = x, n.y = y, n.point = d
                } else insertChild(n, d, x, y, x1, y1, x2, y2)
            }

            function insertChild(n, d, x, y, x1, y1, x2, y2) {
                var xm = .5 * (x1 + x2), ym = .5 * (y1 + y2), right = x >= xm, below = y >= ym, i = below << 1 | right;
                n.leaf = !1, n = n.nodes[i] || (n.nodes[i] = d3_geom_quadtreeNode()), right ? x1 = xm : x2 = xm, below ? y1 = ym : y2 = ym, insert(n, d, x, y, x1, y1, x2, y2)
            }

            var d, xs, ys, i, n, x1_, y1_, x2_, y2_, fx = d3_functor(x), fy = d3_functor(y);
            if (null != x1)x1_ = x1, y1_ = y1, x2_ = x2, y2_ = y2; else if (x2_ = y2_ = -(x1_ = y1_ = 1 / 0), xs = [], ys = [], n = data.length, compat)for (i = 0; n > i; ++i)d = data[i], d.x < x1_ && (x1_ = d.x), d.y < y1_ && (y1_ = d.y), d.x > x2_ && (x2_ = d.x), d.y > y2_ && (y2_ = d.y), xs.push(d.x), ys.push(d.y); else for (i = 0; n > i; ++i) {
                var x_ = +fx(d = data[i], i), y_ = +fy(d, i);
                x1_ > x_ && (x1_ = x_), y1_ > y_ && (y1_ = y_), x_ > x2_ && (x2_ = x_), y_ > y2_ && (y2_ = y_), xs.push(x_), ys.push(y_)
            }
            var dx = x2_ - x1_, dy = y2_ - y1_;
            dx > dy ? y2_ = y1_ + dx : x2_ = x1_ + dy;
            var root = d3_geom_quadtreeNode();
            if (root.add = function (d) {
                    insert(root, d, +fx(d, ++i), +fy(d, i), x1_, y1_, x2_, y2_)
                }, root.visit = function (f) {
                    d3_geom_quadtreeVisit(f, root, x1_, y1_, x2_, y2_)
                }, root.find = function (point) {
                    return d3_geom_quadtreeFind(root, point[0], point[1], x1_, y1_, x2_, y2_)
                }, i = -1, null == x1) {
                for (; ++i < n;)insert(root, data[i], xs[i], ys[i], x1_, y1_, x2_, y2_);
                --i
            } else data.forEach(root.add);
            return xs = ys = data = d = null, root
        }

        var compat, x = d3_geom_pointX, y = d3_geom_pointY;
        return (compat = arguments.length) ? (x = d3_geom_quadtreeCompatX, y = d3_geom_quadtreeCompatY, 3 === compat && (y2 = y1, x2 = x1, y1 = x1 = 0), quadtree(points)) : (quadtree.x = function (_) {
            return arguments.length ? (x = _, quadtree) : x
        }, quadtree.y = function (_) {
            return arguments.length ? (y = _, quadtree) : y
        }, quadtree.extent = function (_) {
            return arguments.length ? (null == _ ? x1 = y1 = x2 = y2 = null : (x1 = +_[0][0], y1 = +_[0][1], x2 = +_[1][0], y2 = +_[1][1]), quadtree) : null == x1 ? null : [[x1, y1], [x2, y2]]
        }, quadtree.size = function (_) {
            return arguments.length ? (null == _ ? x1 = y1 = x2 = y2 = null : (x1 = y1 = 0, x2 = +_[0], y2 = +_[1]), quadtree) : null == x1 ? null : [x2 - x1, y2 - y1]
        }, quadtree)
    }, d3.interpolateRgb = d3_interpolateRgb, d3.interpolateObject = d3_interpolateObject, d3.interpolateNumber = d3_interpolateNumber, d3.interpolateString = d3_interpolateString;
    var d3_interpolate_numberA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, d3_interpolate_numberB = new RegExp(d3_interpolate_numberA.source, "g");
    d3.interpolate = d3_interpolate, d3.interpolators = [function (a, b) {
        var t = typeof b;
        return ("string" === t ? d3_rgb_names.has(b) || /^(#|rgb\(|hsl\()/.test(b) ? d3_interpolateRgb : d3_interpolateString : b instanceof d3_color ? d3_interpolateRgb : Array.isArray(b) ? d3_interpolateArray : "object" === t && isNaN(b) ? d3_interpolateObject : d3_interpolateNumber)(a, b)
    }], d3.interpolateArray = d3_interpolateArray;
    var d3_ease_default = function () {
        return d3_identity
    }, d3_ease = d3.map({
        linear: d3_ease_default, poly: d3_ease_poly, quad: function () {
            return d3_ease_quad
        }, cubic: function () {
            return d3_ease_cubic
        }, sin: function () {
            return d3_ease_sin
        }, exp: function () {
            return d3_ease_exp
        }, circle: function () {
            return d3_ease_circle
        }, elastic: d3_ease_elastic, back: d3_ease_back, bounce: function () {
            return d3_ease_bounce
        }
    }), d3_ease_mode = d3.map({
        "in": d3_identity,
        out: d3_ease_reverse,
        "in-out": d3_ease_reflect,
        "out-in": function (f) {
            return d3_ease_reflect(d3_ease_reverse(f))
        }
    });
    d3.ease = function (name) {
        var i = name.indexOf("-"), t = i >= 0 ? name.slice(0, i) : name, m = i >= 0 ? name.slice(i + 1) : "in";
        return t = d3_ease.get(t) || d3_ease_default, m = d3_ease_mode.get(m) || d3_identity, d3_ease_clamp(m(t.apply(null, d3_arraySlice.call(arguments, 1))))
    }, d3.interpolateHcl = d3_interpolateHcl, d3.interpolateHsl = d3_interpolateHsl, d3.interpolateLab = d3_interpolateLab, d3.interpolateRound = d3_interpolateRound, d3.transform = function (string) {
        var g = d3_document.createElementNS(d3.ns.prefix.svg, "g");
        return (d3.transform = function (string) {
            if (null != string) {
                g.setAttribute("transform", string);
                var t = g.transform.baseVal.consolidate()
            }
            return new d3_transform(t ? t.matrix : d3_transformIdentity)
        })(string)
    }, d3_transform.prototype.toString = function () {
        return "translate(" + this.translate + ")rotate(" + this.rotate + ")skewX(" + this.skew + ")scale(" + this.scale + ")"
    };
    var d3_transformIdentity = {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0};
    d3.interpolateTransform = d3_interpolateTransform, d3.layout = {}, d3.layout.bundle = function () {
        return function (links) {
            for (var paths = [], i = -1, n = links.length; ++i < n;)paths.push(d3_layout_bundlePath(links[i]));
            return paths
        }
    }, d3.layout.chord = function () {
        function relayout() {
            var k, x, x0, i, j, subgroups = {}, groupSums = [], groupIndex = d3.range(n), subgroupIndex = [];
            for (chords = [], groups = [], k = 0, i = -1; ++i < n;) {
                for (x = 0, j = -1; ++j < n;)x += matrix[i][j];
                groupSums.push(x), subgroupIndex.push(d3.range(n)), k += x
            }
            for (sortGroups && groupIndex.sort(function (a, b) {
                return sortGroups(groupSums[a], groupSums[b])
            }), sortSubgroups && subgroupIndex.forEach(function (d, i) {
                d.sort(function (a, b) {
                    return sortSubgroups(matrix[i][a], matrix[i][b])
                })
            }), k = (τ - padding * n) / k, x = 0, i = -1; ++i < n;) {
                for (x0 = x, j = -1; ++j < n;) {
                    var di = groupIndex[i], dj = subgroupIndex[di][j], v = matrix[di][dj], a0 = x, a1 = x += v * k;
                    subgroups[di + "-" + dj] = {index: di, subindex: dj, startAngle: a0, endAngle: a1, value: v}
                }
                groups[di] = {index: di, startAngle: x0, endAngle: x, value: (x - x0) / k}, x += padding
            }
            for (i = -1; ++i < n;)for (j = i - 1; ++j < n;) {
                var source = subgroups[i + "-" + j], target = subgroups[j + "-" + i];
                (source.value || target.value) && chords.push(source.value < target.value ? {
                    source: target,
                    target: source
                } : {source: source, target: target})
            }
            sortChords && resort()
        }

        function resort() {
            chords.sort(function (a, b) {
                return sortChords((a.source.value + a.target.value) / 2, (b.source.value + b.target.value) / 2)
            })
        }

        var chords, groups, matrix, n, sortGroups, sortSubgroups, sortChords, chord = {}, padding = 0;
        return chord.matrix = function (x) {
            return arguments.length ? (n = (matrix = x) && matrix.length, chords = groups = null, chord) : matrix
        }, chord.padding = function (x) {
            return arguments.length ? (padding = x, chords = groups = null, chord) : padding
        }, chord.sortGroups = function (x) {
            return arguments.length ? (sortGroups = x, chords = groups = null, chord) : sortGroups
        }, chord.sortSubgroups = function (x) {
            return arguments.length ? (sortSubgroups = x, chords = null, chord) : sortSubgroups
        }, chord.sortChords = function (x) {
            return arguments.length ? (sortChords = x, chords && resort(), chord) : sortChords
        }, chord.chords = function () {
            return chords || relayout(), chords
        }, chord.groups = function () {
            return groups || relayout(), groups
        }, chord
    }, d3.layout.force = function () {
        function repulse(node) {
            return function (quad, x1, _, x2) {
                if (quad.point !== node) {
                    var dx = quad.cx - node.x, dy = quad.cy - node.y, dw = x2 - x1, dn = dx * dx + dy * dy;
                    if (dn > dw * dw / theta2) {
                        if (chargeDistance2 > dn) {
                            var k = quad.charge / dn;
                            node.px -= dx * k, node.py -= dy * k
                        }
                        return !0
                    }
                    if (quad.point && dn && chargeDistance2 > dn) {
                        var k = quad.pointCharge / dn;
                        node.px -= dx * k, node.py -= dy * k
                    }
                }
                return !quad.charge
            }
        }

        function dragmove(d) {
            d.px = d3.event.x, d.py = d3.event.y, force.resume()
        }

        var drag, alpha, distances, strengths, charges, force = {}, event = d3.dispatch("start", "tick", "end"), size = [1, 1], friction = .9, linkDistance = d3_layout_forceLinkDistance, linkStrength = d3_layout_forceLinkStrength, charge = -30, chargeDistance2 = d3_layout_forceChargeDistance2, gravity = .1, theta2 = .64, nodes = [], links = [];
        return force.tick = function () {
            if ((alpha *= .99) < .005)return event.end({type: "end", alpha: alpha = 0}), !0;
            var q, i, o, s, t, l, k, x, y, n = nodes.length, m = links.length;
            for (i = 0; m > i; ++i)o = links[i], s = o.source, t = o.target, x = t.x - s.x, y = t.y - s.y, (l = x * x + y * y) && (l = alpha * strengths[i] * ((l = Math.sqrt(l)) - distances[i]) / l, x *= l, y *= l, t.x -= x * (k = s.weight / (t.weight + s.weight)), t.y -= y * k, s.x += x * (k = 1 - k), s.y += y * k);
            if ((k = alpha * gravity) && (x = size[0] / 2, y = size[1] / 2, i = -1, k))for (; ++i < n;)o = nodes[i], o.x += (x - o.x) * k, o.y += (y - o.y) * k;
            if (charge)for (d3_layout_forceAccumulate(q = d3.geom.quadtree(nodes), alpha, charges), i = -1; ++i < n;)(o = nodes[i]).fixed || q.visit(repulse(o));
            for (i = -1; ++i < n;)o = nodes[i], o.fixed ? (o.x = o.px, o.y = o.py) : (o.x -= (o.px - (o.px = o.x)) * friction, o.y -= (o.py - (o.py = o.y)) * friction);
            event.tick({type: "tick", alpha: alpha})
        }, force.nodes = function (x) {
            return arguments.length ? (nodes = x, force) : nodes
        }, force.links = function (x) {
            return arguments.length ? (links = x, force) : links
        }, force.size = function (x) {
            return arguments.length ? (size = x, force) : size
        }, force.linkDistance = function (x) {
            return arguments.length ? (linkDistance = "function" == typeof x ? x : +x, force) : linkDistance
        }, force.distance = force.linkDistance, force.linkStrength = function (x) {
            return arguments.length ? (linkStrength = "function" == typeof x ? x : +x, force) : linkStrength
        }, force.friction = function (x) {
            return arguments.length ? (friction = +x, force) : friction
        }, force.charge = function (x) {
            return arguments.length ? (charge = "function" == typeof x ? x : +x, force) : charge
        }, force.chargeDistance = function (x) {
            return arguments.length ? (chargeDistance2 = x * x, force) : Math.sqrt(chargeDistance2)
        }, force.gravity = function (x) {
            return arguments.length ? (gravity = +x, force) : gravity
        }, force.theta = function (x) {
            return arguments.length ? (theta2 = x * x, force) : Math.sqrt(theta2)
        }, force.alpha = function (x) {
            return arguments.length ? (x = +x, alpha ? alpha = x > 0 ? x : 0 : x > 0 && (event.start({
                type: "start",
                alpha: alpha = x
            }), d3.timer(force.tick)), force) : alpha
        }, force.start = function () {
            function position(dimension, size) {
                if (!neighbors) {
                    for (neighbors = new Array(n), j = 0; n > j; ++j)neighbors[j] = [];
                    for (j = 0; m > j; ++j) {
                        var o = links[j];
                        neighbors[o.source.index].push(o.target), neighbors[o.target.index].push(o.source)
                    }
                }
                for (var x, candidates = neighbors[i], j = -1, m = candidates.length; ++j < m;)if (!isNaN(x = candidates[j][dimension]))return x;
                return Math.random() * size
            }

            var i, neighbors, o, n = nodes.length, m = links.length, w = size[0], h = size[1];
            for (i = 0; n > i; ++i)(o = nodes[i]).index = i, o.weight = 0;
            for (i = 0; m > i; ++i)o = links[i], "number" == typeof o.source && (o.source = nodes[o.source]), "number" == typeof o.target && (o.target = nodes[o.target]), ++o.source.weight, ++o.target.weight;
            for (i = 0; n > i; ++i)o = nodes[i], isNaN(o.x) && (o.x = position("x", w)), isNaN(o.y) && (o.y = position("y", h)), isNaN(o.px) && (o.px = o.x), isNaN(o.py) && (o.py = o.y);
            if (distances = [], "function" == typeof linkDistance)for (i = 0; m > i; ++i)distances[i] = +linkDistance.call(this, links[i], i); else for (i = 0; m > i; ++i)distances[i] = linkDistance;
            if (strengths = [], "function" == typeof linkStrength)for (i = 0; m > i; ++i)strengths[i] = +linkStrength.call(this, links[i], i); else for (i = 0; m > i; ++i)strengths[i] = linkStrength;
            if (charges = [], "function" == typeof charge)for (i = 0; n > i; ++i)charges[i] = +charge.call(this, nodes[i], i); else for (i = 0; n > i; ++i)charges[i] = charge;
            return force.resume()
        }, force.resume = function () {
            return force.alpha(.1)
        }, force.stop = function () {
            return force.alpha(0)
        }, force.drag = function () {
            return drag || (drag = d3.behavior.drag().origin(d3_identity).on("dragstart.force", d3_layout_forceDragstart).on("drag.force", dragmove).on("dragend.force", d3_layout_forceDragend)), arguments.length ? void this.on("mouseover.force", d3_layout_forceMouseover).on("mouseout.force", d3_layout_forceMouseout).call(drag) : drag
        }, d3.rebind(force, event, "on")
    };
    var d3_layout_forceLinkDistance = 20, d3_layout_forceLinkStrength = 1, d3_layout_forceChargeDistance2 = 1 / 0;
    d3.layout.hierarchy = function () {
        function hierarchy(root) {
            var node, stack = [root], nodes = [];
            for (root.depth = 0; null != (node = stack.pop());)if (nodes.push(node), (childs = children.call(hierarchy, node, node.depth)) && (n = childs.length)) {
                for (var n, childs, child; --n >= 0;)stack.push(child = childs[n]), child.parent = node, child.depth = node.depth + 1;
                value && (node.value = 0), node.children = childs
            } else value && (node.value = +value.call(hierarchy, node, node.depth) || 0), delete node.children;
            return d3_layout_hierarchyVisitAfter(root, function (node) {
                var childs, parent;
                sort && (childs = node.children) && childs.sort(sort), value && (parent = node.parent) && (parent.value += node.value)
            }), nodes
        }

        var sort = d3_layout_hierarchySort, children = d3_layout_hierarchyChildren, value = d3_layout_hierarchyValue;
        return hierarchy.sort = function (x) {
            return arguments.length ? (sort = x, hierarchy) : sort
        }, hierarchy.children = function (x) {
            return arguments.length ? (children = x, hierarchy) : children
        }, hierarchy.value = function (x) {
            return arguments.length ? (value = x, hierarchy) : value
        }, hierarchy.revalue = function (root) {
            return value && (d3_layout_hierarchyVisitBefore(root, function (node) {
                node.children && (node.value = 0)
            }), d3_layout_hierarchyVisitAfter(root, function (node) {
                var parent;
                node.children || (node.value = +value.call(hierarchy, node, node.depth) || 0), (parent = node.parent) && (parent.value += node.value)
            })), root
        }, hierarchy
    }, d3.layout.partition = function () {
        function position(node, x, dx, dy) {
            var children = node.children;
            if (node.x = x, node.y = node.depth * dy, node.dx = dx, node.dy = dy, children && (n = children.length)) {
                var n, c, d, i = -1;
                for (dx = node.value ? dx / node.value : 0; ++i < n;)position(c = children[i], x, d = c.value * dx, dy), x += d
            }
        }

        function depth(node) {
            var children = node.children, d = 0;
            if (children && (n = children.length))for (var n, i = -1; ++i < n;)d = Math.max(d, depth(children[i]));
            return 1 + d
        }

        function partition(d, i) {
            var nodes = hierarchy.call(this, d, i);
            return position(nodes[0], 0, size[0], size[1] / depth(nodes[0])), nodes
        }

        var hierarchy = d3.layout.hierarchy(), size = [1, 1];
        return partition.size = function (x) {
            return arguments.length ? (size = x, partition) : size
        }, d3_layout_hierarchyRebind(partition, hierarchy)
    }, d3.layout.pie = function () {
        function pie(data) {
            var v, n = data.length, values = data.map(function (d, i) {
                return +value.call(pie, d, i)
            }), a = +("function" == typeof startAngle ? startAngle.apply(this, arguments) : startAngle), da = ("function" == typeof endAngle ? endAngle.apply(this, arguments) : endAngle) - a, p = Math.min(Math.abs(da) / n, +("function" == typeof padAngle ? padAngle.apply(this, arguments) : padAngle)), pa = p * (0 > da ? -1 : 1), k = (da - n * pa) / d3.sum(values), index = d3.range(n), arcs = [];
            return null != sort && index.sort(sort === d3_layout_pieSortByValue ? function (i, j) {
                return values[j] - values[i]
            } : function (i, j) {
                return sort(data[i], data[j])
            }), index.forEach(function (i) {
                arcs[i] = {data: data[i], value: v = values[i], startAngle: a, endAngle: a += v * k + pa, padAngle: p}
            }), arcs
        }

        var value = Number, sort = d3_layout_pieSortByValue, startAngle = 0, endAngle = τ, padAngle = 0;
        return pie.value = function (_) {
            return arguments.length ? (value = _, pie) : value
        }, pie.sort = function (_) {
            return arguments.length ? (sort = _, pie) : sort
        }, pie.startAngle = function (_) {
            return arguments.length ? (startAngle = _, pie) : startAngle
        }, pie.endAngle = function (_) {
            return arguments.length ? (endAngle = _, pie) : endAngle
        }, pie.padAngle = function (_) {
            return arguments.length ? (padAngle = _, pie) : padAngle
        }, pie
    };
    var d3_layout_pieSortByValue = {};
    d3.layout.stack = function () {
        function stack(data, index) {
            if (!(n = data.length))return data;
            var series = data.map(function (d, i) {
                return values.call(stack, d, i)
            }), points = series.map(function (d) {
                return d.map(function (v, i) {
                    return [x.call(stack, v, i), y.call(stack, v, i)]
                })
            }), orders = order.call(stack, points, index);
            series = d3.permute(series, orders), points = d3.permute(points, orders);
            var n, i, j, o, offsets = offset.call(stack, points, index), m = series[0].length;
            for (j = 0; m > j; ++j)for (out.call(stack, series[0][j], o = offsets[j], points[0][j][1]), i = 1; n > i; ++i)out.call(stack, series[i][j], o += points[i - 1][j][1], points[i][j][1]);
            return data
        }

        var values = d3_identity, order = d3_layout_stackOrderDefault, offset = d3_layout_stackOffsetZero, out = d3_layout_stackOut, x = d3_layout_stackX, y = d3_layout_stackY;
        return stack.values = function (x) {
            return arguments.length ? (values = x, stack) : values
        }, stack.order = function (x) {
            return arguments.length ? (order = "function" == typeof x ? x : d3_layout_stackOrders.get(x) || d3_layout_stackOrderDefault, stack) : order
        }, stack.offset = function (x) {
            return arguments.length ? (offset = "function" == typeof x ? x : d3_layout_stackOffsets.get(x) || d3_layout_stackOffsetZero, stack) : offset
        }, stack.x = function (z) {
            return arguments.length ? (x = z, stack) : x
        }, stack.y = function (z) {
            return arguments.length ? (y = z, stack) : y
        }, stack.out = function (z) {
            return arguments.length ? (out = z, stack) : out
        }, stack
    };
    var d3_layout_stackOrders = d3.map({
        "inside-out": function (data) {
            var i, j, n = data.length, max = data.map(d3_layout_stackMaxIndex), sums = data.map(d3_layout_stackReduceSum), index = d3.range(n).sort(function (a, b) {
                return max[a] - max[b]
            }), top = 0, bottom = 0, tops = [], bottoms = [];
            for (i = 0; n > i; ++i)j = index[i], bottom > top ? (top += sums[j], tops.push(j)) : (bottom += sums[j], bottoms.push(j));
            return bottoms.reverse().concat(tops)
        }, reverse: function (data) {
            return d3.range(data.length).reverse()
        }, "default": d3_layout_stackOrderDefault
    }), d3_layout_stackOffsets = d3.map({
        silhouette: function (data) {
            var i, j, o, n = data.length, m = data[0].length, sums = [], max = 0, y0 = [];
            for (j = 0; m > j; ++j) {
                for (i = 0, o = 0; n > i; i++)o += data[i][j][1];
                o > max && (max = o), sums.push(o)
            }
            for (j = 0; m > j; ++j)y0[j] = (max - sums[j]) / 2;
            return y0
        }, wiggle: function (data) {
            var i, j, k, s1, s2, s3, dx, o, o0, n = data.length, x = data[0], m = x.length, y0 = [];
            for (y0[0] = o = o0 = 0, j = 1; m > j; ++j) {
                for (i = 0, s1 = 0; n > i; ++i)s1 += data[i][j][1];
                for (i = 0, s2 = 0, dx = x[j][0] - x[j - 1][0]; n > i; ++i) {
                    for (k = 0, s3 = (data[i][j][1] - data[i][j - 1][1]) / (2 * dx); i > k; ++k)s3 += (data[k][j][1] - data[k][j - 1][1]) / dx;
                    s2 += s3 * data[i][j][1]
                }
                y0[j] = o -= s1 ? s2 / s1 * dx : 0, o0 > o && (o0 = o)
            }
            for (j = 0; m > j; ++j)y0[j] -= o0;
            return y0
        }, expand: function (data) {
            var i, j, o, n = data.length, m = data[0].length, k = 1 / n, y0 = [];
            for (j = 0; m > j; ++j) {
                for (i = 0, o = 0; n > i; i++)o += data[i][j][1];
                if (o)for (i = 0; n > i; i++)data[i][j][1] /= o; else for (i = 0; n > i; i++)data[i][j][1] = k
            }
            for (j = 0; m > j; ++j)y0[j] = 0;
            return y0
        }, zero: d3_layout_stackOffsetZero
    });
    d3.layout.histogram = function () {
        function histogram(data, i) {
            for (var bin, x, bins = [], values = data.map(valuer, this), range = ranger.call(this, values, i), thresholds = binner.call(this, range, values, i), i = -1, n = values.length, m = thresholds.length - 1, k = frequency ? 1 : 1 / n; ++i < m;)bin = bins[i] = [], bin.dx = thresholds[i + 1] - (bin.x = thresholds[i]), bin.y = 0;
            if (m > 0)for (i = -1; ++i < n;)x = values[i], x >= range[0] && x <= range[1] && (bin = bins[d3.bisect(thresholds, x, 1, m) - 1], bin.y += k, bin.push(data[i]));
            return bins
        }

        var frequency = !0, valuer = Number, ranger = d3_layout_histogramRange, binner = d3_layout_histogramBinSturges;
        return histogram.value = function (x) {
            return arguments.length ? (valuer = x, histogram) : valuer
        }, histogram.range = function (x) {
            return arguments.length ? (ranger = d3_functor(x), histogram) : ranger
        }, histogram.bins = function (x) {
            return arguments.length ? (binner = "number" == typeof x ? function (range) {
                return d3_layout_histogramBinFixed(range, x)
            } : d3_functor(x), histogram) : binner
        }, histogram.frequency = function (x) {
            return arguments.length ? (frequency = !!x, histogram) : frequency
        }, histogram
    }, d3.layout.pack = function () {
        function pack(d, i) {
            var nodes = hierarchy.call(this, d, i), root = nodes[0], w = size[0], h = size[1], r = null == radius ? Math.sqrt : "function" == typeof radius ? radius : function () {
                return radius
            };
            if (root.x = root.y = 0, d3_layout_hierarchyVisitAfter(root, function (d) {
                    d.r = +r(d.value)
                }), d3_layout_hierarchyVisitAfter(root, d3_layout_packSiblings), padding) {
                var dr = padding * (radius ? 1 : Math.max(2 * root.r / w, 2 * root.r / h)) / 2;
                d3_layout_hierarchyVisitAfter(root, function (d) {
                    d.r += dr
                }), d3_layout_hierarchyVisitAfter(root, d3_layout_packSiblings), d3_layout_hierarchyVisitAfter(root, function (d) {
                    d.r -= dr
                })
            }
            return d3_layout_packTransform(root, w / 2, h / 2, radius ? 1 : 1 / Math.max(2 * root.r / w, 2 * root.r / h)), nodes
        }

        var radius, hierarchy = d3.layout.hierarchy().sort(d3_layout_packSort), padding = 0, size = [1, 1];
        return pack.size = function (_) {
            return arguments.length ? (size = _, pack) : size
        }, pack.radius = function (_) {
            return arguments.length ? (radius = null == _ || "function" == typeof _ ? _ : +_, pack) : radius
        }, pack.padding = function (_) {
            return arguments.length ? (padding = +_, pack) : padding
        }, d3_layout_hierarchyRebind(pack, hierarchy)
    }, d3.layout.tree = function () {
        function tree(d, i) {
            var nodes = hierarchy.call(this, d, i), root0 = nodes[0], root1 = wrapTree(root0);
            if (d3_layout_hierarchyVisitAfter(root1, firstWalk), root1.parent.m = -root1.z, d3_layout_hierarchyVisitBefore(root1, secondWalk), nodeSize)d3_layout_hierarchyVisitBefore(root0, sizeNode); else {
                var left = root0, right = root0, bottom = root0;
                d3_layout_hierarchyVisitBefore(root0, function (node) {
                    node.x < left.x && (left = node), node.x > right.x && (right = node), node.depth > bottom.depth && (bottom = node)
                });
                var tx = separation(left, right) / 2 - left.x, kx = size[0] / (right.x + separation(right, left) / 2 + tx), ky = size[1] / (bottom.depth || 1);
                d3_layout_hierarchyVisitBefore(root0, function (node) {
                    node.x = (node.x + tx) * kx, node.y = node.depth * ky
                })
            }
            return nodes
        }

        function wrapTree(root0) {
            for (var node1, root1 = {
                A: null,
                children: [root0]
            }, queue = [root1]; null != (node1 = queue.pop());)for (var child, children = node1.children, i = 0, n = children.length; n > i; ++i)queue.push((children[i] = child = {
                _: children[i],
                parent: node1,
                children: (child = children[i].children) && child.slice() || [],
                A: null,
                a: null,
                z: 0,
                m: 0,
                c: 0,
                s: 0,
                t: null,
                i: i
            }).a = child);
            return root1.children[0]
        }

        function firstWalk(v) {
            var children = v.children, siblings = v.parent.children, w = v.i ? siblings[v.i - 1] : null;
            if (children.length) {
                d3_layout_treeShift(v);
                var midpoint = (children[0].z + children[children.length - 1].z) / 2;
                w ? (v.z = w.z + separation(v._, w._), v.m = v.z - midpoint) : v.z = midpoint
            } else w && (v.z = w.z + separation(v._, w._));
            v.parent.A = apportion(v, w, v.parent.A || siblings[0])
        }

        function secondWalk(v) {
            v._.x = v.z + v.parent.m, v.m += v.parent.m
        }

        function apportion(v, w, ancestor) {
            if (w) {
                for (var shift, vip = v, vop = v, vim = w, vom = vip.parent.children[0], sip = vip.m, sop = vop.m, sim = vim.m, som = vom.m; vim = d3_layout_treeRight(vim), vip = d3_layout_treeLeft(vip), vim && vip;)vom = d3_layout_treeLeft(vom), vop = d3_layout_treeRight(vop), vop.a = v, shift = vim.z + sim - vip.z - sip + separation(vim._, vip._), shift > 0 && (d3_layout_treeMove(d3_layout_treeAncestor(vim, v, ancestor), v, shift), sip += shift, sop += shift), sim += vim.m, sip += vip.m, som += vom.m, sop += vop.m;
                vim && !d3_layout_treeRight(vop) && (vop.t = vim, vop.m += sim - sop), vip && !d3_layout_treeLeft(vom) && (vom.t = vip, vom.m += sip - som, ancestor = v)
            }
            return ancestor
        }

        function sizeNode(node) {
            node.x *= size[0], node.y = node.depth * size[1]
        }

        var hierarchy = d3.layout.hierarchy().sort(null).value(null), separation = d3_layout_treeSeparation, size = [1, 1], nodeSize = null;
        return tree.separation = function (x) {
            return arguments.length ? (separation = x, tree) : separation
        }, tree.size = function (x) {
            return arguments.length ? (nodeSize = null == (size = x) ? sizeNode : null, tree) : nodeSize ? null : size
        }, tree.nodeSize = function (x) {
            return arguments.length ? (nodeSize = null == (size = x) ? null : sizeNode, tree) : nodeSize ? size : null
        }, d3_layout_hierarchyRebind(tree, hierarchy)
    }, d3.layout.cluster = function () {
        function cluster(d, i) {
            var previousNode, nodes = hierarchy.call(this, d, i), root = nodes[0], x = 0;
            d3_layout_hierarchyVisitAfter(root, function (node) {
                var children = node.children;
                children && children.length ? (node.x = d3_layout_clusterX(children), node.y = d3_layout_clusterY(children)) : (node.x = previousNode ? x += separation(node, previousNode) : 0, node.y = 0, previousNode = node)
            });
            var left = d3_layout_clusterLeft(root), right = d3_layout_clusterRight(root), x0 = left.x - separation(left, right) / 2, x1 = right.x + separation(right, left) / 2;
            return d3_layout_hierarchyVisitAfter(root, nodeSize ? function (node) {
                node.x = (node.x - root.x) * size[0], node.y = (root.y - node.y) * size[1]
            } : function (node) {
                node.x = (node.x - x0) / (x1 - x0) * size[0], node.y = (1 - (root.y ? node.y / root.y : 1)) * size[1]
            }), nodes
        }

        var hierarchy = d3.layout.hierarchy().sort(null).value(null), separation = d3_layout_treeSeparation, size = [1, 1], nodeSize = !1;
        return cluster.separation = function (x) {
            return arguments.length ? (separation = x, cluster) : separation
        }, cluster.size = function (x) {
            return arguments.length ? (nodeSize = null == (size = x), cluster) : nodeSize ? null : size
        }, cluster.nodeSize = function (x) {
            return arguments.length ? (nodeSize = null != (size = x), cluster) : nodeSize ? size : null
        }, d3_layout_hierarchyRebind(cluster, hierarchy)
    }, d3.layout.treemap = function () {
        function scale(children, k) {
            for (var child, area, i = -1, n = children.length; ++i < n;)area = (child = children[i]).value * (0 > k ? 0 : k), child.area = isNaN(area) || 0 >= area ? 0 : area
        }

        function squarify(node) {
            var children = node.children;
            if (children && children.length) {
                var child, score, n, rect = pad(node), row = [], remaining = children.slice(), best = 1 / 0, u = "slice" === mode ? rect.dx : "dice" === mode ? rect.dy : "slice-dice" === mode ? 1 & node.depth ? rect.dy : rect.dx : Math.min(rect.dx, rect.dy);
                for (scale(remaining, rect.dx * rect.dy / node.value), row.area = 0; (n = remaining.length) > 0;)row.push(child = remaining[n - 1]), row.area += child.area, "squarify" !== mode || (score = worst(row, u)) <= best ? (remaining.pop(), best = score) : (row.area -= row.pop().area, position(row, u, rect, !1), u = Math.min(rect.dx, rect.dy), row.length = row.area = 0, best = 1 / 0);
                row.length && (position(row, u, rect, !0), row.length = row.area = 0), children.forEach(squarify)
            }
        }

        function stickify(node) {
            var children = node.children;
            if (children && children.length) {
                var child, rect = pad(node), remaining = children.slice(), row = [];
                for (scale(remaining, rect.dx * rect.dy / node.value), row.area = 0; child = remaining.pop();)row.push(child), row.area += child.area, null != child.z && (position(row, child.z ? rect.dx : rect.dy, rect, !remaining.length), row.length = row.area = 0);
                children.forEach(stickify)
            }
        }

        function worst(row, u) {
            for (var r, s = row.area, rmax = 0, rmin = 1 / 0, i = -1, n = row.length; ++i < n;)(r = row[i].area) && (rmin > r && (rmin = r), r > rmax && (rmax = r));
            return s *= s, u *= u, s ? Math.max(u * rmax * ratio / s, s / (u * rmin * ratio)) : 1 / 0
        }

        function position(row, u, rect, flush) {
            var o, i = -1, n = row.length, x = rect.x, y = rect.y, v = u ? round(row.area / u) : 0;
            if (u == rect.dx) {
                for ((flush || v > rect.dy) && (v = rect.dy); ++i < n;)o = row[i], o.x = x, o.y = y, o.dy = v, x += o.dx = Math.min(rect.x + rect.dx - x, v ? round(o.area / v) : 0);
                o.z = !0, o.dx += rect.x + rect.dx - x, rect.y += v, rect.dy -= v
            } else {
                for ((flush || v > rect.dx) && (v = rect.dx); ++i < n;)o = row[i], o.x = x, o.y = y, o.dx = v, y += o.dy = Math.min(rect.y + rect.dy - y, v ? round(o.area / v) : 0);
                o.z = !1, o.dy += rect.y + rect.dy - y, rect.x += v, rect.dx -= v
            }
        }

        function treemap(d) {
            var nodes = stickies || hierarchy(d), root = nodes[0];
            return root.x = 0, root.y = 0, root.dx = size[0], root.dy = size[1], stickies && hierarchy.revalue(root), scale([root], root.dx * root.dy / root.value), (stickies ? stickify : squarify)(root), sticky && (stickies = nodes), nodes
        }

        var stickies, hierarchy = d3.layout.hierarchy(), round = Math.round, size = [1, 1], padding = null, pad = d3_layout_treemapPadNull, sticky = !1, mode = "squarify", ratio = .5 * (1 + Math.sqrt(5));
        return treemap.size = function (x) {
            return arguments.length ? (size = x, treemap) : size
        }, treemap.padding = function (x) {
            function padFunction(node) {
                var p = x.call(treemap, node, node.depth);
                return null == p ? d3_layout_treemapPadNull(node) : d3_layout_treemapPad(node, "number" == typeof p ? [p, p, p, p] : p)
            }

            function padConstant(node) {
                return d3_layout_treemapPad(node, x)
            }

            if (!arguments.length)return padding;
            var type;
            return pad = null == (padding = x) ? d3_layout_treemapPadNull : "function" == (type = typeof x) ? padFunction : "number" === type ? (x = [x, x, x, x], padConstant) : padConstant, treemap
        }, treemap.round = function (x) {
            return arguments.length ? (round = x ? Math.round : Number, treemap) : round != Number
        }, treemap.sticky = function (x) {
            return arguments.length ? (sticky = x, stickies = null, treemap) : sticky
        }, treemap.ratio = function (x) {
            return arguments.length ? (ratio = x, treemap) : ratio
        }, treemap.mode = function (x) {
            return arguments.length ? (mode = x + "", treemap) : mode
        }, d3_layout_hierarchyRebind(treemap, hierarchy)
    }, d3.random = {
        normal: function (µ, σ) {
            var n = arguments.length;
            return 2 > n && (σ = 1), 1 > n && (µ = 0), function () {
                var x, y, r;
                do x = 2 * Math.random() - 1, y = 2 * Math.random() - 1, r = x * x + y * y; while (!r || r > 1);
                return µ + σ * x * Math.sqrt(-2 * Math.log(r) / r)
            }
        }, logNormal: function () {
            var random = d3.random.normal.apply(d3, arguments);
            return function () {
                return Math.exp(random())
            }
        }, bates: function (m) {
            var random = d3.random.irwinHall(m);
            return function () {
                return random() / m
            }
        }, irwinHall: function (m) {
            return function () {
                for (var s = 0, j = 0; m > j; j++)s += Math.random();
                return s
            }
        }
    }, d3.scale = {};
    var d3_scale_niceIdentity = {floor: d3_identity, ceil: d3_identity};
    d3.scale.linear = function () {
        return d3_scale_linear([0, 1], [0, 1], d3_interpolate, !1)
    };
    var d3_scale_linearFormatSignificant = {s: 1, g: 1, p: 1, r: 1, e: 1};
    d3.scale.log = function () {
        return d3_scale_log(d3.scale.linear().domain([0, 1]), 10, !0, [1, 10])
    };
    var d3_scale_logFormat = d3.format(".0e"), d3_scale_logNiceNegative = {
        floor: function (x) {
            return -Math.ceil(-x)
        }, ceil: function (x) {
            return -Math.floor(-x)
        }
    };
    d3.scale.pow = function () {
        return d3_scale_pow(d3.scale.linear(), 1, [0, 1])
    }, d3.scale.sqrt = function () {
        return d3.scale.pow().exponent(.5)
    }, d3.scale.ordinal = function () {
        return d3_scale_ordinal([], {t: "range", a: [[]]})
    }, d3.scale.category10 = function () {
        return d3.scale.ordinal().range(d3_category10)
    }, d3.scale.category20 = function () {
        return d3.scale.ordinal().range(d3_category20)
    }, d3.scale.category20b = function () {
        return d3.scale.ordinal().range(d3_category20b)
    }, d3.scale.category20c = function () {
        return d3.scale.ordinal().range(d3_category20c)
    };
    var d3_category10 = [2062260, 16744206, 2924588, 14034728, 9725885, 9197131, 14907330, 8355711, 12369186, 1556175].map(d3_rgbString), d3_category20 = [2062260, 11454440, 16744206, 16759672, 2924588, 10018698, 14034728, 16750742, 9725885, 12955861, 9197131, 12885140, 14907330, 16234194, 8355711, 13092807, 12369186, 14408589, 1556175, 10410725].map(d3_rgbString), d3_category20b = [3750777, 5395619, 7040719, 10264286, 6519097, 9216594, 11915115, 13556636, 9202993, 12426809, 15186514, 15190932, 8666169, 11356490, 14049643, 15177372, 8077683, 10834324, 13528509, 14589654].map(d3_rgbString), d3_category20c = [3244733, 7057110, 10406625, 13032431, 15095053, 16616764, 16625259, 16634018, 3253076, 7652470, 10607003, 13101504, 7695281, 10394312, 12369372, 14342891, 6513507, 9868950, 12434877, 14277081].map(d3_rgbString);
    d3.scale.quantile = function () {
        return d3_scale_quantile([], [])
    }, d3.scale.quantize = function () {
        return d3_scale_quantize(0, 1, [0, 1])
    }, d3.scale.threshold = function () {
        return d3_scale_threshold([.5], [0, 1])
    }, d3.scale.identity = function () {
        return d3_scale_identity([0, 1])
    }, d3.svg = {}, d3.svg.arc = function () {
        function arc() {
            var r0 = Math.max(0, +innerRadius.apply(this, arguments)), r1 = Math.max(0, +outerRadius.apply(this, arguments)), a0 = startAngle.apply(this, arguments) - halfπ, a1 = endAngle.apply(this, arguments) - halfπ, da = Math.abs(a1 - a0), cw = a0 > a1 ? 0 : 1;
            if (r0 > r1 && (rc = r1, r1 = r0, r0 = rc), da >= τε)return circleSegment(r1, cw) + (r0 ? circleSegment(r0, 1 - cw) : "") + "Z";
            var rc, cr, rp, ap, x0, y0, x1, y1, x2, y2, x3, y3, p0 = 0, p1 = 0, path = [];
            if ((ap = (+padAngle.apply(this, arguments) || 0) / 2) && (rp = padRadius === d3_svg_arcAuto ? Math.sqrt(r0 * r0 + r1 * r1) : +padRadius.apply(this, arguments), cw || (p1 *= -1), r1 && (p1 = d3_asin(rp / r1 * Math.sin(ap))), r0 && (p0 = d3_asin(rp / r0 * Math.sin(ap)))), r1) {
                x0 = r1 * Math.cos(a0 + p1), y0 = r1 * Math.sin(a0 + p1), x1 = r1 * Math.cos(a1 - p1), y1 = r1 * Math.sin(a1 - p1);
                var l1 = Math.abs(a1 - a0 - 2 * p1) <= π ? 0 : 1;
                if (p1 && d3_svg_arcSweep(x0, y0, x1, y1) === cw ^ l1) {
                    var h1 = (a0 + a1) / 2;
                    x0 = r1 * Math.cos(h1), y0 = r1 * Math.sin(h1), x1 = y1 = null
                }
            } else x0 = y0 = 0;
            if (r0) {
                x2 = r0 * Math.cos(a1 - p0), y2 = r0 * Math.sin(a1 - p0), x3 = r0 * Math.cos(a0 + p0), y3 = r0 * Math.sin(a0 + p0);
                var l0 = Math.abs(a0 - a1 + 2 * p0) <= π ? 0 : 1;
                if (p0 && d3_svg_arcSweep(x2, y2, x3, y3) === 1 - cw ^ l0) {
                    var h0 = (a0 + a1) / 2;
                    x2 = r0 * Math.cos(h0), y2 = r0 * Math.sin(h0), x3 = y3 = null
                }
            } else x2 = y2 = 0;
            if ((rc = Math.min(Math.abs(r1 - r0) / 2, +cornerRadius.apply(this, arguments))) > .001) {
                cr = r1 > r0 ^ cw ? 0 : 1;
                var oc = null == x3 ? [x2, y2] : null == x1 ? [x0, y0] : d3_geom_polygonIntersect([x0, y0], [x3, y3], [x1, y1], [x2, y2]), ax = x0 - oc[0], ay = y0 - oc[1], bx = x1 - oc[0], by = y1 - oc[1], kc = 1 / Math.sin(Math.acos((ax * bx + ay * by) / (Math.sqrt(ax * ax + ay * ay) * Math.sqrt(bx * bx + by * by))) / 2), lc = Math.sqrt(oc[0] * oc[0] + oc[1] * oc[1]);
                if (null != x1) {
                    var rc1 = Math.min(rc, (r1 - lc) / (kc + 1)), t30 = d3_svg_arcCornerTangents(null == x3 ? [x2, y2] : [x3, y3], [x0, y0], r1, rc1, cw), t12 = d3_svg_arcCornerTangents([x1, y1], [x2, y2], r1, rc1, cw);
                    rc === rc1 ? path.push("M", t30[0], "A", rc1, ",", rc1, " 0 0,", cr, " ", t30[1], "A", r1, ",", r1, " 0 ", 1 - cw ^ d3_svg_arcSweep(t30[1][0], t30[1][1], t12[1][0], t12[1][1]), ",", cw, " ", t12[1], "A", rc1, ",", rc1, " 0 0,", cr, " ", t12[0]) : path.push("M", t30[0], "A", rc1, ",", rc1, " 0 1,", cr, " ", t12[0])
                } else path.push("M", x0, ",", y0);
                if (null != x3) {
                    var rc0 = Math.min(rc, (r0 - lc) / (kc - 1)), t03 = d3_svg_arcCornerTangents([x0, y0], [x3, y3], r0, -rc0, cw), t21 = d3_svg_arcCornerTangents([x2, y2], null == x1 ? [x0, y0] : [x1, y1], r0, -rc0, cw);
                    rc === rc0 ? path.push("L", t21[0], "A", rc0, ",", rc0, " 0 0,", cr, " ", t21[1], "A", r0, ",", r0, " 0 ", cw ^ d3_svg_arcSweep(t21[1][0], t21[1][1], t03[1][0], t03[1][1]), ",", 1 - cw, " ", t03[1], "A", rc0, ",", rc0, " 0 0,", cr, " ", t03[0]) : path.push("L", t21[0], "A", rc0, ",", rc0, " 0 0,", cr, " ", t03[0])
                } else path.push("L", x2, ",", y2)
            } else path.push("M", x0, ",", y0), null != x1 && path.push("A", r1, ",", r1, " 0 ", l1, ",", cw, " ", x1, ",", y1), path.push("L", x2, ",", y2), null != x3 && path.push("A", r0, ",", r0, " 0 ", l0, ",", 1 - cw, " ", x3, ",", y3);
            return path.push("Z"), path.join("")
        }

        function circleSegment(r1, cw) {
            return "M0," + r1 + "A" + r1 + "," + r1 + " 0 1," + cw + " 0," + -r1 + "A" + r1 + "," + r1 + " 0 1," + cw + " 0," + r1
        }

        var innerRadius = d3_svg_arcInnerRadius, outerRadius = d3_svg_arcOuterRadius, cornerRadius = d3_zero, padRadius = d3_svg_arcAuto, startAngle = d3_svg_arcStartAngle, endAngle = d3_svg_arcEndAngle, padAngle = d3_svg_arcPadAngle;
        return arc.innerRadius = function (v) {
            return arguments.length ? (innerRadius = d3_functor(v), arc) : innerRadius
        }, arc.outerRadius = function (v) {
            return arguments.length ? (outerRadius = d3_functor(v), arc) : outerRadius
        }, arc.cornerRadius = function (v) {
            return arguments.length ? (cornerRadius = d3_functor(v), arc) : cornerRadius
        }, arc.padRadius = function (v) {
            return arguments.length ? (padRadius = v == d3_svg_arcAuto ? d3_svg_arcAuto : d3_functor(v), arc) : padRadius
        }, arc.startAngle = function (v) {
            return arguments.length ? (startAngle = d3_functor(v), arc) : startAngle
        }, arc.endAngle = function (v) {
            return arguments.length ? (endAngle = d3_functor(v), arc) : endAngle
        }, arc.padAngle = function (v) {
            return arguments.length ? (padAngle = d3_functor(v), arc) : padAngle
        }, arc.centroid = function () {
            var r = (+innerRadius.apply(this, arguments) + +outerRadius.apply(this, arguments)) / 2, a = (+startAngle.apply(this, arguments) + +endAngle.apply(this, arguments)) / 2 - halfπ;
            return [Math.cos(a) * r, Math.sin(a) * r]
        }, arc
    };
    var d3_svg_arcAuto = "auto";
    d3.svg.line = function () {
        return d3_svg_line(d3_identity)
    };
    var d3_svg_lineInterpolators = d3.map({
        linear: d3_svg_lineLinear,
        "linear-closed": d3_svg_lineLinearClosed,
        step: d3_svg_lineStep,
        "step-before": d3_svg_lineStepBefore,
        "step-after": d3_svg_lineStepAfter,
        basis: d3_svg_lineBasis,
        "basis-open": d3_svg_lineBasisOpen,
        "basis-closed": d3_svg_lineBasisClosed,
        bundle: d3_svg_lineBundle,
        cardinal: d3_svg_lineCardinal,
        "cardinal-open": d3_svg_lineCardinalOpen,
        "cardinal-closed": d3_svg_lineCardinalClosed,
        monotone: d3_svg_lineMonotone
    });
    d3_svg_lineInterpolators.forEach(function (key, value) {
        value.key = key, value.closed = /-closed$/.test(key)
    });
    var d3_svg_lineBasisBezier1 = [0, 2 / 3, 1 / 3, 0], d3_svg_lineBasisBezier2 = [0, 1 / 3, 2 / 3, 0], d3_svg_lineBasisBezier3 = [0, 1 / 6, 2 / 3, 1 / 6];
    d3.svg.line.radial = function () {
        var line = d3_svg_line(d3_svg_lineRadial);
        return line.radius = line.x, delete line.x, line.angle = line.y, delete line.y, line
    }, d3_svg_lineStepBefore.reverse = d3_svg_lineStepAfter, d3_svg_lineStepAfter.reverse = d3_svg_lineStepBefore, d3.svg.area = function () {
        return d3_svg_area(d3_identity)
    }, d3.svg.area.radial = function () {
        var area = d3_svg_area(d3_svg_lineRadial);
        return area.radius = area.x, delete area.x, area.innerRadius = area.x0, delete area.x0, area.outerRadius = area.x1, delete area.x1, area.angle = area.y, delete area.y, area.startAngle = area.y0, delete area.y0, area.endAngle = area.y1, delete area.y1, area
    }, d3.svg.chord = function () {
        function chord(d, i) {
            var s = subgroup(this, source, d, i), t = subgroup(this, target, d, i);
            return "M" + s.p0 + arc(s.r, s.p1, s.a1 - s.a0) + (equals(s, t) ? curve(s.r, s.p1, s.r, s.p0) : curve(s.r, s.p1, t.r, t.p0) + arc(t.r, t.p1, t.a1 - t.a0) + curve(t.r, t.p1, s.r, s.p0)) + "Z"
        }

        function subgroup(self, f, d, i) {
            var subgroup = f.call(self, d, i), r = radius.call(self, subgroup, i), a0 = startAngle.call(self, subgroup, i) - halfπ, a1 = endAngle.call(self, subgroup, i) - halfπ;
            return {
                r: r,
                a0: a0,
                a1: a1,
                p0: [r * Math.cos(a0), r * Math.sin(a0)],
                p1: [r * Math.cos(a1), r * Math.sin(a1)]
            }
        }

        function equals(a, b) {
            return a.a0 == b.a0 && a.a1 == b.a1
        }

        function arc(r, p, a) {
            return "A" + r + "," + r + " 0 " + +(a > π) + ",1 " + p
        }

        function curve(r0, p0, r1, p1) {
            return "Q 0,0 " + p1
        }

        var source = d3_source, target = d3_target, radius = d3_svg_chordRadius, startAngle = d3_svg_arcStartAngle, endAngle = d3_svg_arcEndAngle;
        return chord.radius = function (v) {
            return arguments.length ? (radius = d3_functor(v), chord) : radius
        }, chord.source = function (v) {
            return arguments.length ? (source = d3_functor(v), chord) : source
        }, chord.target = function (v) {
            return arguments.length ? (target = d3_functor(v), chord) : target
        }, chord.startAngle = function (v) {
            return arguments.length ? (startAngle = d3_functor(v), chord) : startAngle
        }, chord.endAngle = function (v) {
            return arguments.length ? (endAngle = d3_functor(v), chord) : endAngle
        }, chord
    }, d3.svg.diagonal = function () {
        function diagonal(d, i) {
            var p0 = source.call(this, d, i), p3 = target.call(this, d, i), m = (p0.y + p3.y) / 2, p = [p0, {
                x: p0.x,
                y: m
            }, {x: p3.x, y: m}, p3];
            return p = p.map(projection), "M" + p[0] + "C" + p[1] + " " + p[2] + " " + p[3]
        }

        var source = d3_source, target = d3_target, projection = d3_svg_diagonalProjection;
        return diagonal.source = function (x) {
            return arguments.length ? (source = d3_functor(x), diagonal) : source
        }, diagonal.target = function (x) {
            return arguments.length ? (target = d3_functor(x), diagonal) : target
        }, diagonal.projection = function (x) {
            return arguments.length ? (projection = x, diagonal) : projection
        }, diagonal
    }, d3.svg.diagonal.radial = function () {
        var diagonal = d3.svg.diagonal(), projection = d3_svg_diagonalProjection, projection_ = diagonal.projection;
        return diagonal.projection = function (x) {
            return arguments.length ? projection_(d3_svg_diagonalRadialProjection(projection = x)) : projection
        }, diagonal
    }, d3.svg.symbol = function () {
        function symbol(d, i) {
            return (d3_svg_symbols.get(type.call(this, d, i)) || d3_svg_symbolCircle)(size.call(this, d, i))
        }

        var type = d3_svg_symbolType, size = d3_svg_symbolSize;
        return symbol.type = function (x) {
            return arguments.length ? (type = d3_functor(x), symbol) : type
        }, symbol.size = function (x) {
            return arguments.length ? (size = d3_functor(x), symbol) : size
        }, symbol
    };
    var d3_svg_symbols = d3.map({
        circle: d3_svg_symbolCircle, cross: function (size) {
            var r = Math.sqrt(size / 5) / 2;
            return "M" + -3 * r + "," + -r + "H" + -r + "V" + -3 * r + "H" + r + "V" + -r + "H" + 3 * r + "V" + r + "H" + r + "V" + 3 * r + "H" + -r + "V" + r + "H" + -3 * r + "Z"
        }, diamond: function (size) {
            var ry = Math.sqrt(size / (2 * d3_svg_symbolTan30)), rx = ry * d3_svg_symbolTan30;
            return "M0," + -ry + "L" + rx + ",0 0," + ry + " " + -rx + ",0Z"
        }, square: function (size) {
            var r = Math.sqrt(size) / 2;
            return "M" + -r + "," + -r + "L" + r + "," + -r + " " + r + "," + r + " " + -r + "," + r + "Z"
        }, "triangle-down": function (size) {
            var rx = Math.sqrt(size / d3_svg_symbolSqrt3), ry = rx * d3_svg_symbolSqrt3 / 2;
            return "M0," + ry + "L" + rx + "," + -ry + " " + -rx + "," + -ry + "Z"
        }, "triangle-up": function (size) {
            var rx = Math.sqrt(size / d3_svg_symbolSqrt3), ry = rx * d3_svg_symbolSqrt3 / 2;
            return "M0," + -ry + "L" + rx + "," + ry + " " + -rx + "," + ry + "Z"
        }
    });
    d3.svg.symbolTypes = d3_svg_symbols.keys();
    var d3_svg_symbolSqrt3 = Math.sqrt(3), d3_svg_symbolTan30 = Math.tan(30 * d3_radians);
    d3_selectionPrototype.transition = function (name) {
        for (var subgroup, node, id = d3_transitionInheritId || ++d3_transitionId, ns = d3_transitionNamespace(name), subgroups = [], transition = d3_transitionInherit || {
                time: Date.now(),
                ease: d3_ease_cubicInOut,
                delay: 0,
                duration: 250
            }, j = -1, m = this.length; ++j < m;) {
            subgroups.push(subgroup = []);
            for (var group = this[j], i = -1, n = group.length; ++i < n;)(node = group[i]) && d3_transitionNode(node, i, ns, id, transition), subgroup.push(node)
        }
        return d3_transition(subgroups, ns, id)
    }, d3_selectionPrototype.interrupt = function (name) {
        return this.each(null == name ? d3_selection_interrupt : d3_selection_interruptNS(d3_transitionNamespace(name)))
    };
    var d3_transitionInheritId, d3_transitionInherit, d3_selection_interrupt = d3_selection_interruptNS(d3_transitionNamespace()), d3_transitionPrototype = [], d3_transitionId = 0;
    d3_transitionPrototype.call = d3_selectionPrototype.call, d3_transitionPrototype.empty = d3_selectionPrototype.empty, d3_transitionPrototype.node = d3_selectionPrototype.node, d3_transitionPrototype.size = d3_selectionPrototype.size, d3.transition = function (selection, name) {
        return selection && selection.transition ? d3_transitionInheritId ? selection.transition(name) : selection : d3_selectionRoot.transition(selection)
    }, d3.transition.prototype = d3_transitionPrototype, d3_transitionPrototype.select = function (selector) {
        var subgroup, subnode, node, id = this.id, ns = this.namespace, subgroups = [];
        selector = d3_selection_selector(selector);
        for (var j = -1, m = this.length; ++j < m;) {
            subgroups.push(subgroup = []);
            for (var group = this[j], i = -1, n = group.length; ++i < n;)(node = group[i]) && (subnode = selector.call(node, node.__data__, i, j)) ? ("__data__"in node && (subnode.__data__ = node.__data__), d3_transitionNode(subnode, i, ns, id, node[ns][id]), subgroup.push(subnode)) : subgroup.push(null)
        }
        return d3_transition(subgroups, ns, id)
    }, d3_transitionPrototype.selectAll = function (selector) {
        var subgroup, subnodes, node, subnode, transition, id = this.id, ns = this.namespace, subgroups = [];
        selector = d3_selection_selectorAll(selector);
        for (var j = -1, m = this.length; ++j < m;)for (var group = this[j], i = -1, n = group.length; ++i < n;)if (node = group[i]) {
            transition = node[ns][id], subnodes = selector.call(node, node.__data__, i, j), subgroups.push(subgroup = []);
            for (var k = -1, o = subnodes.length; ++k < o;)(subnode = subnodes[k]) && d3_transitionNode(subnode, k, ns, id, transition), subgroup.push(subnode)
        }
        return d3_transition(subgroups, ns, id)
    }, d3_transitionPrototype.filter = function (filter) {
        var subgroup, group, node, subgroups = [];
        "function" != typeof filter && (filter = d3_selection_filter(filter));
        for (var j = 0, m = this.length; m > j; j++) {
            subgroups.push(subgroup = []);
            for (var group = this[j], i = 0, n = group.length; n > i; i++)(node = group[i]) && filter.call(node, node.__data__, i, j) && subgroup.push(node)
        }
        return d3_transition(subgroups, this.namespace, this.id)
    }, d3_transitionPrototype.tween = function (name, tween) {
        var id = this.id, ns = this.namespace;
        return arguments.length < 2 ? this.node()[ns][id].tween.get(name) : d3_selection_each(this, null == tween ? function (node) {
            node[ns][id].tween.remove(name)
        } : function (node) {
            node[ns][id].tween.set(name, tween)
        })
    }, d3_transitionPrototype.attr = function (nameNS, value) {
        function attrNull() {
            this.removeAttribute(name)
        }

        function attrNullNS() {
            this.removeAttributeNS(name.space, name.local)
        }

        function attrTween(b) {
            return null == b ? attrNull : (b += "", function () {
                var i, a = this.getAttribute(name);
                return a !== b && (i = interpolate(a, b), function (t) {
                        this.setAttribute(name, i(t))
                    })
            })
        }

        function attrTweenNS(b) {
            return null == b ? attrNullNS : (b += "", function () {
                var i, a = this.getAttributeNS(name.space, name.local);
                return a !== b && (i = interpolate(a, b), function (t) {
                        this.setAttributeNS(name.space, name.local, i(t))
                    })
            })
        }

        if (arguments.length < 2) {
            for (value in nameNS)this.attr(value, nameNS[value]);
            return this
        }
        var interpolate = "transform" == nameNS ? d3_interpolateTransform : d3_interpolate, name = d3.ns.qualify(nameNS);
        return d3_transition_tween(this, "attr." + nameNS, value, name.local ? attrTweenNS : attrTween)
    }, d3_transitionPrototype.attrTween = function (nameNS, tween) {
        function attrTween(d, i) {
            var f = tween.call(this, d, i, this.getAttribute(name));
            return f && function (t) {
                    this.setAttribute(name, f(t))
                }
        }

        function attrTweenNS(d, i) {
            var f = tween.call(this, d, i, this.getAttributeNS(name.space, name.local));
            return f && function (t) {
                    this.setAttributeNS(name.space, name.local, f(t))
                }
        }

        var name = d3.ns.qualify(nameNS);
        return this.tween("attr." + nameNS, name.local ? attrTweenNS : attrTween)
    }, d3_transitionPrototype.style = function (name, value, priority) {
        function styleNull() {
            this.style.removeProperty(name)
        }

        function styleString(b) {
            return null == b ? styleNull : (b += "", function () {
                var i, a = d3_window.getComputedStyle(this, null).getPropertyValue(name);
                return a !== b && (i = d3_interpolate(a, b), function (t) {
                        this.style.setProperty(name, i(t), priority)
                    })
            })
        }

        var n = arguments.length;
        if (3 > n) {
            if ("string" != typeof name) {
                2 > n && (value = "");
                for (priority in name)this.style(priority, name[priority], value);
                return this
            }
            priority = ""
        }
        return d3_transition_tween(this, "style." + name, value, styleString)
    }, d3_transitionPrototype.styleTween = function (name, tween, priority) {
        function styleTween(d, i) {
            var f = tween.call(this, d, i, d3_window.getComputedStyle(this, null).getPropertyValue(name));
            return f && function (t) {
                    this.style.setProperty(name, f(t), priority)
                }
        }

        return arguments.length < 3 && (priority = ""), this.tween("style." + name, styleTween)
    }, d3_transitionPrototype.text = function (value) {
        return d3_transition_tween(this, "text", value, d3_transition_text)
    }, d3_transitionPrototype.remove = function () {
        var ns = this.namespace;
        return this.each("end.transition", function () {
            var p;
            this[ns].count < 2 && (p = this.parentNode) && p.removeChild(this)
        })
    }, d3_transitionPrototype.ease = function (value) {
        var id = this.id, ns = this.namespace;
        return arguments.length < 1 ? this.node()[ns][id].ease : ("function" != typeof value && (value = d3.ease.apply(d3, arguments)), d3_selection_each(this, function (node) {
            node[ns][id].ease = value
        }))
    }, d3_transitionPrototype.delay = function (value) {
        var id = this.id, ns = this.namespace;
        return arguments.length < 1 ? this.node()[ns][id].delay : d3_selection_each(this, "function" == typeof value ? function (node, i, j) {
            node[ns][id].delay = +value.call(node, node.__data__, i, j)
        } : (value = +value, function (node) {
            node[ns][id].delay = value
        }))
    }, d3_transitionPrototype.duration = function (value) {
        var id = this.id, ns = this.namespace;
        return arguments.length < 1 ? this.node()[ns][id].duration : d3_selection_each(this, "function" == typeof value ? function (node, i, j) {
            node[ns][id].duration = Math.max(1, value.call(node, node.__data__, i, j))
        } : (value = Math.max(1, value), function (node) {
            node[ns][id].duration = value
        }))
    }, d3_transitionPrototype.each = function (type, listener) {
        var id = this.id, ns = this.namespace;
        if (arguments.length < 2) {
            var inherit = d3_transitionInherit, inheritId = d3_transitionInheritId;
            try {
                d3_transitionInheritId = id, d3_selection_each(this, function (node, i, j) {
                    d3_transitionInherit = node[ns][id], type.call(node, node.__data__, i, j)
                })
            } finally {
                d3_transitionInherit = inherit, d3_transitionInheritId = inheritId
            }
        } else d3_selection_each(this, function (node) {
            var transition = node[ns][id];
            (transition.event || (transition.event = d3.dispatch("start", "end", "interrupt"))).on(type, listener)
        });
        return this
    }, d3_transitionPrototype.transition = function () {
        for (var subgroup, group, node, transition, id0 = this.id, id1 = ++d3_transitionId, ns = this.namespace, subgroups = [], j = 0, m = this.length; m > j; j++) {
            subgroups.push(subgroup = []);
            for (var group = this[j], i = 0, n = group.length; n > i; i++)(node = group[i]) && (transition = node[ns][id0], d3_transitionNode(node, i, ns, id1, {
                time: transition.time,
                ease: transition.ease,
                delay: transition.delay + transition.duration,
                duration: transition.duration
            })), subgroup.push(node)
        }
        return d3_transition(subgroups, ns, id1)
    }, d3.svg.axis = function () {
        function axis(g) {
            g.each(function () {
                var tickTransform, g = d3.select(this), scale0 = this.__chart__ || scale, scale1 = this.__chart__ = scale.copy(), ticks = null == tickValues ? scale1.ticks ? scale1.ticks.apply(scale1, tickArguments_) : scale1.domain() : tickValues, tickFormat = null == tickFormat_ ? scale1.tickFormat ? scale1.tickFormat.apply(scale1, tickArguments_) : d3_identity : tickFormat_, tick = g.selectAll(".tick").data(ticks, scale1), tickEnter = tick.enter().insert("g", ".domain").attr("class", "tick").style("opacity", ε), tickExit = d3.transition(tick.exit()).style("opacity", ε).remove(), tickUpdate = d3.transition(tick.order()).style("opacity", 1), tickSpacing = Math.max(innerTickSize, 0) + tickPadding, range = d3_scaleRange(scale1), path = g.selectAll(".domain").data([0]), pathUpdate = (path.enter().append("path").attr("class", "domain"), d3.transition(path));
                tickEnter.append("line"), tickEnter.append("text");
                var x1, x2, y1, y2, lineEnter = tickEnter.select("line"), lineUpdate = tickUpdate.select("line"), text = tick.select("text").text(tickFormat), textEnter = tickEnter.select("text"), textUpdate = tickUpdate.select("text"), sign = "top" === orient || "left" === orient ? -1 : 1;
                if ("bottom" === orient || "top" === orient ? (tickTransform = d3_svg_axisX, x1 = "x", y1 = "y", x2 = "x2", y2 = "y2", text.attr("dy", 0 > sign ? "0em" : ".71em").style("text-anchor", "middle"), pathUpdate.attr("d", "M" + range[0] + "," + sign * outerTickSize + "V0H" + range[1] + "V" + sign * outerTickSize)) : (tickTransform = d3_svg_axisY, x1 = "y", y1 = "x", x2 = "y2", y2 = "x2", text.attr("dy", ".32em").style("text-anchor", 0 > sign ? "end" : "start"), pathUpdate.attr("d", "M" + sign * outerTickSize + "," + range[0] + "H0V" + range[1] + "H" + sign * outerTickSize)), lineEnter.attr(y2, sign * innerTickSize), textEnter.attr(y1, sign * tickSpacing), lineUpdate.attr(x2, 0).attr(y2, sign * innerTickSize), textUpdate.attr(x1, 0).attr(y1, sign * tickSpacing), scale1.rangeBand) {
                    var x = scale1, dx = x.rangeBand() / 2;
                    scale0 = scale1 = function (d) {
                        return x(d) + dx
                    }
                } else scale0.rangeBand ? scale0 = scale1 : tickExit.call(tickTransform, scale1, scale0);
                tickEnter.call(tickTransform, scale0, scale1), tickUpdate.call(tickTransform, scale1, scale1)
            })
        }

        var tickFormat_, scale = d3.scale.linear(), orient = d3_svg_axisDefaultOrient, innerTickSize = 6, outerTickSize = 6, tickPadding = 3, tickArguments_ = [10], tickValues = null;
        return axis.scale = function (x) {
            return arguments.length ? (scale = x, axis) : scale
        }, axis.orient = function (x) {
            return arguments.length ? (orient = x in d3_svg_axisOrients ? x + "" : d3_svg_axisDefaultOrient, axis) : orient
        }, axis.ticks = function () {
            return arguments.length ? (tickArguments_ = arguments, axis) : tickArguments_
        }, axis.tickValues = function (x) {
            return arguments.length ? (tickValues = x, axis) : tickValues
        }, axis.tickFormat = function (x) {
            return arguments.length ? (tickFormat_ = x, axis) : tickFormat_
        }, axis.tickSize = function (x) {
            var n = arguments.length;
            return n ? (innerTickSize = +x, outerTickSize = +arguments[n - 1], axis) : innerTickSize
        }, axis.innerTickSize = function (x) {
            return arguments.length ? (innerTickSize = +x, axis) : innerTickSize
        }, axis.outerTickSize = function (x) {
            return arguments.length ? (outerTickSize = +x, axis) : outerTickSize
        }, axis.tickPadding = function (x) {
            return arguments.length ? (tickPadding = +x, axis) : tickPadding
        }, axis.tickSubdivide = function () {
            return arguments.length && axis
        }, axis
    };
    var d3_svg_axisDefaultOrient = "bottom", d3_svg_axisOrients = {top: 1, right: 1, bottom: 1, left: 1};
    d3.svg.brush = function () {
        function brush(g) {
            g.each(function () {
                var g = d3.select(this).style("pointer-events", "all").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)").on("mousedown.brush", brushstart).on("touchstart.brush", brushstart), background = g.selectAll(".background").data([0]);
                background.enter().append("rect").attr("class", "background").style("visibility", "hidden").style("cursor", "crosshair"), g.selectAll(".extent").data([0]).enter().append("rect").attr("class", "extent").style("cursor", "move");
                var resize = g.selectAll(".resize").data(resizes, d3_identity);
                resize.exit().remove(), resize.enter().append("g").attr("class", function (d) {
                    return "resize " + d
                }).style("cursor", function (d) {
                    return d3_svg_brushCursor[d]
                }).append("rect").attr("x", function (d) {
                    return /[ew]$/.test(d) ? -3 : null
                }).attr("y", function (d) {
                    return /^[ns]/.test(d) ? -3 : null
                }).attr("width", 6).attr("height", 6).style("visibility", "hidden"), resize.style("display", brush.empty() ? "none" : null);
                var range, gUpdate = d3.transition(g), backgroundUpdate = d3.transition(background);
                x && (range = d3_scaleRange(x), backgroundUpdate.attr("x", range[0]).attr("width", range[1] - range[0]), redrawX(gUpdate)), y && (range = d3_scaleRange(y), backgroundUpdate.attr("y", range[0]).attr("height", range[1] - range[0]), redrawY(gUpdate)), redraw(gUpdate)
            })
        }

        function redraw(g) {
            g.selectAll(".resize").attr("transform", function (d) {
                return "translate(" + xExtent[+/e$/.test(d)] + "," + yExtent[+/^s/.test(d)] + ")"
            })
        }

        function redrawX(g) {
            g.select(".extent").attr("x", xExtent[0]), g.selectAll(".extent,.n>rect,.s>rect").attr("width", xExtent[1] - xExtent[0])
        }

        function redrawY(g) {
            g.select(".extent").attr("y", yExtent[0]), g.selectAll(".extent,.e>rect,.w>rect").attr("height", yExtent[1] - yExtent[0])
        }

        function brushstart() {
            function keydown() {
                32 == d3.event.keyCode && (dragging || (center = null, origin[0] -= xExtent[1], origin[1] -= yExtent[1], dragging = 2), d3_eventPreventDefault())
            }

            function keyup() {
                32 == d3.event.keyCode && 2 == dragging && (origin[0] += xExtent[1], origin[1] += yExtent[1], dragging = 0, d3_eventPreventDefault())
            }

            function brushmove() {
                var point = d3.mouse(target), moved = !1;
                offset && (point[0] += offset[0], point[1] += offset[1]), dragging || (d3.event.altKey ? (center || (center = [(xExtent[0] + xExtent[1]) / 2, (yExtent[0] + yExtent[1]) / 2]), origin[0] = xExtent[+(point[0] < center[0])], origin[1] = yExtent[+(point[1] < center[1])]) : center = null), resizingX && move1(point, x, 0) && (redrawX(g), moved = !0), resizingY && move1(point, y, 1) && (redrawY(g), moved = !0), moved && (redraw(g), event_({
                    type: "brush",
                    mode: dragging ? "move" : "resize"
                }))
            }

            function move1(point, scale, i) {
                var min, max, range = d3_scaleRange(scale), r0 = range[0], r1 = range[1], position = origin[i], extent = i ? yExtent : xExtent, size = extent[1] - extent[0];
                return dragging && (r0 -= position, r1 -= size + position), min = (i ? yClamp : xClamp) ? Math.max(r0, Math.min(r1, point[i])) : point[i], dragging ? max = (min += position) + size : (center && (position = Math.max(r0, Math.min(r1, 2 * center[i] - min))), min > position ? (max = min, min = position) : max = position), extent[0] != min || extent[1] != max ? (i ? yExtentDomain = null : xExtentDomain = null, extent[0] = min, extent[1] = max, !0) : void 0
            }

            function brushend() {
                brushmove(), g.style("pointer-events", "all").selectAll(".resize").style("display", brush.empty() ? "none" : null), d3.select("body").style("cursor", null), w.on("mousemove.brush", null).on("mouseup.brush", null).on("touchmove.brush", null).on("touchend.brush", null).on("keydown.brush", null).on("keyup.brush", null), dragRestore(), event_({type: "brushend"})
            }

            var center, offset, target = this, eventTarget = d3.select(d3.event.target), event_ = event.of(target, arguments), g = d3.select(target), resizing = eventTarget.datum(), resizingX = !/^(n|s)$/.test(resizing) && x, resizingY = !/^(e|w)$/.test(resizing) && y, dragging = eventTarget.classed("extent"), dragRestore = d3_event_dragSuppress(), origin = d3.mouse(target), w = d3.select(d3_window).on("keydown.brush", keydown).on("keyup.brush", keyup);
            if (d3.event.changedTouches ? w.on("touchmove.brush", brushmove).on("touchend.brush", brushend) : w.on("mousemove.brush", brushmove).on("mouseup.brush", brushend), g.interrupt().selectAll("*").interrupt(), dragging)origin[0] = xExtent[0] - origin[0], origin[1] = yExtent[0] - origin[1]; else if (resizing) {
                var ex = +/w$/.test(resizing), ey = +/^n/.test(resizing);
                offset = [xExtent[1 - ex] - origin[0], yExtent[1 - ey] - origin[1]], origin[0] = xExtent[ex], origin[1] = yExtent[ey]
            } else d3.event.altKey && (center = origin.slice());
            g.style("pointer-events", "none").selectAll(".resize").style("display", null), d3.select("body").style("cursor", eventTarget.style("cursor")), event_({type: "brushstart"}), brushmove()
        }

        var xExtentDomain, yExtentDomain, event = d3_eventDispatch(brush, "brushstart", "brush", "brushend"), x = null, y = null, xExtent = [0, 0], yExtent = [0, 0], xClamp = !0, yClamp = !0, resizes = d3_svg_brushResizes[0];
        return brush.event = function (g) {
            g.each(function () {
                var event_ = event.of(this, arguments), extent1 = {
                    x: xExtent,
                    y: yExtent,
                    i: xExtentDomain,
                    j: yExtentDomain
                }, extent0 = this.__chart__ || extent1;
                this.__chart__ = extent1, d3_transitionInheritId ? d3.select(this).transition().each("start.brush", function () {
                    xExtentDomain = extent0.i, yExtentDomain = extent0.j, xExtent = extent0.x, yExtent = extent0.y, event_({type: "brushstart"})
                }).tween("brush:brush", function () {
                    var xi = d3_interpolateArray(xExtent, extent1.x), yi = d3_interpolateArray(yExtent, extent1.y);
                    return xExtentDomain = yExtentDomain = null, function (t) {
                        xExtent = extent1.x = xi(t), yExtent = extent1.y = yi(t), event_({
                            type: "brush",
                            mode: "resize"
                        })
                    }
                }).each("end.brush", function () {
                    xExtentDomain = extent1.i, yExtentDomain = extent1.j, event_({
                        type: "brush",
                        mode: "resize"
                    }), event_({type: "brushend"})
                }) : (event_({type: "brushstart"}), event_({type: "brush", mode: "resize"}), event_({type: "brushend"}))
            })
        }, brush.x = function (z) {
            return arguments.length ? (x = z, resizes = d3_svg_brushResizes[!x << 1 | !y], brush) : x
        }, brush.y = function (z) {
            return arguments.length ? (y = z, resizes = d3_svg_brushResizes[!x << 1 | !y], brush) : y
        }, brush.clamp = function (z) {
            return arguments.length ? (x && y ? (xClamp = !!z[0], yClamp = !!z[1]) : x ? xClamp = !!z : y && (yClamp = !!z), brush) : x && y ? [xClamp, yClamp] : x ? xClamp : y ? yClamp : null
        }, brush.extent = function (z) {
            var x0, x1, y0, y1, t;
            return arguments.length ? (x && (x0 = z[0], x1 = z[1], y && (x0 = x0[0], x1 = x1[0]), xExtentDomain = [x0, x1], x.invert && (x0 = x(x0), x1 = x(x1)), x0 > x1 && (t = x0, x0 = x1, x1 = t), (x0 != xExtent[0] || x1 != xExtent[1]) && (xExtent = [x0, x1])), y && (y0 = z[0], y1 = z[1], x && (y0 = y0[1], y1 = y1[1]), yExtentDomain = [y0, y1], y.invert && (y0 = y(y0), y1 = y(y1)), y0 > y1 && (t = y0, y0 = y1, y1 = t), (y0 != yExtent[0] || y1 != yExtent[1]) && (yExtent = [y0, y1])), brush) : (x && (xExtentDomain ? (x0 = xExtentDomain[0], x1 = xExtentDomain[1]) : (x0 = xExtent[0], x1 = xExtent[1], x.invert && (x0 = x.invert(x0), x1 = x.invert(x1)), x0 > x1 && (t = x0, x0 = x1, x1 = t))), y && (yExtentDomain ? (y0 = yExtentDomain[0], y1 = yExtentDomain[1]) : (y0 = yExtent[0], y1 = yExtent[1], y.invert && (y0 = y.invert(y0), y1 = y.invert(y1)), y0 > y1 && (t = y0, y0 = y1, y1 = t))), x && y ? [[x0, y0], [x1, y1]] : x ? [x0, x1] : y && [y0, y1])
        }, brush.clear = function () {
            return brush.empty() || (xExtent = [0, 0], yExtent = [0, 0], xExtentDomain = yExtentDomain = null), brush
        }, brush.empty = function () {
            return !!x && xExtent[0] == xExtent[1] || !!y && yExtent[0] == yExtent[1]
        }, d3.rebind(brush, event, "on")
    };
    var d3_svg_brushCursor = {
        n: "ns-resize",
        e: "ew-resize",
        s: "ns-resize",
        w: "ew-resize",
        nw: "nwse-resize",
        ne: "nesw-resize",
        se: "nwse-resize",
        sw: "nesw-resize"
    }, d3_svg_brushResizes = [["n", "e", "s", "w", "nw", "ne", "se", "sw"], ["e", "w"], ["n", "s"], []], d3_time_format = d3_time.format = d3_locale_enUS.timeFormat, d3_time_formatUtc = d3_time_format.utc, d3_time_formatIso = d3_time_formatUtc("%Y-%m-%dT%H:%M:%S.%LZ");
    d3_time_format.iso = Date.prototype.toISOString && +new Date("2000-01-01T00:00:00.000Z") ? d3_time_formatIsoNative : d3_time_formatIso, d3_time_formatIsoNative.parse = function (string) {
        var date = new Date(string);
        return isNaN(date) ? null : date
    }, d3_time_formatIsoNative.toString = d3_time_formatIso.toString, d3_time.second = d3_time_interval(function (date) {
        return new d3_date(1e3 * Math.floor(date / 1e3))
    }, function (date, offset) {
        date.setTime(date.getTime() + 1e3 * Math.floor(offset))
    }, function (date) {
        return date.getSeconds()
    }), d3_time.seconds = d3_time.second.range, d3_time.seconds.utc = d3_time.second.utc.range, d3_time.minute = d3_time_interval(function (date) {
        return new d3_date(6e4 * Math.floor(date / 6e4))
    }, function (date, offset) {
        date.setTime(date.getTime() + 6e4 * Math.floor(offset))
    }, function (date) {
        return date.getMinutes()
    }), d3_time.minutes = d3_time.minute.range, d3_time.minutes.utc = d3_time.minute.utc.range, d3_time.hour = d3_time_interval(function (date) {
        var timezone = date.getTimezoneOffset() / 60;
        return new d3_date(36e5 * (Math.floor(date / 36e5 - timezone) + timezone))
    }, function (date, offset) {
        date.setTime(date.getTime() + 36e5 * Math.floor(offset))
    }, function (date) {
        return date.getHours()
    }), d3_time.hours = d3_time.hour.range, d3_time.hours.utc = d3_time.hour.utc.range, d3_time.month = d3_time_interval(function (date) {
        return date = d3_time.day(date), date.setDate(1), date
    }, function (date, offset) {
        date.setMonth(date.getMonth() + offset)
    }, function (date) {
        return date.getMonth()
    }), d3_time.months = d3_time.month.range, d3_time.months.utc = d3_time.month.utc.range;
    var d3_time_scaleSteps = [1e3, 5e3, 15e3, 3e4, 6e4, 3e5, 9e5, 18e5, 36e5, 108e5, 216e5, 432e5, 864e5, 1728e5, 6048e5, 2592e6, 7776e6, 31536e6], d3_time_scaleLocalMethods = [[d3_time.second, 1], [d3_time.second, 5], [d3_time.second, 15], [d3_time.second, 30], [d3_time.minute, 1], [d3_time.minute, 5], [d3_time.minute, 15], [d3_time.minute, 30], [d3_time.hour, 1], [d3_time.hour, 3], [d3_time.hour, 6], [d3_time.hour, 12], [d3_time.day, 1], [d3_time.day, 2], [d3_time.week, 1], [d3_time.month, 1], [d3_time.month, 3], [d3_time.year, 1]], d3_time_scaleLocalFormat = d3_time_format.multi([[".%L", function (d) {
        return d.getMilliseconds()
    }], [":%S", function (d) {
        return d.getSeconds()
    }], ["%I:%M", function (d) {
        return d.getMinutes()
    }], ["%I %p", function (d) {
        return d.getHours()
    }], ["%a %d", function (d) {
        return d.getDay() && 1 != d.getDate()
    }], ["%b %d", function (d) {
        return 1 != d.getDate()
    }], ["%B", function (d) {
        return d.getMonth()
    }], ["%Y", d3_true]]), d3_time_scaleMilliseconds = {
        range: function (start, stop, step) {
            return d3.range(Math.ceil(start / step) * step, +stop, step).map(d3_time_scaleDate)
        }, floor: d3_identity, ceil: d3_identity
    };
    d3_time_scaleLocalMethods.year = d3_time.year, d3_time.scale = function () {
        return d3_time_scale(d3.scale.linear(), d3_time_scaleLocalMethods, d3_time_scaleLocalFormat)
    };
    var d3_time_scaleUtcMethods = d3_time_scaleLocalMethods.map(function (m) {
        return [m[0].utc, m[1]]
    }), d3_time_scaleUtcFormat = d3_time_formatUtc.multi([[".%L", function (d) {
        return d.getUTCMilliseconds()
    }], [":%S", function (d) {
        return d.getUTCSeconds()
    }], ["%I:%M", function (d) {
        return d.getUTCMinutes()
    }], ["%I %p", function (d) {
        return d.getUTCHours()
    }], ["%a %d", function (d) {
        return d.getUTCDay() && 1 != d.getUTCDate()
    }], ["%b %d", function (d) {
        return 1 != d.getUTCDate()
    }], ["%B", function (d) {
        return d.getUTCMonth()
    }], ["%Y", d3_true]]);
    d3_time_scaleUtcMethods.year = d3_time.year.utc, d3_time.scale.utc = function () {
        return d3_time_scale(d3.scale.linear(), d3_time_scaleUtcMethods, d3_time_scaleUtcFormat)
    }, d3.text = d3_xhrType(function (request) {
        return request.responseText
    }), d3.json = function (url, callback) {
        return d3_xhr(url, "application/json", d3_json, callback)
    }, d3.html = function (url, callback) {
        return d3_xhr(url, "text/html", d3_html, callback)
    }, d3.xml = d3_xhrType(function (request) {
        return request.responseXML
    }), "function" == typeof define && define.amd ? define("d3/d3", d3) : "object" == typeof module && module.exports && (module.exports = d3), this.d3 = d3
}(), define("famous/surfaces/ContainerSurface", ["require", "exports", "module", "../core/Surface", "../core/Context"], function (require, exports, module) {
    function ContainerSurface(options) {
        Surface.call(this, options), this._container = document.createElement("div"), this._container.classList.add("famous-group"), this._container.classList.add("famous-container-group"), this._shouldRecalculateSize = !1, this.context = new Context(this._container), this.setContent(this._container)
    }

    var Surface = require("../core/Surface"), Context = require("../core/Context");
    ContainerSurface.prototype = Object.create(Surface.prototype), ContainerSurface.prototype.constructor = ContainerSurface, ContainerSurface.prototype.elementType = "div", ContainerSurface.prototype.elementClass = "famous-surface", ContainerSurface.prototype.add = function () {
        return this.context.add.apply(this.context, arguments)
    }, ContainerSurface.prototype.render = function () {
        return this._sizeDirty && (this._shouldRecalculateSize = !0), Surface.prototype.render.apply(this, arguments)
    }, ContainerSurface.prototype.deploy = function () {
        return this._shouldRecalculateSize = !0, Surface.prototype.deploy.apply(this, arguments)
    }, ContainerSurface.prototype.commit = function () {
        var previousSize = this._size ? [this._size[0], this._size[1]] : null, result = Surface.prototype.commit.apply(this, arguments);
        return (this._shouldRecalculateSize || previousSize && (this._size[0] !== previousSize[0] || this._size[1] !== previousSize[1])) && (this.context.setSize(), this._shouldRecalculateSize = !1), this.context.update(), result
    }, module.exports = ContainerSurface
}), define("famous/physics/PhysicsEngine", ["require", "exports", "module", "../core/EventHandler"], function (require, exports, module) {
    function PhysicsEngine(options) {
        this.options = Object.create(PhysicsEngine.DEFAULT_OPTIONS), options && this.setOptions(options), this._particles = [], this._bodies = [], this._agentData = {}, this._forces = [], this._constraints = [], this._buffer = 0, this._prevTime = now(), this._isSleeping = !1, this._eventHandler = null, this._currAgentId = 0, this._hasBodies = !1, this._eventHandler = null
    }

    function _mapAgentArray(agent) {
        return agent.applyForce ? this._forces : agent.applyConstraint ? this._constraints : void 0
    }

    function _attachOne(agent, targets, source) {
        return void 0 === targets && (targets = this.getParticlesAndBodies()), targets instanceof Array || (targets = [targets]), agent.on("change", this.wake.bind(this)), this._agentData[this._currAgentId] = {
            agent: agent,
            id: this._currAgentId,
            targets: targets,
            source: source
        }, _mapAgentArray.call(this, agent).push(this._currAgentId), this._currAgentId++
    }

    function _getAgentData(id) {
        return this._agentData[id]
    }

    function _updateForce(index) {
        var boundAgent = _getAgentData.call(this, this._forces[index]);
        boundAgent.agent.applyForce(boundAgent.targets, boundAgent.source)
    }

    function _updateForces() {
        for (var index = this._forces.length - 1; index > -1; index--)_updateForce.call(this, index)
    }

    function _updateConstraint(index, dt) {
        var boundAgent = this._agentData[this._constraints[index]];
        return boundAgent.agent.applyConstraint(boundAgent.targets, boundAgent.source, dt)
    }

    function _updateConstraints(dt) {
        for (var iteration = 0; iteration < this.options.constraintSteps;) {
            for (var index = this._constraints.length - 1; index > -1; index--)_updateConstraint.call(this, index, dt);
            iteration++
        }
    }

    function _updateVelocities(body, dt) {
        body.integrateVelocity(dt), this.options.velocityCap && body.velocity.cap(this.options.velocityCap).put(body.velocity)
    }

    function _updateAngularVelocities(body, dt) {
        body.integrateAngularMomentum(dt), body.updateAngularVelocity(), this.options.angularVelocityCap && body.angularVelocity.cap(this.options.angularVelocityCap).put(body.angularVelocity)
    }

    function _updateOrientations(body, dt) {
        body.integrateOrientation(dt)
    }

    function _updatePositions(body, dt) {
        body.integratePosition(dt), body.emit(_events.update, body)
    }

    function _integrate(dt) {
        _updateForces.call(this, dt), this.forEach(_updateVelocities, dt), this.forEachBody(_updateAngularVelocities, dt), _updateConstraints.call(this, dt), this.forEachBody(_updateOrientations, dt), this.forEach(_updatePositions, dt)
    }

    function _getParticlesEnergy() {
        var energy = 0, particleEnergy = 0;
        return this.forEach(function (particle) {
            particleEnergy = particle.getEnergy(), energy += particleEnergy
        }), energy
    }

    function _getAgentsEnergy() {
        var energy = 0;
        for (var id in this._agentData)energy += this.getAgentEnergy(id);
        return energy
    }

    var EventHandler = require("../core/EventHandler"), TIMESTEP = 17, MIN_TIME_STEP = 1e3 / 120, MAX_TIME_STEP = 17, now = Date.now, _events = {
        start: "start",
        update: "update",
        end: "end"
    };
    PhysicsEngine.DEFAULT_OPTIONS = {
        constraintSteps: 1,
        sleepTolerance: 1e-7,
        velocityCap: void 0,
        angularVelocityCap: void 0
    }, PhysicsEngine.prototype.setOptions = function (opts) {
        for (var key in opts)this.options[key] && (this.options[key] = opts[key])
    }, PhysicsEngine.prototype.addBody = function (body) {
        return body._engine = this, body.isBody ? (this._bodies.push(body), this._hasBodies = !0) : this._particles.push(body), body.on("start", this.wake.bind(this)), body
    }, PhysicsEngine.prototype.removeBody = function (body) {
        var array = body.isBody ? this._bodies : this._particles, index = array.indexOf(body);
        if (index > -1) {
            for (var agentKey in this._agentData)this._agentData.hasOwnProperty(agentKey) && this.detachFrom(this._agentData[agentKey].id, body);
            array.splice(index, 1)
        }
        0 === this.getBodies().length && (this._hasBodies = !1)
    }, PhysicsEngine.prototype.attach = function (agents, targets, source) {
        if (this.wake(), agents instanceof Array) {
            for (var agentIDs = [], i = 0; i < agents.length; i++)agentIDs[i] = _attachOne.call(this, agents[i], targets, source);
            return agentIDs
        }
        return _attachOne.call(this, agents, targets, source)
    }, PhysicsEngine.prototype.attachTo = function (agentID, target) {
        _getAgentData.call(this, agentID).targets.push(target)
    }, PhysicsEngine.prototype.detach = function (id) {
        var agent = this.getAgent(id), agentArray = _mapAgentArray.call(this, agent), index = agentArray.indexOf(id);
        agentArray.splice(index, 1), delete this._agentData[id]
    }, PhysicsEngine.prototype.detachFrom = function (id, target) {
        var boundAgent = _getAgentData.call(this, id);
        if (boundAgent.source === target)this.detach(id); else {
            var targets = boundAgent.targets, index = targets.indexOf(target);
            index > -1 && targets.splice(index, 1)
        }
    }, PhysicsEngine.prototype.detachAll = function () {
        this._agentData = {}, this._forces = [], this._constraints = [], this._currAgentId = 0
    }, PhysicsEngine.prototype.getAgent = function (id) {
        return _getAgentData.call(this, id).agent
    }, PhysicsEngine.prototype.getParticles = function () {
        return this._particles
    }, PhysicsEngine.prototype.getBodies = function () {
        return this._bodies
    }, PhysicsEngine.prototype.getParticlesAndBodies = function () {
        return this.getParticles().concat(this.getBodies())
    }, PhysicsEngine.prototype.forEachParticle = function (fn, dt) {
        for (var particles = this.getParticles(), index = 0, len = particles.length; len > index; index++)fn.call(this, particles[index], dt)
    }, PhysicsEngine.prototype.forEachBody = function (fn, dt) {
        if (this._hasBodies)for (var bodies = this.getBodies(), index = 0, len = bodies.length; len > index; index++)fn.call(this, bodies[index], dt)
    }, PhysicsEngine.prototype.forEach = function (fn, dt) {
        this.forEachParticle(fn, dt), this.forEachBody(fn, dt)
    }, PhysicsEngine.prototype.getAgentEnergy = function (agentId) {
        var agentData = _getAgentData.call(this, agentId);
        return agentData.agent.getEnergy(agentData.targets, agentData.source)
    }, PhysicsEngine.prototype.getEnergy = function () {
        return _getParticlesEnergy.call(this) + _getAgentsEnergy.call(this)
    }, PhysicsEngine.prototype.step = function () {
        if (!this.isSleeping()) {
            var currTime = now(), dtFrame = currTime - this._prevTime;
            this._prevTime = currTime, MIN_TIME_STEP > dtFrame || (dtFrame > MAX_TIME_STEP && (dtFrame = MAX_TIME_STEP), _integrate.call(this, TIMESTEP), this.emit(_events.update, this), this.getEnergy() < this.options.sleepTolerance && this.sleep())
        }
    }, PhysicsEngine.prototype.isSleeping = function () {
        return this._isSleeping
    }, PhysicsEngine.prototype.isActive = function () {
        return !this._isSleeping
    }, PhysicsEngine.prototype.sleep = function () {
        this._isSleeping || (this.forEach(function (body) {
            body.sleep()
        }), this.emit(_events.end, this), this._isSleeping = !0)
    }, PhysicsEngine.prototype.wake = function () {
        this._isSleeping && (this._prevTime = now(), this.emit(_events.start, this), this._isSleeping = !1)
    }, PhysicsEngine.prototype.emit = function (type, data) {
        null !== this._eventHandler && this._eventHandler.emit(type, data)
    }, PhysicsEngine.prototype.on = function (event, fn) {
        null === this._eventHandler && (this._eventHandler = new EventHandler), this._eventHandler.on(event, fn)
    }, module.exports = PhysicsEngine
}), define("famous/math/Vector", ["require", "exports", "module"], function (require, exports, module) {
    function Vector(x, y, z) {
        return 1 === arguments.length && void 0 !== x ? this.set(x) : (this.x = x || 0, this.y = y || 0, this.z = z || 0), this
    }

    function _setXYZ(x, y, z) {
        return this.x = x, this.y = y, this.z = z, this
    }

    function _setFromArray(v) {
        return _setXYZ.call(this, v[0], v[1], v[2] || 0)
    }

    function _setFromVector(v) {
        return _setXYZ.call(this, v.x, v.y, v.z)
    }

    function _setFromNumber(x) {
        return _setXYZ.call(this, x, 0, 0)
    }

    var _register = new Vector(0, 0, 0);
    Vector.prototype.add = function (v) {
        return _setXYZ.call(_register, this.x + v.x, this.y + v.y, this.z + v.z)
    }, Vector.prototype.sub = function (v) {
        return _setXYZ.call(_register, this.x - v.x, this.y - v.y, this.z - v.z)
    }, Vector.prototype.mult = function (r) {
        return _setXYZ.call(_register, r * this.x, r * this.y, r * this.z)
    }, Vector.prototype.div = function (r) {
        return this.mult(1 / r)
    }, Vector.prototype.cross = function (v) {
        var x = this.x, y = this.y, z = this.z, vx = v.x, vy = v.y, vz = v.z;
        return _setXYZ.call(_register, z * vy - y * vz, x * vz - z * vx, y * vx - x * vy)
    }, Vector.prototype.equals = function (v) {
        return v.x === this.x && v.y === this.y && v.z === this.z
    }, Vector.prototype.rotateX = function (theta) {
        var x = this.x, y = this.y, z = this.z, cosTheta = Math.cos(theta), sinTheta = Math.sin(theta);
        return _setXYZ.call(_register, x, y * cosTheta - z * sinTheta, y * sinTheta + z * cosTheta)
    }, Vector.prototype.rotateY = function (theta) {
        var x = this.x, y = this.y, z = this.z, cosTheta = Math.cos(theta), sinTheta = Math.sin(theta);
        return _setXYZ.call(_register, z * sinTheta + x * cosTheta, y, z * cosTheta - x * sinTheta)
    }, Vector.prototype.rotateZ = function (theta) {
        var x = this.x, y = this.y, z = this.z, cosTheta = Math.cos(theta), sinTheta = Math.sin(theta);
        return _setXYZ.call(_register, x * cosTheta - y * sinTheta, x * sinTheta + y * cosTheta, z)
    }, Vector.prototype.dot = function (v) {
        return this.x * v.x + this.y * v.y + this.z * v.z
    }, Vector.prototype.normSquared = function () {
        return this.dot(this)
    }, Vector.prototype.norm = function () {
        return Math.sqrt(this.normSquared())
    }, Vector.prototype.normalize = function (length) {
        0 === arguments.length && (length = 1);
        var norm = this.norm();
        return norm > 1e-7 ? _setFromVector.call(_register, this.mult(length / norm)) : _setXYZ.call(_register, length, 0, 0)
    }, Vector.prototype.clone = function () {
        return new Vector(this)
    }, Vector.prototype.isZero = function () {
        return !(this.x || this.y || this.z)
    }, Vector.prototype.set = function (v) {
        return v instanceof Array ? _setFromArray.call(this, v) : "number" == typeof v ? _setFromNumber.call(this, v) : _setFromVector.call(this, v)
    }, Vector.prototype.setXYZ = function () {
        return _setXYZ.apply(this, arguments)
    }, Vector.prototype.set1D = function (x) {
        return _setFromNumber.call(this, x)
    }, Vector.prototype.put = function (v) {
        this === _register ? _setFromVector.call(v, _register) : _setFromVector.call(v, this)
    }, Vector.prototype.clear = function () {
        return _setXYZ.call(this, 0, 0, 0)
    }, Vector.prototype.cap = function cap(cap) {
        if (1 / 0 === cap)return _setFromVector.call(_register, this);
        var norm = this.norm();
        return norm > cap ? _setFromVector.call(_register, this.mult(cap / norm)) : _setFromVector.call(_register, this)
    }, Vector.prototype.project = function (n) {
        return n.mult(this.dot(n))
    }, Vector.prototype.reflectAcross = function (n) {
        return n.normalize().put(n), _setFromVector(_register, this.sub(this.project(n).mult(2)))
    }, Vector.prototype.get = function () {
        return [this.x, this.y, this.z]
    }, Vector.prototype.get1D = function () {
        return this.x
    }, module.exports = Vector
}), define("famous/physics/integrators/SymplecticEuler", ["require", "exports", "module"], function (require, exports, module) {
    var SymplecticEuler = {};
    SymplecticEuler.integrateVelocity = function (body, dt) {
        var v = body.velocity, w = body.inverseMass, f = body.force;
        f.isZero() || (v.add(f.mult(dt * w)).put(v), f.clear())
    }, SymplecticEuler.integratePosition = function (body, dt) {
        var p = body.position, v = body.velocity;
        p.add(v.mult(dt)).put(p)
    }, SymplecticEuler.integrateAngularMomentum = function (body, dt) {
        var L = body.angularMomentum, t = body.torque;
        t.isZero() || (L.add(t.mult(dt)).put(L), t.clear())
    }, SymplecticEuler.integrateOrientation = function (body, dt) {
        var q = body.orientation, w = body.angularVelocity;
        w.isZero() || q.add(q.multiply(w).scalarMultiply(.5 * dt)).put(q)
    }, module.exports = SymplecticEuler
}), define("famous/physics/bodies/Particle", ["require", "exports", "module", "../../math/Vector", "../../core/Transform", "../../core/EventHandler", "../integrators/SymplecticEuler"], function (require, exports, module) {
    function Particle(options) {
        options = options || {};
        var defaults = Particle.DEFAULT_OPTIONS;
        this.position = new Vector, this.velocity = new Vector, this.force = new Vector, this._engine = null, this._isSleeping = !0, this._eventOutput = null, this.mass = void 0 !== options.mass ? options.mass : defaults.mass, this.inverseMass = 1 / this.mass, this.setPosition(options.position || defaults.position), this.setVelocity(options.velocity || defaults.velocity), this.force.set(options.force || [0, 0, 0]), this.transform = Transform.identity.slice(), this._spec = {
            size: [!0, !0],
            target: {transform: this.transform, origin: [.5, .5], target: null}
        }
    }

    function _createEventOutput() {
        this._eventOutput = new EventHandler, this._eventOutput.bindThis(this), EventHandler.setOutputHandler(this, this._eventOutput)
    }

    var Vector = require("../../math/Vector"), Transform = require("../../core/Transform"), EventHandler = require("../../core/EventHandler"), Integrator = require("../integrators/SymplecticEuler");
    Particle.DEFAULT_OPTIONS = {position: [0, 0, 0], velocity: [0, 0, 0], mass: 1};
    var _events = {start: "start", update: "update", end: "end"}, now = Date.now;
    Particle.prototype.isBody = !1, Particle.prototype.isActive = function () {
        return !this._isSleeping
    }, Particle.prototype.sleep = function () {
        this._isSleeping || (this.emit(_events.end, this), this._isSleeping = !0)
    }, Particle.prototype.wake = function () {
        this._isSleeping && (this.emit(_events.start, this), this._isSleeping = !1, this._prevTime = now(), this._engine && this._engine.wake())
    }, Particle.prototype.setPosition = function (position) {
        this.position.set(position)
    }, Particle.prototype.setPosition1D = function (x) {
        this.position.x = x
    }, Particle.prototype.getPosition = function () {
        return this._engine.step(), this.position.get()
    }, Particle.prototype.getPosition1D = function () {
        return this._engine.step(), this.position.x
    }, Particle.prototype.setVelocity = function (velocity) {
        this.velocity.set(velocity), (0 !== velocity[0] || 0 !== velocity[1] || 0 !== velocity[2]) && this.wake()
    }, Particle.prototype.setVelocity1D = function (x) {
        this.velocity.x = x, 0 !== x && this.wake()
    }, Particle.prototype.getVelocity = function () {
        return this.velocity.get()
    }, Particle.prototype.setForce = function (force) {
        this.force.set(force), this.wake()
    }, Particle.prototype.getVelocity1D = function () {
        return this.velocity.x
    }, Particle.prototype.setMass = function (mass) {
        this.mass = mass, this.inverseMass = 1 / mass
    }, Particle.prototype.getMass = function () {
        return this.mass
    }, Particle.prototype.reset = function (position, velocity) {
        this.setPosition(position || [0, 0, 0]), this.setVelocity(velocity || [0, 0, 0])
    }, Particle.prototype.applyForce = function (force) {
        force.isZero() || (this.force.add(force).put(this.force), this.wake())
    }, Particle.prototype.applyImpulse = function (impulse) {
        if (!impulse.isZero()) {
            var velocity = this.velocity;
            velocity.add(impulse.mult(this.inverseMass)).put(velocity)
        }
    }, Particle.prototype.integrateVelocity = function (dt) {
        Integrator.integrateVelocity(this, dt)
    }, Particle.prototype.integratePosition = function (dt) {
        Integrator.integratePosition(this, dt)
    }, Particle.prototype._integrate = function (dt) {
        this.integrateVelocity(dt), this.integratePosition(dt)
    }, Particle.prototype.getEnergy = function () {
        return .5 * this.mass * this.velocity.normSquared()
    }, Particle.prototype.getTransform = function () {
        this._engine.step();
        var position = this.position, transform = this.transform;
        return transform[12] = position.x, transform[13] = position.y, transform[14] = position.z, transform
    }, Particle.prototype.modify = function (target) {
        var _spec = this._spec.target;
        return _spec.transform = this.getTransform(), _spec.target = target, this._spec
    }, Particle.prototype.emit = function (type, data) {
        this._eventOutput && this._eventOutput.emit(type, data)
    }, Particle.prototype.on = function () {
        return _createEventOutput.call(this), this.on.apply(this, arguments)
    }, Particle.prototype.removeListener = function () {
        return _createEventOutput.call(this), this.removeListener.apply(this, arguments)
    }, Particle.prototype.pipe = function () {
        return _createEventOutput.call(this), this.pipe.apply(this, arguments)
    }, Particle.prototype.unpipe = function () {
        return _createEventOutput.call(this), this.unpipe.apply(this, arguments)
    }, module.exports = Particle
}), define("famous/physics/forces/Force", ["require", "exports", "module", "../../math/Vector", "../../core/EventHandler"], function (require, exports, module) {
    function Force(force) {
        this.force = new Vector(force), this._eventOutput = new EventHandler, EventHandler.setOutputHandler(this, this._eventOutput)
    }

    var Vector = require("../../math/Vector"), EventHandler = require("../../core/EventHandler");
    Force.prototype.setOptions = function (options) {
        this._eventOutput.emit("change", options)
    }, Force.prototype.applyForce = function (targets) {
        for (var length = targets.length; length--;)targets[length].applyForce(this.force)
    }, Force.prototype.getEnergy = function () {
        return 0
    }, module.exports = Force
}), define("famous/physics/forces/Drag", ["require", "exports", "module", "./Force"], function (require, exports, module) {
    function Drag(options) {
        this.options = Object.create(this.constructor.DEFAULT_OPTIONS), options && this.setOptions(options), Force.call(this)
    }

    var Force = require("./Force");
    Drag.prototype = Object.create(Force.prototype), Drag.prototype.constructor = Drag, Drag.FORCE_FUNCTIONS = {
        LINEAR: function (velocity) {
            return velocity
        }, QUADRATIC: function (velocity) {
            return velocity.mult(velocity.norm())
        }
    }, Drag.DEFAULT_OPTIONS = {
        strength: .01,
        forceFunction: Drag.FORCE_FUNCTIONS.LINEAR
    }, Drag.prototype.applyForce = function (targets) {
        var index, particle, strength = this.options.strength, forceFunction = this.options.forceFunction, force = this.force;
        for (index = 0; index < targets.length; index++)particle = targets[index], forceFunction(particle.velocity).mult(-strength).put(force), particle.applyForce(force)
    }, Drag.prototype.setOptions = function (options) {
        for (var key in options)this.options[key] = options[key]
    }, module.exports = Drag
}), define("famous/physics/forces/Spring", ["require", "exports", "module", "./Force", "../../math/Vector"], function (require, exports, module) {
    function Spring(options) {
        Force.call(this), this.options = Object.create(this.constructor.DEFAULT_OPTIONS), options && this.setOptions(options), this.disp = new Vector(0, 0, 0), _init.call(this)
    }

    function _calcStiffness() {
        var options = this.options;
        options.stiffness = Math.pow(2 * pi / options.period, 2)
    }

    function _calcDamping() {
        var options = this.options;
        options.damping = 4 * pi * options.dampingRatio / options.period
    }

    function _init() {
        _calcStiffness.call(this), _calcDamping.call(this)
    }

    var Force = require("./Force"), Vector = require("../../math/Vector");
    Spring.prototype = Object.create(Force.prototype), Spring.prototype.constructor = Spring;
    var pi = Math.PI, MIN_PERIOD = 150;
    Spring.FORCE_FUNCTIONS = {
        FENE: function (dist, rMax) {
            var rMaxSmall = .99 * rMax, r = Math.max(Math.min(dist, rMaxSmall), -rMaxSmall);
            return r / (1 - r * r / (rMax * rMax))
        }, HOOK: function (dist) {
            return dist
        }
    }, Spring.DEFAULT_OPTIONS = {
        period: 300,
        dampingRatio: .1,
        length: 0,
        maxLength: 1 / 0,
        anchor: void 0,
        forceFunction: Spring.FORCE_FUNCTIONS.HOOK
    }, Spring.prototype.setOptions = function (options) {
        void 0 !== options.anchor && (options.anchor.position instanceof Vector && (this.options.anchor = options.anchor.position), options.anchor instanceof Vector && (this.options.anchor = options.anchor), options.anchor instanceof Array && (this.options.anchor = new Vector(options.anchor))), void 0 !== options.period && (options.period < MIN_PERIOD && (options.period = MIN_PERIOD, console.warn("The period of a SpringTransition is capped at " + MIN_PERIOD + " ms. Use a SnapTransition for faster transitions")), this.options.period = options.period), void 0 !== options.dampingRatio && (this.options.dampingRatio = options.dampingRatio), void 0 !== options.length && (this.options.length = options.length), void 0 !== options.forceFunction && (this.options.forceFunction = options.forceFunction), void 0 !== options.maxLength && (this.options.maxLength = options.maxLength), _init.call(this), Force.prototype.setOptions.call(this, options)
    }, Spring.prototype.applyForce = function (targets, source) {
        var i, target, p2, v2, dist, m, force = this.force, disp = this.disp, options = this.options, stiffness = options.stiffness, damping = options.damping, restLength = options.length, maxLength = options.maxLength, anchor = options.anchor || source.position, forceFunction = options.forceFunction;
        for (i = 0; i < targets.length; i++) {
            if (target = targets[i], p2 = target.position, v2 = target.velocity, anchor.sub(p2).put(disp), dist = disp.norm() - restLength, 0 === dist)return;
            m = target.mass, stiffness *= m, damping *= m, disp.normalize(stiffness * forceFunction(dist, maxLength)).put(force), damping && (source ? force.add(v2.sub(source.velocity).mult(-damping)).put(force) : force.add(v2.mult(-damping)).put(force)), target.applyForce(force), source && source.applyForce(force.mult(-1))
        }
    }, Spring.prototype.getEnergy = function (targets, source) {
        for (var options = this.options, restLength = options.length, anchor = source ? source.position : options.anchor, strength = options.stiffness, energy = 0, i = 0; i < targets.length; i++) {
            var target = targets[i], dist = anchor.sub(target.position).norm() - restLength;
            energy += .5 * strength * dist * dist
        }
        return energy
    }, module.exports = Spring
}), define("famous/core/ViewSequence", ["require", "exports", "module"], function (require, exports, module) {
    function ViewSequence(options) {
        options || (options = []), options instanceof Array && (options = {array: options}), this._ = null, this.index = options.index || 0, options.array ? this._ = new this.constructor.Backing(options.array) : options._ && (this._ = options._), this.index === this._.firstIndex && (this._.firstNode = this), this.index === this._.firstIndex + this._.array.length - 1 && (this._.lastNode = this), void 0 !== options.loop && (this._.loop = options.loop), void 0 !== options.trackSize && (this._.trackSize = options.trackSize), this._previousNode = null, this._nextNode = null
    }

    ViewSequence.Backing = function (array) {
        this.array = array, this.firstIndex = 0, this.loop = !1, this.firstNode = null, this.lastNode = null, this.cumulativeSizes = [[0, 0]], this.sizeDirty = !0, this.trackSize = !1
    }, ViewSequence.Backing.prototype.getValue = function (i) {
        var _i = i - this.firstIndex;
        return 0 > _i || _i >= this.array.length ? null : this.array[_i]
    }, ViewSequence.Backing.prototype.setValue = function (i, value) {
        this.array[i - this.firstIndex] = value
    }, ViewSequence.Backing.prototype.getSize = function (index) {
        return this.cumulativeSizes[index]
    }, ViewSequence.Backing.prototype.calculateSize = function (index) {
        index = index || this.array.length;
        for (var size = [0, 0], i = 0; index > i; i++) {
            var nodeSize = this.array[i].getSize();
            if (!nodeSize)return void 0;
            void 0 !== size[0] && (void 0 === nodeSize[0] ? size[0] = void 0 : size[0] += nodeSize[0]), void 0 !== size[1] && (void 0 === nodeSize[1] ? size[1] = void 0 : size[1] += nodeSize[1]), this.cumulativeSizes[i + 1] = size.slice()
        }
        return this.sizeDirty = !1, size
    }, ViewSequence.Backing.prototype.reindex = function (start, removeCount, insertCount) {
        if (this.array[0]) {
            for (var i = 0, index = this.firstIndex, indexShiftAmount = insertCount - removeCount, node = this.firstNode; start - 1 > index;)node = node.getNext(), index++;
            var spliceStartNode = node;
            for (i = 0; removeCount > i; i++)node = node.getNext(), node && (node._previousNode = spliceStartNode);
            var spliceResumeNode = node ? node.getNext() : null;
            for (spliceStartNode._nextNode = null, node = spliceStartNode, i = 0; insertCount > i; i++)node = node.getNext();
            if (index += insertCount, node !== spliceResumeNode && (node._nextNode = spliceResumeNode, spliceResumeNode && (spliceResumeNode._previousNode = node)), spliceResumeNode)for (node = spliceResumeNode, index++; node && index < this.array.length + this.firstIndex;)node._nextNode ? node.index += indexShiftAmount : node.index = index, node = node.getNext(), index++;
            this.trackSize && (this.sizeDirty = !0)
        }
    }, ViewSequence.prototype.getPrevious = function () {
        var len = this._.array.length;
        return len ? this.index === this._.firstIndex ? this._.loop ? (this._previousNode = this._.lastNode || new this.constructor({
            _: this._,
            index: this._.firstIndex + len - 1
        }), this._previousNode._nextNode = this) : this._previousNode = null : this._previousNode || (this._previousNode = new this.constructor({
            _: this._,
            index: this.index - 1
        }), this._previousNode._nextNode = this) : this._previousNode = null, this._previousNode
    }, ViewSequence.prototype.getNext = function () {
        var len = this._.array.length;
        return len ? this.index === this._.firstIndex + len - 1 ? this._.loop ? (this._nextNode = this._.firstNode || new this.constructor({
            _: this._,
            index: this._.firstIndex
        }), this._nextNode._previousNode = this) : this._nextNode = null : this._nextNode || (this._nextNode = new this.constructor({
            _: this._,
            index: this.index + 1
        }), this._nextNode._previousNode = this) : this._nextNode = null, this._nextNode
    }, ViewSequence.prototype.indexOf = function (item) {
        return this._.array.indexOf(item)
    }, ViewSequence.prototype.getIndex = function () {
        return this.index
    }, ViewSequence.prototype.toString = function () {
        return "" + this.index
    }, ViewSequence.prototype.unshift = function () {
        this._.array.unshift.apply(this._.array, arguments), this._.firstIndex -= arguments.length, this._.trackSize && (this._.sizeDirty = !0)
    }, ViewSequence.prototype.push = function () {
        this._.array.push.apply(this._.array, arguments), this._.trackSize && (this._.sizeDirty = !0)
    }, ViewSequence.prototype.splice = function (index, howMany) {
        var values = Array.prototype.slice.call(arguments, 2);
        this._.array.splice.apply(this._.array, [index - this._.firstIndex, howMany].concat(values)), this._.reindex(index, howMany, values.length)
    }, ViewSequence.prototype.swap = function (other) {
        var otherValue = other.get(), myValue = this.get();
        this._.setValue(this.index, otherValue), this._.setValue(other.index, myValue);
        var myPrevious = this._previousNode, myNext = this._nextNode, myIndex = this.index, otherPrevious = other._previousNode, otherNext = other._nextNode, otherIndex = other.index;
        this.index = otherIndex, this._previousNode = otherPrevious === this ? other : otherPrevious, this._previousNode && (this._previousNode._nextNode = this), this._nextNode = otherNext === this ? other : otherNext, this._nextNode && (this._nextNode._previousNode = this), other.index = myIndex, other._previousNode = myPrevious === other ? this : myPrevious, other._previousNode && (other._previousNode._nextNode = other), other._nextNode = myNext === other ? this : myNext, other._nextNode && (other._nextNode._previousNode = other), this.index === this._.firstIndex ? this._.firstNode = this : this.index === this._.firstIndex + this._.array.length - 1 && (this._.lastNode = this), other.index === this._.firstIndex ? this._.firstNode = other : other.index === this._.firstIndex + this._.array.length - 1 && (this._.lastNode = other), this._.trackSize && (this._.sizeDirty = !0)
    }, ViewSequence.prototype.get = function () {
        return this._.getValue(this.index)
    }, ViewSequence.prototype.getSize = function () {
        var target = this.get();
        return target ? target.getSize() : null
    }, ViewSequence.prototype.render = function () {
        this._.trackSize && this._.sizeDirty && this._.calculateSize();
        var target = this.get();
        return target ? target.render.apply(target, arguments) : null
    }, module.exports = ViewSequence
}), define("famous/core/Group", ["require", "exports", "module", "./Context", "./Transform", "./Surface"], function (require, exports, module) {
    function Group(options) {
        Surface.call(this, options), this._shouldRecalculateSize = !1, this._container = document.createDocumentFragment(), this.context = new Context(this._container), this.setContent(this._container), this._groupSize = [void 0, void 0]
    }

    var Context = require("./Context"), Transform = require("./Transform"), Surface = require("./Surface");
    Group.SIZE_ZERO = [0, 0], Group.prototype = Object.create(Surface.prototype), Group.prototype.elementType = "div", Group.prototype.elementClass = "famous-group", Group.prototype.add = function () {
        return this.context.add.apply(this.context, arguments)
    }, Group.prototype.render = function () {
        return Surface.prototype.render.call(this)
    }, Group.prototype.deploy = function (target) {
        this.context.migrate(target)
    }, Group.prototype.recall = function () {
        this._container = document.createDocumentFragment(), this.context.migrate(this._container)
    }, Group.prototype.commit = function (context) {
        var transform = context.transform, origin = context.origin, opacity = context.opacity, size = context.size, result = Surface.prototype.commit.call(this, {
            allocator: context.allocator,
            transform: Transform.thenMove(transform, [-origin[0] * size[0], -origin[1] * size[1], 0]),
            opacity: opacity,
            origin: origin,
            size: Group.SIZE_ZERO
        });
        return (size[0] !== this._groupSize[0] || size[1] !== this._groupSize[1]) && (this._groupSize[0] = size[0], this._groupSize[1] = size[1], this.context.setSize(size)), this.context.update({
            transform: Transform.translate(-origin[0] * size[0], -origin[1] * size[1], 0),
            origin: origin,
            size: size
        }), result
    }, module.exports = Group
}), define("famous/views/Scroller", ["require", "exports", "module", "../core/Entity", "../core/Group", "../core/OptionsManager", "../core/Transform", "../utilities/Utility", "../core/ViewSequence", "../core/EventHandler"], function (require, exports, module) {
    function Scroller(options) {
        this.options = Object.create(this.constructor.DEFAULT_OPTIONS), this._optionsManager = new OptionsManager(this.options), options && this._optionsManager.setOptions(options), this._node = null, this._position = 0, this._positionOffset = 0, this._positionGetter = null, this._outputFunction = null, this._masterOutputFunction = null, this.outputFrom(), this._onEdge = 0, this.group = new Group, this.group.add({render: _innerRender.bind(this)}), this._entityId = Entity.register(this), this._size = [void 0, void 0], this._contextSize = [void 0, void 0], this._eventInput = new EventHandler, this._eventOutput = new EventHandler, EventHandler.setInputHandler(this, this._eventInput), EventHandler.setOutputHandler(this, this._eventOutput)
    }

    function _sizeForDir(size) {
        size || (size = this._contextSize);
        var dimension = this.options.direction;
        return void 0 === size[dimension] ? this._contextSize[dimension] : size[dimension]
    }

    function _output(node, offset, target) {
        var size = node.getSize ? node.getSize() : this._contextSize, transform = this._outputFunction(offset);
        return target.push({transform: transform, target: node.render()}), _sizeForDir.call(this, size)
    }

    function _getClipSize() {
        return void 0 !== this.options.clipSize ? this.options.clipSize : this._contextSize[this.options.direction] > this.getCumulativeSize()[this.options.direction] ? _sizeForDir.call(this, this.getCumulativeSize()) : _sizeForDir.call(this, this._contextSize)
    }

    function _innerRender() {
        for (var size = null, position = this._position, result = [], offset = -this._positionOffset, clipSize = _getClipSize.call(this), currNode = this._node; currNode && offset - position < clipSize + this.options.margin;)offset += _output.call(this, currNode, offset, result), currNode = currNode.getNext ? currNode.getNext() : null;
        var sizeNode = this._node, nodesSize = _sizeForDir.call(this, sizeNode.getSize());
        if (clipSize > offset) {
            for (; sizeNode && clipSize > nodesSize;)sizeNode = sizeNode.getPrevious(), sizeNode && (nodesSize += _sizeForDir.call(this, sizeNode.getSize()));
            for (sizeNode = this._node; sizeNode && clipSize > nodesSize;)sizeNode = sizeNode.getNext(), sizeNode && (nodesSize += _sizeForDir.call(this, sizeNode.getSize()))
        }
        for (!currNode && clipSize - EDGE_TOLERANCE > offset - position ? 1 !== this._onEdge && (this._onEdge = 1, this._eventOutput.emit("onEdge", {position: offset - clipSize})) : !this._node.getPrevious() && -EDGE_TOLERANCE > position ? -1 !== this._onEdge && (this._onEdge = -1, this._eventOutput.emit("onEdge", {position: 0})) : 0 !== this._onEdge && (this._onEdge = 0, this._eventOutput.emit("offEdge")), currNode = this._node && this._node.getPrevious ? this._node.getPrevious() : null, offset = -this._positionOffset, currNode && (size = currNode.getSize ? currNode.getSize() : this._contextSize, offset -= _sizeForDir.call(this, size)); currNode && offset - position > -(clipSize + this.options.margin);)_output.call(this, currNode, offset, result), currNode = currNode.getPrevious ? currNode.getPrevious() : null, currNode && (size = currNode.getSize ? currNode.getSize() : this._contextSize, offset -= _sizeForDir.call(this, size));
        return result
    }

    var Entity = require("../core/Entity"), Group = require("../core/Group"), OptionsManager = require("../core/OptionsManager"), Transform = require("../core/Transform"), Utility = require("../utilities/Utility"), ViewSequence = require("../core/ViewSequence"), EventHandler = require("../core/EventHandler");
    Scroller.DEFAULT_OPTIONS = {direction: Utility.Direction.Y, margin: 0, clipSize: void 0, groupScroll: !1};
    var EDGE_TOLERANCE = 0;
    Scroller.prototype.getCumulativeSize = function (index) {
        return void 0 === index && (index = this._node._.cumulativeSizes.length - 1), this._node._.getSize(index)
    }, Scroller.prototype.setOptions = function (options) {
        options.groupScroll !== this.options.groupScroll && (options.groupScroll ? this.group.pipe(this._eventOutput) : this.group.unpipe(this._eventOutput)), this._optionsManager.setOptions(options)
    }, Scroller.prototype.onEdge = function () {
        return this._onEdge
    }, Scroller.prototype.outputFrom = function (fn, masterFn) {
        fn || (fn = function (offset) {
            return this.options.direction === Utility.Direction.X ? Transform.translate(offset, 0) : Transform.translate(0, offset)
        }.bind(this), masterFn || (masterFn = fn)), this._outputFunction = fn, this._masterOutputFunction = masterFn ? masterFn : function (offset) {
            return Transform.inverse(fn(-offset))
        }
    }, Scroller.prototype.positionFrom = function (position) {
        position instanceof Function ? this._positionGetter = position : position && position.get ? this._positionGetter = position.get.bind(position) : (this._positionGetter = null, this._position = position), this._positionGetter && (this._position = this._positionGetter.call(this))
    }, Scroller.prototype.sequenceFrom = function (node) {
        node instanceof Array && (node = new ViewSequence({array: node})), this._node = node, this._positionOffset = 0
    }, Scroller.prototype.getSize = function (actual) {
        return actual ? this._contextSize : this._size
    }, Scroller.prototype.render = function () {
        return this._node ? (this._positionGetter && (this._position = this._positionGetter.call(this)), this._entityId) : null
    }, Scroller.prototype.commit = function (context) {
        var transform = context.transform, opacity = context.opacity, origin = context.origin, size = context.size;
        this.options.clipSize || size[0] === this._contextSize[0] && size[1] === this._contextSize[1] || (this._onEdge = 0, this._contextSize[0] = size[0], this._contextSize[1] = size[1], this.options.direction === Utility.Direction.X ? (this._size[0] = _getClipSize.call(this), this._size[1] = void 0) : (this._size[0] = void 0, this._size[1] = _getClipSize.call(this)));
        var scrollTransform = this._masterOutputFunction(-this._position);
        return {
            transform: Transform.multiply(transform, scrollTransform),
            size: size,
            opacity: opacity,
            origin: origin,
            target: this.group.render()
        }
    }, module.exports = Scroller
}), define("famous/inputs/ScrollSync", ["require", "exports", "module", "../core/EventHandler", "../core/Engine", "../core/OptionsManager"], function (require, exports, module) {
    function ScrollSync(options) {
        this.options = Object.create(ScrollSync.DEFAULT_OPTIONS), this._optionsManager = new OptionsManager(this.options), options && this.setOptions(options), this._payload = {
            delta: null,
            position: null,
            velocity: null,
            slip: !0
        }, this._eventInput = new EventHandler, this._eventOutput = new EventHandler, EventHandler.setInputHandler(this, this._eventInput), EventHandler.setOutputHandler(this, this._eventOutput), this._position = void 0 === this.options.direction ? [0, 0] : 0, this._prevTime = void 0, this._prevVel = void 0, this._eventInput.on("mousewheel", _handleMove.bind(this)), this._eventInput.on("wheel", _handleMove.bind(this)), this._inProgress = !1, this._loopBound = !1
    }

    function _newFrame() {
        if (this._inProgress && _now() - this._prevTime > this.options.stallTime) {
            this._inProgress = !1;
            var finalVel = Math.abs(this._prevVel) >= this.options.minimumEndSpeed ? this._prevVel : 0, payload = this._payload;
            payload.position = this._position, payload.velocity = finalVel, payload.slip = !0, this._eventOutput.emit("end", payload)
        }
    }

    function _handleMove(event) {
        this.options.preventDefault && event.preventDefault(), this._inProgress || (this._inProgress = !0, this._position = void 0 === this.options.direction ? [0, 0] : 0, payload = this._payload, payload.slip = !0, payload.position = this._position, payload.clientX = event.clientX, payload.clientY = event.clientY, payload.offsetX = event.offsetX, payload.offsetY = event.offsetY, this._eventOutput.emit("start", payload), this._loopBound || (Engine.on("prerender", _newFrame.bind(this)), this._loopBound = !0));
        var currTime = _now(), prevTime = this._prevTime || currTime, diffX = void 0 !== event.wheelDeltaX ? event.wheelDeltaX : -event.deltaX, diffY = void 0 !== event.wheelDeltaY ? event.wheelDeltaY : -event.deltaY;
        1 === event.deltaMode && (diffX *= this.options.lineHeight, diffY *= this.options.lineHeight), this.options.rails && (Math.abs(diffX) > Math.abs(diffY) ? diffY = 0 : diffX = 0);
        var nextVel, nextDelta, diffTime = Math.max(currTime - prevTime, MINIMUM_TICK_TIME), velX = diffX / diffTime, velY = diffY / diffTime, scale = this.options.scale;
        this.options.direction === ScrollSync.DIRECTION_X ? (nextDelta = scale * diffX, nextVel = scale * velX, this._position += nextDelta) : this.options.direction === ScrollSync.DIRECTION_Y ? (nextDelta = scale * diffY, nextVel = scale * velY, this._position += nextDelta) : (nextDelta = [scale * diffX, scale * diffY], nextVel = [scale * velX, scale * velY], this._position[0] += nextDelta[0], this._position[1] += nextDelta[1]);
        var payload = this._payload;
        payload.delta = nextDelta, payload.velocity = nextVel, payload.position = this._position, payload.slip = !0, this._eventOutput.emit("update", payload), this._prevTime = currTime, this._prevVel = nextVel
    }

    var EventHandler = require("../core/EventHandler"), Engine = require("../core/Engine"), OptionsManager = require("../core/OptionsManager");
    ScrollSync.DEFAULT_OPTIONS = {
        direction: void 0,
        minimumEndSpeed: 1 / 0,
        rails: !1,
        scale: 1,
        stallTime: 50,
        lineHeight: 40,
        preventDefault: !0
    }, ScrollSync.DIRECTION_X = 0, ScrollSync.DIRECTION_Y = 1;
    var MINIMUM_TICK_TIME = 8, _now = Date.now;
    ScrollSync.prototype.getOptions = function () {
        return this.options
    }, ScrollSync.prototype.setOptions = function (options) {
        return this._optionsManager.setOptions(options)
    }, module.exports = ScrollSync
}), define("famous/inputs/TouchTracker", ["require", "exports", "module", "../core/EventHandler"], function (require, exports, module) {
    function _timestampTouch(touch, event, history) {
        return {
            x: touch.clientX,
            y: touch.clientY,
            identifier: touch.identifier,
            origin: event.origin,
            timestamp: _now(),
            count: event.touches.length,
            history: history
        }
    }

    function _handleStart(event) {
        if (!(event.touches.length > this.touchLimit)) {
            this.isTouched = !0;
            for (var i = 0; i < event.changedTouches.length; i++) {
                var touch = event.changedTouches[i], data = _timestampTouch(touch, event, null);
                this.eventOutput.emit("trackstart", data), this.selective || this.touchHistory[touch.identifier] || this.track(data)
            }
        }
    }

    function _handleMove(event) {
        if (!(event.touches.length > this.touchLimit))for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i], history = this.touchHistory[touch.identifier];
            if (history) {
                var data = _timestampTouch(touch, event, history);
                this.touchHistory[touch.identifier].push(data), this.eventOutput.emit("trackmove", data)
            }
        }
    }

    function _handleEnd(event) {
        if (this.isTouched) {
            for (var i = 0; i < event.changedTouches.length; i++) {
                var touch = event.changedTouches[i], history = this.touchHistory[touch.identifier];
                if (history) {
                    var data = _timestampTouch(touch, event, history);
                    this.touchHistory[touch.identifier].push(data), this.eventOutput.emit("trackend", data), delete this.touchHistory[touch.identifier]
                }
            }
            this.isTouched = !1
        }
    }

    function _handleUnpipe() {
        for (var i in this.touchHistory) {
            var history = this.touchHistory[i];
            this.eventOutput.emit("trackend", {
                touch: history[history.length - 1].touch,
                timestamp: Date.now(),
                count: 0,
                history: history
            }), delete this.touchHistory[i]
        }
    }

    function TouchTracker(options) {
        this.selective = options.selective, this.touchLimit = options.touchLimit || 1, this.touchHistory = {}, this.eventInput = new EventHandler, this.eventOutput = new EventHandler, EventHandler.setInputHandler(this, this.eventInput), EventHandler.setOutputHandler(this, this.eventOutput), this.eventInput.on("touchstart", _handleStart.bind(this)), this.eventInput.on("touchmove", _handleMove.bind(this)), this.eventInput.on("touchend", _handleEnd.bind(this)), this.eventInput.on("touchcancel", _handleEnd.bind(this)), this.eventInput.on("unpipe", _handleUnpipe.bind(this)), this.isTouched = !1
    }

    var EventHandler = require("../core/EventHandler"), _now = Date.now;
    TouchTracker.prototype.track = function (data) {
        this.touchHistory[data.identifier] = [data]
    }, module.exports = TouchTracker
}), define("famous/inputs/TouchSync", ["require", "exports", "module", "./TouchTracker", "../core/EventHandler", "../core/OptionsManager", "./SyncUtils"], function (require, exports, module) {
    function TouchSync(options) {
        this.options = Object.create(TouchSync.DEFAULT_OPTIONS), this._optionsManager = new OptionsManager(this.options), options && this.setOptions(options), this._eventOutput = new EventHandler, this._touchTracker = new TouchTracker({touchLimit: this.options.touchLimit}), EventHandler.setOutputHandler(this, this._eventOutput), EventHandler.setInputHandler(this, this._touchTracker), this._touchTracker.on("trackstart", _handleStart.bind(this)), this._touchTracker.on("trackmove", _handleMove.bind(this)), this._touchTracker.on("trackend", _handleEnd.bind(this)), this._payload = {
            delta: null,
            position: null,
            velocity: null,
            clientX: void 0,
            clientY: void 0,
            count: 0,
            touch: void 0
        }, this._position = null
    }

    function _handleStart(data) {
        var velocity, delta;
        void 0 !== this.options.direction ? (this._position = 0, velocity = 0, delta = 0) : (this._position = [0, 0], velocity = [0, 0], delta = [0, 0]);
        var payload = this._payload;
        payload.delta = delta, payload.position = this._position, payload.velocity = velocity, payload.clientX = data.x, payload.clientY = data.y, payload.count = data.count, payload.touch = data.identifier, this._eventOutput.emit("start", payload)
    }

    function _handleMove(data) {
        calculatePayload.call(this, data)
    }

    function calculatePayload(data) {
        var history = data.history, currHistory = history[history.length - 1], distantHistory = SyncUtils.getTimeHistoryPosition(history, this.options.timeSampleDuration), distantTime = distantHistory.timestamp, currTime = currHistory.timestamp, diffX = currHistory.x - distantHistory.x, diffY = currHistory.y - distantHistory.y, velDiffX = currHistory.x - distantTime, velDiffY = currHistory.y - distantTime;
        this.options.rails && (Math.abs(diffX) > Math.abs(diffY) ? diffY = 0 : diffX = 0, Math.abs(velDiffX) > Math.abs(velDiffY) ? velDiffY = 0 : velDiffX = 0);
        var nextVel, nextDelta, diffTime = Math.max(currTime - distantTime, MINIMUM_TICK_TIME), velX = velDiffX / diffTime, velY = velDiffY / diffTime, scale = this.options.scale;
        this.options.direction === TouchSync.DIRECTION_X ? (nextDelta = scale * diffX, nextVel = scale * velX, this._position += nextDelta) : this.options.direction === TouchSync.DIRECTION_Y ? (nextDelta = scale * diffY, nextVel = scale * velY, this._position += nextDelta) : (nextDelta = [scale * diffX, scale * diffY], nextVel = [scale * velX, scale * velY], this._position[0] += nextDelta[0], this._position[1] += nextDelta[1]);
        var payload = this._payload;
        payload.delta = nextDelta, payload.velocity = nextVel, payload.position = this._position, payload.clientX = data.x, payload.clientY = data.y, payload.count = data.count, payload.touch = data.identifier, this._eventOutput.emit("update", payload)
    }

    function _handleEnd(data) {
        calculatePayload.call(this, data), this._payload.count = data.count, this._eventOutput.emit("end", this._payload)
    }

    var TouchTracker = require("./TouchTracker"), EventHandler = require("../core/EventHandler"), OptionsManager = require("../core/OptionsManager"), SyncUtils = require("./SyncUtils");
    TouchSync.DEFAULT_OPTIONS = {
        direction: void 0,
        rails: !1,
        touchLimit: 1,
        velocitySampleLength: 10,
        scale: 1,
        timeSampleDuration: 400
    }, TouchSync.DIRECTION_X = 0, TouchSync.DIRECTION_Y = 1;
    var MINIMUM_TICK_TIME = 8;
    TouchSync.prototype.setOptions = function (options) {
        return this._optionsManager.setOptions(options)
    }, TouchSync.prototype.getOptions = function () {
        return this.options
    }, module.exports = TouchSync
}), define("famous/views/Scrollview", ["require", "exports", "module", "../physics/PhysicsEngine", "../physics/bodies/Particle", "../physics/forces/Drag", "../physics/forces/Spring", "../core/EventHandler", "../core/OptionsManager", "../core/ViewSequence", "../views/Scroller", "../utilities/Utility", "../inputs/GenericSync", "../inputs/ScrollSync", "../inputs/TouchSync"], function (require, exports, module) {
    function Scrollview(options) {
        this.options = Object.create(Scrollview.DEFAULT_OPTIONS), this._optionsManager = new OptionsManager(this.options), this._scroller = new Scroller(this.options), this.sync = new GenericSync(["scroll", "touch"], {
            direction: this.options.direction,
            scale: this.options.syncScale,
            rails: this.options.rails,
            preventDefault: void 0 !== this.options.preventDefault ? this.options.preventDefault : this.options.direction !== Utility.Direction.Y
        }), this._physicsEngine = new PhysicsEngine, this._particle = new Particle, this._physicsEngine.addBody(this._particle), this.spring = new Spring({
            anchor: [0, 0, 0],
            period: this.options.edgePeriod,
            dampingRatio: this.options.edgeDamp
        }), this.drag = new Drag({
            forceFunction: Drag.FORCE_FUNCTIONS.QUADRATIC,
            strength: this.options.drag
        }), this.friction = new Drag({
            forceFunction: Drag.FORCE_FUNCTIONS.LINEAR,
            strength: this.options.friction
        }), this._node = null, this._touchCount = 0, this._springState = SpringStates.NONE, this._onEdge = EdgeStates.NONE, this._pageSpringPosition = 0, this._edgeSpringPosition = 0, this._touchVelocity = 0, this._earlyEnd = !1, this._needsPaginationCheck = !1, this._displacement = 0, this._totalShift = 0, this._cachedIndex = 0, this._scroller.positionFrom(this.getPosition.bind(this)), this._eventInput = new EventHandler, this._eventOutput = new EventHandler, this._eventInput.pipe(this.sync), this.sync.pipe(this._eventInput), EventHandler.setInputHandler(this, this._eventInput), EventHandler.setOutputHandler(this, this._eventOutput), _bindEvents.call(this), options && this.setOptions(options)
    }

    function _handleStart(event) {
        this._touchCount = event.count, void 0 === event.count && (this._touchCount = 1), _detachAgents.call(this), this.setVelocity(0), this._touchVelocity = 0, this._earlyEnd = !1
    }

    function _handleMove(event) {
        var velocity = -event.velocity, delta = -event.delta;
        if (this._onEdge !== EdgeStates.NONE && event.slip && (0 > velocity && this._onEdge === EdgeStates.TOP || velocity > 0 && this._onEdge === EdgeStates.BOTTOM ? this._earlyEnd || (_handleEnd.call(this, event), this._earlyEnd = !0) : this._earlyEnd && Math.abs(velocity) > Math.abs(this.getVelocity()) && _handleStart.call(this, event)), !this._earlyEnd) {
            if (this._touchVelocity = velocity, event.slip) {
                var speedLimit = this.options.speedLimit;
                -speedLimit > velocity ? velocity = -speedLimit : velocity > speedLimit && (velocity = speedLimit), this.setVelocity(velocity);
                var deltaLimit = 16 * speedLimit;
                delta > deltaLimit ? delta = deltaLimit : -deltaLimit > delta && (delta = -deltaLimit)
            }
            this.setPosition(this.getPosition() + delta), this._displacement += delta, this._springState === SpringStates.NONE && _normalizeState.call(this)
        }
    }

    function _handleEnd(event) {
        if (this._touchCount = event.count || 0, !this._touchCount) {
            _detachAgents.call(this), this._onEdge !== EdgeStates.NONE && _setSpring.call(this, this._edgeSpringPosition, SpringStates.EDGE), _attachAgents.call(this);
            var velocity = -event.velocity, speedLimit = this.options.speedLimit;
            event.slip && (speedLimit *= this.options.edgeGrip), -speedLimit > velocity ? velocity = -speedLimit : velocity > speedLimit && (velocity = speedLimit), this.setVelocity(velocity), this._touchVelocity = 0, this._needsPaginationCheck = !0
        }
    }

    function _bindEvents() {
        this._eventInput.bindThis(this), this._eventInput.on("start", _handleStart), this._eventInput.on("update", _handleMove), this._eventInput.on("end", _handleEnd), this._eventInput.on("resize", function () {
            this._node._.calculateSize()
        }.bind(this)), this._scroller.on("onEdge", function (data) {
            this._edgeSpringPosition = data.position, _handleEdge.call(this, this._scroller.onEdge()), this._eventOutput.emit("onEdge")
        }.bind(this)), this._scroller.on("offEdge", function () {
            this.sync.setOptions({scale: this.options.syncScale}), this._onEdge = this._scroller.onEdge(), this._eventOutput.emit("offEdge")
        }.bind(this)), this._particle.on("update", function (particle) {
            this._springState === SpringStates.NONE && _normalizeState.call(this), this._displacement = particle.position.x - this._totalShift
        }.bind(this)), this._particle.on("end", function () {
            (!this.options.paginated || this.options.paginated && this._springState !== SpringStates.NONE) && this._eventOutput.emit("settle")
        }.bind(this))
    }

    function _attachAgents() {
        this._springState ? this._physicsEngine.attach([this.spring], this._particle) : this._physicsEngine.attach([this.drag, this.friction], this._particle)
    }

    function _detachAgents() {
        this._springState = SpringStates.NONE, this._physicsEngine.detachAll()
    }

    function _nodeSizeForDirection(node) {
        var direction = this.options.direction, nodeSize = node.getSize();
        return nodeSize ? nodeSize[direction] : this._scroller.getSize()[direction]
    }

    function _handleEdge(edge) {
        this.sync.setOptions({scale: this.options.edgeGrip}), this._onEdge = edge, this._touchCount || this._springState === SpringStates.EDGE || _setSpring.call(this, this._edgeSpringPosition, SpringStates.EDGE), this._springState && Math.abs(this.getVelocity()) < .001 && (_detachAgents.call(this), _attachAgents.call(this))
    }

    function _handlePagination() {
        if (!this._touchCount && this._springState !== SpringStates.EDGE) {
            var velocity = this.getVelocity();
            if (!(Math.abs(velocity) >= this.options.pageStopSpeed)) {
                var position = this.getPosition(), velocitySwitch = Math.abs(velocity) > this.options.pageSwitchSpeed, nodeSize = _nodeSizeForDirection.call(this, this._node), positionNext = position > .5 * nodeSize, velocityNext = velocity > 0, velocityPrev = 0 > velocity;
                this._needsPaginationCheck = !1, positionNext && !velocitySwitch || velocitySwitch && velocityNext ? this.goToNextPage() : velocitySwitch && velocityPrev ? this.goToPreviousPage() : _setSpring.call(this, 0, SpringStates.PAGE)
            }
        }
    }

    function _setSpring(position, springState) {
        var springOptions;
        springState === SpringStates.EDGE ? (this._edgeSpringPosition = position, springOptions = {
            anchor: [this._edgeSpringPosition, 0, 0],
            period: this.options.edgePeriod,
            dampingRatio: this.options.edgeDamp
        }) : springState === SpringStates.PAGE && (this._pageSpringPosition = position, springOptions = {
            anchor: [this._pageSpringPosition, 0, 0],
            period: this.options.pagePeriod,
            dampingRatio: this.options.pageDamp
        }), this.spring.setOptions(springOptions), springState && !this._springState && (_detachAgents.call(this), this._springState = springState, _attachAgents.call(this)), this._springState = springState
    }

    function _normalizeState() {
        var offset = 0, position = this.getPosition();
        position += (0 > position ? -.5 : .5) >> 0;
        for (var nodeSize = _nodeSizeForDirection.call(this, this._node), nextNode = this._node.getNext(); offset + position >= nodeSize && nextNode;)offset -= nodeSize, this._scroller.sequenceFrom(nextNode), this._node = nextNode, nextNode = this._node.getNext(), nodeSize = _nodeSizeForDirection.call(this, this._node);
        for (var previousNodeSize, previousNode = this._node.getPrevious(); 0 >= offset + position && previousNode;)previousNodeSize = _nodeSizeForDirection.call(this, previousNode), this._scroller.sequenceFrom(previousNode), this._node = previousNode, offset += previousNodeSize, previousNode = this._node.getPrevious();
        offset && _shiftOrigin.call(this, offset), this._node && (this._node.index !== this._cachedIndex ? this.getPosition() < .5 * nodeSize && (this._cachedIndex = this._node.index, this._eventOutput.emit("pageChange", {
            direction: -1,
            index: this._cachedIndex
        })) : this.getPosition() > .5 * nodeSize && (this._cachedIndex = this._node.index + 1, this._eventOutput.emit("pageChange", {
            direction: 1,
            index: this._cachedIndex
        })))
    }

    function _shiftOrigin(amount) {
        this._edgeSpringPosition += amount, this._pageSpringPosition += amount, this.setPosition(this.getPosition() + amount), this._totalShift += amount, this._springState === SpringStates.EDGE ? this.spring.setOptions({anchor: [this._edgeSpringPosition, 0, 0]}) : this._springState === SpringStates.PAGE && this.spring.setOptions({anchor: [this._pageSpringPosition, 0, 0]})
    }

    var PhysicsEngine = require("../physics/PhysicsEngine"), Particle = require("../physics/bodies/Particle"), Drag = require("../physics/forces/Drag"), Spring = require("../physics/forces/Spring"), EventHandler = require("../core/EventHandler"), OptionsManager = require("../core/OptionsManager"), ViewSequence = require("../core/ViewSequence"), Scroller = require("../views/Scroller"), Utility = require("../utilities/Utility"), GenericSync = require("../inputs/GenericSync"), ScrollSync = require("../inputs/ScrollSync"), TouchSync = require("../inputs/TouchSync");
    GenericSync.register({scroll: ScrollSync, touch: TouchSync});
    var SpringStates = {NONE: 0, EDGE: 1, PAGE: 2}, EdgeStates = {TOP: -1, NONE: 0, BOTTOM: 1};
    Scrollview.DEFAULT_OPTIONS = {
        direction: Utility.Direction.Y,
        rails: !0,
        friction: .005,
        drag: 1e-4,
        edgeGrip: .2,
        edgePeriod: 300,
        edgeDamp: 1,
        margin: 1e3,
        paginated: !1,
        pagePeriod: 500,
        pageDamp: .8,
        pageStopSpeed: 10,
        pageSwitchSpeed: .5,
        speedLimit: 5,
        groupScroll: !1,
        syncScale: 1
    }, Scrollview.prototype.getCurrentIndex = function () {
        return this._node.index
    }, Scrollview.prototype.goToPreviousPage = function () {
        if (!this._node || this._onEdge === EdgeStates.TOP)return null;
        if (this.getPosition() > 1 && this._springState === SpringStates.NONE)return _setSpring.call(this, 0, SpringStates.PAGE), this._node;
        var previousNode = this._node.getPrevious();
        if (previousNode) {
            var previousNodeSize = _nodeSizeForDirection.call(this, previousNode);
            this._scroller.sequenceFrom(previousNode), this._node = previousNode, _shiftOrigin.call(this, previousNodeSize), _setSpring.call(this, 0, SpringStates.PAGE)
        }
        return previousNode
    }, Scrollview.prototype.goToNextPage = function () {
        if (!this._node || this._onEdge === EdgeStates.BOTTOM)return null;
        var nextNode = this._node.getNext();
        if (nextNode) {
            var currentNodeSize = _nodeSizeForDirection.call(this, this._node);
            this._scroller.sequenceFrom(nextNode), this._node = nextNode, _shiftOrigin.call(this, -currentNodeSize), _setSpring.call(this, 0, SpringStates.PAGE)
        }
        return nextNode
    }, Scrollview.prototype.goToPage = function (index) {
        var i, currentIndex = this.getCurrentIndex();
        if (currentIndex > index)for (i = 0; currentIndex - index > i; i++)this.goToPreviousPage();
        if (index > currentIndex)for (i = 0; index - currentIndex > i; i++)this.goToNextPage()
    }, Scrollview.prototype.outputFrom = function () {
        return this._scroller.outputFrom.apply(this._scroller, arguments)
    }, Scrollview.prototype.getPosition = function () {
        return this._particle.getPosition1D()
    }, Scrollview.prototype.getAbsolutePosition = function () {
        return this._scroller.getCumulativeSize(this.getCurrentIndex())[this.options.direction] + this.getPosition()
    }, Scrollview.prototype.getOffset = Scrollview.prototype.getPosition, Scrollview.prototype.setPosition = function (x) {
        this._particle.setPosition1D(x)
    }, Scrollview.prototype.setOffset = Scrollview.prototype.setPosition, Scrollview.prototype.getVelocity = function () {
        return this._touchCount ? this._touchVelocity : this._particle.getVelocity1D()
    }, Scrollview.prototype.setVelocity = function (v) {
        this._particle.setVelocity1D(v)
    }, Scrollview.prototype.setOptions = function (options) {
        void 0 !== options.direction && ("x" === options.direction ? options.direction = Utility.Direction.X : "y" === options.direction && (options.direction = Utility.Direction.Y)), options.groupScroll !== this.options.groupScroll && (options.groupScroll ? this.subscribe(this._scroller) : this.unsubscribe(this._scroller)), this._optionsManager.setOptions(options), this._scroller.setOptions(options), void 0 !== options.drag && this.drag.setOptions({strength: this.options.drag}), void 0 !== options.friction && this.friction.setOptions({strength: this.options.friction}), (void 0 !== options.edgePeriod || void 0 !== options.edgeDamp) && this.spring.setOptions({
            period: this.options.edgePeriod,
            dampingRatio: this.options.edgeDamp
        }), (options.rails || void 0 !== options.direction || void 0 !== options.syncScale || options.preventDefault) && this.sync.setOptions({
            rails: this.options.rails,
            direction: this.options.direction === Utility.Direction.X ? GenericSync.DIRECTION_X : GenericSync.DIRECTION_Y,
            scale: this.options.syncScale,
            preventDefault: this.options.preventDefault
        })
    }, Scrollview.prototype.sequenceFrom = function (node) {
        return node instanceof Array && (node = new ViewSequence({
            array: node,
            trackSize: !0
        })), this._node = node, this._scroller.sequenceFrom(node)
    }, Scrollview.prototype.getSize = function () {
        return this._scroller.getSize.apply(this._scroller, arguments)
    }, Scrollview.prototype.render = function () {
        return this.options.paginated && this._needsPaginationCheck && _handlePagination.call(this), this._scroller.render()
    }, module.exports = Scrollview
}), define("famous/views/ScrollContainer", ["require", "exports", "module", "../surfaces/ContainerSurface", "../core/EventHandler", "./Scrollview", "../utilities/Utility", "../core/OptionsManager"], function (require, exports, module) {
    function ScrollContainer(options) {
        this.options = Object.create(ScrollContainer.DEFAULT_OPTIONS), this._optionsManager = new OptionsManager(this.options), options && this.setOptions(options), this.container = new ContainerSurface(this.options.container), this.scrollview = new Scrollview(this.options.scrollview), this.container.add(this.scrollview), this._eventInput = new EventHandler, EventHandler.setInputHandler(this, this._eventInput), this._eventInput.pipe(this.scrollview), this._eventOutput = new EventHandler, EventHandler.setOutputHandler(this, this._eventOutput), this.container.pipe(this._eventOutput), this.scrollview.pipe(this._eventOutput)
    }

    var ContainerSurface = require("../surfaces/ContainerSurface"), EventHandler = require("../core/EventHandler"), Scrollview = require("./Scrollview"), OptionsManager = (require("../utilities/Utility"), require("../core/OptionsManager"));
    ScrollContainer.DEFAULT_OPTIONS = {
        container: {properties: {overflow: "hidden"}},
        scrollview: {}
    }, ScrollContainer.prototype.setOptions = function (options) {
        return this._optionsManager.setOptions(options)
    }, ScrollContainer.prototype.sequenceFrom = function () {
        return this.scrollview.sequenceFrom.apply(this.scrollview, arguments)
    }, ScrollContainer.prototype.getSize = function () {
        return this.container.getSize.apply(this.container, arguments)
    }, ScrollContainer.prototype.render = function () {
        return this.container.render()
    }, module.exports = ScrollContainer
}), define("famous/modifiers/StateModifier", ["require", "exports", "module", "../core/Modifier", "../core/Transform", "../transitions/Transitionable", "../transitions/TransitionableTransform"], function (require, exports, module) {
    function StateModifier(options) {
        this._transformState = new TransitionableTransform(Transform.identity), this._opacityState = new Transitionable(1), this._originState = new Transitionable([0, 0]), this._alignState = new Transitionable([0, 0]), this._sizeState = new Transitionable([0, 0]), this._proportionsState = new Transitionable([0, 0]), this._modifier = new Modifier({
            transform: this._transformState,
            opacity: this._opacityState,
            origin: null,
            align: null,
            size: null,
            proportions: null
        }), this._hasOrigin = !1, this._hasAlign = !1, this._hasSize = !1, this._hasProportions = !1, options && (options.transform && this.setTransform(options.transform), void 0 !== options.opacity && this.setOpacity(options.opacity), options.origin && this.setOrigin(options.origin), options.align && this.setAlign(options.align), options.size && this.setSize(options.size), options.proportions && this.setProportions(options.proportions))
    }

    var Modifier = require("../core/Modifier"), Transform = require("../core/Transform"), Transitionable = require("../transitions/Transitionable"), TransitionableTransform = require("../transitions/TransitionableTransform");
    StateModifier.prototype.setTransform = function (transform, transition, callback) {
        return this._transformState.set(transform, transition, callback), this
    }, StateModifier.prototype.setOpacity = function (opacity, transition, callback) {
        return this._opacityState.set(opacity, transition, callback), this
    }, StateModifier.prototype.setOrigin = function (origin, transition, callback) {
        return null === origin ? (this._hasOrigin && (this._modifier.originFrom(null), this._hasOrigin = !1), this) : (this._hasOrigin || (this._hasOrigin = !0, this._modifier.originFrom(this._originState)), this._originState.set(origin, transition, callback), this)
    }, StateModifier.prototype.setAlign = function (align, transition, callback) {
        return null === align ? (this._hasAlign && (this._modifier.alignFrom(null), this._hasAlign = !1), this) : (this._hasAlign || (this._hasAlign = !0, this._modifier.alignFrom(this._alignState)), this._alignState.set(align, transition, callback), this)
    }, StateModifier.prototype.setSize = function (size, transition, callback) {
        return null === size ? (this._hasSize && (this._modifier.sizeFrom(null), this._hasSize = !1), this) : (this._hasSize || (this._hasSize = !0, this._modifier.sizeFrom(this._sizeState)), this._sizeState.set(size, transition, callback), this)
    }, StateModifier.prototype.setProportions = function (proportions, transition, callback) {
        return null === proportions ? (this._hasProportions && (this._modifier.proportionsFrom(null), this._hasProportions = !1), this) : (this._hasProportions || (this._hasProportions = !0, this._modifier.proportionsFrom(this._proportionsState)), this._proportionsState.set(proportions, transition, callback), this)
    }, StateModifier.prototype.halt = function () {
        this._transformState.halt(), this._opacityState.halt(), this._originState.halt(), this._alignState.halt(), this._sizeState.halt(), this._proportionsState.halt()
    }, StateModifier.prototype.getTransform = function () {
        return this._transformState.get()
    }, StateModifier.prototype.getFinalTransform = function () {
        return this._transformState.getFinal()
    }, StateModifier.prototype.getOpacity = function () {
        return this._opacityState.get()
    }, StateModifier.prototype.getOrigin = function () {
        return this._hasOrigin ? this._originState.get() : null
    }, StateModifier.prototype.getAlign = function () {
        return this._hasAlign ? this._alignState.get() : null
    }, StateModifier.prototype.getSize = function () {
        return this._hasSize ? this._sizeState.get() : null
    }, StateModifier.prototype.getProportions = function () {
        return this._hasProportions ? this._proportionsState.get() : null
    }, StateModifier.prototype.modify = function (target) {
        return this._modifier.modify(target)
    }, module.exports = StateModifier
}), define("famous/views/GridLayout", ["require", "exports", "module", "../core/Entity", "../core/RenderNode", "../core/Transform", "../core/ViewSequence", "../core/EventHandler", "../core/Modifier", "../core/OptionsManager", "../transitions/Transitionable", "../transitions/TransitionableTransform"], function (require, exports, module) {
    function GridLayout(options) {
        this.options = Object.create(GridLayout.DEFAULT_OPTIONS), this.optionsManager = new OptionsManager(this.options), options && this.setOptions(options), this.id = Entity.register(this), this._modifiers = [], this._states = [], this._contextSizeCache = [0, 0], this._dimensionsCache = [0, 0], this._activeCount = 0, this._eventOutput = new EventHandler, EventHandler.setOutputHandler(this, this._eventOutput)
    }

    function _reflow(size, cols, rows) {
        var usableSize = [size[0], size[1]];
        usableSize[0] -= this.options.gutterSize[0] * (cols - 1), usableSize[1] -= this.options.gutterSize[1] * (rows - 1);
        for (var currX, rowSize = Math.round(usableSize[1] / rows), colSize = Math.round(usableSize[0] / cols), currY = 0, currIndex = 0, i = 0; rows > i; i++) {
            currX = 0;
            for (var j = 0; cols > j; j++)void 0 === this._modifiers[currIndex] ? _createModifier.call(this, currIndex, [colSize, rowSize], [currX, currY, 0], 1) : _animateModifier.call(this, currIndex, [colSize, rowSize], [currX, currY, 0], 1), currIndex++, currX += colSize + this.options.gutterSize[0];
            currY += rowSize + this.options.gutterSize[1]
        }
        for (this._dimensionsCache = [this.options.dimensions[0], this.options.dimensions[1]], this._contextSizeCache = [size[0], size[1]], this._activeCount = rows * cols, i = this._activeCount; i < this._modifiers.length; i++)_animateModifier.call(this, i, [Math.round(colSize), Math.round(rowSize)], [0, 0], 0);
        this._eventOutput.emit("reflow")
    }

    function _createModifier(index, size, position, opacity) {
        var transitionItem = {
            transform: new TransitionableTransform(Transform.translate.apply(null, position)),
            opacity: new Transitionable(opacity),
            size: new Transitionable(size)
        }, modifier = new Modifier({
            transform: transitionItem.transform,
            opacity: transitionItem.opacity,
            size: transitionItem.size
        });
        this._states[index] = transitionItem, this._modifiers[index] = modifier
    }

    function _animateModifier(index, size, position, opacity) {
        var currState = this._states[index], currSize = currState.size, currOpacity = currState.opacity, currTransform = currState.transform, transition = this.options.transition;
        currTransform.halt(), currOpacity.halt(), currSize.halt(), currTransform.setTranslate(position, transition), currSize.set(size, transition), currOpacity.set(opacity, transition)
    }

    var Entity = require("../core/Entity"), Transform = (require("../core/RenderNode"), require("../core/Transform")), ViewSequence = require("../core/ViewSequence"), EventHandler = require("../core/EventHandler"), Modifier = require("../core/Modifier"), OptionsManager = require("../core/OptionsManager"), Transitionable = require("../transitions/Transitionable"), TransitionableTransform = require("../transitions/TransitionableTransform");
    GridLayout.DEFAULT_OPTIONS = {
        dimensions: [1, 1],
        transition: !1,
        gutterSize: [0, 0]
    }, GridLayout.prototype.render = function () {
        return this.id
    }, GridLayout.prototype.setOptions = function (options) {
        return this.optionsManager.setOptions(options)
    }, GridLayout.prototype.sequenceFrom = function (sequence) {
        sequence instanceof Array && (sequence = new ViewSequence(sequence)), this.sequence = sequence
    }, GridLayout.prototype.getSize = function () {
        return this._contextSizeCache
    }, GridLayout.prototype.commit = function (context) {
        var transform = context.transform, opacity = context.opacity, origin = context.origin, size = context.size, cols = this.options.dimensions[0], rows = this.options.dimensions[1];
        (size[0] !== this._contextSizeCache[0] || size[1] !== this._contextSizeCache[1] || cols !== this._dimensionsCache[0] || rows !== this._dimensionsCache[1]) && _reflow.call(this, size, cols, rows);
        for (var sequence = this.sequence, result = [], currIndex = 0; sequence && currIndex < this._modifiers.length;) {
            var item = sequence.get(), modifier = this._modifiers[currIndex];
            currIndex >= this._activeCount && this._states[currIndex].opacity.isActive() && (this._modifiers.splice(currIndex, 1), this._states.splice(currIndex, 1)), item && result.push(modifier.modify({
                origin: origin,
                target: item.render()
            })), sequence = sequence.getNext(), currIndex++
        }
        return size && (transform = Transform.moveThen([-size[0] * origin[0], -size[1] * origin[1], 0], transform)), {
            transform: transform,
            opacity: opacity,
            size: size,
            target: result
        }
    }, module.exports = GridLayout
}), define("famous/views/FlexibleLayout", ["require", "exports", "module", "../core/Entity", "../core/Transform", "../core/OptionsManager", "../core/EventHandler", "../transitions/Transitionable"], function (require, exports, module) {
    function FlexibleLayout(options) {
        this.options = Object.create(FlexibleLayout.DEFAULT_OPTIONS), this.optionsManager = new OptionsManager(this.options), options && this.setOptions(options), this.id = Entity.register(this), this._ratios = new Transitionable(this.options.ratios), this._nodes = [], this._size = [0, 0], this._cachedDirection = null, this._cachedLengths = [], this._cachedTransforms = null, this._ratiosDirty = !1, this._eventOutput = new EventHandler, EventHandler.setOutputHandler(this, this._eventOutput)
    }

    function _reflow(ratios, length, direction) {
        var currTransform, ratio, node, i, translation = 0, flexLength = length, ratioSum = 0;
        for (this._cachedLengths = [], this._cachedTransforms = [], i = 0; i < ratios.length; i++)ratio = ratios[i], node = this._nodes[i], "number" != typeof ratio ? flexLength -= node.getSize()[direction] || 0 : ratioSum += ratio;
        for (i = 0; i < ratios.length; i++)node = this._nodes[i], ratio = ratios[i], length = "number" == typeof ratio ? flexLength * ratio / ratioSum : node.getSize()[direction], currTransform = direction === FlexibleLayout.DIRECTION_X ? Transform.translate(translation, 0, 0) : Transform.translate(0, translation, 0), this._cachedTransforms.push(currTransform), this._cachedLengths.push(length), translation += length
    }

    function _trueSizedDirty(ratios, direction) {
        for (var i = 0; i < ratios.length; i++)if ("number" != typeof ratios[i] && this._nodes[i].getSize()[direction] !== this._cachedLengths[i])return !0;
        return !1
    }

    var Entity = require("../core/Entity"), Transform = require("../core/Transform"), OptionsManager = require("../core/OptionsManager"), EventHandler = require("../core/EventHandler"), Transitionable = require("../transitions/Transitionable");
    FlexibleLayout.DIRECTION_X = 0, FlexibleLayout.DIRECTION_Y = 1, FlexibleLayout.DEFAULT_OPTIONS = {
        direction: FlexibleLayout.DIRECTION_X,
        transition: !1,
        ratios: []
    }, FlexibleLayout.prototype.render = function () {
        return this.id
    }, FlexibleLayout.prototype.setOptions = function (options) {
        this.optionsManager.setOptions(options)
    }, FlexibleLayout.prototype.sequenceFrom = function (sequence) {
        if (this._nodes = sequence, 0 === this._ratios.get().length) {
            for (var ratios = [], i = 0; i < this._nodes.length; i++)ratios.push(1);
            this.setRatios(ratios)
        }
    }, FlexibleLayout.prototype.setRatios = function (ratios, transition, callback) {
        void 0 === transition && (transition = this.options.transition);
        var currRatios = this._ratios;
        0 === currRatios.get().length && (transition = void 0), currRatios.isActive() && currRatios.halt(), currRatios.set(ratios, transition, callback), this._ratiosDirty = !0
    }, FlexibleLayout.prototype.getSize = function () {
        return this._size
    }, FlexibleLayout.prototype.commit = function (context) {
        var size, parentSize = context.size, parentTransform = context.transform, parentOrigin = context.origin, parentOpacity = context.opacity, ratios = this._ratios.get(), direction = this.options.direction, length = parentSize[direction];
        (length !== this._size[direction] || this._ratiosDirty || this._ratios.isActive() || direction !== this._cachedDirection || _trueSizedDirty.call(this, ratios, direction)) && (_reflow.call(this, ratios, length, direction), length !== this._size[direction] && (this._size[0] = parentSize[0], this._size[1] = parentSize[1]), direction !== this._cachedDirection && (this._cachedDirection = direction), this._ratiosDirty && (this._ratiosDirty = !1));
        for (var result = [], i = 0; i < ratios.length; i++)size = [void 0, void 0], length = this._cachedLengths[i], size[direction] = length, result.push({
            transform: this._cachedTransforms[i],
            size: size,
            target: this._nodes[i].render()
        });
        return parentSize && 0 !== parentOrigin[0] && 0 !== parentOrigin[1] && (parentTransform = Transform.moveThen([-parentSize[0] * parentOrigin[0], -parentSize[1] * parentOrigin[1], 0], parentTransform)), {
            transform: parentTransform,
            size: parentSize,
            opacity: parentOpacity,
            target: result
        }
    }, module.exports = FlexibleLayout
}), define("views/LanguagePieView", ["require", "exports", "module", "famous/core/Surface", "famous/core/Modifier", "famous/core/Transform", "famous/core/View", "famous/views/FlexibleLayout", "famous/utilities/Timer", "famous/core/EventHandler", "famous/transitions/Transitionable"], function (require, exports, module) {
    function LanguagePieView(genericSync) {
        View.apply(this, arguments), this.eventInput = new EventHandler, this.eventOutput = new EventHandler, EventHandler.setInputHandler(this, this.eventInput), EventHandler.setOutputHandler(this, this.eventOutput);
        var flex = new FlexibleLayout({ratios: [6, 6]}), windowWidth = window.innerWidth, widthScale = (window.innerHeight, .82), svgScale = .1;
        this.contentWidth = widthScale * windowWidth, this.svgWidth = Math.floor(svgScale * windowWidth);
        var svgLanguage = _createLanguageSvg(this.svgWidth), transWidth = new Transitionable([this.contentWidth, 100]);
        window.onresize = function () {
            windowWidth = window.innerWidth
        }, this.languageModifier = new Modifier({
            size: transWidth.get(),
            transform: Transform.translate(0, 0, 10),
            origin: [.5, 0],
            align: [.5, 0]
        }), this.svgLanguage = new Surface({
            size: [void 0, void 0],
            content: svgLanguage,
            properties: {fontSize: "11px", zIndex: 10}
        }), this.textLanguage = new Surface({
            size: [void 0, void 0],
            content: "<h2> Language</h2><p>Ukrainian, Lithuanian, Bulgarian, and other Eastern European communities speak Russian, which makes the Russian speaking community the second largest segment of the foreign born US population, which is estimated at 5 million people.</p>",
            properties: {zIndex: 10}
        });
        var languageContent = [];
        languageContent.push(this.svgLanguage), languageContent.push(this.textLanguage), flex.sequenceFrom(languageContent), this.bgColor = new Surface({
            size: [void 0, void 0],
            properties: {backgroundColor: "#FFFAE2"}
        }), this.svgLanguage.pipe(genericSync), this.add(this.bgColor), this.add(this.languageModifier).add(flex)
    }

    function _createLanguageSvg(width) {
        var svgLanguage = document.createElementNS(d3.ns.prefix.svg, "svg"), w = width, h = w, r = h / 2, color = d3.scale.category20c(), data = [{
            label: "Russian",
            value: 20
        }, {label: "Hispanic", value: 65}, {
            label: "Others",
            value: 25
        }], vis = d3.select(svgLanguage).data([data]).attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + r + "," + r + ")"), pie = d3.layout.pie().value(function (d) {
            return d.value
        }), arc = d3.svg.arc().outerRadius(r), arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
        return arcs.append("svg:path").attr("fill", function (d, i) {
            return color(i)
        }).attr("d", function (d) {
            return arc(d)
        }), arcs.append("svg:text").attr("transform", function (d) {
            return d.innerRadius = 0, d.outerRadius = r, "translate(" + arc.centroid(d) + ")"
        }).attr("text-anchor", "middle").text(function (d, i) {
            return data[i].label
        }), svgLanguage
    }

    var Surface = require("famous/core/Surface"), Modifier = require("famous/core/Modifier"), Transform = require("famous/core/Transform"), View = require("famous/core/View"), FlexibleLayout = require("famous/views/FlexibleLayout"), EventHandler = (require("famous/utilities/Timer"), require("famous/core/EventHandler")), Transitionable = require("famous/transitions/Transitionable");
    LanguagePieView.prototype = Object.create(View.prototype), LanguagePieView.prototype.constructor = LanguagePieView, LanguagePieView.DEFAULT_OPTIONS = {}, module.exports = LanguagePieView
}), define("text", ["module"], function (module) {
    var text, fs, Cc, Ci, xpcIsWindows, progIds = ["Msxml2.XMLHTTP", "Microsoft.XMLHTTP", "Msxml2.XMLHTTP.4.0"], xmlRegExp = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im, bodyRegExp = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im, hasLocation = "undefined" != typeof location && location.href, defaultProtocol = hasLocation && location.protocol && location.protocol.replace(/\:/, ""), defaultHostName = hasLocation && location.hostname, defaultPort = hasLocation && (location.port || void 0), buildMap = {}, masterConfig = module.config && module.config() || {};
    return text = {
        version: "2.0.12", strip: function (content) {
            if (content) {
                content = content.replace(xmlRegExp, "");
                var matches = content.match(bodyRegExp);
                matches && (content = matches[1])
            } else content = "";
            return content
        }, jsEscape: function (content) {
            return content.replace(/(['\\])/g, "\\$1").replace(/[\f]/g, "\\f").replace(/[\b]/g, "\\b").replace(/[\n]/g, "\\n").replace(/[\t]/g, "\\t").replace(/[\r]/g, "\\r").replace(/[\u2028]/g, "\\u2028").replace(/[\u2029]/g, "\\u2029")
        }, createXhr: masterConfig.createXhr || function () {
            var xhr, i, progId;
            if ("undefined" != typeof XMLHttpRequest)return new XMLHttpRequest;
            if ("undefined" != typeof ActiveXObject)for (i = 0; 3 > i; i += 1) {
                progId = progIds[i];
                try {
                    xhr = new ActiveXObject(progId)
                } catch (e) {
                }
                if (xhr) {
                    progIds = [progId];
                    break
                }
            }
            return xhr
        }, parseName: function (name) {
            var modName, ext, temp, strip = !1, index = name.indexOf("."), isRelative = 0 === name.indexOf("./") || 0 === name.indexOf("../");
            return -1 !== index && (!isRelative || index > 1) ? (modName = name.substring(0, index), ext = name.substring(index + 1, name.length)) : modName = name, temp = ext || modName, index = temp.indexOf("!"), -1 !== index && (strip = "strip" === temp.substring(index + 1), temp = temp.substring(0, index), ext ? ext = temp : modName = temp), {
                moduleName: modName,
                ext: ext,
                strip: strip
            }
        }, xdRegExp: /^((\w+)\:)?\/\/([^\/\\]+)/, useXhr: function (url, protocol, hostname, port) {
            var uProtocol, uHostName, uPort, match = text.xdRegExp.exec(url);
            return match ? (uProtocol = match[2], uHostName = match[3], uHostName = uHostName.split(":"), uPort = uHostName[1], uHostName = uHostName[0], !(uProtocol && uProtocol !== protocol || uHostName && uHostName.toLowerCase() !== hostname.toLowerCase() || (uPort || uHostName) && uPort !== port)) : !0
        }, finishLoad: function (name, strip, content, onLoad) {
            content = strip ? text.strip(content) : content, masterConfig.isBuild && (buildMap[name] = content), onLoad(content)
        }, load: function (name, req, onLoad, config) {
            if (config && config.isBuild && !config.inlineText)return void onLoad();
            masterConfig.isBuild = config && config.isBuild;
            var parsed = text.parseName(name), nonStripName = parsed.moduleName + (parsed.ext ? "." + parsed.ext : ""), url = req.toUrl(nonStripName), useXhr = masterConfig.useXhr || text.useXhr;
            return 0 === url.indexOf("empty:") ? void onLoad() : void(!hasLocation || useXhr(url, defaultProtocol, defaultHostName, defaultPort) ? text.get(url, function (content) {
                text.finishLoad(name, parsed.strip, content, onLoad)
            }, function (err) {
                onLoad.error && onLoad.error(err)
            }) : req([nonStripName], function (content) {
                text.finishLoad(parsed.moduleName + "." + parsed.ext, parsed.strip, content, onLoad)
            }))
        }, write: function (pluginName, moduleName, write) {
            if (buildMap.hasOwnProperty(moduleName)) {
                var content = text.jsEscape(buildMap[moduleName]);
                write.asModule(pluginName + "!" + moduleName, "define(function () { return '" + content + "';});\n")
            }
        }, writeFile: function (pluginName, moduleName, req, write, config) {
            var parsed = text.parseName(moduleName), extPart = parsed.ext ? "." + parsed.ext : "", nonStripName = parsed.moduleName + extPart, fileName = req.toUrl(parsed.moduleName + extPart) + ".js";
            text.load(nonStripName, req, function () {
                var textWrite = function (contents) {
                    return write(fileName, contents)
                };
                textWrite.asModule = function (moduleName, contents) {
                    return write.asModule(moduleName, fileName, contents)
                }, text.write(pluginName, nonStripName, textWrite, config)
            }, config)
        }
    }, "node" === masterConfig.env || !masterConfig.env && "undefined" != typeof process && process.versions && process.versions.node && !process.versions["node-webkit"] ? (fs = require.nodeRequire("fs"), text.get = function (url, callback, errback) {
        try {
            var file = fs.readFileSync(url, "utf8");
            0 === file.indexOf("﻿") && (file = file.substring(1)), callback(file)
        } catch (e) {
            errback && errback(e)
        }
    }) : "xhr" === masterConfig.env || !masterConfig.env && text.createXhr() ? text.get = function (url, callback, errback, headers) {
        var header, xhr = text.createXhr();
        if (xhr.open("GET", url, !0), headers)for (header in headers)headers.hasOwnProperty(header) && xhr.setRequestHeader(header.toLowerCase(), headers[header]);
        masterConfig.onXhr && masterConfig.onXhr(xhr, url), xhr.onreadystatechange = function () {
            var status, err;
            4 === xhr.readyState && (status = xhr.status || 0, status > 399 && 600 > status ? (err = new Error(url + " HTTP status: " + status), err.xhr = xhr, errback && errback(err)) : callback(xhr.responseText), masterConfig.onXhrComplete && masterConfig.onXhrComplete(xhr, url))
        }, xhr.send(null)
    } : "rhino" === masterConfig.env || !masterConfig.env && "undefined" != typeof Packages && "undefined" != typeof java ? text.get = function (url, callback) {
        var stringBuffer, line, encoding = "utf-8", file = new java.io.File(url), lineSeparator = java.lang.System.getProperty("line.separator"), input = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(file), encoding)), content = "";
        try {
            for (stringBuffer = new java.lang.StringBuffer, line = input.readLine(), line && line.length() && 65279 === line.charAt(0) && (line = line.substring(1)), null !== line && stringBuffer.append(line); null !== (line = input.readLine());)stringBuffer.append(lineSeparator), stringBuffer.append(line);
            content = String(stringBuffer.toString())
        } finally {
            input.close()
        }
        callback(content)
    } : ("xpconnect" === masterConfig.env || !masterConfig.env && "undefined" != typeof Components && Components.classes && Components.interfaces) && (Cc = Components.classes, Ci = Components.interfaces, Components.utils["import"]("resource://gre/modules/FileUtils.jsm"), xpcIsWindows = "@mozilla.org/windows-registry-key;1"in Cc, text.get = function (url, callback) {
        var inStream, convertStream, fileObj, readData = {};
        xpcIsWindows && (url = url.replace(/\//g, "\\")), fileObj = new FileUtils.File(url);
        try {
            inStream = Cc["@mozilla.org/network/file-input-stream;1"].createInstance(Ci.nsIFileInputStream), inStream.init(fileObj, 1, 0, !1), convertStream = Cc["@mozilla.org/intl/converter-input-stream;1"].createInstance(Ci.nsIConverterInputStream), convertStream.init(inStream, "utf-8", inStream.available(), Ci.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER), convertStream.readString(inStream.available(), readData), convertStream.close(), inStream.close(), callback(readData.value)
        } catch (e) {
            throw new Error((fileObj && fileObj.path || "") + ": " + e)
        }
    }), text
}), define("text!jade/demographicsPage.html", [], function () {
    return '\n<section class="svet-services">\n  <article class="dem-content-top">\n    <div class="h-services text-center">Demographics</div>\n    <p class="text-center">The Russian - American population in the United States is estimated at nearly</p>\n    <h2 class="text-center">2.9 million people</h2><br/>\n    <p>It is the second largest ethnic market, making up 10.4% of 28.4 million foreign born people in the country.</p>\n    <h4>States with the highest concentration of the Russian-American population:</h4>\n    <p>New York Tri-State area – 24% (approx. 696,000 people)<br/>California – 17% (approx. 493,000 people)<br/>Illinois – 16% (approx. 464,000 plus people)</p>\n  </article>\n  <aside class="sun-times">\n    <div class="chicago-news text-center"><img src="img/dem/map.jpg"/></div>\n  </aside>\n</section>'
}), define("views/DemographicView", ["require", "exports", "module", "famous/core/Surface", "famous/core/Modifier", "famous/core/Transform", "famous/core/View", "famous/views/GridLayout", "famous/utilities/Timer", "famous/core/EventHandler", "views/LanguagePieView", "text!jade/demographicsPage.html"], function (require, exports, module) {
    function DemographicView(genericSync) {
        View.apply(this, arguments), this.eventInput = new EventHandler, this.eventOutput = new EventHandler, EventHandler.setInputHandler(this, this.eventInput), EventHandler.setOutputHandler(this, this.eventOutput);
        var demographicsPart1 = require("text!jade/demographicsPage.html");
        this.contentPart1 = new Surface({
            size: [void 0, void 0],
            content: demographicsPart1,
            properties: {backgroundColor: "#FFFAE2"}
        }), this.languagePieView = new LanguagePieView(genericSync);
        var demographContent = [];
        demographContent.push(this.contentPart1), demographContent.push(this.languagePieView);
        var grid = new GridLayout({direction: 1, dimensions: [1, 2]});
        grid.sequenceFrom(demographContent), this.add(grid), this.contentPart1.pipe(genericSync)
    }

    var Surface = require("famous/core/Surface"), View = (require("famous/core/Modifier"), require("famous/core/Transform"), require("famous/core/View")), GridLayout = require("famous/views/GridLayout"), EventHandler = (require("famous/utilities/Timer"), require("famous/core/EventHandler")), LanguagePieView = require("views/LanguagePieView");
    DemographicView.prototype = Object.create(View.prototype), DemographicView.prototype.constructor = DemographicView, DemographicView.DEFAULT_OPTIONS = {}, module.exports = DemographicView
}), define("text!jade/homePage.html", [], function () {
    return '\n<section>\n  <article class="svet-media-group">\n    <h2 class="h-services text-center">SVET Russian Media Group</h2>\n    <p class="text-center">is the Midwest’s first and oldest publishing and advertising company serving the Russian, Ukrainian and Lithuanian communities since 1990.</p>\n  </article>\n  <article class="svet-services">\n    <div class="productsServises">\n      <div class="home-icon-container news-daily"><img src="img/home-page/news-daily.png"/></div>\n      <div class="h-home">SVET<br/>Daily Newspaper</div>\n      <p>Over 48 pages – circulation 12,000 copies weekly. It is the most up-to-date Russian language newspaper outside of Russia. It appears on the newsstands after 3:00 PM. It is free of charge. In addition, subscribers receive newspapers in their homes via second class mail.</p>\n    </div>\n    <div class="productsServises">\n      <div class="home-icon-container container-yp">\n        <div class="news-weekly"><img src="img/home-page/yellow-pages.png"/></div>\n      </div>\n      <div class="h-home">Russian-American<br/>Yellow Pages</div>\n      <p>The Russian Yellow Pages present over 650 full color pages of services and products to the Russian-speaking community in the Chicagoland area. Free distribution in Chicago and its North and Northwestern suburbs.</p>\n    </div>\n    <div class="productsServises">\n      <div class="home-icon-container container-weekly">\n        <div class="news-weekly"><img src="img/home-page/news-weekly.png"/></div>\n      </div>\n      <div class="h-home">Saturday Plus<br/>Weekly Newspaper</div>\n      <p>Free Paper with over 48 pages weekly. It covers entertainment and other social news in Unites States and abroad. It packs the latest information on travel destinations and hot vacation spots.</p>\n    </div>\n    <div class="productsServises">\n      <div class="home-icon-container container-radio">\n        <div class="news-weekly"><img src="img/home-page/radio2.png"/></div>\n      </div>\n      <div class="h-home">Radio<br/>Program “OSA”</div>\n      <p>Sunday morning talk show with Alex Etman airs every Sunday on 1240 AM radio from 11:00 a.m. to 1:00 p.m. listen to Radio OSA programs.</p>\n    </div>\n  </article>\n</section>'
}), define("text!jade/aboutUsPage.html", [], function () {
    return '\n<section class="svet-services">\n  <aside class="sun-times">\n    <div class="chicago-news text-center"><img src="img/aboutUs/aboutus_1.jpg"/></div>\n  </aside>\n  <article class="about-content-top">\n    <div class="h-services text-center">SVET International publishing house</div>\n    <p>From the viewpoint of our partners SVET International Publishing House is a typical "company with the past", which basic philosophy is hinged upon well-taken conservatism, weighed approach and clear calculations. It was not for nothing that all previous outside convulsions and crises bypassed our publishing house. Our meticulous attitude towards entering into deals is completely justified by strict performance of undertaken liabilities and flawless financial stability.</p>\n    <p>The competitors consider SVET International Publishing House to be a typical "company with the future", with steady dynamic growth of all indicators which have to be taken into account willingly or not. Once in two years a completely new project is given birth, which is introducing radical changes into the ethnic publishing market in Chicagoland.</p>\n    <p>Our colleagues recognize with an imperceptible shade of envy that the SVET International Publishing house managed to combine incompatible things: the creative approach to technologies and technological approach to creativity.</p>\n  </article>\n</section>\n<section class="svet-services"><br/>\n  <article class="about-content-bottom">\n    <p>One more feature is even more intriguing. For some reason it is a current belief that poverty and dependence are inherent to the nature of every writing person. This formula is overturned by the very existence of SVET Publishing House where creativity in journalism is rated as high as commercial or administrative skills.</p>\n    <p>The fact of popularity of SVET\'s publications speaks for itself and do not need any further commends. Each paper is ranking highest among other press publications in its field. The total circulation of publishing house is leading well ahead all other Chicago-based Russian language press publications at large.</p>\n    <p>Over the past THIRTEEN years our publishing house has accumulated a considerable brainpower and intellectual potential. Journalists and designers regard invitation for work in SVET International Publishing House as a highest appreciation of their proficiency and skills.</p>\n    <p>What does it mean in the real life? Our partners can completely rely on immaculate professionalism of our managers. They have the best authors and designers at their command. SVET International Publishing House is associated not only with the most effective advertising media. It is a great source of new ideas!</p>\n  </article>\n  <aside class="sun-times">\n    <div class="chicago-news text-center"><img src="img/aboutUs/aboutus_2.jpg"/></div>\n  </aside>\n</section>'
}), define("text!jade/clientsPage.html", [], function () {
    return '\n<section class="svet-services">\n  <div class="h-services text-center">Our Clients</div>\n  <article>\n    <div class="clients-content">\n      <h2>Finance</h2>\n      <ul>\n        <li>MB Financial Bank</li>\n        <li>Harris Bank</li>\n        <li>ColeTaylor Bank</li>\n        <li>Devon Bank</li>\n        <li>Western Union</li>\n        <li>Bank Financial</li>\n        <li>Robbins & Lloyd Mortgage Corporation</li>\n        <li><em>And more...</em></li>\n      </ul>\n    </div>\n    <div class="clients-content">\n      <h2>Auto</h2>\n      <ul>\n        <li>Arlington Toyota</li>\n        <li>Berman’s Auto Group</li>\n        <li>Castle Honda</li>\n        <li>Fields Dodge and Jeep</li>\n        <li>Fields Infinity</li>\n        <li>Harley Davidson</li>\n        <li>Lexus of Orland</li>\n        <li>Prestige Leasing</li>\n        <li>Rich\'s Yamaha</li>\n        <li>Star Nissan</li>\n        <li><em>And more...</em></li>\n      </ul>\n    </div>\n    <div class="clients-content">\n      <h2>Stores</h2>\n      <ul>\n        <li>Studio 41 Home Design</li>\n        <li>Home Depot</li>\n        <li>C.D. Peacock</li>\n        <li>Fresh Farms</li>\n        <li>Highland Health Food</li>\n        <li>Garden Fresh</li>\n        <li>Farmers Best</li>\n        <li>H-Mart</li>\n        <li>Bende’s Specialty Foods</li>\n        <li>Jimenez</li>\n        <li><em>And more...</em></li>\n      </ul>\n    </div>\n  </article>\n  <article>\n    <div class="clients-content">\n      <h2>Restaurants</h2>\n      <ul>\n        <li>Maggiano’s</li>\n        <li>McCormick and Schmicks</li>\n        <li>Zhivago (Skokie)</li>\n        <li>Kamehachi (Chicago, Northbrook)</li>\n        <li>Gridley’s Grille (Long Grove)</li>\n        <li>Bella Via (Highland Park)</li>\n        <li>Dover Straits</li>\n        <li>Elephant (Niles)</li>\n        <li>Michael (Winnetka)</li>\n        <li>Le Titi De Paris (Arl Hts)</li>\n        <li>India House (Buffalo Grove)</li>\n        <li>Jimmy’s Charhouse (Riverwoods)</li>\n        <li>Omega (Niles)</li>\n        <li>Tapas Gitana (Northfield)</li>\n        <li>Raw Bar (Chicago)</li>\n        <li>Wild Fish (Arl Hts)</li>\n        <li>Brazzaz (Chicago)</li>\n        <li><em>And more...</em></li>\n      </ul>\n    </div>\n    <div class="clients-content">\n      <h2>Insurance</h2>\n      <ul>\n        <li>Allstate Insurance / Roman Sher</li>\n        <li>State Farm Insurance / Bonnie Perkovich</li>\n        <li>Country Insurance / Paul Moskvitin</li>\n        <li>Country Insurance / Yelena Sokolova</li>\n        <li>American Family insurance / Renata Tolvaisaite</li>\n        <li><em>And more...</em></li>\n      </ul>\n      <h2>Health</h2>\n      <ul>\n        <li>Pearle Vision</li>\n        <li>Women’s Health First</li>\n        <li>Gordin Medical Center</li>\n        <li>Rush North Shore Medical Center</li>\n        <li>IL Dental Center</li>\n        <li>North Shore Vascular</li>\n        <li>Mount Sinai Hospital</li>\n        <li>Dr. Elena Levitina</li>\n        <li>Healthy Trust<em>And more...</em></li>\n      </ul>\n    </div>\n    <div class="clients-content">\n      <h2>Attorneys</h2>\n      <ul>\n        <li>Davidson & Schiller, LLC</li>\n        <li>Chepov & Scott</li>\n        <li>Law Office of A. Gruzmark</li>\n        <li>Law Office of A. Liberfarb</li>\n        <li>DeFrenza, Moskoni Matyjewicz, P.C.</li>\n        <li>Birg & Meltser</li>\n        <li>Law office of A. Tolmatsky</li>\n        <li>Law Office of L. Golub</li>\n        <li>Law office of M. Kern</li>\n        <li> Slava A. Tenenbaum, chartered</li>\n        <li>Barry Rabovsky</li>\n        <li><em>And more...</em></li>\n      </ul>\n    </div>\n  </article>\n  <!--article-->\n  <!--    .clients-img-container-->\n  <!--        img(src="img/clients/clientsBEST.jpg")-->\n</section>'
}), define("text!jade/radioPage.html", [], function () {
    return '\n<section class="svet-services">\n  <div class="h-services text-center">Radio "OSA"</div>\n  <div class="live-radio text-center"><a href="mms://medik.imcpro.com/svet_live"><img src="img/radio/radio_5.png"/></a>\n    <h2><a href="mms://medik.imcpro.com/svet_live">Live Translation</a></h2>\n  </div><br/>\n  <hr/><br/>\n  <h2>Archive 2014</h2>\n  <article>\n    <div class="radio-content-inline winter">\n      <h4>December</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2014-12-28.asf">12.28.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-12-21.asf">12.21.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-12-14.asf">12.14.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-12-07.asf">12.07.2014</a></p>\n    </div>\n    <div class="radio-content-inline fall">\n      <h4>November</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2014-11-30.asf">11.30.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-11-23.asf">11.23.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-11-16.asf">11.16.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-11-09.asf">11.09.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-11-02.asf">11.02.2014</a></p>\n    </div>\n    <div class="radio-content-inline fall">\n      <h4>October</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2014-10-26.asf">10.26.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-10-19_001.asf">10.19.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-10-19.asf">10.19.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-10-12.asf">10.12.2014</a></p>\n    </div>\n    <div class="radio-content-inline fall">\n      <h4>September</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2014-09-28.asf">09.28.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-09-21.asf">09.21.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-09-14.asf">09.14.2014</a></p>\n    </div>\n    <div class="radio-content-inline summer">\n      <h4>August</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2014-08-31.asf">08.31.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-08-24.asf">08.24.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-08-17.asf">08.17.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-08-10.asf">08.10.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-08-03.asf">08.03.2014</a></p>\n    </div>\n    <div class="radio-content-inline summer">\n      <h4>July</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2014-07-27.asf">07.27.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-07-20.asf">07.20.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-07-13_001.asf">07.13.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-07-13.asf">07.13.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-07-06.asf">07.06.2014</a></p>\n    </div>\n    <div class="radio-content-inline summer">\n      <h4>June</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2014-06-29.asf">06.29.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-06-22.asf">06.22.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-06-15.asf">06.15.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-06-08.asf">06.08.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-06-01.asf">06.01.2014</a></p>\n    </div>\n    <div class="radio-content-inline spring">\n      <h4>May</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2014-05-25.asf">05.25.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-05-18.asf">05.18.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-05-04.asf">05.04.2014</a></p>\n    </div>\n    <div class="radio-content-inline spring">\n      <h4>April</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2014-04-27.asf">04.27.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-04-21.asf">04.21.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-04-20.asf">04.20.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-04-13.asf">04.13.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-04-06.asf">04.06.2014</a></p>\n    </div>\n    <div class="radio-content-inline spring">\n      <h4>March</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2014-03-30.asf">03.30.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-03-23.asf">03.23.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-03-16.asf">03.16.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-03-09.asf">03.09.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-03-02.asf">03.02.2014</a></p>\n    </div>\n    <div class="radio-content-inline winter">\n      <h4>February</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2014-02-23.asf">02.23.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-02-16.asf">02.16.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-02-09.asf">02.09.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-02-02.asf">02.02.2014</a></p>\n    </div>\n    <div class="radio-content-inline winter">\n      <h4>January</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2014-01-26.asf">01.26.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-01-19.asf">01.19.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-01-12.asf">01.12.2014</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2014-01-09.asf">01.09.2014</a></p>\n    </div>\n  </article>\n</section>\n<section class="svet-services"><br/>\n  <hr/><br/>\n  <h2>Archive 2013</h2>\n  <article>\n    <div class="radio-content-inline winter">\n      <h4>December</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2013-12-29.asf">12.29.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-12-22.asf">12.22.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-12-15.asf">12.15.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-12-08.asf">12.08.2013</a></p>\n    </div>\n    <div class="radio-content-inline fall">\n      <h4>November</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2013-11-24.asf">11.24.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-11-17_001.asf">11.17.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-11-17.asf">11.17.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-11-10_002.asf">11.10.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-11-10_001.asf">11.10.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-11-10.asf">11.10.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-11-03.asf">11.03.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-11-03_002.asf">11.03.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-11-03_001.asf">11.03.2013</a></p>\n    </div>\n    <div class="radio-content-inline fall">\n      <h4>October</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2013-10-27.asf">10.27.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-10-20_001.asf">10.20.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-10-20.asf">10.20.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-10-13.asf">10.13.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-10-06_002.asf">10.06.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-10-06_001.asf">10.06.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-10-06.asf">10.06.2013</a></p>\n    </div>\n    <div class="radio-content-inline fall">\n      <h4>September</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2013-09-29.asf">09.29.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-09-22.asf">09.22.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-09-22_001.asf">09.22.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-09-22_002.asf">09.22.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-09-15.asf">09.15.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-09-08_001.asf">09.08.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-09-08.asf">09.08.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-09-08_002.asf">09.08.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-09-01_003.asf">09.01.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-09-01_002.asf">09.01.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-09-01_001.asf">09.01.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-09-01.asf">09.01.2013</a></p>\n    </div>\n    <div class="radio-content-inline summer">\n      <h4>August</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2013-08-25.asf">08.25.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-08-25_001.asf">08.25.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-08-25_003.asf">08.25.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-08-25_002.asf">08.25.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-08-18_002.asf">08.18.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-08-18_001.asf">08.18.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-08-18.asf">08.18.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-08-11_003.asf">08.11.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-08-11_002.asf">08.11.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-08-11_001.asf">08.11.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-08-11.asf">08.11.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-08-04.asf">08.04.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-08-04_002.asf">08.04.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-08-04_001.asf">08.04.2013</a></p>\n    </div>\n    <div class="radio-content-inline summer">\n      <h4>July</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2013-07-30.asf">07.30.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-07-22.asf">07.22.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-07-14.asf">07.14.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-07-14_001.asf">07.14.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-07-08.asf">07.08.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-07-07_001.asf">07.07.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-07-07.asf">07.07.2013</a></p>\n    </div>\n    <div class="radio-content-inline summer">\n      <h4>June</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2013-06-30_001.asf">06.30.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-06-30.asf">06.30.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-06-23.asf">06.23.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-06-16.asf">06.16.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-06-09.asf">06.09.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-06-02.asf">06.02.2013</a></p>\n    </div>\n    <div class="radio-content-inline spring">\n      <h4>May</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2013-05-26.asf">05.26.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-05-20.asf">05.20.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-05-20_001.asf">05.20.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-05-19.asf">05.19.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-05-12.asf">05.12.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-05-06.asf">05.06.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-05-02.asf">05.02.2013</a></p>\n    </div>\n    <div class="radio-content-inline spring">\n      <h4>April</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2013-04-30.asf">04.30.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-04-29.asf">04.29.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-04-29_001.asf">04.29.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-04-29_002.asf">04.29.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-04-29_004.asf">04.29.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-04-29_003.asf">04.29.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-04-29_005.asf">04.29.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-04-28.asf">04.28.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-04-25_002.asf">04.25.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-04-25_001.asf">04.25.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-04-25.asf">04.25.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-04-21_001.asf">04.21.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-04-21.asf">04.21.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-04-14.asf">04.14.2013</a></p>\n    </div>\n    <div class="radio-content-inline spring">\n      <h4>March</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2013-03-10.asf">03.10.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-03-10_001.asf">03.10.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-03-03_002.asf">03.03.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-03-03_001.asf">03.03.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-03-03.asf">03.03.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-03-03_003.asf">03.03.2013</a></p>\n    </div>\n    <div class="radio-content-inline winter">\n      <h4>February</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2013-02-24.asf">02.24.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-02-17.asf">02.17.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-02-10.asf">02.10.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-02-03.asf">02.03.2013</a></p>\n    </div>\n    <div class="radio-content-inline winter">\n      <h4>January</h4>\n      <p><a href="mms://strean.imcpro.com/svet/2013-01-27.asf">01.27.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-01-20.asf">01.20.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-01-13.asf">01.13.2013</a></p>\n      <p><a href="mms://strean.imcpro.com/svet/2013-01-06.asf">01.06.2013</a></p>\n    </div>\n  </article>\n</section>'
}), define("text!jade/contactUsPage.html", [], function () {
    return '\n<section class="svet-services">\n  <div class="h-services text-center">Contact Us</div><br/>\n  <article class="dem-content-bottom">\n    <table width="220" border="0" cellspacing="0" cellpadding="0" style="margin-top:10px;" class="simpleText">\n      <tbody>\n        <tr>\n          <td> </td>\n          <td colspan="2">900 Skokie Blvd., Suite 103, Northbrook, IL 60062<br/>Tel. (847)715-9407<br/>Fax: (847)715-9677<br/>E-mail:<a href="mailto:svet@svet.com" class="menu2"> manager@svet.com</a></td>\n        </tr>\n        <tr>\n          <td colspan="3" height="8"></td>\n        </tr>\n      </tbody>\n    </table>\n  </article>\n</section>'
}), define("views/HomeScroll", ["require", "exports", "module", "famous/core/Surface", "famous/core/Modifier", "famous/core/Transform", "famous/core/View", "famous/views/ScrollContainer", "famous/core/ViewSequence", "famous/modifiers/StateModifier", "famous/core/EventHandler", "d3/d3", "views/DemographicView", "text!jade/homePage.html", "text!jade/aboutUsPage.html", "text!jade/clientsPage.html", "text!jade/radioPage.html", "text!jade/contactUsPage.html"], function (require, exports, module) {
    function HomeScroll(sync) {
        this.generalSync = sync, this.eventInput = new EventHandler, EventHandler.setInputHandler(this, this.eventInput), this.eventInput.on("pageChange", function (index) {
            alert(index)
        }), ScrollContainer.apply(this, arguments), _createContent.call(this), this.scrollview.setOptions({
            pageSwitchSpeed: .2,
            paginated: !0,
            friction: .005,
            drag: 1e-4,
            edgeGrip: .2,
            edgePeriod: 300,
            edgeDamp: 1,
            speedLimit: 1,
            margin: 5330
        })
    }

    function _createContent() {
        var that = this, genericSync = this.generalSync, homePage = require("text!jade/homePage.html"), aboutUsPage = require("text!jade/aboutUsPage.html");
        this.demographicsPage = new DemographicView(genericSync);
        var clientsPage = require("text!jade/clientsPage.html"), radioPage = require("text!jade/radioPage.html"), contactUsPage = require("text!jade/contactUsPage.html");
        this.contents = [], this.contentHome = new Surface({
            size: [void 0, void 0],
            content: homePage,
            properties: {fontSize: "16px", backgroundColor: "#FFE1D0"}
        }), this.contentAbout = new Surface({
            size: [void 0, void 0],
            content: aboutUsPage,
            properties: {backgroundColor: "#E6FFEF"}
        }), this.contentClients = new Surface({
            size: [void 0, void 0],
            content: clientsPage,
            properties: {backgroundColor: "#E6FFDB"}
        }), this.contentRadio = new Surface({
            size: [void 0, void 0],
            content: radioPage,
            properties: {backgroundColor: "#FFF1E9"}
        }), this.contentContact = new Surface({
            size: [void 0, void 0],
            content: contactUsPage,
            properties: {backgroundColor: "#FFE1D0"}
        }), this.contentHome.pipe(genericSync), this.contentAbout.pipe(genericSync), this.demographicsPage.pipe(genericSync), this.contentClients.pipe(genericSync), this.contentRadio.pipe(genericSync), this.contentContact.pipe(genericSync), genericSync.on("start", function () {
        }), genericSync.on("update", function (data) {
            delta = data.delta[1], delta < 0 ? that.scrollview.goToNextPage() : that.scrollview.goToPreviousPage()
        }), genericSync.on("end", function () {
        }), this.contents.push(this.demographicsPage), this.contents.push(this.contentHome), this.contents.push(this.contentAbout), this.contents.push(this.contentClients), this.contents.push(this.contentRadio), this.contents.push(this.contentContact), this.sequenceFrom(this.contents)
    }

    var Surface = require("famous/core/Surface"), ScrollContainer = (require("famous/core/Modifier"), require("famous/core/Transform"), require("famous/core/View"), require("famous/views/ScrollContainer")), EventHandler = (require("famous/core/ViewSequence"), require("famous/modifiers/StateModifier"), require("famous/core/EventHandler")), DemographicView = (require("d3/d3"), require("views/DemographicView"));
    HomeScroll.prototype = Object.create(ScrollContainer.prototype), HomeScroll.prototype.constructor = HomeScroll, HomeScroll.DEFAULT_OPTIONS = {}, module.exports = HomeScroll
}), define("views/HeaderView", ["require", "exports", "module", "famous/core/Surface", "famous/core/Modifier", "famous/core/Transform", "famous/core/View"], function (require, exports, module) {
    function HeaderView() {
        View.apply(this, arguments), _createHeader.call(this), _setListeners.call(this)
    }

    function _createHeader() {
        var backgroundSurface = new Surface({size: [void 0, void 0], properties: {backgroundColor: "#FC6E51"}});
        this.hamburgerSurface = new Surface({
            size: [53, void 0],
            content: '<img width="53" src="../../img/hamburger-template.png"/>',
            properties: {zIndex: "10"}
        }), this.titleSurface = new Surface({
            size: [void 0, void 0],
            content: "SVET Media Group",
            properties: {
                fontSize: "22px",
                textAlign: "center",
                color: "white",
                lineHeight: "50px",
                fontWeight: "700",
                backgroundColor: "#FC6E51"
            }
        }), this.hamburgerModifier = new Modifier({transform: Transform.translate(0, 0, 2)}), this.bgModifier = new Modifier({transform: Transform.translate(0, 0, 1)}), this.titleModifier = new Modifier({
            transform: Transform.translate(0, 0, 1),
            origin: [.5, 0],
            align: [.5, 0]
        }), this._add(this.titleModifier).add(this.titleSurface), this._add(this.hamburgerModifier).add(this.hamburgerSurface), this._add(backgroundSurface)
    }

    function _setListeners() {
        this.hamburgerSurface.on("touchstart", function () {
            this.hamburgerModifier.setOpacity(.5)
        }.bind(this)), this.hamburgerSurface.on("mousedown", function () {
            this.hamburgerModifier.setOpacity(.5)
        }.bind(this)), this.hamburgerSurface.on("click", function () {
            this.hamburgerModifier.setOpacity(1), this._eventOutput.emit("menuToggle")
        }.bind(this))
    }

    var Surface = require("famous/core/Surface"), Modifier = require("famous/core/Modifier"), Transform = require("famous/core/Transform"), View = require("famous/core/View");
    HeaderView.prototype = Object.create(View.prototype), HeaderView.prototype.constructor = HeaderView, module.exports = HeaderView
}), define("views/PageView", ["require", "exports", "module", "d3/d3", "famous/core/Surface", "famous/core/Modifier", "famous/core/Transform", "famous/core/View", "views/HomeScroll", "famous/views/HeaderFooterLayout", "famous/views/GridLayout", "views/HeaderView", "text!jade/homePage.html", "text!jade/aboutUsPage.html", "text!jade/demographicsPage.html", "text!jade/clientsPage.html", "text!jade/radioPage.html", "famous/inputs/GenericSync", "famous/inputs/MouseSync", "famous/inputs/TouchSync", "famous/inputs/ScrollSync", "famous/core/Transform", "famous/transitions/Transitionable"], function (require, exports, module) {
    function PageView() {
        var that = this;
        GenericSync.register({touch: TouchSync, scroll: ScrollSync});
        var genericSync = new GenericSync(["mouse", "touch", "scroll"]);
        View.apply(this, arguments), this.layout = new HeaderFooterLayout({
            headerSize: 50,
            footerSize: 50
        }), this.header = new HeaderView, this.header.pipe(this), this.content = new HomeScroll(genericSync), this.content.pipe(this);
        var prevElement, prevElementTemp, currentElement, currentElementTemp, direction, currentIndex = 0;
        genericSync.on("update", function (data) {
            delta = data.delta[1], delta < 0 ? (direction = -1, currentIndex++) : (currentIndex--, direction = 1), currentIndex > 5 && (currentIndex = 5), 0 > currentIndex && (currentIndex = 0);
            try {
                prevElementTemp = that.states[currentIndex + direction]
            } catch (e) {
                prevElementTemp = null
            }
            null !== prevElementTemp && prevElementTemp !== prevElement && (prevElement = prevElementTemp, prevElement.set(0, {duration: 100})), currentElementTemp = that.states[currentIndex], currentElementTemp !== currentElement && (currentElement = currentElementTemp, currentElement.set(1, {duration: 200}))
        }), this.footers = [], this.footer = new GridLayout({dimensions: [3, 1]}), this.footer.pipe(this), this.footerLeft = new Surface({
            size: [void 0, void 0],
            properties: {backgroundSize: "cover"}
        }), this.footerCenter = new Surface({
            size: [void 0, void 0],
            properties: {backgroundSize: "cover"}
        }), this.footerRight = new Surface({
            size: [void 0, void 0],
            properties: {backgroundSize: "cover"}
        }), this.footers.push(this.footerLeft), this.footers.push(this.footerCenter), this.footers.push(this.footerRight), this.footer.sequenceFrom(this.footers), this.layout.content.add(this.content), this.layout.header.add(this.header), this.state1 = new Transitionable(1), this.modifier1 = new Modifier({
            opacity: function () {
                return that.state1.get()
            }
        }), this.surface1 = new Surface({
            size: [void 0, void 0],
            properties: {backgroundColor: "purple"}
        }), this.state2 = new Transitionable(0), this.modifier2 = new Modifier({
            opacity: function () {
                return that.state2.get()
            }
        }), this.surface2 = new Surface({
            size: [void 0, void 0],
            properties: {backgroundColor: "green"}
        }), this.state3 = new Transitionable(0), this.modifier3 = new Modifier({
            opacity: function () {
                return that.state3.get()
            }
        }), this.surface3 = new Surface({
            size: [void 0, void 0],
            properties: {backgroundColor: "red"}
        }), this.state4 = new Transitionable(0), this.modifier4 = new Modifier({
            opacity: function () {
                return that.state4.get()
            }
        }), this.surface4 = new Surface({
            size: [void 0, void 0],
            properties: {backgroundColor: "yellow"}
        }), this.state5 = new Transitionable(0), this.modifier5 = new Modifier({
            opacity: function () {
                return that.state5.get()
            }
        }), this.surface5 = new Surface({
            size: [void 0, void 0],
            properties: {backgroundColor: "brown"}
        }), this.state6 = new Transitionable(0), this.modifier6 = new Modifier({
            opacity: function () {
                return that.state6.get()
            }
        }), this.surface6 = new Surface({
            size: [void 0, void 0],
            properties: {backgroundColor: "blue"}
        }), this.states = [], this.states.push(this.state1), this.states.push(this.state2), this.states.push(this.state3), this.states.push(this.state4), this.states.push(this.state5), this.states.push(this.state6), this.layout.footer.add(this.modifier1).add(this.surface1).add(this.footer), this.layout.footer.add(this.modifier2).add(this.surface2).add(this.footer), this.layout.footer.add(this.modifier3).add(this.surface3).add(this.footer), this.layout.footer.add(this.modifier4).add(this.surface4).add(this.footer), this.layout.footer.add(this.modifier5).add(this.surface5).add(this.footer), this.layout.footer.add(this.modifier6).add(this.surface6).add(this.footer), this._eventInput.pipe(this._eventOutput), this.add(this.layout)
    }

    var Surface = (require("d3/d3"), require("famous/core/Surface")), Modifier = require("famous/core/Modifier"), View = (require("famous/core/Transform"), require("famous/core/View")), HomeScroll = require("views/HomeScroll"), HeaderFooterLayout = require("famous/views/HeaderFooterLayout"), GridLayout = require("famous/views/GridLayout"), HeaderView = require("views/HeaderView"), GenericSync = (require("text!jade/homePage.html"), require("text!jade/aboutUsPage.html"), require("text!jade/demographicsPage.html"), require("text!jade/clientsPage.html"), require("text!jade/radioPage.html"), require("famous/inputs/GenericSync")), TouchSync = (require("famous/inputs/MouseSync"), require("famous/inputs/TouchSync")), ScrollSync = require("famous/inputs/ScrollSync"), Transitionable = (require("famous/core/Transform"), require("famous/transitions/Transitionable"));
    PageView.prototype = Object.create(View.prototype), PageView.prototype.constructor = PageView, PageView.prototype.navigateTo = function (index) {
        for (var i = 0; i < this.states.length; i++) {
            var state = this.states[i];
            state.set(0)
        }
        var navigatedState = this.states[index];
        navigatedState.set(1, {duration: 300}), this.content.scrollview.goToPage(index)
    }, module.exports = PageView
}), define("views/AppView", ["require", "exports", "module", "famous/core/Surface", "famous/core/Modifier", "famous/core/Transform", "famous/core/View", "famous/inputs/MouseSync", "famous/inputs/GenericSync", "famous/transitions/Transitionable", "famous/views/HeaderFooterLayout", "famous/core/EventHandler", "./MenuView", "./PageView"], function (require, exports, module) {
    function AppView() {
        var that = this;
        View.apply(this, arguments), this.menuToggle = !1, this.eventInput = new EventHandler, EventHandler.setInputHandler(this, this.eventInput), this.menuView = new MenuView, this.menuView.pipe(this), this.pageView = new PageView, this.pageViewPos = new Transitionable(0), this.eventInput.on("navigateTo", function (index) {
            that.pageView.navigateTo(index)
        }), this.pageModifier = new Modifier, this.pageModifier.transformFrom(function () {
            return Transform.translate(this.pageViewPos.get(), 0, 0)
        }.bind(this)), this.pageView.on("menuToggle", this.toggleMenu.bind(this)), this.add(this.menuView), this.add(this.pageModifier).add(this.pageView), _handleTouch.call(this)
    }

    function _handleTouch() {
        GenericSync.register(MouseSync), this.sync = new GenericSync(function () {
            return this.pageViewPos.get(0)
        }.bind(this), {direction: GenericSync.DIRECTION_X}), this.pageView.pipe(this.sync), this.sync.on("update", function (data) {
            0 === this.pageViewPos.get() && data.position > 0 && this.menuView.animateNavItems(), this.pageViewPos.set(Math.min(Math.max(0, data.position), this.options.maxOpenPos))
        }.bind(this)), this.sync.on("end", function (data) {
            {
                var velocity = data.velocity;
                this.pageViewPos.get()
            }
            this.pageViewPos.get() > this.options.posThreshold ? velocity < -this.options.velThreshold ? this.slideLeft() : this.slideRight() : velocity > this.options.velThreshold ? this.slideRight() : this.slideLeft()
        }.bind(this))
    }

    var Modifier = (require("famous/core/Surface"), require("famous/core/Modifier")), Transform = require("famous/core/Transform"), View = require("famous/core/View"), MouseSync = require("famous/inputs/MouseSync"), GenericSync = require("famous/inputs/GenericSync"), Transitionable = require("famous/transitions/Transitionable"), EventHandler = (require("famous/views/HeaderFooterLayout"), require("famous/core/EventHandler")), MenuView = require("./MenuView"), PageView = require("./PageView");
    AppView.prototype = Object.create(View.prototype), AppView.prototype.constructor = AppView, AppView.DEFAULT_OPTIONS = {
        posThreshold: 95.5,
        velThreshold: .75,
        transition: {duration: 300, curve: "easeOut"},
        maxOpenPos: 191
    }, AppView.prototype.toggleMenu = function () {
        this.menuToggle ? this.slideLeft() : (this.slideRight(), this.menuView.animateNavItems()), this.menuToggle = !this.menuToggle
    }, AppView.prototype.slideLeft = function () {
        this.pageViewPos.set(0, this.options.transition, function () {
            this.menuToggle = !1
        }.bind(this))
    }, AppView.prototype.slideRight = function () {
        this.pageViewPos.set(this.options.maxOpenPos, this.options.transition, function () {
            this.menuToggle = !0
        }.bind(this))
    }, module.exports = AppView
}), define("main", ["require", "famous/core/Engine", "views/AppView"], function (require, Engine, AppView) {
    var mainContext = (require("famous/core/Transform"), Engine.createContext()), appView = new AppView;
    mainContext.add(appView)
}), define("main", function () {
}), define(["require", "famous/core/Engine", "views/AppView"], function (require, Engine, AppView) {
    var mainContext = (require("famous/core/Transform"), Engine.createContext()), appView = new AppView;
    mainContext.add(appView)
});
