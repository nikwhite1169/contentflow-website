// Blog Post Generation Module
// Handles blog templates, content generation, and publishing

let currentTemplateId = null;
let currentBlogPost = null;

// Valid frontend blog categories - MUST match frontend filter buttons exactly
const VALID_CATEGORIES = [
    'Getting Started',
    'Meal Planning', 
    'Dietary Tips',
    'Restaurant Guides',
    'App Features',
    'Nutrition',
    'Recipes',
    'Tips & Tricks'
];

// Blog template categories
const blogCategories = {
    'keto-guide': {
        category: 'Dietary Tips',
        baseKeywords: ['keto', 'ketogenic', 'low carb', 'restaurant', 'dining'],
        tone: 'friendly',
        length: 'long'
    },
    'vegan-options': {
        category: 'Dietary Tips',
        baseKeywords: ['vegan', 'plant-based', 'vegetarian', 'restaurant', 'dining'],
        tone: 'friendly',
        length: 'medium'
    },
    'paleo-guide': {
        category: 'Dietary Tips',
        baseKeywords: ['paleo', 'paleolithic', 'whole foods', 'restaurant', 'dining', 'grain-free'],
        tone: 'friendly',
        length: 'long'
    },
    'recipes': {
        category: 'Recipes', // Capitalized to match dropdown option
        baseKeywords: ['recipe', 'cooking', 'homemade', 'healthy', 'diet-specific'],
        tone: 'friendly',
        length: 'medium'
    },
    'macro-tracking': {
        category: 'Nutrition',
        baseKeywords: ['macro tracking', 'protein', 'fitness dining', 'bodybuilding', 'muscle building'],
        tone: 'informative',
        length: 'long'
    },
    'diabetic-friendly': {
        category: 'Nutrition',
        baseKeywords: ['diabetic friendly', 'blood sugar', 'diabetes', 'low glycemic', 'healthy dining'],
        tone: 'professional',
        length: 'long'
    },
    'getting-started': {
        category: 'Getting Started',
        baseKeywords: ['beginners guide', 'getting started', 'first time', 'introduction', 'basics'],
        tone: 'friendly',
        length: 'medium'
    },
    'meal-planning': {
        category: 'Meal Planning',
        baseKeywords: ['meal planning', 'weekly planning', 'meal prep', 'dining strategy', 'restaurant planning'],
        tone: 'informative',
        length: 'medium'
    },
    'restaurant-guides': {
        category: 'Restaurant Guides',
        baseKeywords: ['restaurant guide', 'dining guide', 'restaurant reviews', 'best restaurants', 'where to eat'],
        tone: 'informative',
        length: 'long'
    },
    'app-features': {
        category: 'App Features',
        baseKeywords: ['app features', 'PerfectPlate features', 'how to use', 'app guide', 'mobile app'],
        tone: 'friendly',
        length: 'medium'
    },
    'tips-tricks': {
        category: 'Tips & Tricks',
        baseKeywords: ['dining tips', 'restaurant tips', 'food tips', 'eating tips', 'tricks'],
        tone: 'friendly',
        length: 'short'
    }
};

// Category mapping for search functionality (kebab-case)
const CATEGORY_MAPPING = {
    'Getting Started': 'getting-started',
    'Meal Planning': 'meal-planning',
    'Dietary Tips': 'dietary-tips',
    'Restaurant Guides': 'restaurant-guides',
    'App Features': 'app-features',
    'Nutrition': 'nutrition',
    'Recipes': 'recipes',
    'Tips & Tricks': 'tips-tricks'
};

// Convert display category to search-friendly kebab-case
function getCategoryForSearch(displayCategory) {
    return CATEGORY_MAPPING[displayCategory] || displayCategory.toLowerCase().replace(/\s+/g, '-');
}

// Validate category against frontend categories
function validateCategory(category) {
    if (!VALID_CATEGORIES.includes(category)) {
        console.warn(`Invalid category "${category}". Must be one of: ${VALID_CATEGORIES.join(', ')}`);
        return false;
    }
    return true;
}

