export const captureScreen = async (): Promise<File | null> => {
  try {
    console.log("Đang kiểm tra hỗ trợ Screen Capture API...");
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      alert("Trình duyệt của bạn không hỗ trợ Screen Capture API.");
      return null;
    }

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

      console.log("Chuyển canvas thành Blob...");
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((fileBlob) => {
          resolve(fileBlob);
        }, "image/png");
      });

      console.log("Dừng stream...");
      mediaStream.getTracks().forEach((track) => track.stop());

      if (blob) {
        console.log("Chuyển Blob thành File...");
        const file = new File([blob], `screenshot-${Date.now()}.png`, { type: "image/png" });
        console.log("File đã sẵn sàng:", file);
        return file;
      } else {
        console.error("Không thể tạo Blob từ canvas.");
        return null;
      }
    }
  } catch (error) {
    console.error("Lỗi trong quá trình chụp màn hình:", error);
  }
  return null;
};
