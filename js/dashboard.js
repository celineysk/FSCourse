const client = supabase.createClient('https://tvecqrnbaytkqwhzifsd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2ZWNxcm5iYXl0a3F3aHppZnNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NjI4NzksImV4cCI6MjA2NDUzODg3OX0.9p3oUwc8ed0uHz4HiobN7R4A_H6c86fsFvj2XcqLy3E')

// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Check if user is logged in & Display user data anywhere
// Auth check and user data loading
document.addEventListener('DOMContentLoaded', async () => {

    // Check if user is authenticated
    const { data: { user: logUser }, error } = await client.auth.getUser();
    if (!logUser) {
        window.location.href = 'login.html';
        return;
    }

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

    // Load user-specific data from Supabase instead of localStorage
    //await loadPurchasedCourses(user.id);



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

    // Display purchased courses
    const purchasedCourses = JSON.parse(localStorage.getItem('fengshui_purchased_courses') || '[]');
    const myCoursesContainer = document.getElementById('my-courses-container');
    const noCoursesMessage = document.getElementById('no-courses-message');
    const courseCardTemplate = document.getElementById('course-card-template');
    const continueSection = document.getElementById('continue-learning-section');

    if (purchasedCourses.length > 0) {
        // Hide the "no courses" message
        noCoursesMessage.classList.add('hidden');

        // Show the continue learning section
        continueSection.classList.remove('hidden');

        // Display purchased courses
        purchasedCourses.forEach((course, index) => {
            // Clone the template
            const courseCard = courseCardTemplate.cloneNode(true);
            courseCard.classList.remove('hidden');

            // Update course information
            courseCard.querySelector('h3').textContent = course;

            // Generate random progress (for demo purposes)
            const progress = index === 0 ? 25 : Math.floor(Math.random() * 100);
            courseCard.querySelector('.bg-sky-blue').style.width = `${progress}%`;
            courseCard.querySelector('.text-gray-500').textContent = `Progress: ${progress}%`;

            // Add to container
            myCoursesContainer.appendChild(courseCard);
        });
    }
});

