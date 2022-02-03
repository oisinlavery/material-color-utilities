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
exports.Blend = void 0;
const cam16_1 = require("hct/cam16");
const hct_1 = require("hct/hct");
const mathUtils = require("utils/math_utils");
/**
 * Functions for blending in HCT and CAM16.
 */
// libmonet is designed to have a consistent API across platforms
// and modular components that can be moved around easily. Using a class as a
// namespace facilitates this.
//
// tslint:disable-next-line:class-as-namespace
class Blend {
    /**
     * @param designColor ARGB representation of an arbitrary color.
     * @param keyColor ARGB representation of the main theme color.
     * @return The design color with a hue shifted towards the system's color,
     *     a slightly warmer/cooler variant of the design color's hue.
     */
    static harmonize(designColor, sourceColor) {
        const fromHct = hct_1.HCT.fromInt(designColor);
        const toHct = hct_1.HCT.fromInt(sourceColor);
        const differenceDegrees = mathUtils.differenceDegrees(fromHct.hue, toHct.hue);
        const rotationDegrees = Math.min(differenceDegrees * 0.5, 15.0);
        const outputHue = mathUtils.sanitizeDegreesDouble(fromHct.hue +
            rotationDegrees * Blend.rotationDirection(fromHct.hue, toHct.hue));
        return hct_1.HCT.from(outputHue, fromHct.chroma, fromHct.tone).toInt();
    }
    /**
     * Blends hue from one color into another. The chroma and tone of the original
     * color are maintained.
     *
     * @param from ARGB representation of color
     * @param to ARGB representation of color
     * @param amount how much blending to perform; 0.0 >= and <= 1.0
     * @return from, with a hue blended towards to. Chroma and tone are constant.
     */
    static hctHue(from, to, amount) {
        const ucsInt = Blend.cam16ucs(from, to, amount);
        const ucs = hct_1.HCT.fromInt(ucsInt);
        const start = hct_1.HCT.fromInt(from);
        return hct_1.HCT.from(ucs.hue, start.chroma, start.tone).toInt();
    }
    /**
     * Blend in CAM16-UCS space.
     *
     * @param from ARGB representation of color
     * @param to ARGB representation of color
     * @param amount how much blending to perform; 0.0 >= and <= 1.0
     * @return from, blended towards to. Hue, chroma, and tone will change.
     */
    static cam16ucs(from, to, amount) {
        const fromCAM16 = cam16_1.CAM16.fromInt(from);
        const toCAM16 = cam16_1.CAM16.fromInt(to);
        const aJstar = fromCAM16.jstar;
        const aAstar = fromCAM16.astar;
        const aBstar = fromCAM16.bstar;
        const bJstar = toCAM16.jstar;
        const bAstar = toCAM16.astar;
        const bBstar = toCAM16.bstar;
        const jstar = aJstar + (bJstar - aJstar) * amount;
        const astar = aAstar + (bAstar - aAstar) * amount;
        const bstar = aBstar + (bBstar - aBstar) * amount;
        return cam16_1.CAM16.fromUcs(jstar, astar, bstar).viewedInSrgb();
    }
    /**
     * Sign of direction change needed to travel from one angle to another.
     *
     * @param from The angle travel starts from, in degrees.
     * @param to The angle travel ends at, in degrees.
     * @return -1 if decreasing from leads to the shortest travel distance, 1 if
     *    increasing from leads to the shortest travel distance.
     */
    static rotationDirection(from, to) {
        const a = to - from;
        const b = to - from + 360.0;
        const c = to - from - 360.0;
        const aAbs = Math.abs(a);
        const bAbs = Math.abs(b);
        const cAbs = Math.abs(c);
        if (aAbs <= bAbs && aAbs <= cAbs) {
            return a >= 0.0 ? 1 : -1;
        }
        if (bAbs <= aAbs && bAbs <= cAbs) {
            return b >= 0.0 ? 1 : -1;
        }
        return c >= 0.0 ? 1 : -1;
    }
}
exports.Blend = Blend;
