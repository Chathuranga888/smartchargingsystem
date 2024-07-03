// Your Firebase configuration code snippet from Firebase Console
var firebaseConfig = {
    apiKey: "AIzaSyDqx_Gob-8muirLbL72D1J0Z13UmoGKGBM",
    authDomain: "hardware-project-a6b3e.firebaseapp.com",
    databaseURL: "https://hardware-project-a6b3e-default-rtdb.firebaseio.com",
    projectId: "hardware-project-a6b3e",
    storageBucket: "hardware-project-a6b3e.appspot.com",
    messagingSenderId: "154688512600",
    appId: "1:154688512600:web:78edbf9d58a706db92202d"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

document.getElementById("sign-in-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the form from submitting and refreshing the page

    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        // Signed in 
        var user = userCredential.user;
        document.getElementById("sign-in-status").innerText = "Sign in successful!";
        // Redirect to dashboard or other page
        window.location.href = "dashboard.html";
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        document.getElementById("sign-in-status").innerText = errorMessage;
    });
});
