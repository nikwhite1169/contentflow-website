// AI Goes Rogue Video Generator
// Creates parody TikTok content that exaggerates AI video generation flaws for comedy

// AI Video Generation Flaws to Exploit for Comedy
const AI_VIDEO_FLAWS = {
    overProduction: [
        "ingredients floating in zero gravity like a space commercial",
        "protein fillet ascending to heaven in slow motion with choir music",
        "vegetables arranged in impossible geometric patterns",
        "ingredients spinning on individual pedestals like luxury car ads"
    ],
    weirdPhysics: [
        "oil pouring upward in Matrix-style reverse gravity",
        "ingredients merging with sci-fi glowing particle effects",
        "steam rising in perfect geometric spirals",
        "cutting board floating midair while knife moves independently"
    ],
    perfectionism: [
        "every ingredient perfectly identical like factory products",
        "finished dish so plastic-perfect it looks inedible",
        "vegetables arranged with mathematical precision",
        "lighting so dramatic it could be a movie poster"
    ],
    surreal: [
        "ingredients materializing from thin air in puffs of smoke",
        "pan rotating 360 degrees for no apparent reason",
        "close-up of salt crystals like they're precious gems",
        "background changing from kitchen to abstract void"
    ],
    overEmphasis: [
        "extreme close-up of single peppercorn for 3 seconds",
        "garlic clove presented like the crown jewels",
        "water boiling with the intensity of a volcanic eruption",
        "timer counting down like a bomb defusal scene"
    ]
};

// Recipe Personality Templates (enthusiastic with natural reactions)
const RECIPE_COMMENTARY = {
    enthusiasm: [
        "This is honestly one of my favorite {meal_type} recipes - {ingredient} is so {benefit} and {cooking_quality}.",
        "What I absolutely love about this dish is {personal_reason}. [chuckles] Though the AI seems to have other ideas about presentation.",
        "This has become my go-to when I want something {adjective} - it's {benefit} and {ease_factor}.",
        "The flavor combination here is just incredible - {flavor_description}. [sighs] The visuals are... creative."
    ],
    healthBenefits: [
        "You're getting {nutrient} and {nutrient2} in every bite, plus it's {dietary_benefit}.",
        "What's great is this gives you {benefit} without {negative}. [clears throat] The floating ingredients are optional.",
        "This is perfect for {diet_type} because {reason}. [chuckles softly] The AI's dramatic presentation isn't required.",
        "I love how {health_aspect} - it's basically {comparison}. [pauses] Right, so... back to normal cooking."
    ],
    easeAndConvenience: [
        "The best part? It takes literally {time} and you can't really mess it up.",
        "This is so {ease_adjective} - just {simple_step} and {simple_step2}. [sighs] The levitation is unnecessary.",
        "Perfect for busy {time_of_day} when you want something {quality} but {constraint}.",
        "Even beginners can nail this - it's basically {comparison}. [chuckles] The special effects are optional."
    ],
    flavorProfile: [
        "The {ingredient} and {ingredient2} combination is pure magic - {flavor_description}.",
        "What makes this special is how the {element} {action} with the {element2}. [pauses] The dramatic lighting isn't part of the recipe.",
        "You get this amazing {texture} with {flavor_note} that just {effect}.",
        "The {cooking_method} really brings out the {flavor_aspect} in the {ingredient}. [sighs deeply] The theatrics are... a choice."
    ],
    personalTips: [
        "Pro tip: {helpful_advice} - it makes all the difference.",
        "I always {personal_technique} because {reason}. [chuckles] The AI has... different techniques.",
        "Don't skip the {ingredient} - it really {effect}. [clears throat] Just use normal amounts, not whatever this is.",
        "Trust me on this - {tip} and you'll {result}. [pauses] The floating ingredients will settle eventually."
    ]
};

