// Social Media Content Generation Module
// Handles TikTok, Facebook, and Instagram post generation

// Global variables for social media
let selectedDay = null;
let dayTemplates = {};
let restaurantData = {};

// Day templates with specific focus and restaurant suggestions
function initializeDayTemplates() {

    dayTemplates = {
        'monday': {
            name: "Meatless Monday",
            emoji: "🌱",
            focus: "vegan",
            hashtags: ["#MeatlessMonday", "#VeganOptions", "#PlantBased"],
            restaurants: ["Olive Garden", "Chipotle", "Subway", "Taco Bell", "Panera Bread", "Starbucks"],
            tiktokTemplate: "🌱 Meatless Monday: Found {count} vegan options at {restaurant}! {detail} #MeatlessMonday #VeganOptions #{restaurant}",
            facebookTemplate: "🌱 MEATLESS MONDAY: Found {count} vegan options at {restaurant}!\n\n{detail}\n\nWho's trying these this week? Drop a 🌱 if you're joining the plant-based movement!\n\n#MeatlessMonday #VeganEats #{restaurant} #PlantBased",
            dietVariations: {
                vegetarian: {
                    tiktokTemplate: "🌱 Meatless Monday: Found {count} vegetarian options at {restaurant}! {detail} #MeatlessMonday #VegetarianOptions #{restaurant}",
                    facebookTemplate: "🌱 MEATLESS MONDAY: Found {count} vegetarian options at {restaurant}!\n\n{detail}\n\nWho's trying these this week? Drop a 🌱 if you're going meatless!\n\n#MeatlessMonday #VegetarianEats #{restaurant} #PlantBased"
                }
            }
        },
        'tuesday': {
            name: "Transformation Tuesday",
            emoji: "✨",
            focus: "surprising",
            hashtags: ["#TransformationTuesday", "#SurprisingFinds", "#UnexpectedOptions"],
            restaurants: ["McDonald's", "Burger King", "KFC", "Pizza Hut", "Domino's", "Wendy's"],
            tiktokTemplate: "✨ Transformation Tuesday: Who knew {restaurant} had {count} {diet} options? {detail} #TransformationTuesday #SurprisingFinds #{restaurant}",
            facebookTemplate: "✨ TRANSFORMATION TUESDAY: Who knew {restaurant} had {count} {diet} options?\n\n{detail}\n\nWhat's the most surprising restaurant discovery you've made? Share in the comments!\n\n#TransformationTuesday #SurprisingFinds #{restaurant} #UnexpectedOptions"
        },
        'keto-tuesday': {
            name: "Keto Tuesday",
            emoji: "🥑",
            focus: "keto",
            hashtags: ["#KetoTuesday", "#KetoLife", "#LowCarb"],
            restaurants: ["In-N-Out", "Five Guys", "Chipotle", "Subway", "Jimmy John's", "Panera Bread"],
            tiktokTemplate: "🥑 Keto Tuesday: Found {count} keto options at {restaurant}! {detail} #KetoTuesday #KetoLife #{restaurant}",
            facebookTemplate: "🥑 KETO TUESDAY: Found {count} keto-friendly options at {restaurant}!\n\n{detail}\n\nKeto friends, which restaurants have surprised you the most? Drop a 🥑 below!\n\n#KetoTuesday #KetoLife #{restaurant} #LowCarb",
            dietVariations: {
                lowcarb: {
                    tiktokTemplate: "🥑 Keto Tuesday: Found {count} low-carb options at {restaurant}! {detail} #KetoTuesday #LowCarb #{restaurant}",
                    facebookTemplate: "🥑 KETO TUESDAY: Found {count} low-carb options at {restaurant}!\n\n{detail}\n\nWhich low-carb finds have you discovered? Share below!\n\n#KetoTuesday #LowCarb #{restaurant}"
                }
            }
        },
        'wednesday': {
            name: "Wednesday Wins",
            emoji: "🎯",
            focus: "healthy",
            hashtags: ["#WednesdayWins", "#HealthyEating", "#MidweekBoost"],
            restaurants: ["Panera Bread", "Chipotle", "Subway", "Sweetgreen", "Mediterranean Grill"],
            tiktokTemplate: "🎯 Wednesday Wins: Found {count} healthy options at {restaurant}! {detail} #WednesdayWins #{restaurant}",
            facebookTemplate: "🎯 WEDNESDAY WINS: Found {count} healthy options at {restaurant}!\n\n{detail}\n\nWhat's your midweek healthy dining win? Share below! 🎯\n\n#WednesdayWins #HealthyEating #{restaurant}"
        },
        'diabetic-friendly-wednesday': {
            name: "Diabetic-Friendly Wednesday",
            emoji: "💚",
            focus: "diabetic",
            hashtags: ["#DiabeticFriendly", "#HealthyEating", "#BloodSugarFriendly"],
            restaurants: ["Panera Bread", "Chipotle", "Subway", "Sweetgreen", "Mediterranean Grill"],
            tiktokTemplate: "💚 Diabetic-Friendly Wednesday: Found {count} blood sugar-friendly options at {restaurant}! {detail} #DiabeticFriendly #{restaurant}",
            facebookTemplate: "💚 DIABETIC-FRIENDLY WEDNESDAY: Found {count} blood sugar-friendly options at {restaurant}!\n\n{detail}\n\nManaging diabetes while dining out? Share your favorite finds! 💚\n\n#DiabeticFriendly #HealthyEating #{restaurant}",
            dietVariations: {
                lowsugar: {
                    tiktokTemplate: "💚 Diabetic-Friendly Wednesday: Found {count} low-sugar options at {restaurant}! {detail} #DiabeticFriendly #LowSugar #{restaurant}",
                    facebookTemplate: "💚 DIABETIC-FRIENDLY WEDNESDAY: Found {count} low-sugar options at {restaurant}!\n\n{detail}\n\nWhat are your go-to low-sugar restaurant choices? 💚\n\n#DiabeticFriendly #LowSugar #{restaurant}"
                }
            }
        },
        'thursday': {
            name: "Thursday Treats",
            emoji: "🌟",
            focus: "balanced",
            hashtags: ["#ThursdayTreats", "#BalancedEating", "#AlmostFriday"],
            restaurants: ["Chipotle", "Mediterranean Grill", "Salad Works", "MOD Pizza", "Qdoba"],
            tiktokTemplate: "🌟 Thursday Treats: Found {count} balanced options at {restaurant}! {detail} #ThursdayTreats #{restaurant}",
            facebookTemplate: "🌟 THURSDAY TREATS: Found {count} balanced options at {restaurant}!\n\n{detail}\n\nAlmost Friday! What's your Thursday dining treat? 🌟\n\n#ThursdayTreats #BalancedEating #{restaurant}"
        },
        'paleo-thursday': {
            name: "Paleo Thursday",
            emoji: "🥩",
            focus: "paleo",
            hashtags: ["#PaleoThursday", "#PaleoLife", "#WholeFood"],
            restaurants: ["Chipotle", "Mediterranean Grill", "Salad Works", "MOD Pizza", "Qdoba"],
            tiktokTemplate: "🥩 Paleo Thursday: Found {count} paleo-friendly options at {restaurant}! {detail} #PaleoThursday #PaleoLife #{restaurant}",
            facebookTemplate: "🥩 PALEO THURSDAY: Found {count} paleo-friendly options at {restaurant}!\n\n{detail}\n\nPaleo community, what are your favorite dining discoveries? Drop a 🥩!\n\n#PaleoThursday #PaleoLife #{restaurant} #WholeFood",
            dietVariations: {
                wholefood: {
                    tiktokTemplate: "🥩 Paleo Thursday: Found {count} whole food options at {restaurant}! {detail} #PaleoThursday #WholeFood #{restaurant}",
                    facebookTemplate: "🥩 PALEO THURSDAY: Found {count} whole food options at {restaurant}!\n\n{detail}\n\nLove whole foods? Share your restaurant wins! 🥩\n\n#PaleoThursday #WholeFood #{restaurant}"
                }
            }
        },
        'friday': {
            name: "Foodie Friday",
            emoji: "🍽️",
            focus: "foodie",
            hashtags: ["#FoodieFriday", "#WeekendEats", "#FridayFeasts"],
            restaurants: ["Chipotle", "P.F. Chang's", "Outback Steakhouse", "Red Robin", "California Pizza Kitchen"],
            tiktokTemplate: "🍽️ Foodie Friday: Found {count} amazing options at {restaurant}! {detail} #FoodieFriday #{restaurant}",
            facebookTemplate: "🍽️ FOODIE FRIDAY: Found {count} amazing options at {restaurant}!\n\n{detail}\n\nWhat's your Friday food adventure? Share below! 🍽️\n\n#FoodieFriday #WeekendEats #{restaurant}"
        },
        'gluten-free-friday': {
            name: "Gluten-Free Friday",
            emoji: "🌾",
            focus: "glutenfree",
            hashtags: ["#GlutenFreeFriday", "#GlutenFree", "#CeliacSafe"],
            restaurants: ["Chipotle", "P.F. Chang's", "Outback Steakhouse", "Red Robin", "California Pizza Kitchen"],
            tiktokTemplate: "🌾 Gluten-Free Friday: Found {count} gluten-free options at {restaurant}! {detail} #GlutenFreeFriday #GlutenFree #{restaurant}",
            facebookTemplate: "🌾 GLUTEN-FREE FRIDAY: Found {count} gluten-free options at {restaurant}!\n\n{detail}\n\nGluten-free community, which restaurants make you feel safest? Share below! 🌾\n\n#GlutenFreeFriday #GlutenFree #{restaurant} #CeliacSafe",
            dietVariations: {
                celiac: {
                    tiktokTemplate: "🌾 Gluten-Free Friday: Found {count} celiac-safe options at {restaurant}! {detail} #GlutenFreeFriday #CeliacSafe #{restaurant}",
                    facebookTemplate: "🌾 GLUTEN-FREE FRIDAY: Found {count} celiac-safe options at {restaurant}!\n\n{detail}\n\nCeliac friends, which restaurants have the best protocols? 🌾\n\n#GlutenFreeFriday #CeliacSafe #{restaurant}"
                }
            }
        },
        'saturday': {
            name: "Surprise Saturday",
            emoji: "🎉",
            focus: "surprising",
            hashtags: ["#SurpriseSaturday", "#UnexpectedFinds", "#HiddenGems"],
            restaurants: ["Taco Bell", "McDonald's", "Wendy's", "Arby's", "White Castle", "Jack in the Box"],
            tiktokTemplate: "🎉 Surprise Saturday: You won't believe {restaurant} has {count} {diet} options! {detail} #SurpriseSaturday #{restaurant}",
            facebookTemplate: "🎉 SURPRISE SATURDAY: You won't believe {restaurant} has {count} {diet} options!\n\n{detail}\n\nWhat's the most surprising restaurant discovery you've made? Drop it below! 🎉\n\n#SurpriseSaturday #UnexpectedFinds #{restaurant}",
            dietVariations: {
                healthy: {
                    tiktokTemplate: "🎉 Surprise Saturday: You won't believe {restaurant} has {count} healthy options! {detail} #SurpriseSaturday #HealthyFinds #{restaurant}",
                    facebookTemplate: "🎉 SURPRISE SATURDAY: You won't believe {restaurant} has {count} healthy options!\n\n{detail}\n\nWhat healthy surprises have you found at unexpected places? 🎉\n\n#SurpriseSaturday #HealthyFinds #{restaurant}"
                }
            }
        },
        'sunday': {
            name: "Sunday Special",
            emoji: "✨",
            focus: "special",
            hashtags: ["#SundaySpecial", "#WeekendTreats", "#FoodieFinds"],
            restaurants: ["Olive Garden", "Red Lobster", "Cheesecake Factory", "Applebee's", "Chili's"],
            tiktokTemplate: "✨ Sunday Special: {restaurant} has {count} amazing {diet} options! {detail} #SundaySpecial #{restaurant}",
            facebookTemplate: "✨ SUNDAY SPECIAL: {restaurant} has {count} amazing {diet} options!\n\n{detail}\n\nWhat's your Sunday dining tradition? Share your favorites! ✨\n\n#SundaySpecial #WeekendTreats #{restaurant}",
            dietVariations: {
                comfort: {
                    tiktokTemplate: "✨ Sunday Special: {restaurant} has {count} comfort food options! {detail} #SundaySpecial #ComfortFood #{restaurant}",
                    facebookTemplate: "✨ SUNDAY SPECIAL: {restaurant} has {count} comfort food options!\n\n{detail}\n\nWhat's your go-to comfort food spot? ✨\n\n#SundaySpecial #ComfortFood #{restaurant}"
                }
            }
        }
    };
}

