const client = supabase.createClient('https://tvecqrnbaytkqwhzifsd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2ZWNxcm5iYXl0a3F3aHppZnNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NjI4NzksImV4cCI6MjA2NDUzODg3OX0.9p3oUwc8ed0uHz4HiobN7R4A_H6c86fsFvj2XcqLy3E')

// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Auth check and UI update
document.addEventListener('DOMContentLoaded', async () => {
    // Check auth status
    debugger;
    const { data: { user: logUser }, error } = await client.auth.getUser();
    if (logUser) {
        const { data: profileData, error: profileError } = await client
            .from('Profiles')
            .select('displayName')
            .eq('email', logUser.email)
            .single();
        console.log(profileData.displayName);

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
    } else {
        document.getElementById('logged-out-buttons').classList.remove('hidden');
        document.getElementById('logged-in-profile').classList.add('md:hidden');
        document.getElementById('mobile-logged-out-buttons').classList.remove('hidden');
        document.getElementById('mobile-dash-set').classList.add('hidden');
        document.getElementById('mobile-logged-in-profile').classList.add('hidden');
        document.getElementById('mobile-index-logout-button').classList.add('hidden');
    }
});