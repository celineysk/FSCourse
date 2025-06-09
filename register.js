const client = supabase.createClient('https://tvecqrnbaytkqwhzifsd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2ZWNxcm5iYXl0a3F3aHppZnNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NjI4NzksImV4cCI6MjA2NDUzODg3OX0.9p3oUwc8ed0uHz4HiobN7R4A_H6c86fsFvj2XcqLy3E')

// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Registration form submission
const registerForm = document.getElementById('register-form');

registerForm.addEventListener('submit', async(e) => {
    e.preventDefault();

    //const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();

    // Basic validation
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    if (password.length < 8) {
        alert('Password must be at least 8 characters');
        return;
    }

    const { data: signUpData, error: signUpError } = await client.auth.signUp({
        email: email,
        password: password
    });

    if (signUpError) {
        console.error('Signup error object:', signUpError)
        alert('Signup error: ' + signUpError.message);
        return;
    }

    //// Get the user ID from the signup response
    //const userId = signUpData.user?.id;

    //if (userId) {
    //    // Save additional user data to "profiles" table
    //    const { error: insertError } = await client
    //        .from('profiles')
    //        .insert([{ id: userId, name, email }]);

    //    if (insertError) {
    //        alert('Database insert error: ' + insertError.message);
    //    } else {
    //        alert('Registration successful!');
    //        window.location.href = 'dashboard.html';
    //    }
    //} else {
    //    alert('Signup failed: No user ID returned');
    //}

    // In a real application, you would send this data to your server
    console.log('Registration:', { email, password });

    alert('Registration successful! Please log in.');
    window.location.href = 'login.html';

    //// For demo purposes, we'll just redirect to the dashboard
    //localStorage.setItem('fengshui_user', email);
    //window.location.href = 'dashboard.html';
});