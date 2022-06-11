import { Status } from "./Status.js"

export default class SyncPromise {

//#region properties

    #status = Status.pending

    #onFulfilled = []

    #onRejected = []

    #value = undefined

    #reason = undefined

//#endregion


//#region static methods

    static resolve(value) {
        if (value instanceof SyncPromise) { 
            return value
        }

        return new SyncPromise((resolve) => { resolve(value) })
    }

    static reject(reason) {
        return new SyncPromise((_, reject) => { reject(reason) })
    }

    static all(iterable) {
        const tasks = Array.from(iterable)

        if (tasks.length === 0) {
            return new SyncPromise.resolve([])
        }

        return new SyncPromise((resolve, reject) => {

            const results = new Array(tasks.length);
    
            let done = 0;
    
            for (let i = 0; i < tasks.length; i++) {
                tasks[i] = SyncPromise.resolve(tasks[i]);
                
                tasks[i]
                    .then((res) => {
                        results[i] = res
                        done++;
    
                        if (done === tasks.length) {
                            resolve(results)
                        }
                    })
                    .catch((err) => reject(err))
            }
        })
    }

    static allSettled(iterable) {
        const tasks = Array.from(iterable)

        if (tasks.length === 0) {
            return new SyncPromise.resolve([])
        }

        return new SyncPromise((resolve) => {

            const results = new Array(tasks.length);
    
            let done = 0; 
    
            for (let i = 0; i < tasks.length; i++) {
                tasks[i] = SyncPromise.resolve(tasks[i]);
                
                tasks[i]
                    .then((value) => {
                        results[i] = { status: Status.fulfilled, value }
                        done++;
    
                        if (done === tasks.length) {
                            resolve(results)
                        }
                    })
                    .catch((reason) => {
                        results[i] = { status: Status.rejected, reason }
                        done++;
    
                        if (done === tasks.length) {
                            resolve(results)
                        }
                    })
            }
        })

    }

    static race(iterable) {
        const tasks = Array.from(iterable)

        if (tasks.length === 0) {
            return new SyncPromise.resolve()
        }

        return new SyncPromise((resolve, reject) => {

            for (let i = 0; i < tasks.length; i++) {
                tasks[i].then(resolve, reject)
            }

        })
    }

    static any(iterable) {
        let tasks = Array.from(iterable)

        if (tasks.length === 0) {
            return new SyncPromise.resolve([])
        }

        return new SyncPromise((resolve, reject) => {
            const errors = []

            for (let i = 0; i < tasks.length; i++) {
                tasks[i] = new SyncPromise.resolve(tasks[i]);

                tasks[i].then(resolve, onRejected)
            }

            function onRejected(err) {
                errors.push(err)

                if (errors.length === tasks.length) {
                    reject(new Error(errors, 'No one Promise was resolved'))
                }
            }
        })
    }

//#endregion


//#region static constructor

    constructor(executor) {

        const resolve = (value) => {

            if (this.#status !== Status.pending || this.#value != null) {
                return;
            }

            if (value != null && typeof value.then === 'function') {
                value.then(resolve, reject)
            }

            this.status = Status.fulfilled
            this.#value = value

            for (const fn of this.#onFulfilled) {
                fn(this.#value)
            }
        }

        const reject = (reason) => {
            if (this.#status !== Status.pending) {
                return;
            }

            this.status = Status.rejected
            this.#reason = reason

            for (const fn of this.#onRejected) {
                fn(this.#reason)
            }

            queueMicrotask(() => {
                if (this.#onRejected.length === 0) {
                    Promise.reject(this.#reason)
                }
            })
        }

        try {
            executor(resolve, reject)
        } catch (error) {
            reject(error)
        }

    }

//#endregion


//#region methods

    then(onFulfilled, onRejected) {
        return new SyncPromise((resolve, reject) => {

            const fulfilled = () => {
                try {
                    resolve( onFulfilled ? onFulfilled(this.#value) : this.#value )
                } catch (error) {
                    reject(error)
                }
            }

            const rejected = () => {
                try {
                    resolve(onRejected ? onRejected(this.#reason) : this.#reason)
                } catch (error) {
                    reject(error)
                }
            }

            if (this.#status === Status.fulfilled) {
                fulfilled()
                return ;
            }

            if (this.#status === Status.rejected) {
                rejected()
                return ;
            }

            this.#onFulfilled.push(fulfilled)

            this.#onRejected.push(rejected)
        })
    }

    catch(onRejected) {
        return new SyncPromise( (resolve, reject) => {
            const rejected = () => {
                try {
                    resolve(onRejected ? onRejected(this.#reason) : this.#reason)
                } catch (error) {
                    reject(error)
                }
            }

            if (this.#status === Status.fulfilled) {
                resolve(this.#value)
                return ;
            }

            if (this.#status === Status.rejected) { 
                rejected()
                return ;
            }

            this.#onFulfilled.push(resolve)

            this.#onRejected.push(rejected)
        })
    }

    finally(cb) {
        return new SyncPromise((resolve, reject) => {
            const fulfilled = () => {
                try {
                    let res = cb()
    
                    if (res && typeof res.then === 'function') {
                        res = res.then(() => this.#value)
                    } else {
                        res = this.#value
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
                            throw this.#reason
                        })

                        resolve(res)
                    } else {
                        reject(this.#reason)
                    }
    
                } catch (error) {
                    reject(error)
                }
            }

            if (this.#status === Status.fulfilled) {
                fulfilled()
                return ;
            }

            if (this.#status === Status.rejected) {
                rejected()
                return ;
            }

            this.#onFulfilled.push(fulfilled)

            this.#onRejected.push(rejected)
        })
    }

//#endregion

}