/**
 *  test/_util.js
 *
 *  David Janes
 *  IOTDB
 *  2019-01-14
 *
 *  Copyright (2013-2019-01-14
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

"use strict"

const _ = require("iotdb-helpers")

const assert = require("assert")
const path = require("path")

const firebase = require("..")

const auto_fail = done => _.promise(self => done(new Error("didn't expect to get here")));
const ok_error = (done, code) => error => {
    if (code && (_.error.code(error) !== code)) {
        return done(error)
    }

    done(null)
}

/**
 *  Standard connection
 */
const initialize = _.promise((self, done) => {
    _.promise(self)
        .add("firebased", require("./data/firebase.json"))
        .then(firebase.initialize)
        .end(done, self, "firebase")
})

/**
 *  API
 */
exports.auto_fail = auto_fail
exports.ok_error = ok_error

exports.initialize = initialize
