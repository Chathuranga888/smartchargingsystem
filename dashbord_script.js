
  // Initialize Firebase
  var firebaseConfig = {
    apiKey: "AIzaSyDqx_Gob-8muirLbL72D1J0Z13UmoGKGBM",
    authDomain: "hardware-project-a6b3e.firebaseapp.com",
    databaseURL: "https://hardware-project-a6b3e-default-rtdb.firebaseio.com",
    projectId: "hardware-project-a6b3e",
    storageBucket: "hardware-project-a6b3e.appspot.com",
    messagingSenderId: "154688512600",
    appId: "1:154688512600:web:78edbf9d58a706db92202d"
  };
  firebase.initializeApp(firebaseConfig);
  var database = firebase.database();



// Function to delete data
function deleteData() {
    var databaseRef = firebase.database().ref('/Real_Time_Image_URL');
    databaseRef.remove()
        .then(function() {
        console.log("Data deleted successfully.");
        })
        .catch(function(error) {
        console.error("Delete failed: " + error.message);
        });
    }

// function to get data from firebase and update it HTML page
function getData() {
var ref = database.ref('/Hardware_project');
ref.on('value', function(snapshot) {
    var data = snapshot.val();
    console.log(data);
    document.getElementById('message').innerText = JSON.stringify(data);
}, function(error) {
    console.error('Error reading data:', error);
    document.getElementById('message').innerText = 'Error reading data';
});
}

// Function to get data from Firebase and update notification in HTML
function getData1() {
    var ref = database.ref('/notifications');
    ref.on('value', function(snapshot) {
        var data = snapshot.val();
        var filteredData = {};
        for (var key in data) {
        if (data[key].message === 'Notification from Raspberry Pi') {
            filteredData[key] = data[key];
        }
    }
console.log(filteredData);

// Update the HTML element with the message
const messageKey = Object.keys(filteredData)[0];
const message = filteredData[messageKey]?.message;
if (message) {
document.getElementById('notifications').innerText = message;
} else {
document.getElementById('notifications').innerText = 'No matching notifications';
}
}, function(error) {
console.error('Error reading data:', error);
document.getElementById('notifications').innerText = 'Error reading data';
});
}

var imageUrl = '';
var imageKey = '';
function getRealTimeImage() {
var ref = database.ref('/Real_Time_Image_URL');
ref.on('value', function(snapshot) {
    var data = snapshot.val();
    console.log(data);
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            imageUrl = data[key].imageUrl;
            imageKey = key;
            break;
        }
    }
    // document.getElementById('real-time-image-url').innerText = imageUrl;
}, function(error) {
    console.error('Error reading data:', error);
    document.getElementById('real-time-image-url').innerText = 'Error reading data';
});
}

document.getElementById('redirect-button').addEventListener('click', function() {
const imgElement = document.getElementById('image-display');
if (imageUrl) {
    // window.location.href = imageUrl;
    imgElement.src = imageUrl;
    imgElement.style.display = 'block';
} else {
    alert('Image URL is not available');
}
});

document.getElementById('delete-button').addEventListener('click', function() {
if (imageKey) {
    var ref = database.ref('Real_Time_Image_URL/' + imageKey);
    ref.remove()
        .then(function() {
            alert('Image URL deleted successfully.');

            var imgElement = document.getElementById('image-display');
            imgElement.src = '';
            imgElement.style.display = 'none';

            // document.getElementById('real-time-image-url').innerText = '';
            imageUrl = '';
            imageKey = '';
            document.getElementById('notifications').innerHTML = 'No Notifications';
        })

        .catch(function(error) {
            console.error('Error deleting data:', error);
            alert('Error deleting data.');
        });
} else {
    alert('No image URL to delete.');
}
});

// check each available box in tha database
function fetchImageUrl(boxId) {
    var ref = database.ref('/Hardware_project');  // Path to images in Firebase Realtime Database
    ref.get().then((snapshot) => {
        if (snapshot.exists()) {
            let found = false;
            snapshot.forEach((childSnapshot) => {
                const data = childSnapshot.val();
                if (data.id === boxId) {

                    const imgElement = document.getElementById(`box-image-display-${boxId}`);
                    imgElement.src = data.imageUrl;
                    imgElement.style.display = 'block';

                    // window.open(data.imageUrl, '_blank');
                    found = true;
                }
            });
            if (!found) {
                alert('No phone in this box');
            }
        } else {
            alert('No data available');
        }
    }).catch((error) => {
        console.error(error);
    });
  }

 // Function to delete data from Firebase by id
 function deleteRecordById(id) {
    const dbRef = firebase.database().ref('Hardware_project');

    dbRef.once('value', (snapshot) => {
      const records = snapshot.val();
      for (let key in records) {
        if (records[key].id === id) {

            var imgElement = document.getElementById(`box-image-display-${id}`);
            imgElement.src = '';
            imgElement.style.display = 'none';

          firebase.database().ref('Hardware_project/' + key).remove()
            .then(() => {
              console.log('Data successfully deleted!');
              alert('Data successfully deleted!');
            })
            .catch((error) => {
              console.error('Error deleting data:', error);
            });
          break;
        }
      }
    })};
  
// flask setup for the sending data
function unlockBox(box){
    fetch('http://<raspberry_pi_ip>:5000/unlock', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'box=' + box
    })
    .then(response => response.text())
    .then(data => alert(data))
    .catch(error => console.error('Error:', error));

}

    document.getElementById('button1').addEventListener('click', () => fetchImageUrl(1));
    document.getElementById('button2').addEventListener('click', () => fetchImageUrl(2));
    document.getElementById('button3').addEventListener('click', () => fetchImageUrl(3));
    document.getElementById('button4').addEventListener('click', () => fetchImageUrl(4));

  // Fetch data from Firebase
  getRealTimeImage();
  getData();
  getData1();
