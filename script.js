import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getFirestore, getDocs, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAz66bT3t2EjwwAuioRp6zw0_onzxFUZ5w",
    authDomain: "products-de1a7.firebaseapp.com",
    databaseURL: "https://products-de1a7-default-rtdb.firebaseio.com",
    projectId: "products-de1a7",
    storageBucket: "products-de1a7.appspot.com",
    messagingSenderId: "962045111284",
    appId: "1:962045111284:web:3e16eaea719ea9c263e7a1"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore()

const cartPage = document.querySelector('.cartPage')
const totalAmount = document.querySelector('.totalAmount')
const gridDiv = document.querySelector('.myData')
const cartTable = document.querySelector('.myCart')
const productsPage = document.querySelector('.productsPage')
const checkOutPage = document.querySelector('.checkOutPage')
const confirmOrder = document.querySelector('.confirmOrder')
const username = document.querySelector('#userName')
const password = document.querySelector('#userPw')
const loginBtn = document.querySelector('.loginBtn')
const checkOutData = document.querySelector('.checkOutData')
const adminPage = document.querySelector('.adminPage')
const signOut = document.querySelector('.signOut')
const nameUser = document.getElementById('nameUser')
const emailUser = document.getElementById('emailUser')
const phNum = document.getElementById('phNum')




let cartDisplay = []
cartDisplay = JSON.parse(localStorage.getItem('cart')) || []
var cartArr = [...cartDisplay]

async function getAllData() {
    const ref = collection(db, 'products')
    const querySnapshot = await getDocs(ref)
    const data = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    // console.log(data)
    data.forEach((datas) => {
        let myDiv = document.createElement('div')
        myDiv.classList.add('text-center')
        myDiv.classList.add('p-5')

        const { name, price, weight, image } = datas
        myDiv.innerHTML = ''
        myDiv.innerHTML += `
                    
                <img src="${image}"><br>
                <h2> ${name}</h2>
                <h5>Rs : ${price}</h5>
                <h7 >Weight : ${weight} kg<h7><br>
                <button type="button" class="btn btn-outline-dark" data-name="${name}"  data-price="${price}">Add To Cart</button><br>
                `
        gridDiv.appendChild(myDiv)

        document.querySelectorAll('button').forEach(button => {
            button.onclick = function () {

                cartArr.push({ name: this.dataset.name, price: this.dataset.price })
                // console.log(cartArr)
                localStorage.setItem('cart', JSON.stringify(cartArr))
                Toastify({
                    text: `${this.dataset.name} added to cart`,
                    duration: 1500,
                }).showToast();

            }
        })
        // console.log(datas)
    })
}

// localStorage.getItem('total') !== null || '0' ?
function viewCart() {
    // console.log('cart')
    let sum = 0;
    localStorage.setItem('total', sum)

    // let newArr = [...cartDisplay]
    console.log(cartArr)
    // cartArr = [...cartDisplay]
    // cartDisplay = [...cartArr]
    cartDisplay ? cartDisplay.forEach((obj, idx) => {
        const { name, price } = obj
        console.log(name, idx)
        let display = document.createElement('tr')
        let myNum = parseInt(price)
        sum += myNum
        display.innerHTML = ''
        display.innerHTML += `
        <td>${name}</td>
        <td>${price}</td>
        <td><button class="btn deleteBtn btn-outline-dark" data-name="${name}"  data-price="${price}" data-idx="${idx}">X</button></td>
        `
        cartTable.appendChild(display)
    }) : false

    let total = document.createElement('div')
    total.classList.add('pt-4')
    total.classList.add('text-center')

    total.innerHTML = ''
    total.innerHTML = `<h1>Total : ${sum} Rs</h1>`
    totalAmount.appendChild(total)
    console.log(sum)
    localStorage.setItem('total', sum)
    document.querySelectorAll('.deleteBtn').forEach(button => {
        button.onclick = function () {
            console.log(this.dataset.idx)
            console.log(cartDisplay.splice(this.dataset.idx, 1))
            console.log(cartDisplay)

            localStorage.setItem('cart', JSON.stringify(cartArr))
            window.location.reload(false)

        }
    })
}

function checkOutDisplay() {
    // if (localStorage.getItem('total') === null || '0') {
    //     alert('WoW!! such empty')
    //     location.replace("http://127.0.0.1:5501/fireBase/signup-login-V2/products.html")
    // }
    // else {
    let mydiv = document.createElement('div')
    mydiv.innerHTML = ''
    mydiv.innerHTML += `
    <h2>Order Number: ${localStorage.getItem('randid')}</h2>
    <h2 class="pt-3">Total Amount: ${localStorage.getItem('total')}</h2>

    `
    checkOutData.appendChild(mydiv)
    confirmOrder.addEventListener('click', async () => {
        var ref = collection(db, 'usersCheckOut')
        const docref = await addDoc(
            ref, {
            name: nameUser.value,
            email: emailUser.value,
            num: phNum.value,
            cart: JSON.parse(localStorage.getItem('cart'))
        }
        ).then(() => {
            // alert('Congratulations !!! Your Order is Confirmed ')
            Toastify({
                text: ` Congratulations ${nameUser.value} !!! Your Order is Confirmed`,
                duration: 1500,
            }).showToast();
            location.replace("http://127.0.0.1:5501/fireBase/signup-login-V2/products.html")
            localStorage.clear()
        })

    })
}
// }

function onAdminPageLoad() {
    if (localStorage.getItem('userID') !== null || undefined) {
        location.replace("http://127.0.0.1:5501/fireBase/signup-login-V2/addProducts.html")

    }
    else {
        authenticateUser
    }
}

const authenticateUser = async () => {

    const ref = collection(db, 'users')
    const querySnapshot = await getDocs(ref)
    const data = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    console.log(data[0])
    data.forEach((datas) => {
        console.log(datas.password, datas.username)
        if (password.value && username.value) {
            if (datas.username === username.value && datas.password === password.value) {

                localStorage.setItem('userID', datas.id)
                Toastify({
                    text: "User Logged in",
                    duration: 700,
                }).showToast();
                location.replace("http://127.0.0.1:5501/fireBase/signup-login-V2/addProducts.html")
            }

        }
    })
}


adminPage ? adminPage.addEventListener('load', onAdminPageLoad()) : false
loginBtn ? loginBtn.addEventListener('click', authenticateUser) : false
checkOutPage ? checkOutPage.addEventListener('load', checkOutDisplay()) : false
cartPage ? cartPage.addEventListener('load', viewCart()) : false
productsPage ? productsPage.addEventListener('load', getAllData()) : false
signOut ? signOut.addEventListener('click', () => {
    Toastify({
        text: "Signing Out",
        duration: 500,
    }).showToast();
    location.replace("http://127.0.0.1:5501/fireBase/signup-login-V2/products.html")
    localStorage.clear()
}) : false
