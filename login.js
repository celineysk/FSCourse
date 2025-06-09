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

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    console.log('Login attempt:', { email, password });

    const { data: loginData, error: loginError } = await client.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (loginError) {
        alert('Login Failed: Invalid Email or Password.');
        return;
    }

    // Get the user ID from the signup response
    const userId = loginData.user?.id;

    if (userId) {

        // Save additional user data to "profiles" table
        const { error: insertError } = await client
            .from('profiles')
            .insert([{ id: userId, email: email, name: null }]);

        if (insertError) {
            alert('Insert error: ' + insertError.message);
        }
    }
    
    // In a real application, you would send this data to your server
    console.log('Login attempt:', { email, password });

    // For demo purposes, we'll just redirect to the dashboard
    // Normally you would check credentials on the server and redirect only if valid
    if (loginData.user) {
        window.location.href = 'dashboard.html';
    }
});
