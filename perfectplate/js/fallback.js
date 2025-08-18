// Fallback Functions for Content Automation
// Provides basic functionality if modules fail to load

// Basic tab switching fallback - only if not defined
window.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for modules to load
    setTimeout(function() {
        if (!window.showTab) {
            window.showTab = function(tabName) {
                console.log('Using fallback showTab for:', tabName);
                
                // Hide all tabs
                document.querySelectorAll('.tab-content').forEach(tab => {
                    tab.style.display = 'none';
                    tab.classList.remove('active');
                });
                
                // Remove active class from all buttons
                document.querySelectorAll('.tab-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Show selected tab
                const selectedTab = document.getElementById(tabName);
                if (selectedTab) {
                    selectedTab.style.display = 'block';
                    selectedTab.classList.add('active');
                }
                
                // Add active class to clicked button
                const activeButton = document.querySelector(`[onclick="showTab('${tabName}')"]`);
                if (activeButton) {
                    activeButton.classList.add('active');
                }
            };
        }
    }, 100);
});

// Basic day selection fallback
if (!window.selectDay) {
    window.selectDay = function(day) {
        console.log('Using fallback selectDay for:', day);
        
        // Update UI to show selected day
        document.querySelectorAll('.day-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Add selected class to clicked card (with error handling)
        try {
            const clickedCard = event.target.closest('.day-card');
            if (clickedCard) {
                clickedCard.classList.add('selected');
            }
        } catch (e) {
            console.warn('Could not update day selection UI:', e);
        }
        
        // Store selected day globally
        window.selectedDay = day;
    };
}

// Basic content generation fallback
if (!window.generateContent) {
    window.generateContent = function() {
        console.log('Using fallback generateContent');
        alert('Content generation functionality is loading. Please wait a moment and try again.');
    };
}

// Basic template selection fallback
if (!window.selectTemplate) {
    window.selectTemplate = function(templateId) {
        console.log('Using fallback selectTemplate for:', templateId);
        alert(`Template selection (${templateId}) is loading. Please wait a moment and try again.`);
    };
}

// Basic blog generation fallback
if (!window.generateBlogPost) {
    window.generateBlogPost = function() {
        console.log('Using fallback generateBlogPost');
        alert('Blog generation functionality is loading. Please wait a moment and try again.');
    };
}

// Basic recipe modal fallbacks
if (!window.showDietSelectionModal) {
    window.showDietSelectionModal = function() {
        console.log('Using fallback showDietSelectionModal');
        alert('Recipe generation functionality is loading. Please wait a moment and try again.');
    };
}

if (!window.closeDietModal) {
    window.closeDietModal = function() {
        console.log('Using fallback closeDietModal');
        const modal = document.getElementById('dietSelectionModal');
        if (modal) {
            modal.style.display = 'none';
        }
    };
}

if (!window.generateRecipeWithDiet) {
    window.generateRecipeWithDiet = function() {
        console.log('Using fallback generateRecipeWithDiet');
        alert('Recipe generation functionality is loading. Please wait a moment and try again.');
    };
}

if (!window.publishBlogPost) {
    window.publishBlogPost = function() {
        console.log('Using fallback publishBlogPost');
        alert('Blog publishing functionality is loading. Please wait a moment and try again.');
    };
}

// Fallback functions loaded 