// Utility functions for showing/hiding messages (from original script)
function showError(message) {
    const errorDiv = document.getElementById('error');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    } else {
        alert('Error: ' + message);
    }
}

function hideError() {
    const errorDiv = document.getElementById('error');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

function showSuccess(message) {
    const successDiv = document.getElementById('success');
    if (successDiv) {
        successDiv.textContent = message;
        successDiv.style.display = 'block';
        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 3000);
    } else {
        alert('Success: ' + message);
    }
}

function hideSuccess() {
    const successDiv = document.getElementById('success');
    if (successDiv) {
        successDiv.style.display = 'none';
    }
}

// Initialize restaurant data  
function initializeRestaurantData() {
    restaurantData = {
        demographics: {
            "18-24": {
                topRestaurants: ["McDonald's", "Taco Bell", "Chipotle", "Subway", "Starbucks"],
                dietInterests: ["vegan", "keto", "glutenfree"],
                platforms: ["TikTok", "Instagram"],
                tone: "casual"
            },
            "25-34": {
                topRestaurants: ["Chipotle", "Panera Bread", "Sweetgreen", "Mediterranean Grill", "Whole Foods"],
                dietInterests: ["keto", "paleo", "glutenfree", "vegan"],
                platforms: ["Instagram", "Facebook"],
                tone: "health-focused"
            },
            "35-44": {
                topRestaurants: ["Olive Garden", "Outback Steakhouse", "Applebee's", "Chili's", "Red Robin"],
                dietInterests: ["glutenfree", "diabetic", "keto"],
                platforms: ["Facebook", "Instagram"],
                tone: "family-focused"
            },
            "45+": {
                topRestaurants: ["Cracker Barrel", "Denny's", "IHOP", "Bob Evans", "Golden Corral"],
                dietInterests: ["diabetic", "heart-healthy", "lowsodium"],
                platforms: ["Facebook"],
                tone: "informative"
            }
        }
    };
    
}

// Generate content with Gemini API (from original script)
async function generateWithGemini(apiKey, template, variables, platform) {
    const baseContent = template.replace(/{(\w+)}/g, (match, key) => variables[key] || match);
    const creativityLevel = variables.creativityLevel || 'engaging';
    
    // Create different prompts based on creativity level
    let prompt = '';
    
    switch(creativityLevel) {
        case 'professional':
            prompt = `Rewrite this social media post to be professional, informative, and brand-safe while keeping the core message. Use clear, straightforward language. Platform: ${platform}. Keep it ${platform === 'tiktok' ? 'concise and clear' : 'detailed and informative'}:

"${baseContent}"

Requirements:
- Professional tone suitable for corporate brands
- Focus on facts and benefits
- Avoid slang, emojis, or risky language
- Clear value proposition

Please provide 3 different variations and separate them with "---"`;
            break;
            
        case 'engaging':
            prompt = `Rewrite this social media post to be more engaging and varied while keeping the same core message. Make it sound natural and relatable. Platform: ${platform}. Keep it ${platform === 'tiktok' ? 'short and punchy' : 'detailed and informative'}:

"${baseContent}"

Requirements:
- Conversational and friendly tone
- Include some personality and emotion
- Use relatable situations
- Moderate use of emojis

Please provide 3 different variations and separate them with "---"`;
            break;
            
        case 'bold':
            prompt = `Transform this social media post into attention-grabbing, bold content that stops the scroll. Be dramatic, emotional, and compelling. Platform: ${platform}. Keep it ${platform === 'tiktok' ? 'punchy with strong hooks' : 'engaging with emotional appeal'}:

"${baseContent}"

Requirements:
- Start with STRONG hooks that grab attention immediately
- Use emotional triggers (frustration, excitement, relief)
- Include bold claims and dramatic language
- Address pain points directly
- Use power words like "STOP", "NEVER AGAIN", "FINALLY"
- Create urgency and FOMO

Please provide 3 different variations and separate them with "---"`;
            break;
            
        case 'viral':
            prompt = `Transform this into VIRAL-WORTHY content that absolutely STOPS THE SCROLL. Be controversial, shocking, and impossible to ignore. Platform: ${platform}. Make it ${platform === 'tiktok' ? 'explosive and addictive' : 'shareable and discussion-worthy'}:

"${baseContent}"

Requirements:
- EXPLOSIVE opening hooks (controversial takes, shocking statements)
- Trigger emotional reactions (outrage, surprise, desire)
- Use unexpected angles and hot takes
- Include current trends and memes
- Create content people MUST comment on/share
- Address controversial diet culture topics
- Use psychological triggers (scarcity, social proof, controversy)
- Make bold, polarizing statements
- Include call-outs to common frustrations
- WARNING: This content is HIGH-RISK but HIGH-REWARD

Examples of viral hooks:
- "POV: You've been lied to about [diet] food..."
- "This app found 47 [diet] options at McDonald's and I'm SHOOK"
- "Nobody talks about this [diet] secret..."
- "I tested every restaurant app and this one broke me..."

Please provide 3 different VIRAL variations and separate them with "---"`;
            break;
            
        default:
            prompt = `Please rewrite this social media post to be more engaging and varied while keeping the same core message and information. Make it sound natural and avoid repetitive language. Platform: ${platform}. Keep it ${platform === 'tiktok' ? 'short and punchy' : 'detailed and informative'}:

"${baseContent}"

Please provide 3 different variations and separate them with "---"`;
    }
    
    
    
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
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Details:', errorText);
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('API Response:', data);
    
    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Clean up the response and extract actual variations
    let cleanedText = generatedText;
    
    // Remove common intro phrases
    cleanedText = cleanedText.replace(/Here are \d+ .* variations.*?:/gi, '');
    cleanedText = cleanedText.replace(/Here are \d+ .* options.*?:/gi, '');
    cleanedText = cleanedText.replace(/Here are \d+ different.*?:/gi, '');
    cleanedText = cleanedText.replace(/Here are \d+ variations.*?:/gi, '');
    cleanedText = cleanedText.replace(/.*designed to be more engaging.*?:/gi, '');
    
    // Split by various separators and clean each variation
    let variations = [];
    
    // Try splitting by "---" first
    if (cleanedText.includes('---')) {
        variations = cleanedText.split('---');
    }
    // Try splitting by **Variation X:** format
    else if (cleanedText.match(/\*\*Variation \d+:\*\*/)) {
        variations = cleanedText.split(/\*\*Variation \d+:\*\*/).filter(v => v.trim().length > 0);
    }
    // Try splitting by numbered lists (1., 2., 3.)
    else if (cleanedText.match(/\d+\.\s/)) {
        variations = cleanedText.split(/\d+\.\s/).filter(v => v.trim().length > 0);
    }
    // Try splitting by bullet points
    else if (cleanedText.includes('•') || cleanedText.includes('*')) {
        variations = cleanedText.split(/[•*]\s/).filter(v => v.trim().length > 0);
    }
    // If no clear separators, treat as single variation
    else {
        variations = [cleanedText];
    }
    
    // Clean up each variation
    variations = variations
        .map(v => v.trim())
        .filter(v => v.length > 10) // Filter out very short/empty variations
        .map(v => {
            // Remove leading numbers, bullets, or dashes
            v = v.replace(/^\d+\.\s*/, '');
            v = v.replace(/^[•*-]\s*/, '');
            v = v.replace(/^\*\*Variation \d+:\*\*\s*/, ''); // Remove **Variation X:** headers
            v = v.trim();
            return v;
        })
        .filter(v => v.length > 0);
    
    return variations.length > 0 ? variations : [baseContent]; // Return array of variations or fallback
}

