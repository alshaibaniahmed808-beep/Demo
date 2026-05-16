// بيانات افتراضية للبدء في المحاكاة
let queue = [
    { number: 1, name: "أحمد المصراتي", phone: "091xxxxxxx", status: "active" },
    { number: 2, name: "سالم الفيتوري", phone: "092xxxxxxx", status: "waiting" },
    { number: 3, name: "فاطمة الورفلي", phone: "091xxxxxxx", status: "waiting" },
    { number: 4, name: "مريم صبحي", phone: "094xxxxxxx", status: "waiting" }
];

let currentTurnIndex = 0; // يشير للمريض الحالي في المصفوفة

// استدعاء العناصر من الواجهة
const liveCurrentTurn = document.getElementById('live-current-turn');
const liveTotalQueue = document.getElementById('live-total-queue');
const adminQueueList = document.getElementById('admin-queue-list');
const nextBtn = document.getElementById('next-btn');
const bookingForm = document.getElementById('patient-booking-form');

// تحديث وعرض القائمة والبيانات حياً
function updateUI() {
    // 1. تحديث الكروت العلوية في جهة المريض
    const activePatient = queue.find(p => p.status === 'active');
    liveCurrentTurn.textContent = activePatient ? activePatient.number : queue[queue.length - 1].number;
    liveTotalQueue.textContent = queue.length;

    // 2. تحديث قائمة العيادة
    adminQueueList.innerHTML = '';
    queue.forEach(patient => {
        const li = document.createElement('li');
        li.className = `queue-item ${patient.status}`;
        
        let statusText = "ينتظر";
        if(patient.status === 'active') statusText = "داخل الكشف حالياً";
        if(patient.status === 'done') statusText = "تم الشطب";

        li.innerHTML = `
            <div>
                <strong>#${patient.number} - ${patient.name}</strong>
                <p style="font-size:11px; color:#666;">${patient.phone}</p>
            </div>
            <span class="badge-status">${statusText}</span>
        `;
        adminQueueList.appendChild(li);
    });
}

// معالجة حجز مريض جديد
bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const nameInput = document.getElementById('p-name');
    const phoneInput = document.getElementById('p-phone');
    
    const nextNumber = queue.length + 1;
    
    // إضافة مريض جديد للمصفوفة
    queue.push({
        number: nextNumber,
        name: nameInput.value,
        phone: phoneInput.value,
        status: "waiting"
    });

    // إظهار بطاقة الموعد للمريض
    const ticketBox = document.getElementById('my-ticket');
    const ticketNum = document.getElementById('ticket-number');
    ticketBox.style.display = "block";
    ticketBox.className = "ticket-hidden";
    ticketNum.textContent = nextNumber;

    // إعادة تصفير الحقول وتحديث الشاشة
    nameInput.value = '';
    phoneInput.value = '';
    updateUI();
});

// معالجة زر الشطب واستدعاء المريض التالي
nextBtn.addEventListener('click', function() {
    if (currentTurnIndex < queue.length) {
        // شطب المريض الحالي
        queue[currentTurnIndex].status = 'done';
        
        // الانتقال للمريض التالي إذا وجد
        if (currentTurnIndex + 1 < queue.length) {
            currentTurnIndex++;
            queue[currentTurnIndex].status = 'active';
            
            // فحص الشرط: هل هناك مريض متبقي أمامه 5 مرضى بالضبط؟
            checkSmartNotification();
        } else {
            alert("🎉 انتهت جميع الحجوزات المسجلة لليوم!");
        }
        
        updateUI();
    }
});

// الدالة الذكية لفحص الإشعارات (عند بقاء 5 مرضى)
function checkSmartNotification() {
    const currentActiveNumber = queue[currentTurnIndex].number;
    
    // نبحث في المصفوفة عن مريض رقمه يساوي (الرقم الحالي + 5)
    // هذا يعني أن أمامه بالضبط 5 مرضى (بما فيهم المريض الذي داخل الكشف حالياً)
    const targetPatient = queue.find(p => p.number === currentActiveNumber + 5);
    
    if (targetPatient) {
        showSMSNotification(targetPatient.name, targetPatient.number);
    }
}

// إظهار توست الإشعار التلقائي كدليل احترافي للعميل
function showSMSNotification(name, number) {
    const toast = document.getElementById('sms-notification');
    const msg = document.getElementById('notification-msg');
    
    msg.innerHTML = `رسالة تلقائية انطلقت لهاتف المريض <strong>(${name})</strong> حامل الرقم <strong>(${number})</strong> لأن أمامه 5 حالات فقط!`;
    
    toast.classList.remove('hidden');
    
    // إخفاء الإشعار بعد 7 ثوانٍ
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 7000);
}

// تشغيل الواجهة لأول مرة عند تحميل الصفحة
updateUI();
