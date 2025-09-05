// Main Content Automation Script
// Coordinates all modules and handles initialization

// Add immediate event listeners without waiting for DOMContentLoaded
(function() {
    // Try to set up event listeners immediately and also on DOM ready
    function setupDayCardListeners() {
        const dayCards = document.querySelectorAll('.day-card');
        
        dayCards.forEach((card) => {
            card.addEventListener('click', function(e) {
                if (window.selectDay) {
                    window.selectDay(this.dataset.day);
                } else if (window.SocialMedia && window.SocialMedia.selectDay) {
                    window.SocialMedia.selectDay(this.dataset.day);
                }
            });
        });
    }
    
    // Try immediately
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupDayCardListeners);
    } else {
        setupDayCardListeners();
    }
    
    // Also try after a short delay
    setTimeout(setupDayCardListeners, 500);
})();

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all modules
    initializeApp();
    
    // Load saved API key if available
    loadSavedApiKey();
    
    // Set up auto-save for API key
    setupApiKeyAutoSave();
});

// Main initialization function
function initializeApp() {
    // Initialize social media templates
    if (window.SocialMedia) {
        window.SocialMedia.initializeDayTemplates();
        window.SocialMedia.initializeRestaurantData();
        window.SocialMedia.setupSocialMediaEventListeners();
    }
    
    // Set default tab
    showTab('social-media');
    
    // Set up event listeners with delay to ensure DOM is ready
    setTimeout(() => {
        setupEventListeners();
        setupContentTypeListeners();
    }, 100);
    

}

// Set up global event listeners
function setupEventListeners() {
    // Day card selection
    const dayCards = document.querySelectorAll('.day-card');
    
    if (dayCards.length === 0) {
        console.error('No day cards found! Check if elements exist.');
    }
    
    dayCards.forEach((card) => {
        card.addEventListener('click', function(e) {
            selectDay(this.dataset.day);
        });
    });

    // Content type checkboxes
    const socialMediaCheckbox = document.getElementById('generateSocialMedia');
    const adsCheckbox = document.getElementById('generateAds');
    
    if (socialMediaCheckbox && adsCheckbox) {
        socialMediaCheckbox.addEventListener('change', updateGenerateButtonText);
        adsCheckbox.addEventListener('change', updateGenerateButtonText);
    }
    
    // API key input
    const apiKeyInput = document.getElementById('geminiApiKey');
    if (apiKeyInput) {
        apiKeyInput.addEventListener('input', debounce(saveApiKey, 500));
    }
}

// Update generate button text based on selections
function updateGenerateButtonText() {
    const generateSocialMedia = document.getElementById('generateSocialMedia').checked;
    const generateAds = document.getElementById('generateAds').checked;
    const generateButton = document.querySelector('button[onclick="generateContent()"]');
    
    if (!generateButton) return;
    
    if (generateSocialMedia && generateAds) {
        generateButton.textContent = '🚀 Generate All Content';
    } else if (generateSocialMedia) {
        generateButton.textContent = '📱 Generate Social Media Posts';
    } else if (generateAds) {
        generateButton.textContent = '🎯 Generate Ad Content';
    } else {
        generateButton.textContent = '🚀 Generate Content (Select Type First)';
    }
}

// API key management
function loadSavedApiKey() {
    const savedKey = localStorage.getItem('geminiApiKey');
    if (savedKey) {
        const apiKeyInput = document.getElementById('geminiApiKey');
        if (apiKeyInput) {
            apiKeyInput.value = savedKey;
        }
    }
    
    // Also load Replicate API key
    const savedReplicateKey = localStorage.getItem('replicateApiKey');
    if (savedReplicateKey) {
        const replicateApiKeyInput = document.getElementById('replicateApiKey');
        if (replicateApiKeyInput) {
            replicateApiKeyInput.value = savedReplicateKey;
        }
    }
}

function setupApiKeyAutoSave() {
    const apiKeyInput = document.getElementById('geminiApiKey');
    if (apiKeyInput) {
        apiKeyInput.addEventListener('input', debounce(saveApiKey, 500));
    }
    
    // Auto-save Replicate API key
    const replicateApiKeyInput = document.getElementById('replicateApiKey');
    if (replicateApiKeyInput) {
        replicateApiKeyInput.addEventListener('input', function() {
            localStorage.setItem('replicateApiKey', this.value);
        });
    }
}

function saveApiKey() {
    const apiKey = document.getElementById('geminiApiKey').value;
    if (apiKey) {
        localStorage.setItem('geminiApiKey', apiKey);
    }
}