// Display generated content (from original script)
function displayGeneratedContent(tiktokContent, facebookContent, adTargetingSuggestions, adContent, visualContent, template, videoInstructions) {
    // Show the generated content section
    const generatedContentElement = document.getElementById('generatedContent');
    if (generatedContentElement) {
        generatedContentElement.style.display = 'block';
    }
    
    let hasGeneratedSocialMedia = tiktokContent || facebookContent;
    
    if (hasGeneratedSocialMedia) {
        // Update TikTok content - show all variations
        let tiktokHtml = '';
        
        // Add dynamic video creation instructions if available
        if (videoInstructions) {
            tiktokHtml += `
                <div style="margin-bottom: 30px; background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #007cba;">
                    <h5 style="color: #007cba; margin-bottom: 15px;">📹 Custom Video Creation Guide</h5>
                    <div style="white-space: pre-line; line-height: 1.6; color: #444;">${videoInstructions}</div>
                </div>
            `;
        }
        
        if (Array.isArray(tiktokContent)) {
            tiktokContent.forEach((variation, index) => {
                const cleanVariation = variation.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
                tiktokHtml += `
                    <div style="margin-bottom: 20px;">
                        <h5 style="color: #333; margin-bottom: 10px;">TikTok Option ${index + 1}:</h5>
                        <p style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #ddd; font-family: monospace; white-space: pre-wrap;">${variation}</p>
                        <button class="copy-btn" onclick="copyVariation(\`${cleanVariation}\`)">📋 Copy Option ${index + 1}</button>
                    </div>
                `;
            });
        } else if (tiktokContent) {
            const cleanVariation = tiktokContent.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
            tiktokHtml += `
                <p style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #ddd; font-family: monospace; white-space: pre-wrap;">${tiktokContent}</p>
                <button class="copy-btn" onclick="copyVariation(\`${cleanVariation}\`)">📋 Copy TikTok Text</button>
            `;
        }
        
        const tiktokTextElement = document.getElementById('tiktok-text');
        if (tiktokTextElement) {
            tiktokTextElement.innerHTML = tiktokHtml;
        }
        
        // Update Facebook content - show all variations
        let facebookHtml = '';
        if (Array.isArray(facebookContent)) {
            facebookContent.forEach((variation, index) => {
                const cleanVariation = variation.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
                facebookHtml += `
                    <div style="margin-bottom: 20px;">
                        <h5 style="color: #333; margin-bottom: 10px;">Facebook Option ${index + 1}:</h5>
                        <p style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #ddd; font-family: monospace; white-space: pre-wrap;">${variation}</p>
                        <button class="copy-btn" onclick="copyVariation(\`${cleanVariation}\`)">📋 Copy Option ${index + 1}</button>
                    </div>
                `;
            });
        } else if (facebookContent) {
            const cleanVariation = facebookContent.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
            facebookHtml += `
                <p style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #ddd; font-family: monospace; white-space: pre-wrap;">${facebookContent}</p>
                <button class="copy-btn" onclick="copyVariation(\`${cleanVariation}\`)">📋 Copy Facebook Text</button>
            `;
        }
        
        const facebookTextElement = document.getElementById('facebook-text');
        if (facebookTextElement) {
            facebookTextElement.innerHTML = facebookHtml;
        }
    }
}

// Generate social media content using Gemini API
async function generateContent() {
    
    const apiKey = document.getElementById('geminiApiKey').value;
    const restaurantName = document.getElementById('restaurantName').value;
            const optionsCount = document.getElementById('optionsCount').value;
        const surprisingDetail = document.getElementById('surprisingDetail').value;
        const creativityLevel = document.getElementById('creativityLevel').value;
    const dietType = document.getElementById('dietType').value;
    
    console.log('Form values:', { apiKey: apiKey ? 'PROVIDED' : 'MISSING', restaurantName, optionsCount, surprisingDetail, dietType, selectedDay });
    
    // Check content type selections
    const generateSocialMedia = document.getElementById('generateSocialMedia').checked;
    const generateAds = document.getElementById('generateAds').checked;
    
    // Validation
    if (!apiKey) {
        showError('Please enter your Gemini API key');
        return;
    }
    
    if (!generateSocialMedia && !generateAds) {
        showError('Please select at least one content type to generate');
        return;
    }
    
    if (!restaurantName || !optionsCount) {
        showError('Please fill in restaurant name and number of options');
        return;
    }
    
    if (!selectedDay) {
        showError('Please select a day first');
        return;
    }
    
    // Show loading
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.classList.add('active');
    }
    
    // Alternative: use global loading function if available
    if (window.showMainLoading) {
        window.showMainLoading();
    }
    hideError();
    hideSuccess();
    
    try {
        const template = dayTemplates[selectedDay];
        
        // Check if there's a specific diet variation for this day
        let tiktokTemplate = template.tiktokTemplate;
        let facebookTemplate = template.facebookTemplate;
        
        if (template.dietVariations && template.dietVariations[dietType]) {
            tiktokTemplate = template.dietVariations[dietType].tiktokTemplate;
            facebookTemplate = template.dietVariations[dietType].facebookTemplate;
        }
        
        // Initialize variables
        let tiktokContent = null;
        let facebookContent = null;
        let videoInstructions = null;
        
        // Generate social media content using original method
        if (generateSocialMedia) {
            tiktokContent = await generateWithGemini(apiKey, tiktokTemplate, {
                restaurant: restaurantName,
                count: optionsCount,
                diet: dietType,
                detail: surprisingDetail || `So many options to choose from!`,
                creativityLevel: creativityLevel
            }, 'tiktok');
            
            facebookContent = await generateWithGemini(apiKey, facebookTemplate, {
                restaurant: restaurantName,
                count: optionsCount,
                diet: dietType,
                detail: surprisingDetail || `More options than you'd expect!`,
                creativityLevel: creativityLevel
            }, 'facebook');
            
            // Generate dynamic video instructions based on the actual content
            videoInstructions = await generateVideoInstructions(apiKey, {
                tiktokContent: Array.isArray(tiktokContent) ? tiktokContent[0] : tiktokContent,
                day: selectedDay,
                diet: dietType,
                restaurant: restaurantName,
                optionsCount: optionsCount,
                surprisingDetail: surprisingDetail,
                template: template,
                creativityLevel: creativityLevel
            });
        }
        
                 // Display the results using original format
         if (generateSocialMedia) {
             displayGeneratedContent(tiktokContent, facebookContent, null, null, null, template, videoInstructions);
         }
        
        showSuccess('Content generated successfully!');
        
    } catch (error) {
        console.error('Error generating content:', error);
        showError('Error generating content: ' + error.message);
    } finally {
        // Hide loading
        if (loadingElement) {
            loadingElement.classList.remove('active');
        }
        
        // Alternative: use global loading function if available
        if (window.hideMainLoading) {
            window.hideMainLoading();
        }
    }
}

// Generate social media content
async function generateSocialMediaContent(apiKey, restaurantName, optionsCount, surprisingDetail, dietType) {
    const dayTemplate = dayTemplates[selectedDay];
    if (!dayTemplate) return '';
    
    const prompt = `Create engaging social media content for ${dayTemplate.name}.

Restaurant: ${restaurantName}
Number of ${dietType} options: ${optionsCount}
Surprising detail: ${surprisingDetail}

Generate content for:
1. TikTok (short, engaging, trending)
2. Facebook (longer, community-focused)
3. Instagram (visual, hashtag-optimized)

Use these hashtags: ${dayTemplate.hashtags.join(', ')}
Tone: Excited, helpful, community-building
Include emojis and calls-to-action.

Format as:
**TikTok:**
[content]

**Facebook:**
[content]

**Instagram:**
[content]`;

    if (window.Utils) {
        return await window.Utils.callGeminiAPI(prompt, apiKey);
    } else {
        // Fallback API call
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }
}

