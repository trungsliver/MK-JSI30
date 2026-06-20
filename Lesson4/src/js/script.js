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
    // Chuyển sang form đăng ký
    showSection(registerSection);
});

document.getElementById("show-login-btn").addEventListener("click", () => {
    // Chuyển sang form đăng nhập
    showSection(loginSection);
});

// =================== REGISTER =====================
document.getElementById("register-btn").addEventListener("click", registerUser);


async function registerUser() {
    // Lấy dữ liệu người dùng nhập ở form đăng ký
    const username = document.getElementById("register-username").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const phone = document.getElementById("register-phone").value.trim();
    const dob = document.getElementById("register-dob").value;
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById("register-confirm-password").value;
    const agree = document.getElementById("agree").checked;
    const message = document.getElementById("register-message");

    // Xóa thông báo cũ trước khi kiểm tra dữ liệu mới
    message.innerText = "";

    // Validation - kiểm tra các trường hợp lỗi
    if (username.length < 3) {
        // Username phải đủ độ dài tối thiểu
        message.innerText = "Username must be at least 3 characters";
        return;
    }

    if (!isValidEmail(email)) {
        // Kiểm tra định dạng email
        message.innerText = "Invalid email";
        return;
    }

    if (!isValidPhone(phone)) {
        // Kiểm tra số điện thoại Việt Nam
        message.innerText = "Invalid Vietnamese phone number";
        return;
    }

    if (calculateAge(dob) < 13) {
        // Chỉ cho phép người dùng từ 13 tuổi trở lên
        message.innerText = "You must be at least 13 years old";
        return;
    }

    if (!isValidPassword(password)) {
        // Mật khẩu phải có chữ hoa, chữ thường và số
        message.innerText = "Password must contain uppercase, lowercase and number";
        return;
    }

    if (password !== confirmPassword) {
        // Xác nhận mật khẩu phải khớp
        message.innerText = "Passwords do not match";
        return;
    }

    if (!agree) {
        // Người dùng phải đồng ý điều khoản
        message.innerText = "Please agree to Terms";
        return;
    }

    // Đăng ký Firebase Auth và lưu thêm thông tin hồ sơ vào Firestore
    try {
        // Kiểm tra username đã tồn tại trong collection users chưa
        const usernameQuery = query(
            collection(db, "users"),
            where("username", "==", username)
        );

        const usernameResult = await getDocs(usernameQuery);

        if (!usernameResult.empty) {
            // Nếu username bị trùng thì dừng đăng ký
            message.innerText = "Username already exists";
            return;
        }

        // Tạo tài khoản đăng ký bằng email và password
        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

        // Lấy UID do Firebase tạo để lưu dữ liệu người dùng
        const uid = userCredential.user.uid;

        // Lưu thông tin profile vào Firestore theo UID
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

        // Báo đăng ký thành công
        message.innerText =
            "Register successful";

        // Chuyển về form login sau khi đăng ký xong
        setTimeout(() => {
            showSection(loginSection);
        }, 1500);

    }
    catch (error) {
        message.innerText =
            error.message;
    }
}

// =================== LOGIN =====================
document.getElementById("login-btn").addEventListener("click", loginUser);


async function loginUser() {
    // Lấy dữ liệu người dùng nhập ở form đăng nhập
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    const message = document.getElementById("login-message");

    // Xóa thông báo cũ trước khi đăng nhập
    message.innerText = "";

    try {
        // Xác thực tài khoản bằng Firebase Auth
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        // Lấy UID của tài khoản vừa đăng nhập
        const uid = userCredential.user.uid;

        // Lấy dữ liệu hồ sơ người dùng từ Firestore
        const userDoc = await getDoc(doc(db, "users", uid));
        const userData = userDoc.data();

        // Tạo object người dùng hiện tại để lưu tạm vào localStorage
        const currentUser = {
            uid,
            ...userData,
            last_login:
                new Date().toLocaleString()
        };

        // Lưu phiên đăng nhập vào localStorage
        localStorage.setItem(
            "current_user",
            JSON.stringify(currentUser)
        );

        // Nạp dữ liệu lên trang profile và chuyển sang section profile
        loadProfile();
        showSection(profileSection);

    }
    catch (error) {
        // Hiển thị lỗi khi email hoặc mật khẩu sai
        message.innerText =
            "Email or password incorrect";
    }
}

// =================== PROFILE =====================
function loadProfile() {
    // Lấy thông tin người dùng từ localStorage
    const currentUser = JSON.parse(localStorage.getItem("current_user"));

    if (!currentUser) return;

    // Hiển thị thông tin người dùng trên trang profile
    document.getElementById("profile-username").innerText = currentUser.username;
    document.getElementById("profile-email").innerText = currentUser.email;
    document.getElementById("profile-phone").innerText = currentUser.phone;
    document.getElementById("profile-dob").innerText = currentUser.dob;
    document.getElementById("profile-last-login").innerText = currentUser.last_login;
}

// =================== LOGOUT =====================
document.getElementById("logout-btn").addEventListener("click", logoutUser);

async function logoutUser() {
    // Đăng xuất với Firebase Auth
    await signOut(auth);
    // Xóa thông tin người dùng khỏi localStorage
    localStorage.removeItem("current_user");
    // Chuyển về trang login
    showSection(loginSection);
}

// START APP
function init() {
    // Kiểm tra thông tin đăng nhập trong localStorage để quyết định hiển thị trang nào
    const currentUser = localStorage.getItem("current_user");

    if (currentUser) {
        loadProfile();
        showSection(profileSection);
    }
    else {
        showSection(loginSection);
    }
}

init();