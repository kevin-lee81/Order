document.addEventListener('DOMContentLoaded', function() {

    // =================================================================
    // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ 드롭다운 옵션 설정 (여기서 수정) ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
    // =================================================================

    const optionsData = {
        // 상품명 옵션
        productName: [
            { value: 'card_business', text: '카드명함' },
            { value: 'standard_business', text: '일반명함' },
            { value: 'premium_business', text: '고급명함' }
        ],
        // 종이 옵션
        paperType: [
            { value: 'pet_white', text: 'PET-화이트' },
            { value: 'pet_gold', text: 'PET-골드' },
            { value: 'pet_silver', text: 'PET-실버' },
            { value: 'pet_hologram', text: 'PET-홀로그램' },
        ],
        // 인쇄도수 옵션
        printMethod: [
            { value: 'double_sided_color', text: '양면컬러8도' },
            { value: 'single_sided_color', text: '단면컬러4도' }
        ],
        // 사이즈 프리셋 옵션
        sizePreset: [
            { value: '86_54', text: '규격사이즈' },
            { value: '90_50', text: '다른 규격' }
        ],
        // 사이즈 단위 옵션
        sizeUnit: [
            { value: 'mm', text: 'mm' },
            { value: 'cm', text: 'cm' },
            { value: 'inch', text: 'inch' }
        ],
        // 수량 옵션
        quantity: [
            { value: '200', text: '200 장' },
            { value: '400', text: '400 장' },
            { value: '600', text: '600 장' }
        ]
    };

    // =================================================================
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ 드롭다운 옵션 설정 (여기까지 수정) ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
    // =================================================================


    // 드롭다운 메뉴를 채우는 함수
    function populateDropdown(selectId, options) {
        const selectElement = document.getElementById(selectId);
        if (!selectElement) return;

        // 기존 옵션 삭제
        selectElement.innerHTML = '';

        // 새로운 옵션 추가
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            selectElement.appendChild(optionElement);
        });
    }

    // 각 드롭다운에 옵션 데이터 적용
    populateDropdown('product-name', optionsData.productName);
    populateDropdown('paper-type', optionsData.paperType);
    populateDropdown('print-method', optionsData.printMethod);
    populateDropdown('size-preset', optionsData.sizePreset);
    populateDropdown('size-unit', optionsData.sizeUnit);
    populateDropdown('quantity', optionsData.quantity);


    // 썸네일 클릭 이벤트
    const thumbnails = document.querySelectorAll('.thumb-item');
    const mainImage = document.getElementById('main-product-image');

    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // 모든 썸네일에서 'active' 클래스 제거
            thumbnails.forEach(t => t.classList.remove('active'));
            
            // 클릭된 썸네일에 'active' 클래스 추가
            this.classList.add('active');
            
            // 메인 이미지 변경
            const newImageSrc = this.querySelector('img').src;
            mainImage.src = newImageSrc;
        });
    });

    // 수량 슬라이더와 숫자 입력 필드 연동
    const quantitySlider = document.querySelector('.quantity-slider .slider');
    const quantitySelect = document.getElementById('quantity');

    if (quantitySlider && quantitySelect) {
        quantitySlider.addEventListener('input', function() {
            // 슬라이더 값에 가장 가까운 옵션을 선택
            const sliderValue = parseInt(this.value, 10);
            let closestOption = null;
            let minDiff = Infinity;

            Array.from(quantitySelect.options).forEach(option => {
                const optionValue = parseInt(option.value, 10);
                const diff = Math.abs(sliderValue - optionValue);
                if (diff < minDiff) {
                    minDiff = diff;
                    closestOption = option;
                }
            });

            if (closestOption) {
                quantitySelect.value = closestOption.value;
            }
        });
    }

});
