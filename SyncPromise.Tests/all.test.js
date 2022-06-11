import SyncPromise from '../SyncPromise/SyncPromise.js'

describe('SyncPromise.all', () => {

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

        await expect(SyncPromise.all([sp1, sp2, sp3])).resolves.toEqual([2,3,1])
    })

    test('rejected value', async () => {
        const sp1 = new SyncPromise((res, rej) => {
            setTimeout(() => {res(2)},200)
        })

        const sp2 = new SyncPromise((res, rej) => {
            setTimeout(() => {res(3)},300)
        })

        const sp3 = new SyncPromise((res, rej) => {
            setTimeout(() => {rej(1)},100)
        })

        await expect( SyncPromise.all([sp1, sp2, sp3])).rejects.toEqual(1)
    })

    test('empty input', async () => {
       await expect(SyncPromise.all([])).toEqual(new SyncPromise(() => {}))
    })

    test('incorrect input', async () => {
        await expect(SyncPromise.all([1,2,3])).toEqual(new SyncPromise(() => {}))
     })
})