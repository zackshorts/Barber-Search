console.log("hello");

<!--Firebase-->

    function initApp() {
        // Listening for auth state changes.
        // [START authstatelistener]
        firebase.auth().onAuthStateChanged(function (user) {
            var name = document.querySelector('#name');
            var email = document.querySelector('#email');
            var profilePic = document.querySelector('#profile-pic');
            var user = firebase.auth().currentUser;


            name.innerHTML = `Name: ${user.displayName}`;
            email.innerHTML = `Email: ${user.email}`;
            profilePic.src = user.photoURL;
        });
        // [END authstatelistener]

    }
window.onload = function () {
    initApp();
};
