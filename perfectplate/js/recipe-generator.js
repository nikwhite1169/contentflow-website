// Recipe Generation Module
// Handles diet selection, recipe generation, and image creation

let selectedRecipeDiet = null;

// Generate custom sharing text using Gemini
async function generateSharingText(title, category, content) {
    const apiKey = localStorage.getItem('geminiApiKey');
    if (!apiKey) {
        console.warn('No Gemini API key found, using fallback sharing text');
        return {
            facebookFeed: `🍽️ Check out this amazing ${category.toLowerCase()}: "${title}"`,
            facebookComposer: `Just discovered this incredible ${category.toLowerCase()} and had to share! "${title}" - it's exactly what I've been looking for. Perfect for anyone who loves great food!`,
            facebookGroups: `Hey everyone! Found this fantastic ${category.toLowerCase()} that you all might love: "${title}". It's been a game-changer for me!`,
            messenger: `You need to see this ${category.toLowerCase()}: "${title}" - it's amazing! 🍽️`
        };
    }

    try {
        // Extract key details from content for more targeted sharing text
        const contentPreview = content.replace(/<[^>]*>/g, '').substring(0, 500);
        
        const prompt = `Create 4 different social media sharing messages for this blog post. Make each one unique, engaging, and appropriate for its platform:

BLOG POST DETAILS:
Title: "${title}"
Category: "${category}"
Content Preview: "${contentPreview}"

Generate 4 variants:

1. FACEBOOK_FEED: A polished, engaging post for Facebook timeline (max 2 sentences, include emojis)
2. FACEBOOK_COMPOSER: A personal, enthusiastic message for sharing with friends/groups (conversational tone, 2-3 sentences) 
3. FACEBOOK_GROUPS: A helpful, community-focused message for food/recipe groups (starts with "Hey everyone!", shares personal experience)
4. MESSENGER: A brief, exciting message to send to friends (1-2 sentences, casual tone, include emoji)

Make each message unique and avoid generic phrases like "perfect for busy weeknights" unless the content specifically mentions that. Focus on what makes THIS specific content special and exciting.

Format as JSON:
{
  "facebookFeed": "message here",
  "facebookComposer": "message here", 
  "facebookGroups": "message here",
  "messenger": "message here"
}`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.8,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                }
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const generatedText = data.candidates[0].content.parts[0].text;
        
        // Extract JSON from the response
        const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const shareText = JSON.parse(jsonMatch[0]);
            console.log('✅ Generated custom sharing text:', shareText);
            return shareText;
        } else {
            throw new Error('Could not parse JSON from response');
        }
        
    } catch (error) {
        console.error('Error generating sharing text:', error);
        // Fallback sharing text
        return {
            facebookFeed: `🍽️ Check out this amazing ${category.toLowerCase()}: "${title}"`,
            facebookComposer: `Just discovered this incredible ${category.toLowerCase()} and had to share! "${title}" - it's exactly what I've been looking for.`,
            facebookGroups: `Hey everyone! Found this fantastic ${category.toLowerCase()}: "${title}". It's been a game-changer for me!`,
            messenger: `You need to see this ${category.toLowerCase()}: "${title}" - it's amazing! 🍽️`
        };
    }
}

// Recipe diet categories - only the specified diets
const recipeDietCategories = {
    'keto': {
        diet: 'keto',
        emoji: '🥑',
        name: 'Keto',
        description: 'Low-carb, high-fat',
        keywords: ['keto', 'ketogenic', 'low carb', 'high fat', 'recipe'],
    },
    'vegan': {
        diet: 'vegan',
        emoji: '🌱',
        name: 'Vegan',
        description: 'Plant-based only',
        keywords: ['vegan', 'plant-based', 'dairy-free', 'recipe'],
    },
    'vegetarian': {
        diet: 'vegetarian',
        emoji: '🥬',
        name: 'Vegetarian',
        description: 'No meat',
        keywords: ['vegetarian', 'no meat', 'meatless', 'recipe'],
    },
    'gluten-free': {
        diet: 'gluten-free',
        emoji: '🌾',
        name: 'Gluten-Free',
        description: 'No gluten',
        keywords: ['gluten-free', 'celiac-safe', 'wheat-free', 'recipe'],
    },
    'paleo': {
        diet: 'paleo',
        emoji: '🥩',
        name: 'Paleo',
        description: 'Whole foods only',
        keywords: ['paleo', 'paleolithic', 'whole foods', 'grain-free', 'recipe'],
    },
    'diabetic-friendly': {
        diet: 'diabetic-friendly',
        emoji: '🏥',
        name: 'Diabetic-Friendly',
        description: 'Blood sugar conscious',
        keywords: ['diabetic-friendly', 'blood sugar', 'diabetes', 'low glycemic', 'recipe'],
    }
};

