import SyncPromise from '../SyncPromise/SyncPromise.js'

describe('SyncPromise.allSettled', () => {

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

        await expect(SyncPromise.allSettled([sp1, sp2, sp3])).resolves.toEqual([
            {status : 'fulfilled', value: 2},
            {status : 'fulfilled', value: 3}, 
            {status : 'fulfilled', value: 1}
        ])
    })

    test('rejected value', async () => {
        const sp1 = new SyncPromise((res, rej) => {
            setTimeout(() => {res(1)},100)
        })

        const sp2 = new SyncPromise((res, rej) => {
            setTimeout(() => {res(2)},200)
        })

        const sp3 = new SyncPromise((res, rej) => {
            setTimeout(() => {rej(5)},500)
        })

        await expect( SyncPromise.allSettled([sp1, sp2, sp3])).resolves.toEqual([
            { status: 'fulfilled', value: 1 },
            { status: 'fulfilled', value: 2 },
            { status: 'rejected', reason: 5 }
          ])
    })

    test('empty input', async () => {
       await expect(SyncPromise.allSettled([])).toEqual(new SyncPromise(() => {}))
    })

    test('incorrect input', async () => {
        await expect(SyncPromise.allSettled([1,2,3])).toEqual(new SyncPromise(() => {}))
     })
})