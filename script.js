document.addEventListener('DOMContentLoaded', function() {

    // =================================================================
    // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ 옵션 및 가격 설정 (여기서 수정) ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
    // =================================================================

    // 기본 단가 설정 (예: 100장당 가격)
    const BASE_PRICE_PER_100_SHEETS = 5000; // 예: 5,000원

    // 후가공 옵션 및 가격
    const postProcessingOptions = {
        'guido': { name: '귀도리 [네귀도리/6mm]', price: 2200 }
        // 다른 후가공 옵션이 있다면 여기에 추가
        // 'gold_leaf': { name: '금박', price: 10000 }
    };

    const optionsData = {
        productName: [
            { value: 'card_business', text: '카드명함' },
            { value: 'standard_business', text: '일반명함' },
            { value: 'premium_business', text: '고급명함' }
        ],
        paperType: [
            // priceMultiplier: 기본 가격에 대한 배율. 1.0은 기본, 1.2는 20% 할증
            { value: 'white_pet_230', text: '화이트카드 PET 흰색 230g', priceMultiplier: 1.0 },
            { value: 'gold_pet_250', text: '골드카드 PET 250g', priceMultiplier: 1.2 },
            { value: 'silver_pet_250', text: '실버카드 PET 250g', priceMultiplier: 1.2 }
        ],
        printMethod: [
            { value: 'double_sided_color', text: '양면컬러8도' },
            { value: 'single_sided_color', text: '단면컬러4도' }
        ],
        sizePreset: [
            { value: '86_54', text: '규격사이즈' },
            { value: '90_50', text: '다른 규격' }
        ],
        sizeUnit: [ { value: 'mm', text: 'mm' } ],
        quantity: [
            // value는 실제 장 수를 의미
            { value: '200', text: '200 장' },
            { value: '400', text: '400 장' },
            { value: '600', text: '600 장' },
            { value: '1000', text: '1,000 장' }
        ]
    };

    // =================================================================
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ 옵션 및 가격 설정 (여기까지 수정) ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
    // =================================================================


    // --- 기능 구현 부분 (수정 필요 없음) ---

    // 드롭다운 메뉴를 채우는 함수
    function populateDropdown(selectId, options) {
        const selectElement = document.getElementById(selectId);
        if (!selectElement) return;
        selectElement.innerHTML = '';
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            selectElement.appendChild(optionElement);
        });
    }

    // 주문 내역 및 가격을 계산하고 화면에 업데이트하는 함수
    function updateOrderDetails() {
        // 1. 현재 선택된 값 가져오기
        const productNameSelect = document.getElementById('product-name');
        const paperTypeSelect = document.getElementById('paper-type');
        const printMethodSelect = document.getElementById('print-method');
        const quantitySelect = document.getElementById('quantity');
        const caseInput = document.querySelector('.quantity-case');

        const selectedProductName = productNameSelect.options[productNameSelect.selectedIndex].text;
        const selectedPaperValue = paperTypeSelect.value;
        const selectedPrintMethod = printMethodSelect.options[printMethodSelect.selectedIndex].text;
        const selectedQuantity = parseInt(quantitySelect.value, 10);
        const selectedCases = parseInt(caseInput.value, 10);
        
        // 2. 가격 계산
        // 선택된 종이의 가격 배율 찾기
        const paperOption = optionsData.paperType.find(p => p.value === selectedPaperValue);
        const paperMultiplier = paperOption ? paperOption.priceMultiplier : 1.0;
        
        // 수량과 종이에 따른 기본 상품 가격 계산
        const productPrice = (selectedQuantity / 100) * BASE_PRICE_PER_100_SHEETS * paperMultiplier;

        // 후가공 가격 (현재는 '귀도리' 하나만 있다고 가정)
        const postProcessingPrice = postProcessingOptions.guido.price;
        
        // 공급가 (총 상품 가격 + 후가공 가격) * 건수
        const supplyPrice = (productPrice + postProcessingPrice) * selectedCases;

        // 부가세 및 최종 결제 금액 계산
        const vat = supplyPrice * 0.1;
        const totalPrice = supplyPrice + vat;

        // 3. 화면에 업데이트
        // 가격 업데이트
        document.querySelector('.original-price').innerHTML = `${totalPrice.toLocaleString()}원 <small>부가세 10% 포함</small>`;
        document.querySelector('.total-price').innerHTML = `${totalPrice.toLocaleString()} <small>원</small>`;
        document.querySelector('.price-breakdown').textContent = `공급가 : ${supplyPrice.toLocaleString()}원 + 부가세 : ${vat.toLocaleString()}원`;

        // 주문내역 업데이트
        const sizeText = document.querySelector('.size-display').textContent;
        const orderSummaryText = `${selectedProductName}, ${selectedPrintMethod}, 86*54(${sizeText}), ${selectedQuantity}장 * ${selectedCases}건\n${postProcessingOptions.guido.name}`;
        document.getElementById('order-summary-text').innerText = orderSummaryText;
    }


    // --- 초기화 및 이벤트 리스너 설정 ---

    // 각 드롭다운에 옵션 데이터 적용
    populateDropdown('product-name', optionsData.productName);
    populateDropdown('paper-type', optionsData.paperType);
    populateDropdown('print-method', optionsData.printMethod);
    populateDropdown('size-preset', optionsData.sizePreset);
    populateDropdown('size-unit', optionsData.sizeUnit);
    populateDropdown('quantity', optionsData.quantity);
    
    // 기본값 설정 (페이지 로드 시)
    document.getElementById('quantity').value = '400';

    // 썸네일 클릭 이벤트
    const thumbnails = document.querySelectorAll('.thumb-item');
    const mainImage = document.getElementById('main-product-image');
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            mainImage.src = this.querySelector('img').src;
        });
    });

    // 가격에 영향을 주는 모든 요소에 이벤트 리스너 추가
    const triggerElements = document.querySelectorAll('#product-name, #paper-type, #print-method, #quantity, .quantity-case');
    triggerElements.forEach(element => {
        element.addEventListener('change', updateOrderDetails);
    });

    // 페이지 로드 시 초기 가격 및 주문내역 계산
    updateOrderDetails();
});
