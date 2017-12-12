var storageRef = firebase.storage().ref();
var user;
var userID;
var rootRef;
var userRef;
var servicesRef;
var service = document.querySelector('#service-input');
var price = document.querySelector('#price-input');
var img = document.querySelector('img');

function initApp() {
    // Listening for auth state changes.
    // [START authstatelistener]
    if(getParameterByName('barber')){
        userID = getParameterByName('barber')
        rootRef = firebase.database().ref();
        userRef = rootRef.child('barber').child(userID);
        servicesRef = userRef.child('services');
        firebase.auth().onAuthStateChanged(function (user) {
            var query = firebase.database().ref("barber").orderByKey();
            if(firebase.auth().currentUser != null) {
                console.log("signed in");

            } else {
                console.log("signed out");
                var element = document.querySelector('#editprofile');
                element.classList.add('hide');
            }
        });

        document.body.id = 'view-only'
        document.querySelectorAll('form').forEach((form)=>{
            var input = form.querySelector('input');
            input.setAttribute('readonly', 'readonly');
        });
        setup();
    } else {
        firebase.auth().onAuthStateChanged(function (user) {
            var name = document.querySelector('#name-input');
            var email = document.querySelector('#email-input');
            var profilePic = document.querySelector('#profile-pic');
            var barbershop = document.querySelector('#barbershop-input');
            var location = document.querySelector('#location-input');

            user = firebase.auth().currentUser;
            userID = user.uid;
            rootRef = firebase.database().ref();
            userRef = rootRef.child('barber').child(userID);
            servicesRef = userRef.child('services');

            if(firebase.auth().currentUser != null) {
                console.log("signed in");

            } else {
                console.log("signed out");
                var element = document.querySelector('#editprofile');
                element.classList.add('hide');
            }

            setup();
        });

        document.querySelectorAll('input:not(.service)').forEach((input) => {
            input.addEventListener('focus', event => {
                event.preventDefault();
                input.dataset.value = input.value;
            });
        });

        document.querySelectorAll('form').forEach(form=> {
            form.addEventListener('submit', event =>{
                event.preventDefault();
                form.querySelector('input').blur();
            });
        });

        document.querySelectorAll('input').forEach((input)=>{
            input.addEventListener('click', (event) =>{
                input.parentElement.classList.add('active');
            });

            input.addEventListener('blur', (event) =>{
                input.parentElement.classList.remove('active');
                if (!event.target.classList.contains('service')){
                    event.preventDefault();
                    updateInfo(event.target)
                }
            });
        })

        document.querySelector('img').addEventListener('click', (event) => {
            document.querySelector('#getval').click();
        })

        let updateInfo = (input) => {
            if (input.dataset.value !== input.value){
                input.blur();
                snackBarInit();

                var user = firebase.auth().currentUser;
                var rootRef = firebase.database().ref();
                var userRef = rootRef.child('barber').child(user.uid);

                userRef.once('value', function (snapshot) {
                    var key = input.dataset.key;
                    userRef.child(key).set(input.value);
                    snackBarComplete();
                    console.log('done');
                });
            }
        }
    }
}

snackBarInit = () => {
    var snackBar = document.getElementById("snackbar");
    snackBar.className = 'show';
    snackBar.innerHTML = 'Updating Profile';
}

snackBarComplete = () => {
    var snackBar = document.getElementById("snackbar");
    snackBar.innerHTML = 'Profile Updated';
    setTimeout(function(){ snackBar.className = snackBar.className.replace("show", ""); }, 1000);
}

function setup() {
    userRef.once('value', function (snapshot) {
        //general info setup
        document.querySelectorAll('input').forEach((input) => {
            var key = input.dataset.key;
            input.value = snapshot.val()[key] ? snapshot.val()[key] : '';
            if (!input.value && document.body.id === 'view-only' && input.classList.contains('data')){
                input.parentNode.previousElementSibling.remove();
                input.parentNode.remove();
            }
        });

        //image setup
        getImage(snapshot.val().photoURL,img);
    });
    //services setup
    var serviceTable = document.querySelector('#service-table tbody');
    servicesRef.once('value', function(snapshot){
        for (snap in snapshot.val()){
            trHTML = `
            <tr>
                <td>${snap}</td>
                <td>${snapshot.val()[snap]}</td>
            </tr>`;
            serviceTable.insertAdjacentHTML('afterbegin', trHTML);
        }
        document.body.style.display = 'initial';
        if (serviceTable.childElementCount === 0){
            document.querySelector('#service-table').classList.add('empty');
        }
        serviceTable.querySelectorAll('tr').forEach(tr=>{
            tr.addEventListener('click', (e) =>{
                if (e.offsetX > tr.offsetWidth) {
                    snackBarInit();
                    servicesRef.child(tr.querySelector('td').innerHTML).remove();
                    tr.remove();
                    snackBarComplete();
                }
            });
        });
    });
}

imageInput = document.querySelector('#getval');
imageInput.addEventListener('change', () => {
    var file = imageInput.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
        document.querySelector("#profile-pic").src = reader.result;
    }
    if (file) {
        snackBarInit();
        reader.readAsDataURL(file);
        var imagePath = `images/${guid(file.name)}`;
        var imageRef = storageRef.child(imagePath);
        imageRef.put(file).then(() => {
            var user = firebase.auth().currentUser;
            var rootRef = firebase.database().ref();
            var userRef = rootRef.child('barber').child(user.uid);

            userRef.once('value', function (snapshot) {
                console.log('done');
                userRef.child('photoURL').set(imagePath);
                snackBarComplete();
            });
        })
    } else {
    }
}, true);

function guid(fileName) {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    function getFileExtension(filename) {
        return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4() + '.' + getFileExtension(fileName);
}

document.querySelector('.add-button').addEventListener('click', (event) => {
    event.preventDefault();
    snackBarInit();
    if (price.value && service.value) {
        trHTML = `
        <tr>
            <td>${service.value}</td>
            <td>${formatMoney(price.value)}</td>
        </tr>`;
        var serviceTable = document.querySelector('#service-table tbody');
        serviceTable.insertAdjacentHTML('beforeend', trHTML);

        servicesRef.once('value', function (snapshot) {
            var key = service.value;
            servicesRef.child(key).set(formatMoney(price.value));
            service.value = '';
            price.value = '';
            snackBarComplete();
        });
    }
});

function formatMoney(n) {
    var n = n.replace(/[`~!@#$%^&*()_|+\-=?;:'",<>\{\}\[\]\\\/]/gi, '');
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    });
    return formatter.format(n);
}

function getParameterByName(name) {
    url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getImage(photoURL,img) {
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
};