// Select recipe diet template (just visual selection, no content generation)
function selectRecipeDiet(dietId) {
    selectedRecipeDiet = dietId; // Track the current diet
    
    // Remove selected class from all cards
    document.querySelectorAll('.recipe-diet-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selected class to clicked card (handle both card and inner elements)
    const clickedCard = event.target.closest('.recipe-diet-card');
    if (clickedCard) {
        clickedCard.classList.add('selected');
    }
    
    // Diet selected - no annoying toasts needed
}

// Generate new recipe ideas for selected diet (called by "Generate New Ideas" button)
async function regenerateCurrentRecipeDiet() {
    if (!selectedRecipeDiet) {
        alert('Please select a diet type first!');
        return;
    }
    
    // Show loading message below the Generate New Ideas button
    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'loading-message';
    loadingMsg.innerHTML = `⏳ AI is generating ${recipeDietCategories[selectedRecipeDiet].name} recipe ideas... Please wait.`;
    loadingMsg.style.cssText = `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
        color: white; 
        padding: 15px 20px; 
        border-radius: 12px; 
        margin: 15px 0; 
        font-weight: 500;
        display: block;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        text-align: center;
        font-size: 14px;
    `;
    
    // Find the template-actions div (contains the Generate New Ideas button) and insert after it
    const templateActions = document.querySelector('.template-actions');
    if (templateActions) {
        templateActions.insertAdjacentElement('afterend', loadingMsg);
    } else {
        // Fallback to template section if template-actions not found
        const templateSection = document.querySelector('.template-section');
        if (templateSection) {
            templateSection.appendChild(loadingMsg);
        }
    }
    
    try {
        // Generate recipe ideas (not full content) using the selected diet
        const recipeIdeas = await generateRecipeIdeas(selectedRecipeDiet);
        if (recipeIdeas) {
            // Fill form with recipe ideas
            const titleInput = document.getElementById('blogTitle');
            const categoryInput = document.getElementById('blogCategory');
            const keywordsInput = document.getElementById('blogKeywords');
            const toneInput = document.getElementById('blogTone');
            const lengthInput = document.getElementById('blogLength');
            const outlineInput = document.getElementById('blogOutline');
            
            if (titleInput) titleInput.value = recipeIdeas.title;
            if (categoryInput) {
                categoryInput.value = recipeIdeas.category;
                console.log('🔍 Category set to:', recipeIdeas.category, 'Field value now:', categoryInput.value);
            }
            if (keywordsInput) keywordsInput.value = recipeIdeas.keywords;
            if (toneInput) toneInput.value = recipeIdeas.tone;
            if (lengthInput) lengthInput.value = recipeIdeas.length;
            if (outlineInput) outlineInput.value = recipeIdeas.outline;
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success';
            successMessage.innerHTML = `🔄 New recipe ideas generated: "${recipeIdeas.title}" - Edit the form as needed, then click "Generate Blog Post"!`;
            successMessage.style.display = 'block';
            successMessage.style.marginTop = '15px';
            
            // Remove any existing messages
            const existingMessage = document.querySelector('.template-section .success');
            if (existingMessage) {
                existingMessage.remove();
            }
            
            // Add message to template section
            const templateSection = document.querySelector('.template-section');
            if (templateSection) {
                templateSection.appendChild(successMessage);
            }
            
            // Remove message after 4 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 4000);
        } else {
            alert('Failed to generate recipe ideas. Please try again.');
        }
    } catch (error) {
        console.error('Error generating recipe ideas:', error);
        alert('Error generating recipe ideas: ' + error.message);
    } finally {
        // Remove loading message
        loadingMsg.remove();
    }
}

// Generate recipe ideas (not full content) for form filling
async function generateRecipeIdeas(diet) {
    console.log('generateRecipeIdeas called with diet:', diet);
    
    if (!diet) {
        console.error('Diet parameter is null or undefined!');
        return null;
    }
    
    // Get API key
    let apiKey = localStorage.getItem('geminiApiKey') || '';
    if (!apiKey) {
        const apiKeyElement = document.getElementById('geminiApiKey');
        apiKey = apiKeyElement ? apiKeyElement.value : '';
    }
    
    if (!apiKey) {
        alert('Please enter your Gemini API key first!');
        return null;
    }
    
    try {
        const dietInfo = recipeDietCategories[diet];
        if (!dietInfo) {
            throw new Error(`Unknown diet type: ${diet}`);
        }
        
        const prompt = `Generate a single ${diet} recipe blog post idea with SEO content for the PerfectPlate food app blog. Keep it simple and focused on ONE recipe.

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

DIET: ${dietInfo.name} (${dietInfo.description})

Create an inspiring blog post idea for ONE creative ${diet} recipe. Think beyond basic dishes - create something that will excite readers and make them want to cook immediately.

TITLE INSPIRATION (create varied, enticing titles):
- Mix up your approach: technique-focused, flavor-focused, benefit-focused, or story-driven
- Use evocative, appetizing language that makes people want to cook
- Avoid repetitive patterns like "Recipe Name: A Diet Word" every single time
- Think like a food blogger creating click-worthy titles that vary in style

RECIPE INSPIRATION TYPES (choose one approach):
- Quick 20-minute ${diet} weeknight dinner
- Simple ${diet} comfort food with big flavors
- Easy one-pan ${diet} meal for busy nights
- Restaurant-inspired ${diet} dish adapted for home cooking
- International cuisine with a ${diet} twist
- Comfort food reimagined with ${diet} principles
- Seasonal ${diet} recipe with fresh, vibrant ingredients
- Fusion recipe combining ${diet} with unexpected flavors
- Traditional ${diet} recipe with modern presentation
- Creative use of trending ${diet} ingredients

TITLE APPROACH:
- Create varied, enticing blog titles that make people excited to cook
- Mix up your style: sometimes technique ("The Secret to..."), sometimes flavor ("Bold Spicy..."), sometimes benefit ("Quick 20-Minute..."), sometimes story ("Why This Recipe...")
- Avoid repetitive colon patterns and subtitle formats

RECIPE SHOULD FEATURE:
- Interesting cooking techniques or flavor combinations (appropriate for skill level)
- 4-12 ingredients depending on complexity (more for advanced, fewer for quick meals)
- Multiple textures and flavor layers
- Cooking tips and techniques appropriate for the audience
- Instagram-worthy presentation potential

Format your response as:
TITLE: [Varied, enticing title - mix up your approach each time]
KEYWORDS: [8-10 specific SEO keywords including cooking techniques, ingredients, and ${diet} terms]
OUTLINE: [Detailed outline covering: recipe story/inspiration, ingredient spotlight, step-by-step cooking method breakdown, chef's tips for perfection, nutritional analysis for ${diet}, styling and serving suggestions, and subtle mention of PerfectPlate's custom recipe features when relevant]

Create something delicious and inspiring - avoid basic sheet pan or one-pot recipes unless they have a unique twist. Write in an engaging, food-focused tone.`;
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${prompt}

After creating your recipe content, generate an enticing blog title that will make readers excited to try this recipe. Mix up your approach - sometimes highlight the technique, sometimes the flavors, sometimes the benefits. Avoid using the same "Recipe: A Diet Word" pattern repeatedly.

OUTPUT FORMAT (exactly these 3 lines):
TITLE: <your natural, appropriate title>
KEYWORDS: <csv keywords>
OUTLINE: <outline text>
`
                    }]
                }]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message || 'API Error');
        }

        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error('Invalid response from Gemini API');
        }

        const aiResponse = data.candidates[0].content.parts[0].text;
        
        // Clean markdown code blocks from AI response
        const cleanedResponse = aiResponse
            .replace(/```html\s*/gi, '')  // Remove opening ```html
            .replace(/```\s*$/gi, '')      // Remove closing ```
            .replace(/^\s*```/gm, '')      // Remove any remaining ``` at start of lines
            // Fix formatting issues
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Add proper spacing after image descriptions
            .replace(/(\b(?:image|photo|picture|bowl|plate|dish|recipe)\b)(\s*)([A-Z])/g, '$1.</p>\n\n<p>$3')
            .trim();
        console.log('🐛 CLEANED MARKDOWN BLOCKS IN RECIPE IDEAS');
        
        // Parse the response (robust, case-insensitive, tolerates spaces)
        let title = `${dietInfo.emoji} ${dietInfo.name} Recipe`;
        let keywords = dietInfo.keywords.join(', ');
        let outline = `Blog post outline for ${diet} recipes`;

        const titleMatch = cleanedResponse.match(/^\s*TITLE\s*:\s*(.+)$/mi);
        if (titleMatch && titleMatch[1]) {
            title = titleMatch[1].trim();
        }
        const keywordsMatch = cleanedResponse.match(/^\s*KEYWORDS\s*:\s*(.+)$/mi);
        if (keywordsMatch && keywordsMatch[1]) {
            keywords = keywordsMatch[1].trim();
        }
        const outlineMatch = cleanedResponse.match(/^\s*OUTLINE\s*:\s*([\s\S]+)$/mi);
        if (outlineMatch && outlineMatch[1]) {
            outline = outlineMatch[1].trim();
        }
        
        // If outline is too short, add more detail from the full response
        if (outline.length < 100) {
            outline = cleanedResponse.replace(/^TITLE:.*$/gm, '').replace(/^KEYWORDS:.*$/gm, '').trim();
        }
        
        return {
            title,
            category: 'recipes', // Lowercase to match posts.json categories
            keywords,
            tone: 'friendly',
            length: 'medium',
            outline,
            selectedDiet: diet // Store the selected diet for later use
        };
    } catch (error) {
        console.error('Error generating recipe ideas:', error);
        alert('Error generating recipe ideas: ' + error.message);
        return null;
    }
}

async function generateDynamicRecipeContent(diet) {
    console.log('generateDynamicRecipeContent called with diet:', diet); // Debug log
    
    // Validate diet parameter
    if (!diet) {
        console.error('Diet parameter is null or undefined!');
        alert('Error: Diet type not specified. Please try selecting a diet again.');
        return null;
    }
    
    // Get API key
    let apiKey = localStorage.getItem('geminiApiKey') || '';
    if (!apiKey) {
        const apiKeyElement = document.getElementById('geminiApiKey');
        apiKey = apiKeyElement ? apiKeyElement.value : '';
    }
    
    console.log('API Key available:', !!apiKey); // Debug log
    
    if (!apiKey) {
        alert('Please enter your Gemini API key first!');
        return null;
    }
    
    try {
        console.log('Generating recipe content for diet:', diet); // Debug log
        
        const dietEmojis = {
            'keto': '🥑',
            'paleo': '🥩', 
            'vegan': '🌱',
            'vegetarian': '🥬',
            'gluten-free': '🌾',
            'mediterranean': '🫒'
        };
        
        const dietDescriptions = {
            'keto': 'ketogenic (low-carb, high-fat)',
            'paleo': 'paleo (whole foods, grain-free)',
            'vegan': 'vegan (plant-based)',
            'vegetarian': 'vegetarian (no meat)',
            'gluten-free': 'gluten-free (celiac-safe)',
            'mediterranean': 'Mediterranean (healthy fats, fish)'
        };
        
        const recipeComplexityOptions = [
            // Easy/Quick Options (40% of recipes)
            'quick 20-minute weeknight dinner',
            'simple comfort food with minimal prep',
            'easy one-pan meal with bold flavors',
            'beginner-friendly recipe with foolproof techniques',
            // Medium Complexity (40% of recipes) 
            'comfort food classic with a modern twist',
            'hearty family-style recipe',
            'seasonal recipe featuring fresh ingredients',
            'impressive dish that looks harder than it is',
            // Advanced Options (20% of recipes)
            'restaurant-quality dish made at home',
            'creative fusion recipe',
            'traditional recipe with authentic techniques',
            'elegant dish perfect for entertaining'
        ];

        const cookingMethods = [
            // Quick Methods (for easy recipes)
            'quickly sautéed with fresh herbs',
            'simply roasted with minimal prep',
            'tossed together in one pan',
            'lightly pan-fried for golden texture',
            // Medium Methods
            'slow-cooked and deeply flavorful',
            'quick seared and finished in the oven', 
            'roasted to caramelized perfection',
            'stir-fried with vibrant vegetables',
            // Advanced Methods
            'braised until tender',
            'grilled with smoky char',
            'baked with layers of flavor',
            'simmered in aromatic spices'
        ];

        const randomComplexity = recipeComplexityOptions[Math.floor(Math.random() * recipeComplexityOptions.length)];
        const randomMethod = cookingMethods[Math.floor(Math.random() * cookingMethods.length)];

        // Determine recipe complexity level based on selected style
        const isEasyRecipe = randomComplexity.includes('quick') || randomComplexity.includes('simple') || randomComplexity.includes('easy') || randomComplexity.includes('beginner');
        const isAdvancedRecipe = randomComplexity.includes('restaurant') || randomComplexity.includes('fusion') || randomComplexity.includes('traditional') || randomComplexity.includes('elegant');
        
        let ingredientCount, stepCount, difficultyLevel;
        if (isEasyRecipe) {
            ingredientCount = '4-7 ingredients';
            stepCount = '4-6 simple steps';
            difficultyLevel = 'Beginner';
        } else if (isAdvancedRecipe) {
            ingredientCount = '10-15 ingredients for complex flavors';
            stepCount = '8-12 detailed steps with techniques';
            difficultyLevel = 'Intermediate-Advanced';
        } else {
            ingredientCount = '7-10 ingredients for good flavor depth';
            stepCount = '6-8 cooking steps';
            difficultyLevel = 'Beginner-Intermediate';
        }

        // Let AI choose ingredients completely freely - no hardcoded options

        const prompt = `Create an inspiring and delicious ${diet} recipe that's a ${randomComplexity}. Make it ${randomMethod}.

TITLE REQUIREMENTS: Create a title using ONLY ONE of these exact formats (choose randomly):
1. "The Secret to [cooking technique/result]"
2. "Bold [flavor description] [main ingredient]"  
3. "Quick [time] [dish name]"
4. "Why This [ingredient/dish] Works"
5. "Perfect [cooking method] [main ingredient]"
6. "Simple [main ingredient] with [flavor profile]"

ABSOLUTELY FORBIDDEN: Any title containing colons (:), "Paradise", "Powerhouse", "Delight", "Adventure", "Escape", "Obsession", or "A [Diet] [Word]" patterns.

RECIPE REQUIREMENTS:
- Follow ${dietDescriptions[diet]} diet principles strictly
- Create something interesting and flavorful, not basic or boring
- Use ${ingredientCount} (herbs/spices count as 1 ingredient each)
- Include ${stepCount} that build flavor
- Make it achievable for home cooks at the ${difficultyLevel} level
- Include proper seasoning and flavor development techniques
- Add cooking tips and techniques for best results

CREATIVITY GUIDELINES:
- Incorporate interesting flavor combinations or techniques
- Use herbs, spices, and aromatics generously
- Include texture contrasts (seared, silky, tender, charred, etc.)
- Consider umami elements and flavor layering
- Make it Instagram-worthy and delicious
- Avoid generic "sheet pan" or "one-pot" recipes unless specifically interesting

INGREDIENT CREATIVITY:
- Choose ingredients based on flavor harmony, seasonality, and what creates the most delicious recipe
- Be creative and surprising - avoid repetitive or predictable combinations
- Think like a chef creating a signature dish - what ingredients would make this truly special?
- Consider texture contrasts, color variety, and complementary flavors

Format:
TITLE: [Must use one of the 6 approved formats above - NO other patterns allowed]
KEYWORDS: recipe, cooking, gourmet meal, delicious food

RECIPE CONTENT:
**[Recipe Name]**

*Description: [2-3 sentences about what makes this recipe special and delicious]*

**Time:** Prep X min | Cook X min | Serves X | Difficulty: ${difficultyLevel}

**Ingredients:**
- [ingredient with specific amount and preparation notes]
- [ingredient with specific amount and preparation notes]
- [continue with all ingredients - ${ingredientCount}]

**Instructions:**
1. [${isEasyRecipe ? 'Simple first step' : 'Detailed first step with technique explanation'}]
2. [${isEasyRecipe ? 'Straightforward second step' : 'Detailed second step building on the first'}]
3. [Continue with ${isEasyRecipe ? 'clear, simple' : 'detailed'} steps - ${stepCount}]
${isEasyRecipe ? '' : '[Include cooking tips and temperature guidelines where relevant]'}

**Chef's Tips:** [2-3 professional tips for best results]

**Nutrition Highlights:** [Key nutritional benefits and why this fits the ${diet} diet]

**Serving Suggestions:** [How to plate and what to serve alongside]

Generate a creative, flavorful recipe now:`;

        console.log('Making API request to Gemini...'); // Debug log

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

        console.log('API response status:', response.status); // Debug log

        const data = await response.json();
        
        console.log('API response data:', data); // Debug log
        
        if (data.error) {
            console.error('API Error details:', data.error); // Debug log
            throw new Error(data.error.message || 'API Error');
        }

        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            console.error('Invalid API response structure:', data); // Debug log
            throw new Error('Invalid response from Gemini API');
        }

        const aiResponse = data.candidates[0].content.parts[0].text;
        console.log('AI response received, length:', aiResponse.length); // Debug log
        
        // Clean markdown code blocks from AI response
        const cleanedResponse = aiResponse
            .replace(/```html\s*/gi, '')  // Remove opening ```html
            .replace(/```\s*$/gi, '')      // Remove closing ```
            .replace(/^\s*```/gm, '')      // Remove any remaining ``` at start of lines
            // Fix formatting issues
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Add proper spacing after image descriptions
            .replace(/(\b(?:image|photo|picture|bowl|plate|dish|recipe)\b)(\s*)([A-Z])/g, '$1.</p>\n\n<p>$3')
            .trim();
        console.log('🐛 CLEANED MARKDOWN BLOCKS IN RECIPE');
        
        // Parse AI response for the simplified format
        let title = `${dietEmojis[diet]} ${diet.charAt(0).toUpperCase() + diet.slice(1)} Recipe`;
        let keywords = `${diet} recipe, healthy cooking`;
        let recipeContent = cleanedResponse;

        const fullTitleMatch = cleanedResponse.match(/^\s*TITLE\s*:\s*(.+)$/mi);
        if (fullTitleMatch && fullTitleMatch[1]) {
            title = fullTitleMatch[1].trim();
        }
        const fullKeywordsMatch = cleanedResponse.match(/^\s*KEYWORDS\s*:\s*(.+)$/mi);
        if (fullKeywordsMatch && fullKeywordsMatch[1]) {
            keywords = fullKeywordsMatch[1].trim();
        }
        
        // Format the recipe content for display (images will be generated from [IMAGE: ] placeholders in the content)
        let formattedContent = recipeContent;
        
        // Convert markdown-style formatting to HTML
        formattedContent = formattedContent.replace(/\*\*([^*]+)\*\*/g, '<h3>$1</h3>');
        formattedContent = formattedContent.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        formattedContent = formattedContent.replace(/^- (.+)$/gm, '<li>$1</li>');
        formattedContent = formattedContent.replace(/^(\d+\. .+)$/gm, '<li>$1</li>');
        
        // Wrap ingredient and instruction lists
        formattedContent = formattedContent.replace(/(<li>[^<]*ingredient[^<]*<\/li>(?:\s*<li>[^<]*<\/li>)*)/gi, '<ul>$1</ul>');
        formattedContent = formattedContent.replace(/(<li>\d+\.[^<]*<\/li>(?:\s*<li>\d+\.[^<]*<\/li>)*)/gi, '<ol>$1</ol>');
        
        // Convert line breaks to paragraphs
        formattedContent = formattedContent.replace(/\n\n/g, '</p><p>').replace(/^/, '<p>').replace(/$/, '</p>');
        
        // Clean up extra content after RECIPE CONTENT:
        const recipeContentStart = formattedContent.indexOf('RECIPE CONTENT:');
        if (recipeContentStart !== -1) {
            formattedContent = formattedContent.substring(recipeContentStart + 'RECIPE CONTENT:'.length).trim();
        }

        // Enforce click-worthy single-recipe title if model drifted
        if (/collection|roundup|guide|compilation/i.test(title)) {
            // Try to salvage a recipe name from content
            const nameGuess = (cleanedResponse.match(/\*\*\[(.*?)\]\*\*/)
                || cleanedResponse.match(/\*\*([^*]+)\*\*/)
                || [null, 'Flavorful']).pop();
            title = `${dietEmojis[diet]} ${nameGuess} (${diet.charAt(0).toUpperCase() + diet.slice(1)})`;
        }
        
        // Additional check for overused words in titles
        const overusedWords = ['delight', 'paradise', 'powerhouse', 'adventure', 'escape', 'obsession', 'perfect', 'ultimate', 'amazing', 'best'];
        const titleLower = title.toLowerCase();
        if (overusedWords.some(word => titleLower.includes(word))) {
            console.warn('⚠️ Title contains overused words, but keeping AI-generated title:', title);
            // Could implement title regeneration here if needed
        }
        
        console.log('Recipe content generated successfully'); // Debug log
        
        return {
            title,
            category: 'recipes', // Lowercase to match posts.json categories
            keywords,
            tone: 'friendly',
            length: 'medium',
            outline: formattedContent,
            isRecipeReady: true // Flag to indicate this should be shown directly
        };
    } catch (error) {
        console.error('Error generating recipe content:', error);
        alert('Error generating recipe content: ' + error.message + '. Please check the console for details.');
        return null;
    }
}

// Generate recipe image using Replicate AI
async function getRecipeImage(searchTerm) {
    try {
        // Get Replicate API key from social media tab
        const replicateApiKey = document.getElementById('replicateApiKey')?.value;
        if (!replicateApiKey) {
            console.warn('Replicate API key not found. Please add it in the Social Media tab.');
            if (window.Utils) {
                window.Utils.showError('⚠️ Replicate API key required for image generation. Please add it in the Social Media tab.');
            }
            return null;
        }
        
        console.log('🔑 Found Replicate API key (length):', replicateApiKey.length);
        console.log('🔑 API key starts with:', replicateApiKey.substring(0, 8) + '...');
        
        // Show visible debug message on page
        if (window.Utils) {
            window.Utils.showSuccess(`🔑 Using API key: ${replicateApiKey.substring(0, 8)}... (length: ${replicateApiKey.length})`);
        }
        
        // Create professional food photography prompt
        const enhancedPrompt = `Professional food photography of ${searchTerm}, beautiful plating, natural lighting, top-down view, vibrant colors, 4k detail, photorealistic, mouth-watering, restaurant quality presentation, crisp details, textured surface`;
        
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
                aspect_ratio: "16:9", // Better for recipe headers
                format: "jpeg",
                quality: 95
            }
        };
        
        console.log('🎨 Generating recipe image for:', searchTerm);
        console.log('📸 Enhanced prompt:', enhancedPrompt);
        
        // Show user that image generation is starting
        if (window.Utils) {
            window.Utils.showSuccess(`🎨 Generating AI image for: ${searchTerm}...`);
        }
        
        // Call Replicate API directly
        const response = await fetch('https://api.replicate.com/v1/predictions', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${replicateApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Replicate API Error:', errorText);
            if (window.Utils) {
                window.Utils.showError(`❌ Replicate API Error: ${response.status} - ${errorText.substring(0, 100)}...`);
            }
            throw new Error(`Replicate API error: ${response.status}`);
        }
        
        const prediction = await response.json();
        console.log('📤 Recipe image generation started:', prediction.id);
        
        // Poll for completion using the existing pollReplicatePrediction function
        if (window.Utils && window.Utils.pollReplicatePrediction) {
            const result = await window.Utils.pollReplicatePrediction(prediction.id, replicateApiKey);
            if (result && result.output && result.output[0]) {
                console.log('✅ Recipe image generated successfully');
                if (window.Utils) {
                    window.Utils.showSuccess(`✅ AI image generated for: ${searchTerm}`);
                }
                return result.output[0];
            }
        }
        
        return null;
        
    } catch (error) {
        console.error('Error generating recipe image:', error);
        if (window.Utils) {
            if (error.message.includes('Failed to fetch')) {
                window.Utils.showError('❌ Network Error: Cannot reach Replicate API. Check internet connection or try different browser.');
            } else {
                window.Utils.showError(`❌ Image Generation Error: ${error.message}`);
            }
        }
        return null;
    }
}

// DEPRECATED: Process recipe images - replaced with new [IMAGE: ...] system in main.js
async function processRecipeImages(content) {
    // This function is deprecated - images are now processed in main.js with [IMAGE: ...] format
    console.log('⚠️ processRecipeImages called but is deprecated. Using new system in main.js');
    return content; // Return content unchanged
    
    // OLD CODE COMMENTED OUT:
    // const imagePattern = /\[RECIPE_IMAGE_SEARCH:\s*([^\]]+)\]/g;
    // let processedContent = content;
    // OLD CODE DISABLED:
    /*
    for (const match of matches) {
        const searchTerm = match[1].trim();
        const imageUrl = await getRecipeImage(searchTerm);
        
        if (imageUrl) {
            processedContent = processedContent.replace(match[0], imageUrl);
        } else {
            const fallbackUrl = `https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop&auto=format&q=80`;
            processedContent = processedContent.replace(match[0], fallbackUrl);
        }
    }
    */
    
    return content;
}

// Show recipe directly in preview area
async function showRecipeDirectly(recipeData) {
    const previewSection = document.getElementById('blogPreview');
    if (previewSection) {
        previewSection.style.display = 'block';
        
        // Update preview with recipe content
        document.getElementById('previewTitle').textContent = recipeData.title;
        document.getElementById('previewMeta').innerHTML = `
            <span class="category">Recipe</span> • 
            <span class="diet">${recipeData.category}</span> • 
            <span class="date">${new Date().toLocaleDateString()}</span>
        `;
        document.getElementById('previewContent').innerHTML = recipeData.outline;
        
        // Show publish section
        const publishSection = document.getElementById('publishSection');
        if (publishSection) {
            publishSection.style.display = 'block';
        }
        
        // Generate custom sharing text for social media
        const shareText = await generateSharingText(recipeData.title, recipeData.category, recipeData.outline);
        
        // Generate TikTok content automatically
        console.log('🎬 Generating TikTok content for recipe...');
        const tiktokContent = await generateTikTokContent(
            recipeData.title, 
            recipeData.outline, 
            recipeData.selectedDiet || selectedRecipeDiet || 'general'
        );
        
        if (tiktokContent) {
            // Store TikTok content globally for copy functions
            window.currentTikTokContent = tiktokContent;
            
            // Display TikTok content after the recipe
            const tiktokHtml = displayTikTokContent(tiktokContent, recipeData.title);
            const currentContent = document.getElementById('previewContent').innerHTML;
            document.getElementById('previewContent').innerHTML = currentContent + tiktokHtml;
            
            console.log('✅ TikTok content generated and displayed');
        } else {
            console.warn('⚠️ Failed to generate TikTok content');
        }
        
        // Store for publishing functionality
        window.generatedBlogContent = {
            title: recipeData.title,
            category: recipeData.category,
            keywords: recipeData.keywords,
            content: recipeData.outline,
            date: new Date().toISOString().split('T')[0],
            shareText: shareText,
            tiktokContent: tiktokContent // Include TikTok content
        };

        // Save recipe with TikTok content to localStorage
        if (tiktokContent) {
            saveRecipeWithTikTok(recipeData.title, recipeData, tiktokContent);
        }
        
        window.currentBlogPost = recipeData.outline;
        
        // Scroll to preview
        previewSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Generate TikTok content including video prompts, editing instructions, and hashtags
async function generateTikTokContent(recipeTitle, recipeContent, diet) {
    const apiKey = localStorage.getItem('geminiApiKey');
    if (!apiKey) {
        console.warn('No Gemini API key found for TikTok content generation');
        return null;
    }

    try {
        // Extract just the instructions/steps from the recipe content
        const cleanContent = recipeContent.replace(/<[^>]*>/g, ''); // Remove HTML tags
        
        const prompt = `Analyze this ${diet} recipe and create TikTok content for maximum engagement:

RECIPE: "${recipeTitle}"
CONTENT: "${cleanContent}"

Create comprehensive TikTok content with these components:

1. VIDEO CLIP PROMPTS (Max 6 clips, 5 seconds each = 30 seconds total):
   - Analyze the recipe steps and break into visual moments
   - Create simple, text-free video prompts for AI video generators
   - Focus on action shots, ingredients, cooking processes
   - NO TEXT should appear in the video prompts
   - Each prompt should be exactly 5 seconds of visual content
   - CRITICAL: Each video clip must be completely self-contained and specific
   - Always mention the exact ingredients by name (e.g., "diced vegetables and protein" not "the ingredients")
   - Include specific cooking techniques and equipment
   - Don't reference other clips or assume prior context

2. EDITING INSTRUCTIONS:
   - Text overlays to add during editing (timing specified)
   - Voiceover script with exact timing
   - Transition suggestions between clips
   - Music/sound effect recommendations

3. TIKTOK POST DESCRIPTION:
   - Hook in first 3 words to stop scrolling
   - Engaging caption that builds curiosity
   - Call-to-action for engagement
   - Recipe teaser without giving it all away

4. TRENDING HASHTAGS:
   - Mix of trending general hashtags
   - Food/recipe specific hashtags  
   - Diet-specific hashtags for ${diet}
   - Niche cooking hashtags for discovery
   - Aim for maximum reach and engagement

IMPORTANT: Always provide a COMPLETE and VALID JSON response. Ensure all brackets and braces are properly closed.

Format as JSON:
{
  "videoClips": [
    {
      "clipNumber": 1,
      "duration": "5 seconds",
      "visualPrompt": "detailed visual description with no text",
      "timing": "0-5s"
    }
  ],
  "editingInstructions": {
    "textOverlays": [
      {
        "text": "overlay text",
        "timing": "0-2s",
        "position": "center/top/bottom",
        "style": "large/small/animated"
      }
    ],
    "voiceoverScript": "Complete script with timing markers",
    "transitions": ["transition suggestions between clips"],
    "musicStyle": "upbeat/trending/cooking sounds"
  },
  "postDescription": "engaging TikTok caption",
  "hashtags": [
    "#trending1", "#food", "#${diet}", "#cooking", "#recipe"
  ]
}`;

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
                }],
                generationConfig: {
                    temperature: 0.8,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 4096,
                }
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const generatedText = data.candidates[0].content.parts[0].text;
        
        // Extract JSON from the response with improved parsing
        console.log('🔍 Raw AI response:', generatedText);
        
        // Try multiple strategies to extract valid JSON
        let tiktokContent = null;
        
        // Strategy 1: Look for JSON wrapped in code blocks
        let jsonMatch = generatedText.match(/```json\s*(\{[\s\S]*?\})\s*```/);
        if (jsonMatch) {
            try {
                tiktokContent = JSON.parse(jsonMatch[1]);
            } catch (e) {
                console.log('Strategy 1 failed, trying strategy 2...');
            }
        }
        
        // Strategy 2: Look for the first complete JSON object
        if (!tiktokContent) {
            jsonMatch = generatedText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                let jsonStr = jsonMatch[0];
                
                // Clean up common JSON formatting issues
                jsonStr = jsonStr
                    .replace(/,\s*\]/g, ']')  // Remove trailing commas in arrays
                    .replace(/,\s*\}/g, '}')  // Remove trailing commas in objects
                    .replace(/\n/g, ' ')      // Replace newlines with spaces
                    .replace(/\s+/g, ' ')     // Collapse multiple spaces
                    .trim();
                
                try {
                    tiktokContent = JSON.parse(jsonStr);
                } catch (e) {
                    console.log('Strategy 2 failed, trying strategy 3...');
                }
            }
        }
        
        // Strategy 3: Try to fix common issues and parse again
        if (!tiktokContent && jsonMatch) {
            let jsonStr = jsonMatch[0];
            
            // Check if JSON is incomplete (common with AI responses)
            if (!jsonStr.trim().endsWith('}')) {
                console.log('Detected incomplete JSON, attempting to close it...');
                
                // Count open braces and brackets to try to close properly
                const openBraces = (jsonStr.match(/\{/g) || []).length;
                const closeBraces = (jsonStr.match(/\}/g) || []).length;
                const openBrackets = (jsonStr.match(/\[/g) || []).length;
                const closeBrackets = (jsonStr.match(/\]/g) || []).length;
                
                // Add missing closing characters
                for (let i = 0; i < (openBrackets - closeBrackets); i++) {
                    jsonStr += ']';
                }
                for (let i = 0; i < (openBraces - closeBraces); i++) {
                    jsonStr += '}';
                }
            }
            
            // More aggressive cleaning
            jsonStr = jsonStr
                .replace(/,(\s*[}\]])/g, '$1')  // Remove all trailing commas
                .replace(/([{,]\s*)(\w+):/g, '$1"$2":')  // Quote unquoted keys
                .replace(/:\s*'([^']*)'/g, ': "$1"')  // Convert single quotes to double
                .replace(/"\s*$/, '"')  // Fix trailing quote issues
                .replace(/\n/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
            
            try {
                tiktokContent = JSON.parse(jsonStr);
            } catch (e) {
                console.error('All JSON parsing strategies failed:', e);
                console.log('Final cleaned JSON attempt:', jsonStr);
            }
        }
        
        if (tiktokContent) {
            console.log('✅ Generated TikTok content:', tiktokContent);
            return tiktokContent;
        } else {
            console.error('Failed to parse JSON. Raw response:', generatedText);
            throw new Error('Could not parse JSON from TikTok content response. Please try again.');
        }
        
    } catch (error) {
        console.error('Error generating TikTok content:', error);
        return null;
    }
}

