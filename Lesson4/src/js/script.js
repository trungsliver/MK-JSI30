import { firebaseConfig } from "./firebase-config.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    collection,
    getDocs,
    query,
    where
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Khởi tạo firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo các dịch vụ của Firebase (Auth và firestore)
const auth = getAuth(app);
const db = getFirestore(app);

// test app
console.log(app.name); // "[DEFAULT]"

// Dùng DOM lấy các section
const loginSection = document.getElementById("login-section");
const registerSection = document.getElementById("register-section");
const profileSection = document.getElementById("profile-section");

// Hiển thị section
function showSection(section) {
    loginSection.classList.add("hidden");
    registerSection.classList.add("hidden");
    profileSection.classList.add("hidden");

    section.classList.remove("hidden");
}

// Validation - kiểm tra
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^(03|05|07|08|09)\d{8}$/.test(phone);
}

function isValidPassword(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password);
}


function calculateAge(dob) {

    const birthDate = new Date(dob);

    const today = new Date();

    let age =
        today.getFullYear() -
        birthDate.getFullYear();

    const m =
        today.getMonth() -
        birthDate.getMonth();

    if (
        m < 0 ||
        (m === 0 &&
            today.getDate() < birthDate.getDate())
    ) {
        age--;
    }

    return age;
}

// Sự kiện click vào nút chuyển trang
document.getElementById("show-register-btn").addEventListener("click", () => {
        showSection(registerSection);
});

document.getElementById("show-login-btn").addEventListener("click", () => {
        showSection(loginSection);
});

// REGISTER
document.getElementById("register-btn").addEventListener("click", registerUser);


async function registerUser() {
    // Lấy thông tin trên form
    const username = document.getElementById("register-username").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const phone = document.getElementById("register-phone").value.trim();
    const dob = document.getElementById("register-dob").value;
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById("register-confirm-password").value;
    const agree = document.getElementById("agree").checked;
    const message = document.getElementById("register-message");

    message.innerText = "";

    // Validation - kiểm tra các trường hợp lỗi
    if (username.length < 3) {
        message.innerText = "Username must be at least 3 characters";
        return;
    }

    if (!isValidEmail(email)) {
        message.innerText = "Invalid email";
        return;
    }

    if (!isValidPhone(phone)) {
        message.innerText = "Invalid Vietnamese phone number";
        return;
    }

    if (calculateAge(dob) < 13) {
        message.innerText = "You must be at least 13 years old";
        return;
    }

    if (!isValidPassword(password)) {
        message.innerText = "Password must contain uppercase, lowercase and number";
        return;
    }

    if (password !== confirmPassword) {
        message.innerText = "Passwords do not match";
        return;
    }

    if (!agree) {
        message.innerText = "Please agree to Terms";
        return;
    }

    // Đăng ký với Firebase Auth và lưu thông tin người dùng vào Firestore
    try {
        const usernameQuery = query(
            collection(db, "users"),
            where("username", "==", username)
        );

        const usernameResult = await getDocs(usernameQuery);

        if (!usernameResult.empty) {
            message.innerText = "Username already exists";
            return;
        }

        // Tạo user với email và password (Firebase Auth)
        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

        const uid = userCredential.user.uid;

        await setDoc(
            doc(db, "users", uid),
            {
                username,
                email,
                phone,
                dob,
                created_at:
                    new Date().toISOString()
            }
        );

        message.innerText =
            "Register successful";

        setTimeout(() => {
            showSection(loginSection);
        }, 1500);

    }
    catch (error) {
        message.innerText =
            error.message;
    }
}