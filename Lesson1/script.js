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

// Bài 2: Hiển thị dữ liệu từ file JSON
    // Lấy dữ liệu từ file data.json bằng fetch API
fetch('./data.json')
    // Chuyển dổi dữ liệu lấy về (response) thành JSON
    .then(response => response.json())
    // Xử lý dữ liệu JSON đã chuyển đổi
    .then(data => {
        // Dùng DOM lấy container
        const container = document.getElementById('productList');
        // Duyệt dữ liệu trong file data.json
        data.forEach(product => {
            // Tạo thẻ div có class = "product-card" cho mỗi sp
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            // Gán thông tin sản phẩm
            productCard.innerHTML = `
                <img src="${product.image}" alt="">
                <h3>${product.name}</h3>
                <p>Price: $${product.price}</p>
            `
            // Thêm thẻ div vào container
            container.appendChild(productCard);
        })
    })