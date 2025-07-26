let imageUrl = null;

document.getElementById("btnGetQR").addEventListener("click", async () => {
    const url = document.getElementById("urlText").value.trim();

    if (!url) {
        alert("Please enter a URL or text!");
        return;
    }

    // Send POST request to backend Flask server
    try {
        const response = await fetch("http://localhost:3000/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: url }),
        });

        const data = await response.json();

        if (!data.qrCode) {
            alert("Failed to generate QR code.");
            return;
        }

        // Display QR code
        const qrContainer = document.getElementById("qr");
        qrContainer.innerHTML = `<img id="qrImage" src="${data.qrCode}" alt="QR Code">`;

        imageUrl = data.qrCode; // Save for download buttons
    } catch (error) {
        console.error("Error generating QR:", error);
        alert("Server error! Is the backend running?");
    }
});

// Download QR as Image
document.querySelector(".dnldImg").addEventListener("click", () => {
    if (!imageUrl) {
        alert("Generate the QR code first!");
        return;
    }

    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "qr_code.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Download QR as PDF with label
document.querySelector(".dnldPdf").addEventListener("click", () => {
    if (!imageUrl) {
        alert("Generate the QR code first!");
        return;
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
        const label = document.getElementById("urlText").value.trim() || "QR Code";

        pdf.setFontSize(14);
        pdf.text("QR for: " + label, 10, 20); // Add label
        pdf.addImage(img, "PNG", 10, 30, 100, 100); // Insert image
        pdf.save("qr_code.pdf");
    };
});


//FOR PWA----------FAILED------------------------- let deferredPrompt;

// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//         navigator.serviceWorker.register('service-worker.js')
//             .then(reg => console.log('Service Worker registered!', reg))
//             .catch(err => console.error('Service Worker failed:', err));
//     });
// }

// // Listen for the install prompt
// window.addEventListener('beforeinstallprompt', (e) => {
//     // Prevent the mini-infobar from appearing on mobile
//     e.preventDefault();
//     // Save the event so it can be triggered later
//     deferredPrompt = e;
//     // Show your custom "Get App" button
//     document.getElementById("getApp").style.display = 'block';
// });

// // Handle click on "Get App" button
// document.getElementById("getApp").addEventListener('click', async () => {
//     if (deferredPrompt) {
//         deferredPrompt.prompt(); // Show the browser install prompt
//         const choiceResult = await deferredPrompt.userChoice;
//         console.log(`User response to the install prompt: ${choiceResult.outcome}`);
//         deferredPrompt = null;
//     }
// });