// Display TikTok content in a user-friendly format
function displayTikTokContent(tiktokData, recipeTitle) {
    if (!tiktokData) {
        console.warn('No TikTok data to display');
        return;
    }

    const tiktokHtml = `
        <div class="tiktok-content-section" style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin: 20px 0; border: 2px solid #fe2c55;">
            <h3 style="color: #fe2c55; margin-bottom: 20px;">🎬 TikTok Content for "${recipeTitle}"</h3>
            
            <!-- Video Clip Prompts -->
            <div class="video-clips" style="margin-bottom: 25px;">
                <h4 style="color: #333; border-bottom: 2px solid #fe2c55; padding-bottom: 8px;">📹 Video Clip Prompts (${tiktokData.videoClips?.length || 0} clips - ${(tiktokData.videoClips?.length || 0) * 5}s total)</h4>
                <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 10px;">
                    ${tiktokData.videoClips?.map(clip => `
                        <div style="margin-bottom: 15px; padding: 12px; background: #f1f1f1; border-radius: 6px; border-left: 4px solid #fe2c55;">
                            <strong>Clip ${clip.clipNumber} (${clip.timing}):</strong><br>
                            <em style="color: #666;">${clip.visualPrompt?.replace(/['"]/g, '') || clip.visualPrompt}</em>
                        </div>
                    `).join('') || '<p>No video clips generated</p>'}
                </div>
            </div>

            <!-- Editing Instructions -->
            <div class="editing-instructions" style="margin-bottom: 25px;">
                <h4 style="color: #333; border-bottom: 2px solid #25f4ee; padding-bottom: 8px;">✂️ Editing Instructions</h4>
                <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 10px;">
                    
                    <div style="margin-bottom: 15px;">
                        <strong style="color: #25f4ee;">📝 Text Overlays:</strong>
                        <div style="margin-top: 8px;">
                            ${tiktokData.editingInstructions?.textOverlays?.map(overlay => `
                                <div style="background: #f9f9f9; padding: 8px; margin: 5px 0; border-radius: 4px;">
                                    <strong>"${overlay.text}"</strong> - ${overlay.timing} (${overlay.position}, ${overlay.style})
                                </div>
                            `).join('') || '<p>No text overlays specified</p>'}
                        </div>
                    </div>

                    <div style="margin-bottom: 15px;">
                        <strong style="color: #25f4ee;">🎤 Voiceover Script:</strong>
                        <div style="background: #f9f9f9; padding: 12px; margin-top: 8px; border-radius: 4px; font-style: italic;">
                            ${tiktokData.editingInstructions?.voiceoverScript || 'No voiceover script generated'}
                        </div>
                    </div>

                    <div style="margin-bottom: 15px;">
                        <strong style="color: #25f4ee;">🔄 Transitions:</strong>
                        <div style="margin-top: 8px;">
                            ${tiktokData.editingInstructions?.transitions?.map(transition => `
                                <span style="background: #e3f2fd; padding: 4px 8px; margin: 2px; border-radius: 12px; font-size: 0.9em;">${transition}</span>
                            `).join('') || 'No transitions specified'}
                        </div>
                    </div>

                    <div>
                        <strong style="color: #25f4ee;">🎵 Music Style:</strong>
                        <span style="background: #fff3e0; padding: 6px 12px; border-radius: 16px; margin-left: 8px;">
                            ${tiktokData.editingInstructions?.musicStyle || 'Not specified'}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Post Description -->
            <div class="post-description" style="margin-bottom: 25px;">
                <h4 style="color: #333; border-bottom: 2px solid #00d4aa; padding-bottom: 8px;">📱 TikTok Post Description</h4>
                <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 10px; border: 1px solid #00d4aa;">
                    <div style="font-size: 16px; line-height: 1.5; color: #333;">
                        ${tiktokData.postDescription || 'No post description generated'}
                    </div>
                </div>
            </div>

            <!-- Hashtags -->
            <div class="hashtags">
                <h4 style="color: #333; border-bottom: 2px solid #ff6b35; padding-bottom: 8px;">🏷️ Trending Hashtags</h4>
                <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 10px;">
                    <div style="line-height: 2;">
                        ${tiktokData.hashtags?.map(tag => `
                            <span style="background: linear-gradient(45deg, #fe2c55, #ff6b35); color: white; padding: 6px 12px; margin: 3px; border-radius: 20px; font-weight: bold; font-size: 0.9em;">${tag}</span>
                        `).join(' ') || 'No hashtags generated'}
                    </div>
                    <div style="margin-top: 12px; padding: 10px; background: #fff3cd; border-radius: 6px; font-size: 0.9em; color: #856404;">
                        💡 <strong>Pro Tip:</strong> Copy these hashtags and paste them as a comment instead of in the main caption for better algorithm performance!
                    </div>
                </div>
            </div>

            <!-- Copy Buttons -->
            <div style="margin-top: 20px; text-align: center;">
                <button onclick="copyTikTokContent('description')" style="background: #fe2c55; color: white; border: none; padding: 10px 20px; border-radius: 25px; margin: 5px; cursor: pointer; font-weight: bold;">
                    📋 Copy Description
                </button>
                <button onclick="copyTikTokContent('hashtags')" style="background: #25f4ee; color: #333; border: none; padding: 10px 20px; border-radius: 25px; margin: 5px; cursor: pointer; font-weight: bold;">
                    🏷️ Copy Hashtags
                </button>
                <button onclick="copyTikTokContent('voiceover')" style="background: #00d4aa; color: white; border: none; padding: 10px 20px; border-radius: 25px; margin: 5px; cursor: pointer; font-weight: bold;">
                    🎤 Copy Voiceover
                </button>
            </div>
        </div>
    `;

    return tiktokHtml;
}

// Copy TikTok content to clipboard
function copyTikTokContent(type) {
    const tiktokData = window.currentTikTokContent;
    if (!tiktokData) {
        alert('No TikTok content available to copy');
        return;
    }

    let textToCopy = '';
    
    switch(type) {
        case 'description':
            textToCopy = tiktokData.postDescription || '';
            break;
        case 'hashtags':
            textToCopy = tiktokData.hashtags?.join(' ') || '';
            break;
        case 'voiceover':
            let voiceoverText = tiktokData.editingInstructions?.voiceoverScript || '';
            // Remove time markers like [0:00-0:05], (0-5s), etc.
            textToCopy = voiceoverText
                .replace(/\[\d+:\d+[-–]\d+:\d+\]/g, '') // Remove [0:00-0:05] format
                .replace(/\(\d+[-–]\d+s?\)/g, '') // Remove (0-5s) format
                .replace(/\[\d+[-–]\d+s?\]/g, '') // Remove [0-5s] format
                .replace(/\s+/g, ' ') // Clean up extra spaces
                .trim();
            break;
        default:
            alert('Unknown content type');
            return;
    }

    if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            console.log('✅ Copied to clipboard:', type);
            alert('✅ Copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy to clipboard');
        });
    } else {
        alert('No content available to copy');
    }
}