// Setup content type checkbox listeners to update button text
function setupContentTypeListeners() {
    const socialMediaCheckbox = document.getElementById('generateSocialMedia');
    const adsCheckbox = document.getElementById('generateAds');
    const generateButton = document.querySelector('button[onclick="generateContent()"]');
    
    function updateButtonText() {
        const socialChecked = socialMediaCheckbox?.checked;
        const adsChecked = adsCheckbox?.checked;
        
        if (socialChecked && adsChecked) {
            generateButton.textContent = '🚀 Generate All Content';
        } else if (socialChecked) {
            generateButton.textContent = '📱 Generate Social Media';
        } else if (adsChecked) {
            generateButton.textContent = '🎯 Generate Ad Content';
        } else {
            generateButton.textContent = '🚀 Generate Content';
        }
    }
    
    // Add event listeners
    socialMediaCheckbox?.addEventListener('change', updateButtonText);
    adsCheckbox?.addEventListener('change', updateButtonText);
    
    // Initial update
    updateButtonText();
}

// Global functions that are called from HTML
// These delegate to the appropriate modules

function switchTab(tabName) {
    showTab(tabName);
}

function showTab(tabName) {
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
}

function selectDay(day) {

    // Update global state first
    window.selectedDay = day;
    
    if (window.SocialMedia && window.SocialMedia.selectDay) {
        window.SocialMedia.selectDay(day);
        // Sync state after module call
        window.updateGlobalState();
    } else {

        // Fallback if module not loaded
        
        // Update UI to show selected day
        document.querySelectorAll('.day-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Add selected class to the appropriate card
        const targetCard = document.querySelector(`[data-day="${day}"]`);
        if (targetCard) {
            targetCard.classList.add('selected');
        }
    }
}

function generateContent() {
    if (window.SocialMedia && window.SocialMedia.generateContent) {
        window.SocialMedia.generateContent();
    } else {
        console.error('SocialMedia module or generateContent function not available');
        alert('Social media module not loaded properly. Please refresh the page.');
    }
}

function selectTemplate(templateId) {
    if (window.BlogGenerator) {
        window.BlogGenerator.selectTemplate(templateId);
    }
}

function generateBlogPost() {
    if (window.BlogGenerator) {
        window.BlogGenerator.generateBlogPost();
    }
}

function showDietSelectionModal() {
    if (window.RecipeGenerator) {
        window.RecipeGenerator.showDietSelectionModal();
    }
}

function closeDietModal() {
    if (window.RecipeGenerator) {
        window.RecipeGenerator.closeDietModal();
    }
}

function generateRecipeWithDiet() {
    if (window.RecipeGenerator) {
        window.RecipeGenerator.generateRecipeWithDiet();
    }
}

function selectRestaurant(restaurant) {
    if (window.SocialMedia && window.SocialMedia.selectRestaurant) {
        window.SocialMedia.selectRestaurant(restaurant);
    } else {

        const restaurantNameInput = document.getElementById('restaurantName');
        if (restaurantNameInput) {
            restaurantNameInput.value = restaurant;
        }
    }
}

function selectZip(zip) {
    if (window.SocialMedia && window.SocialMedia.selectZip) {
        window.SocialMedia.selectZip(zip);
    } else {

        const zipCodeInput = document.getElementById('zipCode');
        if (zipCodeInput) {
            zipCodeInput.value = zip;
        }
    }
}

// Extract image descriptions and generate with Replicate AI
async function extractAndGenerateImages(content, postTitle) {
    const imageUrls = [];
    let updatedContent = content;
    let imageIndex = 1;
    
    // Debug: Show that function is being called
    console.log('🔍 extractAndGenerateImages called with:', { postTitle, contentLength: content.length });
    
    // Create elegant progress indicator
    const progressElement = document.createElement('div');
    progressElement.style.cssText = 'position: fixed; top: 20px; right: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 20px; z-index: 9999; border-radius: 12px; max-width: 320px; font-size: 13px; box-shadow: 0 8px 32px rgba(0,0,0,0.3); backdrop-filter: blur(10px);';
    progressElement.innerHTML = '🎨 <strong>Generating AI Images...</strong>';
    document.body.appendChild(progressElement);
    
    if (window.Utils) {
        window.Utils.showSuccess('🔍 Starting image generation process...');
    }
    
    // Get Replicate API key
    const replicateApiKey = document.getElementById('replicateApiKey')?.value;
    if (!replicateApiKey) {
        console.warn('Replicate API key not found. Images will not be generated.');
        progressElement.innerHTML = '❌ <strong>API Key Required</strong><br><small>Please add your Replicate API key</small>';
        if (window.Utils) {
            window.Utils.showError('⚠️ Replicate API key required for image generation. Please add it in the Social Media tab.');
        }
        return {
            images: [],
            updatedContent: updatedContent
        };
    }
    
    progressElement.innerHTML = '✅ <strong>API Key Validated</strong><br><small>Preparing image generation...</small>';
    
    // Clean up any old RECIPE_IMAGE_SEARCH placeholders first
    if (content.includes('[RECIPE_IMAGE_SEARCH:')) {
        console.log('🧹 Cleaning up old RECIPE_IMAGE_SEARCH placeholders');
        content = content.replace(/\[RECIPE_IMAGE_SEARCH:\s*([^\]]+)\]/g, '');
        updatedContent = content;
    }
    
    // Find all image description placeholders
    const imagePattern = /\[IMAGE:\s*([^\]]+)\]/g;
    const matches = [...content.matchAll(imagePattern)];
    
    progressElement.innerHTML = `🔍 <strong>Found ${matches.length} Images</strong><br><small>Starting AI generation...</small>`;
    
    if (matches.length === 0) {
        console.log('No image placeholders found in content');
        progressElement.innerHTML = '❌ <strong>No Images Found</strong><br><small>Blog post has no image placeholders</small>';
        if (window.Utils) {
            window.Utils.showError('⚠️ No [IMAGE: ...] placeholders found in generated content. Images may not be included in the blog template.');
        }
        return {
            images: [],
            updatedContent: updatedContent
        };
    }
    
    console.log(`🎨 Found ${matches.length} image placeholders, generating with Replicate AI...`);
    progressElement.innerHTML = `🎨 <strong>Generating ${matches.length} Images</strong><br><small>Creating beautiful food photos...</small>`;
    
    if (window.Utils) {
        window.Utils.showSuccess(`🎨 Generating ${matches.length} AI images for your recipe...`);
    }
    
    for (const match of matches) {
        const description = match[1].trim()
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .replace(/&[^;]+;/g, ''); // Remove HTML entities
        const placeholder = match[0];
        
        try {
            // Create enhanced prompt for food photography
            const enhancedPrompt = `Professional food photography: ${description}, beautiful plating, natural lighting, vibrant colors, 4k detail, photorealistic, mouth-watering, restaurant quality presentation, crisp details`;
            
            const negativePrompt = "(((text))), (((words))), (((writing))), (((letters))), (((captions))), (((labels))), (((watermarks))), (((signatures))), (((logos))), (((fonts))), (((characters))), (((typography))), (((alphabet))), low quality, blurry, dark, amateur photography, cartoon, illustration, anime, manga, fake, artificial, synthetic, people, hands, faces";
            
            const requestBody = {
                version: "131d9e185621b4b4d349fd262e363420a6f74081d8c27966c9c5bcf120fa3985", // FLUX Schnell
                input: {
                    prompt: enhancedPrompt,
                    negative_prompt: negativePrompt,
                    num_outputs: 1,
                    seed: Math.floor(Math.random() * 1000000),
                    guidance_scale: 9,
                    negative_guidance_scale: 12,
                    go_fast: false,
                    aspect_ratio: "16:9",
                    format: "jpeg",
                    quality: 95
                }
            };
            
            console.log(`🎨 Generating image ${imageIndex}: ${description}`);
            progressElement.innerHTML = `🎨 <strong>Image ${imageIndex}/${matches.length}</strong><br><small>${description.substring(0, 40)}...</small>`;
            
            // Try your Render backend URL first
            const backendUrl = 'https://perfectplate-backend.onrender.com'; // Replace with your actual Render URL
            
            const response = await fetch(`${backendUrl}/api/replicate/predictions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    apiKey: replicateApiKey,
                    version: requestBody.version,
                    input: requestBody.input
                })
            });
            
            // Backend response logged to console only
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Replicate API Error:', errorText);
                progressElement.innerHTML = `❌ <strong>Error Image ${imageIndex}</strong><br><small>API returned ${response.status}</small>`;
                throw new Error(`Replicate API error: ${response.status}`);
            }
            
            const prediction = await response.json();
            console.log(`📤 Image ${imageIndex} generation started:`, prediction.id);
            progressElement.innerHTML = `⏳ <strong>Processing Image ${imageIndex}</strong><br><small>Waiting for AI to finish...</small>`;
            
            let result = null;
            if (window.Utils && window.Utils.pollReplicatePrediction) {
                
                // Poll for completion using backend (FIXED!)
                try {
                    result = await window.Utils.pollReplicatePrediction(prediction.id, replicateApiKey);
                    console.log(`🔍 Debug - Full result for image ${imageIndex}:`, result);
                    progressElement.innerHTML = `✅ <strong>Image ${imageIndex} Complete</strong><br><small>Processing next image...</small>`;
                } catch (pollError) {
                    progressElement.innerHTML = `❌ <strong>Image ${imageIndex} Failed</strong><br><small>${pollError.message}</small>`;
                    console.error('Polling error:', pollError);
                    // Use placeholder as fallback
                    const foodPlaceholders = [
                        'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop',
                        'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
                        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop',
                        'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop',
                        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop'
                    ];
                    result = [foodPlaceholders[imageIndex % foodPlaceholders.length]];
                    // Fallback placeholder used
                }
            } else {
                progressElement.innerHTML = `❌ <strong>System Error</strong><br><small>Polling function unavailable</small>`;
                throw new Error('Polling function not available');
            }
            
            console.log(`🔍 Debug - Result type:`, typeof result);
            console.log(`🔍 Debug - Is array:`, Array.isArray(result));
                
                // Handle both object format {output: [url]} and direct array format [url]
                let imageUrl = null;
                if (Array.isArray(result) && result.length > 0) {
                    // Direct array format
                    imageUrl = result[0];
                    console.log(`✅ Image ${imageIndex} generated successfully (direct array format)`);
                } else if (result && result.output && result.output[0]) {
                    // Object format with output property
                    imageUrl = result.output[0];
                    console.log(`✅ Image ${imageIndex} generated successfully (object format)`);
                }
                
                if (imageUrl) {
                    console.log(`🔍 Debug - Using image URL:`, imageUrl);
                    
                    // Download the generated image
                    console.log(`🔍 Debug - Attempting to fetch image URL:`, imageUrl);
                    
                    const imageResponse = await fetch(imageUrl, { 
                        mode: 'cors',
                        headers: {
                            'Accept': 'image/*'
                        }
                    });
                    
                    console.log(`🔍 Debug - Image fetch response status:`, imageResponse.status);
                    
                    if (imageResponse.ok) {
                        const blob = await imageResponse.blob();
                        const localImageName = `${postTitle.toLowerCase()
                            .replace(/[^a-z0-9\s-]/g, '')
                            .trim()
                            .replace(/\s+/g, '-')
                            .replace(/-+/g, '-')
                            .replace(/^-|-$/g, '')}-${imageIndex}.jpg`;
                        
                        // Configurable asset path - adjust based on your server structure
                        // "../assets/" = blog files in subfolder, assets at parent level
                        // "assets/" = blog files and assets at same level  
                        // "/assets/" = absolute path from domain root
                        const assetPath = "../assets/"; // ← CHANGE THIS IF NEEDED
                        
                        imageUrls.push({
                            originalUrl: imageUrl,
                            localPath: `${assetPath}${localImageName}`,
                            filename: localImageName,
                            blob: blob,
                            alt: description,
                            description: description
                        });
                        
                        // For preview: Use original Replicate URL so images display immediately
                        // For download: HTML will be updated to use local paths
                        const imageTag = `
                            <div class="image-container" style="position: relative; margin: 20px 0;">
                                <img src="${imageUrl}" alt="${description}" style="width: 100%; border-radius: 10px;" data-local-src="${assetPath}${localImageName}" data-image-description="${description}" data-image-index="${imageIndex}">
                                <button onclick="regenerateImage(${imageIndex}, '${description.replace(/'/g, "\\'")}', this)" class="regenerate-btn" style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.7); color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; z-index: 10; transition: all 0.2s ease; opacity: 0.8;" onmouseover="this.style.opacity='1'; this.style.background='rgba(0,0,0,0.9)'" onmouseout="this.style.opacity='0.8'; this.style.background='rgba(0,0,0,0.7)'">
                                    🔄 Regenerate
                                </button>
                            </div>`;
                        
                        console.log(`🔄 Replacing placeholder "${placeholder.substring(0, 50)}..." with image container`);
                        
                        updatedContent = updatedContent.replace(placeholder, imageTag);
                        
                        // Verify replacement worked
                        if (!updatedContent.includes(placeholder)) {
                            console.log(`✅ Successfully replaced placeholder ${imageIndex}`);
                        } else {
                            console.warn(`❌ Failed to replace placeholder ${imageIndex}`);
                        }
                        
                        imageIndex++;
                    } else {
                        console.warn('Failed to download generated image:', imageUrl);
                        // Remove placeholder if image generation failed
                        updatedContent = updatedContent.replace(placeholder, '');
                    }
                } else {
                    console.warn('Failed to generate image for:', description);
                    console.warn('🔍 Debug - No valid image URL found in result:', result);
                    // Remove placeholder if image generation failed
                    updatedContent = updatedContent.replace(placeholder, '');
                }
        } catch (error) {
            console.error('Error generating image for:', description);
            console.error('🔍 Debug - Full error details:', error);
            console.error('🔍 Debug - Error stack:', error.stack);
            
            progressElement.innerHTML = `💥 <strong>Error Image ${imageIndex}</strong><br><small>${error.message}</small>`;
            
            // Remove placeholder if image generation failed
            updatedContent = updatedContent.replace(placeholder, '');
        }
    }
    
    // Check for any remaining unprocessed placeholders
    const remainingPlaceholders = [...updatedContent.matchAll(imagePattern)];
    if (remainingPlaceholders.length > 0) {
        console.warn('🔍 Debug - Remaining unprocessed placeholders:', remainingPlaceholders);
        // Clean up any remaining placeholders
        for (const match of remainingPlaceholders) {
            updatedContent = updatedContent.replace(match[0], '');
        }
    }
    
    if (window.Utils) {
        window.Utils.showSuccess(`✅ Generated ${imageUrls.length} AI images successfully!`);
    }
    
    console.log('🔍 Debug - Final updated content length:', updatedContent.length);
    console.log('🔍 Debug - Generated images count:', imageUrls.length);
    
    // Show completion and auto-remove progress indicator
    progressElement.innerHTML = `🎉 <strong>Complete!</strong><br><small>Generated ${imageUrls.length} images</small>`;
    setTimeout(() => {
        if (progressElement.parentNode) {
            progressElement.remove();
        }
    }, 3000);
    
    return {
        images: imageUrls,
        updatedContent: updatedContent
    };
}

// Global function for downloading individual recipe images
function downloadRecipeImage(index) {
    if (window.currentPostImages && window.currentPostImages[index]) {
        const imageData = window.currentPostImages[index];
        const url = URL.createObjectURL(imageData.blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = imageData.filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Global function for regenerating individual images
async function regenerateImage(imageIndex, description, buttonElement) {
    console.log(`🔄 Regenerating image ${imageIndex}: ${description}`);
    
    // Update button to show loading state
    const originalText = buttonElement.textContent;
    buttonElement.textContent = '⏳ Generating...';
    buttonElement.disabled = true;
    buttonElement.style.background = 'rgba(255,165,0,0.8)';
    
    try {
        // Get API key
        const replicateApiKey = document.getElementById('replicateApiKey')?.value;
        if (!replicateApiKey) {
            throw new Error('Replicate API key not found');
        }
        
        // Create progress indicator
        const progressElement = document.createElement('div');
        progressElement.style.cssText = 'position: fixed; top: 20px; right: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 20px; z-index: 9999; border-radius: 12px; max-width: 320px; font-size: 13px; box-shadow: 0 8px 32px rgba(0,0,0,0.3); backdrop-filter: blur(10px);';
        progressElement.innerHTML = `🎨 <strong>Regenerating Image ${imageIndex}</strong><br><small>${description.substring(0, 40)}...</small>`;
        document.body.appendChild(progressElement);
        
        // Call Replicate API
        const backendUrl = 'https://perfectplate-backend.onrender.com';
        const response = await fetch(`${backendUrl}/api/replicate/predictions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                apiKey: replicateApiKey,
                version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
                input: {
                    prompt: description,
                    width: 1024,
                    height: 768,
                    num_outputs: 1,
                    scheduler: "K_EULER",
                    num_inference_steps: 50,
                    guidance_scale: 7.5,
                    quality: 95
                }
            })
        });
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const prediction = await response.json();
        console.log(`📤 Image ${imageIndex} regeneration started:`, prediction.id);
        
        // Poll for completion
        progressElement.innerHTML = `⏳ <strong>Processing Image ${imageIndex}</strong><br><small>Waiting for AI to finish...</small>`;
        
        const result = await window.Utils.pollReplicatePrediction(prediction.id, replicateApiKey);
        
        if (result && result.length > 0) {
            const newImageUrl = result[0];
            console.log(`✅ Image ${imageIndex} regenerated:`, newImageUrl);
            
            // Update the image in the preview
            const imgElement = buttonElement.parentElement.querySelector('img');
            if (imgElement) {
                imgElement.src = newImageUrl;
                
                // Update the stored image data
                if (window.currentPostImages && window.currentPostImages[imageIndex - 1]) {
                    // Download new image and update stored data
                    try {
                        const imageResponse = await fetch(newImageUrl);
                        const blob = await imageResponse.blob();
                        
                        window.currentPostImages[imageIndex - 1] = {
                            ...window.currentPostImages[imageIndex - 1],
                            url: newImageUrl,
                            blob: blob
                        };
                        
                        console.log(`✅ Updated stored image data for image ${imageIndex}`);
                    } catch (downloadError) {
                        console.warn('Failed to download regenerated image for storage:', downloadError);
                    }
                }
                
                // Update the blog content with new image URL
                if (window.generatedBlogContent) {
                    window.generatedBlogContent.content = window.generatedBlogContent.content.replace(
                        imgElement.getAttribute('data-original-src') || imgElement.src,
                        newImageUrl
                    );
                }
            }
            
            progressElement.innerHTML = `🎉 <strong>Image ${imageIndex} Complete!</strong><br><small>Successfully regenerated</small>`;
            setTimeout(() => {
                if (progressElement.parentNode) {
                    progressElement.remove();
                }
            }, 3000);
            
        } else {
            throw new Error('No image generated');
        }
        
    } catch (error) {
        console.error('Error regenerating image:', error);
        
        // Show error in progress indicator
        const progressElement = document.querySelector('[style*="position: fixed"][style*="top: 20px"][style*="right: 20px"]');
        if (progressElement) {
            progressElement.innerHTML = `❌ <strong>Regeneration Failed</strong><br><small>${error.message}</small>`;
            setTimeout(() => {
                if (progressElement.parentNode) {
                    progressElement.remove();
                }
            }, 5000);
        }
    } finally {
        // Restore button state
        buttonElement.textContent = originalText;
        buttonElement.disabled = false;
        buttonElement.style.background = 'rgba(0,0,0,0.7)';
    }
}

