const staticCacheName = 'site-static-v1.3'

const assets = [
    './',
    './index.html',
    './css/styles.css'
]

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(staticCacheName).then(cache => {
            console.log('Sent files to cache');
            cache.addAll(assets)
        })
    )
    console.log('Service Worker has been installed');
})

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            const filteredKeys = keys.filter(key => key !== staticCacheName)
            filteredKeys.map(key => {
                caches.delete(key)
            })
        })
    )
    console.log('Service Worker has been activated');
})

// self.addEventListener('fetch', event => {
//     console.log('Fetch event')
// })