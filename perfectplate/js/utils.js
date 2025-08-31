// Utilities Module
// Handles common functions, error handling, API calls, and shared functionality

// Error and success message handling
function showError(message) {
    const container = document.createElement('div');
    container.innerHTML = `❌ ${message}`;
    container.style.cssText = `
        background: #ffebee; 
        border: 1px solid #e57373; 
        color: #c62828; 
        padding: 15px; 
        border-radius: 8px; 
        margin: 20px 0; 
        text-align: center;
    `;
    document.querySelector('.main-content').appendChild(container);
    
    // Remove after 5 seconds
    setTimeout(() => container.remove(), 5000);
}

function showSuccess(message) {
    const container = document.createElement('div');
    container.innerHTML = `✅ ${message}`;
    container.style.cssText = `
        background: #d4edda; 
        border: 1px solid #c3e6cb; 
        color: #155724; 
        padding: 15px; 
        border-radius: 8px; 
        margin: 20px 0; 
        text-align: center;
    `;
    document.querySelector('.main-content').appendChild(container);
    
    // Remove after 5 seconds
    setTimeout(() => container.remove(), 5000);
}

function showTemplateLoadingMessage(templateId) {
    const loadingMsg = document.createElement('div');
    loadingMsg.innerHTML = `🤖 Loading ${templateId} template... Please wait!`;
    loadingMsg.style.cssText = `
        background: #e3f2fd; 
        border: 1px solid #2196f3; 
        color: #1976d2; 
        padding: 15px; 
        border-radius: 8px; 
        margin: 20px 0; 
        text-align: center;
    `;
    loadingMsg.id = 'templateLoadingMsg';
    document.querySelector('.template-section').appendChild(loadingMsg);
}

function showTemplateSelectedMessage(templateId, title) {
    // Remove loading message
    const loadingMsg = document.getElementById('templateLoadingMsg');
    if (loadingMsg) loadingMsg.remove();
    
    const successMsg = document.createElement('div');
    successMsg.innerHTML = `✅ ${templateId} template loaded! Title: "${title}" - Form filled automatically.`;
    successMsg.style.cssText = `
        background: #d4edda; 
        border: 1px solid #c3e6cb; 
        color: #155724; 
        padding: 15px; 
        border-radius: 8px; 
        margin: 20px 0; 
        text-align: center;
    `;
    document.querySelector('.template-section').appendChild(successMsg);
    
    // Remove after 5 seconds
    setTimeout(() => successMsg.remove(), 5000);
}

// API utility functions
async function callGeminiAPI(prompt, apiKey) {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message || 'API Error');
        }

        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Gemini API Error:', error);
        throw error;
    }
}

// Token estimation functions
function estimateTokens(text) {
    // Rough estimation: ~4 characters per token
    return Math.ceil(text.length / 4);
}

function calculateTokenSavings(withAds, withoutAds) {
    const savingsTokens = withAds - withoutAds;
    const savingsPercent = Math.round((savingsTokens / withAds) * 100);
    return { savingsTokens, savingsPercent };
}

// Tab switching functionality
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName).style.display = 'block';
    
    // Add active class to clicked button
    document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add('active');
}

// Local storage utilities
function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.warn('Failed to save to localStorage:', error);
    }
}

function loadFromLocalStorage(key, defaultValue = null) {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
        console.warn('Failed to load from localStorage:', error);
        return defaultValue;
    }
}

// File download utilities
function downloadAsHTML(content, filename) {
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function downloadAsJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Validation utilities
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateURL(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

function sanitizeHTML(html) {
    const temp = document.createElement('div');
    temp.textContent = html;
    return temp.innerHTML;
}

// Format utilities
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Loading state management
function setLoadingState(element, isLoading, originalText = null) {
    if (isLoading) {
        element.originalText = element.innerHTML;
        element.innerHTML = '⏳ Loading...';
        element.disabled = true;
        element.style.opacity = '0.7';
        element.style.cursor = 'not-allowed';
    } else {
        element.innerHTML = originalText || element.originalText || element.innerHTML;
        element.disabled = false;
        element.style.opacity = '1';
        element.style.cursor = 'pointer';
    }
}

// Animation utilities
function fadeIn(element, duration = 300) {
    element.style.opacity = '0';
    element.style.display = 'block';
    
    let start = performance.now();
    
    function animate(timestamp) {
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        
        element.style.opacity = progress;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

function fadeOut(element, duration = 300) {
    let start = performance.now();
    const startOpacity = parseFloat(getComputedStyle(element).opacity);
    
    function animate(timestamp) {
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        
        element.style.opacity = startOpacity * (1 - progress);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            element.style.display = 'none';
        }
    }
    
    requestAnimationFrame(animate);
}

// Debounce utility for search/input optimization
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

// Copy to clipboard utility
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showSuccess('Copied to clipboard!');
        return true;
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        showError('Failed to copy to clipboard');
        return false;
    }
}

// Convert basic markdown formatting to HTML (missing from original modularization)
function convertMarkdownToHtml(content) {
    if (!content) return content;
    
    // Convert **bold** to <strong>bold</strong>
    content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert *italic* to <em>italic</em>
    content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Convert `code` to <code>code</code> (but only if not already HTML)
    content = content.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    return content;
}

// Tab switching functions (missing from original modularization)
function showTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected tab content
    const selectedContent = document.getElementById(tabName);
    if (selectedContent) {
        selectedContent.classList.add('active');
    }
    
    // Add active class to clicked tab button
    const selectedButton = document.querySelector(`[onclick="showTab('${tabName}')"]`);
    if (selectedButton) {
        selectedButton.classList.add('active');
    }
}

