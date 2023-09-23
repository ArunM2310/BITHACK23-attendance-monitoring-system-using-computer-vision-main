const video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        const capturedImage = document.getElementById('capturedImage');
        const captureBtn = document.getElementById('captureBtn');
        const imageNameInput = document.getElementById('imageNameInput');

        // Predefined folder path
        const saveFolderPath = '/Image'; // Replace with your desired folder path

        async function captureAndSaveImage() {
          const context = canvas.getContext('2d');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Convert the canvas image to a Blob
          const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg'));

          const imageName = imageNameInput.value || 'captured_image'; // Use user input or a default name

          // Use the File System Access API to save the image to the predefined folder with the user-input name
          try {
            const handle = await window.showDirectoryPicker({ baseDirectory: saveFolderPath });
            const fileHandle = await handle.getFileHandle(`${imageName}.jpg`, { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(blob);
            await writable.close();

            // Display the captured image
            capturedImage.src = URL.createObjectURL(blob);
          } catch (error) {
            console.error('Error saving image:', error);
          }
        }

        // Check for webcam support
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices
            .getUserMedia({ video: true })
            .then(function (stream) {
              video.srcObject = stream;
              video.play();
            })
            .catch(function (error) {
              console.error('Error accessing webcam:', error);
            });
        } else {
          console.error('Webcam not supported');
        }

        // Capture and save the image when the button is clicked
        captureBtn.addEventListener('click', captureAndSaveImage);
