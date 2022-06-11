import SyncPromise from "SyncPromise.js";

const sp = new SyncPromise((res, rej) => {
    setTimeout(() => {res(2000)},2000)
})

sp.then((res) => {
    console.log(res)
    return res
}).then((res) => {
    console.log(res)
    return res
}).finally((res) => {
    console.log(res)
})
