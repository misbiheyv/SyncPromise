import SyncPromise from '../SyncPromise/SyncPromise.js'

describe('SyncPromise.race', () => {

    test('resolved value', async () => {
        const sp1 = new SyncPromise((res, rej) => {
            setTimeout(() => {res(2)},200)
        })

        const sp2 = new SyncPromise((res, rej) => {
            setTimeout(() => {res(3)},300)
        })

        const sp3 = new SyncPromise((res, rej) => {
            setTimeout(() => {res(1)},100)
        })

        await expect(SyncPromise.race([sp1, sp2, sp3])).resolves.toBe(1)
    })

    test('rejected value', async () => {
        const sp1 = new SyncPromise((res, rej) => {
            setTimeout(() => {rej(2)},200)
        })

        const sp2 = new SyncPromise((res, rej) => {
            setTimeout(() => {res(3)},300)
        })

        const sp3 = new SyncPromise((res, rej) => {
            setTimeout(() => {rej(1)},100)
        })

        await expect( SyncPromise.race([sp1, sp2, sp3])).rejects.toBe(1)
    })

    test('empty input', async () => {
       await expect(SyncPromise.race([])).toEqual(new SyncPromise(() => {}))
    })

    test('incorrect input', async () => {
        await expect(SyncPromise.race([1,2,3])).toEqual(new SyncPromise(() => {}))
     })
})