// Generate ad content
async function generateAdContent(apiKey, restaurantName, optionsCount, surprisingDetail, dietType, strategy = null) {
    // Use default strategy if none provided
    if (!strategy) {
        strategy = {
            name: "Pain Point Targeting",
            description: "Address common frustrations and highlight solutions",
            headlines: ["Finally!", "No More Searching", "Perfect Match"],
            descriptions: ["Find your diet options instantly", "Discover restaurants that fit your lifestyle", "Never wonder about menu options again"]
        };
    }
    
    const prompt = `Create 3 highly targeted ad variations for a ${dietType} restaurant discovery app called PerfectPlate.

STRATEGY: ${strategy.name}
DESCRIPTION: ${strategy.description}

AUDIENCE INSIGHTS FOR ${dietType.toUpperCase()} DIETERS:
${getAudienceInsights(dietType)}

CONTEXT: User discovered ${optionsCount} ${dietType} options at ${restaurantName}${surprisingDetail ? `. Surprising detail: ${surprisingDetail}` : ''}

TARGETING REQUIREMENTS:
- Address specific pain points of ${dietType} dieters
- Use language that resonates with their lifestyle and values
- Include emotional triggers relevant to their dietary journey
- Reference common frustrations they face when dining out
- Highlight the relief/excitement of finding options

AD SPECIFICATIONS:
- Create 3 complete ad variations 
- Each should have: Headline + Description + Call-to-action
- Keep headlines under 40 characters for mobile optimization
- Keep descriptions under 125 characters for Facebook/Instagram
- Make them feel authentic and relatable to ${dietType} community
- Focus on the core benefit: effortless ${dietType} dining discovery
- Use action-oriented language that drives app downloads
- Separate each variation with "---"

INSPIRATION HEADLINES: ${strategy.headlines.join(', ')}
INSPIRATION DESCRIPTIONS: ${strategy.descriptions.join(' | ')}`;

    if (window.Utils) {
        return await window.Utils.callGeminiAPI(prompt, apiKey);
    } else {
        // Fallback API call
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }
}

// Generate TikTok Video Instructions (missing from original modularization)
async function generateVideoInstructions(apiKey, data) {
    const prompt = `Create a 15-second TikTok app demo video script for the PerfectPlate restaurant finder app. 

TikTok Post Content: "${data.tiktokContent}"
Restaurant: ${data.restaurant}
Diet Type: ${data.diet}
Options Found: ${data.optionsCount}
Day Theme: ${data.template.name}
Surprising Detail: ${data.surprisingDetail}
CREATIVITY LEVEL: ${creativityLevel.toUpperCase()}

${hookExamples}

=== CRITICAL: PERFECTPLATE APP FUNCTIONALITY CONTEXT ===

**HOW THE APP ACTUALLY WORKS:**

1. **USER SETUP PROCESS:**
   - Users first set their dietary preferences (vegan, keto, paleo, gluten-free, etc.) in their profile
   - Users set their location/ZIP code
   - Users can set macro goals (protein, carbs, fat targets)
   - Users can rate individual ingredients 0-100 (loves/hates specific foods)

2. **RESTAURANT DISCOVERY FLOW:**
   - Home screen shows personalized meal recommendations for nearby restaurants
   - Users can search by location or browse local restaurants
   - Each restaurant card shows diet counts (e.g., "12 Keto Options") BEFORE entering
   - Restaurant cards show star ratings, distance, and quick diet compatibility

3. **RESTAURANT MENU EXPERIENCE:**
   - When users open a restaurant, there is NO "filter by diet" button
   - The menu is AUTOMATICALLY sorted with "Recommended for You" section at the top
   - Recommended section shows items that match their dietary preferences and ingredient ratings
   - Each menu item shows:
     * Match score percentage (e.g., "87% Match")
     * Complete macro breakdown (calories, protein, carbs, fat)
     * Dietary tags (Keto, Vegan, Gluten-Free, etc.)
     * Ingredient ratings visualization
   - Items are color-coded: green (great match), yellow (okay), red (avoid)

4. **KEY FEATURES TO HIGHLIGHT:**
   - **Smart Personalization:** Menu items ranked by personal preferences, not just diet
   - **Macro Tracking:** Real nutritional data for meal planning
   - **Ingredient Intelligence:** Shows why items match based on loved/hated ingredients
   - **Diet Confidence:** Clear visual indicators for dietary compliance
   - **Meal Planning:** Can save meals and track daily nutrition goals

5. **REAL APP SCREENS AVAILABLE:**
   - Home screen with personalized meal cards
   - Restaurant search/browse screen with diet counts
   - Individual restaurant page with "Recommended for You" section
   - Menu item detail page with macro breakdown and match score
   - User profile with dietary preferences and ingredient ratings
   - Meal planning/saved meals screen

**IMPORTANT: DO NOT INCLUDE:**
- "Filter by Diet" buttons (they don't exist)
- Generic menu browsing (it's always personalized)
- Bold "X OPTIONS FOUND!" popups (results are integrated naturally)
- Standard restaurant menus (all menus are personalized from the start)

**CORRECT USER FLOW TO SHOW:**
1. Opening app → Personalized recommendations appear
2. Searching for specific restaurant → Seeing diet counts on restaurant card
3. Opening restaurant → "Recommended for You" section already showing personalized options
4. Viewing specific menu item → Match score and macro breakdown displayed
5. Understanding why it's recommended → Ingredient ratings explanation

Create a step-by-step video script that showcases these REAL PerfectPlate features. Format it exactly like this:

🎬 APP DEMO VIDEO (15 seconds):
0-2s: [Hook text or opening visual]
2-4s: [Specific app screen to show]
4-7s: [User action/interaction to demonstrate]
7-10s: [Key feature or result to highlight]
10-13s: [Final app benefit or detail to show]
13-15s: [Clear call-to-action]

📱 SCREENS TO RECORD: [List the specific app screens needed]
🎵 MUSIC: [Appropriate music style for this content]
💡 FOCUS: [Key app benefit to emphasize]

Make sure the video script:
- Shows ACTUAL PerfectPlate app functionality (no fake features)
- Demonstrates the personalized menu experience (not filtering)
- Highlights the specific diet/restaurant context provided
- Creates emotional resonance with ${data.diet} dieters
- Maintains authenticity while being engaging
- Includes a compelling hook that addresses ${data.diet} pain points
- Showcases the value of finding ${data.optionsCount} options at ${data.restaurant}${data.surprisingDetail ? ` (especially the surprising detail: ${data.surprisingDetail})` : ''}`;

    if (window.Utils) {
        return await window.Utils.callGeminiAPI(prompt, apiKey);
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
                        text: prompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`Video instructions API error: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }
}

// Removed duplicate displayGeneratedContent function - using the comprehensive one above

// Select a day and show content generator
function selectDay(day) {

    selectedDay = day;
    
    // Update UI
    document.querySelectorAll('.day-card').forEach(card => {
        card.classList.remove('selected');
    });
    const dayCard = document.querySelector(`[data-day="${day}"]`);
    
    if (dayCard) {
        dayCard.classList.add('selected');
    }
    
    // Auto-select the corresponding diet for diet-specific days
    const template = dayTemplates[day];
    if (template && template.focus) {
        const dietDropdown = document.getElementById('dietType');
        if (dietDropdown) {
            dietDropdown.value = template.focus;
        }
    }
    
    // Show content generator
    const contentGenerator = document.getElementById('contentGenerator');
    if (contentGenerator) {
        contentGenerator.classList.add('active');
        contentGenerator.style.display = 'block';
    }
    
    // Update restaurant suggestions
    updateRestaurantSuggestions(day);
    
    // Update instructions
    updateInstructions();
    
    // Scroll to content generator
    if (contentGenerator) {
        contentGenerator.scrollIntoView({ behavior: 'smooth' });
    }
    
    
}

// Update restaurant suggestions based on selected day
function updateRestaurantSuggestions(day) {
    const template = dayTemplates[day];
    const suggestionsContainer = document.getElementById('restaurantSuggestions');
    
    if (!template || !suggestionsContainer) return;
    
    suggestionsContainer.innerHTML = '';
    
    if (template.restaurants) {
        template.restaurants.forEach(restaurant => {
            const restaurantItem = document.createElement('div');
            restaurantItem.className = 'restaurant-item';
            restaurantItem.textContent = restaurant;
            restaurantItem.style.cssText = `
                padding: 10px; 
                margin: 5px; 
                background: #f8f9fa; 
                border: 1px solid #ddd; 
                border-radius: 5px; 
                cursor: pointer;
                display: inline-block;
            `;
            restaurantItem.onclick = () => selectRestaurant(restaurant);
            suggestionsContainer.appendChild(restaurantItem);
        });
    }
}

// Select a restaurant suggestion
function selectRestaurant(restaurant) {
    const restaurantNameInput = document.getElementById('restaurantName');
    if (restaurantNameInput) {
        restaurantNameInput.value = restaurant;
        updateInstructions();
    }
}

// Select a ZIP code
function selectZip(zip) {
    const zipCodeInput = document.getElementById('zipCode');
    if (zipCodeInput) {
        zipCodeInput.value = zip;
        updateInstructions();
    }
}

// Update app instructions based on current selections
function updateInstructions() {
    const dietType = document.getElementById('dietType')?.value || 'your diet';
    const zipCode = document.getElementById('zipCode')?.value || '[Enter ZIP code]';
    const instructionsContainer = document.getElementById('appInstructions');
    
    if (!instructionsContainer) return;
    
    const instructions = [
        `Open the PerfectPlate app on your phone`,
        `Enter ZIP code: ${zipCode} in the location search`,
        `Tap the "${dietType}" filter to enable it`,
        `Browse the restaurant list and look for interesting options`,
        `Tap on a restaurant to see all ${dietType} options available`,
        `Take a screenshot of the filtered results showing the number of options`,
        `Note any surprising or interesting details about the options`,
        `Return to this website and fill in the details below`
    ];
    
    instructionsContainer.innerHTML = '';
    instructions.forEach(instruction => {
        const li = document.createElement('li');
        li.textContent = instruction;
        instructionsContainer.appendChild(li);
    });
}

// Set up event listeners for social media tab
function setupSocialMediaEventListeners() {
    // Day card selection
    document.querySelectorAll('.day-card').forEach(card => {
        card.addEventListener('click', function() {
            selectDay(this.dataset.day);
        });
    });

    // Auto-update instructions when inputs change
    const dietTypeSelect = document.getElementById('dietType');
    const zipCodeInput = document.getElementById('zipCode');
    
    if (dietTypeSelect) {
        dietTypeSelect.addEventListener('change', updateInstructions);
    }
    if (zipCodeInput) {
        zipCodeInput.addEventListener('input', updateInstructions);
    }
}

// Show/hide platform content
function showPlatform(platform) {
    // Update tabs
    document.querySelectorAll('.platform-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[onclick="showPlatform('${platform}')"]`).classList.add('active');
    
    // Update content
    document.querySelectorAll('.platform-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${platform}-content`).classList.add('active');
}

// Export all functions
window.SocialMedia = {
    selectDay,
    selectRestaurant,
    selectZip,
    generateContent,
    showPlatform,
    getSelectedDay: () => selectedDay,
    getDayTemplates: () => dayTemplates,
    getRestaurantData: () => restaurantData,
    copyToClipboard,
    generateAdContent,
    generateVideoInstructions,
    generateVisualContent,
    generatePerformanceAnalysis,
    generateOptimizedAdCopy,
    generateAdCopyVisualization,
    generateAdvertisingImageConcept,
    generateVideoStoryboard,
    generateCleanAdvertisingImage,
    generateAdvertisingPrompts,
    generatePhoneFocusedImage,
    generateControlNetReference,
    generateSDXLTextToImage,
    resetAllStuckButtons,
    fileToBase64,
    setupSocialMediaEventListeners,
    handleGenerateContent,
    displayGeneratedContent,
    copyVariation,
    initializeDayTemplates,
    initializeRestaurantData,
    updateInstructions,
    updateRestaurantSuggestions,
    getAudienceInsights
};

// Get audience insights for targeted copy (missing from original modularization)
function getAudienceInsights(diet) {
    const insights = {
        'vegan': `
- PAIN POINTS: Constantly explaining dietary choices, limited restaurant options, fear of hidden animal products
- MOTIVATIONS: Animal welfare, environmental impact, health benefits, ethical living
- EMOTIONAL TRIGGERS: Compassion, sustainability, health transformation, community belonging
- COMMON FRUSTRATIONS: "Is this really vegan?", calling restaurants to ask about ingredients, settling for salads
- LANGUAGE STYLE: Conscious, compassionate, health-focused, environmentally aware
- VALUES: Cruelty-free living, planet-conscious choices, whole food nutrition`,
        
        'vegetarian': `
- PAIN POINTS: Limited protein options, hidden meat ingredients, family/social pressure
- MOTIVATIONS: Health improvement, animal welfare, environmental consciousness, weight management
- EMOTIONAL TRIGGERS: Health transformation, ethical satisfaction, family-friendly dining
- COMMON FRUSTRATIONS: "Does this have meat broth?", finding satisfying protein options, dining with non-vegetarians
- LANGUAGE STYLE: Health-conscious, family-oriented, balanced lifestyle focused
- VALUES: Balanced nutrition, ethical eating, family wellness, sustainable choices`,
        
        'keto': `
- PAIN POINTS: Hidden carbs, calculating macros, social dining challenges, meal prep time
- MOTIVATIONS: Weight loss, mental clarity, energy levels, metabolic health, fitness goals
- EMOTIONAL TRIGGERS: Transformation success, energy boost, confidence, control over health
- COMMON FRUSTRATIONS: "How many carbs is this?", finding high-fat options, avoiding sugar traps
- LANGUAGE STYLE: Results-focused, fitness-oriented, transformation-driven, science-backed
- VALUES: Metabolic health, body transformation, energy optimization, fitness performance`,
        
        'gluten-free': `
- PAIN POINTS: Cross-contamination fears, hidden gluten, limited options, higher costs
- MOTIVATIONS: Celiac management, digestive health, inflammation reduction, feeling better
- EMOTIONAL TRIGGERS: Safety, health relief, digestive comfort, symptom-free living
- COMMON FRUSTRATIONS: "Is this really gluten-free?", cross-contamination concerns, expensive options
- LANGUAGE STYLE: Health-focused, safety-conscious, relief-oriented, medical necessity
- VALUES: Safe dining, digestive wellness, symptom management, quality of life`,
        
        'paleo': `
- PAIN POINTS: Processed food avoidance, finding whole foods, meal complexity, social dining
- MOTIVATIONS: Ancestral health, inflammation reduction, energy levels, natural eating
- EMOTIONAL TRIGGERS: Natural living, energy boost, strength, primal health
- COMMON FRUSTRATIONS: "Is this processed?", finding clean options, avoiding additives
- LANGUAGE STYLE: Natural, ancestral, strength-focused, clean eating oriented
- VALUES: Whole foods, natural nutrition, ancestral wisdom, clean eating`,
        
        'dairy-free': `
- PAIN POINTS: Hidden dairy, lactose reactions, limited dessert options, social challenges
- MOTIVATIONS: Digestive comfort, allergy management, skin health, feeling better
- EMOTIONAL TRIGGERS: Comfort, digestive relief, skin improvement, symptom-free living
- COMMON FRUSTRATIONS: "Does this have milk?", finding dairy-free alternatives, reaction fears
- LANGUAGE STYLE: Comfort-focused, health-relief oriented, allergy-conscious
- VALUES: Digestive wellness, allergy safety, comfort food alternatives, health relief`,
        
        'low-carb': `
- PAIN POINTS: Carb counting, portion control, social eating, weight plateaus
- MOTIVATIONS: Weight management, blood sugar control, energy stability, health goals
- EMOTIONAL TRIGGERS: Weight loss success, energy stability, health control, confidence
- COMMON FRUSTRATIONS: "How many carbs?", finding satisfying low-carb options, weight stalls
- LANGUAGE STYLE: Goal-oriented, health-focused, weight management, results-driven
- VALUES: Health control, weight management, energy stability, metabolic health`
    };
    
    return insights[diet] || insights['vegetarian'];
}

// Copy functions for targeting data (missing from original modularization)
function copyTargetingStrategy() {
    // Get all the targeting data and format it for copying
    const container = document.getElementById('ad-targeting-suggestions');
    if (!container) {
        showError('Targeting suggestions not found');
        return;
    }
    
    const text = container.innerText;
    
    navigator.clipboard.writeText(text).then(function() {
        showSuccess('Complete targeting strategy copied to clipboard!');
    }, function(err) {
        showError('Failed to copy targeting strategy');
    });
}

function copyPrimaryAudience() {
    // Get just the primary recommendation data
    const primarySection = document.querySelector('#ad-targeting-suggestions .targeting-category');
    if (primarySection) {
        const text = primarySection.innerText;
        navigator.clipboard.writeText(text).then(function() {
            showSuccess('Primary audience recommendation copied to clipboard!');
        }, function(err) {
            showError('Failed to copy primary audience');
        });
    } else {
        showError('Primary audience section not found');
    }
}

// Manual button reset function for debugging (missing from original modularization)
function resetAllStuckButtons() {
    
    const imageButtons = document.querySelectorAll('[onclick*="generateImageWithScreenshot"]');
    const videoButtons = document.querySelectorAll('[onclick*="generateVideoWithScreenshots"]');
    
    let resetCount = 0;
    
    imageButtons.forEach(btn => {
        if (btn.innerHTML.includes('Generating') || btn.innerHTML.includes('Generated!') || btn.disabled) {

            btn.innerHTML = '🎨 Generate Image';
            btn.disabled = false;
            resetCount++;
        }
    });
    
    videoButtons.forEach(btn => {
        if (btn.innerHTML.includes('Generating') || btn.innerHTML.includes('Generated!') || btn.disabled) {

            btn.innerHTML = '🎬 Generate Video Concept';
            btn.disabled = false;
            resetCount++;
        }
    });
    

    showSuccess(`Reset ${resetCount} stuck buttons`);
}

// Convert file to base64 (missing from original modularization)
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
    });
}

