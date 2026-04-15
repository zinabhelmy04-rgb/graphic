document.addEventListener('DOMContentLoaded', () => {
    requireAuth();
    
    const greetingEl = document.getElementById('user-greeting');
    if (greetingEl) greetingEl.textContent = 'مرحباً، متعلم';
    
    const progress = ProgressManager.getData();
    const overall = ProgressManager.getOverallProgress();
    
    // تحديث التقدم الكلي
    document.getElementById('overall-progress-text').textContent = `${overall.percentage}%`;
    document.getElementById('overall-progress-bar').style.width = `${overall.percentage}%`;
    
    // بناء قائمة الوحدات الجانبية
    const moduleList = document.getElementById('module-list');
    modulesData.forEach(module => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#" data-module-id="${module.id}">${module.title}</a>`;
        moduleList.appendChild(li);
    });
    
    // التعامل مع اختيار الوحدة
    const moduleLinks = document.querySelectorAll('.module-list a');
    const lessonsContent = document.getElementById('lessons-content');
    
    function displayLessons(moduleId = null) {
        let lessonsToShow;
        let title = 'جميع الدروس';
        
        if (moduleId) {
            lessonsToShow = getLessonsByModule(moduleId);
            const module = getModuleById(moduleId);
            title = module ? module.title : 'دروس الوحدة';
            
            // تحديث نشاط الرابط
            moduleLinks.forEach(link => {
                if (link.dataset.moduleId === moduleId) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        } else {
            lessonsToShow = lessonsData.sort((a, b) => a.order - b.order);
            moduleLinks.forEach(link => link.classList.remove('active'));
        }
        
        if (lessonsToShow.length === 0) {
            lessonsContent.innerHTML = '<div class="empty-state">لا توجد دروس في هذه الوحدة</div>';
            return;
        }
        
        let html = `<h2 style="margin-bottom: 1.5rem;">${title}</h2><div class="lesson-cards">`;
        
        lessonsToShow.forEach(lesson => {
            const isCompleted = progress.completedLessons.includes(lesson.id);
            const completedClass = isCompleted ? 'completed' : '';
            const statusIcon = isCompleted ? '' : '';
            
            html += `
                <div class="lesson-card ${completedClass}">
                    <div class="lesson-number">${lesson.order}</div>
                    <div class="lesson-info">
                        <div class="lesson-title">${statusIcon} ${lesson.title}</div>
                        <div class="lesson-meta">
                            
                        </div>
                    </div>
                    <div class="lesson-actions">
                        <a href="lesson.html?id=${lesson.id}" class="btn ${isCompleted ? 'btn-outline' : 'btn-primary'} btn-small">
                            ${isCompleted ? 'مراجعة' : 'ابدأ الدرس'}
                        </a>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        lessonsContent.innerHTML = html;
    }
    
    // عرض جميع الدروس افتراضياً
    displayLessons();
    
    // إضافة مستمعي الأحداث لروابط الوحدات
    moduleLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const moduleId = link.dataset.moduleId;
            displayLessons(moduleId);
        });
    });
    
    // التحقق من معامل URL لتحديد وحدة معينة
    const urlParams = new URLSearchParams(window.location.search);
    const moduleParam = urlParams.get('module');
    if (moduleParam) {
        displayLessons(moduleParam);
    }
});