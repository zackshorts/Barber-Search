var storageRef = firebase.storage().ref();
const moneyRegex = /^\d+(?:\.\d{0,2})$/;
var user;
var rootRef;
var userRef;
var servicesRef;
var service = document.querySelector('#service-input');
var price = document.querySelector('#price-input');

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

        user = firebase.auth().currentUser;
        rootRef = firebase.database().ref();
        userRef = rootRef.child('barber').child(user.uid);
        servicesRef = userRef.child('services');

        userRef.once('value', function (snapshot) {
            //general info setup
            document.querySelectorAll('input').forEach((input) => {
                var key = input.dataset.key;
                input.value = snapshot.val()[key] ? snapshot.val()[key] : '';
            });

            //image setup
            storageRef.child(snapshot.val().photoURL).getDownloadURL().then(function (url) {
                img.src = url;
            }).catch(function (error) {
                img.src = snapshot.val().photoURL ? snapshot.val().photoURL : 'images/default.png';
            });
        });
        //services setup
        servicesRef.once('value', function(snapshot){
            for (snap in snapshot.val()){
                trHTML = `
                <tr>
                    <td>${snap}</td>
                    <td>${snapshot.val()[snap]}</td>
                </tr>`;
                var serviceTable = document.querySelector('#service-table tbody');
                serviceTable.insertAdjacentHTML('afterbegin', trHTML);
            }
        });
    });

    document.querySelectorAll('form').forEach((form) => {
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            var input = event.target.querySelector('input')

            input.blur();

            var user = firebase.auth().currentUser;
            var rootRef = firebase.database().ref();
            var userRef = rootRef.child('barber').child(user.uid);

            userRef.once('value', function (snapshot) {
                var key = input.dataset.key;
                userRef.child(key).set(input.value);
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
    if (moneyRegex.test(price.value) && service.value) {
        trHTML = `
        <tr>
            <td>${service.value}</td>
            <td>${formatMoney(price.value)}</td>
        </tr>`;
        var serviceTable = document.querySelector('#service-table tbody');
        serviceTable.insertAdjacentHTML('beforeend', trHTML);

        servicesRef.once('value', function (snapshot) {
            console.log('hi')
            var key = service.value;
            servicesRef.child(key).set(formatMoney(price.value));
            service.value = '';
            price.value = '';
        });
    }
});

function formatMoney(n) {
    n = parseFloat(n);
    return "$" + n.toFixed(2).replace(/./g, function (c, i, a) {
        return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
    });
}


window.onload = function () {
    initApp();
};