// Make advanced functions globally accessible
window.getAudienceInsights = getAudienceInsights;
window.copyTargetingStrategy = copyTargetingStrategy;
window.copyPrimaryAudience = copyPrimaryAudience;
window.resetAllStuckButtons = resetAllStuckButtons;
window.fileToBase64 = fileToBase64; 

// Generate Visual Content Ideas (missing from original modularization)
async function generateVisualContent(apiKey, restaurant, optionsCount, surprisingDetail, diet, strategy) {
    const visualPrompt = `Generate creative visual content ideas for a ${diet} restaurant discovery app ad campaign.

STRATEGY: ${strategy.name}
CONTEXT: ${restaurant} has ${optionsCount} ${diet} options${surprisingDetail ? `. Special detail: ${surprisingDetail}` : ''}

AUDIENCE INSIGHTS:
${getAudienceInsights(diet)}

REQUIREMENTS:
- Create 4 unique IMAGE concepts that would resonate with ${diet} dieters
- Create 3 unique VIDEO concepts that tell compelling stories
- Make concepts specific to this exact scenario (${restaurant} + ${optionsCount} options)
- Address the emotional triggers and pain points of ${diet} dieters
- Include specific visual elements, colors, and compositions
- Make concepts actionable for content creators

FORMAT:
IMAGE CONCEPTS:
1. [Concept Name]: [Detailed description including composition, colors, elements, and emotional appeal]
2. [Concept Name]: [Detailed description]
3. [Concept Name]: [Detailed description]
4. [Concept Name]: [Detailed description]

VIDEO CONCEPTS:
1. [Concept Name]: [Detailed description including story arc, scenes, and emotional journey]
2. [Concept Name]: [Detailed description]
3. [Concept Name]: [Detailed description]`;

    if (window.Utils) {
        return await window.Utils.callGeminiAPI(visualPrompt, apiKey);
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
                        text: visualPrompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`Visual content API error: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }
} 

// Generate Facebook Ads Performance Analysis (missing from original modularization)
async function generatePerformanceAnalysis(apiKey, data) {
    const analysisPrompt = `
You are an expert Facebook/Meta ads performance analyst with deep knowledge of industry benchmarks and optimization strategies. Analyze this campaign data and provide actionable recommendations.

CAMPAIGN PERFORMANCE DATA:
- Current CPC: $${data.cpc}
- Current CTR: ${data.ctr}%
- Daily Budget: $${data.budget}
- Campaign Objective: ${data.objective}
- Target Audience: ${data.audience}
- Creative Type: ${data.creativeType}
- Geographic Targeting: ${data.geoTargeting}
- Campaign Duration: ${data.duration}
- Current Ad Content: ${data.currentContent}
- Main Challenge: ${data.mainChallenge}

INDUSTRY BENCHMARKS FOR FOOD/RESTAURANT APPS:
- Average CPC: $0.42-0.75
- Average CTR: 1.5-2.8%
- App Install CPC: $0.86
- Restaurant Industry CPC: $0.75

ANALYSIS REQUIREMENTS:
1. PERFORMANCE DIAGNOSIS: Compare current metrics to industry benchmarks
2. ROOT CAUSE ANALYSIS: Identify likely reasons for performance issues
3. OPTIMIZATION RECOMMENDATIONS: Provide 5-7 specific, actionable improvements
4. AUDIENCE SUGGESTIONS: Recommend better targeting strategies
5. CREATIVE IMPROVEMENTS: Suggest content/copy optimizations
6. BUDGET OPTIMIZATION: Recommend budget allocation strategies
7. OPTIMIZED AD COPY: Generate 3 improved versions of their current ad content

Format your response as structured sections with clear headings and bullet points. Be specific and actionable, not generic advice.
`;

    console.log('🤖 Sending analysis request to Gemini...');
    
    if (window.Utils) {
        return await window.Utils.callGeminiAPI(analysisPrompt, apiKey);
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
                        text: analysisPrompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 2048,
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Performance analysis API error: ${response.status}`);
        }

        const result = await response.json();
        return result.candidates[0].content.parts[0].text;
    }
}

