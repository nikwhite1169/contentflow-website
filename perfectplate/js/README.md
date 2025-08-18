# Content Automation - Modular Script Architecture

The content automation system has been refactored from a single 6,000-line script into a clean, modular architecture for easier maintenance and development.

## 📁 Module Structure

### 🛠️ **utils.js** - Core Utilities
- **Purpose**: Common functions used across all modules
- **Key Functions**:
  - Error/success message handling (`showError`, `showSuccess`)
  - API calls to Gemini (`callGeminiAPI`)
  - Token estimation (`estimateTokens`, `calculateTokenSavings`)
  - File downloads (`downloadAsHTML`, `downloadAsJSON`)
  - Form validation (`validateEmail`, `validateURL`)
  - Loading states and animations
  - Copy to clipboard functionality

### 📱 **social-media.js** - Social Media Generation
- **Purpose**: Handles TikTok, Facebook, and Instagram post generation
- **Key Features**:
  - Day templates (Meatless Monday, Transformation Tuesday, etc.)
  - Diet-specific content variations (17 diet types supported)
  - Restaurant targeting and hashtag optimization
  - Token-saving content type selection
- **Key Functions**:
  - `initializeDayTemplates()` - Set up all day templates
  - `generateContent()` - Main content generation function
  - Day selection and restaurant data management

### 📝 **blog-generator.js** - Blog Post Creation
- **Purpose**: Manages blog templates and content generation
- **Key Features**:
  - Template system (Keto Guide, Vegan Options, Paleo Guide)
  - Dynamic content generation
  - Category and keyword management
  - SEO optimization
- **Key Functions**:
  - `selectTemplate()` - Template selection and auto-fill
  - `generateBlogPost()` - AI-powered blog generation
  - `showGeneratedBlog()` - Preview functionality

### 👨‍🍳 **recipe-generator.js** - Recipe Creation
- **Purpose**: Specialized recipe generation with diet selection
- **Key Features**:
  - Diet selection modal (6 diet types)
  - Recipe formatting with ingredients and instructions
  - Image integration (stock photos)
  - Optimized AI prompts (reduced from 5000+ to 500-800 tokens)
- **Key Functions**:
  - `showDietSelectionModal()` - Diet selection interface
  - `generateRecipeWithDiet()` - Recipe generation workflow
  - `generateDynamicRecipeContent()` - AI recipe creation
  - `showRecipeDirectly()` - Direct preview display

### 🎯 **main.js** - Coordination & Initialization
- **Purpose**: Coordinates all modules and handles global functions
- **Key Features**:
  - Module initialization
  - Event listener setup
  - API key management
  - Global function delegation
  - HTML template generation for blog publishing
- **Key Functions**:
  - `initializeApp()` - Initialize all modules
  - `publishBlogPost()` - Generate downloadable HTML
  - Global function wrappers for HTML onclick handlers

## 🔄 Loading Order

Scripts must be loaded in this specific order:

1. **utils.js** - Core utilities (no dependencies)
2. **social-media.js** - Uses utils for messages/API calls
3. **blog-generator.js** - Uses utils for templates/generation
4. **recipe-generator.js** - Uses utils for API calls/display
5. **main.js** - Coordinates all modules (depends on all others)

## 🏗️ Architecture Benefits

### ✅ **Maintainability**
- Each module has a single responsibility
- Easy to locate and fix bugs
- Clear separation of concerns

### ✅ **Scalability** 
- Add new features without affecting existing code
- Modular testing and development
- Easy to add new content types or templates

### ✅ **Performance**
- Smaller individual files load faster
- Better browser caching
- Reduced memory footprint

### ✅ **Developer Experience**
- Easier code navigation
- Better IDE support and intellisense
- Cleaner git diffs and conflict resolution

## 🔧 Adding New Features

### Adding a New Content Type:
1. Create new module in `js/[content-type].js`
2. Add export to `window.[ModuleName]`
3. Import in `main.js`
4. Add HTML tab and form elements
5. Add global function wrapper in `main.js`

### Adding New Blog Templates:
1. Update `blogCategories` in `blog-generator.js`
2. Add template card to HTML
3. Implement template-specific logic in `selectTemplate()`

### Adding New Recipe Diet Types:
1. Update diet options in recipe modal HTML
2. Add diet mappings in `recipe-generator.js`
3. Update `dietEmojis` and `dietDescriptions` objects

## 🐛 Debugging

Each module exports functions to `window` for console debugging:
- `window.Utils` - Utility functions
- `window.SocialMedia` - Social media functions
- `window.BlogGenerator` - Blog functions  
- `window.RecipeGenerator` - Recipe functions
- `window.ContentAutomation` - Main coordination functions

Example debugging:
```javascript
// Check if modules loaded
console.log(window.SocialMedia);
console.log(window.Utils);

// Test function directly
window.Utils.showSuccess('Test message');
window.SocialMedia.generateContent();
```

## 🔄 Migration Notes

The refactored system maintains 100% backward compatibility:
- All HTML onclick handlers continue to work
- API key storage and form functionality unchanged
- Generated content format and downloads identical
- No user-facing changes

Original `script.js` has been preserved as backup in `script copy.js`.

## 🚀 Future Enhancements

The modular structure enables easy implementation of:
- Video content generation module
- Email marketing automation
- Analytics and reporting module
- Advanced AI prompt engineering tools
- Multi-language content support
- Content scheduling and publishing automation 