import Vizzu from 'https://vizzu-lib-main.storage.googleapis.com/lib/vizzu.js';


async function digestMessage(message) {
	const msgUint8 = new TextEncoder().encode(message);
  	const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
 	const hashArray = Array.from(new Uint8Array(hashBuffer));
 	const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
 	return hashHex;
}


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const testCase = urlParams.get('testCase')
import("./testCases/" + testCase).then((module) => {
    let chart = new Vizzu('vizzuCanvas');
    let promise = chart.initializing
    for (let i = 0; i < module.default.testSteps.length; i++) {
        promise = promise.then(module.default.testSteps[i].task)
        promise.then(async () => {
            var cavasElement = document.getElementById("vizzuCanvas");

            //var canvasElementContext = cavasElement.getContext("2d");
            //var ImageData = canvasElementContext.getImageData(60, 60, 200, 100);
            //canvasElementContext.putImageData(ImageData, 150, 10);
            //console.log(ImageData);

            var dataURL = cavasElement.toDataURL();
            const digestBuffer = await digestMessage(dataURL);
            if (module.default.testSteps[i].ref == digestBuffer) {
                console.log(testCase + ':' + i + ':' + 'PASSED');
            } else {
                console.error(testCase + ':' + i + ':' + 'FAILED' + ':' + digestBuffer);
            }
        })
    }
})