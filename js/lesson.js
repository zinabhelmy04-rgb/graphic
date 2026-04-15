let currentLesson = null;
let currentSlideIndex = 0;
let lessonCompleted = false;

document.addEventListener('DOMContentLoaded', () => {
    requireAuth();
    
    const greetingEl = document.getElementById('user-greeting');
    if (greetingEl) greetingEl.textContent = 'مرحباً، متعلم';
    
    // الحصول على معرف الدرس من URL
    const urlParams = new URLSearchParams(window.location.search);
    const lessonId = urlParams.get('id');
    
    if (!lessonId) {
        window.location.href = 'lessons.html';
        return;
    }
    
    currentLesson = getLessonById(lessonId);
    if (!currentLesson) {
        window.location.href = 'lessons.html';
        return;
    }
    
    // التحقق مما إذا كان الدرس مكتملاً مسبقاً
    lessonCompleted = ProgressManager.isLessonCompleted(lessonId);
    
    // إعداد واجهة الدرس
    document.getElementById('lesson-title').textContent = currentLesson.title;
    // document.getElementById('lesson-duration').textContent = ` ${currentLesson.duration} دقائق`;
    // document.getElementById('lesson-slides-count').textContent = `📋 ${currentLesson.slides.length} شرائح`;
    
    // بناء قائمة الشرائح
    const slidesList = document.getElementById('slides-list');
    currentLesson.slides.forEach((slide, index) => {
        const li = document.createElement('li');
        li.textContent = slide.title;
        li.dataset.index = index;
        li.addEventListener('click', () => goToSlide(index));
        slidesList.appendChild(li);
    });
    
    // تحميل الشريحة الحالية (قد تكون محفوظة في التقدم)
    const progress = ProgressManager.getData();
    if (progress.currentLessonId === lessonId && progress.currentSlideIndex !== undefined) {
        currentSlideIndex = Math.min(progress.currentSlideIndex, currentLesson.slides.length - 1);
    }
    
    renderSlide(currentSlideIndex);
    updateNavigation();
    
    // تسجيل الدرس الحالي
    ProgressManager.setCurrentLesson(lessonId);
    
    // مستمعو الأحداث
    document.getElementById('btn-prev').addEventListener('click', prevSlide);
    document.getElementById('btn-next').addEventListener('click', nextSlide);
    document.getElementById('btn-complete').addEventListener('click', completeLesson);
});

function renderSlide(index) {
    const slide = currentLesson.slides[index];
    const container = document.getElementById('slide-container');
    
    container.innerHTML = `
        <div class="slide-wrapper">
            <h2 class="slide-title">${slide.title}</h2>
            <div class="slide-body">
                <p>${slide.content}</p>
                ${slide.image ? `<img src="${slide.image}" alt="${slide.imageAlt || ''}" class="slide-image">` : ''}
            </div>
        </div>
    `;
    
    // تحديث شريط التقدم
    const progressPercent = ((index + 1) / currentLesson.slides.length) * 100;
    document.getElementById('slide-progress-bar').style.width = `${progressPercent}%`;
    document.getElementById('lesson-progress-text').textContent = `الشريحة ${index + 1} من ${currentLesson.slides.length}`;
    
    // تحديث نشاط قائمة الشرائح
    const slidesItems = document.querySelectorAll('.slides-list li');
    slidesItems.forEach((item, i) => {
        if (i === index) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
        
        // تعليم الشرائح التي تمت زيارتها (للإشارة فقط)
        if (i <= index) {
            item.classList.add('visited');
        }
    });
    
    // حفظ موضع الشريحة الحالية
    const progress = ProgressManager.getData();
    progress.currentSlideIndex = index;
    ProgressManager.saveData(progress);
}

function goToSlide(index) {
    if (index >= 0 && index < currentLesson.slides.length) {
        currentSlideIndex = index;
        renderSlide(currentSlideIndex);
        updateNavigation();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function nextSlide() {
    if (currentSlideIndex < currentLesson.slides.length - 1) {
        currentSlideIndex++;
        renderSlide(currentSlideIndex);
        updateNavigation();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function prevSlide() {
    if (currentSlideIndex > 0) {
        currentSlideIndex--;
        renderSlide(currentSlideIndex);
        updateNavigation();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function updateNavigation() {
    const prevBtn = document.getElementById('btn-prev');
    const nextBtn = document.getElementById('btn-next');
    const completeBtn = document.getElementById('btn-complete');
    
    prevBtn.disabled = (currentSlideIndex === 0);
    
    const isLastSlide = (currentSlideIndex === currentLesson.slides.length - 1);
    
    if (isLastSlide) {
        nextBtn.style.display = 'none';
        completeBtn.style.display = 'block';
        
        // إذا كان الدرس مكتملاً مسبقاً، غير نص الزر
        if (lessonCompleted) {
            completeBtn.textContent = 'تم الإتمام ✓';
            completeBtn.disabled = true;
        } else {
            completeBtn.textContent = 'إتمام الدرس';
            completeBtn.disabled = false;
        }
    } else {
        nextBtn.style.display = 'block';
        completeBtn.style.display = 'none';
    }
}

function completeLesson() {
    if (!lessonCompleted) {
        ProgressManager.completeLesson(currentLesson.id, currentLesson.duration);
        lessonCompleted = true;
    }
    
    // إظهار تراكب التهنئة
    const overlay = document.getElementById('completion-overlay');
    overlay.classList.add('active');
    
    // إعداد رابط الدرس التالي
    const nextLesson = getNextLesson(currentLesson.id);
    const nextBtn = document.getElementById('next-lesson-btn');
    if (nextLesson) {
        nextBtn.href = `lesson.html?id=${nextLesson.id}`;
    } else {
        nextBtn.href = 'lessons.html';
        nextBtn.textContent = 'تصفح الدروس';
    }
    
    // تحديث الزر
    document.getElementById('btn-complete').textContent = 'تم الإتمام ✓';
    document.getElementById('btn-complete').disabled = true;
    
    // إخفاء التراكب بعد 5 ثوانٍ تلقائياً
    setTimeout(() => {
        overlay.classList.remove('active');
    }, 5000);
}

// إغلاق التراكب عند النقر خارجه
document.addEventListener('click', (e) => {
    const overlay = document.getElementById('completion-overlay');
    if (e.target === overlay) {
        overlay.classList.remove('active');
    }
});