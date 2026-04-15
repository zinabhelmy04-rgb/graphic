document.addEventListener('DOMContentLoaded', () => {
    requireAuth();
    
    const greetingEl = document.getElementById('user-greeting');
    if (greetingEl) greetingEl.textContent = 'مرحباً، متعلم';
    
    const progress = ProgressManager.getData();
    const overall = ProgressManager.getOverallProgress();
    
    // تحديث الدائرة
    const circle = document.getElementById('progress-circle');
    circle.style.setProperty('--progress', overall.percentage);
    document.getElementById('progress-percentage').textContent = `${overall.percentage}%`;
    document.getElementById('progress-summary-text').textContent = 
        `${overall.completed} من ${overall.total} درس مكتمل`;
    
    // بناء تقدم الوحدات
    const modulesContainer = document.getElementById('modules-progress-list');
    modulesData.forEach(module => {
        const moduleProgress = ProgressManager.getModuleProgress(module.id);
        const item = document.createElement('div');
        item.className = 'module-progress-item';
        item.innerHTML = `
            <div class="module-name">${module.title}</div>
            <div class="progress-container" style="flex:1;">
                <div class="progress-bar" style="width: ${moduleProgress.percentage}%"></div>
            </div>
            <div class="module-stats">${moduleProgress.completed}/${moduleProgress.total} درس</div>
        `;
        modulesContainer.appendChild(item);
    });
    
    // معلومات النشاط
    const activityInfo = document.getElementById('activity-info');
    const lastActivity = progress.lastActivity ? new Date(progress.lastActivity) : null;
    const currentLesson = progress.currentLessonId ? getLessonById(progress.currentLessonId) : null;
    
    let activityHtml = '<div class="activity-item">';
    activityHtml += `<span>آخر نشاط:</span>`;
    activityHtml += `<span>${lastActivity ? lastActivity.toLocaleString('ar-EG') : 'غير متوفر'}</span>`;
    activityHtml += '</div>';
    
    if (currentLesson) {
        activityHtml += '<div class="activity-item">';
        activityHtml += `<span>الدرس الحالي:</span>`;
        activityHtml += `<span>${currentLesson.title}</span>`;
        activityHtml += '</div>';
    }
    
    activityHtml += '<div class="activity-item">';
    activityHtml += `<span>إجمالي وقت التعلم:</span>`;
    activityHtml += `<span>${progress.totalTimeMinutes || 0} دقيقة</span>`;
    activityHtml += '</div>';
    
    activityInfo.innerHTML = activityHtml;
    
    // زر إعادة الضبط
    document.getElementById('reset-progress').addEventListener('click', () => {
        ProgressManager.resetProgress();
    });
});