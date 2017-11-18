// firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
// .then(function() {
//     var provider = new firebase.auth.GoogleAuthProvider();
//   // In memory persistence will be applied to the signed in Google user
//   // even though the persistence was set to 'none' and a page redirect
//   // occurred.
//   window.location.href = "../main.html";
//   return firebase.auth().signInWithRedirect(provider);
// })
// .catch(function(error) {
//   // Handle Errors here.
//   var errorCode = error.code;
//   var errorMessage = error.message;
// });
var provider = new firebase.auth.GoogleAuthProvider();
firebase.auth().signInWithPopup(provider).then(function(result) {
    //  var token = result.credential.accessToken;
   
    // console.log(result);
    // var userID = result.user.ca.displayName;
    // var user = result.user;
    // console.log(user);
    
    // firebase.database().ref('barber/' + userId).set({
    //     fname: userID
    //   });

    var rootRef = firebase.database().ref();
    var barberRef = rootRef.child('barber');
    var fnameRef = barberRef.push();
    console.log(fnameRef);
    fnameRef.set({
      fname: "Zachary Shorts",
      email: "shorts23@gmail.com"
    });

  }).catch(function(error) {
    // Handle Errors here.
    console.log("test");
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    //window.location.href = "../404.html";
    // ...
  });

// function onSignIn(googleUser) {
//     var profile = googleUser.getBasicProfile();
//     console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
//     console.log('Name: ' + profile.getName());
//     console.log('Image URL: ' + profile.getImageUrl());
//     console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
//     firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
//     firebase.database().ref('barber/' + profile.getId()).set({
//         fname: profile.getName()
//     });
//   }

  function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }
  