// Publish blog post directly to website (enhanced from original script)
async function publishBlogPost() {
    if (!window.generatedBlogContent) {
        alert('No blog post to publish!');
        return;
    }

    const publishBtn = document.getElementById('publishBlogBtn') || document.querySelector('[onclick*="publishBlogPost"]');
    let originalText = 'Publish Blog Post';
    if (publishBtn) {
        originalText = publishBtn.innerHTML;
        publishBtn.innerHTML = '⏳ Publishing...';
        publishBtn.disabled = true;
    }

    try {
        // Get current blog details from generated content
        const { title, category, keywords, date } = window.generatedBlogContent;
        let content = window.generatedBlogContent.content;
        
        // Extract image descriptions and generate with Replicate AI
        const imageData = await extractAndGenerateImages(content, title);
        content = imageData.updatedContent;
        
        // Update the global content with processed images so preview shows them
        window.generatedBlogContent.content = content;
        
        // Update the blog preview display
        if (document.getElementById('previewContent')) {
            document.getElementById('previewContent').innerHTML = content;
        }
        
        // Create filename - no truncation for better SEO
        const filename = title.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-') // Remove duplicate dashes
            .replace(/^-|-$/g, ''); // Remove leading/trailing dashes

        // Extract excerpt from content (first paragraph)
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        const firstParagraph = tempDiv.querySelector('p');
        const excerpt = firstParagraph ? 
            firstParagraph.textContent.substring(0, 200) + '...' : 
            'New blog post from PerfectPlate';

        // Estimate read time
        const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
        const readTime = Math.max(1, Math.ceil(wordCount / 200)) + ' min read';

        // Create new post object for posts.json
        const newPost = {
            id: filename,
            title: title,
            excerpt: excerpt,
            category: category,
            date: date || new Date().toISOString().split('T')[0],
            author: 'PerfectPlate Team',
            featured: false,
            published: true,
            filename: filename + '.html',
            keywords: keywords.split(',').map(k => k.trim()).filter(k => k),
            readTime: readTime
        };

        // Show success message with detailed instructions
        const message = document.createElement('div');
        message.className = 'success';
        
        let imageInstructions = '';
        if (imageData.images.length > 0) {
            imageInstructions = `
            <br>3. Download and save these images to your /blog/assets/ directory:
            <div style="margin: 10px 0;">
                ${imageData.images.map((img, index) => 
                    `<div style="margin: 5px 0; padding: 8px; background: #fff; border: 1px solid #ddd; border-radius: 4px;">
                        <strong>${img.filename}</strong> - ${img.alt}
                        <button onclick="downloadRecipeImage(${index})" style="margin-left: 10px; background: #007cba; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 11px;">📥 Download</button>
                    </div>`
                ).join('')}
            </div>`;
        }
        
        message.innerHTML = `
            ✅ Blog post prepared for publishing! 
            <br><br>
            <strong>Next Steps:</strong>
            <br>1. Save the HTML file: "${filename}.html" to your /blog/ directory
            <br>2. Add this JSON to your posts.json file:${imageInstructions}
            <br><br>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: left; font-family: monospace; font-size: 12px; white-space: pre-wrap; overflow-x: auto; max-height: 300px; overflow-y: auto;">${JSON.stringify(newPost, null, 2)}</div>
            <br>
            <small>💡 Copy the JSON above and add it to the "posts" array in your /blog/posts.json file</small>
        `;
        message.style.display = 'block';
        message.style.marginTop = '15px';
        
        // Find or create a container for the message
        const blogPreview = document.getElementById('blogPreview');
        if (blogPreview) {
            blogPreview.appendChild(message);
        } else {
            // Fallback: append to body or current container
            document.body.appendChild(message);
        }
        
        // Store image data globally for download functionality
        window.currentPostImages = imageData.images;

        // Add copy JSON button
        const copyJsonButton = document.createElement('button');
        copyJsonButton.textContent = '📋 Copy JSON';
        copyJsonButton.style.cssText = `
            background: #28a745;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 15px;
            font-size: 14px;
            font-weight: bold;
            width: 100%;
            display: block;
        `;
        copyJsonButton.onclick = () => {
            const jsonText = JSON.stringify(newPost, null, 2);
            navigator.clipboard.writeText(jsonText).then(() => {
                // Show success feedback
                const originalText = copyJsonButton.textContent;
                const originalBackground = copyJsonButton.style.background;
                copyJsonButton.textContent = '✅ Copied!';
                copyJsonButton.style.background = '#17a2b8';
                setTimeout(() => {
                    copyJsonButton.textContent = originalText;
                    copyJsonButton.style.background = originalBackground;
                }, 2000);
            }).catch(err => {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = jsonText;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                // Show success feedback
                const originalText = copyJsonButton.textContent;
                const originalBackground = copyJsonButton.style.background;
                copyJsonButton.textContent = '✅ Copied!';
                copyJsonButton.style.background = '#17a2b8';
                setTimeout(() => {
                    copyJsonButton.textContent = originalText;
                    copyJsonButton.style.background = originalBackground;
                }, 2000);
            });
        };
        
        if (blogPreview) {
            blogPreview.appendChild(copyJsonButton);
        } else {
            document.body.appendChild(copyJsonButton);
        }

        // Add manual download button - NO auto-download to prevent page refresh issues
        const downloadButton = document.createElement('button');
        downloadButton.textContent = '📥 Download HTML File';
        downloadButton.style.cssText = `
            background: #007cba;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 15px;
            font-size: 14px;
            font-weight: bold;
            width: 100%;
            display: block;
        `;
        downloadButton.onclick = () => {
            if (typeof downloadBlogPost === 'function') {
                // Store original state
                const originalText = downloadButton.textContent;
                const originalBackground = downloadButton.style.background;
                
                console.log('🐛 MAIN.JS DOWNLOAD CLICKED - Original:', originalText, originalBackground);
                console.log('🔍 Current content has placeholders:', window.generatedBlogContent.content.includes('[IMAGE:'));
                console.log('🔍 Current content has replicate URLs:', window.generatedBlogContent.content.includes('replicate.delivery'));
                
                // Show temporary downloading state
                downloadButton.textContent = '⏳ Downloading...';
                downloadButton.style.background = '#ffc107';
                downloadButton.disabled = true;
                
                // Ensure we use the processed content for download
                if (content !== window.generatedBlogContent.content) {
                    console.log('🔄 Updating global content before download');
                    window.generatedBlogContent.content = content;
                }
                
                // Trigger download
                downloadBlogPost();
                
                // Reset button after brief delay (whether download succeeded or was cancelled)
                setTimeout(() => {
                    console.log('🐛 MAIN.JS DOWNLOAD TIMEOUT - Resetting button');
                    downloadButton.textContent = originalText;
                    downloadButton.style.background = originalBackground;
                    downloadButton.disabled = false;
                }, 2000);
            } else {
                alert('Download function not available. Please ensure blog-generator.js is loaded.');
            }
        };
        
        if (blogPreview) {
            blogPreview.appendChild(downloadButton);
        } else {
            document.body.appendChild(downloadButton);
        }

    } catch (error) {
        console.error('Error publishing blog post:', error);
        const message = document.createElement('div');
        message.className = 'error';
        message.innerHTML = '❌ Error preparing blog post for publishing: ' + error.message;
        message.style.display = 'block';
        message.style.marginTop = '15px';
        message.style.color = '#dc3545';
        
        const blogPreview = document.getElementById('blogPreview');
        if (blogPreview) {
            blogPreview.appendChild(message);
        } else {
            document.body.appendChild(message);
        }
    } finally {
        if (publishBtn) {
            publishBtn.innerHTML = originalText;
            publishBtn.disabled = false;
        }
    }
}

