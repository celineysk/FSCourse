const client = supabase.createClient('https://tvecqrnbaytkqwhzifsd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2ZWNxcm5iYXl0a3F3aHppZnNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NjI4NzksImV4cCI6MjA2NDUzODg3OX0.9p3oUwc8ed0uHz4HiobN7R4A_H6c86fsFvj2XcqLy3E')

// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

let logUser;
let discount, disExpiry, disAvailable;

// Discount coupon functionality
const revealButton = document.getElementById('reveal-discount');
const discountRevealed = document.getElementById('discount-revealed');
const discountExpired = document.getElementById('discount-expired');
const discountAmount = document.getElementById('discountAmount');
const couponCode = document.getElementById('coupon-code');
const countdownElement = document.getElementById('countdown');

// Auth check and UI update
document.addEventListener('DOMContentLoaded', async () => {

    // Check auth status
    const { data: { user }, error } = await client.auth.getUser();

    //debuging
    //localStorage.removeItem('fengshui_discount');
    //localStorage.removeItem('fengshui_discount_expiry');

    logUser = user;
    if (logUser) {
        const { data: profileData, error: profileError } = await client
            .from('profilesDiscount')
            .select('displayName, discountAvailable')
            .eq('email', logUser.email)
            .single();

        console.log(profileData.displayName);
        disAvailable = profileData.discountAvailable;
        console.log(profileData.discountAvailable);
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

        if (disAvailable) { //can redeem discount

         

            discount = localStorage.getItem('fengshui_discount');
            console.log('hello', discount);
            if (discount != null) { //check if there's record of discount in local
                disExpiry = localStorage.getItem('fengshui_discount_expiry');
            } else {
                const { data: disGet, error: disError } = await client
                    .from('Profiles')
                    .select('discount, discountExpiry')
                    .eq('email', logUser.email)
                    .single()

                discount = disGet.discount;
                disExpiry = new Date(disGet.discountExpiry).getTime();
                console.log('discount', discount);
                discountAmount.textContent = discount
                localStorage.setItem('fengshui_discount', discount);
                localStorage.setItem('fengshui_discount_expiry', disExpiry);
            }

            if (discount != 'null' && discount != null) { //if user claimed discount & not expired
                // Hide button, show discount
                revealButton.classList.add('hidden');
                discountRevealed.classList.remove('hidden');
                startCountdown();

            }


        } else { //discount expired
            revealButton.classList.add('hidden');
            discountExpired.classList.remove('hidden');
            localStorage.removeItem('fengshui_discount');
            localStorage.removeItem('fengshui_discount_expiry');

        }

        if (discount === "300" || discount === 300) {
            document.getElementById('disPrice').textContent = '99'
            document.getElementById('disPercent').textContent = '-83.5%'

        } else if (discount === "200" || discount === 200) {
            document.getElementById('disPrice').textContent = '199'
            document.getElementById('disPercent').textContent = '-66.8%'

        } else if (discount === "150" || discount === 150) {           
            document.getElementById('disPrice').textContent = '249'
            document.getElementById('disPercent').textContent = '-58.4%'            
        }

        document.getElementById('cta').classList.add('hidden');

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

revealButton.addEventListener('click', async () => {
    if (!logUser) {
        alert('Please login before using discount!');
        window.location.href = 'login.html';
        return;
    }

    // Generate random discount based on probabilities
    const random = Math.random();
    let dis;

    if (random < 0.5) { // 50% chance
        dis = '300';
    } else if (random < 0.8) { // 30% chance
        dis = '200';
    } else { // 20% chance
        dis = '150';
    }

    discountAmount.textContent = dis;
    disExpiry = Date.now() + 3600000;

    // Hide button, show discount
    revealButton.classList.add('hidden');
    discountRevealed.classList.remove('hidden');
    localStorage.setItem('fengshui_discount', dis);
    localStorage.setItem('fengshui_discount_expiry', Date.now() + 3600000);

    try {
        const { error: disError } = await client
            .from('Profiles')
            .update({
                discount: dis,
                discountExpiry: new Date(disExpiry).toISOString()
            })
            .eq('email', logUser.email)

        if (disError) throw (disError);

        startCountdown();
    } catch (error) {
        console.log('Error: ', error);
    }
        
    
});

function startCountdown() {
    console.log(disExpiry);
    const updateCountdown = () => {
        const now = Date.now();
        const timeLeft = Math.max(0, disExpiry - now);
        
        console.log(timeLeft);
        if (timeLeft <= 0) {
            countdownElement.textContent = 'Expired';
           
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

