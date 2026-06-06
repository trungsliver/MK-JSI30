// Bài 1: Dark mode - Light mode
    // Dùng DOM lấy button
const toggleButton = document.getElementById('themeBtn');

    // Xử lý sự kiện ấn nút
toggleButton.onclick = () => {
    // Thêm hoặc xóa class 'dark' cho body
    document.body.classList.toggle('dark');
    // Lưu trạng tháo dark mode vào localStorage
    if (document.body.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
}

// load theme từ localStorage khi reload trang
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
    document.body.classList.add("dark");
}

// Bài 2: Note List
    // Lấy ghi chú trong localStorage hoặc tạo ds rỗng
let notes = JSON.parse(localStorage.getItem("notes")) || [];

    // Hàm hiển thị danh sách ghi chú
function displayNotes() {
    // Lấy container để hiển thị ghi chú
    const container = document.getElementById("noteList");
    // Xóa nội dung cũ
    container.innerHTML = ""; 
    // Duyệt qua mảng ghi chú và tạo phần tử hiển thị
    notes.forEach((note, index) => {
        container.innerHTML += `<li>${note}</li>`;
    });
}
displayNotes();

    // Sự kiện ấn nút (thêm ghi chú)
const addButton = document.getElementById("addNote");
addButton.onclick = () => {
    // Lấy dữ liệu từ input
    let content = document.getElementById("noteInput").value.trim();
    if (content) {
        // Thêm ghi chú vào mảng
        notes.push(content);
        // Lưu danh sách ghi chú vào localStorage
        localStorage.setItem("notes", JSON.stringify(notes));
        // Hiển thị lại danh sách ghi chú
        displayNotes();
        // Xóa nội dung input sau khi thêm
        document.getElementById("noteInput").value = "";
    }
}