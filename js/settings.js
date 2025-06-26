const client = supabase.createClient('https://tvecqrnbaytkqwhzifsd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2ZWNxcm5iYXl0a3F3aHppZnNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NjI4NzksImV4cCI6MjA2NDUzODg3OX0.9p3oUwc8ed0uHz4HiobN7R4A_H6c86fsFvj2XcqLy3E')

// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

let logUser = null;

// Check if user is logged in & Display user data anywhere
// Auth check and user data loading
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded - starting auth check');
    // Check if user is authenticated
    const { data: { user }, error } = await client.auth.getUser();
    logUser = user;
    if (!logUser) {
        window.location.href = 'login.html';
        return;
    }

    const { data: profileData , error: profileError } = await client
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
            .then(() => window.location.href = 'login.html');
    };

    logoutButtons.forEach(btn => {
        if (btn) btn.addEventListener('click', logout);
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Get all navigation buttons and content sections
    const navButtons = document.querySelectorAll('.settings-nav-btn');
    const contentSections = document.querySelectorAll('.settings-content');

    // Set first button as active by default
    navButtons[0].classList.add('bg-sky-100', 'text-sky-700');
    navButtons[0].classList.remove('hover:bg-gray-100', 'text-gray-700');

    // Add click event listeners to navigation buttons
    navButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove active styles from all buttons
            navButtons.forEach(btn => {
                btn.classList.remove('bg-sky-100', 'text-sky-700');
                btn.classList.add('hover:bg-gray-100', 'text-gray-700');
            });

            // Add active styles to clicked button
            this.classList.add('bg-sky-100', 'text-sky-700');
            this.classList.remove('hover:bg-gray-100', 'text-gray-700');

            // Hide all content sections
            contentSections.forEach(section => {
                section.classList.add('md:hidden');
            });

            // Show the selected content section
            const sectionId = this.getAttribute('data-section') + '-section';
            document.getElementById(sectionId).classList.remove('md:hidden');
        });
    });
});

//Display Name Settings
const disNameForm = document.getElementById('disNameForm');
const changePwForm = document.getElementById('changePwForm');

disNameForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const disName = document.getElementById('disName').value.trim();

    try {
        if (!logUser?.email) {
            console.log('error');
        }
        const { error: insertError } = await client
            .from('Profiles')
            .update({ displayName: disName })
            .eq('email', logUser.email);

        if (insertError) throw insertError;

        alert('Display Name changed successfully!');
        window.location.href = 'settings.html';
    } catch (error) {
        console.log('Error encountered: ', error);
        alert('Error encountered: ', error);

    }
});

changePwForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const currentPassword = document.getElementById('curPw').value;
    const newPassword = document.getElementById('newPw').value;
    const confirmPassword = document.getElementById('conNewPw').value;

    // Validation
    if (newPassword !== confirmPassword) {
       alert("Passwords don't match");
        return;
    }

    if (newPassword.length < 8) {
        alert("Password must be at least 8 characters");
        return;
    }

    try {
        // Step 1: Reauthenticate user
        const { error: authError } = await client.auth.signInWithPassword({
            email: logUser.email,
            password: currentPassword
        });

        if (authError) throw authError;

        // Step 2: Update password
        const { error: updateError } = await client.auth.updateUser({
            password: newPassword
        });

        if (updateError) throw updateError;

        // Success
        alert('Password updated successfully!');
        e.target.reset();

    } catch (error) {
        alert('Error updating Password: ', error);
        console.error("Password change error:", error);
    }
});