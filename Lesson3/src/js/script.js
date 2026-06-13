// Khởi tạo app
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js'
// firebase-config,js chứa thông tin firebase
import { firebaseConfig } from "./firebase-config.js";
// Firebase Authentication (dùng cho đăng ký đăng nhập)
import { getAuth } from 'https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js'
// Firebase Firestore (dùng để lưu trữ dữ liệu)
import { getFirestore } from 'https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js'

// Initialize App
const app = initializeApp(firebaseConfig);

console.log(app.name); // "[DEFAULT]"