const client = supabase.createClient('https://tvecqrnbaytkqwhzifsd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2ZWNxcm5iYXl0a3F3aHppZnNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NjI4NzksImV4cCI6MjA2NDUzODg3OX0.9p3oUwc8ed0uHz4HiobN7R4A_H6c86fsFvj2XcqLy3E')

// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

let paid;

// Check for discount in localStorage and display banner if present
const discountBanner = document.getElementById('discount-banner');
const bannerDiscount = document.getElementById('banner-discount');
const bannerCountdown = document.getElementById('banner-countdown');

const hasDiscount = localStorage.getItem('fengshui_discount');
const discountExpiry = localStorage.getItem('fengshui_discount_expiry');

// Check if user is logged in & Display user data anywhere
// Auth check and user data loading
document.addEventListener('DOMContentLoaded', async () => {

    // Check if user is authenticated
    const { data: { user: logUser }, error } = await client.auth.getUser();
    if (!logUser) {
        window.location.href = 'login.html';
        return;
    }

    const { data: profileData, error: profileError } = await client
        .from('profilesDiscount')
        .select('displayName, paymentID')
        .eq('email', logUser.email)
        .single();
    console.log(profileData.displayName);

    paid = profileData.paymentID;

    // Display user info
    if (!profileData.displayName) {
        document.getElementById('user-name').textContent = logUser.email.split('@')[0];
        document.getElementById('mobile-user-name').textContent = logUser.email.split('@')[0];
    } else {
        document.getElementById('user-name').textContent = profileData.displayName;
        document.getElementById('mobile-user-name').textContent = profileData.displayName;
    }   

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

    const discount = hasDiscount;
    console.log(hasDiscount, '', discount)
    if (discount === "300") {
        document.getElementById('disPrice').textContent = '99'
        document.getElementById('disPercent').textContent = '83.5%'

    } else if (discount === "200") {
        document.getElementById('disPrice').textContent = '199'
        document.getElementById('disPercent').textContent = '66.8%'

    } else if (discount === "150") {
        document.getElementById('disPrice').textContent = '249'
        document.getElementById('disPercent').textContent = '58.4%'
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

    // Display purchased courses
    const purchasedCourses = JSON.parse(localStorage.getItem('fengshui_purchased_courses') || '[]');
    const myCoursesContainer = document.getElementById('my-courses-container');
    const noCoursesMessage = document.getElementById('no-courses-message');
    const courseCardTemplate = document.getElementById('course-card-template');
    const continueSection = document.getElementById('continue-learning-section');

    if (paid) {
        // Hide the "no courses" message
        noCoursesMessage.classList.add('hidden');

        // Show the continue learning section
        courseCardTemplate.classList.remove('hidden');
    }
});

if (hasDiscount && discountExpiry) {
    // Show banner with discount info
    discountBanner.classList.remove('hidden');

    // Extract discount amount from code
    if (hasDiscount === '300') {
        bannerDiscount.textContent = '300';
    } else if (hasDiscount === '200') {
        bannerDiscount.textContent = '200';
    } else if (hasDiscount === '150') {
        bannerDiscount.textContent = '150';
    }

    // Start countdown
    const updateBannerCountdown = () => {
        const now = Date.now();
        const timeLeft = Math.max(0, discountExpiry - now);

        if (timeLeft <= 0) {
            bannerCountdown.textContent = 'Expired';
            localStorage.removeItem('fengshui_discount');
            localStorage.removeItem('fengshui_discount_expiry');
            discountBanner.classList.add('hidden');
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
    // In a real application, this would apply the discount to the course prices
    alert('Discount applied! The discount will be applied at checkout.');
});