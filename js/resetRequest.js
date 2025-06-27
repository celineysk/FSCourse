const client = supabase.createClient('https://tvecqrnbaytkqwhzifsd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2ZWNxcm5iYXl0a3F3aHppZnNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NjI4NzksImV4cCI6MjA2NDUzODg3OX0.9p3oUwc8ed0uHz4HiobN7R4A_H6c86fsFvj2XcqLy3E')

// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

const verifyForm = document.getElementById('verify-form');
const verifyBtn = document.getElementById('verify-btn');
const cooldownTimer = document.getElementById('cooldown-timer');
const countdownDisplay = document.getElementById('countdown');

let cooldownActive = false;
let countdown = 60;

verifyForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (cooldownActive) return;

    try {
        
        const verEmail = document.getElementById('email').value.trim().toLowerCase();

        const [{ data: profileUser }, { data: pendingUser }] = await Promise.all([
            client.from('Profiles').select('email').eq('email', verEmail).maybeSingle(),
            client.from('PendingUsers').select('email').eq('email', verEmail).maybeSingle()
        ]);
        if (!profileUser && !pendingUser) {
            alert('This email is not registered yet!');
            return;
        }
        if (pendingUser) {
            alert('This email is not verified. Please proceed to verify!');
            window.location.href = 'login.html';
            return;
        }
        debugger;
        const { error: resetError } = await client.auth.resetPasswordForEmail(verEmail, {
            redirectTo: `${window.location.origin}/changePw.html?type=recovery`,
            captchaToken: null            
        });

        // If v2 fails, try v1 method
        if (resetError) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/recover`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
                },
                body: JSON.stringify({
                    email: email,
                    redirect_to: `${window.location.origin}/reset-password`
                })
            });

            if (!response.ok) throw new Error(await response.text());
        }

        //if (resetError) throw resetError;
        alert('Password reset link sent! Check your email.');
        startCooldown();

    } catch (error) {
        alert(`Error encountered: ${error.message}`);
    }
});

function startCooldown() {
    cooldownActive = true;
    verifyBtn.classList.add('text-gray-400', 'cursor-not-allowed');
    verifyBtn.classList.remove('text-sky-blue-dark', 'hover:underline');
    cooldownTimer.classList.remove('hidden');
    countdown = 60;
    countdownDisplay.textContent = countdown;

    const timer = setInterval(() => {
        countdown--;
        countdownDisplay.textContent = countdown;

        if (countdown <= 0) {
            clearInterval(timer);
            cooldownActive = false;
            cooldownTimer.classList.add('hidden');
            verifyBtn.classList.remove('text-gray-400', 'cursor-not-allowed');
            verifyBtn.classList.add('text-sky-blue-dark', 'hover:underline');
        }
    }, 1000);
}
