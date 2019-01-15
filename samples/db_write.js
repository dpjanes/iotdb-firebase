/*
 *  samples/db_1.js
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
const firebase = require("..")

_.promise({
    firebased: {
        service_account: require("./service-account.json")
    }
})
    .then(firebase.admin.initialize)
    .then(firebase.admin.db)
    .add({
        path: "/hello/xxx",
        json: {
            first: "David",
            last: "Janes",
        },
    })
    .then(firebase.db.write)
    .make(sd => {
        console.log("+", "done")
    })
    .catch(error => {
        console.log("#", _.error.message(error))
    })
