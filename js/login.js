const client = supabase.createClient('https://tvecqrnbaytkqwhzifsd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2ZWNxcm5iYXl0a3F3aHppZnNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NjI4NzksImV4cCI6MjA2NDUzODg3OX0.9p3oUwc8ed0uHz4HiobN7R4A_H6c86fsFvj2XcqLy3E')

// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Login form submission
const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async(e) => {
    e.preventDefault();

    const logEmail = document.getElementById('email').value.trim().toLowerCase();
    const logPassword = document.getElementById('password').value.trim();
    console.log('Login attempt:', { logEmail, logPassword });

    try {

        // 2. Check for existing records WITHOUT auth
        const [{ data: profileUser }, { data: pendingUser }] = await Promise.all([
            client.from('Profiles').select('email').eq('email', logEmail).maybeSingle(),
            client.from('PendingUsers').select('email').eq('email', logEmail).maybeSingle()
        ]);

        // 3. Handle existing records
        if (profileUser) {
            const { data: loginData, error: loginError } = await client.auth.signInWithPassword({
                email: logEmail,
                password: logPassword
            });
            if (loginError) throw loginError;

            console.log('Login attempt:', { logEmail, logPassword });
            if (loginData.user) {
                window.location.href = 'dashboard.html';
            }
        }
        if (pendingUser) {
            alert('Email is not verified. Please check your email to verify this account and proceed to login!');
            return;
        }
        if (!profileUser && !pendingUser) {
            alert('Email is not registered. Please proceed to register before logging in!');
            return;
        }     

    } catch (error) {
        console.error('Login error:', error);
        alert(`Error: ${error.message}`);
    }
});
