const ProgressManager = {
    STORAGE_KEY: 'graphic_app_progress',
    
    getData() {
        const raw = localStorage.getItem(this.STORAGE_KEY);
        if (!raw) return this.getDefaultData();
        try {
            return JSON.parse(raw);
        } catch (e) {
            console.error('خطأ في قراءة بيانات التقدم:', e);
            return this.getDefaultData();
        }
    },
    
    getDefaultData() {
        return {
            completedLessons: [],
            currentLessonId: null,
            lastActivity: new Date().toISOString(),
            totalTimeMinutes: 0
        };
    },
    
    saveData(data) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('خطأ في حفظ بيانات التقدم:', e);
        }
    },
    
    isLessonCompleted(lessonId) {
        const data = this.getData();
        return data.completedLessons.includes(lessonId);
    },
    
    completeLesson(lessonId, duration = 0) {
        const data = this.getData();
        if (!data.completedLessons.includes(lessonId)) {
            data.completedLessons.push(lessonId);
            data.totalTimeMinutes += duration;
        }
        data.currentLessonId = lessonId;
        data.lastActivity = new Date().toISOString();
        this.saveData(data);
        
        // تحديث واجهة المستخدم إذا كانت الدالة موجودة
        if (typeof updateUIAfterCompletion === 'function') {
            updateUIAfterCompletion();
        }
    },
    
    setCurrentLesson(lessonId) {
        const data = this.getData();
        data.currentLessonId = lessonId;
        data.lastActivity = new Date().toISOString();
        this.saveData(data);
    },
    
    getNextLessonId() {
        const data = this.getData();
        const allLessons = lessonsData.sort((a, b) => a.order - b.order);
        for (let lesson of allLessons) {
            if (!data.completedLessons.includes(lesson.id)) {
                return lesson.id;
            }
        }
        return null; // الكل مكتمل
    },
    
    getOverallProgress() {
        const data = this.getData();
        return {
            completed: data.completedLessons.length,
            total: lessonsData.length,
            percentage: lessonsData.length > 0 ? Math.round((data.completedLessons.length / lessonsData.length) * 100) : 0
        };
    },
    
    getModuleProgress(moduleId) {
        const data = this.getData();
        const moduleLessons = getLessonsByModule(moduleId);
        const completed = moduleLessons.filter(l => data.completedLessons.includes(l.id)).length;
        return {
            completed,
            total: moduleLessons.length,
            percentage: moduleLessons.length > 0 ? Math.round((completed / moduleLessons.length) * 100) : 0
        };
    },
    
    resetProgress() {
        if (confirm('هل أنت متأكد من حذف كل تقدمك؟')) {
            localStorage.removeItem(this.STORAGE_KEY);
            window.location.reload();
        }
    }
};