// Save recipe with TikTok content to localStorage
function saveRecipeWithTikTok(recipeTitle, recipeData, tiktokContent) {
    try {
        const savedRecipes = window.Utils?.loadFromLocalStorage('savedRecipesWithTikTok', []) || [];
        
        const recipeWithTikTok = {
            id: Date.now().toString(),
            title: recipeTitle,
            recipeData: recipeData,
            tiktokContent: tiktokContent,
            savedDate: new Date().toISOString(),
            diet: recipeData.selectedDiet || selectedRecipeDiet || 'general'
        };
        
        // Remove any existing recipe with the same title
        const filteredRecipes = savedRecipes.filter(r => r.title !== recipeTitle);
        filteredRecipes.unshift(recipeWithTikTok); // Add to beginning
        
        // Keep only last 20 recipes to prevent storage bloat
        const trimmedRecipes = filteredRecipes.slice(0, 20);
        
        window.Utils?.saveToLocalStorage('savedRecipesWithTikTok', trimmedRecipes);
        console.log('✅ Recipe with TikTok content saved:', recipeTitle);
        
        // Show success notification
        if (window.Utils && window.Utils.showSuccess) {
            window.Utils.showSuccess(`✅ Recipe "${recipeTitle}" saved with TikTok content!`);
        }
        
        // Update the saved recipes UI if it exists
        updateSavedRecipesUI();
    } catch (error) {
        console.error('Failed to save recipe with TikTok content:', error);
    }
}

