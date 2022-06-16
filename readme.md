# SyncPromise
Promise-like structure similar to the native promise, but works synchronously.

## Main feature


### native promise behavior
```js
Promise.resolve().then(() => console.log('first message'));
console.log('second message');

// >> second message
// >> first message
```
### sync promise behavior
```js
import SyncPromise from './SyncPromise/SyncPromise.js';

SyncPromise.resolve().then(() => console.log('first message'));
console.log('second message');

// >> first message
// >> second message
```
## SyncPromise API
Provide all native promise methods and one more, that opposite of 'all' method, and named 'any'. SyncPromise.any( [ iterable ] ).  
it skips all rejected promises and returns just a first resolved

```js
import SyncPromise from './SyncPromise/SyncPromise.js';

SyncPromise.any()

await SyncPromise.any([
    new SyncPromise((res, rej) => {
        setTimeout(() => {
            res(1);
        }, 100)
    }),
    new SyncPromise((res, rej) => {
        setTimeout(() => {
            res(2);
        }, 200)
    })
])

// >> 1
```
If all promises has been rejected, then throwing error 'No one Promise was resolved', includes all rejected values
```js
import SyncPromise from './SyncPromise/SyncPromise.js';

SyncPromise.any()

await SyncPromise.any([
    new SyncPromise((res, rej) => {
        setTimeout(() => {
            rej(1);
        }, 100)
    }),
    new SyncPromise((res, rej) => {
        setTimeout(() => {
            rej(2);
        }, 200)
    })
])

// >> No one Promise was resolved. Error: 1,2
```
