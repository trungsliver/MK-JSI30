// Bài 1: Hiển thị dữu liệu từ file js
    // Khai báo danh sách dữ liệu
const students = [
    {id: 1, name: 'Đức Minh'},
    {id: 2, name: 'Minh Ngọc'},
    {id: 3, name: 'Tiến Dũng'},
    {id: 4, name: 'Ngọc Huy'},
    {id: 5, name: 'Minh Tú'},
    {id: 6, name: 'Minh Quân'},
    {id: 7, name: 'Quang Minh'},
]

    // Hàm hiển thị dữ liệu
function displayStudents() {
    // DÙng DOM để lấy container (thẻ ul chứa học sinh)
    const container = document.getElementById('studentList');
    // Duyệt danh sách students
    students.forEach(student => {
        // Tạo thẻ li cho mỗi học sinh
        const li = document.createElement('li');
        // Gán thông tin học inh vào thẻ li
        li.textContent = `ID: ${student.id}, Tên: ${student.name}`;
        // Thêm thẻ li vào container
        container.appendChild(li);
    })
}
    // Gọi hàm hiển thị
displayStudents();