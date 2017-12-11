var storageRef = firebase.storage().ref();



function initApp() {
    // Listening for auth state changes.
    // [START authstatelistener]

    firebase.auth().onAuthStateChanged(function (user) {
        var query = firebase.database().ref("barber").orderByKey();
        if(firebase.auth().currentUser != null) {
            console.log("signed in");

        } else {
            console.log("signed out");
            var element = document.querySelector('#editprofile');
            element.classList.add('hide');
        }
        query.once("value")
            .then(function (snapshot) {
                var barberList = document.querySelector("#barber-list");
                snapshot.forEach(function (childSnapshot) {
                    var key = childSnapshot.key;
                    var childData = childSnapshot.val();

                    var barberItem =
                        `<a class="loading" href="profile.html?barber=${key}"><div class="barber-item">
                            <img class="barber-photo" data-path=${childData.photoURL}>
                            <div class="barber-info">
                                <h1 class="barber-name">${childData.barberShop ? childData.barberShop : childData.fName}</h1>
                                <h2 class="barber-location">${childData.location ? childData.location : 'USA'}</h2>
                            </div>
                        </div><div class="loader"></div></a>`;

                    barberList.insertAdjacentHTML('beforeend', barberItem);
                });
                barberList.querySelectorAll('a').forEach((item)=> {
                    getImage(item);
                })
            });
    });



}

function getImage(item) {
    var img = item.querySelector('.barber-photo');
    var photoURL = item.querySelector('.barber-photo').dataset.path;
    img.onload = function() {
        item.classList.remove('loading');
    }
    
    if (!photoURL || photoURL === 'undefined') {
        img.src =  'images/default.png'
    } else {
        storageRef.child(photoURL).getDownloadURL().then(function (url) {
            img.src = url;
        }).catch(function (error) {
            img.src =  photoURL;
        });
    }
}
window.onload = function () {
    initApp();
}