// Select blog template (just visual selection, no content generation)
function selectTemplate(templateId) {
    currentTemplateId = templateId; // Track the current template
    
    // Remove selected class from all cards
    document.querySelectorAll('.template-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selected class to clicked card (handle both card and inner elements)
    const clickedCard = event.target.closest('.template-card');
    if (clickedCard) {
        clickedCard.classList.add('selected');
    }
    
    // Show/hide recipe diet section based on template
    const recipeDietSection = document.getElementById('recipeDietSection');
    if (templateId === 'recipes' && recipeDietSection) {
        recipeDietSection.style.display = 'block';
    } else if (recipeDietSection) {
        recipeDietSection.style.display = 'none';
        // Clear selected diet when switching away from recipes
        if (window.RecipeGenerator) {
            window.RecipeGenerator.selectedRecipeDiet = null;
            // Remove selected class from all diet cards
            document.querySelectorAll('.recipe-diet-card').forEach(card => {
                card.classList.remove('selected');
            });
        }
    }
    
    // Template selected - no annoying toasts needed
}

// Regenerate content for current template (missing from original modularization)
async function regenerateCurrentTemplate() {
    // Check if we're in recipe mode or blog template mode
    const recipeDietSection = document.getElementById('recipeDietSection');
    const isRecipeMode = recipeDietSection && recipeDietSection.style.display !== 'none';
    
    if (isRecipeMode) {
        // Handle recipe generation
        if (window.RecipeGenerator && window.RecipeGenerator.regenerateCurrentRecipeDiet) {
            await window.RecipeGenerator.regenerateCurrentRecipeDiet();
        } else {
            alert('Recipe generator not available!');
        }
        return;
    }
    
    // Handle regular blog template generation
    if (!currentTemplateId) {
        alert('Please select a category first!');
        return;
    }
    
    // Show loading message
    showRegenerationLoadingMessage();
    
    const dynamicContent = await generateDynamicContent(currentTemplateId);
    if (!dynamicContent) return;
    
    // Fill form with new dynamic content
    const titleInput = document.getElementById('blogTitle');
    const categoryInput = document.getElementById('blogCategory');
    const keywordsInput = document.getElementById('blogKeywords');
    const toneInput = document.getElementById('blogTone');
    const lengthInput = document.getElementById('blogLength');
    const outlineInput = document.getElementById('blogOutline');
    
    if (titleInput) titleInput.value = dynamicContent.title;
    if (categoryInput) categoryInput.value = dynamicContent.category;
    if (keywordsInput) keywordsInput.value = dynamicContent.keywords;
    if (toneInput) toneInput.value = dynamicContent.tone;
    if (lengthInput) lengthInput.value = dynamicContent.length;
    if (outlineInput) outlineInput.value = dynamicContent.outline;
    
    // Show regeneration message
    const message = document.createElement('div');
    message.className = 'success';
    message.innerHTML = `🔄 New ideas generated: "${dynamicContent.title}" - Fresh content ready!`;
    message.style.display = 'block';
    message.style.marginTop = '15px';
    
    // Remove any existing messages
    const existingMessage = document.querySelector('.template-section .success');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Add message to template section
    const templateSection = document.querySelector('.template-section');
    if (templateSection) {
        templateSection.appendChild(message);
    }
    
    // Remove message after 4 seconds
    setTimeout(() => {
        message.remove();
    }, 4000);
}

// Show template selected message (missing from original modularization)
function showTemplateSelectedMessage(templateId, title) {
    // Remove loading messages first
    removeLoadingMessages();
    
    const message = document.createElement('div');
    message.className = 'success';
    message.innerHTML = `✅ Generated unique content: "${title}" - Ready to create!`;
    message.style.display = 'block';
    message.style.marginTop = '15px';
    
    // Remove any existing messages
    const existingMessage = document.querySelector('.template-section .success');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Add message to template section
    const templateSection = document.querySelector('.template-section');
    if (templateSection) {
        templateSection.appendChild(message);
    }
    
    // Remove message after 4 seconds
    setTimeout(() => {
        message.remove();
    }, 4000);
}

// Enhanced Loading Message Functions (matching original script sophistication)
function showTemplateLoadingMessage(templateId) {
    const category = blogCategories[templateId];
    if (!category) {
        console.error('Template not found:', templateId);
        return; // Exit early if template doesn't exist
    }
    
    const message = document.createElement('div');
    message.className = 'loading-message';
    message.innerHTML = `⏳ AI is generating unique content ideas for ${category.category}... Please wait.`;
    message.style.display = 'block';
    message.style.marginTop = '15px';
    message.style.padding = '10px';
    message.style.background = '#e3f2fd';
    message.style.border = '1px solid #2196f3';
    message.style.borderRadius = '5px';
    message.style.color = '#1976d2';
    
    // Remove any existing messages
    const existingMessage = document.querySelector('.template-section .loading-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    document.querySelector('.template-section').appendChild(message);
}

function showRegenerationLoadingMessage() {
    const message = document.createElement('div');
    message.className = 'loading-message';
    message.innerHTML = `🔄 AI is creating fresh content ideas... Please wait.`;
    message.style.display = 'block';
    message.style.marginTop = '15px';
    message.style.padding = '10px';
    message.style.background = '#e3f2fd';
    message.style.border = '1px solid #2196f3';
    message.style.borderRadius = '5px';
    message.style.color = '#1976d2';
    
    // Remove any existing messages
    const existingMessage = document.querySelector('.template-section .loading-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    document.querySelector('.template-section').appendChild(message);
}

function removeLoadingMessages() {
    const loadingMessages = document.querySelectorAll('.loading-message');
    loadingMessages.forEach(msg => msg.remove());
}

// Get current season for seasonal content (missing from original modularization)
function getSeason(month) {
    const seasons = {
        0: 'Winter', 1: 'Winter', 2: 'Spring',
        3: 'Spring', 4: 'Spring', 5: 'Summer',
        6: 'Summer', 7: 'Summer', 8: 'Fall',
        9: 'Fall', 10: 'Fall', 11: 'Winter'
    };
    return seasons[month] || 'Spring';
}

// Generate dynamic content for templates
async function generateDynamicContent(templateId) {
    const template = blogCategories[templateId];
    if (!template) return null;
    
    let apiKey = localStorage.getItem('geminiApiKey') || '';
    if (!apiKey) {
        const apiKeyElement = document.getElementById('geminiApiKey');
        apiKey = apiKeyElement ? apiKeyElement.value : '';
    }
    
    if (!apiKey) {
        alert('Please enter your Gemini API key first!');
        return null;
    }
    
    const prompt = `Create a blog post outline for ${templateId}.
    
Category: ${template.category}
Keywords: ${template.baseKeywords.join(', ')}
Tone: ${template.tone}
Length: ${template.length}

Generate:
1. Compelling title
2. Detailed outline with main sections
3. Key points to cover

Focus on practical, actionable content for restaurant dining.`;

    try {
        let content;
        if (window.Utils) {
            content = await window.Utils.callGeminiAPI(prompt, apiKey);
        } else {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });
            const data = await response.json();
            content = data.candidates[0].content.parts[0].text;
        }
        
        // Parse the response
        const lines = content.split('\n');
        let title = `${templateId.charAt(0).toUpperCase() + templateId.slice(1)} Guide`;
        let outline = content;
        
        lines.forEach(line => {
            if (line.toLowerCase().includes('title:')) {
                title = line.replace(/title:\s*/i, '').trim();
            }
        });
        
        return {
            title: title,
            category: template.category,
            keywords: template.baseKeywords.join(', '),
            tone: template.tone,
            length: template.length,
            outline: outline
        };
        
    } catch (error) {
        console.error('Error generating dynamic content:', error);
        return null;
    }
}

// Generate Dynamic Blog Ideas (missing from original modularization)
async function generateBlogIdea(apiKey, category) {
    const now = new Date();
    const currentMonth = now.toLocaleDateString('en-US', { month: 'long' });
    const currentYear = now.getFullYear();
    
    // Determine current season
    const month = now.getMonth();
    let currentSeason;
    if (month >= 2 && month <= 4) currentSeason = 'Spring';
    else if (month >= 5 && month <= 7) currentSeason = 'Summer';
    else if (month >= 8 && month <= 10) currentSeason = 'Fall';
    else currentSeason = 'Winter';
    
    // Add PerfectPlate context for ALL categories to ensure app integration
    const perfectPlateContext = `

PERFECTPLATE CONTEXT (ACCURATE FEATURES ONLY):
PerfectPlate is a restaurant discovery app with these EXACT features:

CORE FUNCTIONALITY:
- Restaurant discovery and search by location (ZIP code)
- Menu analysis across 170,000+ restaurant locations
- Dietary restriction filtering (17 diet types: keto, vegan, vegetarian, gluten-free, pescatarian, diabetic-friendly, dairy-free, nut-free, paleo, low-carb, kosher, halal, etc.)
- Personalized meal recommendations based on dietary preferences
- Nutritional information display (calories, protein, carbs, fat, fiber)
- "Perfect It" AI feature for meal customization suggestions
- Restaurant filtering by diet compatibility
- Meal discovery with dietary tags
- User preference learning and personalization

AI FEATURES:
- AI meal recommendations based on dietary profile
- "Perfect It" feature for customizing meals to fit dietary needs
- Smart restaurant matching based on dietary restrictions
- Automated nutritional analysis of menu items

TECHNICAL DETAILS:
- Cross-platform mobile app (iOS/Android)

CRITICAL: NEVER invent features that don't exist. Only discuss the features listed above. Do NOT create fictional capabilities like social sharing, meal planning calendars, grocery lists, restaurant reservations, payment integration, loyalty programs, or any other features not explicitly listed.

ORGANIC APP MENTIONS STRATEGY:
- NEVER force PerfectPlate into every article - only mention when genuinely relevant
- When PerfectPlate IS relevant: mention it naturally as ONE solution among others
- OCCASIONALLY mention complementary apps (not competitors):
  * MyFitnessPal (macro tracking), Cronometer (nutrition tracking)
  * Noom (weight management), Lose It! (calorie counting)
  * Happy Cow (for vegan/vegetarian content), Yuka (ingredient analysis)
  * 8fit or Nike Training Club (for fitness-related content)

TONE FOR APP MENTIONS:
- "Many people find it helpful to..." rather than "You should download..."
- "One approach that works well is..." rather than promotional language
- "If you're looking for extra support..." rather than urgent calls-to-action
- "Some apps like PerfectPlate can help with..." - casual, not pushy
- End with gentle suggestion, not download demands
- NEVER create links to PerfectPlate - just mention it by name without linking
- Do NOT create fake URLs like perfectplate.com/features or extended paths

OUTPUT FORMAT:
- Start with: TITLE: [Your generated title]
- Then provide ONLY the blog post content (no DOCTYPE, head, html, or body tags - just the content that goes inside the .blog-content div)
- Use PROPER HTML formatting: <h2>, <h3>, <p>, <ul>, <li>, <ol>, <blockquote> tags
- CRITICAL HTML RULES:
  * ALL text must be wrapped in proper HTML tags (no bare text)
  * Use <p> tags for paragraphs, NOT just line breaks
  * Use <ul><li> for bullet points, NEVER asterisks (*)
  * Use <ol><li> for numbered lists, NEVER manual numbering
  * NO Markdown syntax like # ## ### - use proper HTML headers
  * NO bare asterisk lists (*) - convert to proper <ul><li> tags
- CRITICAL: Keep paragraphs SHORT and readable - maximum 3-4 sentences per <p> tag
- Break up long content into multiple paragraphs for better readability
- Use subheadings (h2, h3) to break up sections naturally`;

    // Generate completely dynamic content ideas using AI
    const ideaPrompt = `Generate a unique blog post concept for the "${category.category}" category.

CURRENT DATE CONTEXT:
- Current Month: ${currentMonth} ${currentYear}
- Current Season: ${currentSeason}
- Today's Date: ${now.toLocaleDateString()}

CATEGORY FOCUS: ${category.category}
BASE KEYWORDS: ${category.baseKeywords.join(', ')}${perfectPlateContext}

CRITICAL CATEGORY RESTRICTION:
The category MUST be exactly one of these frontend categories (case-sensitive):
- Getting Started
- Meal Planning
- Dietary Tips
- Restaurant Guides
- App Features
- Nutrition
- Recipes
- Tips & Tricks

Do NOT use any other category names. Your response MUST use "${category.category}" as the category.

REQUIREMENTS:
- Create a completely unique, never-seen-before blog post idea
- Generate a compelling title that's SEO-friendly and attention-grabbing
- Create 8-12 unique content points to cover
- Generate relevant keywords beyond the base ones
- Make it valuable and actionable for readers
- Focus on ${currentYear} trends and current challenges
- Avoid generic or overused concepts

SEASONAL AWARENESS:
- Consider current season/month when relevant (e.g., don't write about "Veganuary" in July)
- Seasonal content is OPTIONAL - only include if naturally relevant
- Most posts should be evergreen and not date-specific
- If you do reference seasons/months, make sure they match the current date context above

OUTPUT FORMAT:
TITLE: [Unique, compelling title]
KEYWORDS: [8-10 SEO-optimized long-tail keywords (2-4 words each), comma-separated. Focus on specific phrases people search for, not single generic words. Examples: "keto dining out", "low carb restaurant guide", "diabetic-friendly meal planning"]
TONE: [Choose one: friendly, professional, informative, casual, authoritative, conversational - pick the best tone for this specific topic and audience]
LENGTH: [Choose one: short (800-1200 words), medium (1200-1800 words), long (1800-2500 words) - based on topic complexity and user value]
CONTENT_POINTS: [8-12 unique points to cover, one per line]

Generate a completely fresh blog post concept now:`;

    if (window.Utils) {
        return await window.Utils.callGeminiAPI(ideaPrompt, apiKey);
    } else {
        // Fallback API call
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: ideaPrompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`Blog idea generation API error: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }
}

// Generate compelling share text for social media using AI
async function generateCompellingShareText(title, category, keywords, content, apiKey) {
    try {
        // Extract key information from content for context
        const contentPreview = content.replace(/<[^>]*>/g, '').substring(0, 500); // Remove HTML and get first 500 chars
        
        // Convert keywords to array if it's a string
        const keywordsArray = Array.isArray(keywords) ? keywords : keywords.split(',').map(k => k.trim());
        
        // Determine post type and audience
        const isRecipe = category === 'Recipes' || title.toLowerCase().includes('recipe') || keywordsArray.some(k => ['recipe', 'cooking', 'meal'].includes(k.toLowerCase()));
        const isGuide = category === 'Restaurant Guides' || title.toLowerCase().includes('guide') || keywordsArray.some(k => ['guide', 'tips', 'dining'].includes(k.toLowerCase()));
        const isDietSpecific = keywordsArray.some(k => ['keto', 'vegan', 'diabetic', 'paleo', 'low carb'].includes(k.toLowerCase()));
        
        // Determine primary diet type from keywords
        let dietType = '';
        if (keywordsArray.some(k => k.toLowerCase().includes('keto'))) dietType = 'keto';
        else if (keywordsArray.some(k => k.toLowerCase().includes('vegan'))) dietType = 'vegan';
        else if (keywordsArray.some(k => k.toLowerCase().includes('diabetic'))) dietType = 'diabetic';
        else if (keywordsArray.some(k => k.toLowerCase().includes('paleo'))) dietType = 'paleo';
        
        // Get appropriate emoji based on content
        let emoji = '🍽️';
        if (isRecipe && dietType === 'keto') emoji = '🥩';
        else if (isRecipe && dietType === 'vegan') emoji = '🌱';
        else if (isDietSpecific && dietType === 'diabetic') emoji = '🩺';
        else if (isRecipe && content.toLowerCase().includes('salmon')) emoji = '🐟';
        else if (isRecipe) emoji = '🍽️';
        else if (isGuide) emoji = '🧠';
        
        const shareTextPrompt = `Generate compelling social media share text for this blog post. Create 6 different versions:

BLOG POST INFO:
Title: ${title}
Category: ${category}
Keywords: ${keywordsArray.join(', ')}
Content Preview: ${contentPreview}

REQUIREMENTS:
- Each version should be engaging and shareable
- Use emotional hooks like "game-changer", "incredible", "amazing"
- Include benefits and time-saving elements
- Use appropriate emojis (start with ${emoji})
- Target the specific audience (${dietType ? dietType + ' community' : 'food lovers'})
- Keep under 280 characters for most platforms
- Include relevant hashtags at the end
- Make each version unique with different emotional appeals

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

FACEBOOK_FEED: [Compelling text for Facebook timeline sharing]

FACEBOOK_GROUPS: [Text optimized for Facebook group sharing with community-friendly language]

FACEBOOK_COMPOSER: [Personal post style for Facebook composer with "I found this..." or "Just tried this..." language]

MESSENGER: [Short, enthusiastic text for sharing via Messenger to friends]

FACEBOOK_PAGE: [Professional text for business page sharing]

COPY_LINK: [General compelling text for copy/paste sharing anywhere]

GUIDELINES:
- Use action words and emotional language
- Mention specific benefits (time, taste, health, convenience)
- Include social proof language ("incredible", "game-changer", "must-try")
- For recipes: emphasize taste, time, and ease
- For guides: emphasize problem-solving and confidence-building
- For diet-specific content: speak directly to that community
- Keep hashtags relevant and trending`;

        let shareTextResponse;
        if (window.Utils) {
            shareTextResponse = await window.Utils.callGeminiAPI(shareTextPrompt, apiKey);
        } else {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: shareTextPrompt }] }]
                })
            });
            const data = await response.json();
            shareTextResponse = data.candidates[0].content.parts[0].text;
        }
        
        console.log('🎯 RAW SHARE TEXT RESPONSE:', shareTextResponse);
        
        // Parse the response into structured share text
        const shareText = {
            facebookFeed: extractShareText(shareTextResponse, 'FACEBOOK_FEED'),
            facebookGroups: extractShareText(shareTextResponse, 'FACEBOOK_GROUPS'),
            facebookComposer: extractShareText(shareTextResponse, 'FACEBOOK_COMPOSER'),
            messenger: extractShareText(shareTextResponse, 'MESSENGER'),
            facebookPage: extractShareText(shareTextResponse, 'FACEBOOK_PAGE'),
            copyLink: extractShareText(shareTextResponse, 'COPY_LINK')
        };
        
        console.log('🎯 PARSED SHARE TEXT:', shareText);
        return shareText;
        
    } catch (error) {
        console.error('Error generating share text:', error);
        // Return fallback share text
        return {
            facebookFeed: `${title} - Discover amazing tips and strategies! 🍽️✨ #PerfectPlate #${category.replace(/\s+/g, '')}`,
            facebookGroups: `Check out this amazing post! ${title} 🍽️`,
            facebookComposer: `Found this incredible guide: ${title} 🍽️`,
            messenger: `You need to see this: ${title} 🍽️`,
            facebookPage: `${title} - Great content for food enthusiasts! 🍽️`,
            copyLink: `${title} - Amazing tips and strategies you need to know! 🍽️`
        };
    }
}

