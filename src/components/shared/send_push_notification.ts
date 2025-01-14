const sendPushNotification = ( message: string,  url: string) => {
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      const notification = new Notification("Thông báo từ Moment", {
        body: message,
        icon: "/images/logo-removebg.192.png", // Tùy chỉnh icon nếu cần
      });

      // Handle click event to open the URL
      notification.onclick = () => {
        window.open(url, "_blank");
      };
    } else {
      console.log("Cần quyền nhận thông báo");
    }
  });
};
export default sendPushNotification;