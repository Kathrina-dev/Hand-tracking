navigator.mediaDevices.getUserMedia = 
    navigator.mediaDevices.getUserMedia || 
    navigator.mediaDevices.webkitGetUserMedia || 
    navigator.mediaDevices.mozGetUserMedia || 
    navigator.mediaDevices.msGetUserMedia;

const webcamVideo = document.querySelector('.webcamVideo'); 
const playbackVideo = document.querySelector('.playbackVideo');
const canvas = document.querySelector('.canvas');
const context = canvas.getContext('2d');
let model;

playbackVideo.style.display = 'none';

const modelParams = {
    flipHorizontal: true,
    maxNumBoxes: 1,
    iouThreshold: 0.5,
    scoreThreshold: 0.6,
};

handTrack.startVideo(webcamVideo)
    .then(status => {
        if (status) {
            navigator.mediaDevices.getUserMedia({ video: {} })
                .then(stream => { 
                    webcamVideo.srcObject = stream;
                    startDetection(); 
                })
                .catch(err => console.log('Error accessing webcam: ', err));
        } else {
            console.log('Please enable webcam access');
        }
    });

function runDetection() {
    model.detect(webcamVideo)
        .then(predictions => {
            console.log(predictions); 

            context.clearRect(0, 0, canvas.width, canvas.height);

            model.renderPredictions(predictions, canvas, context, webcamVideo);

            if (predictions.length > 0) {

                const handGesture = predictions[0].label;

                if(handGesture === 'open'){
                    playbackVideo.style.display = 'block';
                    playbackVideo.play();
                }

                if(handGesture === 'closed'){
                    playbackVideo.pause();
                }
            }
        });
}

handTrack.load(modelParams)
    .then(loaded_model => {
        model = loaded_model;
        console.log("Handtrack.js model loaded");
    });

function startDetection() {
    webcamVideo.addEventListener('loadeddata', () => {

        canvas.width = webcamVideo.videoWidth;
        canvas.height = webcamVideo.videoHeight;

        setInterval(() => {
            runDetection();
        }, 100); 
    });
}