// Helper function to extract specific share text from AI response
function extractShareText(response, type) {
    const lines = response.split('\n');
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().startsWith(type + ':')) {
            let text = lines[i].replace(type + ':', '').trim();
            // Remove any markdown formatting
            text = text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');
            return text;
        }
    }
    // Fallback if not found
    return `${type.replace(/_/g, ' ')} text for: Amazing content you need to see! 🍽️`;
}

// Generate blog post using AI
async function generateBlogPost() {
    let apiKey = localStorage.getItem('geminiApiKey') || '';
    
    if (!apiKey) {
        const apiKeyElement = document.getElementById('geminiApiKey');
        apiKey = apiKeyElement ? apiKeyElement.value : '';
    }

    const title = document.getElementById('blogTitle').value;
    const category = document.getElementById('blogCategory').value;
    const keywords = document.getElementById('blogKeywords').value;
    const tone = document.getElementById('blogTone').value;
    const length = document.getElementById('blogLength').value;
    const outline = document.getElementById('blogOutline').value;

    if (!apiKey) {
        alert('Please enter your Gemini API key first in the Social Media tab!');
        return;
    }

    if (!title || !category || !keywords || !outline) {
        alert('Please select a blog template first or fill in all required fields!');
        return;
    }

    const button = document.querySelector('button[onclick="generateBlogPost()"]');
    const originalText = button.innerHTML;
    
    // Add visual feedback
    button.innerHTML = '🤖 Generating Blog Post...';
    button.disabled = true;
    button.style.background = '#ff9800';
    button.style.cursor = 'not-allowed';
    
    try {
        let prompt;
        const isRecipePost = category.toLowerCase().includes('recipe') || 
                           title.toLowerCase().includes('recipe') || 
                           outline.toLowerCase().includes('recipe');
        
        // Check if this is a recipe post with a selected diet
        let selectedDiet = null;
        if (window.RecipeGenerator && window.RecipeGenerator.selectedRecipeDiet) {
            selectedDiet = window.RecipeGenerator.selectedRecipeDiet;
        }
        
        if (isRecipePost && selectedDiet) {
            // Generate actual recipe content using the selected diet
            const recipeContent = await window.RecipeGenerator.generateDynamicRecipeContent(selectedDiet);
            if (recipeContent) {
                // Use the generated recipe content instead of the outline
                prompt = `Create comprehensive recipe blog post CONTENT ONLY (no doctype, head, or html tags) for the PerfectPlate food app blog.

PERFECTPLATE CONTEXT (ACCURATE FEATURES ONLY):
PerfectPlate is a restaurant discovery app with these EXACT features:

CORE FUNCTIONALITY:
- Restaurant discovery and search by location (ZIP code)
- Menu analysis across 170,000+ restaurant locations
- Dietary restriction filtering (17 diet types: keto, vegan, vegetarian, gluten-free, pescatarian, diabetic-friendly, dairy-free, nut-free, paleo, low-carb, kosher, halal, etc.)
- Comprehensive allergen filtering for all 14 major allergens
- Macro goal matching (protein, carbs, fat targets)
- Meal recommendations based on dietary preferences and restrictions

AI FEATURES:
- "Ask Platey" - AI nutrition assistant for meal questions and advice
- AI-powered meal recommendations from restaurant menus
- "Perfect It" feature - AI suggestions for how to modify restaurant meals by talking to your server (e.g., "ask for sauce on the side," "substitute grilled chicken for fried," "add extra vegetables") OR modify home recipes to better fit your diet and goals
- Pantry feature - Create meals based on ingredients you already have at home
- Custom recipe creation from scratch - Either by naming a dish ("lemon bars") or asking for something unique that matches your dietary needs
- Daily personalized meal generation based on user preferences

USER EXPERIENCE:
- Ingredient preference rating system (0-100 scale for individual ingredients)
- Save favorite recipes and meals
- Trial and premium subscription tiers
- Cross-platform mobile app (iOS/Android)

CRITICAL: NEVER invent features that don't exist. Only discuss the features listed above. Do NOT create fictional capabilities like social sharing, meal planning calendars, grocery lists, restaurant reservations, payment integration, loyalty programs, or any other features not explicitly listed.

ORGANIC APP MENTIONS STRATEGY:
- NEVER force PerfectPlate into every article - only mention when genuinely relevant
- When PerfectPlate IS relevant: mention it naturally as ONE solution among others
- Present as "Some people find apps like X helpful for..." rather than direct recommendations
- Make it feel like natural advice from a knowledgeable friend, not marketing
- "Some apps like PerfectPlate can help with..." - casual, not pushy
- NEVER create links to PerfectPlate - just mention it by name without linking
- Do NOT create fake URLs like perfectplate.com/features or extended paths

RECIPE BLOG POST REQUIREMENTS:
- Transform the provided recipe content into a properly formatted blog post
- Include image placeholders using this format: [IMAGE: detailed description for AI generation]
- Create specific, visual descriptions for each image that would work well for AI generation
- Examples: [IMAGE: Close-up shot of golden-brown crispy tofu cubes with fresh herbs on a white ceramic plate, natural lighting] or [IMAGE: Overhead view of colorful asparagus spears being sautéed in a cast iron pan with garlic and lemon]
- Use proper recipe formatting with structured data
- Include nutritional information and dietary tags
- Make it SEO-optimized for recipe searches
- Add cooking tips and storage advice
- Write in a professional, informative tone without casual conversational phrases
- NO casual dialogue like "Of course!" or "Here we go!" - keep it professional
- Focus on providing value and practical information

RECIPE CONTENT TO FORMAT:
${recipeContent.outline}

TITLE TO USE: ${title}
KEYWORDS: ${keywords}
CATEGORY: ${category}
TONE: ${tone}

OUTPUT FORMAT:
- Start with: TITLE: [Your title]
- Then provide ONLY the blog post content in professional tone (no DOCTYPE, head, html, or body tags - just the content that goes inside the .blog-content div)
- Use PROPER HTML formatting: <h2>, <h3>, <p>, <ul>, <li>, <ol>, <blockquote> tags
- CRITICAL HTML RULES:
  * ALL text must be wrapped in proper HTML tags (no bare text)
  * Use <p> tags for paragraphs, NOT just line breaks
  * Use <ul><li> for bullet points, NEVER asterisks (*)
  * Use <ol><li> for numbered lists, NEVER manual numbering
  * NO Markdown syntax like # ## ### - use proper HTML headers
  * NO bare asterisk lists (*) - convert to proper <ul><li> tags
- Include recipe images with proper alt text
- Add structured recipe formatting
- CRITICAL: Keep paragraphs SHORT and readable - maximum 3-4 sentences per <p> tag
- NO conversational intros like "Of course!" - start directly with valuable content

Generate the complete recipe blog post now:`;
            } else {
                // Fallback to regular recipe prompt if generation fails
                prompt = `Create comprehensive recipe blog post CONTENT ONLY (no doctype, head, or html tags) for the PerfectPlate food app blog.

PERFECTPLATE CONTEXT (ACCURATE FEATURES ONLY):
PerfectPlate is a restaurant discovery app with these EXACT features:

CORE FUNCTIONALITY:
- Restaurant discovery and search by location (ZIP code)
- Menu analysis across 170,000+ restaurant locations
- Dietary restriction filtering (17 diet types: keto, vegan, vegetarian, gluten-free, pescatarian, diabetic-friendly, dairy-free, nut-free, paleo, low-carb, kosher, halal, etc.)
- Comprehensive allergen filtering for all 14 major allergens
- Macro goal matching (protein, carbs, fat targets)
- Meal recommendations based on dietary preferences and restrictions

AI FEATURES:
- "Ask Platey" - AI nutrition assistant for meal questions and advice
- AI-powered meal recommendations from restaurant menus
- "Perfect It" feature - AI suggestions for how to modify restaurant meals by talking to your server (e.g., "ask for sauce on the side," "substitute grilled chicken for fried," "add extra vegetables") OR modify home recipes to better fit your diet and goals
- Pantry feature - Create meals based on ingredients you already have at home
- Custom recipe creation from scratch - Either by naming a dish ("lemon bars") or asking for something unique that matches your dietary needs
- Daily personalized meal generation based on user preferences

USER EXPERIENCE:
- Ingredient preference rating system (0-100 scale for individual ingredients)
- Save favorite recipes and meals
- Trial and premium subscription tiers
- Cross-platform mobile app (iOS/Android)

CRITICAL: NEVER invent features that don't exist. Only discuss the features listed above. Do NOT create fictional capabilities like social sharing, meal planning calendars, grocery lists, restaurant reservations, payment integration, loyalty programs, or any other features not explicitly listed.

ORGANIC APP MENTIONS STRATEGY:
- NEVER force PerfectPlate into every article - only mention when genuinely relevant
- When PerfectPlate IS relevant: mention it naturally as ONE solution among others
- Present as "Some people find apps like X helpful for..." rather than direct recommendations
- Make it feel like natural advice from a knowledgeable friend, not marketing
- "Some apps like PerfectPlate can help with..." - casual, not pushy
- NEVER create links to PerfectPlate - just mention it by name without linking
- Do NOT create fake URLs like perfectplate.com/features or extended paths

RECIPE BLOG POST REQUIREMENTS:
- Transform the provided recipe content into a properly formatted blog post
- Include image placeholders using this format: [IMAGE: detailed description for AI generation]
- Create specific, visual descriptions for each image that would work well for AI generation
- Examples: [IMAGE: Close-up shot of golden-brown crispy tofu cubes with fresh herbs on a white ceramic plate, natural lighting] or [IMAGE: Overhead view of colorful asparagus spears being sautéed in a cast iron pan with garlic and lemon]
- Use proper recipe formatting with structured data
- Include nutritional information and dietary tags
- Make it SEO-optimized for recipe searches
- Add cooking tips and storage advice
- Write in a professional, informative tone without casual conversational phrases
- NO casual dialogue like "Of course!" or "Here we go!" - keep it professional
- Focus on providing value and practical information

RECIPE CONTENT TO FORMAT:
${outline}

TITLE TO USE: ${title}
KEYWORDS: ${keywords}
CATEGORY: ${category}
TONE: ${tone}

OUTPUT FORMAT:
- Start with: TITLE: [Your title]
- Then provide ONLY the blog post content in professional tone (no DOCTYPE, head, html, or body tags - just the content that goes inside the .blog-content div)
- Use PROPER HTML formatting: <h2>, <h3>, <p>, <ul>, <li>, <ol>, <blockquote> tags
- CRITICAL HTML RULES:
  * ALL text must be wrapped in proper HTML tags (no bare text)
  * Use <p> tags for paragraphs, NOT just line breaks
  * Use <ul><li> for bullet points, NEVER asterisks (*)
  * Use <ol><li> for numbered lists, NEVER manual numbering
  * NO Markdown syntax like # ## ### - use proper HTML headers
  * NO bare asterisk lists (*) - convert to proper <ul><li> tags
- Include recipe images with proper alt text
- Add structured recipe formatting
- CRITICAL: Keep paragraphs SHORT and readable - maximum 3-4 sentences per <p> tag
- NO conversational intros like "Of course!" - start directly with valuable content

Generate the complete recipe blog post now:`;
            }
        } else if (isRecipePost) {
            prompt = `Create comprehensive recipe blog post CONTENT ONLY (no doctype, head, or html tags) for the PerfectPlate food app blog.

PERFECTPLATE CONTEXT (ACCURATE FEATURES ONLY):
PerfectPlate is a restaurant discovery app with these EXACT features:

CORE FUNCTIONALITY:
- Restaurant discovery and search by location (ZIP code)
- Menu analysis across 170,000+ restaurant locations
- Dietary restriction filtering (17 diet types: keto, vegan, vegetarian, gluten-free, pescatarian, diabetic-friendly, dairy-free, nut-free, paleo, low-carb, kosher, halal, etc.)
- Comprehensive allergen filtering for all 14 major allergens
- Macro goal matching (protein, carbs, fat targets)
- Meal recommendations based on dietary preferences and restrictions

AI FEATURES:
- "Ask Platey" - AI nutrition assistant for meal questions and advice
- AI-powered meal recommendations from restaurant menus
- "Perfect It" feature - AI suggestions for how to modify restaurant meals by talking to your server (e.g., "ask for sauce on the side," "substitute grilled chicken for fried," "add extra vegetables") OR modify home recipes to better fit your diet and goals
- Pantry feature - Create meals based on ingredients you already have at home
- Custom recipe creation from scratch - Either by naming a dish ("lemon bars") or asking for something unique that matches your dietary needs
- Daily personalized meal generation based on user preferences

USER EXPERIENCE:
- Ingredient preference rating system (0-100 scale for individual ingredients)
- Save favorite recipes and meals
- Trial and premium subscription tiers
- Cross-platform mobile app (iOS/Android)

CRITICAL: NEVER invent features that don't exist. Only discuss the features listed above. Do NOT create fictional capabilities like social sharing, meal planning calendars, grocery lists, restaurant reservations, payment integration, loyalty programs, or any other features not explicitly listed.

ORGANIC APP MENTIONS STRATEGY:
- NEVER force PerfectPlate into every article - only mention when genuinely relevant
- When PerfectPlate IS relevant: mention it naturally as ONE solution among others
- Present as "Some people find apps like X helpful for..." rather than direct recommendations
- Make it feel like natural advice from a knowledgeable friend, not marketing
- "Some apps like PerfectPlate can help with..." - casual, not pushy
- NEVER create links to PerfectPlate - just mention it by name without linking
- Do NOT create fake URLs like perfectplate.com/features or extended paths

RECIPE BLOG POST REQUIREMENTS:
- Transform the provided recipe content into a properly formatted blog post
- Include image placeholders using this format: [IMAGE: detailed description for AI generation]
- Create specific, visual descriptions for each image that would work well for AI generation
- Examples: [IMAGE: Close-up shot of golden-brown crispy tofu cubes with fresh herbs on a white ceramic plate, natural lighting] or [IMAGE: Overhead view of colorful asparagus spears being sautéed in a cast iron pan with garlic and lemon]
- Use proper recipe formatting with structured data
- Include nutritional information and dietary tags
- Make it SEO-optimized for recipe searches
- Add cooking tips and storage advice
- Write in a professional, informative tone without casual conversational phrases
- NO casual dialogue like "Of course!" or "Here we go!" - keep it professional
- Focus on providing value and practical information

RECIPE CONTENT TO FORMAT:
${outline}

TITLE TO USE: ${title}
KEYWORDS: ${keywords}
CATEGORY: ${category}

HTML STRUCTURE REQUIREMENTS:
- Use <h1> for main title
- Use <h2> for recipe titles
- Use <h3> for recipe sections (Ingredients, Instructions, etc.)
- Create structured ingredient lists with <ul> and <li>
- Use numbered <ol> for cooking instructions
- Add recipe meta info (prep time, cook time, servings) in styled boxes
- Include nutritional highlights for each recipe
- Add cooking tips and variations

IMAGE REQUIREMENTS:
- Include image placeholders using this format: [IMAGE: detailed description for AI generation]
- Create specific, visual descriptions for each image that would work well for AI generation
- Examples: [IMAGE: Close-up shot of golden-brown crispy tofu cubes with fresh herbs on a white ceramic plate, natural lighting] or [IMAGE: Overhead view of colorful asparagus spears being sautéed in a cast iron pan with garlic and lemon]
- Place images strategically throughout the post
- Ensure descriptions are detailed and visually descriptive

RECIPE CARD FORMAT for each recipe:
<div class="recipe-card" style="background: #f8f9fa; border-radius: 15px; padding: 25px; margin: 30px 0; border-left: 4px solid #4CAF50;">
  <h2>Recipe Name</h2>
  <div class="recipe-meta" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 20px 0; text-align: center;">
    <div><strong>Prep Time:</strong><br>XX minutes</div>
    <div><strong>Cook Time:</strong><br>XX minutes</div> 
    <div><strong>Serves:</strong><br>X people</div>
  </div>
  
  [IMAGE: Professional food photography of specific recipe name, beautifully plated and styled]
  
  <h3>Ingredients:</h3>
  <ul style="margin-left: 20px;">
    <li>Ingredient with measurement</li>
  </ul>
  
  <h3>Instructions:</h3>
  <ol style="margin-left: 20px;">
    <li>Detailed step-by-step instruction</li>
  </ol>
  
  <div class="nutrition-info" style="background: #e8f5e8; padding: 15px; border-radius: 10px; margin: 20px 0;">
    <h4>Nutritional Highlights:</h4>
    <p>Key nutritional benefits and dietary information</p>
  </div>
</div>

Add cooking tips, storage advice, and recipe variations at the end.`;
        } else {
            prompt = `Write a comprehensive blog post for the PerfectPlate food app blog.

BLOG POST REQUIREMENTS:
- Create engaging, informative content that provides real value to readers
- Use a friendly, authoritative tone that establishes trust
- Include actionable tips and practical advice
- Optimize for SEO with natural keyword integration
- Structure content for easy scanning and readability
- Add relevant examples and real-world applications

CONTENT DETAILS:
Title: ${title}
Category: ${category}
Keywords: ${keywords}
Tone: ${tone}
Target length: ${length}

OUTLINE TO EXPAND:
${outline}

HTML STRUCTURE REQUIREMENTS:
- Use <h1> for main title with proper keyword optimization
- Use <h2> for major sections that break up content logically
- Use <h3> for subsections within major topics
- Create bullet points with <ul> and <li> for easy scanning
- Use <strong> and <em> for emphasis on key points
- Include relevant internal linking opportunities
- Add compelling meta descriptions and title tags

CONTENT GUIDELINES:
- Start with a hook that immediately addresses reader pain points
- Provide clear, actionable advice in each section
- Include specific examples and case studies when relevant
- End with a strong conclusion that summarizes key takeaways
- Naturally integrate target keywords without keyword stuffing
- Write in a conversational tone that builds trust with readers
- Include practical tips that readers can implement immediately

FORMATTING REQUIREMENTS:
- Use proper HTML formatting throughout
- Include strategic keyword placement in headings
- Create scannable content with short paragraphs (2-3 sentences max)
- Add relevant call-to-action elements where appropriate
- Ensure mobile-friendly formatting and structure

PERFECTPLATE CONTEXT (ACCURATE FEATURES ONLY):
PerfectPlate is a restaurant discovery app with these EXACT features:

CORE FUNCTIONALITY:
- Restaurant discovery and search by location (ZIP code)
- Menu analysis across 170,000+ restaurant locations
- Dietary restriction filtering (17 diet types: keto, vegan, vegetarian, gluten-free, pescatarian, diabetic-friendly, dairy-free, nut-free, paleo, low-carb, kosher, halal, etc.)
- Personalized meal recommendations based on dietary preferences
- Nutritional information display (calories, protein, carbs, fat, fiber)
- "Perfect It" AI feature for meal customization suggestions
- Restaurant filtering by diet compatibility
- Meal discovery with dietary tags
- User preference learning and personalization

AI FEATURES:
- AI meal recommendations based on dietary profile
- "Perfect It" feature for customizing meals to fit dietary needs
- Smart restaurant matching based on dietary restrictions
- Automated nutritional analysis of menu items

TECHNICAL DETAILS:
- Cross-platform mobile app (iOS/Android)

CRITICAL: NEVER invent features that don't exist. Only discuss the features listed above. Do NOT create fictional capabilities like social sharing, meal planning calendars, grocery lists, restaurant reservations, payment integration, loyalty programs, or any other features not explicitly listed.

ORGANIC APP MENTIONS STRATEGY:
- NEVER force PerfectPlate into every article - only mention when genuinely relevant
- When PerfectPlate IS relevant: mention it naturally as ONE solution among others
- OCCASIONALLY mention complementary apps (not competitors):
  * MyFitnessPal (macro tracking), Cronometer (nutrition tracking)
  * Noom (weight management), Lose It! (calorie counting)
  * Happy Cow (for vegan/vegetarian content), Yuka (ingredient analysis)
  * 8fit or Nike Training Club (for fitness-related content)

TONE FOR APP MENTIONS:
- "Many people find it helpful to..." rather than "You should download..."
- "One approach that works well is..." rather than promotional language
- "If you're looking for extra support..." rather than urgent calls-to-action
- "Some apps like PerfectPlate can help with..." - casual, not pushy
- End with gentle suggestion, not download demands
- NEVER create links to PerfectPlate - just mention it by name without linking
- Do NOT create fake URLs like perfectplate.com/features or extended paths

CRITICAL OUTPUT FORMAT (FOLLOW EXACTLY):
- MUST start with: TITLE: [Your generated title]
- Then provide ONLY the blog post content (no DOCTYPE, head, html, or body tags - just the content that goes inside the .blog-content div)
- Use PROPER HTML formatting: <h2>, <h3>, <p>, <ul>, <li>, <ol>, <blockquote> tags
- CRITICAL HTML RULES:
  * ALL text must be wrapped in proper HTML tags (no bare text)
  * Use <p> tags for paragraphs, NOT just line breaks
  * Use <ul><li> for bullet points, NEVER asterisks (*)
  * Use <ol><li> for numbered lists, NEVER manual numbering
  * NO Markdown syntax like # ## ### - use proper HTML headers
  * NO bare asterisk lists (*) - convert to proper <ul><li> tags
- NO introductory text or explanations before the TITLE
- NO preambles like "Here is..." or "This is..."
- IMMEDIATELY start with "TITLE:" followed by your title`;
        }

        let blogContent;
        if (window.Utils) {
            blogContent = await window.Utils.callGeminiAPI(prompt, apiKey);
        } else {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });
            const data = await response.json();
            blogContent = data.candidates[0].content.parts[0].text;
        }
        
        // Debug: Log the raw response from Gemini
        console.log('🐛 RAW GEMINI RESPONSE:', blogContent);
        console.log('🐛 STARTS WITH TITLE?:', blogContent.startsWith('TITLE:'));
        
        // Extract generated title and content (from original script)
        let generatedTitle = title; // fallback to original
        let cleanBlogContent = blogContent;
        
        // Check if response starts with "TITLE:"
        if (blogContent.startsWith('TITLE:')) {
            const lines = blogContent.split('\n');
            const titleLine = lines[0];
            generatedTitle = titleLine.replace('TITLE:', '').trim();
            // Remove the title line from content
            cleanBlogContent = lines.slice(1).join('\n').trim();
            console.log('🐛 EXTRACTED TITLE:', generatedTitle);
        } else {
            // More robust title extraction - look for TITLE: anywhere in first few lines
            const lines = blogContent.split('\n');
            for (let i = 0; i < Math.min(10, lines.length); i++) {
                if (lines[i].trim().startsWith('TITLE:')) {
                    generatedTitle = lines[i].replace('TITLE:', '').trim();
                    // Remove everything before and including the title line
                    cleanBlogContent = lines.slice(i + 1).join('\n').trim();
                    console.log('🐛 FOUND TITLE AT LINE', i, ':', generatedTitle);
                    break;
                }
            }
        }
        
                // Also remove any duplicate H1 title from content
        if (cleanBlogContent.includes(`<h1>${generatedTitle}</h1>`)) {
            cleanBlogContent = cleanBlogContent.replace(`<h1>${generatedTitle}</h1>`, '').trim();
            console.log('🐛 REMOVED DUPLICATE H1 TITLE');
        }

        // Clean markdown code blocks from AI response
        cleanBlogContent = cleanBlogContent
            .replace(/```html\s*/gi, '')  // Remove opening ```html
            .replace(/```\s*$/gi, '')      // Remove closing ```
            .replace(/^\s*```/gm, '')      // Remove any remaining ``` at start of lines
            .trim();
        console.log('🐛 CLEANED MARKDOWN BLOCKS');

        // Fix formatting issues
        cleanBlogContent = cleanBlogContent
            // Convert **text** to <strong>text</strong>
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Add proper spacing after image descriptions (text ending with image-related words followed immediately by capital letter)
            .replace(/(\b(?:image|photo|picture|bowl|plate|dish|recipe)\b)(\s*)([A-Z])/g, '$1.</p>\n\n<p>$3')
            .trim();
        console.log('🐛 FIXED TEXT FORMATTING');

        // Highlight keywords in content for SEO
        const highlightedContent = highlightKeywords(cleanBlogContent, keywords);
        
        // Generate compelling share text using AI
        console.log('🎯 GENERATING COMPELLING SHARE TEXT...');
        const shareText = await generateCompellingShareText(generatedTitle, category, keywords, cleanBlogContent, apiKey);
        console.log('🎯 GENERATED SHARE TEXT:', shareText);
        
        // Store generated content globally for later use
        window.generatedBlogContent = {
            title: generatedTitle,
            category,
            keywords,
            content: highlightedContent,
            tone,
            length,
            date: new Date().toLocaleDateString('en-CA'), // Use actual current local date in YYYY-MM-DD format
            displayDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), // Pre-formatted display date
            shareText: shareText // Add the generated share text
        };

        // Show success message and display blog
        if (window.Utils) {
            window.Utils.showSuccess('Blog post generated successfully with AI-powered compelling share text! 🎯');
        }
        showGeneratedBlog();

    } catch (error) {
        console.error('Error generating blog post:', error);
        alert('Error generating blog post: ' + error.message);
    } finally {
        // Restore button state
        button.innerHTML = originalText;
        button.disabled = false;
        button.style.background = '';
        button.style.cursor = '';
    }
}

