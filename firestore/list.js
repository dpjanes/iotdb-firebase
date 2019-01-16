/*
 *  firestore/list.js
 *
 *  David Janes
 *  IOTDB.org
 *  2019-01-16
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

const path = require("path")

const logger = require("../logger")(__filename)

/**
 */
const list = _.promise((self, done) => {
    logger.trace({
        method: list.method,
    }, "called")

    _.promise.validate(self, list)

    const ref = self.firebase.firestore.ref(self.path)
    ref.once("value", snapshot => {
        self.paths = []
        snapshot.forEach(x => {
            self.paths.push(path.join(self.path, x.key))
        })

        done(null, self)
    })
})

list.method = "firestore.list"
list.description = `List keys under self.path`
list.requires = {
    firebase: {
        firestore: _.is.Object,
    },
    path: _.is.String,
}
list.produces = {
    paths: _.is.Array.of.String,
}

/**
 */
const recursive = _.promise((self, done) => {
    logger.trace({
        method: recursive.method,
    }, "called")

    _.promise(self)
        .validate(recursive)
        .make((sd, sdone) => {
            const ref = self.firebase.firestore.ref(sd.path)
            ref.once("value", snapshot => {
                sd.paths = []

                let alpha = false
                snapshot.forEach(x => {
                    sd.paths.push(path.join(sd.path, x.key))

                    if (alpha || !x.key.match(/^[0-9]+$/)) {
                        alpha = true
                    }
                })

                if (!alpha) {
                    sd.paths = []
                }

                sdone(null, sd)
            })
        })
        .each({
            method: recursive,
            inputs: "paths:path",
            outputs: "paths",
            output_selector: sd => sd.paths,
            output_flatten: true,
        })
        .make(sd => {
            sd.paths.unshift(sd.path)
        })
        .end(done, self, "paths")
})

recursive.method = "firestore.recursive"
recursive.description = `Recursively list keys under self.path`
recursive.requires = {
    firebase: {
        firestore: _.is.Object,
    },
    path: _.is.String,
}
recursive.produces = {
    paths: _.is.Array.of.String,
}

/**
 *  API
 */
exports.list = list
exports.list.recursive = recursive
