// Khởi tạo app
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js'
// firebase-config,js chứa thông tin firebase
import { firebaseConfig } from "./firebase-config.js";
// Firebase Authentication (dùng cho đăng ký đăng nhập)
import { getAuth } from 'https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js'
// Firebase Firestore (dùng để lưu trữ dữ liệu)
import { getFirestore } from 'https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js'
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	onSnapshot,
	orderBy,
	query,
	serverTimestamp
} from 'https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js';

// Initialize App
const app = initializeApp(firebaseConfig);

// test app
console.log(app.name); // "[DEFAULT]"

// Dùng DOM để lấy các thẻ HTML
const form = document.getElementById('note-form');
const input = document.getElementById("note-input");
const notesList = document.getElementById("notes-list");
const emptyState = document.getElementById("empty-state");

// Khởi tạo Firestore
const db = getFirestore(app);

// Tham chiếu đến collection "notes_demo" trong Firestore
const notesRef = collection(db, "notes_demo");
// Tạo query để lấy dữ liệu sắp xếp theo createdAt giảm dần
const notesQuery = query(notesRef, orderBy("createdAt", "desc"));

// Sự kiện khi ấn nút 'Thêm"
form.addEventListener("submit", async (e) => {
    // Ngăn chặn việc tự reaload
    e.preventDefault();
    // Lấy nội dung trong ô input
    const text = input.value.trim();
    // nếu input không có nội dung, không xử lý
    if (!text) return;
    // Xử lý thêm note vào Firestore
    try {
        // thêm phần tử mới (document) vào danh sách (collection)
        await addDoc(notesRef, {
            text: text,
            createdAt: serverTimestamp() 
        });
        form.reset();
		input.focus();
    } catch (error) {
        console.error("Khong the them ghi chu:", error);
		alert("Them ghi chu that bai.");
    }
});