// Utility function to debounce API key saving
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Additional utility functions
function resetForm() {
    // Reset social media form
    document.getElementById('restaurantName').value = '';
    document.getElementById('optionsCount').value = '';
    document.getElementById('surprisingDetail').value = '';
    document.getElementById('zipCode').value = '';
    
    // Reset day selection
    document.querySelectorAll('.day-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Hide content generator
    const contentGenerator = document.getElementById('contentGenerator');
    if (contentGenerator) {
        contentGenerator.classList.remove('active');
        contentGenerator.style.display = 'none';
    }
    
    // Clear results
    const generatedContent = document.getElementById('generatedContent');
    if (generatedContent) {
        generatedContent.value = '';
        generatedContent.style.display = 'none';
    }
    
    const resultsSection = document.querySelector('.results-section');
    if (resultsSection) {
        resultsSection.style.display = 'none';
    }
    
    window.selectedDay = null;
    if (window.SocialMedia) {
        window.SocialMedia.selectedDay = null;
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        if (window.Utils) {
            window.Utils.showSuccess('Copied to clipboard!');
        } else {
            alert('Copied to clipboard!');
        }
    }).catch(function(err) {
        console.error('Failed to copy: ', err);
        if (window.Utils) {
            window.Utils.showError('Failed to copy to clipboard');
        } else {
            alert('Failed to copy to clipboard');
        }
    });
}

