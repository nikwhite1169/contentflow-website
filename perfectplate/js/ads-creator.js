// Ads Creator Module
// Handles advertisement creation for multiple platforms and products

// Global variables for ads creator
let selectedProduct = null;
let selectedPlatform = null;

// Product configurations
const productConfigs = {
    'perfectplate': {
        name: 'PerfectPlate App',
        description: 'AI-powered restaurant meal finder that analyzes 170,000+ menus to find perfect meals based on your dietary preferences',
        appStoreUrl: 'https://apps.apple.com/app/perfectplate',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.perfectplate',
        websiteUrl: 'https://perfectplate.co',
        targetAudience: 'Diet-conscious diners, health enthusiasts, people with dietary restrictions',
        howItWorks: [
            'User enters ZIP code and selects dietary preference (keto, vegan, paleo, etc.)',
            'AI analyzes 170,000+ restaurant menus in seconds',
            'Returns 3 perfect meal matches with 0-100 match scores',
            'Shows why each meal is perfect for your diet',
            'Provides "perfection tips" to make meals even better',
            'Displays nutritional benefits and macro information'
        ],
        keyFeatures: [
            'Instant meal discovery (ZIP code + diet preference)',
            '170,000+ restaurant menu database',
            'AI-powered match scoring (0-100)',
            'Personalized meal recommendations',
            'Nutritional analysis and benefits',
            'Meal "perfection" optimization tips',
            '18+ dietary preferences supported'
        ],
        painPoints: [
            'Spending hours searching restaurant websites for diet-friendly options',
            'Uncertainty about which meals actually fit your diet',
            'Calling restaurants to ask about ingredients',
            'Limited options for specific diets like keto or paleo',
            'Not knowing how to optimize meals for better nutrition'
        ],
        dietOptions: [
            'Keto', 'Paleo', 'Vegan', 'Vegetarian', 'Gluten-Free', 'Dairy-Free',
            'Low Carb', 'High Protein', 'Low Calorie', 'Low Fat', 'Mediterranean',
            'Diabetic-Friendly', 'Heart-Healthy', 'Anti-Inflammatory', 'Plant-Based',
            'Pescatarian', 'Flexitarian', 'Low FODMAP'
        ]
    },
    'meal-finder': {
        name: 'Restaurant Meal Finder',
        description: 'Website tool for finding specific meals at restaurants',
        websiteUrl: 'https://perfectplate.co/meal-finder',
        targetAudience: 'Food enthusiasts, travelers, people seeking specific cuisines or dishes',
        keyFeatures: [
            'Search by specific dish or cuisine',
            'Location-based restaurant discovery',
            'Menu item comparisons',
            'Price and rating information',
            'Real-time availability'
        ],
        painPoints: [
            'Difficulty finding specific dishes at local restaurants',
            'Uncertainty about menu availability',
            'Time spent browsing multiple restaurant websites',
            'Limited search options on delivery apps',
            'No way to compare similar dishes across restaurants'
        ]
    }
};

// Platform configurations
const platformConfigs = {
    'tiktok': {
        name: 'TikTok Ads',
        adFormats: ['In-Feed Video', 'Spark Ads', 'TopView', 'Branded Hashtag Challenge'],
        targetingOptions: ['Age', 'Gender', 'Location', 'Interests', 'Behaviors', 'Custom Audiences'],
        bestPractices: [
            'Keep videos under 15 seconds for better engagement',
            'Use trending sounds and music',
            'Include captions for accessibility',
            'Show real app usage and benefits',
            'Use vertical video format (9:16)',
            'Include clear call-to-action'
        ],
        budgetRecommendations: {
            'app_installs': '$20-50/day for testing',
            'website_traffic': '$15-30/day for testing',
            'brand_awareness': '$25-75/day for reach'
        }
    },
    'facebook': {
        name: 'Facebook/Instagram Ads',
        adFormats: ['Single Image', 'Video', 'Carousel', 'Collection', 'Stories'],
        targetingOptions: ['Demographics', 'Interests', 'Behaviors', 'Custom Audiences', 'Lookalike Audiences'],
        bestPractices: [
            'Use high-quality visuals',
            'Test multiple ad variations',
            'Include social proof and testimonials',
            'Use clear, benefit-focused headlines',
            'Optimize for mobile viewing',
            'Include compelling call-to-action buttons'
        ],
        budgetRecommendations: {
            'app_installs': '$30-100/day for testing',
            'website_traffic': '$20-50/day for testing',
            'conversions': '$50-150/day for optimization'
        }
    },
    'google': {
        name: 'Google Ads',
        adFormats: ['Search Ads', 'Display Ads', 'YouTube Ads', 'App Campaigns'],
        targetingOptions: ['Keywords', 'Demographics', 'Audiences', 'Topics', 'Placements'],
        bestPractices: [
            'Use relevant keywords in headlines',
            'Include location extensions for local targeting',
            'Create compelling ad descriptions',
            'Use ad extensions for more information',
            'Optimize landing pages for conversions',
            'Monitor search terms and add negatives'
        ],
        budgetRecommendations: {
            'app_installs': '$50-200/day for app campaigns',
            'website_traffic': '$25-100/day for search',
            'conversions': '$100-300/day for optimization'
        }
    },
    'appstore': {
        name: 'App Store Ads',
        adFormats: ['Search Results', 'Today Tab', 'App Product Pages'],
        targetingOptions: ['Keywords', 'Audience Refinement', 'Demographics', 'Location'],
        bestPractices: [
            'Optimize app store listing first',
            'Use relevant keywords in metadata',
            'Include compelling app screenshots',
            'Write clear app descriptions',
            'Encourage positive reviews',
            'Monitor competitor keywords'
        ],
        budgetRecommendations: {
            'app_installs': '$100-500/day for competitive keywords',
            'brand_awareness': '$50-200/day for brand terms'
        }
    }
};