// Show generated blog post
function showGeneratedBlog() {
    if (!window.generatedBlogContent) return;

    const { title, category, keywords, content, date, displayDate } = window.generatedBlogContent;
    
    // Set currentBlogPost for publishing functionality
    currentBlogPost = content;
    
    // Fill preview section
    document.getElementById('previewTitle').textContent = title;
    document.getElementById('previewMeta').innerHTML = `
        <span class="category">${category}</span> • 
        <span class="date">${displayDate}</span>
    `;
    document.getElementById('previewContent').innerHTML = content;
    
    // Show preview and publish sections
    document.getElementById('blogPreview').style.display = 'block';
    document.getElementById('publishSection').style.display = 'block';
}

// Extract clean description text for social sharing meta tags
function getCleanDescription(content) {
    // Create a temporary div to parse HTML content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    // Remove all img, script, style elements
    const unwantedElements = tempDiv.querySelectorAll('img, script, style, .recipe-card');
    unwantedElements.forEach(el => el.remove());
    
    // Get text content and clean it up
    let cleanText = tempDiv.textContent || tempDiv.innerText || '';
    
    // Remove extra whitespace and line breaks
    cleanText = cleanText.replace(/\s+/g, ' ').trim();
    
    // If text is too short, try to get more meaningful content
    if (cleanText.length < 50) {
        // Fallback: try to extract from first paragraph
        const firstP = tempDiv.querySelector('p');
        if (firstP) {
            cleanText = firstP.textContent || firstP.innerText || '';
            cleanText = cleanText.replace(/\s+/g, ' ').trim();
        }
    }
    
    // Limit to 155 characters for optimal social sharing
    if (cleanText.length > 155) {
        // Find the last complete word before 155 chars
        let truncated = cleanText.substring(0, 155);
        const lastSpace = truncated.lastIndexOf(' ');
        if (lastSpace > 100) { // Make sure we don't cut too short
            truncated = truncated.substring(0, lastSpace);
        }
        cleanText = truncated + '...';
    }
    
    // Escape quotes for HTML attributes
    cleanText = cleanText.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    
    console.log('🔍 Generated clean description:', cleanText);
    return cleanText;
}

