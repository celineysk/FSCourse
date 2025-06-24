const client = supabase.createClient('https://tvecqrnbaytkqwhzifsd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2ZWNxcm5iYXl0a3F3aHppZnNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NjI4NzksImV4cCI6MjA2NDUzODg3OX0.9p3oUwc8ed0uHz4HiobN7R4A_H6c86fsFvj2XcqLy3E')

// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

let logUser;

// Auth check and UI update
document.addEventListener('DOMContentLoaded', async () => {
    // Check auth status
    const { data: { user }, error } = await client.auth.getUser();

    logUser = user;
    if (logUser) {
        const { data: profileData, error: profileError } = await client
            .from('profilesDiscount')
            .select('displayName, discountAvailable')
            .eq('email', logUser.email)
            .single();

        console.log(profileData.displayName);

        // Display user info
        if (!profileData.displayName) {
            document.getElementById('user-name').textContent = logUser.email.split('@')[0];
            document.getElementById('mobile-user-name').textContent = logUser.email.split('@')[0];
        } else {
            document.getElementById('user-name').textContent = profileData.displayName;
            document.getElementById('mobile-user-name').textContent = profileData.displayName;
        }

        // User is logged in - show profile, hide login/register
        document.getElementById('logged-out-buttons').classList.add('hidden');
        document.getElementById('logged-in-profile').classList.add('md:flex');

        document.getElementById('mobile-logged-out-buttons').classList.add('hidden');
        document.getElementById('mobile-dash-set').classList.remove('hidden');
        document.getElementById('mobile-logged-in-profile').classList.remove('hidden');
        document.getElementById('mobile-logout-button').classList.remove('hidden');

        // Profile dropdown functionality
        const profileTrigger = document.getElementById('profile-dropdown-trigger');
        const profileDropdown = document.getElementById('profile-dropdown');

        if (profileTrigger && profileDropdown) {
            // Toggle dropdown on profile click
            profileTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                profileDropdown.classList.toggle('hidden');
                profileDropdown.classList.toggle('show');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!profileDropdown.contains(e.target)) {
                    profileDropdown.classList.add('hidden');
                    profileDropdown.classList.remove('show');
                }
            });

            // Close dropdown when clicking on menu items
            profileDropdown.querySelectorAll('a, button').forEach(item => {
                item.addEventListener('click', () => {
                    profileDropdown.classList.add('hidden');
                    profileDropdown.classList.remove('show');
                });
            });
        }

        // Set up logout
        const logoutButtons = [
            document.getElementById('logout-button'),
            document.getElementById('mobile-logout-button')
        ];

        const logout = () => {
            client.auth.signOut()
                .then(() => window.location.href = 'index.html');
        };

        logoutButtons.forEach(btn => {
            if (btn) btn.addEventListener('click', logout);
        });
    }
});

// Content tabs
const contentTabs = document.querySelectorAll('.content-tab');

contentTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Reset all tabs
        contentTabs.forEach(t => {
            t.classList.remove('text-gray-800', 'border-sky-blue');
            t.classList.add('text-gray-500', 'border-transparent');
        });

        // Set active tab
        tab.classList.remove('text-gray-500', 'border-transparent');
        tab.classList.add('text-gray-800', 'border-sky-blue');
    });
});

// Check for discount in localStorage and display on page
const discountBanner = document.getElementById('discount-banner');
const bannerDiscount = document.getElementById('banner-discount');
const bannerCountdown = document.getElementById('banner-countdown');

const discountApplied = document.getElementById('discount-applied');
const discountAmount = document.getElementById('discount-amount');
const discountPrice = document.getElementById('discountPrice');
const discountPercent = document.getElementById('discountPercent');

const modalDiscount = document.getElementById('modal-discount');
const modalDiscountAmount = document.getElementById('modal-discount-amount');
const modalTotal = document.getElementById('modal-total');