// Generate Optimized Ad Copy (missing from original modularization)
async function generateOptimizedAdCopy(apiKey, challenge, currentContent, audience) {
    const optimizationPrompt = `
You are a top-performing Facebook ads copywriter specializing in food/restaurant app marketing. 

CURRENT CHALLENGE: ${challenge}
CURRENT AD CONTENT: ${currentContent}
TARGET AUDIENCE: ${audience}

Generate 3 optimized ad variations that specifically address the challenge of "${challenge}". Each variation should:

1. Have a compelling headline (5-8 words)
2. Engaging description (1-2 sentences)
3. Strong call-to-action
4. Be tailored to the target audience
5. Address the specific challenge

Format each variation clearly with HEADLINE, DESCRIPTION, and CTA sections.
Make them significantly different from each other while maintaining the core message.
Focus on emotional triggers and clear value propositions.
`;

    if (window.Utils) {
        return await window.Utils.callGeminiAPI(optimizationPrompt, apiKey);
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
                        text: optimizationPrompt
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
            throw new Error(`Ad optimization API error: ${response.status}`);
        }

        const result = await response.json();
        return result.candidates[0].content.parts[0].text;
    }
} 

// Generate Advanced Ad Copy Visualization (missing from original modularization)
async function generateAdCopyVisualization(apiKey, adCopy, strategyName, restaurant, optionsCount, diet, surprisingDetail, day) {
    const visualPrompt = `Generate highly creative and specific visual content ideas for this exact ad copy:

AD COPY TO VISUALIZE:
"${adCopy}"

STRATEGY: ${strategyName}
CONTEXT: ${restaurant} has ${optionsCount} ${diet} options${surprisingDetail ? `. Special detail: ${surprisingDetail}` : ''}

AUDIENCE INSIGHTS FOR ${diet.toUpperCase()} DIETERS:
${getAudienceInsights(diet)}

REQUIREMENTS:
- Create 5 unique IMAGE concepts that perfectly match this specific ad copy
- Create 4 unique VIDEO concepts that bring this ad copy to life
- Focus on authentic scenes, real people, and emotional storytelling
- Make concepts hyper-specific to the exact wording and tone of the ad copy
- Address the emotional triggers and pain points of ${diet} dieters
- Include specific visual elements, colors, compositions, and props
- Provide actionable details for content creators
- Consider the ${day} theme and ${diet} dietary focus
- IMPORTANT: Include smartphones naturally in most scenes (on tables, in hands, in pockets) but ensure they are either POWERED OFF (black screen) or FACING AWAY from the camera to avoid fake app interfaces

PERFECTPLATE APP SCREENS TO REFERENCE:
- Home Screen: Shows daily meal recommendations with restaurant cards
- Restaurant Menu Screen: Shows all menu items with diet tags and nutritional info
- Meal Details Screen: Shows specific meal with full nutrition breakdown
- Diet Filter Screen: Shows dietary preferences selection
- Search Results Screen: Shows restaurants filtered by diet type
- Profile/Settings Screen: Shows user's dietary preferences and goals

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

IMAGE CONCEPTS:
1. [Concept Name]: [Detailed description including composition, colors, elements, emotional appeal, and how it connects to the ad copy. Focus on authentic scenes with real people. Include phones naturally but ensure they are powered off or facing away]
   📱 SCREENSHOT NEEDED: [Specific app screen to capture for post-processing overlay, e.g., "Home Screen showing vegan meal recommendations" or "Restaurant Menu Screen with diet tags highlighted"]

2. [Concept Name]: [Detailed description focusing on authentic scenes with phones naturally present but powered off or facing away]
   📱 SCREENSHOT NEEDED: [Specific app screen to capture for overlay]

3. [Concept Name]: [Detailed description focusing on authentic scenes with phones naturally present but powered off or facing away]
   📱 SCREENSHOT NEEDED: [Specific app screen to capture for overlay]

4. [Concept Name]: [Detailed description focusing on authentic scenes with phones naturally present but powered off or facing away]
   📱 SCREENSHOT NEEDED: [Specific app screen to capture for overlay]

5. [Concept Name]: [Detailed description focusing on authentic scenes with phones naturally present but powered off or facing away]
   📱 SCREENSHOT NEEDED: [Specific app screen to capture for overlay]

VIDEO CONCEPTS:
1. [Concept Name]: [Detailed description including story arc, scenes, emotional journey, and how it brings the ad copy to life. Focus on authentic storytelling with phones naturally present but powered off or facing away]
   📱 SCREENSHOTS NEEDED: [List of app screens to capture for post-processing overlay, e.g., "Home Screen, Restaurant Menu Screen, Meal Details Screen"]

2. [Concept Name]: [Detailed description including story arc and emotional journey]
   📱 SCREENSHOTS NEEDED: [List of app screens needed for overlay]

3. [Concept Name]: [Detailed description including story arc and emotional journey]
   📱 SCREENSHOTS NEEDED: [List of app screens needed for overlay]

4. [Concept Name]: [Detailed description including story arc and emotional journey]
   📱 SCREENSHOTS NEEDED: [List of app screens needed for overlay]

Make each concept highly specific to the exact ad copy provided, with clear instructions for content creators.`;

    if (window.Utils) {
        return await window.Utils.callGeminiAPI(visualPrompt, apiKey);
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
                        text: visualPrompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`Ad copy visualization API error: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }
} 

// Generate Professional Advertising Image Concepts (missing from original modularization)
async function generateAdvertisingImageConcept(apiKey, title, description, screenshotNeeded, base64Image) {
    const prompt = `Create a realistic, professional advertising image concept based on this PerfectPlate app screenshot:

CONCEPT TITLE: ${title}
CONCEPT DESCRIPTION: ${description}
SCREENSHOT CONTEXT: ${screenshotNeeded}

CRITICAL REQUIREMENTS FOR REALISTIC ADVERTISING:
- Create a PHOTOREALISTIC scene with real people, not abstract art
- Focus on authentic human emotions and realistic scenarios
- Use the actual app screenshot as the phone's display content
- Show genuine user interactions with the app
- Create believable before/after scenarios or real-life usage moments
- Avoid overly stylized, abstract, or artistic interpretations
- Think like a professional advertising photographer, not a graphic designer

REALISTIC ADVERTISING ELEMENTS:
- Real person holding/using a smartphone showing the app
- Natural lighting and authentic environments (kitchen, restaurant, etc.)
- Genuine facial expressions showing problem-solving or satisfaction
- Realistic phone positioning and screen visibility
- Clean, professional photography style like Apple or Google ads
- Authentic clothing, backgrounds, and props
- Natural color grading, not oversaturated or cartoon-like

FORMAT YOUR RESPONSE AS:
🎨 ENHANCED IMAGE CONCEPT: [Photorealistic advertising scenario with real people and authentic situations]
📐 COMPOSITION: [Professional photography composition with natural lighting and realistic positioning]
🎯 SCREENSHOT USAGE: [How the actual app screenshot appears on the phone screen in the scene]
🎨 DESIGN ELEMENTS: [Realistic lighting, natural colors, authentic styling]
📱 TEXT OVERLAYS: [Minimal, clean text that doesn't interfere with the photorealistic scene]
🔥 CALL-TO-ACTION: [Subtle, professional CTA placement that feels natural]`;

    if (window.Utils) {
        // Enhanced API call with image support
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        { 
                            inline_data: {
                                mime_type: "image/jpeg",
                                data: base64Image
                            }
                        }
                    ]
                }]
            })
        });
        
        if (!response.ok) {
            throw new Error(`Advertising image concept API error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } else {
        // Fallback without image support
        return await window.Utils.callGeminiAPI(prompt, apiKey);
    }
}

// Generate Video Storyboard Concepts (missing from original modularization)
async function generateVideoStoryboard(apiKey, title, description, screenshotsNeeded, base64Images) {
    const prompt = `Based on these PerfectPlate app screenshots, create a detailed video concept for advertising:

CONCEPT TITLE: ${title}
CONCEPT DESCRIPTION: ${description}
SCREENSHOTS CONTEXT: ${screenshotsNeeded}

REQUIREMENTS:
- Analyze the uploaded screenshots to understand the app's flow and UI
- Create a specific, actionable video concept that incorporates the screenshots
- Provide a detailed storyboard with timing and transitions
- Specify how each screenshot should be used in the video
- Include animation suggestions, text overlays, and voiceover notes
- Make it ready for a video editor to execute

FORMAT YOUR RESPONSE AS:
🎬 ENHANCED VIDEO CONCEPT: [Detailed concept with specific instructions]
📝 STORYBOARD: [Scene-by-scene breakdown with timing]
📱 SCREENSHOT USAGE: [How to use each uploaded screenshot]
🎨 VISUAL EFFECTS: [Animations, transitions, effects]
🎵 AUDIO NOTES: [Music, voiceover, sound effects]
🔥 CALL-TO-ACTION: [CTA timing and design]`;

    const parts = [{ text: prompt }];
    
    // Add all screenshots to the request
    if (base64Images && base64Images.length > 0) {
        base64Images.forEach(base64Image => {
            parts.push({
                inline_data: {
                    mime_type: "image/jpeg",
                    data: base64Image
                }
            });
        });
    }

    if (window.Utils) {
        // Enhanced API call with multiple images support
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: parts
                }]
            })
        });
        
        if (!response.ok) {
            throw new Error(`Video storyboard API error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } else {
        // Fallback without image support
        return await window.Utils.callGeminiAPI(prompt, apiKey);
    }
} 

// Generate Clean Advertising Images with FLUX Schnell (missing from original modularization)
async function generateCleanAdvertisingImage(apiKey, prompt, negativePrompt) {
    // Enhanced prompt for better food photography (matching app style)
    const enhancedPrompt = `${prompt}, professional food photography, natural lighting, top-down view, crisp details, vibrant, 4k, detailed texture, photorealistic`;
    
    const requestBody = {
        version: "131d9e185621b4b4d349fd262e363420a6f74081d8c27966c9c5bcf120fa3985", // FLUX Schnell
        input: {
            prompt: enhancedPrompt,
            negative_prompt: negativePrompt || "(((text))), (((words))), (((writing))), (((letters))), (((captions))), (((labels))), (((watermarks))), (((signatures))), (((logos))), (((fonts))), (((characters))), (((typography))), (((alphabet))), low quality, blurry, dark, amateur photography, cartoon, illustration, anime, manga, fake, artificial, synthetic",
            num_outputs: 1,
            seed: Math.floor(Math.random() * 1000000), // Random seed for variety
            guidance_scale: 9, // Stronger adherence to prompt
            negative_guidance_scale: 12, // Strong negative guidance to avoid text
            go_fast: false, // Don't optimize for speed to get better results
            aspect_ratio: "1:1", // Square aspect ratio for consistency
            format: "jpeg", // JPEG format for better compatibility
            quality: 95 // Higher quality
        }
    };
    
    console.log('⚙️ FLUX Schnell generation parameters:', JSON.stringify(requestBody, null, 2));
    console.log('✨ Enhanced prompt for food photography:', enhancedPrompt);
    console.log('🚫 Enhanced negative prompt:', requestBody.input.negative_prompt);
    
    // Call Replicate API directly
    const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
            'Authorization': `Token ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ FLUX Schnell API Error Response:', errorText);
        throw new Error(`FLUX Schnell API error: ${response.status}`);
    }
    
    const prediction = await response.json();
    console.log('📤 FLUX Schnell prediction started:', prediction.id);
    
    // Poll for completion using the existing pollReplicatePrediction function
    if (window.Utils && window.Utils.pollReplicatePrediction) {
        return await window.Utils.pollReplicatePrediction(prediction.id, apiKey);
    } else {
        // Fallback polling if utils not available
        return await pollReplicatePrediction(prediction.id, apiKey);
    }
}

