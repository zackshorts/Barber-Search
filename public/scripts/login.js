function onSignIn(googleUser) {
    var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
        unsubscribe();

        if (!isUserEqual(googleUser, firebaseUser)) {
            var credential = firebase.auth.GoogleAuthProvider.credential(
                googleUser.getAuthResponse().id_token
            );

            firebase.auth().signInWithCredential(credential)
                .catch(function(error) {
                    console.log(`error ${errorCode}: ${error.message}.`)
                })
                .then(function() {
                    setCredentials();
                });
        }
        else if (firebase.auth().currentUser) {
            setCredentials();
        }
    });
}

function setCredentials() {
    var user = firebase.auth().currentUser;

    var rootRef = firebase.database().ref();
    var userRef = rootRef.child('barber').child(user.uid);

    userRef.once('value', function(snapshot) {
        if (!snapshot.hasChild('email'))
        userRef.child('email').set(user.email);
        if (!snapshot.hasChild('fName'))
        userRef.child('fName').set(user.displayName);
        if (!snapshot.hasChild('photoURL'))
        userRef.child('photoURL').set(user.photoURL);
      });

    window.location.href = '../profile.html';
}

function isUserEqual(googleUser, firebaseUser) {
    if (firebaseUser) {
        var providerData = firebaseUser.providerData;
        for (var i = 0; i < providerData.length; i++) {
            if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                providerData[i].uid === googleUser.getBasicProfile().getId()) {
                // We don't need to reauth the Firebase connection.
                return true;
            }
        }
    }
    return false;
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        firebase.auth().signOut()
        console.log('User signed out.');
    });
}