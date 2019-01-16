/*
 *  firestore/remove.js
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

const logger = require("../logger")(__filename)

const path = require("path")

const _remove_collection = _.promise((self, done) => {
    logger.trace({
        method: _remove_collection.method,
    }, "called")

    _.promise.validate(self, _remove_collection)

    const collection = self.firebase.firestore.collection(self.path);
    collection
        .get()
        .then(snapshot => {
            const paths = []
            snapshot.forEach(doc => {
                paths.push(path.join(self.path, doc.id))
            });

            _.promise(self)
                .add("paths", paths)
                .each({
                    method: _remove_document,
                    inputs: "paths:path",
                })
                .end(done, self);
        })
        .catch(done)
})

const _remove_document = _.promise((self, done) => {
    logger.trace({
        method: _remove_document.method,
    }, "called")

    _.promise.validate(self, _remove_document)

    const document = self.firebase.firestore.doc(self.path)
    document
        .delete()
        .then(() => {
            done(null, self)
        })
        .catch(done)
})

/**
 */
const remove = _.promise((self, done) => {
    logger.trace({
        method: remove.method,
    }, "called")

    _.promise.validate(self, remove)

    const parts = self.path.split("/").filter(part => part.length)

    _.promise(self)
        .conditional(parts.length % 2, _remove_collection, _remove_document)
        .end(done, self)

})

remove.method = "firestore.remove"
remove.description = `Remove a document or collection`
remove.requires = {
    firebase: {
        firestore: _.is.Object,
    },
    path: _.is.String,
}
remove.produces = {
}

/**
 *  API
 */
exports.remove = remove