// Generate Phone-Focused Images (missing from original modularization)
async function generatePhoneFocusedImage(apiKey, prompt) {
    // Create a phone-focused prompt that prioritizes phone visibility
    const phoneFocusedPrompt = `${prompt}. IMPORTANT: Include a prominent smartphone with a bright, clear screen displaying a food delivery app interface. The phone should be clearly visible in the foreground or prominently featured. The phone screen shows restaurant listings with vegan diet tags. Professional product photography with the phone as a key element.`;
    
    const requestBody = {
        version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
        input: {
            prompt: phoneFocusedPrompt,
            width: 1024,
            height: 1024,
            num_outputs: 1,
            scheduler: "K_EULER",
            num_inference_steps: 50,
            guidance_scale: 10, // Higher guidance for better prompt adherence
            prompt_strength: 0.8,
            refine: "expert_ensemble_refiner",
            high_noise_frac: 0.8,
            negative_prompt: "no phone, missing phone, dark phone screen, black screen, blank screen, broken phone, cracked screen, dim lighting, dark image, low quality, blurry, amateur photography"
        }
    };
    
    console.log('⚙️ Phone-focused generation parameters:', JSON.stringify(requestBody, null, 2));
    
    // Call Replicate API directly
    const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
            'Authorization': `Token ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Phone-focused API Error Response:', errorText);
        throw new Error(`Phone-focused API error: ${response.status}`);
    }
    
    const prediction = await response.json();
    console.log('📤 Phone-focused prediction started:', prediction.id);
    
    // Poll for completion
    if (window.Utils && window.Utils.pollReplicatePrediction) {
        return await window.Utils.pollReplicatePrediction(prediction.id, apiKey);
    } else {
        return await pollReplicatePrediction(prediction.id, apiKey);
    }
}

// Generate ControlNet Reference Compositing (missing from original modularization)
async function generateControlNetReference(apiKey, prompt, base64Image) {
    // Remove data URL prefix if present
    const cleanBase64 = base64Image.replace(/^data:image\/[a-z]+;base64,/, '');
    
    // Create a compositing-focused prompt that treats the screenshot as a phone screen
    const compositingPrompt = `${prompt}. The smartphone in the scene displays the exact interface from the reference image. Professional advertising photography, realistic hands holding phone, bright clear phone screen, high quality, photorealistic.`;
    
    const requestBody = {
        version: "435061a1b5a4c1e26740464bf786efdfa9cb3a3ac488595a2de23e143fdb0117",
        input: {
            prompt: compositingPrompt,
            image: `data:image/jpeg;base64,${cleanBase64}`, // Ensure proper data URL format
            control_guidance_start: 0.0, // Start using reference from beginning
            control_guidance_end: 0.6, // Stop using reference midway through generation
            controlnet_conditioning_scale: 0.8, // Higher influence for better screenshot integration
            guidance_scale: 7.5, // Balanced guidance for scene + screenshot
            num_inference_steps: 30,
            scheduler: "DPMSolverMultistep",
            negative_prompt: "generic phone interface, fake app, wrong app, SearchPlate, different app, blurry phone screen, dark phone screen, illegible text, poor lighting, amateur photography, low quality, blurry, duplicate phone"
        }
    };
    
    console.log('⚙️ ControlNet Reference Only parameters:', JSON.stringify({
        version: requestBody.version,
        input: {
            ...requestBody.input,
            image: `data:image/jpeg;base64,${cleanBase64.substring(0, 50)}...` // Only show first 50 chars of base64
        }
    }, null, 2));
    
    // Call Replicate API directly
    const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
            'Authorization': `Token ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ ControlNet Reference API Error Response:', errorText);
        throw new Error(`ControlNet Reference API error: ${response.status}`);
    }
    
    const prediction = await response.json();
    console.log('📤 ControlNet Reference prediction started:', prediction.id);
    
    // Poll for completion
    if (window.Utils && window.Utils.pollReplicatePrediction) {
        return await window.Utils.pollReplicatePrediction(prediction.id, apiKey);
    } else {
        return await pollReplicatePrediction(prediction.id, apiKey);
    }
}