// Extract structured ingredients and steps from the generated recipe HTML
function extractRecipeStructure(recipeHtml) {
    try {
        const container = document.createElement('div');
        container.innerHTML = recipeHtml || '';

        const toCleanText = (node) => (node?.textContent || '')
            .replace(/\s+/g, ' ')
            .trim();

        // Find ingredients by looking for an <h3> that includes 'Ingredients' and the nearest following <ul>
        let ingredients = [];
        const headings = Array.from(container.querySelectorAll('h3'));
        const ingredientsHeading = headings.find(h => /ingredients/i.test(h.textContent || ''));
        if (ingredientsHeading) {
            let next = ingredientsHeading.nextElementSibling;
            while (next && next.tagName.toLowerCase() !== 'ul') {
                next = next.nextElementSibling;
            }
            if (next && next.tagName.toLowerCase() === 'ul') {
                ingredients = Array.from(next.querySelectorAll('li')).map(li => toCleanText(li)).filter(Boolean);
            }
        }
        // Fallback: first <ul> in content
        if (ingredients.length === 0) {
            const firstUl = container.querySelector('ul');
            if (firstUl) ingredients = Array.from(firstUl.querySelectorAll('li')).map(li => toCleanText(li)).filter(Boolean);
        }

        // Find steps by looking for an <h3> that includes 'Instructions' and the nearest following <ol>
        let steps = [];
        const instructionsHeading = headings.find(h => /instructions|method|directions/i.test(h.textContent || ''));
        if (instructionsHeading) {
            let next = instructionsHeading.nextElementSibling;
            while (next && next.tagName.toLowerCase() !== 'ol') {
                next = next.nextElementSibling;
            }
            if (next && next.tagName.toLowerCase() === 'ol') {
                steps = Array.from(next.querySelectorAll('li')).map(li => toCleanText(li)).filter(Boolean);
            }
        }
        // Fallback: first <ol> in content
        if (steps.length === 0) {
            const firstOl = container.querySelector('ol');
            if (firstOl) steps = Array.from(firstOl.querySelectorAll('li')).map(li => toCleanText(li)).filter(Boolean);
        }

        // Last resort: derive steps from numbered lines in plain text
        if (steps.length === 0) {
            const plain = (recipeHtml || '').replace(/<[^>]*>/g, '\n');
            const numbered = plain.split('\n').map(l => l.trim()).filter(l => /^\d+\./.test(l));
            steps = numbered.map(l => l.replace(/^\d+\.?\s*/, '')).filter(Boolean);
        }

        // Normalize ingredients to short labels (drop amounts) for referencing
        const normalizedIngredients = ingredients.map(i => i.replace(/^[\d/.,\s-]+/, '').replace(/\(.*?\)/g, '').trim()).filter(Boolean);

        return { ingredients: normalizedIngredients, steps };
    } catch (e) {
        console.error('Failed to extract recipe structure for AI Rogue:', e);
        return { ingredients: [], steps: [] };
    }
}

