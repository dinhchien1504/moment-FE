export const captureScreen = async () => {
    try {
      console.log("Đang kiểm tra hỗ trợ Screen Capture API...");
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        alert("Trình duyệt của bạn không hỗ trợ Screen Capture API.");
        return "unknow";
      }
      let imageData ="unknow"

      console.log("Đang yêu cầu quyền truy cập màn hình...");
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      console.log("Stream nhận được:", mediaStream);

      const video = document.createElement("video");
      video.srcObject = mediaStream;

      console.log("Đang phát video...");
      await video.play();

      console.log("Kích thước video:", video.videoWidth, video.videoHeight);

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth; 
      canvas.height = video.videoHeight;

      console.log("Đang vẽ lên canvas...");
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        console.log("Chuyển canvas thành hình ảnh...");
        imageData = canvas.toDataURL("image/png");
      

        console.log("Hiển thị hình ảnh...");
       
      }

      console.log("Dừng stream...");
      mediaStream.getTracks().forEach((track) => track.stop());

      console.log("Quá trình chụp màn hình hoàn tất.");
      return imageData

    } catch (error) {
      console.error("Lỗi trong quá trình chụp màn hình:", error);
      const errorMessage = (error as Error).message;
      return "unknow"
    //   alert("Bạn đã " + errorMessage);
    }
  };