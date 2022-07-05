// limiting the number of cache items
const limitCache = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if (key.length > size) {
                cache.delete(keys[0]).then(limitCache(name, size))
            }
        })
    })
}

// cache storage
const staticSiteName = "static-site-v1"
const dynamicSiteName = "dynamic-site-v1"

const staticCacheList = [
    "js/app.js",
    "js/materialize.min.js",
    "js/ui.js",
    "index.html",
    "manifest.json",
    "img/dish.png",
    "css/materialize.min.css",
    "css/styles.css",
    "https://fonts.googleapis.com/icon?family=Material+Icons"
]
// service worker event listeners

// service worker install event
self.addEventListener('install', (evt) => {
    // waiting for cache setup
    evt.waitUntil(
        // setting up cache storage for the main files
        caches.open(staticSiteName).then(cache => {
            cache.addAll(staticCacheList)
        })
    )
})

// service worker activate event listener
self.addEventListener('activate', (evt) => {
    // serving the latest content after activation

})

// service worker fetch event listener
self.addEventListener('fetch', (evt) => {
    // intercepting requests and serving our cache assets when offline
    evt.respondWith(
        caches.match(evt.request).then((cacheRes) => {
            return cacheRes || fetch(evt.request).then(async fetchRes => {
                const cache = await caches.open(dynamicSiteName)
                cache.put(evt.request.url, fetchRes.clone())
                return fetchRes
            })
        }).catch(() => {
            if (evt.request.url.indexOf('.html') > -1) {
                return caches.match("/pages/fallback.html")
            }
        }))
}
)