// Generate AI Goes Rogue TikTok content
async function generateAIRogueContent(recipeTitle, recipeContent, diet) {
    const apiKey = localStorage.getItem('geminiApiKey');
    if (!apiKey) {
        console.warn('No Gemini API key found for AI Rogue content generation');
        return null;
    }

    try {
        // Extract key ingredients and cooking steps from recipe
        const cleanContent = recipeContent.replace(/<[^>]*>/g, '');
        const { ingredients: allowedIngredients, steps: allowedSteps } = extractRecipeStructure(recipeContent);
        
        const prompt = `Create a parody TikTok video for this recipe: "${recipeTitle}"

RECIPE CONTENT: "${cleanContent.substring(0, 500)}"

ALLOWED INGREDIENTS (only use items from this list — do not invent new ones):
${JSON.stringify(allowedIngredients)}

ALLOWED STEPS (reference by number only — do not invent new steps):
${JSON.stringify(allowedSteps.map((s, i) => ({ step: i + 1, text: s })))}

Create a "AI Goes Rogue" parody video where AI generates absurd cooking visuals while a professional cooking show host tries to give a legitimate recipe tutorial.

CONCEPT: The voiceover is a REAL recipe description - explaining ingredients, techniques, and why the dish is great. BUT the AI visuals are completely unhinged. The host occasionally makes deadpan observations about the AI's bizarre behavior while staying focused on actually teaching the recipe.

EXAMPLE VOICEOVER STYLES (mix these approaches):

STYLE 1 - Recipe Enthusiasm:
"This is honestly one of my favorite weeknight dinners - this protein is packed with nutrients and cooks so quickly. [chuckles] The AI seems to think it deserves royal treatment."

STYLE 2 - Personal Insights:
"What I love about this dish is how the dill brightens everything up. [sighs] Though apparently the computer thinks herbs should explode like fireworks."

STYLE 3 - Health Benefits Focus:
"This gives you lean protein and healthy fats in under 20 minutes. [clears throat] The presentation here is... creative."

STYLE 4 - Ease and Convenience:
"The best part? It's basically impossible to mess up. [chuckles softly] Well, unless you're an AI trying to defy physics."

STYLE 5 - Flavor Profile:
"The lemon and herb combination is just perfect with this dish. [pauses] Right, so... back to normal cooking methods."

VOICEOVER REQUIREMENTS:
- PRIMARY: Enthusiastic recipe personality - why you love this dish, health benefits, ease of cooking, flavor profile, personal tips
- SECONDARY: Basic cooking guidance (not detailed steps - save those for the website)
- TERTIARY: Natural reactions to AI's ridiculous behavior (not every clip needs AI commentary)
- Include ElevenLabs voice markers like [sighs], [chuckles], [clears throat], [pauses] for natural delivery
- Show genuine enthusiasm for the food while maintaining professionalism despite visual chaos
- Share personal insights: "This is one of my favorite..." "What I love about this dish..." "The best part is..."
- Mention health benefits, convenience, flavor combinations that make the dish special
- Balance 60% recipe personality/enthusiasm / 25% basic guidance / 15% AI reactions
 - Do NOT reveal the full recipe: no exact amounts/measurements, oven temps, or minute-by-minute timing; keep instructions high-level only

CREATE EXACTLY 6 CLIPS (5 seconds each = 30 seconds total):

CLIP REQUIREMENTS:
- Each clip shows a real cooking step but with exaggerated AI generation flaws
- Ingredients and techniques should match the actual recipe
- AI presents everything in absurd ways (floating, glowing, perfect geometry, etc.)
- Visuals get progressively more ridiculous while recipe stays legitimate
- Each clip MUST include text overlays with actual cooking instructions
- Generate completely unique content every time - no repeated phrases or concepts
- Do NOT use any ingredients not present in ALLOWED INGREDIENTS
- Each clip must include an "ingredientsUsed" array (subset of ALLOWED INGREDIENTS)
- Each clip must include a "stepRef" integer referencing ALLOWED STEPS (1-based)
 - Text overlays must avoid exact quantities, temperatures, and precise timings (no numbers + units)

Format as JSON:
{
  "videoClips": [
    {
      "clipNumber": 1,
      "duration": "5 seconds",
      "visualPrompt": "unique absurd AI-style presentation of cooking step",
      "aiFlawType": "specific AI generation flaw being showcased",
      "timing": "0-5s",
      "stepRef": 1,
      "ingredientsUsed": ["ingredient label from ALLOWED INGREDIENTS"],
      "textOverlay": {
        "text": "actual cooking instruction for this step",
        "timing": "1-4s",
        "position": "center",
        "style": "large white text with black outline"
      }
    }
  ],
  "editingInstructions": {
    "voiceoverScript": "Complete script with ElevenLabs voice markers [sighs], [chuckles], [pauses] and timing",
    "musicStyle": "specific unique music recommendation",
    "transitions": ["creative unique transition suggestions"],
    "endCard": {
      "text": "Want the real version? Recipe's at PerfectPlate.app",
      "timing": "25-30s"
    }
  },
  "postDescription": "1–2 sentences, tongue‑in‑cheek as if sharing a real recipe + a dry note that AI video isn’t perfect, and MUST end with: AI’s not good at everything… But it’s GREAT at finding the perfect meal. Download PerfectPlate to find yours.",
  "hashtags": [
    "30 total, unique, balanced set mixing: AI-humor (6–8), recipe/cooking (8–10), diet-specific for ${diet} (6–8), general food discovery (4–6), and branded (#PerfectPlate, #PerfectPlateApp, #FindYourPerfectMeal). Return as an array of 30 strings that all start with # and contain no spaces."
  ]
}

CRITICAL: Make every response completely different and creative. No hardcoded phrases. Generate fresh, unique content each time.

Make it hilariously obvious that AI doesn't understand cooking while maintaining the dry, deadpan humor throughout.`;

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
                    temperature: 0.9,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 4096,
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error Response:', errorText);
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        
        if (data.error) {
            console.error('Gemini API Error:', data.error);
            throw new Error(`Gemini API Error: ${data.error.message || JSON.stringify(data.error)}`);
        }
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            console.error('Invalid API response structure:', data);
            throw new Error('Invalid response from Gemini API - no content generated');
        }
        
        const generatedText = data.candidates[0].content.parts[0].text;
        
        console.log('🤖 Raw AI Rogue response:', generatedText);
        
        // Parse JSON response
        let rogueContent = null;
        
        // Try multiple JSON extraction strategies
        let jsonMatch = generatedText.match(/```json\s*(\{[\s\S]*?\})\s*```/);
        if (jsonMatch) {
            try {
                rogueContent = JSON.parse(jsonMatch[1]);
            } catch (e) {
                console.log('Strategy 1 failed, trying strategy 2...');
            }
        }
        
        if (!rogueContent) {
            jsonMatch = generatedText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                let jsonStr = jsonMatch[0]
                    .replace(/,\s*\]/g, ']')
                    .replace(/,\s*\}/g, '}')
                    .replace(/\n/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim();
                
                try {
                    rogueContent = JSON.parse(jsonStr);
                } catch (e) {
                    console.error('JSON parsing failed:', e);
                    console.log('Failed JSON:', jsonStr);
                }
            }
        }
        
        // Post-process to enforce 6x5s format and remove specific measurements
        function sanitizeOverlayText(text) {
            if (!text) return text;
            // Replace common quantity/temperature patterns with generic wording
            return text
                .replace(/\b\d+[\d\/\.]*\s?(cups?|cup|tbsp|tablespoons?|tsp|teaspoons?|grams?|g|kg|ml|l|liters?|oz|ounces?|pounds?|lb|lbs)\b/gi, 'some')
                .replace(/\b\d+[\d\/\.]*\s?(minutes?|minute|mins?|seconds?|secs?)\b/gi, 'a bit')
                .replace(/\b\d+[\d\/\.]*\s?(°|degrees?\s?(f|c)?)\b/gi, 'hot')
                .replace(/\b\d+\s?(to|–|-)\s?\d+\b/gi, 'some');
        }

        if (rogueContent) {
            // Ensure post description ends with the standard CTA
            const cta = " AI’s not good at everything… But it’s GREAT at finding the perfect meal. Download PerfectPlate to find yours.";
            if (rogueContent.postDescription) {
                const trimmed = String(rogueContent.postDescription).trim();
                rogueContent.postDescription = /find yours\.?$/i.test(trimmed) ? trimmed : (trimmed + cta);
            }

            // Normalize and cap hashtags to 30; if fewer than 30, pad with safe branded tags
            if (Array.isArray(rogueContent.hashtags)) {
                const unique = Array.from(new Set(rogueContent.hashtags.map(h => h.trim()).filter(Boolean)));
                const target = 30;
                const pad = [
                    '#PerfectPlate', '#PerfectPlateApp', '#FindYourPerfectMeal',
                    '#FoodTok', '#HomeCooking', '#Recipe', '#GoodEats'
                ];
                while (unique.length < target && pad.length) unique.push(pad.shift());
                rogueContent.hashtags = unique.slice(0, target);
            }
            if (Array.isArray(rogueContent.videoClips)) {
                // Keep first 6, normalize duration/timing, sanitize overlays
                rogueContent.videoClips = rogueContent.videoClips.slice(0, 6).map((clip, idx) => ({
                    ...clip,
                    duration: '5 seconds',
                    timing: `${idx * 5}-${(idx + 1) * 5}s`,
                    textOverlay: clip.textOverlay ? {
                        ...clip.textOverlay,
                        text: sanitizeOverlayText(String(clip.textOverlay.text || ''))
                    } : undefined
                }));
            }
            // Add special markers to identify this as AI Rogue content
            rogueContent.isAIRogue = true;
            rogueContent.contentType = "AI Goes Rogue";
            console.log('✅ Generated AI Rogue content:', rogueContent);
            return rogueContent;
        } else {
            throw new Error('Could not parse JSON from AI Rogue content response');
        }
        
    } catch (error) {
        console.error('Error generating AI Rogue content:', error);
        return null;
    }
}