// Enhanced download functions (missing from original modularization)
function downloadAsHTML(content, filename) {
    const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'download.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function downloadAsJSON(data, filename) {
    const content = JSON.stringify(data, null, 2);
    const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'download.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Text processing utilities (missing from original modularization)
function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

function capitalizeFirst(str) {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// UI animation utilities (missing from original modularization)
function setLoadingState(element, isLoading) {
    if (!element) return;
    
    if (isLoading) {
        element.disabled = true;
        element.classList.add('loading');
        element.setAttribute('data-original-text', element.textContent);
        element.textContent = 'Loading...';
    } else {
        element.disabled = false;
        element.classList.remove('loading');
        const originalText = element.getAttribute('data-original-text');
        if (originalText) {
            element.textContent = originalText;
            element.removeAttribute('data-original-text');
        }
    }
}

function fadeIn(element, duration = 300) {
    if (!element) return;
    element.style.opacity = '0';
    element.style.display = 'block';
    
    let start = null;
    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        element.style.opacity = Math.min(progress / duration, 1);
        
        if (progress < duration) {
            requestAnimationFrame(animate);
        }
    }
    requestAnimationFrame(animate);
}

function fadeOut(element, duration = 300) {
    if (!element) return;
    
    let start = null;
    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        element.style.opacity = Math.max(1 - (progress / duration), 0);
        
        if (progress < duration) {
            requestAnimationFrame(animate);
        } else {
            element.style.display = 'none';
        }
    }
    requestAnimationFrame(animate);
}

// Debounce function for performance (missing from original modularization)
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

