/*

 Copyright (c) 2017 Jirtdan Team and other collaborators

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.

 */

"use strict";
/*jshint esversion: 6*/
import {ConnectionLine} from './controls/ConnectionLine.js'

//FIXME: Draft
//TODO: Dependency from raphael needs to be removed.
export class Board {
    constructor(paper) {
        this.paper = paper;
        this.initBoard();
        this.connections = [];
        this.controls = [];
        this.isConnecting = false;
    }

    initBoard() {
        this.createFilter();
    }

    addControl(control) {
        //TODO:
        this.controls.push(control);
    }

    startConnection(pin) {
        console.log(pin);
        //TODO:
        this.isConnecting = true;
        this.inputPin = pin;
    }

    startFinishConnection(pin) {
        if (!this.isConnecting) {
            this.startConnection(pin);
            return;
        }
        this.finishConnection(pin);
    }

    finishConnection(pin) {
        console.log(pin);
        if (!this.isConnecting) return;
        if (this.inputPin == pin) return;


        if (this.inputPin.canConnect(pin)) {
            this.createConnection(this.inputPin, pin);
        }
        this.isConnecting = false;
    }

    /**
     * Create new connection and add it to the list.
     */
    createConnection(pin1, pin2) {
        this.connections.push(new ConnectionLine(this, pin1, pin2));
    }

    /**
     * Translate all connections depending on pins they connect to.
     * This method is fired on drag-drop of the control.
     */
    translateConnections(pin, x, y) {
        for (var i = 0; i < this.connections.length; i++) {
            this.connections[i].onPinTranslate(pin, x, y);
        }
    }

    createFilter() {
        //FIXME: Clean this bullshit.
        var ns = "http://www.w3.org/2000/svg";
        var filter = `
              
                    <feFlood
                    flood-opacity="1"
                    flood-color="rgb(0,0,248)"
                    result="flood"
                    id="feFlood4515" />
                    <feComposite
                    in="flood"
                    in2="SourceGraphic"
                    operator="in"
                    result="composite1"
                    id="feComposite4517" />
                    <feGaussianBlur
                    in="composite1"
                    stdDeviation="10"
                    result="blur"
                    id="feGaussianBlur4519" />
                    <feOffset
                    dx="0"
                    dy="0"
                    result="offset"
                    id="feOffset4521" />
                    <feComposite
                    in="SourceGraphic"
                    in2="offset"
                    operator="over"
                    result="composite2"
                    id="feComposite4523" />
                 `;
        let element = document.createElementNS(ns, "filter");
        element.innerHTML = filter;
        element.id = "filter1";
        element.style = "color-interpolation-filters:sRGB;";
        this.paper.defs.appendChild(element);
    }
}
