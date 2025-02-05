const sendPushNotification = (message: string, url: string) => {
  // Kiểm tra trình duyệt có hỗ trợ Notification API không
  if (!("Notification" in window)) {
    console.log("Trình duyệt không hỗ trợ Notification API");
    return;
  }

  // Kiểm tra quyền thông báo
  if (Notification.permission === "granted") {
    const notification = new Notification("Thông báo từ Moment", {
      body: message,
      icon: "/images/logo-removebg.192.png", // Tùy chỉnh icon nếu cần
    });

    // Xử lý sự kiện khi người dùng click vào thông báo
    notification.onclick = () => {
      window.open(url, "_blank");
    };
  } else if (Notification.permission !== "denied") {
    // Yêu cầu quyền nếu chưa có
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        sendPushNotification(message, url); // Gọi lại hàm sau khi được cấp quyền
      } else {
        console.log("Người dùng từ chối cấp quyền thông báo");
      }
    });
  } else {
    console.log("Thông báo đã bị từ chối trước đó");
  }
};

export default sendPushNotification;