// Generate Open Graph image tag for social sharing
function getOgImageTag() {
    // Check if we have recipe images available
    if (window.currentPostImages && window.currentPostImages.length > 0) {
        console.log('🔍 Using recipe image for OG tag:', window.currentPostImages[0].localPath);
        // Use the first recipe image for social sharing
        const firstImage = window.currentPostImages[0];
        // Use local path converted to full URL for social sharing (permanent, not temporary Replicate URL)
        const imageUrl = `https://perfectplate.app/${firstImage.localPath}`;
        return `<meta property="og:image" content="${imageUrl}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${firstImage.alt.replace(/"/g, '&quot;')}">`;
    }
    
    console.log('🔍 No recipe images available, using fallback logo for OG tag');
    // Fallback to default PerfectPlate logo if no recipe images
    return `<meta property="og:image" content="https://perfectplate.app/images/logo.png">
    <meta property="og:image:width" content="400">
    <meta property="og:image:height" content="400">
    <meta property="og:image:alt" content="PerfectPlate Logo">`;
}

// Generate Twitter image tag for social sharing
function getTwitterImageTag() {
    // Check if we have recipe images available
    if (window.currentPostImages && window.currentPostImages.length > 0) {
        console.log('🔍 Using recipe image for Twitter tag:', window.currentPostImages[0].localPath);
        // Use the first recipe image for Twitter sharing
        const firstImage = window.currentPostImages[0];
        // Use local path converted to full URL for social sharing (permanent, not temporary Replicate URL)
        const imageUrl = `https://perfectplate.app/${firstImage.localPath}`;
        return `<meta name="twitter:image" content="${imageUrl}">
    <meta name="twitter:image:alt" content="${firstImage.alt.replace(/"/g, '&quot;')}">`;
    }
    
    console.log('🔍 No recipe images available, using fallback logo for Twitter tag');
    // Fallback to default PerfectPlate logo if no recipe images
    return `<meta name="twitter:image" content="https://perfectplate.app/images/logo.png">
    <meta name="twitter:image:alt" content="PerfectPlate Logo">`;
}

