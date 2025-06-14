const client = supabase.createClient('https://tvecqrnbaytkqwhzifsd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2ZWNxcm5iYXl0a3F3aHppZnNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NjI4NzksImV4cCI6MjA2NDUzODg3OX0.9p3oUwc8ed0uHz4HiobN7R4A_H6c86fsFvj2XcqLy3E')

// Check if user is logged in & Display user data anywhere
// Auth check and user data loading
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded - starting auth check');

    // Check if user is authenticated
    const { data: { user }, error } = await client.auth.getUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Display user info
    document.getElementById('user-name').textContent = user.email.split('@')[0];
    document.getElementById('mobile-user-name').textContent = user.email.split('@')[0];

    // Load user-specific data from Supabase instead of localStorage
    //await loadPurchasedCourses(user.id);

    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Logout functionality
    const logoutButton = document.getElementById('logout-button');
    const mobileLogoutButton = document.getElementById('mobile-logout-button');

    function logout() {
        localStorage.removeItem('fengshui_user');
        window.location.href = 'index.html';
    }

    logoutButton.addEventListener('click', logout);
    mobileLogoutButton.addEventListener('click', logout);

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

