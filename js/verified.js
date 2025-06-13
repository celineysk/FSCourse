const client = supabase.createClient('https://tvecqrnbaytkqwhzifsd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2ZWNxcm5iYXl0a3F3aHppZnNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NjI4NzksImV4cCI6MjA2NDUzODg3OX0.9p3oUwc8ed0uHz4HiobN7R4A_H6c86fsFvj2XcqLy3E')

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const verToken = urlParams.get('token');
    const verEmail = urlParams.get('email');
    const fromEmail = urlParams.get('from') === 'email';

    // Debug: Check what came through
    console.log('URL Params:', {
        token_present: !!verToken,
        email_present: !!verEmail,
        from_email: fromEmail
    });

    // Case 1: Coming from email link
    if (fromEmail && verToken) {
        try {
            const { error } = await client.auth.verifyOtp({
                verEmail,
                verToken,
                type: 'signup'
            });

            if (error) throw error;

            // Successful verification - remove query params
            window.history.replaceState({}, '', '/verified.html');
            showSuccess();
        } catch (error) {
            showError(`Verification failed: ${error.message}`);
        }
    }
    // Case 2: Direct access without token
    else {
        showInfo('Please check your email for verification link');
    }
});

function showSuccess() {
    document.body.innerHTML = `
      <div class="success-message">
        <h2>Email Verified!</h2>
        <a href="/login">Continue to Login</a>
      </div>
    `;
}
