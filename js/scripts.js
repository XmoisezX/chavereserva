// Dark Mode Logic
function initDarkMode() {
    // Check localStorage or system preference
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

// Initialize AOS
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50
        });
    }
}

function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    if (document.documentElement.classList.contains('dark')) {
        localStorage.theme = 'dark';
    } else {
        localStorage.theme = 'light';
    }
}

// Mobile Menu Logic
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuIcon = document.querySelector('#mobile-menu-btn span');

    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');

        // Optional: Change icon from menu to close
        if (mobileMenuIcon) {
            if (mobileMenu.classList.contains('hidden')) {
                mobileMenuIcon.textContent = 'menu';
            } else {
                mobileMenuIcon.textContent = 'close';
            }
        }
    }
}

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    initDarkMode();
    initAOS();

    // Attach Dark Mode Toggle to the existing floating button
    // The existing button has an onclick attribute, but we can also attach event listeners for cleaner separation if we wanted.
    // However, the existing HTML uses onclick="document.documentElement.classList.toggle('dark')".
    // We will replace that inline handler with our improved one in the HTML updates.

    // Find floating theme toggle
    const floatingThemeBtn = document.querySelector('.fixed.bottom-6.right-6 button, .fixed.bottom-8.right-8 button');
    if (floatingThemeBtn) {
        // Remove inline onclick if possible or just override behavior? 
        // Best to replace the HTML to remove inner onclick and add id/class.
        floatingThemeBtn.removeAttribute('onclick');
        floatingThemeBtn.addEventListener('click', toggleDarkMode);
    }

    // Attach Mobile Menu Event
    const menuBtn = document.getElementById('mobile-menu-btn');
    if (menuBtn) {
        menuBtn.addEventListener('click', toggleMobileMenu);
    }
});
