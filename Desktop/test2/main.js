document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;



    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;
    const flashlightRadius = 75;

    const backgroundImage = new Image();
    backgroundImage.src = './images/background2.png';

    const balloonImage = new Image();
    balloonImage.src = './images/balloon.png';


    let imageX, imageY; // Position of the balloon image
    const scaledWidth = 100; // Width of the balloon image
    const scaledHeight = 100; // Height of the balloon image
    let isBalloonFound = false;
    let showMessage = false;


    balloonImage.onload = function () {
        imageX = Math.random() * (canvas.width - scaledWidth);
        imageY = Math.random() * (canvas.height - scaledHeight);
    };


    // Preload the jumpscare image
    const jumpscareImage = new Image();
    jumpscareImage.src = './images/clown2.png'; // Adjust the path to your jumpscare image

    const jumpscareSound = new Audio();
    jumpscareSound.src = './sounds/jumpscare.mp3';

    const foundSound = new Audio();
    foundSound.src = './sounds/laugh.mp3';

    let isJumpscareActive = false; // Flag to indicate if the jumpscare is active

    let showJumpscare = false;

      //used to keep track of time
      let countdownTimer;



    backgroundImage.onload = function () {
        startCountdown();

        canvas.addEventListener('click', function (event) {
            // Get the mouse position on the canvas
            const rect = canvas.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const clickY = event.clientY - rect.top;

            // Check if the click is within the image bounds
            if (clickX >= imageX && clickX <= imageX + scaledWidth &&
                clickY >= imageY && clickY <= imageY + scaledHeight) {
                handleImageClick();
            }
        });

        function handleImageClick() {
            clearInterval(countdownTimer); // Assuming 'countdownTimer' is your interval variable for the countdown
            isBalloonFound = true;
            showMessage = true;
            foundSound.play();
        }


        function applyVhsEffect() {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Adjust noise intensity based on whether the jumpscare is active
            const noiseIntensity = isJumpscareActive ? 200 : 20; // More noise for jumpscare

            // Generate noise
            for (let i = 0; i < data.length; i += 4) {
                const noise = Math.random() * noiseIntensity - noiseIntensity / 1;
                data[i] += noise;     // red
                data[i + 1] += noise; // green
                data[i + 2] += noise; // blue
            }

            // Color distortion
            for (let i = 0; i < data.length; i++) {
                if (i % 4 === 0) { // Red channel
                    data[i] = data[i] + 5;
                }
            }

            ctx.putImageData(imageData, 0, 0);

            // Jitter effect
            if (Math.random() < 0.1) {
                const shiftAmount = Math.random() * 5 - .5; // Random shift amount
                ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, shiftAmount, 0, canvas.width - Math.abs(shiftAmount), canvas.height);
            }
        }

        function applyJumpscareVhsEffect() {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Adjust noise intensity based on whether the jumpscare is active
            const noiseIntensity = isJumpscareActive ? 500 : 50; // More noise for jumpscare

            // Generate noise
            for (let i = 0; i < data.length; i += 4) {
                const noise = Math.random() * noiseIntensity - noiseIntensity / 1;
                data[i] += noise;     // red
                data[i + 1] += noise; // green
                data[i + 2] += noise; // blue
            }

            // Color distortion
            for (let i = 0; i < data.length; i++) {
                if (i % 4 === 0) { // Red channel
                    data[i] = data[i] + 5;
                }
            }

            ctx.putImageData(imageData, 0, 0);

            // Jitter effect
            if (Math.random() < 0.1) {
                const shiftAmount = Math.random() * 5 - .5; // Random shift amount
                ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, shiftAmount, 0, canvas.width - Math.abs(shiftAmount), canvas.height);
            }
        }


        function drawScene() {
            // Clear the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw the background image
            ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

            // Apply VHS effect
            applyVhsEffect();

            // Darken the entire scene
            ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Temporary canvas for the brightening effect
            var tempCanvas = document.createElement('canvas');
            var tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = flashlightRadius * 2;
            tempCanvas.height = flashlightRadius * 2;

            // Calculate the relative position of the image to the flashlight
            let relativeImageX = imageX - (mouseX - flashlightRadius);
            let relativeImageY = imageY - (mouseY - flashlightRadius);

            // Draw the part of the background image under the flashlight
            tempCtx.drawImage(canvas, mouseX - flashlightRadius, mouseY - flashlightRadius,
                flashlightRadius * 2, flashlightRadius * 2,
                0, 0, flashlightRadius * 2, flashlightRadius * 2);

            // Apply brightening effect
            var brighteningFactor = 25; // Adjust this factor to control brightness
            var imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            var data = imageData.data;
            for (var i = 0; i < data.length; i += 4) {
                data[i] = data[i] * brighteningFactor; // red
                data[i + 1] = data[i + 1] * brighteningFactor; // green
                data[i + 2] = data[i + 2] * brighteningFactor; // blue
            }
            tempCtx.putImageData(imageData, 0, 0);

            tempCtx.drawImage(balloonImage, relativeImageX, relativeImageY, 100, 100);

            // Create a radial gradient for the flashlight effect on the temporary canvas
            var radialGradient = tempCtx.createRadialGradient(flashlightRadius, flashlightRadius, 0,
                flashlightRadius, flashlightRadius, flashlightRadius);
            radialGradient.addColorStop(0, 'rgba(255, 255, 255, 1)'); // Brightest at the center
            radialGradient.addColorStop(1, 'rgba(255, 255, 255, 0)'); // Fades out

            // Apply the radial gradient as a mask for the brightening effect
            tempCtx.globalCompositeOperation = 'destination-in';
            tempCtx.fillStyle = radialGradient;
            tempCtx.beginPath();
            tempCtx.arc(flashlightRadius, flashlightRadius, flashlightRadius, 0, Math.PI * 2);
            tempCtx.fill();

            // Draw the brightened, circular part on the main canvas
            ctx.globalCompositeOperation = 'source-over';
            ctx.drawImage(tempCanvas, mouseX - flashlightRadius, mouseY - flashlightRadius);


            // Apply VHS effect
            applyVhsEffect();




            drawVhsText("REC 00:00:01", canvas.width / 2, 30);

            // Display local time and date
            const currentDate = new Date();
            const timeText = currentDate.toLocaleTimeString();
            const dateText = currentDate.toLocaleDateString();

            ctx.font = '20px Arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';

            ctx.fillText(timeText, 10, 10);
            ctx.fillText(dateText, 10, 40);

            // Check if the jumpscare should be shown
            if (showJumpscare) {
                // Draw the jumpscare image
                ctx.drawImage(jumpscareImage, canvas.width / 4, canvas.height / 4, canvas.width / 2, canvas.height / 1.25);

                // Apply VHS effect over jumpscare image
                applyJumpscareVhsEffect()
            }

            if (showMessage) {
                ctx.font = '100px Scary';
                ctx.fillStyle = 'red';
                ctx.textAlign = 'center';
                ctx.fillText("You found it", canvas.width / 2, canvas.height / 2 - 50);
            }


        }


        function drawVhsText() {
            // Format time as MM:SS
            const minutes = Math.floor(remainingTime / 60).toString().padStart(2, '0');
            const seconds = (remainingTime % 60).toString().padStart(2, '0');

            const text = `REC ${minutes}:${seconds}`;

            // Set font style for VHS text
            ctx.font = '20px Arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = 'white';
            ctx.shadowBlur = 10;

            // Draw the text
            ctx.fillText(text, canvas.width / 2, 30);

            // Reset shadow settings
            ctx.shadowBlur = 0;
        }

        // Update mouseX and mouseY positions on mousemove
        function handleMouseMove(event) {
            mouseX = event.clientX;
            mouseY = event.clientY;
        }
        canvas.addEventListener('mousemove', handleMouseMove);
        // Function to start countdown...
        let remainingTime = 0; // Start from 0

        function startCountdown() {
            countdownTimer = setInterval(() => {
                remainingTime += 1;
                drawVhsText(); // Update the countdown text
                if (remainingTime >= 10) {
                    clearInterval(countdownTimer);
                    triggerJumpscare();
                }
            }, 1000);
        }



        setInterval(drawScene, 10);

        function triggerJumpscare() {
            showJumpscare = true;
            jumpscareSound.play();
            isJumpscareActive = true; // Set the jumpscare flag to true
            ctx.drawImage(jumpscareImage, canvas.width / 4, canvas.height / 4, canvas.width / 2, canvas.height / 2);

            // Apply the jumpscare-specific VHS effect
            applyJumpscareVhsEffect();

        }

    };
});
