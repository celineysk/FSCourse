// Check if user is logged in
const user = localStorage.getItem('fengshui_user');

if (!user) {
    // Redirect to login page
    window.location.href = 'login.html';
} else {
    // Update user name in header
    document.getElementById('user-name').textContent = user.split('@')[0];
    document.getElementById('mobile-user-name').textContent = user.split('@')[0];
}

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