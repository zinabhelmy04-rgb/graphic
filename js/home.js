document.addEventListener('DOMContentLoaded', () => {
    // التحقق من المصادقة
    requireAuth();
    
    // عرض اسم المستخدم (جزء من البريد)
    const greetingEl = document.getElementById('user-greeting');
    if (greetingEl) {
        greetingEl.textContent = 'مرحباً، متعلم';
    }
    
    // تحميل ملخص التقدم
    const progress = ProgressManager.getData();
    const completedCount = progress.completedLessons.length;
    const totalLessons = lessonsData.length;
    const overallProgress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
    
    // عرض ملخص التقدم إذا كان هناك تقدم
    const progressSummary = document.getElementById('progress-summary');
    const progressPct = document.getElementById('hero-progress-pct');
    const continueBtn = document.getElementById('continue-btn');
    const startBtn = document.getElementById('start-btn');
    
    if (completedCount > 0) {
        progressSummary.style.display = 'block';
        progressPct.textContent = `${overallProgress}%`;
        
        // تحديد الدرس التالي
        const nextLessonId = ProgressManager.getNextLessonId();
        if (nextLessonId) {
            continueBtn.href = `lesson.html?id=${nextLessonId}`;
        } else {
            continueBtn.textContent = 'لقد أكملت جميع الدروس!';
            continueBtn.classList.add('btn-outline');
        }
        
        startBtn.textContent = 'استكشف الدروس';
    }
    
    // بناء بطاقات الوحدات
    const modulesContainer = document.getElementById('modules-container');
    if (modulesContainer) {
        modulesData.forEach(module => {
            const moduleLessons = lessonsData.filter(l => l.moduleId === module.id);
            const completedInModule = moduleLessons.filter(l => progress.completedLessons.includes(l.id)).length;
            const moduleProgress = moduleLessons.length > 0 ? Math.round((completedInModule / moduleLessons.length) * 100) : 0;
            
            const card = document.createElement('div');
            card.className = 'module-card';
            card.innerHTML = `
                <div class="module-header">
                    <h3 class="module-title">${module.title}</h3>
                    <span class="module-lesson-count">${moduleLessons.length} دروس</span>
                </div>
                <p class="module-description">${module.description}</p>
                <div class="module-progress">
                    <div class="progress-container">
                        <div class="progress-bar" style="width: ${moduleProgress}%"></div>
                    </div>
                    <span class="progress-text">${completedInModule}/${moduleLessons.length} مكتمل</span>
                </div>
                <div class="module-footer">
                    <a href="lessons.html?module=${module.id}" class="btn btn-outline btn-small">تصفح الوحدة</a>
                </div>
            `;
            modulesContainer.appendChild(card);
        });
    }
});