// Display AI Goes Rogue content with special styling
function displayAIRogueContent(rogueData, recipeTitle) {
    if (!rogueData) {
        console.warn('No AI Rogue data to display');
        return '';
    }

    const rogueHtml = `
        <div class="ai-rogue-content-section" style="background: linear-gradient(135deg, #ff6b6b, #4ecdc4); padding: 25px; border-radius: 15px; margin: 25px 0; border: 3px solid #2d3436; position: relative;">
            <!-- AI Rogue Header -->
            <div style="background: rgba(0,0,0,0.8); color: #fff; padding: 15px; border-radius: 10px; margin-bottom: 20px; text-align: center;">
                <h3 style="margin: 0; font-size: 1.5em;">🤖 AI GOES ROGUE: "${recipeTitle}"</h3>
                <p style="margin: 5px 0 0 0; opacity: 0.9; font-style: italic;">When artificial intelligence tries to understand cooking...</p>
            </div>
            
            <!-- Video Clip Prompts -->
            <div class="rogue-video-clips" style="margin-bottom: 25px;">
                <h4 style="color: #2d3436; background: rgba(255,255,255,0.9); padding: 10px; border-radius: 8px; margin-bottom: 15px;">
                    📹 AI Video Generation Prompts (${rogueData.videoClips?.length || 0} clips - ${(rogueData.videoClips?.length || 0) * 5}s of pure AI chaos)
                </h4>
                <div style="background: rgba(255,255,255,0.95); padding: 15px; border-radius: 10px;">
                    ${rogueData.videoClips?.map(clip => `
                        <div style="margin-bottom: 15px; padding: 15px; background: linear-gradient(45deg, #ffeaa7, #fab1a0); border-radius: 8px; border-left: 5px solid #e17055; position: relative;">
                            <div style="display: flex; justify-content: between; align-items: start; margin-bottom: 8px;">
                                <strong style="color: #2d3436;">🎬 Clip ${clip.clipNumber} (${clip.timing})</strong>
                                <span style="background: #e17055; color: white; padding: 3px 8px; border-radius: 12px; font-size: 0.8em; font-weight: bold; margin-left: auto;">
                                    AI FLAW: ${clip.aiFlawType || clip.flaw || 'Unknown'}
                                </span>
                            </div>
                            <div style="font-style: italic; color: #2d3436; line-height: 1.4; margin-bottom: 10px;">
                                "${clip.visualPrompt}"
                            </div>
                            ${clip.textOverlay ? `
                                <div style="background: rgba(0,0,0,0.8); color: white; padding: 8px 12px; border-radius: 6px; margin-top: 8px;">
                                    <strong style="color: #74b9ff;">📝 Text Overlay:</strong> "${clip.textOverlay.text}"<br>
                                    <small style="opacity: 0.8;">Timing: ${clip.textOverlay.timing} | Position: ${clip.textOverlay.position}</small>
                                </div>
                            ` : ''}
                            <div style="position: absolute; top: -5px; right: -5px; background: #ff7675; color: white; border-radius: 50%; width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-size: 0.8em;">
                                🤖
                            </div>
                        </div>
                    `).join('') || '<p>No AI chaos generated</p>'}
                </div>
            </div>

            <!-- Deadpan Commentary -->
            <div class="rogue-voiceover" style="margin-bottom: 25px;">
                <h4 style="color: #2d3436; background: rgba(255,255,255,0.9); padding: 10px; border-radius: 8px; margin-bottom: 15px;">
                    🎤 Deadpan Commentary Script
                </h4>
                <div style="background: rgba(255,255,255,0.95); padding: 20px; border-radius: 10px; border: 2px dashed #636e72;">
                    <div style="font-family: 'Courier New', monospace; line-height: 1.6; color: #2d3436; background: #f8f9fa; padding: 15px; border-radius: 6px;">
                        ${rogueData.editingInstructions?.voiceoverScript || 'No commentary script generated'}
                    </div>
                    <div style="margin-top: 12px; padding: 10px; background: #fdcb6e; border-radius: 6px; font-size: 0.9em; color: #2d3436;">
                        📢 <strong>Delivery Style:</strong> David Attenborough discovering AI in the wild
                    </div>
                </div>
            </div>

            <!-- Production Notes -->
            <div class="rogue-production" style="margin-bottom: 25px;">
                <h4 style="color: #2d3436; background: rgba(255,255,255,0.9); padding: 10px; border-radius: 8px; margin-bottom: 15px;">
                    🎭 Production Notes
                </h4>
                <div style="background: rgba(255,255,255,0.95); padding: 15px; border-radius: 10px;">
                    <div style="margin-bottom: 12px;">
                        <strong style="color: #e17055;">🎵 Music Style:</strong>
                        <span style="background: #74b9ff; color: white; padding: 6px 12px; border-radius: 16px; margin-left: 8px;">
                            ${rogueData.editingInstructions?.musicStyle || 'Overly dramatic classical'}
                        </span>
                    </div>
                    
                    <div style="margin-bottom: 12px;">
                        <strong style="color: #e17055;">🔄 Transitions:</strong>
                        <div style="margin-top: 8px;">
                            ${rogueData.editingInstructions?.transitions?.map(transition => `
                                <span style="background: #a29bfe; color: white; padding: 4px 8px; margin: 2px; border-radius: 12px; font-size: 0.9em;">${transition}</span>
                            `).join('') || 'Standard AI glitch effects'}
                        </div>
                    </div>

                    ${rogueData.editingInstructions?.endCard ? `
                        <div style="margin-top: 15px; padding: 12px; background: #00b894; color: white; border-radius: 8px;">
                            <strong>📱 End Card (${rogueData.editingInstructions.endCard.timing}):</strong><br>
                            "${rogueData.editingInstructions.endCard.text}"
                        </div>
                    ` : ''}
                </div>
            </div>

            <!-- TikTok Post Content -->
            <div class="rogue-post" style="margin-bottom: 25px;">
                <h4 style="color: #2d3436; background: rgba(255,255,255,0.9); padding: 10px; border-radius: 8px; margin-bottom: 15px;">
                    📱 TikTok Post Description
                </h4>
                <div style="background: rgba(255,255,255,0.95); padding: 15px; border-radius: 10px; border: 2px solid #00b894;">
                    <div style="font-size: 16px; line-height: 1.5; color: #2d3436; text-align: center; font-weight: 500;">
                        ${rogueData.postDescription || 'No post description generated'}
                    </div>
                </div>
            </div>

            <!-- Hashtags -->
            <div class="rogue-hashtags">
                <h4 style="color: #2d3436; background: rgba(255,255,255,0.9); padding: 10px; border-radius: 8px; margin-bottom: 15px;">
                    🏷️ AI Chaos Hashtags
                </h4>
                <div style="background: rgba(255,255,255,0.95); padding: 15px; border-radius: 10px;">
                    <div style="line-height: 2.2;">
                        ${rogueData.hashtags?.map(tag => `
                            <span style="background: linear-gradient(45deg, #ff7675, #fd79a8); color: white; padding: 8px 14px; margin: 4px; border-radius: 20px; font-weight: bold; font-size: 0.9em; display: inline-block; transform: rotate(-2deg);">${tag}</span>
                        `).join(' ') || 'No hashtags generated'}
                    </div>
                    <div style="margin-top: 15px; padding: 12px; background: #ffeaa7; border-radius: 6px; font-size: 0.9em; color: #2d3436;">
                        🤖 <strong>AI Tip:</strong> These hashtags target people who love watching technology fail spectacularly!
                    </div>
                </div>
            </div>

            <!-- Copy Buttons -->
            <div style="margin-top: 25px; text-align: center;">
                <button onclick="copyAIRogueContent('description')" style="background: linear-gradient(45deg, #ff7675, #fd79a8); color: white; border: none; padding: 12px 24px; border-radius: 25px; margin: 8px; cursor: pointer; font-weight: bold; text-transform: uppercase;">
                    📋 Copy Description
                </button>
                <button onclick="copyAIRogueContent('hashtags')" style="background: linear-gradient(45deg, #74b9ff, #0984e3); color: white; border: none; padding: 12px 24px; border-radius: 25px; margin: 8px; cursor: pointer; font-weight: bold; text-transform: uppercase;">
                    🏷️ Copy Hashtags
                </button>
                <button onclick="copyAIRogueContent('voiceover')" style="background: linear-gradient(45deg, #00b894, #00cec9); color: white; border: none; padding: 12px 24px; border-radius: 25px; margin: 8px; cursor: pointer; font-weight: bold; text-transform: uppercase;">
                    🎤 Copy Script
                </button>
            </div>

            <!-- Warning Notice -->
            <div style="margin-top: 20px; padding: 15px; background: rgba(255,107,107,0.2); border: 2px dashed #ff6b6b; border-radius: 10px; text-align: center;">
                <strong style="color: #2d3436;">⚠️ WARNING:</strong> This content may cause uncontrollable laughter and existential questions about AI
            </div>
        </div>
    `;

    return rogueHtml;
}