// Select product function
function selectProduct(product) {
    selectedProduct = product;
    
    // Update UI
    document.querySelectorAll('.product-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`[data-product="${product}"]`).classList.add('selected');
    
    // Show platform selection if both product and platform are selected
    checkSelectionComplete();
}

// Select platform function
function selectPlatform(platform) {
    selectedPlatform = platform;
    
    // Update UI
    document.querySelectorAll('.platform-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`[data-platform="${platform}"]`).classList.add('selected');
    
    // Show campaign configuration if both selections are made
    checkSelectionComplete();
}

// Check if both product and platform are selected
function checkSelectionComplete() {
    if (selectedProduct && selectedPlatform) {
        document.getElementById('campaignConfig').style.display = 'block';
        document.getElementById('campaignConfig').scrollIntoView({ behavior: 'smooth' });
        
        // Update form based on selections
        updateFormForSelections();
    }
}

// Update form based on product and platform selections
function updateFormForSelections() {
    const product = productConfigs[selectedProduct];
    const platform = platformConfigs[selectedPlatform];
    
    // Update objective options based on platform and product
    const objectiveSelect = document.getElementById('adObjective');
    objectiveSelect.innerHTML = '';
    
    if (selectedProduct === 'perfectplate') {
        objectiveSelect.innerHTML = `
            <option value="app_installs">App Installs</option>
            <option value="brand_awareness">Brand Awareness</option>
            <option value="engagement">Engagement</option>
            <option value="conversions">App Downloads</option>
        `;
    } else {
        objectiveSelect.innerHTML = `
            <option value="website_traffic">Website Traffic</option>
            <option value="conversions">Conversions</option>
            <option value="brand_awareness">Brand Awareness</option>
            <option value="engagement">Engagement</option>
            <option value="lead_generation">Lead Generation</option>
        `;
    }
    
    // Load saved API key
    const savedApiKey = localStorage.getItem('geminiApiKey');
    if (savedApiKey) {
        document.getElementById('adGeminiApiKey').value = savedApiKey;
    }
}

// Generate ads function
async function generateAds() {
    const apiKey = document.getElementById('adGeminiApiKey').value;
    const objective = document.getElementById('adObjective').value;
    const dietType = document.getElementById('adDietType').value;
    const location = document.getElementById('adLocation').value;
    const budget = document.getElementById('adBudget').value;
    const ageRange = document.getElementById('adAgeRange').value;
    const creativeStyle = document.getElementById('adCreativeStyle').value;
    
    // Validation
    if (!apiKey) {
        showAdError('Please enter your Gemini API key');
        return;
    }
    
    if (!selectedProduct || !selectedPlatform) {
        showAdError('Please select both a product and platform');
        return;
    }
    
    if (!location || !budget) {
        showAdError('Please fill in target location and budget');
        return;
    }
    
    // Save API key
    localStorage.setItem('geminiApiKey', apiKey);
    
    // Show loading
    document.getElementById('adLoading').classList.add('active');
    hideAdError();
    hideAdSuccess();
    
    try {
        const product = productConfigs[selectedProduct];
        const platform = platformConfigs[selectedPlatform];
        
        // Step 1: Generate unified campaign concept and ad copy
        updateLoadingMessage('🎯 Creating unified campaign concept and ad copy...');
        const campaignData = await generateUnifiedCampaign(apiKey, {
            product,
            platform,
            objective,
            dietType,
            location,
            budget,
            ageRange,
            creativeStyle
        });
        
        // Step 2: Generate targeting based on campaign theme
        updateLoadingMessage('🎯 Creating audience targeting strategies...');
        const targeting = await generateTargeting(apiKey, {
            product,
            platform,
            objective,
            dietType,
            location,
            ageRange,
            campaignTheme: campaignData.theme,
            adCopy: campaignData.adCopy
        });
        
        // Step 3: Generate video prompts based on campaign theme
        updateLoadingMessage('🎬 Creating AI video generation prompts...');
        const videoPrompts = await generateVideoPrompts(apiKey, {
            product,
            platform,
            objective,
            dietType,
            creativeStyle,
            location,
            campaignTheme: campaignData.theme,
            adCopy: campaignData.adCopy
        });
        
        // Step 4: Generate setup instructions based on campaign
        updateLoadingMessage('⚙️ Preparing platform setup instructions...');
        const setup = await generateSetupInstructions(apiKey, {
            product,
            platform,
            objective,
            budget,
            campaignTheme: campaignData.theme,
            adCopy: campaignData.adCopy
        });
        
        // Display results
        updateLoadingMessage('✨ Finalizing your ad campaign...');
        displayAdResults(campaignData.adCopy, targeting, videoPrompts, setup);
        
        showAdSuccess('Ad campaign generated successfully!');
        
    } catch (error) {
        console.error('Error generating ads:', error);
        showAdError('Error generating ads: ' + error.message);
    } finally {
        document.getElementById('adLoading').classList.remove('active');
    }
}

// Update loading message
function updateLoadingMessage(message) {
    const loadingElement = document.getElementById('adLoading');
    const messageElement = loadingElement.querySelector('p');
    if (messageElement) {
        messageElement.textContent = message;
    }
}

// Generate ad copy using Gemini API
// Generate unified campaign with theme and ad copy
async function generateUnifiedCampaign(apiKey, config) {
    const prompt = `Create a UNIFIED AD CAMPAIGN for ${config.platform.name} promoting ${config.product.name}.

You must establish ONE CENTRAL CAMPAIGN THEME that will be used across ad copy, video segments, targeting, and setup instructions.

PRODUCT DETAILS:
- App Name: PerfectPlate (this is the actual app name - always use "PerfectPlate", never "Restaurant Meal Finder")
- Description: ${config.product.description}
- Target Audience: ${config.product.targetAudience}

HOW PERFECTPLATE ACTUALLY WORKS (READ CAREFULLY):
${config.product.howItWorks ? config.product.howItWorks.map(step => `- ${step}`).join('\n') : ''}

CRITICAL LIMITATIONS - WHAT USERS CANNOT DO:
- Users CANNOT search for specific meals (like "keto chicken wings" or "vegan pizza")
- Users CANNOT type in food names or restaurant names
- Users CANNOT browse by cuisine type or meal categories
- There is NO search bar for typing meal names

WHAT USERS CAN ACTUALLY DO:
- Enter ZIP code only
- Select ONE dietary preference from dropdown (keto, vegan, paleo, etc.)
- Click "Find Perfect Meals" button
- Get 3 pre-selected meals with match scores

KEY FEATURES:
${config.product.keyFeatures.map(feature => `- ${feature}`).join('\n')}

PAIN POINTS ADDRESSED:
${config.product.painPoints.map(pain => `- ${pain}`).join('\n')}

SUPPORTED DIETS:
${config.product.dietOptions ? config.product.dietOptions.join(', ') : 'Various dietary preferences'}

CAMPAIGN CONFIGURATION:
- Platform: ${config.platform.name}
- Objective: ${config.objective}
- Target Diet/Cuisine: ${config.dietType}
- Location: ${config.location}
- Age Range: ${config.ageRange}
- Creative Style: ${config.creativeStyle}
- Budget: $${config.budget}/day

PLATFORM BEST PRACTICES:
${config.platform.bestPractices.map(practice => `- ${practice}`).join('\n')}

REQUIREMENTS:
- Create 3 distinct ad variations
- Each should have: Headline (max 40 chars), Description (max 125 chars), Call-to-Action
- Address specific pain points of ${config.dietType} audience
- Use ${config.creativeStyle} tone and style
- Include emotional triggers relevant to ${config.dietType} lifestyle
- Optimize for ${config.objective} campaign objective
- Make ads specific to ${config.location} area

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

**🎯 CAMPAIGN THEME:** [One clear, compelling theme that will run through all campaign elements - e.g., "Effortless Discovery", "Your Personal Food Detective", "Skip the Menu Stress", etc.]

**📝 CAMPAIGN CONCEPT:** [2-3 sentences explaining the central idea/story of this campaign]

**VARIATION 1:**
**Headline:** [Attention-grabbing headline]
**Description:** [Compelling description that follows the campaign theme]
**Call-to-Action:** [Strong CTA]

**VARIATION 2:**
**Headline:** [Different angle, same theme]
**Description:** [Different approach, same core concept]
**Call-to-Action:** [Strong CTA]

**VARIATION 3:**
**Headline:** [Third angle, same theme]
**Description:** [Third approach, same core concept]
**Call-to-Action:** [Strong CTA]

Focus on the core benefit: effortless ${config.dietType} dining discovery in ${config.location}.

IMPORTANT: Always refer to the app as "PerfectPlate" - this is the brand name. Do not call it "Restaurant Meal Finder" or any other name.

${config.creativeStyle === 'bonkers' ? `
🤯 BONKERS MODE ACTIVATED 🤯
Create ONE COHERENT INSANE THEME that will be used for BOTH ad copy AND video segments:

BONKERS REQUIREMENTS:
- Pick ONE completely insane theme/story and stick to it across all variations
- Create 3 variations of the SAME crazy theme (not 3 different themes)
- Make it VIRAL-WORTHY but coherent within its own insane logic
- Include specific details that can be turned into video segments
- Still mention the actual app functionality (ZIP code + diet selection = 3 results)

CHOOSE ONE BONKERS THEME FROM THESE EXAMPLES:
1. "THE KETO CODE CONSPIRACY" - Government has been hiding perfect keto meals, PerfectPlate cracked the code
2. "MY PHONE BECAME A KETO GOD" - Phone gains sentience and becomes obsessed with finding perfect meals
3. "QUANTUM FOOD REALM" - ZIP codes are portals to interdimensional food databases
4. "THE MEAL MATRIX" - Reality is fake, only perfect meals are real, PerfectPlate shows the truth
5. "ALIEN FOOD INVASION" - Aliens left behind perfect meal coordinates, PerfectPlate decodes them
6. "TIME TRAVELING FOOD FINDER" - App predicts meals from the future/past
7. "THE DIET ILLUMINATI" - Secret society controls all food, PerfectPlate breaks their code

CREATE 3 VARIATIONS OF YOUR CHOSEN THEME:
- Each variation should tell the same crazy story but from different angles
- Include specific visual elements that can become video segments
- Make it so UNHINGED that people can't scroll past
- But still explain: ZIP code + diet selection → 3 perfect meals with match scores

EXAMPLE FORMAT FOR COHERENT BONKERS THEME:
**CHOSEN THEME: [Your selected theme]**

**Variation 1: [Angle 1 of the theme]**
**Variation 2: [Angle 2 of the same theme]**
**Variation 3: [Angle 3 of the same theme]**

BE ABSOLUTELY UNHINGED BUT KEEP THE SAME STORY ACROSS ALL VARIATIONS.` : ''}`;

    const response = await callGeminiAPI(prompt, apiKey);
    
    // Parse the response to extract theme and ad copy
    const themeMatch = response.match(/\*\*🎯 CAMPAIGN THEME:\*\*\s*(.+?)(?=\*\*📝 CAMPAIGN CONCEPT:\*\*)/s);
    const conceptMatch = response.match(/\*\*📝 CAMPAIGN CONCEPT:\*\*\s*(.+?)(?=\*\*VARIATION 1:\*\*)/s);
    
    return {
        theme: themeMatch ? themeMatch[1].trim() : 'Effortless Food Discovery',
        concept: conceptMatch ? conceptMatch[1].trim() : '',
        adCopy: response
    };
}

// Generate targeting recommendations
async function generateTargeting(apiKey, config) {
    const prompt = `Create detailed targeting recommendations for ${config.platform.name} ads promoting ${config.product.name}.

CAMPAIGN CONTEXT:
- Campaign Theme: ${config.campaignTheme || 'Effortless Food Discovery'}
- This targeting must align with and support the established campaign theme above.

CAMPAIGN DETAILS:
- App Name: PerfectPlate (always use this name, never "Restaurant Meal Finder")
- Description: ${config.product.description}
- Platform: ${config.platform.name}
- Objective: ${config.objective}
- Target Diet: ${config.dietType}
- Location: ${config.location}
- Age Range: ${config.ageRange}

HOW PERFECTPLATE ACTUALLY WORKS (IMPORTANT):
- Users can ONLY enter ZIP code and select diet type (keto, vegan, etc.)
- Users CANNOT search for specific meals or restaurants
- App returns 3 pre-selected meals with match scores
- No meal search functionality exists

PLATFORM TARGETING OPTIONS:
${config.platform.targetingOptions.map(option => `- ${option}`).join('\n')}

REQUIREMENTS:
Create comprehensive targeting strategy including:

1. **PRIMARY AUDIENCE** (Core target - 60% of budget)
2. **SECONDARY AUDIENCE** (Broader target - 30% of budget)  
3. **RETARGETING AUDIENCE** (Previous visitors - 10% of budget)

For each audience, specify:
- Demographics (age, gender, income, education)
- Geographic targeting (specific to ${config.location})
- Interests and behaviors
- Custom audiences (if applicable)
- Exclusions to avoid
- Estimated audience size and competition level

Focus on people interested in ${config.dietType} lifestyle in ${config.location} area.

IMPORTANT: Always refer to the app as "PerfectPlate" - this is the brand name, not "Restaurant Meal Finder".`;

    return await callGeminiAPI(prompt, apiKey);
}

// Generate AI video prompts for 5-second segments
async function generateVideoPrompts(apiKey, config) {
    const prompt = `${config.creativeStyle === 'bonkers' ? 
        `🤯 BONKERS MODE: CREATE ONE COHERENT INSANE AD CAMPAIGN 🤯

CAMPAIGN CONTEXT:
- Campaign Theme: ${config.campaignTheme || 'Effortless Food Discovery'}
- You must create video segments that match this established campaign theme but in a completely bonkers way.

You are creating a UNIFIED, COMPLETELY BONKERS ad campaign where the video segments tell ONE CRAZY STORY that matches the campaign theme above.

BONKERS CAMPAIGN REQUIREMENTS:
- Use the SAME insane theme from the ad copy variations
- Make ALL video segments follow that SAME theme/story
- Create EXTREMELY detailed video descriptions (specific clothing colors/styles, facial expressions, lighting, props, setting details)
- Include TikTok-style text overlays for each segment
- Make it so UNHINGED that people can't scroll past
- But still show the actual app functionality: ZIP code → diet selection → 3 results

EXAMPLE COHERENT THEMES TO MATCH AD COPY:
- "The Keto Code Conspiracy" - Everything is about secret government keto databases
- "My Phone Became a Keto God" - Phone gains sentience and becomes obsessed with finding perfect meals
- "Quantum Keto Realm" - Person discovers interdimensional food portal through ZIP codes

CREATE A COMPLETE CAMPAIGN WITH:

**🎪 CAMPAIGN THEME:** [The crazy overarching story/concept that matches the ad copy]

**📱 TIKTOK DESCRIPTION:**
[Viral TikTok description with emojis and hashtags that matches the theme]

**SEGMENT 1 (0-5 seconds): Hook/Problem**
🎬 **AI Video Prompt:** [EXTREMELY DETAILED description - include specific clothing (colors, style, fabric), exact facial expressions, lighting (bright/dim/colored/dramatic), setting details (furniture, walls, props), body language, camera angle (close-up/wide/tilted), mood. ABSOLUTELY NO TEXT, WORDS, NUMBERS, OR INTERFACE ELEMENTS]
📱 **Text Overlay:** "[What text appears on screen - will be added manually in post]"
🎤 **Voiceover:** "[Dramatic/chaotic voiceover with style directions in brackets like [whispers], [screams], [coughs]]"

**SEGMENT 2 (5-10 seconds): Solution Introduction**
🎬 **AI Video Prompt:** [EXTREMELY DETAILED - different person but continuing the same theme/story. NO TEXT, WORDS, NUMBERS, OR INTERFACE ELEMENTS]
📱 **Text Overlay:** "[Screen text - will be added manually in post]"
🎤 **Voiceover:** "[Continues the story with style directions in brackets like [whispers], [excited], [mysterious]]"

**SEGMENT 3 (10-15 seconds): App Demo/Results**
🎬 **AI Video Prompt:** [EXTREMELY DETAILED - showing the "magical" results within the theme. NO TEXT, WORDS, NUMBERS, OR INTERFACE ELEMENTS]
📱 **Text Overlay:** "[Screen text - will be added manually in post]"
🎤 **Voiceover:** "[Reveals the results dramatically with style directions in brackets like [booming voice], [gasps], [triumphant]]"

**SEGMENT 4 (15-20 seconds): Call to Action**
🎬 **AI Video Prompt:** [EXTREMELY DETAILED - epic conclusion to the story. NO TEXT, WORDS, NUMBERS, OR INTERFACE ELEMENTS]
📱 **Text Overlay:** "[Final CTA text - will be added manually in post]"
🎤 **Voiceover:** "[Urgent call to action in theme with style directions in brackets like [urgent], [commanding], [whispers urgently]]"

**COMPLETE VOICEOVER SCRIPT:**
[All segments combined into one flowing script with style directions in brackets like (0-5s - [frantic whisper]): "Text here", (5-10s - [distorted hacker voice]): "Text here", etc.]

**📱 MANUAL SCREENSHOTS NEEDED:**
[ONLY screenshots that actually exist in the PerfectPlate app - remember: users can ONLY enter ZIP code and select diet type, then get 3 results with match scores. Do NOT create fantasy screenshots with special themes or interfaces that don't exist.]

ACTUAL SCREENSHOTS TO RECORD:
1. **ZIP Code Entry Screen** - The real PerfectPlate interface showing the ZIP code input field
2. **Diet Selection Screen** - The real dropdown menu with diet options (keto, vegan, paleo, etc.)
3. **Results Screen** - The real results showing 3 meals with actual match scores (like 87%, 92%, etc.)

**📱 SOCIAL MEDIA POST COPY:**
[Complete description and hashtags for posting this video on TikTok/Instagram/Facebook]

**🎨 VISUAL STYLE:**
[Colors, mood, props, lighting that maintains the theme throughout]

CRITICAL: Always refer to the app as "PerfectPlate" throughout the entire response. Never use "Restaurant Meal Finder" or any other name.

FINAL REMINDER ABOUT APP FUNCTIONALITY:
- PerfectPlate does NOT have meal search functionality
- Users can ONLY enter ZIP code + select diet type
- Do NOT create screenshots showing search bars for typing meal names
- Screenshots should show: ZIP code entry, diet dropdown selection, and 3 meal results with match scores` 
        : 
        `Create a complete 15-20 second video ad for ${config.product.name} using ${config.platform.name}.

CAMPAIGN CONTEXT:
- Campaign Theme: ${config.campaignTheme || 'Effortless Food Discovery'}
- Your video segments must align with and support this established campaign theme.

PRODUCT CONTEXT:
- App Name: PerfectPlate (always use this exact name)
- Description: ${config.product.description}
- Target Diet: ${config.dietType}
- Location: ${config.location}
- Creative Style: ${config.creativeStyle}

HOW PERFECTPLATE ACTUALLY WORKS (READ CAREFULLY):
${config.product.howItWorks ? config.product.howItWorks.map(step => `- ${step}`).join('\n') : ''}

CRITICAL LIMITATIONS - WHAT USERS CANNOT DO:
- Users CANNOT search for specific meals (like "keto chicken wings" or "vegan pizza")
- Users CANNOT type in food names or restaurant names
- Users CANNOT browse by cuisine type or meal categories
- There is NO search bar for typing meal names

WHAT USERS CAN ACTUALLY DO:
- Enter ZIP code only
- Select ONE dietary preference from dropdown (keto, vegan, paleo, etc.)
- Click "Find Perfect Meals" button
- Get 3 pre-selected meals with match scores

AI VIDEO GENERATOR LIMITATIONS - CRITICAL:
- ABSOLUTELY NO TEXT in video prompts (no words, numbers, interface elements, labels, signs)
- NO character continuity between scenes (don't reference "same person from previous scene")
- NO brand logos, app interfaces, or restaurant names in prompts
- NO phone screens showing specific content or text
- SIMPLE scenes only - focus on people, actions, emotions, environments, lighting
- Each segment is independent with different people/settings
- Describe ONLY what the camera sees: person, clothing, actions, facial expressions, setting

REQUIREMENTS:
Create a video broken into 3-4 segments of 5 seconds each, with:
1. Simple AI video generation prompts (no text, no character continuity)
2. Voiceover script for each segment
3. Manual screenshots needed (separate from AI video)

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

**SEGMENT 1 (0-5 seconds): Hook/Problem**
🎬 AI Video Prompt: [Simple scene description - person, clothing, action, environment, mood, lighting. ABSOLUTELY NO TEXT, WORDS, NUMBERS, INTERFACE ELEMENTS, OR LOGOS]
🎤 Voiceover: "[Exact script with style directions in brackets like [frustrated], [sighs], [excited]]"
🎯 Purpose: [What this segment accomplishes]

**SEGMENT 2 (5-10 seconds): Solution Introduction**
🎬 AI Video Prompt: [Simple scene - different person, clothing, action, environment. NO continuity with previous scene. ABSOLUTELY NO TEXT, WORDS, NUMBERS, OR INTERFACE ELEMENTS]
🎤 Voiceover: "[Exact script with style directions in brackets like [hopeful], [confident], [relieved]]"
🎯 Purpose: [Segment purpose]

**SEGMENT 3 (10-15 seconds): App Demo/Results**
🎬 AI Video Prompt: [Simple scene showing satisfaction/happiness. NO app interface, NO text, NO phone screens with content. ABSOLUTELY NO TEXT, WORDS, NUMBERS, OR INTERFACE ELEMENTS]
🎤 Voiceover: "[Exact script with style directions in brackets like [amazed], [delighted], [satisfied]]"
🎯 Purpose: [Segment purpose]

**SEGMENT 4 (15-20 seconds): Call-to-Action**
🎬 AI Video Prompt: [Simple scene showing action/download gesture. ABSOLUTELY NO TEXT, WORDS, NUMBERS, APP STORE LOGOS, OR INTERFACE ELEMENTS]
🎤 Voiceover: "[Exact script with style directions in brackets like [urgent], [encouraging], [confident]]"
🎯 Purpose: [Segment purpose]

**COMPLETE VOICEOVER SCRIPT:**
[Full script from all segments combined with style directions in brackets like (0-5s - [frustrated]): "Text here", (5-10s - [hopeful]): "Text here", etc.]

**MANUAL SCREENSHOTS NEEDED:**
[ONLY screenshots that actually exist in the PerfectPlate app - remember: users can ONLY enter ZIP code and select diet type, then get 3 results with match scores. Do NOT create fantasy screenshots.]

ACTUAL SCREENSHOTS TO RECORD:
1. **ZIP Code Entry Screen** - The real PerfectPlate interface showing the ZIP code input field
2. **Diet Selection Screen** - The real dropdown menu with diet options (keto, vegan, paleo, etc.)
3. **Results Screen** - The real results showing 3 meals with actual match scores (like 87%, 92%, etc.)

**📱 SOCIAL MEDIA POST COPY:**
[Complete description and hashtags for posting this video on TikTok/Instagram/Facebook]

**VISUAL STYLE NOTES:**
[Overall visual direction, colors, mood, style for consistency]

Keep AI prompts SIMPLE - just describe people, actions, and environments. All text, logos, and app interfaces will be added manually as overlays.

CRITICAL: Always refer to the app as "PerfectPlate" throughout the entire response. Never use "Restaurant Meal Finder" or any other name.

FINAL REMINDER ABOUT APP FUNCTIONALITY:
- PerfectPlate does NOT have meal search functionality
- Users can ONLY enter ZIP code + select diet type
- Do NOT create screenshots showing search bars for typing meal names
- Screenshots should show: ZIP code entry, diet dropdown selection, and 3 meal results with match scores`}`;

    return await callGeminiAPI(prompt, apiKey);
}

// Generate visual concepts
async function generateVisualConcepts(apiKey, config) {
    const prompt = `Create 5 visual content concepts for ${config.platform.name} ads promoting ${config.product.name}.

CAMPAIGN DETAILS:
- Product: ${config.product.name}
- Platform: ${config.platform.name}
- Creative Style: ${config.creativeStyle}
- Target Diet: ${config.dietType}
- Objective: ${config.objective}

PLATFORM AD FORMATS:
${config.platform.adFormats.map(format => `- ${format}`).join('\n')}

REQUIREMENTS:
Create 5 distinct visual concepts that:
- Match ${config.creativeStyle} style
- Appeal to ${config.dietType} audience
- Work well for ${config.platform.name} format
- Support ${config.objective} campaign goal
- Include specific visual elements, colors, and composition
- Address ${config.product.painPoints.join(', ')}

FORMAT:
**CONCEPT 1: [Name]**
Description: [Detailed visual description]
Key Elements: [Specific visual elements to include]
Emotional Appeal: [How it connects with audience]

**CONCEPT 2: [Name]**
[Same format for each concept]

Focus on authentic, relatable scenarios that ${config.dietType} people face when dining out.`;

    return await callGeminiAPI(prompt, apiKey);
}

// Generate setup instructions
async function generateSetupInstructions(apiKey, config) {
    const prompt = `Create step-by-step setup instructions for ${config.platform.name} ads promoting PerfectPlate.

CAMPAIGN CONTEXT:
- Campaign Theme: ${config.campaignTheme || 'Effortless Food Discovery'}
- These setup instructions should reference and support the established campaign theme above.

CAMPAIGN DETAILS:
- App Name: PerfectPlate (always use this exact name)
- Platform: ${config.platform.name}
- Objective: ${config.objective}
- Budget: $${config.budget}/day

PLATFORM FEATURES:
- Ad Formats: ${config.platform.adFormats.join(', ')}
- Targeting Options: ${config.platform.targetingOptions.join(', ')}

REQUIREMENTS:
Create comprehensive setup guide including:

1. **ACCOUNT SETUP** (Platform-specific account creation and verification)
2. **CAMPAIGN CREATION** (Step-by-step campaign setup)
3. **AD GROUP CONFIGURATION** (Targeting and budget allocation)
4. **CREATIVE UPLOAD** (Ad format requirements and upload process)
5. **TRACKING SETUP** (Conversion tracking and analytics)
6. **LAUNCH CHECKLIST** (Pre-launch verification steps)
7. **OPTIMIZATION TIPS** (Post-launch monitoring and optimization)

Make instructions specific to ${config.platform.name} interface and ${config.objective} objective.
Include recommended budget allocation: $${config.budget}/day total budget.

IMPORTANT: Always refer to the app as "PerfectPlate" throughout all instructions.`;

    return await callGeminiAPI(prompt, apiKey);
}

// Call Gemini API
async function callGeminiAPI(prompt, apiKey) {
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
    
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

// Display ad results
function displayAdResults(adCopy, targeting, videoPrompts, setup) {
    // Show results container
    document.getElementById('generatedAds').style.display = 'block';
    
    // Populate ad copy section
    document.getElementById('adCopyContent').innerHTML = formatAdCopy(adCopy);
    
    // Populate targeting section
    document.getElementById('targetingContent').innerHTML = formatTargeting(targeting);
    
    // Populate video prompts section
    const videoData = formatVideoPrompts(videoPrompts);
    document.getElementById('videoPromptsContent').innerHTML = videoData.prompts;
    document.getElementById('screenshotsContent').innerHTML = videoData.screenshots;
    
    // Populate setup section
    document.getElementById('setupContent').innerHTML = formatSetup(setup);
    
    // Scroll to results
    document.getElementById('generatedAds').scrollIntoView({ behavior: 'smooth' });
}

// Format ad copy for display
function formatAdCopy(content) {
    // Parse the content and format it nicely
    const variations = content.split('**VARIATION');
    let html = '';
    
    variations.forEach((variation, index) => {
        if (index === 0) return; // Skip empty first element
        
        const lines = variation.split('\n').filter(line => line.trim());
        const title = `Variation ${index}`;
        
        html += `
            <div class="ad-variation">
                <h5>${title}</h5>
                <div class="ad-content">
                    ${lines.map(line => {
                        if (line.includes('Headline:')) {
                            return `<div class="ad-headline">${line}</div>`;
                        } else if (line.includes('Description:')) {
                            return `<div class="ad-description">${line}</div>`;
                        } else if (line.includes('Call-to-Action:')) {
                            return `<div class="ad-cta">${line}</div>`;
                        }
                        return `<div>${line}</div>`;
                    }).join('')}
                </div>
                <button class="copy-btn" onclick="copyAdVariation('${title}', \`${variation.replace(/`/g, '\\`')}\`)">📋 Copy ${title}</button>
            </div>
        `;
    });
    
    return html;
}

// Format targeting for display
function formatTargeting(content) {
    const sections = content.split(/\*\*([^*]+)\*\*/);
    let html = '';
    
    for (let i = 1; i < sections.length; i += 2) {
        const title = sections[i];
        const content_text = sections[i + 1] || '';
        
        html += `
            <div class="targeting-category">
                <h5>${title}</h5>
                <div class="targeting-content">
                    ${content_text.split('\n').filter(line => line.trim()).map(line => {
                        if (line.trim().startsWith('-')) {
                            return `<div class="targeting-item">${line.trim().substring(1).trim()}</div>`;
                        }
                        return `<p>${line.trim()}</p>`;
                    }).join('')}
                </div>
            </div>
        `;
    }
    
    html += `<button class="copy-btn" onclick="copyTargeting()">📋 Copy All Targeting</button>`;
    
    return html;
}

// Format video prompts for display
function formatVideoPrompts(content) {
    let promptsHtml = '';
    
    // Check if this is bonkers mode with campaign theme
    if (content.includes('**🎪 CAMPAIGN THEME:**')) {
        // Handle bonkers mode format
        const themeMatch = content.match(/\*\*🎪 CAMPAIGN THEME:\*\*\s*(.+?)(?=\*\*📱 TIKTOK DESCRIPTION:\*\*)/s);
        const tiktokMatch = content.match(/\*\*📱 TIKTOK DESCRIPTION:\*\*\s*(.+?)(?=\*\*SEGMENT 1)/s);
        
        if (themeMatch) {
            promptsHtml += `
                <div class="campaign-theme" style="background: linear-gradient(135deg, #ff6b6b, #4ecdc4); color: white; padding: 20px; border-radius: 15px; margin-bottom: 20px; text-align: center;">
                    <h4>🎪 CAMPAIGN THEME</h4>
                    <p style="font-size: 18px; font-weight: bold;">${themeMatch[1].trim()}</p>
                </div>
            `;
        }
        
        if (tiktokMatch) {
            promptsHtml += `
                <div class="tiktok-description" style="background: #000; color: white; padding: 15px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #ff0050;">
                    <h5>📱 TikTok Description</h5>
                    <div style="font-family: monospace; white-space: pre-wrap;">${tiktokMatch[1].trim()}</div>
                    <button class="copy-btn" onclick="copyTikTokDescription(\`${tiktokMatch[1].trim().replace(/`/g, '\\`')}\`)">📋 Copy TikTok Description</button>
                </div>
            `;
        }
        
        // Parse bonkers segments
        const segments = content.split(/\*\*SEGMENT \d+/);
        segments.forEach((segment, index) => {
            if (index === 0) return; // Skip empty first element
            
            const lines = segment.split('\n').filter(line => line.trim());
            const title = lines[0] ? lines[0].replace(/[():\-\s]+/g, ' ').trim() : `Segment ${index}`;
            
            promptsHtml += `
                <div class="video-segment">
                    <h5>Segment ${index}: ${title}</h5>
                    <div class="segment-content">
                        ${lines.map(line => {
                            if (line.includes('🎬 **AI Video Prompt:**')) {
                                return `<div class="video-prompt"><strong>🎬 Video Prompt:</strong> ${line.replace('🎬 **AI Video Prompt:**', '').trim()}</div>`;
                            } else if (line.includes('📱 **Text Overlay:**')) {
                                return `<div class="text-overlay" style="background: #ff0050; color: white; padding: 10px; border-radius: 5px; margin: 5px 0;"><strong>📱 Text Overlay:</strong> ${line.replace('📱 **Text Overlay:**', '').trim()}</div>`;
                            } else if (line.includes('🎤 **Voiceover:**')) {
                                return `<div class="voiceover"><strong>🎤 Voiceover:</strong> ${line.replace('🎤 **Voiceover:**', '').trim()}</div>`;
                            }
                            return line.trim() ? `<p>${line.trim()}</p>` : '';
                        }).join('')}
                    </div>
                    <button class="copy-btn" onclick="copyVideoSegment('${title}', \`${segment.replace(/`/g, '\\`')}\`)">📋 Copy Segment ${index}</button>
                </div>
            `;
        });
    } else {
        // Handle normal mode format
        const segments = content.split(/\*\*SEGMENT \d+/);
        segments.forEach((segment, index) => {
            if (index === 0) return; // Skip empty first element
            
            const lines = segment.split('\n').filter(line => line.trim());
            const title = lines[0] ? lines[0].replace(/[():\-\s]+/g, ' ').trim() : `Segment ${index}`;
            
            promptsHtml += `
                <div class="video-segment">
                    <h5>Segment ${index}: ${title}</h5>
                    <div class="segment-content">
                        ${lines.map(line => {
                            if (line.includes('🎬 AI Video Prompt:')) {
                                return `<div class="video-prompt"><strong>🎬 Video Prompt:</strong> ${line.replace('🎬 AI Video Prompt:', '').trim()}</div>`;
                            } else if (line.includes('🎤 Voiceover:')) {
                                return `<div class="voiceover"><strong>🎤 Voiceover:</strong> ${line.replace('🎤 Voiceover:', '').trim()}</div>`;
                            } else if (line.includes('🎯 Purpose:')) {
                                return `<div class="purpose"><strong>🎯 Purpose:</strong> ${line.replace('🎯 Purpose:', '').trim()}</div>`;
                            }
                            return line.trim() ? `<p>${line.trim()}</p>` : '';
                        }).join('')}
                    </div>
                    <button class="copy-btn" onclick="copyVideoSegment('${title}', \`${segment.replace(/`/g, '\\`')}\`)">📋 Copy Segment ${index}</button>
                </div>
            `;
        });
    }
    
    // Add complete script section
    if (content.includes('**COMPLETE VOICEOVER SCRIPT:**')) {
        const scriptSection = content.split('**COMPLETE VOICEOVER SCRIPT:**')[1];
        if (scriptSection) {
            const script = scriptSection.split('**📱 MANUAL SCREENSHOTS NEEDED:**')[0].split('**MANUAL SCREENSHOTS NEEDED:**')[0].trim();
            promptsHtml += `
                <div class="complete-script">
                    <h5>🎤 Complete Voiceover Script</h5>
                    <div class="script-content">${script}</div>
                    <button class="copy-btn" onclick="copyCompleteScript(\`${script.replace(/`/g, '\\`')}\`)">📋 Copy Complete Script</button>
                </div>
            `;
        }
    }
    
    promptsHtml += `<button class="copy-btn" onclick="copyVideoPrompts()">📋 Copy All Video Prompts</button>`;
    
    // Handle social media post copy section
    if (content.includes('**📱 SOCIAL MEDIA POST COPY:**')) {
        const socialMediaSection = content.split('**📱 SOCIAL MEDIA POST COPY:**')[1];
        if (socialMediaSection) {
            const socialMediaCopy = socialMediaSection.split('**🎨 VISUAL STYLE:**')[0].split('**VISUAL STYLE NOTES:**')[0].trim();
            promptsHtml += `
                <div class="social-media-copy" style="background: #1da1f2; color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <h5>📱 Social Media Post Copy</h5>
                    <div style="font-family: monospace; white-space: pre-wrap; line-height: 1.6;">${socialMediaCopy}</div>
                    <button class="copy-btn" onclick="copySocialMediaCopy(\`${socialMediaCopy.replace(/`/g, '\\`')}\`)">📋 Copy Post Copy</button>
                </div>
            `;
        }
    }

    // Handle screenshots section
    let screenshotsHtml = '';
    if (content.includes('**📱 MANUAL SCREENSHOTS NEEDED:**') || content.includes('**MANUAL SCREENSHOTS NEEDED:**')) {
        const screenshotsSection = content.split('**📱 MANUAL SCREENSHOTS NEEDED:**')[1] || content.split('**MANUAL SCREENSHOTS NEEDED:**')[1];
        if (screenshotsSection) {
            const screenshots = screenshotsSection.split('**📱 SOCIAL MEDIA POST COPY:**')[0].split('**🎨 VISUAL STYLE:**')[0].split('**VISUAL STYLE NOTES:**')[0].trim();
            const screenshotLines = screenshots.split('\n').filter(line => line.trim());
            
            screenshotsHtml = `
                <div class="screenshots-list">
                    ${screenshotLines.map(line => {
                        if (line.trim().startsWith('-')) {
                            return `<div class="screenshot-item">📱 ${line.trim().substring(1).trim()}</div>`;
                        }
                        return line.trim() ? `<p>${line.trim()}</p>` : '';
                    }).join('')}
                </div>
                <button class="copy-btn" onclick="copyScreenshots(\`${screenshots.replace(/`/g, '\\`')}\`)">📋 Copy Screenshot List</button>
            `;
        }
    }
    
    return {
        prompts: promptsHtml,
        screenshots: screenshotsHtml
    };
}

