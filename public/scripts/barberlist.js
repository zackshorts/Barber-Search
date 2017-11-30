function initApp() {
    // Listening for auth state changes.
    // [START authstatelistener]
    firebase.auth().onAuthStateChanged(function (user) {
        var query = firebase.database().ref("barber").orderByKey();
        query.once("value")
            .then(function (snapshot) {
                var barberList = document.querySelector("#barber-list");
                snapshot.forEach(function (childSnapshot) {
                    var key = childSnapshot.key;
                    var childData = childSnapshot.val();

                    var barberItem =
                        `<div class="barber-item">
                            <img class="barber-photo" src="${childData.photoURL}">
                            <div class="barber-info">
                                <a href="profile.html"><h1 class="barber-name">${childData.barberShop? childData.barberShop : childData.fName}</h1></a>
                                <h2 class="barber-location">${childData.location? childData.location : 'USA'}</h2>
                            </div>
                        </div>`;

                    barberList.insertAdjacentHTML('beforeend', barberItem);
                });
            });
    });
    // [END authstatelistener]

}
window.onload = function () {
    initApp();
}