import SyncPromise from '../SyncPromise/SyncPromise.js'

describe('SyncPromise.any', () => {

    test('all resolved value', async () => {
        const sp1 = new SyncPromise((res, rej) => {
            setTimeout(() => {res(2)},200)
        })

        const sp2 = new SyncPromise((res, rej) => {
            setTimeout(() => {res(3)},300)
        })

        const sp3 = new SyncPromise((res, rej) => {
            setTimeout(() => {res(1)},100)
        })

        await expect(SyncPromise.any([sp1, sp2, sp3])).resolves.toBe(1)
    })

    test('some rejected values', async () => {
        const sp1 = new SyncPromise((res, rej) => {
            setTimeout(() => {rej(2)},200)
        })

        const sp2 = new SyncPromise((res, rej) => {
            setTimeout(() => {res(3)},300)
        })

        const sp3 = new SyncPromise((res, rej) => {
            setTimeout(() => {rej(1)},100)
        })

        await expect( SyncPromise.any([sp1, sp2, sp3])).resolves.toBe(3)
    })

    test('all values rejected', async () => {
        const sp1 = new SyncPromise((res, rej) => {
            setTimeout(() => {rej(2)},200)
        })

        const sp2 = new SyncPromise((res, rej) => {
            setTimeout(() => {rej(3)},300)
        })

        const sp3 = new SyncPromise((res, rej) => {
            setTimeout(() => {rej(1)},100)
        })

        await expect( SyncPromise.any([sp1, sp2, sp3])).rejects.toEqual(new Error([1,2,3]))
    })

    test('empty input', async () => {
       await expect(SyncPromise.any([])).toEqual(new SyncPromise(() => {}))
    })

    test('incorrect input', async () => {
        await expect(SyncPromise.any([1,2,3])).toEqual(new SyncPromise(() => {}))
     })
})