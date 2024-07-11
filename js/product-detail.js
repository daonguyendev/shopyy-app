function showAllProductDetail() {
    let id = Number(localStorage.getItem("productId"));
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/api/products/${id}`,
        success: function (data) {
            console.log(data);
            let item = data; // Assign the response data to item
            let content = "";

            content += `
            <div class="container mx-auto my-10 p-2">
                <div class="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div class="flex items-center p-2">
                        <a href="#" class="text-blue-500 hover:text-blue-700">Shopee</a>
                        <span class="mx-2 text-gray-500">&gt;</span>
                        <a href="#" class="text-blue-500 hover:text-blue-700">Thời Trang Nam</a>
                        <span class="mx-2 text-gray-500">&gt;</span>
                        <a href="#" class="text-blue-500 hover:text-blue-700">Áo</a>
                        <span class="mx-2 text-gray-500">&gt;</span>
                        <a href="#" class="text-blue-500 hover:text-blue-700">Áo Thun</a>
                        <span class="mx-2 text-gray-500">&gt;</span>
                        <span class="text-gray-700">${item.name}</span>
                    </div>
                    <div class="grid grid-cols-2 gap-8 p-5">
                        <div class="w-500 h-700">
                            <img src="https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/October2023/QD001.15_46.jpg" alt="${item.name}" class="w-4/5">
                        </div>
                        <div>
                            <h1 class="text-2xl font-bold mb-4">${item.description}</h1>
                            <div class="flex items-center mb-4">
                                <div class="mr-2">
                                   <div class="flex items-center mb-4">
                                        <div class="text-yellow-500 mr-2">
                                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                            </svg>
                                        </div>
                                    <div class="text-gray-500">4.6 (97 đánh giá)</div>
                                </div>
                                </div>
                                <div class="text-gray-500"></div>
                            </div>
                            <div class="bg-red-500 text-white px-4 py-2 mb-4 flex items-center justify-between">
                                <span>FLASH SALE</span>
                                <span class="text-lg font-bold">Giam gia 50%</span>
                            </div>
                            <div class="mb-4">
                                <div class="text-gray-500 mb-2">Chính Sách Trả Hàng</div>
                                <div>Tra hang trong 10 ngay</div>
                            </div>
                            <div class="mb-4">
                                <div class="text-gray-500 mb-2">Điều Khoản</div>
                                <div>Xem Chính Sách Đổi Trả</div>
                            </div>
                            <div class="mb-4">
                                <div class="text-gray-500 mb-2">Vận Chuyển</div>
                                <div class="flex items-center">
                                 <svg class="w-5 h-5 inline-block text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
                                </svg>
                                    <div class="mr-2">Free Ship</div>
                                    <div class="text-blue-500">Xem Vận Chuyển</div>
                                </div>
                            </div>
                            <div class="mb-4">
                                <div class="text-gray-500 mb-2">Màu</div>
                                <div class="flex">
                                    <span class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 mr-2">Đen</span>
                                    <span class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 mr-2">Trắng</span>
                                    <span class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 mr-2">Xanh</span>
                                    <span class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 mr-2">Nâu</span>
                                </div>
                            </div>
                            <div class="mb-4">
                                <div class="text-gray-500 mb-2">Size</div>
                                <div class="flex">
                                    <span class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 mr-2">M</span>
                                    <span class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 mr-2">L</span>
                                    <span class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 mr-2">XL</span>
                                    <span class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 mr-2">2XL</span>
                                </div>
                            </div>
                            <div class="flex items-center mb-4">
                                <button class="bg-gray-200 px-4 py-2 mr-2 rounded-full">-</button>
                                <input type="text" class="w-16 px-2 py-1 text-center border border-gray-300 rounded-md" value="1">
                                <button class="bg-gray-200 px-4 py-2 ml-2 rounded-full mr-2">+</button>
                                <div class="mr-10">${item.quantity}</div>
                                <div class="ml-4 text-lg font-bold">${item.price} đ</div>
                            </div>
                            <div class="flex justify-between">
                                <button class="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600">Thêm Vào Giỏ Hàng</button>
                                <button class="bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600">Mua Ngay</button>
                            </div>
                        </div>                  
                    </div>                  
                </div>
                <div class="container mx-auto my-10 ">
                <div class="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div class="flex flex-col gap-4 p-5">
                        <div class="flex justify-between items-center">
                            <h2 class="text-lg font-bold">CHI TIẾT SẢN PHẨM</h2>
                            <div class="flex items-center gap-2">
                                <span class="text-gray-500">Mã sản phẩm:</span>
                                <span class="font-bold">60811</span>
                            </div>
                        </div>
            
                        <div class="grid grid-cols-2 gap-4">
                            <div class="flex flex-col gap-2">
                                <div class="flex items-center gap-2">
                                    <span class="text-gray-500">Tên sản phẩm:</span>
                                    <span class="font-bold">${item.name}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="text-gray-500">Hãng:</span>
                                    <span>Lavii</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="text-gray-500">Xuất xứ:</span>
                                    <span>Trung Quốc</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="text-gray-500">Chất liệu:</span>
                                    <span>Vải</span>
                                </div>
                            </div>
                            <div class="flex flex-col gap-2">
                                <div class="flex items-center gap-2">
                                    <span class="text-gray-500">Kích thước:</span>
                                    <span>23 x 24 x 15 cm</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="text-gray-500">Khối lượng:</span>
                                    <span>1.3 kg</span>
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-col gap-2">
                            <h3 class="text-lg font-bold">MÔ TẢ SẢN PHẨM</h3>
                            <div class="flex items-center gap-2">
                                <span class="text-gray-500">Chất liệu: </span>
                                <span>Vải</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-gray-500">Đặc điểm: </span>
                                <span>${item.description}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-gray-500">Màu sắc: </span>
                                <span>${item.colors[0].colorName}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-gray-500">Kích thước: </span>
                                <span>${item.sizes[0].sizeName}</span>
                            </div>
                        </div>
                        <div class="flex flex-col gap-2">
                            <h3 class="text-lg font-bold">CHÍNH SÁCH BẢO HÀNH CỦA KHÁCH HÀNG</h3>
                            <div class="flex items-start gap-2">
                                <span class="text-gray-500">Bảo hành:</span>
                                <span>Lỗi do nhà sản xuất, được bảo hành trong vòng 1 năm kể từ ngày mua hàng.</span>
                            </div>
                            <div class="flex items-start gap-2">
                                <span class="text-gray-500">Đổi trả:</span>
                                <span>Tra hang trong 10 ngay</span>
                            </div>
                            <div class="flex items-start gap-2">
                                <span class="text-gray-500">Vận chuyển:</span>
                                <span>Freeship</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            `;

            document.getElementById("productDetail").innerHTML = content;
        },
        error: function (xhr, status, error) {
            console.error("Có lỗi xảy ra: ", error);
        }
    });
}

showAllProductDetail();
function show(id){
    showAllProductDetail(id);
    window.location.href = 'product-detail.html';
}