function copyGeneratedContent() {
    const generatedContent = document.getElementById('generatedContent');
    if (generatedContent && generatedContent.value) {
        copyToClipboard(generatedContent.value);
    }
}

function copyVariation(text) {
    // Decode HTML entities back to normal text
    const decodedText = text.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
    
    navigator.clipboard.writeText(decodedText).then(function() {
        showSuccess('Text copied to clipboard!');
    }, function(err) {
        showError('Failed to copy text to clipboard');
    });
}

// Export for debugging
window.ContentAutomation = {
    initializeApp,
    loadSavedApiKey,
    saveApiKey,
    publishBlogPost,
    resetForm,
    copyToClipboard,
    copyGeneratedContent,
    copyVariation,
    testApiKey
};

// Make advanced functions globally accessible (missing from original modularization)
window.overlayScreenshotOnImage = window.Utils.overlayScreenshotOnImage;
window.pollReplicatePrediction = window.Utils.pollReplicatePrediction;

// Initialize global state management (missing from original modularization)
window.storedScreenshots = window.storedScreenshots || {};
window.generatedBlogContent = window.generatedBlogContent || null;

// Missing Global State Variables (from original script)

// Make global state accessible (selectedDay is handled by social-media module)
window.dayTemplates = {};
window.restaurantData = {};