// Format visuals for display
function formatVisuals(content) {
    const concepts = content.split(/\*\*CONCEPT \d+:/);
    let html = '';
    
    concepts.forEach((concept, index) => {
        if (index === 0) return; // Skip empty first element
        
        const lines = concept.split('\n').filter(line => line.trim());
        const title = lines[0] ? lines[0].replace('**', '').trim() : `Concept ${index}`;
        
        html += `
            <div class="visual-concept">
                <h5>Concept ${index}: ${title}</h5>
                <div class="concept-content">
                    ${lines.slice(1).map(line => `<p>${line.trim()}</p>`).join('')}
                </div>
            </div>
        `;
    });
    
    html += `<button class="copy-btn" onclick="copyVisuals()">📋 Copy All Visual Concepts</button>`;
    
    return html;
}

// Format setup instructions for display
function formatSetup(content) {
    const steps = content.split(/\d+\.\s*\*\*([^*]+)\*\*/);
    let html = '';
    
    for (let i = 1; i < steps.length; i += 2) {
        const title = steps[i];
        const content_text = steps[i + 1] || '';
        
        html += `
            <div class="setup-step">
                <h5>${title}</h5>
                <div class="step-content">
                    ${content_text.split('\n').filter(line => line.trim()).map(line => {
                        if (line.trim().startsWith('-')) {
                            return `<li>${line.trim().substring(1).trim()}</li>`;
                        }
                        return `<p>${line.trim()}</p>`;
                    }).join('')}
                </div>
            </div>
        `;
    }
    
    html += `<button class="copy-btn" onclick="copySetup()">📋 Copy Setup Instructions</button>`;
    
    return html;
}