// Generate Phone-Aware Advertising Prompts (missing from original modularization)
function generateAdvertisingPrompts(description, includesPhone) {
    let cleanPrompt, negativePrompt;
    
    if (includesPhone) {
        // If concept naturally includes phones, generate with phone positioned so screen isn't visible
        cleanPrompt = `${description}. PHOTOREALISTIC professional advertising photography, real person, actual human being, realistic facial features, natural skin texture, real photography not illustration, beautiful lighting, high quality, photorealistic, realistic, real world, authentic, genuine. Show real person with a smartphone that is either POWERED OFF (black screen) or positioned with the screen facing away from camera/tilted so the screen is not visible to viewer.`;
        negativePrompt = "visible phone screen, app interface visible, PerfectPlate app, restaurant app, food app, app details, fake app interface, readable screen content, screen facing camera, cartoon, illustration, animated, drawn, painting, sketch, anime, manga, comic book, stylized, artificial, fake, low quality, blurry, dark, amateur photography";
    } else {
        // If concept doesn't include phones, remove phone elements entirely
        cleanPrompt = `${description}. PHOTOREALISTIC professional advertising photography, real person, actual human being, realistic facial features, natural skin texture, real photography not illustration, beautiful lighting, high quality, photorealistic, realistic, real world, authentic, genuine. Focus on the scene and environment without any phone or screen elements.`;
        negativePrompt = "phone, smartphone, screen, mobile device, app interface, cartoon, illustration, animated, drawn, painting, sketch, anime, manga, comic book, stylized, artificial, fake, low quality, blurry, dark, amateur photography";
    }
    
    console.log('🎯 Generating clean advertising image with FLUX Schnell...');
    console.log('📱 Phone inclusion:', includesPhone ? 'YES - will include phones (powered off or facing away)' : 'NO - concept explicitly excludes phones');
    console.log('✨ Enhancement: Using FLUX Schnell model (same as PerfectPlate app) for superior quality');
    
    return { cleanPrompt, negativePrompt };
} 

// Generate SDXL Text-to-Image (missing from original modularization)
async function generateSDXLTextToImage(apiKey, prompt, base64Image) {
    // Remove data URL prefix if present
    const cleanBase64 = base64Image.replace(/^data:image\/[a-z]+;base64,/, '');
    
    // Use working SDXL text-to-image model instead of problematic versions
    const requestBody = {
        version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
        input: {
            prompt: `${prompt}. Professional advertising photography, high quality, photorealistic, bright lighting.`,
            width: 1024,
            height: 1024,
            num_outputs: 1,
            scheduler: "K_EULER",
            num_inference_steps: 50,
            guidance_scale: 8.5,
            prompt_strength: 0.8,
            refine: "expert_ensemble_refiner",
            high_noise_frac: 0.8,
            negative_prompt: "dark phone screen, black screen, blank screen, broken phone, cracked screen, dim lighting, dark image, low quality, blurry"
        }
    };
    
    console.log('⚙️ SDXL Text-to-Image parameters:', JSON.stringify(requestBody, null, 2));
    
    // Call Replicate API directly
    const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
            'Authorization': `Token ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ SDXL API Error Response:', errorText);
        throw new Error(`SDXL API error: ${response.status}`);
    }
    
    const prediction = await response.json();
    console.log('📤 SDXL prediction started:', prediction.id);
    
    // Poll for completion
    if (window.Utils && window.Utils.pollReplicatePrediction) {
        return await window.Utils.pollReplicatePrediction(prediction.id, apiKey);
    } else {
        return await pollReplicatePrediction(prediction.id, apiKey);
    }
}

// Setup social media event listeners (placeholder function)
function setupSocialMediaEventListeners() {
    console.log('Social media event listeners setup');
    // This function can be enhanced later if needed
    return true;
}

// Handle generate content (placeholder function)
function handleGenerateContent() {
    console.log('Handle generate content called');
    // This function can be enhanced later if needed
    return true;
}

// Copy variation (placeholder function)
function copyVariation(index) {
    console.log('Copy variation called:', index);
    // This function can be enhanced later if needed
    return true;
}

// Generate dynamic video instructions with Gemini API
async function generateVideoInstructions(apiKey, data) {
    const creativityLevel = data.creativityLevel || 'engaging';
    
    // Create different video styles based on creativity level
    let styleInstructions = '';
    let hookExamples = '';
    
    switch(creativityLevel) {
        case 'professional':
            styleInstructions = 'Create a PROFESSIONAL, informative TikTok video that showcases the app features clearly and professionally.';
            hookExamples = `
Professional Hook Examples:
- "Finding [diet] restaurants just got easier"
- "Introducing PerfectPlate: Smart restaurant discovery"
- "Never guess about [diet] options again"`;
            break;
            
        case 'engaging':
            styleInstructions = 'Create an ENGAGING, relatable TikTok video that connects with viewers through shared experiences.';
            hookExamples = `
Engaging Hook Examples:
- "POV: You're [diet] and hungry"
- "Me trying to find [diet] food vs. using PerfectPlate"
- "When you find [optionsCount] [diet] options at [restaurant]"`;
            break;
            
        case 'bold':
            styleInstructions = 'Create a BOLD, attention-grabbing TikTok video that uses strong hooks and emotional triggers.';
            hookExamples = `
Bold Hook Examples:
- "STOP settling for salad when dining out"
- "I found [optionsCount] [diet] options at [restaurant] and I'm SHOCKED"
- "The ONE app that changed how I eat out forever"
- "Never ask 'Is this [diet]?' again"`;
            break;
            
        case 'viral':
            styleInstructions = 'Create a VIRAL-WORTHY TikTok video designed to STOP THE SCROLL with controversial takes, shocking revelations, and addictive content.';
            hookExamples = `
VIRAL Hook Examples:
- "Nobody talks about this [diet] secret..."
- "This app found [diet] food at McDonald's and I'm SHOOK"
- "POV: You've been lied to about [diet] dining options"
- "Restaurant workers hate this one app"
- "I tested EVERY food app and this one broke me"
- "The [diet] dining conspiracy nobody mentions"`;
            break;
    }
    
    const prompt = `${styleInstructions}

TikTok Post Content: "${data.tiktokContent}"
Restaurant: ${data.restaurant}
Diet Type: ${data.diet}
Options Found: ${data.optionsCount}
Day Theme: ${data.template.name}
Surprising Detail: ${data.surprisingDetail}

=== CRITICAL: PERFECTPLATE APP FUNCTIONALITY CONTEXT ===

**HOW THE APP ACTUALLY WORKS:**

1. **USER SETUP PROCESS:**
   - Users first set their dietary preferences (vegan, keto, paleo, gluten-free, etc.) in their profile
   - Users set their location/ZIP code
   - Users can set macro goals (protein, carbs, fat targets)
   - Users can rate individual ingredients 0-100 (loves/hates specific foods)

2. **RESTAURANT DISCOVERY FLOW:**
   - Home screen shows personalized meal recommendations for nearby restaurants
   - Users can search by location or browse local restaurants
   - Each restaurant card shows diet counts (e.g., "12 Keto Options") BEFORE entering
   - Restaurant cards show star ratings, distance, and quick diet compatibility

3. **RESTAURANT MENU EXPERIENCE:**
   - When users open a restaurant, there is NO "filter by diet" button
   - The menu is AUTOMATICALLY sorted with "Recommended for You" section at the top
   - Recommended section shows items that match their dietary preferences and ingredient ratings
   - Each menu item shows:
     * Match score percentage (e.g., "87% Match")
     * Complete macro breakdown (calories, protein, carbs, fat)
     * Dietary tags (Keto, Vegan, Gluten-Free, etc.)
     * Ingredient ratings visualization
   - Items are color-coded: green (great match), yellow (okay), red (avoid)

4. **KEY FEATURES TO HIGHLIGHT:**
   - **Smart Personalization:** Menu items ranked by personal preferences, not just diet
   - **Macro Tracking:** Real nutritional data for meal planning
   - **Ingredient Intelligence:** Shows why items match based on loved/hated ingredients
   - **Diet Confidence:** Clear visual indicators for dietary compliance
   - **Meal Planning:** Can save meals and track daily nutrition goals

5. **REAL APP SCREENS AVAILABLE:**
   - Home screen with personalized meal cards
   - Restaurant search/browse screen with diet counts
   - Individual restaurant page with "Recommended for You" section
   - Menu item detail page with macro breakdown and match score
   - User profile with dietary preferences and ingredient ratings
   - Meal planning/saved meals screen

**IMPORTANT: DO NOT INCLUDE:**
- "Filter by Diet" buttons (they don't exist)
- Generic menu browsing (it's always personalized)
- Bold "X OPTIONS FOUND!" popups (results are integrated naturally)
- Standard restaurant menus (all menus are personalized from the start)

**CORRECT USER FLOW TO SHOW:**
1. Opening app → Personalized recommendations appear
2. Searching for specific restaurant → Seeing diet counts on restaurant card
3. Opening restaurant → "Recommended for You" section already showing personalized options
4. Viewing specific menu item → Match score and macro breakdown displayed
5. Understanding why it's recommended → Ingredient ratings explanation

Create a step-by-step video script that showcases these REAL PerfectPlate features. Format it exactly like this:

🎬 APP DEMO VIDEO (15 seconds):
0-2s: [Hook text or opening visual]
2-4s: [Specific app screen to show]
4-7s: [User action/interaction to demonstrate]
7-10s: [Key feature or result to highlight]
10-13s: [Final app benefit or detail to show]
13-15s: [Clear call-to-action]

📱 SCREENS TO RECORD: [List the specific app screens needed]
🎵 MUSIC: [Appropriate music style for this content]
💡 FOCUS: [Key app benefit to emphasize]

Make sure the video script:
- Shows ACTUAL PerfectPlate app functionality (no fake features)
- Demonstrates finding ${data.diet} options at ${data.restaurant} using the real user flow
- Highlights personalization, match scores, and macro tracking features
- Matches the theme of "${data.template.name}"
- Uses the exact restaurant and diet information provided
- Shows the "Recommended for You" section, not generic filtering
- Demonstrates match scores and macro breakdowns
- Has a clear progression from problem to solution
- Ends with a strong app download/usage CTA

Be specific about app screens, user actions, and visual elements that actually exist in PerfectPlate.`;

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
        throw new Error(`Video instructions API error: ${response.status}`);
    }

    const result = await response.json();
    return result.candidates[0].content.parts[0].text;
}