// Comprehensive Global Function Exports (missing from original modularization)
// Core content generation functions
window.selectDay = selectDay;
window.testApiKey = testApiKey;
window.showPlatform = function(platform) {
    if (window.SocialMedia && window.SocialMedia.showPlatform) {
        window.SocialMedia.showPlatform(platform);
    }
};
window.selectRestaurant = function(restaurant) {
    if (window.SocialMedia && window.SocialMedia.selectRestaurant) {
        window.SocialMedia.selectRestaurant(restaurant);
    }
};
window.selectZip = function(zip) {
    if (window.SocialMedia && window.SocialMedia.selectZip) {
        window.SocialMedia.selectZip(zip);
    }
};
window.generateContent = function() {
    if (window.SocialMedia && window.SocialMedia.generateContent) {
        window.SocialMedia.generateContent();
    }
};

// Platform and UI functions
window.showPlatform = function(platform) {
    if (window.SocialMedia && window.SocialMedia.showPlatform) {
        window.SocialMedia.showPlatform(platform);
    }
};
window.copyToClipboard = copyToClipboard;
window.copyVariation = copyVariation;
window.resetForm = resetForm;
window.testApiKey = testApiKey;
window.downloadRecipeImage = downloadRecipeImage;

// Advanced generation functions
window.generateVisualsForAd = function(adCopy, strategyName) {
    if (window.SocialMedia && window.SocialMedia.generateVisualsForAd) {
        window.SocialMedia.generateVisualsForAd(adCopy, strategyName);
    }
};
window.generateImageWithScreenshot = function(index) {
    if (window.SocialMedia && window.SocialMedia.generateImageWithScreenshot) {
        window.SocialMedia.generateImageWithScreenshot(index);
    }
};
window.generateVideoWithScreenshots = function(index) {
    if (window.SocialMedia && window.SocialMedia.generateVideoWithScreenshots) {
        window.SocialMedia.generateVideoWithScreenshots(index);
    }
};
window.openFullSizeImage = function(imageUrl) {
    if (window.SocialMedia && window.SocialMedia.openFullSizeImage) {
        window.SocialMedia.openFullSizeImage(imageUrl);
    }
};
window.regenerateWithSameScreenshot = function(index) {
    if (window.SocialMedia && window.SocialMedia.regenerateWithSameScreenshot) {
        window.SocialMedia.regenerateWithSameScreenshot(index);
    }
};
window.analyzePerformance = function() {
    if (window.SocialMedia && window.SocialMedia.analyzePerformance) {
        window.SocialMedia.analyzePerformance();
    }
};
window.generateOptimizedContent = function() {
    if (window.SocialMedia && window.SocialMedia.generateOptimizedContent) {
        window.SocialMedia.generateOptimizedContent();
    }
};

