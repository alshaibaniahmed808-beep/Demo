// أوقات افتراضية لعرضها للعميل
const availableTimes = [
    "10:00 صباحاً", "10:30 صباحاً", "11:00 صباحاً", 
    "04:00 مساءً", "04:30 مساءً", "05:00 مساءً",
    "06:30 مساءً", "07:00 مساءً"
];

const timeGrid = document.getElementById('time-grid');
const modal = document.getElementById('booking-modal');
const selectedTimeText = document.getElementById('selected-time');
let timeChosen = "";

// 1. توليد الأزرار بناءً على الأوقات المتاحة
availableTimes.forEach(time => {
    const button = document.createElement('button');
    button.className = 'time-btn';
    button.textContent = time;
    
    // عند الضغط على أي وقت
    button.onclick = () => {
        timeChosen = time;
        selectedTimeText.textContent = timeChosen;
        modal.classList.remove('hidden'); // إظهار نافذة الحجز
    };
    
    timeGrid.appendChild(button);
});

// 2. دالة لإغلاق النافذة
function closeModal() {
    modal.classList.add('hidden');
}

// 3. محاكاة عملية إرسال البيانات (وهمية للنسخة التجريبية)
document.getElementById('booking-form').addEventListener('submit', function(e) {
    e.preventDefault(); // منع إعادة تحميل الصفحة
    
    const patientName = document.getElementById('patient-name').value;
    
    // إظهار رسالة نجاح للعميل (الطبيب) لتبهره
    alert(` ممتاز! 🎉\n\nتم حجز موعد جديد باسم: ${patientName}\nالوقت: ${timeChosen}\n\n(في النسخة الحقيقية، ستصلك رسالة واتساب فورية بهذا الحجز وسيختفي هذا الوقت من القائمة).`);
    
    // إغلاق النافذة وتفريغ الحقول
    closeModal();
    this.reset(); 
});
