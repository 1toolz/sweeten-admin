const CACHE_NAME = 'sweeten-pro-v3';
const ASSETS = [
  'index.html',
  'manifest.json',
  'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Great+Vibes&family=Amiri:wght@400;700&display=swap'
];

// تثبيت وحفظ الملفات الأساسية
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// تنظيف الكاش القديم عند التحديث
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
});

// استراتيجية التحميل: الشبكة أولاً، ثم الكاش في حالة الطوارئ
self.addEventListener('fetch', (event) => {
  // عدم تخزين طلبات الـ API لضمان تحديث المنتجات لحظياً
  if (event.request.url.includes('google.com') || event.request.url.includes('cloudinary')) {
    return;
  }
  
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
