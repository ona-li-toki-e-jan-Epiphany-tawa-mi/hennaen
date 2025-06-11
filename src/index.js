/*
 * This file is part of hennaen.
 *
 * Copyright (c) 2025 ona-li-toki-e-jan-Epiphany-tawa-mi
 *
 * hennaen is free software: you can redistribute it and/or modify it under the
 * terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option) any
 * later version.
 *
 * hennaen is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with hennaen. If not, see <https://www.gnu.org/licenses/>.
 */

////////////////////////////////////////////////////////////////////////////////
// Config                                                                     //
////////////////////////////////////////////////////////////////////////////////

// Canvas.
const width  = 1280
const height = 720

// A scalar applied to the speed of the progression of the animation.
const animationSpeed = 1000

// The maximum radius a circle can have.
const maxCircleRadius = 100;

////////////////////////////////////////////////////////////////////////////////
// Utilities                                                                  //
////////////////////////////////////////////////////////////////////////////////

const TAU = 2 * Math.PI

const halfWidth  = width  / 2
const halfHeight = height / 2

/**
 * @param {number} minimum
 * @param {number} maximum
 */
function randomBetween(minimum, maximum) {
    return minimum + (maximum - minimum) * Math.random()
}

function randomColor() {
    const r = Math.floor(randomBetween(0, 256));
    const g = Math.floor(randomBetween(0, 256));
    const b = Math.floor(randomBetween(0, 256));
    return `rgb(${r},${g},${b})`;
}

////////////////////////////////////////////////////////////////////////////////
// DOM                                                                        //
////////////////////////////////////////////////////////////////////////////////

const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas"))
if (null === canvas) throw new Error("Unable to load canvas")
canvas.width  = width
canvas.height = height

const context = /** @type {CanvasRenderingContext2D} */ (canvas.getContext("2d"))
if (null === context) throw new Error("Unable to load canvas")

////////////////////////////////////////////////////////////////////////////////
// Animation                                                                  //
////////////////////////////////////////////////////////////////////////////////

/**
 * @typedef  {Object} Circle
 * @property {number} x
 * @property {number} y
 * @property {number} radius
 * @property {number} maxRadius
 * @property {string} color
 */

/** @type {Circle?} */
let circle = null;

/**
 * @param {number} deltaTime_s
 */
function render(deltaTime_s) {
    if (null === circle) circle = {
        x:         randomBetween(0, width)  - halfWidth,
        y:         randomBetween(0, height) - halfHeight,
        radius:    0,
        maxRadius: randomBetween(1, maxCircleRadius),
        color:     randomColor(),
    }

    context.beginPath()
    context.arc(circle.x, -circle.y, circle.radius, 0, TAU)
    context.fillStyle = circle.color
    context.fill()

    if (circle.radius >= circle.maxRadius) {
        circle = null
    } else {
        circle.radius += deltaTime_s * animationSpeed
    }
}

let lastTimestamp_ms = performance.now()
/**
 * @param {DOMHighResTimeStamp} timestamp_ms
 */
function preRender(timestamp_ms) {
    const deltaTime_s = (timestamp_ms - lastTimestamp_ms) / 1000
    lastTimestamp_ms  = timestamp_ms

    // Makes (0,0) be the center of the screen.
    context.save()
    context.translate(halfWidth, halfHeight)

    render(deltaTime_s)

    // Restore from translation.
    context.restore()

    window.requestAnimationFrame(preRender)
}
window.requestAnimationFrame(preRender)
