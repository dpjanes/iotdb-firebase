/*
 *  admin/firestore.js
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

const firebase_admin = require("firebase-admin")

const logger = require("../logger")(__filename)

/**
 */
const firestore = _.promise((self, done) => {
    logger.trace({
        method: firestore.method,
    }, "called")

    _.promise(self)
        .validate(firestore)
        .make(sd => {
            sd.firebase = _.clone(sd.firebase)
            sd.firebase.firestore = firebase_admin.firestore()
            sd.firebase.firestore.settings({
                timestampsInSnapshots: true
            })
        })
        .end(done, self, "firebase")
})

firestore.method = "admin.firestore"
firestore.description = ``
firestore.requires = {
    firebase: _.is.Dictionary,
}

/**
 *  API
 */
exports.firestore = firestore