// Copy AI Rogue content to clipboard
function copyAIRogueContent(type) {
    const rogueData = window.currentAIRogueContent;
    if (!rogueData) {
        alert('No AI Rogue content available to copy');
        return;
    }

    let textToCopy = '';
    
    switch(type) {
        case 'description':
            textToCopy = rogueData.postDescription || '';
            break;
        case 'hashtags':
            textToCopy = rogueData.hashtags?.join(' ') || '';
            break;
        case 'voiceover':
            textToCopy = rogueData.editingInstructions?.voiceoverScript || '';
            break;
        default:
            alert('Unknown content type');
            return;
    }

    if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            // Show success feedback with AI theme
            const button = event.target;
            const originalText = button.textContent;
            button.textContent = '🤖 COPIED!';
            button.style.background = 'linear-gradient(45deg, #00b894, #00cec9)';
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy to clipboard - even the AI is failing!');
        });
    } else {
        alert('No content available to copy - the AI is taking a break');
    }
}

// Note: AI Rogue mode now integrated directly into TikTok generation flow
// The generateRecipeWithAIRogue function is no longer needed as AI Rogue mode
// is activated via the checkbox during TikTok content generation

// Export functions
window.AIRogueGenerator = {
    generateAIRogueContent,
    displayAIRogueContent,
    copyAIRogueContent,
    AI_VIDEO_FLAWS,
    RECIPE_COMMENTARY
};

// Make functions globally available
window.copyAIRogueContent = copyAIRogueContent;

// Update TikTok mode status display
function updateTikTokModeStatus() {
    const statusDiv = document.getElementById('tiktokModeStatus');
    const aiRogueMode = document.getElementById('aiRogueMode')?.checked || false;
    
    if (statusDiv) {
        if (aiRogueMode) {
            statusDiv.innerHTML = '<span style="color: #ff7675; font-weight: bold;">🤖 AI CHAOS MODE ENABLED</span> - Will generate hilarious AI-gone-wrong videos!';
        } else {
            statusDiv.innerHTML = '<span style="color: #666;">📱 Normal TikTok mode</span> - Enable AI Chaos Mode above for comedy videos!';
        }
    }
}

// Add event listener for checkbox changes
document.addEventListener('DOMContentLoaded', function() {
    const aiRogueCheckbox = document.getElementById('aiRogueMode');
    if (aiRogueCheckbox) {
        // Update status initially
        updateTikTokModeStatus();
        
        // Update status when checkbox changes
        aiRogueCheckbox.addEventListener('change', updateTikTokModeStatus);
    }
});

console.log('🤖 AI Goes Rogue Generator loaded - prepare for cooking chaos!');