/**
 * VIET PLUS - Main JavaScript
 * Handling Navigation, Reading Progress, TOC ScrollSpy, Search & Reader Utilities
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Reading Progress Bar
  const progressBar = document.querySelector('.reading-progress-bar');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      progressBar.style.width = scrolled + '%';
    });
  }

  // 2. Mobile Navigation Toggle
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const mobileDrawer = document.querySelector('.mobile-menu-drawer');
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileDrawer.classList.toggle('is-open');
    });

    document.addEventListener('click', (e) => {
      if (!mobileDrawer.contains(e.target) && !mobileToggle.contains(e.target)) {
        mobileDrawer.classList.remove('is-open');
      }
    });
  }

  // 3. Mobile TOC Floating Button & Drawer
  const tocFab = document.querySelector('.mobile-toc-fab');
  const policySidebar = document.querySelector('.policy-sidebar');
  if (tocFab && policySidebar) {
    tocFab.addEventListener('click', (e) => {
      e.stopPropagation();
      policySidebar.classList.toggle('mobile-open');
      const isOpen = policySidebar.classList.contains('mobile-open');
      tocFab.innerHTML = isOpen 
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg> Đóng mục lục`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h7"/></svg> Mục lục điều khoản`;
    });

    // Close when clicking an anchor
    policySidebar.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 443) {
          policySidebar.classList.remove('mobile-open');
          tocFab.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h7"/></svg> Mục lục điều khoản`;
        }
      });
    });
  }

  // 4. ScrollSpy for TOC
  const tocLinks = document.querySelectorAll('.toc-item a');
  const articles = document.querySelectorAll('.policy-article-card');
  if (tocLinks.length > 0 && articles.length > 0) {
    window.addEventListener('scroll', () => {
      let currentId = '';
      const scrollPos = window.scrollY + 140;

      articles.forEach(article => {
        const top = article.offsetTop;
        const height = article.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          currentId = article.getAttribute('id');
        }
      });

      if (!currentId && window.scrollY < articles[0].offsetTop) {
        currentId = articles[0].getAttribute('id');
      }

      tocLinks.forEach(link => {
        const parent = link.closest('.toc-item');
        if (parent) {
          if (link.getAttribute('href') === `#${currentId}`) {
            parent.classList.add('active');
          } else {
            parent.classList.remove('active');
          }
        }
      });
    });
  }

  // 5. In-Page Article Search / Filter
  const searchInput = document.getElementById('policySearch');
  if (searchInput && articles.length > 0) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      let matchCount = 0;

      articles.forEach(article => {
        const text = article.innerText.toLowerCase();
        if (!term || text.includes(term)) {
          article.style.display = 'block';
          matchCount++;
        } else {
          article.style.display = 'none';
        }
      });

      // Update TOC link visibility
      tocLinks.forEach(link => {
        const targetId = link.getAttribute('href')?.substring(1);
        const targetArticle = document.getElementById(targetId);
        const parent = link.closest('.toc-item');
        if (parent && targetArticle) {
          parent.style.display = targetArticle.style.display;
        }
      });
    });
  }

  // 6. Font Size Adjuster
  const btnFontDecrease = document.getElementById('btnFontDecrease');
  const btnFontIncrease = document.getElementById('btnFontIncrease');
  const policyStream = document.querySelector('.policy-articles-stream');
  let currentFontSize = 16;

  if (btnFontDecrease && btnFontIncrease && policyStream) {
    btnFontIncrease.addEventListener('click', () => {
      if (currentFontSize < 22) {
        currentFontSize += 1;
        policyStream.style.fontSize = `${currentFontSize}px`;
      }
    });

    btnFontDecrease.addEventListener('click', () => {
      if (currentFontSize > 13) {
        currentFontSize -= 1;
        policyStream.style.fontSize = `${currentFontSize}px`;
      }
    });
  }

  // 7. Print Button
  const btnPrint = document.getElementById('btnPrint');
  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      window.print();
    });
  }

  // 8. Copy Link / Info Toast
  window.showToast = function(msg) {
    let toast = document.querySelector('.toast-notice');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  };

  const btnCopyLink = document.getElementById('btnCopyLink');
  if (btnCopyLink) {
    btnCopyLink.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        window.showToast('Đã sao chép liên kết trang vào clipboard!');
      }).catch(() => {
        window.showToast('Không thể sao chép liên kết.');
      });
    });
  }

  // Copy text badge clicks
  document.querySelectorAll('.copy-badge').forEach(badge => {
    badge.addEventListener('click', () => {
      const textToCopy = badge.getAttribute('data-copy') || badge.previousSibling?.textContent?.trim() || '';
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          window.showToast(`Đã sao chép: ${textToCopy}`);
        });
      }
    });
  });

  // 9. Legacy Accordion Toggle
  const legacyHeaders = document.querySelectorAll('.legacy-header');
  legacyHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      if (content) {
        const isHidden = content.style.display === 'none';
        content.style.display = isHidden ? 'block' : 'none';
        const indicator = header.querySelector('.legacy-indicator');
        if (indicator) {
          indicator.textContent = isHidden ? '▼ Thu gọn' : '▶ Xem chi tiết';
        }
      }
    });
  });
});
