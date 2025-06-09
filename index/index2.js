// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Discount coupon functionality
const revealButton = document.getElementById('reveal-discount');
const discountRevealed = document.getElementById('discount-revealed');
const discountAmount = document.getElementById('discount-amount');
const couponCode = document.getElementById('coupon-code');
const countdownElement = document.getElementById('countdown');

// Only show the discount option if user is not logged in and hasn't claimed it before
const hasDiscount = localStorage.getItem('fengshui_discount');

if (hasDiscount) {
    document.getElementById('discount-area').innerHTML = '<p class="text-gray-700 font-medium">You have already claimed your discount coupon!</p>';
} else {
    revealButton.addEventListener('click', () => {
        // Generate random discount based on probabilities
        const random = Math.random();
        let discount, code;

        if (random < 0.5) { // 50% chance
            discount = '€300';
            code = 'FENGSHUI300';
        } else if (random < 0.8) { // 30% chance
            discount = '€200';
            code = 'FENGSHUI200';
        } else { // 20% chance
            discount = '€150';
            code = 'FENGSHUI150';
        }

        discountAmount.textContent = discount;
        couponCode.textContent = code;

        // Hide button, show discount
        revealButton.classList.add('hidden');
        discountRevealed.classList.remove('hidden');

        // Store in localStorage
        localStorage.setItem('fengshui_discount', code);
        localStorage.setItem('fengshui_discount_expiry', Date.now() + 3600000); // 1 hour from now

        // Start countdown
        startCountdown();
    });
}

function startCountdown() {
    const expiry = localStorage.getItem('fengshui_discount_expiry');
    if (!expiry) return;

    const updateCountdown = () => {
        const now = Date.now();
        const timeLeft = Math.max(0, expiry - now);

        if (timeLeft <= 0) {
            countdownElement.textContent = 'Expired';
            localStorage.removeItem('fengshui_discount');
            localStorage.removeItem('fengshui_discount_expiry');
            return;
        }

        const hours = Math.floor(timeLeft / (1000 * 60 * 60)).toString().padStart(2, '0');
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000).toString().padStart(2, '0');

        countdownElement.textContent = `${hours}:${minutes}:${seconds}`;
        setTimeout(updateCountdown, 1000);
    };

    updateCountdown();
}

// Check if there's an existing countdown to resume
if (localStorage.getItem('fengshui_discount_expiry')) {
    revealButton.classList.add('hidden');
    discountRevealed.classList.remove('hidden');
    startCountdown();
}