// Form validation utilities (missing from original modularization)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateURL(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// Advanced Image Processing System (missing from original modularization)
async function overlayScreenshotOnImage(baseImageUrl, base64Screenshot, title) {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size to match the generated image
        canvas.width = 1024;
        canvas.height = 1024;
        
        // Create base image
        const baseImage = new Image();
        baseImage.crossOrigin = 'anonymous';
        
        baseImage.onload = () => {
            try {
                // Draw base image
                ctx.drawImage(baseImage, 0, 0, 1024, 1024);
                
                // Create screenshot image
                const screenshotImage = new Image();
                screenshotImage.onload = () => {
                    try {
                        // Calculate screenshot dimensions and position - MUCH LARGER for better visibility
                        const screenshotWidth = 320; // Increased from 200px to 320px (31% of image width)
                        const screenshotHeight = (screenshotImage.height / screenshotImage.width) * screenshotWidth;
                        
                        // Smart positioning based on image content and concept
                        let x, y;
                        
                        // Check if this is a split-screen or comparison concept
                        const isSplitScreen = title.toLowerCase().includes('split') || 
                                            title.toLowerCase().includes('comparison') || 
                                            title.toLowerCase().includes('before') ||
                                            title.toLowerCase().includes('after');
                        
                        if (isSplitScreen) {
                            // For split-screen concepts, place screenshot on the right side to replace generic phone
                            x = 1024 - screenshotWidth - 50; // Adjusted padding for larger screenshot
                            y = (1024 - screenshotHeight) / 2; // Center vertically
                        } else {
                            // Default positioning for other concepts - bottom right but more prominent
                            x = 1024 - screenshotWidth - 30; // Reduced padding for larger screenshot
                            y = 1024 - screenshotHeight - 30; // Reduced padding for larger screenshot
                        }
                        
                        console.log('📱 Screenshot positioning:', isSplitScreen ? 'CENTER-RIGHT (split-screen)' : 'BOTTOM-RIGHT (default)');
                        
                        // Add subtle shadow for the screenshot
                        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
                        ctx.shadowBlur = 10;
                        ctx.shadowOffsetX = 0;
                        ctx.shadowOffsetY = 4;
                        
                        // Draw screenshot with rounded corners (with fallback)
                        ctx.save();
                        ctx.beginPath();
                        if (ctx.roundRect) {
                            ctx.roundRect(x, y, screenshotWidth, screenshotHeight, 4);
                        } else {
                            // Fallback for older browsers
                            ctx.rect(x, y, screenshotWidth, screenshotHeight);
                        }
                        ctx.clip();
                        ctx.drawImage(screenshotImage, x, y, screenshotWidth, screenshotHeight);
                        ctx.restore();
                        
                        // Reset shadow
                        ctx.shadowColor = 'transparent';
                        ctx.shadowBlur = 0;
                        ctx.shadowOffsetX = 0;
                        ctx.shadowOffsetY = 0;
                        
                        // Convert canvas to data URL
                        const finalImageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
                        console.log('✅ Screenshot overlay completed successfully');
                        resolve(finalImageDataUrl);
                        
                    } catch (error) {
                        console.error('❌ Error drawing screenshot:', error);
                        reject(error);
                    }
                };
                
                screenshotImage.onerror = () => {
                    console.error('❌ Error loading screenshot image');
                    reject(new Error('Failed to load screenshot image'));
                };
                
                // Load screenshot (base64 to image)
                screenshotImage.src = `data:image/jpeg;base64,${base64Screenshot}`;
                
            } catch (error) {
                console.error('❌ Error drawing base image:', error);
                reject(error);
            }
        };
        
        baseImage.onerror = () => {
            console.error('❌ Error loading base image');
            reject(new Error('Failed to load base image'));
        };
        
        // Load base image
        baseImage.src = baseImageUrl;
    });
}

// Advanced Replicate Prediction Polling System (missing from original modularization)
async function pollReplicatePrediction(predictionId, apiKey) {
    const maxAttempts = 150; // Increased from 60 to 150 (5 minutes at 2-second intervals)
    const pollInterval = 2000; // 2 seconds
    let attempts = 0;
    
    while (attempts < maxAttempts) {
        try {
            // Use backend server for polling
            const backendUrl = 'https://perfectplate-backend.onrender.com'; // Replace with your actual Render URL
            
            const response = await fetch(`${backendUrl}/api/replicate/predictions/${predictionId}`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ apiKey: apiKey })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const prediction = await response.json();
            console.log('🔄 Prediction status:', prediction.status);
            
            if (prediction.status === 'succeeded') {
                return prediction.output;
            } else if (prediction.status === 'failed') {
                throw new Error(`Image generation failed: ${prediction.error}`);
            } else if (prediction.status === 'canceled') {
                throw new Error('Image generation was canceled');
            }
            
            // Add special handling for stuck predictions
            if (attempts > 75 && prediction.status === 'starting') {
                console.log('⚠️ Prediction stuck in starting status for over 2.5 minutes, may be overloaded');
            }
            
            attempts++;
            await new Promise(resolve => setTimeout(resolve, pollInterval));
            
        } catch (error) {
            console.error('Error polling prediction:', error);
            attempts++;
            await new Promise(resolve => setTimeout(resolve, pollInterval));
        }
    }
    
    throw new Error('Prediction polling timed out after 5 minutes');
}

// Export all utilities (updated with new functions)
window.Utils = {
    showError,
    showSuccess,
    showTemplateLoadingMessage,
    showTemplateSelectedMessage,
    callGeminiAPI,
    estimateTokens,
    calculateTokenSavings,
    switchTab: showTab, // Alias for backward compatibility
    showTab,
    saveToLocalStorage,
    loadFromLocalStorage,
    downloadAsHTML,
    downloadAsJSON,
    validateEmail,
    validateURL,
    sanitizeHTML,
    formatDate,
    truncateText,
    capitalizeFirst,
    setLoadingState,
    fadeIn,
    fadeOut,
    debounce,
    copyToClipboard,
    convertMarkdownToHtml,
    overlayScreenshotOnImage,
    pollReplicatePrediction
};

// Make individual functions globally accessible
window.convertMarkdownToHtml = convertMarkdownToHtml;
window.showTab = showTab;
window.downloadAsHTML = downloadAsHTML;
window.downloadAsJSON = downloadAsJSON; 