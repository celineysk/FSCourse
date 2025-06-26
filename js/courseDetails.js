const client = supabase.createClient('https://tvecqrnbaytkqwhzifsd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2ZWNxcm5iYXl0a3F3aHppZnNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NjI4NzksImV4cCI6MjA2NDUzODg3OX0.9p3oUwc8ed0uHz4HiobN7R4A_H6c86fsFvj2XcqLy3E')

// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

let logUser, paid;

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

let coursePrice = 399;
let discountValue = 0;

// Payment modal
const enrollButton = document.getElementById('enroll-button');
const paymentModal = document.getElementById('payment-modal');
const closePayment = document.getElementById('close-payment');
const learnButton = document.getElementById('learn-button');
const beforeEnroll = document.getElementById('beforeEnroll');
const afterEnroll = document.getElementById('afterEnroll');
//const completePurchase = document.getElementById('complete-purchase');

// Auth check and UI update
document.addEventListener('DOMContentLoaded', async () => {
    // Check auth status
    const { data: { user }, error } = await client.auth.getUser();
    debugger;
    logUser = user;
    if (logUser) {
        const { data: profileData, error: profileError } = await client
            .from('profilesDiscount')
            .select('displayName, discountAvailable, paymentID')
            .eq('email', logUser.email)
            .single();

        console.log(profileData.displayName);
        paid = profileData.paymentID;
        console.log('paid', paid);
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

        //banner details
        if (!paid) {
            if (hasDiscount && discountExpiry) {
                // Show banner with discount info
                discountBanner.classList.remove('hidden');

                // Extract discount amount from code
                if (hasDiscount === '300') {
                    bannerDiscount.textContent = '300';
                    discountAmount.textContent = '300';
                    discountPrice.textContent = '99';
                    discountPercent.textContent = '-83.5%';
                    modalDiscountAmount.textContent = '300';
                    discountValue = 300;
                } else if (hasDiscount === '200') {
                    bannerDiscount.textContent = '200';
                    discountAmount.textContent = '200';
                    discountPrice.textContent = '199';
                    discountPercent.textContent = '-66.8%';
                    modalDiscountAmount.textContent = '200';
                    discountValue = 200;
                } else if (hasDiscount === '150') {
                    bannerDiscount.textContent = '150';
                    discountAmount.textContent = '150';
                    discountPrice.textContent = '249';
                    discountPercent.textContent = '-58.4%';
                    modalDiscountAmount.textContent = '150';
                    discountValue = 150;
                }


                // Show applied discount on page
                discountApplied.classList.remove('hidden');

                // Update modal discount and total
                modalDiscount.classList.remove('hidden');
                modalTotal.textContent = coursePrice - discountValue;

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
                        modalTotal.textContent = coursePrice;
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
        } else {
            beforeEnroll.classList.add('hidden');
            afterEnroll.classList.remove('hidden');
            localStorage.removeItem('fengshui_discount');
            localStorage.removeItem('fengshui_discount_expiry');
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


// Apply discount button
const applyDiscountBtn = document.getElementById('apply-discount');

applyDiscountBtn.addEventListener('click', () => {
    discountApplied.classList.remove('hidden');
});

enrollButton.addEventListener('click', () => {
    // Check if user is logged in
    if (!logUser) {
        // Redirect to login page
        window.location.href = 'login.html';
        return;

    }
    paymentModal.classList.remove('hidden');

    const payment = coursePrice - discountValue;

    if (window.paypal) {
        // Track modal state
        let modalOpen = false;

        // MutationObserver for modal changes
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.attributeName === 'class') {
                    const modal = document.querySelector('.paypal-checkout-sandbox');
                    if (modal) {
                        if (modal.classList.contains('zoid-visible')) {
                            document.body.classList.add('paypal-modal-active');
                            modalOpen = true;
                            // Additional fixes for iOS
                            if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
                                document.body.style.position = 'fixed';
                                document.body.style.top = `-${window.scrollY}px`;
                            }

                            // Ensure card fields container has proper height
                            const cardFields = document.querySelector('.card-fields-container, .paypal-card-fields');
                            if (cardFields) {
                                cardFields.style.minHeight = '400px';
                            }
                        } else {
                            document.body.classList.remove('paypal-modal-active');
                            modalOpen = false;
                            // Restore iOS scroll position
                            if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
                                const scrollY = document.body.style.top;
                                document.body.style.position = '';
                                document.body.style.top = '';
                                window.scrollTo(0, parseInt(scrollY || '0') * -1);
                            }
                        }
                    }
                }
            });
        });

        function initPayPal() {
            paypal.Buttons({
                style: {
                    height: 48,
                    layout: 'vertical',
                    fundingicons: 'true',
                    // Additional styling for card fields
                    cardFields: {
                        fontSize: '16px',
                        color: '#3A3A3A'
                    }
                },
                // Force modal behavior for card payments
                paymentMethod: {
                    payerSelected: 'paypal',
                    payeePreferred: 'immutable'
                },
                // Maintain modal state
                onShippingChange: (data, actions) => actions.resolve(),

                createOrder: function (data, actions) {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: payment,
                                breakdown: {
                                    item_total: { value: payment, currency_code: 'EUR' }
                                }
                            },
                            items: [{
                                name: "MONEY MAGNET",
                                unit_amount: { value: payment, currency_code: 'EUR' },
                                quantity: "1"
                            }]
                        }]
                    });
                },
                onApprove: function (data, actions) {
                    // 1. First capture payment and close modal
                    return actions.order.capture().then(function (details) {
                        paymentModal.classList.add('hidden');

                        // 2. Process Supabase update (non-async)
                        client
                            .from('Profiles')
                            .update({
                                enrollTime: new Date().toISOString(),
                                paymentID: details.id
                            })
                            .eq('email', logUser.email)
                            .then(function (enrollData) {
                                // 3. On success
                                alert('Transaction completed!');
                                beforeEnroll.classList.add('hidden');
                                afterEnroll.classList.remove('hidden');
                                window.location.reload();
                            })
                            .catch(function (error) {
                                // 4. On Supabase error only
                                console.error('Supabase error:', error);
                                alert('Payment succeeded but record update failed. Please contact support.');
                            });

                        // 5. Resolve immediately for PayPal (don't wait for Supabase)
                        return Promise.resolve();
                    }).catch(function (error) {
                        // 6. Handle PayPal capture errors
                        console.error('Payment capture failed:', error);
                        paymentModal.classList.add('hidden');
                        alert('Payment processing failed. Please try again.');
                    });
                },
                onError: function (err) {
                    console.error('PayPal error:', err);
                    document.body.classList.remove('paypal-modal-active');
                }
            }).render('#paypal-button-container');

            // Set up observer after slight delay
            setTimeout(() => {
                const modalContainer = document.querySelector('.paypal-checkout-sandbox');
                if (modalContainer) {
                    observer.observe(modalContainer, {
                        attributes: true,
                        attributeFilter: ['class']
                    });

                    // Add CSS for card fields
                    const style = document.createElement('style');
                    style.textContent = `
                    .card-fields-container, .paypal-card-fields {
                        min-height: 400px !important;
                        transition: height 0.3s ease !important;
                    }
                    #card-fields-container iframe {
                        height: 100% !important;
                    }
                    .paypal-modal-active {
                        overflow: hidden !important;
                    }
                `;
                    document.head.appendChild(style);
                }
            }, 1000);
        }

        // Initialize when SDK is ready
        if (window.paypal.Buttons) {
            initPayPal();
        } else {
            window.addEventListener('paypal-sdk-ready', initPayPal);
        }
    }
});


