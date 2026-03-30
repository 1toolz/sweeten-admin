const CACHE_NAME = 'sweeten-v2'; // نسخة الكاش
const ASSETS_TO_CACHE = [
  'index.html',
  'manifest.json',
  'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Great+Vibes&family=Amiri:wght@400;700&display=swap'
];

// مرحلة التثبيت: حفظ الملفات الأساسية في الكاش
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW: تم حفظ الملفات في الكاش بنجاح');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// مرحلة التنشيط: حذف النسخ القديمة من الكاش
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('SW: حذف الكاش القديم:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// استراتيجية "الشبكة أولاً" مع الرجوع للكاش في حالة انقطاع الإنترنت
self.addEventListener('fetch', (event) => {
  // لا تقم بكاش لطلبات الـ API أو Cloudinary لضمان تحديث البيانات
  if (event.request.url.includes('google.com') || event.request.url.includes('cloudinary')) {
    return; 
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
