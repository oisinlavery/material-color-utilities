"use strict";
/**
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuantizerMap = void 0;
const utils = require("utils/color_utils");
/**
 * Quantizes an image into a map, with keys of ARGB colors, and values of the
 * number of times that color appears in the image.
 */
// libmonet is designed to have a consistent API across platforms
// and modular components that can be moved around easily. Using a class as a
// namespace facilitates this.
//
// tslint:disable-next-line:class-as-namespace
class QuantizerMap {
    /**
     * @param pixels Colors in ARGB format.
     * @return A Map with keys of ARGB colors, and values of the number of times
     *     the color appears in the image.
     */
    static quantize(pixels) {
        var _a;
        const countByColor = new Map();
        for (let i = 0; i < pixels.length; i++) {
            const pixel = pixels[i];
            const alpha = utils.alphaFromArgb(pixel);
            if (alpha < 255) {
                continue;
            }
            countByColor.set(pixel, ((_a = countByColor.get(pixel)) !== null && _a !== void 0 ? _a : 0) + 1);
        }
        return countByColor;
    }
}
exports.QuantizerMap = QuantizerMap;