// Update global state (missing function)
function updateGlobalState() {

    // Sync state between modules if needed
    if (window.SocialMedia) {
        window.dayTemplates = window.SocialMedia.getDayTemplates ? window.SocialMedia.getDayTemplates() : {};
        window.selectedDay = window.SocialMedia.getSelectedDay ? window.SocialMedia.getSelectedDay() : null;
    }
}

// Enhanced event listeners setup (missing function)
function setupEventListenersEnhanced() {

    // This function can be enhanced later if needed
    return true;
}

// Legacy compatibility functions
window.setupContentTypeListeners = setupContentTypeListeners;
window.setupEventListenersEnhanced = setupEventListenersEnhanced;
window.updateGlobalState = updateGlobalState;

// Missing Global UI Update Functions (from original script)
window.updateInstructions = function() {
    if (window.SocialMedia && window.SocialMedia.updateInstructions) {
        window.SocialMedia.updateInstructions();
    }
};
window.updateRestaurantSuggestions = function(day) {
    if (window.SocialMedia && window.SocialMedia.updateRestaurantSuggestions) {
        window.SocialMedia.updateRestaurantSuggestions(day);
    }
};

// Global State Synchronization (ensuring modules can access updated global state)
window.updateGlobalState = function() {
    if (window.SocialMedia) {
        window.selectedDay = window.SocialMedia.getSelectedDay ? window.SocialMedia.getSelectedDay() : selectedDay;
        window.dayTemplates = window.SocialMedia.getDayTemplates ? window.SocialMedia.getDayTemplates() : dayTemplates;
        window.restaurantData = window.SocialMedia.getRestaurantData ? window.SocialMedia.getRestaurantData() : restaurantData;
    }
};

// Main Loading System (missing from original modularization)
function showMainLoading() {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.classList.add('active');
    }
}

function hideMainLoading() {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.classList.remove('active');
    }
}

// Make loading functions globally accessible
window.showMainLoading = showMainLoading;
window.hideMainLoading = hideMainLoading;

// API Key Testing System (missing from original modularization)
async function testApiKey() {
    const apiKey = document.getElementById('geminiApiKey').value;
    
    if (!apiKey) {
        alert('Please enter your API key first');
        return;
    }
    

    
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: "Hello, this is a test. Please respond with 'API key is working!'"
                    }]
                }]
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        console.log('API key is working correctly!');
        alert('✅ API key is working correctly!');
        
    } catch (error) {
        console.error('API Key Test Error:', error);
        alert('❌ API key test failed: ' + error.message);
    }
} 