// Load all saved recipes with TikTok content
function loadSavedRecipes() {
    try {
        return window.Utils?.loadFromLocalStorage('savedRecipesWithTikTok', []) || [];
    } catch (error) {
        console.error('Failed to load saved recipes:', error);
        return [];
    }
}

// Load a specific saved recipe and display it
function loadSavedRecipe(recipeId) {
    try {
        const savedRecipes = loadSavedRecipes();
        const recipe = savedRecipes.find(r => r.id === recipeId);
        
        if (recipe) {
            // Display the recipe content
            const previewSection = document.getElementById('blogPreview');
            if (previewSection) {
                previewSection.style.display = 'block';
                
                document.getElementById('previewTitle').textContent = recipe.recipeData.title;
                document.getElementById('previewMeta').innerHTML = `
                    <span class="category">Recipe</span> • 
                    <span class="diet">${recipe.recipeData.category}</span> • 
                    <span class="date">Saved: ${new Date(recipe.savedDate).toLocaleDateString()}</span>
                `;
                
                // Display recipe content and TikTok content
                const tiktokHtml = displayTikTokContent(recipe.tiktokContent, recipe.title);
                document.getElementById('previewContent').innerHTML = recipe.recipeData.outline + tiktokHtml;
                
                // Store globally for other functions
                window.currentTikTokContent = recipe.tiktokContent;
                window.generatedBlogContent = {
                    ...recipe.recipeData,
                    tiktokContent: recipe.tiktokContent
                };
                
                // Show publish section
                const publishSection = document.getElementById('publishSection');
                if (publishSection) {
                    publishSection.style.display = 'block';
                }
                
                previewSection.scrollIntoView({ behavior: 'smooth' });
                console.log('✅ Loaded saved recipe:', recipe.title);
            }
        } else {
            alert('Recipe not found!');
        }
    } catch (error) {
        console.error('Failed to load saved recipe:', error);
        alert('Failed to load recipe. Please try again.');
    }
}