// Show ad section
function showAdSection(section) {
    // Update tabs
    document.querySelectorAll('.ad-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[onclick="showAdSection('${section}')"]`).classList.add('active');
    
    // Update sections
    document.querySelectorAll('.ad-section').forEach(sec => {
        sec.classList.remove('active');
    });
    document.getElementById(`${section}-section`).classList.add('active');
}

// Copy functions
function copyAdVariation(title, content) {
    navigator.clipboard.writeText(content).then(() => {
        showAdSuccess(`${title} copied to clipboard!`);
    }).catch(() => {
        showAdError('Failed to copy ad variation');
    });
}

function copyTargeting() {
    const content = document.getElementById('targetingContent').innerText;
    navigator.clipboard.writeText(content).then(() => {
        showAdSuccess('Targeting recommendations copied to clipboard!');
    }).catch(() => {
        showAdError('Failed to copy targeting');
    });
}

function copyVisuals() {
    const content = document.getElementById('visualsContent').innerText;
    navigator.clipboard.writeText(content).then(() => {
        showAdSuccess('Visual concepts copied to clipboard!');
    }).catch(() => {
        showAdError('Failed to copy visuals');
    });
}

function copySetup() {
    const content = document.getElementById('setupContent').innerText;
    navigator.clipboard.writeText(content).then(() => {
        showAdSuccess('Setup instructions copied to clipboard!');
    }).catch(() => {
        showAdError('Failed to copy setup instructions');
    });
}

function copyVideoSegment(title, content) {
    navigator.clipboard.writeText(content).then(() => {
        showAdSuccess(`${title} video segment copied to clipboard!`);
    }).catch(() => {
        showAdError('Failed to copy video segment');
    });
}

function copyCompleteScript(script) {
    navigator.clipboard.writeText(script).then(() => {
        showAdSuccess('Complete voiceover script copied to clipboard!');
    }).catch(() => {
        showAdError('Failed to copy voiceover script');
    });
}

function copyTikTokDescription(description) {
    navigator.clipboard.writeText(description).then(() => {
        showAdSuccess('TikTok description copied to clipboard!');
    }).catch(() => {
        showAdError('Failed to copy TikTok description');
    });
}

function copySocialMediaCopy(copy) {
    navigator.clipboard.writeText(copy).then(() => {
        showAdSuccess('Social media post copy copied to clipboard!');
    }).catch(() => {
        showAdError('Failed to copy social media post copy');
    });
}

function copyVideoPrompts() {
    const content = document.getElementById('videoPromptsContent').innerText;
    navigator.clipboard.writeText(content).then(() => {
        showAdSuccess('All video prompts copied to clipboard!');
    }).catch(() => {
        showAdError('Failed to copy video prompts');
    });
}

function copyScreenshots(screenshots) {
    navigator.clipboard.writeText(screenshots).then(() => {
        showAdSuccess('Screenshot list copied to clipboard!');
    }).catch(() => {
        showAdError('Failed to copy screenshot list');
    });
}

// Reset ad form
function resetAdForm() {
    selectedProduct = null;
    selectedPlatform = null;
    
    // Reset UI
    document.querySelectorAll('.product-card, .platform-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Hide configuration
    document.getElementById('campaignConfig').style.display = 'none';
    
    // Hide results
    document.getElementById('generatedAds').style.display = 'none';
    
    // Reset form fields
    document.getElementById('adLocation').value = '';
    document.getElementById('adBudget').value = '';
    
    hideAdError();
    hideAdSuccess();
}

// Utility functions for showing/hiding messages
function showAdError(message) {
    const errorDiv = document.getElementById('adError');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
}

function hideAdError() {
    const errorDiv = document.getElementById('adError');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

function showAdSuccess(message) {
    const successDiv = document.getElementById('adSuccess');
    if (successDiv) {
        successDiv.textContent = message;
        successDiv.style.display = 'block';
        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 3000);
    }
}

function hideAdSuccess() {
    const successDiv = document.getElementById('adSuccess');
    if (successDiv) {
        successDiv.style.display = 'none';
    }
}

// Export functions for global access
window.AdsCreator = {
    selectProduct,
    selectPlatform,
    generateAds,
    showAdSection,
    resetAdForm,
    copyAdVariation,
    copyTargeting,
    copyVideoSegment,
    copyCompleteScript,
    copyVideoPrompts,
    copyScreenshots,
    copySetup
};

// Make functions globally accessible
window.selectProduct = selectProduct;
window.selectPlatform = selectPlatform;
window.generateAds = generateAds;
window.showAdSection = showAdSection;
window.resetAdForm = resetAdForm;
window.copyAdVariation = copyAdVariation;
window.copyTargeting = copyTargeting;
window.copyVideoSegment = copyVideoSegment;
window.copyCompleteScript = copyCompleteScript;
window.copyTikTokDescription = copyTikTokDescription;
window.copySocialMediaCopy = copySocialMediaCopy;
window.copyVideoPrompts = copyVideoPrompts;
window.copyScreenshots = copyScreenshots;
window.copySetup = copySetup;
