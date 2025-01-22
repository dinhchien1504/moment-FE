self.addEventListener('install', (event) => {
  console.log('Service Worker đang được cài đặt...');
  
  // Cache các tài nguyên khi cài đặt
  event.waitUntil(
    caches.open('my-cache-v1').then((cache) => {
      return cache.addAll([
        // '/',
        '/images/logo-removebg.192.png',
        // Thêm các tài nguyên khác mà bạn cần cache
      ]);
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker đã được kích hoạt');
  
  // Xóa cache cũ nếu cần
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== 'my-cache-v1') {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  self.clients.claim();
});

self.addEventListener('push', (event) => {
  const data = event.data ? JSON.parse(event.data.text()) : {};

  // Thêm dữ liệu URL vào thông báo
  const notificationData = {
    title: data.title+' - Moment' || 'Thông báo đẩy từ Moment',
    options: {
      body: data.message || 'Bạn có một thông báo mới!',
      icon: '/images/logo-removebg.192.png',
      badge: '/images/logo-removebg.192.png',
    },
    url: data.url || '/',  // Đường dẫn bạn muốn người dùng chuyển tới khi nhấn vào thông báo
  };

  // Hiển thị thông báo đẩy
  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData.options)
  );
});

// Khi người dùng nhấn vào thông báo
self.addEventListener('notificationclick', (event) => {
  event.notification.close(); // Đóng thông báo khi nhấn vào

  // Mở đường link tương ứng khi nhấn vào thông báo
  event.waitUntil(
    clients.openWindow(event.notification.data.url) // Dẫn đến URL đã được chỉ định
  );
});

