/*
 *  db/read.js
 *
 *  David Janes
 *  IOTDB.org
 *  2019-01-14
 *
 *  Copyright (2013-2019) David P. Janes
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

const logger = require("../logger")(__filename)

/**
 */
const read = _.promise((self, done) => {
    logger.trace({
        method: read.method,
    }, "called")

    _.promise.validate(self, read)

    const ref = self.firebase.db.ref(self.path)
    ref.once("value", snapshot => {
        self.json = snapshot.val()

        done(null, self)
    })
})

read.method = "db.read"
read.description = `Read a JSON value`
read.requires = {
    firebase: {
        db: _.is.Object,
    },
    path: _.is.String,
}
read.produces = {
    json: _.is.String,
}

/**
 *  API
 */
exports.read = read
