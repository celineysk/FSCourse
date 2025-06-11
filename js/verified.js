const client = supabase.createClient('https://tvecqrnbaytkqwhzifsd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2ZWNxcm5iYXl0a3F3aHppZnNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NjI4NzksImV4cCI6MjA2NDUzODg3OX0.9p3oUwc8ed0uHz4HiobN7R4A_H6c86fsFvj2XcqLy3E')

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const email = urlParams.get('email');

    // Debug: Inspect incoming token
    console.log('[VERIFIED PAGE] Token inspection:', {
        token_exists: !!token,
        token_length: token?.length,
        email,
        full_url: window.location.href
    });

    if (token && email) {
        verifyToken(token, email);
    } else {
        console.warn('No token/email in URL');
        document.getElementById('status').textContent = 'Invalid verification link';
    }
});

async function verifyToken(token, email) {
    try {
        console.log('[DEBUG] Verifying token for:', email);

        const { error } = await client.auth.verifyOtp({
            email,
            token,
            type: 'signup'
        });

        if (error) throw error;

        console.log('[DEBUG] Verification success for:', email);
        document.getElementById('status').textContent = 'Email verified successfully!';

    } catch (error) {
        console.error('[VERIFICATION ERROR]', {
            email,
            token: token?.slice(0, 5) + '...', // Log first 5 chars for security
            error: error.message
        });

        document.getElementById('status').innerHTML = `
      Verification failed. <button onclick="location.reload()">Retry</button>
      <p>Error: ${error.message}</p>
    `;
    }
}