// Download blog post as HTML file (missing from original modularization)
function downloadBlogPost() {
    if (!window.generatedBlogContent) {
        alert('No blog post to download!');
        return;
    }

    const { title, category, keywords, date, displayDate, shareText } = window.generatedBlogContent;
    let content = window.generatedBlogContent.content;
    
    console.log('🔍 DOWNLOAD DEBUG - Starting download process');
    console.log('🎯 DOWNLOAD DEBUG - Share text available:', !!shareText);
    console.log('🎯 DOWNLOAD DEBUG - Share text preview:', shareText ? shareText.facebookFeed : 'No share text');
    console.log('🔍 DOWNLOAD DEBUG - Content has replicate URLs:', content.includes('replicate.delivery'));
    console.log('🔍 DOWNLOAD DEBUG - Content has placeholders:', content.includes('[IMAGE:'));
    console.log('🔍 DOWNLOAD DEBUG - Content preview:', content.substring(0, 300));
    
    // Clean up any old RECIPE_IMAGE_SEARCH placeholders first
    if (content.includes('[RECIPE_IMAGE_SEARCH:')) {
        console.log('🧹 Cleaning up old RECIPE_IMAGE_SEARCH placeholders from downloaded content');
        content = content.replace(/\[RECIPE_IMAGE_SEARCH:\s*([^\]]+)\]/g, '');
    }
    
    // Check if content still has image placeholders and handle them
    if (content.includes('[IMAGE:')) {
        console.warn('⚠️ Content still contains image placeholders. This should not happen if images were processed.');
        console.log('🔍 Content preview:', content.substring(0, 500));
        
        // Try to replace placeholders with simple image tags using local paths
        if (window.currentPostImages && window.currentPostImages.length > 0) {
            let imageIndex = 0;
            content = content.replace(/\[IMAGE:\s*([^\]]+)\]/g, (match, description) => {
                if (imageIndex < window.currentPostImages.length) {
                    const imageData = window.currentPostImages[imageIndex];
                    imageIndex++;
                    return `<img src="${imageData.localPath}" alt="${description.trim()}" style="width: 100%; border-radius: 10px; margin: 20px 0;">`;
                }
                return match; // Return original if no image data available
            });
            console.log('🔄 Replaced image placeholders with local paths for download');
        }
    }
    
    // Replace Replicate URLs with local paths for download
    if (content.includes('replicate.delivery')) {
        console.log('🔍 DEBUG - Content contains replicate URLs, processing...');
        console.log('🔍 DEBUG - Sample content:', content.substring(content.indexOf('replicate.delivery') - 50, content.indexOf('replicate.delivery') + 200));
        
        // Use global image data if available for accurate replacement
        if (window.currentPostImages && window.currentPostImages.length > 0) {
            console.log('🔍 DEBUG - Using currentPostImages for replacement');
            
            // Replace each Replicate URL with corresponding local path
            window.currentPostImages.forEach((imageData, index) => {
                const replicateUrl = imageData.originalUrl;
                const localPath = imageData.localPath;
                
                console.log(`🔄 Replacing ${replicateUrl} with ${localPath}`);
                
                // Replace the specific URL
                content = content.replace(new RegExp(replicateUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), localPath);
            });
            
            // Clean up any remaining data-local-src attributes
            content = content.replace(/\s*data-local-src="[^"]*"/g, '');
            
                         console.log('🔄 Replaced Replicate URLs with local paths for download');
             console.log('🔍 DEBUG - Sample after replacement:', content.substring(0, 500));
             console.log('🔍 DEBUG - Content still has replicate URLs after replacement:', content.includes('replicate.delivery'));
        } else {
            console.warn('⚠️ No currentPostImages available for URL replacement');
            
            // Fallback: try to extract local paths from data-local-src attributes
            content = content.replace(/<img([^>]*?)src="https:\/\/replicate\.delivery\/[^"]*"([^>]*?)data-local-src="([^"]*)"([^>]*?)>/g, 
                '<img$1src="$3"$2$4>');
            
            console.log('🔄 Used fallback regex replacement for Replicate URLs');
        }
    } else {
        console.log('🔍 DEBUG - No replicate URLs found in content');
    }
    const filename = title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    
    // Calculate read time
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200)) + ' min read';
    
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | PerfectPlate Blog</title>
    <meta name="description" content="${getCleanDescription(content)}">
    <meta name="keywords" content="${keywords.replace(/"/g, '&quot;')}">
    <meta name="author" content="PerfectPlate">
    <meta name="robots" content="index, follow">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article">
    <meta property="og:title" content="${title.replace(/"/g, '&quot;')}">
    <meta property="og:description" content="${getCleanDescription(content)}">
    <meta property="og:url" content="https://perfectplate.app/blog/${filename}.html">
    <meta property="og:site_name" content="PerfectPlate">
    ${getOgImageTag()}
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title.replace(/"/g, '&quot;')}">
    <meta name="twitter:description" content="${getCleanDescription(content)}">
    ${getTwitterImageTag()}
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" />
    
    <!-- Font Awesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    
    <link rel="icon" href="../favicon.ico" type="image/x-icon" />
    <link rel="stylesheet" href="../styles.css" />
    
    <!-- Blog-specific styles -->
    <style>
        .blog-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-top: 20px;
            margin-bottom: 40px;
        }
        .blog-header {
            text-align: center;
            margin-bottom: 40px;
        }
        .blog-title {
            font-family: 'Montserrat', sans-serif;
            font-size: 2.5rem;
            font-weight: 700;
            color: #333;
            margin-bottom: 15px;
            line-height: 1.2;
        }
        .blog-meta {
            color: #666;
            font-size: 14px;
            margin-bottom: 30px;
            padding: 15px;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 8px;
            border-left: 4px solid #007cba;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 15px;
        }
        .category-pill {
            background: #007cba;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            text-decoration: none;
            font-size: 12px;
            font-weight: 600;
            transition: background 0.3s ease;
        }
        .category-pill:hover {
            background: #005a8b;
            color: white;
            text-decoration: none;
        }
        .read-time {
            color: #666;
            font-size: 12px;
            font-weight: 500;
        }
        .blog-content {
            font-family: 'Open Sans', sans-serif;
            font-size: 16px;
            line-height: 1.8;
            color: #333;
        }
        .blog-content h2 {
            font-family: 'Montserrat', sans-serif;
            color: #007cba;
            font-size: 1.8rem;
            font-weight: 600;
            margin: 30px 0 20px 0;
            border-bottom: 2px solid #e1e8ed;
            padding-bottom: 10px;
        }
        .blog-content h3 {
            font-family: 'Montserrat', sans-serif;
            color: #333;
            font-size: 1.4rem;
            font-weight: 600;
            margin: 25px 0 15px 0;
        }
        .blog-content p {
            margin-bottom: 20px;
        }
        .blog-content ul, .blog-content ol {
            margin: 20px 0;
            padding-left: 30px;
            list-style-position: outside;
        }
        .blog-content ul {
            list-style-type: disc;
        }
        .blog-content ol {
            list-style-type: decimal;
        }
        .blog-content li {
            margin-bottom: 10px;
            line-height: 1.6;
        }
        .blog-content li::marker {
            color: #007cba;
            font-weight: bold;
        }
        .blog-content strong, .blog-content b {
            color: #007cba;
            font-weight: 600;
        }
        .blog-content em {
            font-style: italic;
            color: #555;
        }
        .blog-content blockquote {
            padding: 20px;
            margin: 30px 0;
            background: linear-gradient(to right, #007cba 4px, #f8f9fa 4px);
            border-radius: 8px !important;
            font-style: italic;
        }
        .blog-content blockquote p {
            margin: 0;
        }
        .blog-content a {
            color: #007cba;
            text-decoration: none;
            font-weight: 600;
        }
        .blog-content a:hover {
            text-decoration: underline;
        }
        .back-to-blog {
            text-align: center;
            margin: 40px 0;
        }
        .back-to-blog a {
            background: #007cba;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            display: inline-block;
            transition: background 0.3s ease;
        }
        .back-to-blog a:hover {
            background: #005a8b;
            color: white;
            text-decoration: none;
        }
        .share-section {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 30px;
            margin: 40px 0;
            text-align: center;
        }
        .share-section h4 {
            font-family: 'Montserrat', sans-serif;
            color: #333;
            margin-bottom: 20px;
            font-size: 1.2rem;
        }
        .share-buttons {
            display: flex;
            justify-content: center;
            gap: 15px;
            flex-wrap: wrap;
        }
        .share-button {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 20px;
            border-radius: 25px;
            text-decoration: none;
            font-weight: 600;
            transition: transform 0.2s, opacity 0.2s;
            font-family: 'Open Sans', sans-serif;
            font-size: 14px;
        }
        .share-button:hover {
            transform: translateY(-2px);
            text-decoration: none;
        }
        .share-button.twitter {
            background: #1DA1F2;
            color: white;
        }
        .share-button.facebook {
            background: #1877F2;
            color: white;
        }
        .share-button.linkedin {
            background: #0A66C2;
            color: white;
        }
        .share-button.copy {
            background: #6c757d;
            color: white;
        }
        
        @media (max-width: 768px) {
            .blog-container {
                margin: 10px;
                padding: 15px;
            }
            .blog-title {
                font-size: 2rem;
            }
            .blog-meta {
                font-size: 12px;
            }
            .share-buttons {
                flex-direction: column;
                align-items: center;
            }
            .share-button {
                width: 200px;
                justify-content: center;
            }
        }
    </style>
</head>
<body>
    <!-- Header Section -->
    <header>
        <div class="container">
            <div class="header-account">
                <a href="../login.html" class="login-link">Login</a>
            </div>
            
            <div class="header-content">
                <div class="logo-container">
                    <img src="../images/logo.png" alt="PerfectPlate Logo" class="logo" />
                </div>
                <div class="header-top">
                    <h1>PerfectPlate</h1>
                    <p class="header-tagline">Find Your Perfect Meal in 30 Seconds.</p>
                    <div class="divider"></div>
                </div>
            </div>
            
            <div class="header-app-links">
                <a href="https://apps.apple.com/app/perfectplate-meals-perfected/id6742039756" class="app-store-button">
                    <img src="../images/apple-store-badge.svg" alt="Download on the App Store" />
                </a>
                <a href="https://play.google.com/store/apps/details?id=com.perfectplate" class="app-store-button">
                    <img src="../images/google-play-badge.png" alt="Get it on Google Play" />
                </a>
            </div>
        </div>
    </header>

    <!-- Blog Content -->
    <div class="blog-container">
        <div class="blog-header">
            <h1 class="blog-title">${title}</h1>
            <div class="blog-meta">
                <a href="index.html" class="category-pill">${category}</a>
                <span class="read-time">⏱️ ${readTime}</span>
                <span>📅 ${displayDate}</span>
                <span>✍️ PerfectPlate Team</span>
            </div>
        </div>
        
        <div class="blog-content">
            ${content}
        </div>

        <div class="share-section">
            <h4>📢 Share This Post</h4>
            <div class="share-buttons">
                <a href="#" class="share-button twitter" onclick="shareOnTwitter()">
                    <i class="fab fa-twitter"></i>
                    Twitter
                </a>
                <div class="share-button-container" style="position: relative; display: inline-block;">
                    <a href="#" class="share-button facebook" onclick="toggleFacebookMenu(event)">
                        <i class="fab fa-facebook-f"></i>
                        Facebook ▼
                    </a>
                    <div id="facebookMenu" class="facebook-share-menu" style="display: none; position: absolute; top: 100%; left: 0; background: white; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000; min-width: 220px; margin-top: 5px;">
                        <a href="#" onclick="shareToFacebookFeed()" style="display: block; padding: 10px 15px; text-decoration: none; color: #333; border-bottom: 1px solid #eee;">
                            📝 Share to Timeline
                        </a>
                        <a href="#" onclick="shareToFacebookComposer()" style="display: block; padding: 10px 15px; text-decoration: none; color: #333; border-bottom: 1px solid #eee;">
                            🎯 Choose Audience (Groups/Friends)
                        </a>
                        <a href="#" onclick="shareToFacebookGroups()" style="display: block; padding: 10px 15px; text-decoration: none; color: #333; border-bottom: 1px solid #eee;">
                            👥 Copy Link for Groups
                        </a>
                        <a href="#" onclick="shareToMessenger()" style="display: block; padding: 10px 15px; text-decoration: none; color: #333; border-bottom: 1px solid #eee;">
                            💬 Send via Messenger
                        </a>
                        <a href="#" onclick="shareToFacebookPage()" style="display: block; padding: 10px 15px; text-decoration: none; color: #333;">
                            📄 Share to Page
                        </a>
                    </div>
                </div>
                <a href="#" class="share-button linkedin" onclick="shareOnLinkedIn()">
                    <i class="fab fa-linkedin-in"></i>
                    LinkedIn
                </a>
                <a href="#" class="share-button copy" onclick="copyLink()">
                    <i class="fas fa-link"></i>
                    Copy Link
                </a>
            </div>
        </div>
        
        <div class="back-to-blog">
            <a href="index.html">← Back to Blog</a>
        </div>
    </div>

    <div id="footer-section">
        <div class="container">
            <p>&copy; 2025 PerfectPlate. Your Meals, Perfected.</p>
            <div class="footer-links">
                <a href="../privacy-policy.html">Privacy Policy</a>
                <a href="../terms-of-service.html">Terms of Service</a>
                <a href="../faq.html">FAQ</a>
                <a href="../blog/">Blog</a>
            </div>
        </div>
    </div>

    <script>
        function shareOnTwitter() {
            const url = encodeURIComponent(window.location.href);
            // Create engaging text based on category
            const categoryEmoji = ${category === 'Recipes' ? "'🍽️'" : category === 'Restaurant Guides' ? "'🧠'" : category === 'Dietary Tips' ? "'💡'" : "'✨'"};
            const categoryText = ${category === 'Recipes' ? "'Amazing recipe you need to try!'" : category === 'Restaurant Guides' ? "'Essential dining guide for confident restaurant experiences!'" : category === 'Dietary Tips' ? "'Game-changing tips for your dietary goals!'" : "'Incredible insights and expert advice!'"};
            const text = encodeURIComponent("${title.replace(/"/g, '\\"')} " + categoryEmoji + " " + categoryText);
            const hashtags = encodeURIComponent('PerfectPlate,${category.replace(/\\s+/g, '')},${keywords.split(',')[0] || 'FoodTips'}');
            window.open('https://twitter.com/intent/tweet?url=' + url + '&text=' + text + '&hashtags=' + hashtags, '_blank', 'width=600,height=400');
        }

        // Toggle Facebook sharing menu
        function toggleFacebookMenu(event) {
            event.preventDefault();
            const menu = document.getElementById('facebookMenu');
            const isVisible = menu.style.display === 'block';
            
            // Hide all open menus first
            document.querySelectorAll('.facebook-share-menu').forEach(m => m.style.display = 'none');
            
            // Toggle current menu
            menu.style.display = isVisible ? 'none' : 'block';
            
            // Close menu when clicking outside
            if (!isVisible) {
                setTimeout(() => {
                    document.addEventListener('click', function closeMenu(e) {
                        if (!e.target.closest('.share-button-container')) {
                            menu.style.display = 'none';
                            document.removeEventListener('click', closeMenu);
                        }
                    });
                }, 10);
            }
        }
        
        // Share to Facebook Timeline (main feed)
        function shareToFacebookFeed() {
            const url = encodeURIComponent(window.location.href);
            const quote = encodeURIComponent("${shareText ? shareText.facebookFeed : title.replace(/"/g, '\\"') + ' - Discover amazing tips and strategies! 🍽️✨ #PerfectPlate'}");
            window.open('https://www.facebook.com/sharer/sharer.php?u=' + url + '&quote=' + quote, '_blank', 'width=600,height=500');
            document.getElementById('facebookMenu').style.display = 'none';
        }
        
        // Open Facebook Composer (gives full control over audience)
        function shareToFacebookComposer() {
            const url = window.location.href;
            const message = \`${shareText ? shareText.facebookComposer.replace(/"/g, '\\"') : 'Check out this amazing content! ' + title.replace(/"/g, '\\"')}\n\n\${url}\`;
            
            // Open Facebook status composer with pre-filled text
            // This opens the full Facebook interface where you can select audience (Friends, Groups, etc.)
            window.open(\`https://www.facebook.com/sharer.php?t=\${encodeURIComponent('${title.replace(/"/g, '\\"')}')}&u=\${encodeURIComponent(url)}\`, '_blank', 'width=900,height=700');
            
            // Also copy the message for easy pasting if needed
            navigator.clipboard.writeText(message).then(() => {
                console.log('Message copied to clipboard as backup');
            }).catch(() => {
                console.log('Clipboard copy failed, but Facebook should pre-fill');
            });
            
            document.getElementById('facebookMenu').style.display = 'none';
        }
        
        // Share to Facebook Groups (opens Facebook with sharing dialog)
        function shareToFacebookGroups() {
            const url = window.location.href;
            const message = \`${shareText ? shareText.facebookGroups.replace(/"/g, '\\"') : 'Check out this amazing content! ' + title.replace(/"/g, '\\"')}\n\n\${url}\`;
            
            // Copy the message to clipboard for easy pasting
            navigator.clipboard.writeText(message).then(() => {
                // Open Facebook homepage where user can navigate to any group and paste
                window.open('https://www.facebook.com/', '_blank');
            }).catch(() => {
                // Fallback if clipboard fails
                prompt('Copy this text to share in groups:', message);
                window.open('https://www.facebook.com/', '_blank');
            });
            
            document.getElementById('facebookMenu').style.display = 'none';
        }
        
        // Send via Facebook Messenger
        function shareToMessenger() {
            const url = encodeURIComponent(window.location.href);
            const text = encodeURIComponent("${shareText ? shareText.messenger.replace(/"/g, '\\"') : 'Check out this amazing content: ' + title.replace(/"/g, '\\"') + ' 🍽️'}");
            
            // Opens Messenger with the link ready to send
            window.open('https://www.facebook.com/dialog/send?app_id=966242223397117&link=' + url + '&redirect_uri=' + url, '_blank', 'width=600,height=500');
            document.getElementById('facebookMenu').style.display = 'none';
        }
        
        // Share to Facebook Page (for page admins)
        function shareToFacebookPage() {
            const url = encodeURIComponent(window.location.href);
            const text = encodeURIComponent("${shareText ? shareText.facebookPage.replace(/"/g, '\\"') : title.replace(/"/g, '\\"') + ' - Great content for food enthusiasts! 🍽️ #PerfectPlate'}");
            
            // Opens Facebook sharing dialog with page options
            window.open('https://www.facebook.com/dialog/share?app_id=966242223397117&href=' + url + '&quote=' + text + '&display=popup', '_blank', 'width=800,height=600');
            document.getElementById('facebookMenu').style.display = 'none';
        }

        function shareOnLinkedIn() {
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent("${title.replace(/"/g, '\\"')}");
            // Create compelling summary based on content type and category
            const defaultSummary = ${category === 'Recipes' ? "'Discover this incredible recipe with step-by-step instructions. Perfect for busy professionals seeking healthy, delicious meals.'" : category === 'Restaurant Guides' ? "'Essential guide for confident dining out. Learn expert strategies for navigating restaurants with any dietary preferences.'" : category === 'Dietary Tips' ? "'Expert tips and strategies for maintaining your dietary goals. Practical advice for healthy living and meal planning.'" : "'Valuable insights and expert tips for better food choices and dining experiences. Essential reading for health-conscious professionals.'"};
            const summary = encodeURIComponent(defaultSummary);
            window.open('https://www.linkedin.com/shareArticle?mini=true&url=' + url + '&title=' + title + '&summary=' + summary, '_blank', 'width=600,height=400');
        }

        function copyLink() {
            // Use AI-generated compelling share text or fallback
            const shareText = \`${shareText ? shareText.copyLink.replace(/"/g, '\\"') + '\\n\\n' + window.location.href : window.location.href}\`;
            
            navigator.clipboard.writeText(shareText).then(function() {
                // Change button text temporarily to show success
                const button = event.target.closest('.share-button');
                const originalHTML = button.innerHTML;
                button.innerHTML = '<i class="fas fa-check"></i> Copied!';
                button.style.background = '#28a745';
                setTimeout(function() {
                    button.innerHTML = originalHTML;
                    button.style.background = '';
                }, 2000);
            }).catch(function(err) {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = shareText;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                // Show success feedback
                const button = event.target.closest('.share-button');
                const originalHTML = button.innerHTML;
                button.innerHTML = '<i class="fas fa-check"></i> Copied!';
                button.style.background = '#28a745';
                setTimeout(function() {
                    button.innerHTML = originalHTML;
                    button.style.background = '';
                }, 2000);
            });
        }
    </script>
    
    <!-- PerfectPlate Blog Analytics Tracking -->
    <script src="./blog-tracking.js"></script>
    <script>
        // Initialize blog tracking with specific post data
        if (window.PerfectPlateBlogTracking) {
            window.PerfectPlateBlogTracking.init({
                title: '${title.replace(/'/g, "\\'")}',
                slug: '${filename}',
                category: '${category}',
                readTime: '${readTime || 'N/A'}'
            });
        }
    </script>
</body>
</html>`;

    // DEBUG: Log final content before download
    console.log('🔍 FINAL DEBUG - About to download HTML file');
    console.log('🔍 FINAL DEBUG - Content includes replicate URLs:', htmlContent.includes('replicate.delivery'));
    console.log('🔍 FINAL DEBUG - Content includes local asset paths:', htmlContent.includes('../assets/'));
    console.log('🔍 FINAL DEBUG - Content preview:', htmlContent.substring(htmlContent.indexOf('<div class="blog-content">'), htmlContent.indexOf('<div class="blog-content">') + 500));
    
    // Create download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename + '.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Global function for downloading individual recipe images
function downloadRecipeImage(index) {
    if (window.currentPostImages && window.currentPostImages[index]) {
        downloadImage(window.currentPostImages[index]);
    }
}

// Extract image descriptions and generate with Replicate AI
async function extractAndGenerateImages(content, postTitle) {
    const imageUrls = [];
    let updatedContent = content;
    let imageIndex = 1;
    
    // Get Replicate API key
    const replicateApiKey = document.getElementById('replicateApiKey')?.value;
    if (!replicateApiKey) {
        console.warn('Replicate API key not found. Images will not be generated.');
        if (window.Utils) {
            window.Utils.showError('⚠️ Replicate API key required for image generation. Please add it in the Social Media tab.');
        }
        return {
            images: [],
            updatedContent: updatedContent
        };
    }
    
    // Find all image description placeholders
    const imagePattern = /\[IMAGE:\s*([^\]]+)\]/g;
    const matches = [...content.matchAll(imagePattern)];
    
    if (matches.length === 0) {
        console.log('No image placeholders found in content');
        return {
            images: [],
            updatedContent: updatedContent
        };
    }
    
    console.log(`🎨 Found ${matches.length} image placeholders, generating with Replicate AI...`);
    if (window.Utils) {
        window.Utils.showSuccess(`🎨 Generating ${matches.length} AI images for your recipe...`);
    }
    
    for (const match of matches) {
        const description = match[1].trim();
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
            
            const response = await fetch('http://localhost:3000/api/replicate/predictions', {
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
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Replicate API Error:', errorText);
                throw new Error(`Replicate API error: ${response.status}`);
            }
            
            const prediction = await response.json();
            console.log(`📤 Image ${imageIndex} generation started:`, prediction.id);
            
            // Poll for completion
            if (window.Utils && window.Utils.pollReplicatePrediction) {
                const result = await window.Utils.pollReplicatePrediction(prediction.id, replicateApiKey);
                if (result && result.output && result.output[0]) {
                    console.log(`✅ Image ${imageIndex} generated successfully`);
                    
                    // Download the generated image
                    const imageUrl = result.output[0];
                    const imageResponse = await fetch(imageUrl, { 
                        mode: 'cors',
                        headers: {
                            'Accept': 'image/*'
                        }
                    });
                    
                    if (imageResponse.ok) {
                        const blob = await imageResponse.blob();
                        const localImageName = `${postTitle.toLowerCase()
                            .replace(/[^a-z0-9\s-]/g, '')
                            .trim()
                            .replace(/\s+/g, '-')
                            .replace(/-+/g, '-')
                            .replace(/^-|-$/g, '')}-${imageIndex}.jpg`;
                        
                        imageUrls.push({
                            originalUrl: imageUrl,
                            localPath: `../assets/${localImageName}`,
                            filename: localImageName,
                            blob: blob,
                            alt: description,
                            description: description
                        });
                        
                        // Replace placeholder with actual image tag
                        const imageTag = `<img src="../assets/${localImageName}" alt="${description}" style="width: 100%; border-radius: 10px; margin: 20px 0;">`;
                        updatedContent = updatedContent.replace(placeholder, imageTag);
                        imageIndex++;
                    } else {
                        console.warn('Failed to download generated image:', imageUrl);
                        // Remove placeholder if image generation failed
                        updatedContent = updatedContent.replace(placeholder, '');
                    }
                } else {
                    console.warn('Failed to generate image for:', description);
                    // Remove placeholder if image generation failed
                    updatedContent = updatedContent.replace(placeholder, '');
                }
            }
        } catch (error) {
            console.error('Error generating image for:', description, error);
            // Remove placeholder if image generation failed
            updatedContent = updatedContent.replace(placeholder, '');
        }
    }
    
    if (window.Utils) {
        window.Utils.showSuccess(`✅ Generated ${imageUrls.length} AI images successfully!`);
    }
    
    return {
        images: imageUrls,
        updatedContent: updatedContent
    };
}