closePayment.addEventListener('click', () => {
    paymentModal.classList.add('hidden');
});

// Close modal if clicked outside
window.addEventListener('click', (e) => {
    if (e.target === paymentModal) {
        paymentModal.classList.add('hidden');
    }
});

learnButton.addEventListener('click', () => {
    window.location.href = 'coursePlayer.html';
});



document.addEventListener('DOMContentLoaded', function () {
    // Get all navigation buttons and content sections
    const tabsButtons = document.querySelectorAll('.content-tab');
    const contentSections = document.querySelectorAll('.tabsContent');

    tabsButtons.forEach(tab => {
        tab.addEventListener('click', () => {
            // Reset all tabs
            tabsButtons.forEach(t => {
                t.classList.remove('text-gray-800', 'border-sky-blue');
                t.classList.add('text-gray-500', 'border-transparent');
            });

            // Set active tab
            tab.classList.remove('text-gray-500', 'border-transparent');
            tab.classList.add('text-gray-800', 'border-sky-blue');

            // Hide all content sections
            contentSections.forEach(section => {
                section.classList.add('hidden');
            });

            // Show the selected content section
            const sectionId = tab.getAttribute('data-section') + 'Tab';
            document.getElementById(sectionId).classList.remove('hidden');
        });
    });
});