// Delete a saved recipe
function deleteSavedRecipe(recipeId) {
    try {
        const savedRecipes = loadSavedRecipes();
        const filteredRecipes = savedRecipes.filter(r => r.id !== recipeId);
        window.Utils?.saveToLocalStorage('savedRecipesWithTikTok', filteredRecipes);
        updateSavedRecipesUI();
        console.log('✅ Recipe deleted');
    } catch (error) {
        console.error('Failed to delete recipe:', error);
    }
}

// Update the saved recipes UI
function updateSavedRecipesUI() {
    const savedRecipesContainer = document.getElementById('savedRecipesContainer');
    if (!savedRecipesContainer) return;
    
    const savedRecipes = loadSavedRecipes();
    
    if (savedRecipes.length === 0) {
        savedRecipesContainer.innerHTML = `
            <div style="text-align: center; color: #666; padding: 20px;">
                <p>No saved recipes yet. Generate a recipe with TikTok content to save it!</p>
            </div>
        `;
        return;
    }
    
    const recipesHtml = savedRecipes.map(recipe => `
        <div class="saved-recipe-card" style="background: white; border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 15px;">
            <div style="display: flex; justify-content: between; align-items: start;">
                <div style="flex-grow: 1;">
                    <h4 style="margin: 0 0 8px 0; color: #333;">${recipe.title}</h4>
                    <div style="font-size: 0.9em; color: #666; margin-bottom: 8px;">
                        <span style="background: #e3f2fd; padding: 2px 6px; border-radius: 4px; margin-right: 8px;">${recipe.diet}</span>
                        <span>Saved: ${new Date(recipe.savedDate).toLocaleDateString()}</span>
                    </div>
                    <div style="font-size: 0.85em; color: #888;">
                        ${recipe.tiktokContent?.videoClips?.length || 0} video clips • 
                        ${recipe.tiktokContent?.hashtags?.length || 0} hashtags
                    </div>
                </div>
                <div style="display: flex; gap: 8px; margin-left: 15px;">
                    <button onclick="loadSavedRecipe('${recipe.id}')" style="background: #2196F3; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 0.85em;">
                        📖 Load
                    </button>
                    <button onclick="deleteSavedRecipe('${recipe.id}')" style="background: #f44336; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 0.85em;">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    savedRecipesContainer.innerHTML = recipesHtml;
}

// Export functions for use in main script
window.RecipeGenerator = {
    selectRecipeDiet,
    regenerateCurrentRecipeDiet,
    generateRecipeIdeas,
    generateDynamicRecipeContent,
    showRecipeDirectly,
    generateTikTokContent,
    displayTikTokContent,
    copyTikTokContent,
    saveRecipeWithTikTok,
    loadSavedRecipes,
    loadSavedRecipe,
    deleteSavedRecipe,
    updateSavedRecipesUI,
    selectedRecipeDiet,
    recipeDietCategories
};

// Make functions globally available for HTML onclick handlers
window.selectRecipeDiet = function(dietId) {
    if (window.RecipeGenerator && window.RecipeGenerator.selectRecipeDiet) {
        return window.RecipeGenerator.selectRecipeDiet(dietId);
    }
    console.error('RecipeGenerator.selectRecipeDiet not available');
};

window.copyTikTokContent = function(type) {
    if (window.RecipeGenerator && window.RecipeGenerator.copyTikTokContent) {
        return window.RecipeGenerator.copyTikTokContent(type);
    }
    console.error('RecipeGenerator.copyTikTokContent not available');
};

// Manual TikTok content generation for existing recipes
window.generateTikTokForCurrentRecipe = async function() {
    const blogContent = window.generatedBlogContent;
    if (!blogContent) {
        alert('No recipe found. Please generate a recipe first.');
        return;
    }
    
    // Update button to loading state
    const button = document.getElementById('tiktokGenerateBtn');
    const originalText = button.innerHTML;
    button.innerHTML = '⏳ Generating...';
    button.disabled = true;
    
    // Check if AI Rogue mode is enabled
    const aiRogueMode = document.getElementById('aiRogueMode')?.checked || false;
    
    if (aiRogueMode) {
        console.log('🤖 Manually generating AI Rogue content...');
        const rogueContent = await window.AIRogueGenerator?.generateAIRogueContent(
            blogContent.title,
            blogContent.content,
            selectedRecipeDiet || 'general'
        );
        
        if (rogueContent) {
            window.currentAIRogueContent = rogueContent;
            const rogueHtml = window.AIRogueGenerator?.displayAIRogueContent(rogueContent, blogContent.title);
            
            // Find existing TikTok/AI Rogue content and replace it, or append if none exists
            const previewContent = document.getElementById('previewContent');
            const existingContent = previewContent.querySelector('.tiktok-content-section, .ai-rogue-content-section');
            
            if (existingContent) {
                existingContent.outerHTML = rogueHtml;
            } else {
                previewContent.innerHTML += rogueHtml;
            }
            
            // Update stored content
            window.generatedBlogContent.aiRogueContent = rogueContent;
            
            // Save the updated recipe with AI Rogue content
            saveRecipeWithTikTok(blogContent.title, blogContent, rogueContent);
            
            console.log('✅ AI Rogue content generated manually');
            console.log('🤖 AI Rogue content generated successfully');
        } else {
            console.log('❌ Failed to generate AI Rogue content');
        }
    } else {
        // Normal TikTok content generation
        console.log('🎬 Manually generating TikTok content...');
        const tiktokContent = await window.RecipeGenerator.generateTikTokContent(
            blogContent.title,
            blogContent.content,
            selectedRecipeDiet || 'general'
        );
        
        if (tiktokContent) {
            window.currentTikTokContent = tiktokContent;
            const tiktokHtml = window.RecipeGenerator.displayTikTokContent(tiktokContent, blogContent.title);
            
            // Find existing TikTok/AI Rogue content and replace it, or append if none exists
            const previewContent = document.getElementById('previewContent');
            const existingContent = previewContent.querySelector('.tiktok-content-section, .ai-rogue-content-section');
            
            if (existingContent) {
                existingContent.outerHTML = tiktokHtml;
            } else {
                previewContent.innerHTML += tiktokHtml;
            }
            
            // Update stored content
            window.generatedBlogContent.tiktokContent = tiktokContent;
            
            // Save the updated recipe with TikTok content
            saveRecipeWithTikTok(blogContent.title, blogContent, tiktokContent);
            
            console.log('✅ TikTok content generated manually');
            console.log('🎬 TikTok content generated successfully');
        } else {
            console.log('❌ Failed to generate TikTok content');
        }
    }
    
    // Restore button state
    button.innerHTML = originalText;
    button.disabled = false;
};

// Make additional functions globally available
window.loadSavedRecipe = function(recipeId) {
    if (window.RecipeGenerator && window.RecipeGenerator.loadSavedRecipe) {
        return window.RecipeGenerator.loadSavedRecipe(recipeId);
    }
    console.error('RecipeGenerator.loadSavedRecipe not available');
};

window.deleteSavedRecipe = function(recipeId) {
    if (window.RecipeGenerator && window.RecipeGenerator.deleteSavedRecipe) {
        return window.RecipeGenerator.deleteSavedRecipe(recipeId);
    }
    console.error('RecipeGenerator.deleteSavedRecipe not available');
};

window.updateSavedRecipesUI = function() {
    if (window.RecipeGenerator && window.RecipeGenerator.updateSavedRecipesUI) {
        return window.RecipeGenerator.updateSavedRecipesUI();
    }
    console.error('RecipeGenerator.updateSavedRecipesUI not available');
};

// Toggle saved recipes section visibility
window.toggleSavedRecipes = function() {
    const savedSection = document.getElementById('savedRecipesSection');
    if (savedSection) {
        const isVisible = savedSection.style.display !== 'none';
        if (isVisible) {
            savedSection.style.display = 'none';
        } else {
            savedSection.style.display = 'block';
            // Load and display saved recipes when opening
            updateSavedRecipesUI();
        }
    }
}; 