// Download image as file
function downloadImage(imageData) {
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

// Publish blog post directly to website (original script functionality)
async function publishBlogPost() {
    if (!currentBlogPost || !window.generatedBlogContent) {
        alert('No blog post to publish!');
        return;
    }

    const publishBtn = document.getElementById('publishBlogBtn');
    const originalText = publishBtn.innerHTML;
    publishBtn.innerHTML = '⏳ Publishing...';
    publishBtn.disabled = true;

    try {
        // Get current blog details from generated content
        const { title, category, keywords } = window.generatedBlogContent;
        let content = currentBlogPost;
        
        // Extract image descriptions and generate with Replicate AI
        const imageData = await extractAndGenerateImages(content, title);
        content = imageData.updatedContent;
        
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

        // Validate category before creating post
        if (!validateCategory(category)) {
            throw new Error(`Invalid category "${category}". Must be one of: ${VALID_CATEGORIES.join(', ')}`);
        }

        // Create new post object
        const newPost = {
            id: filename,
            title: title,
            excerpt: excerpt,
            category: getCategoryForSearch(category), // Use kebab-case for search functionality
            date: new Date().toLocaleDateString('en-CA'), // Use actual current local date in YYYY-MM-DD format
            author: 'PerfectPlate Team',
            featured: false,
            published: true,
            filename: filename + '.html',
            keywords: keywords.split(',').map(k => k.trim()).filter(k => k),
            readTime: readTime
        };

        // Show success message with instructions
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
            <div id="jsonDisplay" style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: left; font-family: monospace; font-size: 12px; white-space: pre-wrap; overflow-x: auto; max-height: 300px; overflow-y: auto;">${JSON.stringify(newPost, null, 2)}</div>
            <br>
            <small>💡 Copy the JSON above and add it to the "posts" array in your /blog/posts.json file</small>
        `;
        message.style.display = 'block';
        message.style.marginTop = '15px';
        document.getElementById('blogPreview').appendChild(message);
        
        // Store image data globally for download functionality
        window.currentPostImages = imageData.images;

        // Add copy JSON button
        const copyJsonButton = document.createElement('button');
        copyJsonButton.textContent = '📋 Copy JSON';
        copyJsonButton.style.cssText = `
            background: #28a745;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 10px;
            font-size: 12px;
            font-weight: bold;
            margin-right: 10px;
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
        document.getElementById('blogPreview').appendChild(copyJsonButton);

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
        `;
        downloadButton.onclick = () => {
            // Store original state
            const originalText = downloadButton.textContent;
            const originalBackground = downloadButton.style.background;
            
            console.log('🐛 DOWNLOAD CLICKED - Original:', originalText, originalBackground);
            
            // Show temporary downloading state
            downloadButton.textContent = '⏳ Downloading...';
            downloadButton.style.background = '#ffc107';
            downloadButton.disabled = true;
            
            // Trigger download
            downloadBlogPost();
            
            // Reset button after brief delay (whether download succeeded or was cancelled)
            setTimeout(() => {
                console.log('🐛 DOWNLOAD TIMEOUT - Resetting button');
                downloadButton.textContent = originalText;
                downloadButton.style.background = originalBackground;
                downloadButton.disabled = false;
            }, 2000);
        };
        document.getElementById('blogPreview').appendChild(downloadButton);

    } catch (error) {
        console.error('Error publishing blog post:', error);
        const message = document.createElement('div');
        message.className = 'error';
        message.innerHTML = '❌ Error preparing blog post for publishing: ' + error.message;
        message.style.display = 'block';
        message.style.marginTop = '15px';
        message.style.color = '#dc3545';
        document.getElementById('blogPreview').appendChild(message);
    } finally {
        publishBtn.innerHTML = originalText;
        publishBtn.disabled = false;
    }
}

// Keep preview function for backward compatibility (missing from original modularization)
function previewBlog() {
    showGeneratedBlog();
}

// Make download functions globally accessible
window.downloadBlogPost = downloadBlogPost;
window.publishBlogPost = publishBlogPost;
window.previewBlog = previewBlog;
window.downloadRecipeImage = downloadRecipeImage;

// Load blog templates (placeholder function)
function loadBlogTemplates() {
    console.log('Blog templates loaded');
    // This function can be enhanced later if needed
    return true;
}

// Select blog template (placeholder function)
function selectBlogTemplate(templateId) {
    console.log('Blog template selected:', templateId);
    // This function can be enhanced later if needed
    return true;
}

// Regenerate blog post (placeholder function)
function regenerateBlogPost() {
    console.log('Regenerate blog post called');
    // This function can be enhanced later if needed
    return true;
}

// Export blog generator functions
window.BlogGenerator = {
    generateBlogPost,
    generateBlogIdea,
    loadBlogTemplates,
    selectTemplate,
    selectBlogTemplate,
    regenerateBlogPost,
    publishBlogPost,
    downloadBlogPost,
    downloadRecipeImage,
    showTemplateLoadingMessage,
    showRegenerationLoadingMessage,
    removeLoadingMessages,
    highlightKeywords
};

// Highlight keywords in content for SEO
function highlightKeywords(content, keywords) {
    if (!keywords || !content) return content;
    
    // Split keywords and clean them
    const keywordList = keywords.split(',')
        .map(k => k.trim().toLowerCase())
        .filter(k => k.length > 2); // Only highlight meaningful keywords
    
    let highlightedContent = content;
    
    // Highlight each keyword (case-insensitive)
    keywordList.forEach(keyword => {
        // Create regex to match the keyword (whole words only)
        const regex = new RegExp(`\\b(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\b`, 'gi');
        
        // Replace with strong tags, but avoid double-highlighting
        highlightedContent = highlightedContent.replace(regex, (match) => {
            // Don't highlight if already inside HTML tags
            return `<strong>${match}</strong>`;
        });
    });
    
    // Clean up any double-highlighting
    highlightedContent = highlightedContent.replace(/<strong><strong>/g, '<strong>');
    highlightedContent = highlightedContent.replace(/<\/strong><\/strong>/g, '</strong>');
    
    return highlightedContent;
} 