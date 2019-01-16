/*
 *  samples/base.js
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

const firebase_admin = require("firebase-admin");

const account = require("./service-account.json")

firebase_admin.initializeApp({
    credential: firebase_admin.credential.cert(account),
    databaseURL: `https://${account.project_id}.firebaseio.com`,
})

const db = firebase_admin.database();
const root_ref = db.ref("/hello/xxx")

// root_ref.update({
// root_ref.push({
root_ref.set({
    first: "John",
    last: "Janes",
})
    .then(() => {
        console.log("DONE")
    })
    .catch(error => {
        console.log("ERROR", error)
    })
