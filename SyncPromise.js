const STATUS = {
    fulfilled: 'fulfilled',
    rejected: 'rejected',
    pending: 'pending',
}

class SyncPromise {
    status = 'pending'

    onFulfilled = []

    onRejected = []

    value = undefined

    reason = undefined

    constructor(executor) {

        const resolve = (value) => {

            if (this.status !== STATUS.pending || this.value != null) {
                return;
            }

            if (value != null && typeof value.then === 'function') {
                value.then(resolve, reject)
            }

            this.status = STATUS.fulfilled
            this.value = value

            for (const fn of this.onFulfilled) {
                fn(this.value)
            }
        }

        const reject = (reason) => {
            if (this.status !== STATUS.pending) {
                return;
            }

            this.status = STATUS.rejected
            this.reason = reason

            for (const fn of this.onRejected) {
                fn(this.reason)
            }

            queueMicrotask(() => {
                if (this.onRejected.length === 0) {
                    Promise.reject(this.reason)
                }
            })
        }

        try {
            executor(resolve, reject)
        } catch (error) {
            reject(error)
        }

    }

    then(onFulfilled, onRejected) {
        return new SyncPromise((resolve, reject) => {

            const fulfilled = () => {
                try {
                    resolve( onFulfilled ? onFulfilled(this.value) : this.value )
                } catch (error) {
                    reject(error)
                }
            }

            const rejected = () => {
                try {
                    resolve(onRejected ? onRejected(this.reason) : this.reason)
                } catch (error) {
                    reject(error)
                }
            }

            if (this.status === STATUS.fulfilled) {
                fulfilled()
                return ;
            }

            if (this.status === STATUS.rejected) {
                rejected()
                return ;
            }

            this.onFulfilled.push(fulfilled)

            this.onRejected.push(rejected)
        })
    }

    catch(onRejected) {
        return new SyncPromise( (resolve, reject) => {
            const rejected = () => {
                try {
                    resolve(onRejected ? onRejected(this.reason) : this.reason)
                } catch (error) {
                    reject(error)
                }
            }

            if (this.status === STATUS.fulfilled) {
                resolve(this.value)
                return ;
            }

            if (this.status === STATUS.rejected) { 
                rejected()
                return ;
            }

            this.onFulfilled.push(resolve)

            this.onRejected.push(rejected)
        })
    }

    finally(cb) {
        return new SyncPromise((resolve, reject) => {
            const fulfilled = () => {
                try {
                    let res = cb()
    
                    if (res && typeof res.then === 'function') {
                        res = res.then(() => this.value)
                    }
    
                    resolve(res)
                } catch (error) {
                    reject(error)
                }
            }
    
            const rejected = () => {
                try {
                    let res = cb()
    
                    if (res && typeof res.then === 'function') {
                        res = res.then(() => {
                            throw this.reason
                        })
                    }
    
                    resolve(res)
                } catch (error) {
                    reject(error)
                }
            }

            if (this.status === STATUS.fulfilled) {
                fulfilled()
                return ;
            }

            if (this.status === STATUS.rejected) {
                rejected()
                return ;
            }

            this.onFulfilled.push(fulfilled)

            this.onRejected.push(rejected)
        })
    }
}


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


// const p = new Promise((res, rej) => {
//     setTimeout(() => {res(2000)},2000)
// })

// p.then((res) => {
//     console.log(res)
//     return res
// }).then((res) => {
//     console.log(res)
//     return res
// }).finally((res) => {
//     console.log(res)
// })