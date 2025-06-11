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

    debugger;

    const { data: { user: currentUser }, error: authError } = await client.auth.getUser();
    if (authError) {
        console.log('Auth Error: ', authError);
    }
    if (!currentUser?.email === logEmail) {
        alert('You have not registered with this email!');
        return;
    } else {
        if (!currentUser?.email_verified) {
            alert('You have not verified your email, Please check your email or spam.');
            return;
        }
        else {
            const { data: loginData, error: loginError } = await client.auth.signInWithPassword({
                email: logEmail,
                password: logPassword
            });
            if (loginError) {
                alert('Login Failed: Invalid Email or Password.');
                return;
            }
        }
    }
    
    // In a real application, you would send this data to your server
    console.log('Login attempt:', { logEmail, logPassword });

    // For demo purposes, we'll just redirect to the dashboard
    // Normally you would check credentials on the server and redirect only if valid
    if (loginData.user) {
        window.location.href = 'dashboard.html';
    }
});