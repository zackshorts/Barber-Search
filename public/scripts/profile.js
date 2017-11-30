function initApp() {
    // Listening for auth state changes.
    // [START authstatelistener]
    firebase.auth().onAuthStateChanged(function (user) {
        var name = document.querySelector('#name-input');
        var email = document.querySelector('#email-input');
        var profilePic = document.querySelector('#profile-pic');
        var barbershop = document.querySelector('#barbershop-input');
        var location = document.querySelector('#location-input');
        var img = document.querySelector('img');

        var user = firebase.auth().currentUser;
        var rootRef = firebase.database().ref();
        var userRef = rootRef.child('barber').child(user.uid);

        userRef.once('value', function(snapshot) {
            document.querySelectorAll('input').forEach((input)=>{
                var key = input.dataset.key;
                input.value = snapshot.val()[key];
            });
            img.src = snapshot.val().photoURL;
        });
    });
    
    document.querySelectorAll('form').forEach((form)=>{
        form.addEventListener("submit", (event) =>{
            event.preventDefault();
            var input = event.target.querySelector('input')

            input.blur();

            var user = firebase.auth().currentUser;
            var rootRef = firebase.database().ref();
            var userRef = rootRef.child('barber').child(user.uid);
            
            userRef.once('value', function(snapshot) {
                var key = input.dataset.key;
                userRef.child(key).set(input.value);
            });
        });
    });

}
window.onload = function () {
    initApp();
};
