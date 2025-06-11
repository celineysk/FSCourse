const client = supabase.createClient('https://tvecqrnbaytkqwhzifsd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2ZWNxcm5iYXl0a3F3aHppZnNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NjI4NzksImV4cCI6MjA2NDUzODg3OX0.9p3oUwc8ed0uHz4HiobN7R4A_H6c86fsFvj2XcqLy3E')

// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Registration form submission
const registerForm = document.getElementById('register-form');


registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const regEmail = document.getElementById('email').value.trim().toLowerCase();
    const regPassword = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();

    // 1. Basic validation
    if (regPassword !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    if (regPassword.length < 8) {
        alert('Password must be at least 8 characters');
        return;
    }

    try {

        // 2. Check for existing records WITHOUT auth
        const [{ data: profileUser }, { data: pendingUser }] = await Promise.all([
            client.from('Profiles').select('email').eq('email', regEmail).maybeSingle(),
            client.from('PendingUsers').select('email').eq('email', regEmail).maybeSingle()
        ]);

        // 3. Handle existing records
        if (profileUser) {
            alert('Email is already verified. Please login!');
            window.location.href = 'login.html';
            return;
        }
        if (pendingUser) {
            alert('Email is registered. Please check your email to verify this account and proceed to login!');
            return;
        }
        // 4. Register new user
        const { data: signUpData, error: signUpError } = await client.auth.signUp({
            email: regEmail,
            password: regPassword,

        });

        if (signUpError) throw signUpError;

        // 5. Insert to PendingUsers (use response data directly)
        const { error: insertError } = await client
            .from('PendingUsers')
            .insert([{
                email: regEmail,
                id: signUpData.user?.id,
                created_at: new Date().toISOString()
            }]);

        if (insertError) throw insertError;

        alert('Registration successful! Check your email to verify.');
        window.location.href = 'login.html';

    } catch (error) {
        console.error('Registration error:', error);
        alert(`Error: ${error.message}`);
    }
});