const hasDiscount = localStorage.getItem('fengshui_discount');
const discountExpiry = localStorage.getItem('fengshui_discount_expiry');

let coursePrice = 999;
let discountValue = 0;

if (hasDiscount && discountExpiry) {
    // Show banner with discount info
    discountBanner.classList.remove('hidden');

    // Extract discount amount from code
    if (hasDiscount === '300') {
        bannerDiscount.textContent = '300';
        discountAmount.textContent = '300';
        discountPrice.textContent = '99';
        discountPercent.textContent = '-83.5%';
        modalDiscountAmount.textContent = '-300';
        discountValue = 300;
    } else if (hasDiscount === '200') {
        bannerDiscount.textContent = '200';
        discountAmount.textContent = '200';
        discountPrice.textContent = '199';
        discountPercent.textContent = '-66.8%';
        modalDiscountAmount.textContent = '-200';
        discountValue = 200;
    } else if (hasDiscount === '150') {
        bannerDiscount.textContent = '150';
        discountAmount.textContent = '150';
        discountPrice.textContent = '249';
        discountPercent.textContent = '-58.4%';
        modalDiscountAmount.textContent = '-150';
        discountValue = 150;
    }


    // Show applied discount on page
    discountApplied.classList.remove('hidden');

    // Update modal discount and total
    modalDiscount.classList.remove('hidden');
    modalTotal.textContent = `€${coursePrice - discountValue}`;

    // Start countdown
    const updateBannerCountdown = () => {
        const now = Date.now();
        const timeLeft = Math.max(0, discountExpiry - now);

        if (timeLeft <= 0) {
            bannerCountdown.textContent = 'Expired';
            localStorage.removeItem('fengshui_discount');
            localStorage.removeItem('fengshui_discount_expiry');
            discountBanner.classList.add('hidden');
            discountApplied.classList.add('hidden');
            modalDiscount.classList.add('hidden');
            modalTotal.textContent = `€${coursePrice}`;
            return;
        }

        const hours = Math.floor(timeLeft / (1000 * 60 * 60)).toString().padStart(2, '0');
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000).toString().padStart(2, '0');

        bannerCountdown.textContent = `${hours}:${minutes}:${seconds}`;
        setTimeout(updateBannerCountdown, 1000);
    };

    updateBannerCountdown();
}

// Apply discount button
const applyDiscountBtn = document.getElementById('apply-discount');

applyDiscountBtn.addEventListener('click', () => {
    discountApplied.classList.remove('hidden');
});

// Payment modal
const enrollButton = document.getElementById('enroll-button');
const paymentModal = document.getElementById('payment-modal');
const closePayment = document.getElementById('close-payment');
const completePurchase = document.getElementById('complete-purchase');

enrollButton.addEventListener('click', () => {
    paymentModal.classList.remove('hidden');
});

closePayment.addEventListener('click', () => {
    paymentModal.classList.add('hidden');
});

completePurchase.addEventListener('click', () => {
    // Check if user is logged in
    const user = localStorage.getItem('fengshui_user');

    if (!user) {
        // Redirect to login page
        window.location.href = 'login.html';
        return;
    }

    // In a real application, you would process the payment here
    // For demo purposes, we'll just simulate a successful purchase
    alert('Thank you for your purchase! You now have access to Feng Shui Fundamentals.');
    paymentModal.classList.add('hidden');

    // Store purchased course in localStorage
    const purchasedCourses = JSON.parse(localStorage.getItem('fengshui_purchased_courses') || '[]');
    purchasedCourses.push('Feng Shui Fundamentals');
    localStorage.setItem('fengshui_purchased_courses', JSON.stringify(purchasedCourses));

    // Redirect to dashboard
    window.location.href = 'dashboard.html';
});

// Close modal if clicked outside
window.addEventListener('click', (e) => {
    if (e.target === paymentModal) {
        paymentModal.classList.add('hidden');
    }
});
