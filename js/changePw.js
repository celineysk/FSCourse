const client = supabase.createClient('https://tvecqrnbaytkqwhzifsd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2ZWNxcm5iYXl0a3F3aHppZnNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NjI4NzksImV4cCI6MjA2NDUzODg3OX0.9p3oUwc8ed0uHz4HiobN7R4A_H6c86fsFvj2XcqLy3E')

// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Check for password recovery token
const urlParams = new URLSearchParams(window.location.search);
const accessToken = urlParams.get('access_token');
const refreshToken = urlParams.get('refresh_token');

if (!accessToken || !refreshToken) {
    document.getElementById('message').textContent = 'Invalid password reset link';
    document.querySelector('button').disabled = true;
} else {
    // Set the session for password update
    supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
    });
}

document.getElementById('changePwForm').addEventListener('submit', async () => {
    const newPassword = document.getElementById('newPw').value;
    const confirmPassword = document.getElementById('conNewPw').value;

    if (newPassword !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    if (newPassword.length < 8) {
        alert('Password must be at least 8 characters');
        return;
    }

    try {
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) throw error;
        alert('Password updated successfully! Redirecting...');
        setTimeout(() => window.location.href = 'index.html', 2000);
    } catch (error) {
        alert('Error: ', error);
    }
});