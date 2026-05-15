document.addEventListener('DOMContentLoaded', () => {
    const noteItems = document.querySelectorAll('.note-item');
    const pdfViewer = document.getElementById('pdf-viewer');
    const currentTitle = document.getElementById('current-title');
    const downloadBtn = document.getElementById('download-btn');
    const pdfFallback = document.getElementById('pdf-fallback');
    const fallbackLink = document.getElementById('fallback-link');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const exitFullscreenBtn = document.getElementById('exit-fullscreen');
    const mainArea = document.getElementById('main-area');
    const commentsSection = document.getElementById('comments-section');

    // ========== 笔记切换 ==========
    function switchNote(item) {
        const pdfPath = item.dataset.pdf;
        const title = item.dataset.title;

        // 更新活跃状态
        noteItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');

        // 更新标题
        currentTitle.textContent = title;

        // 更新 PDF 查看器
        pdfViewer.src = pdfPath;

        // 更新下载按钮
        downloadBtn.href = pdfPath;
        downloadBtn.download = pdfPath.split('/').pop();

        // 更新 fallback 链接
        fallbackLink.href = pdfPath;

        // 显示 iframe，隐藏 fallback
        pdfViewer.classList.remove('hidden');
        pdfFallback.classList.add('hidden');
    }

    noteItems.forEach(item => {
        item.addEventListener('click', () => switchNote(item));
    });

    // ========== 键盘导航 ==========
    document.addEventListener('keydown', (e) => {
        const activeIndex = Array.from(noteItems).findIndex(item => item.classList.contains('active'));
        
        if (e.key === 'ArrowDown' && activeIndex < noteItems.length - 1) {
            e.preventDefault();
            switchNote(noteItems[activeIndex + 1]);
        } else if (e.key === 'ArrowUp' && activeIndex > 0) {
            e.preventDefault();
            switchNote(noteItems[activeIndex - 1]);
        } else if (e.key === 'Escape' && mainArea.classList.contains('fullscreen')) {
            // ESC 退出全屏
            exitFullscreen();
        }
    });

    // ========== 全屏模式 ==========
    function enterFullscreen() {
        mainArea.classList.add('fullscreen');
        exitFullscreenBtn.classList.remove('hidden');
        
        // 如果浏览器支持全屏 API
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
        }
    }

    function exitFullscreen() {
        mainArea.classList.remove('fullscreen');
        exitFullscreenBtn.classList.add('hidden');
        
        // 退出浏览器全屏
        if (document.exitFullscreen && document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
        }
    }

    fullscreenBtn.addEventListener('click', enterFullscreen);
    exitFullscreenBtn.addEventListener('click', exitFullscreen);

    // 监听浏览器全屏变化
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement && mainArea.classList.contains('fullscreen')) {
            // 用户按 ESC 退出了浏览器全屏
            mainArea.classList.remove('fullscreen');
            exitFullscreenBtn.classList.add('hidden');
        }
    });

    // ========== 分类折叠 ==========
    window.toggleCategory = function(header) {
        const category = header.parentElement;
        const noteList = category.querySelector('.note-list');
        
        category.classList.toggle('collapsed');
        noteList.classList.toggle('collapsed');
    };

    // ========== 留言板折叠 ==========
    window.toggleComments = function() {
        commentsSection.classList.toggle('expanded');
        
        // 如果展开了，滚动到留言板
        if (commentsSection.classList.contains('expanded')) {
            setTimeout(() => {
                commentsSection.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }, 100);
        }
    };

    // 默认收起留言板
    commentsSection.classList.remove('expanded');

    // ========== PDF 支持检测 ==========
    function checkPDFSupport() {
        pdfViewer.addEventListener('error', () => {
            pdfViewer.classList.add('hidden');
            pdfFallback.classList.remove('hidden');
        });
    }

    checkPDFSupport();
});
