if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../sw.js')
    .then(reg => console.log('service worker registered', reg))
    .catch(err => console.error('service worker not registered', err))
}

const staticCacheName = 'site-static-v1.3'
const dynamicCacheName = 'site-dynamic-v1.0'

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

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cacheRes => {
            return (
                cacheRes ||
                fetch(event.request).then(async fetchRes => {
                    return caches.open(dynamicCacheName).then(cache => {
                        cache.put(event.request.url, fetchRes.clone())

                        return fetchRes
                    })
                })
            )
        })
    )
    limitCacheSize(dynamicCacheName, 5)
})


const limitCacheSize = (cacheName, numberOfAllowed) => {
    caches.open(cacheName).then(cache => {
        cache.keys().then(keys => {
            if (keys.length > numberOfAllowed) {
                cache.delete(keys[0]).then(limitCacheSize(cacheName, numberOfAllowed))
            }
        })
    })
}