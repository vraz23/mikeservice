// DOM Elements
let preview, htmlOutput, savedPages, generateBtn, userPrompt, refinementPrompt, apiStatus, loadingOverlay, codeEditor;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM Content Loaded'); // Debug log
  
  // Get DOM elements
  preview = document.getElementById("preview");
  htmlOutput = document.getElementById("htmlOutput");
  savedPages = document.getElementById("savedPages");
  generateBtn = document.getElementById("generateBtn");
  userPrompt = document.getElementById("userPrompt");
  refinementPrompt = document.getElementById("refinementPrompt");
  apiStatus = document.getElementById("apiStatus");
  loadingOverlay = document.getElementById("loadingOverlay");

  // Verify critical elements exist
  const criticalElements = {
    preview, htmlOutput, generateBtn, userPrompt
  };
  
  for (const [name, element] of Object.entries(criticalElements)) {
    if (!element) {
      console.error(`Critical element missing: ${name}`);
      showNotification(`Error: Missing ${name} element. Please refresh the page.`, 'error');
      return;
    }
  }
  
  console.log('All critical elements found'); // Debug log

  // Initialize CodeMirror editor
  initializeCodeEditor();

  // Setup event listeners
  setupEventListeners();
  
  // Initialize app
  updateSavedPages();
  updateAPIStatus();
  updatePromptTemplates();
  updatePromptStatus();
  
  // Add input listeners for prompt status updates
  userPrompt.addEventListener('input', debounce(updatePromptStatus, 100));
  refinementPrompt.addEventListener('input', debounce(updatePromptStatus, 100));
  
  // Add some sample HTML for testing preview
  if (!getEditorContent().trim()) {
    const sampleHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SmartAI Builder Pro - Ready!</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 2rem;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: white;
            padding: 3rem;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 500px;
        }
        h1 { 
            color: #333; 
            margin-bottom: 1rem; 
            font-size: 2.5rem;
        }
        p { 
            color: #666; 
            line-height: 1.6; 
            margin-bottom: 1rem;
            font-size: 1.1rem;
        }
        .btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            margin-top: 1rem;
            font-size: 16px;
            transition: transform 0.2s ease;
        }
        .btn:hover { 
            transform: translateY(-2px); 
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-top: 2rem;
        }
        .feature {
            padding: 1rem;
            background: #f8f9ff;
            border-radius: 10px;
            border-left: 4px solid #667eea;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Welcome to SmartAI Builder Pro</h1>
        <p>Your AI-powered website builder is ready! Enter a prompt above and click "Generate Website" to create amazing websites instantly.</p>
        <button class="btn" onclick="alert('Preview is working perfectly! 🎉')">Test Preview</button>
        
        <div class="features">
            <div class="feature">
                <h3>🎨 AI-Powered</h3>
                <p>Describe your vision and let AI create it</p>
            </div>
            <div class="feature">
                <h3>⚡ Instant</h3>
                <p>Generate websites in seconds</p>
            </div>
            <div class="feature">
                <h3>📱 Responsive</h3>
                <p>Mobile-ready designs</p>
            </div>
        </div>
    </div>
</body>
</html>`;
    setEditorContent(sampleHTML);
    updatePreview(sampleHTML);
  } else {
    // If there's existing content, make sure preview is updated
    const existingContent = getEditorContent();
    updatePreview(existingContent);
  }
});

// Setup all event listeners
function setupEventListeners() {
  // Generate button
  generateBtn.addEventListener("click", generateHTML);

  // Use data attributes for button actions
  document.addEventListener('click', (e) => {
    // Handle quick prompt buttons
    if (e.target.classList.contains('quick-prompt-btn')) {
      const prompt = e.target.dataset.prompt;
      if (prompt && userPrompt) {
        userPrompt.value = prompt;
        userPrompt.focus();
        showNotification('Prompt loaded! Click Generate to create your website.', 'info');
      }
      return;
    }

    // Handle action buttons
    const actionElement = e.target.closest('[data-action]');
    if (!actionElement) return;
    
    const action = actionElement.dataset.action;
    console.log('Action clicked:', action); // Debug log
    
    switch(action) {
      case 'undo':
        undoEdit();
        break;
      case 'redo':
        redoEdit();
        break;
      case 'download':
        downloadHTML();
        break;
      case 'save':
        savePage();
        break;
      case 'delete':
        deletePage();
        break;
      case 'clear-api':
        clearAPIKey();
        break;
      case 'format':
        formatCode();
        break;
      case 'copy':
        copyCode();
        break;
      case 'refresh':
        refreshPreview();
        break;
      case 'fullscreen':
        fullscreenPreview();
        break;
      case 'combine-prompts':
        combinePrompts();
        break;
      case 'clear-prompts':
        clearAllPrompts();
        break;
      case 'save-prompt-template':
        savePromptTemplate();
        break;
      case 'toggle-theme':
        toggleEditorTheme();
        break;
      case 'toggle-wrap':
        toggleLineWrap();
        break;
      case 'test-preview':
        testPreviewSync();
        break;
      case 'about':
        showAboutModal();
        break;
      case 'close-about':
        hideAboutModal();
        break;
      default:
        console.log('Unknown action:', action);
    }
  });

  // Quick prompt buttons
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('quick-prompt-btn')) {
      const prompt = e.target.dataset.prompt;
      const refinement = e.target.dataset.refinement;
      
      if (prompt && userPrompt) {
        userPrompt.value = prompt;
        if (refinement && refinementPrompt) {
          refinementPrompt.value = refinement;
        }
        userPrompt.focus();
        showNotification('Prompt template loaded! Click Generate to create your website.', 'info');
        updatePromptStatus();
      }
    }
  });

  // Saved pages dropdown
  savedPages.addEventListener("change", loadSavedPage);

  // Navigation items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      // Remove active class from all nav items
      document.querySelectorAll('.nav-item').forEach(navItem => navItem.classList.remove('active'));
      // Add active class to clicked item
      item.classList.add('active');
      
      const action = item.dataset.action;
      if (action) {
        // Handle navigation actions
        switch(action) {
          case 'dashboard':
            showNotification('Dashboard - You are here!', 'info');
            break;
          case 'about':
            showAboutModal();
            break;
          case 'settings':
            showNotification('Settings - Feature coming soon!', 'info');
            break;
          case 'help':
            showNotification('Help - Feature coming soon!', 'info');
            break;
          default:
            showNotification(`${action} clicked - Feature coming soon!`, 'info');
        }
      }
      
      // Close mobile menu if open
      const navMenu = document.getElementById('navMenu');
      const navToggle = document.getElementById('navToggle');
      if (navMenu && navToggle) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
      }
    });
  });

  // Mobile navigation toggle
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('active') && 
          !navMenu.contains(e.target) && 
          !navToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
      }
    });
    
    // Close mobile menu on window resize if screen becomes larger
    window.addEventListener('resize', () => {
      if (window.innerWidth > 968) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
      }
    });
  }

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch(e.key) {
        case 's':
          e.preventDefault();
          savePage();
          break;
        case 'Enter':
          if (e.target === userPrompt || e.target === refinementPrompt) {
            e.preventDefault();
            generateHTML();
          }
          break;
        case 'k':
          if (e.shiftKey) {
            e.preventDefault();
            clearAllPrompts();
          }
          break;
        case 'j':
          if (e.shiftKey) {
            e.preventDefault();
            combinePrompts();
          }
          break;
      }
    }
  });
}

// Remove onclick attributes from HTML and use event listeners instead
function removeInlineHandlers() {
  // This will be called after DOM is loaded to clean up
  const elementsWithOnclick = document.querySelectorAll('[onclick]');
  elementsWithOnclick.forEach(element => {
    element.removeAttribute('onclick');
  });
}

// Preview Functions
function updatePreview(html) {
  console.log('updatePreview called with html length:', html ? html.length : 0); // Debug log
  
  if (!html || !html.trim()) {
    console.log('No HTML content, loading default'); // Debug log
    // Load default content instead of blank
    const defaultHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SmartAI Builder Preview</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f0fdf4;
            margin: 0;
            padding: 2rem;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: white;
            padding: 3rem;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 500px;
        }
        h1 { color: #333; margin-bottom: 1rem; }
        p { color: #666; line-height: 1.6; margin-bottom: 1rem; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 SmartAI Builder Pro</h1>
        <p>Ready to create! Enter your prompt and click "Generate Website".</p>
    </div>
</body>
</html>`;
    const blob = new Blob([defaultHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    preview.src = url;
    return;
  }
  
  try {
    // Clean up previous URL to prevent memory leaks
    if (preview.src && preview.src.startsWith('blob:')) {
      URL.revokeObjectURL(preview.src);
    }
    
    // Ensure we have proper HTML - if it doesn't start with <!DOCTYPE or <html, wrap it
    let processedHTML = html.trim();
    if (!processedHTML.toLowerCase().startsWith('<!doctype') && 
        !processedHTML.toLowerCase().startsWith('<html')) {
      processedHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Content</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #f0fdf4; }
    </style>
</head>
<body>
    ${processedHTML}
</body>
</html>`;
    }
    
    const blob = new Blob([processedHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    preview.src = url;
    console.log('Preview updated successfully'); // Debug log
  } catch (error) {
    console.error('Preview update error:', error);
    showNotification('Failed to update preview', 'error');
  }
}

function refreshPreview() {
  const content = getEditorContent();
  console.log('Manual refresh - content length:', content.length); // Debug log
  
  if (!content.trim()) {
    showNotification('No HTML content to preview', 'warning');
    // Load default content instead of leaving blank
    const defaultHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SmartAI Builder Preview</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f0fdf4;
            margin: 0;
            padding: 2rem;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .message {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 400px;
        }
        h2 { color: #333; margin-bottom: 1rem; }
        p { color: #666; line-height: 1.5; }
    </style>
</head>
<body>
    <div class="message">
        <h2>📝 No Content</h2>
        <p>Enter a prompt and click "Generate Website" to see your AI-created website here!</p>
    </div>
</body>
</html>`;
    updatePreview(defaultHTML);
    return;
  }
  
  updatePreview(content);
  showNotification('Preview refreshed', 'success');
}

function fullscreenPreview() {
  if (!getEditorContent().trim()) {
    showNotification('No HTML content to view in fullscreen', 'warning');
    return;
  }
  
  try {
    if (preview.requestFullscreen) {
      preview.requestFullscreen();
    } else if (preview.webkitRequestFullscreen) {
      preview.webkitRequestFullscreen();
    } else if (preview.mozRequestFullScreen) {
      preview.mozRequestFullScreen();
    } else if (preview.msRequestFullscreen) {
      preview.msRequestFullscreen();
    } else {
      showNotification('Fullscreen not supported in this browser', 'warning');
    }
  } catch (error) {
    console.error('Fullscreen error:', error);
    showNotification('Failed to enter fullscreen mode', 'error');
  }
}

// HTML Generation
async function generateHTML() {
  console.log('Generate button clicked'); // Debug log
  
  // Verify DOM elements are available
  if (!userPrompt || !generateBtn || !htmlOutput) {
    console.error('Required DOM elements not found');
    showNotification('Error: Required elements not found. Please refresh the page.', 'error');
    return;
  }
  
  const promptText = userPrompt.value.trim();
  const refinementText = refinementPrompt ? refinementPrompt.value.trim() : '';
  
  console.log('Main prompt:', promptText);
  console.log('Refinement prompt:', refinementText);
  
  if (!promptText) {
    showNotification('Please enter a description for your website', 'warning');
    userPrompt.focus();
    return;
  }

  // Combine prompts if both are present
  let combinedPrompt = promptText;
  if (refinementText) {
    combinedPrompt = `${promptText}\n\nAdditional requirements and refinements:\n${refinementText}`;
  }
  
  console.log('Combined prompt:', combinedPrompt);

  // Show loading state
  showLoading(true);
  generateBtn.disabled = true;
  generateBtn.classList.add('btn-loading');

  try {
    // Check for API key
    let apiKey = localStorage.getItem('openai_api_key');
    if (!apiKey) {
      showLoading(false);
      apiKey = prompt('Enter your OpenAI API key (this will be stored locally):');
      if (!apiKey) {
        throw new Error('No API key provided');
      }
      localStorage.setItem('openai_api_key', apiKey);
      updateAPIStatus();
      showLoading(true);
    }

    console.log('Making API request...');
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { 
            role: "system", 
            content: "You are a professional web developer. Create complete, modern, responsive HTML pages with inline CSS and JavaScript. Use modern design principles, proper semantic HTML, and include meta tags. Make the design visually appealing with gradients, shadows, and modern typography. Always include viewport meta tag and make it mobile-responsive. When additional requirements are provided, ensure you implement them precisely while maintaining good design practices."
          },
          { role: "user", content: combinedPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    console.log('API response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API request failed: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('API response received');
    
    const html = data.choices?.[0]?.message?.content || "<p>Error generating content.</p>";
    
    // Clean up the HTML if it has markdown code blocks
    const cleanedHtml = html.replace(/```html\n?|```\n?/g, '').trim();
    
    console.log('Setting HTML output...');
    setEditorContentWithHistory(cleanedHtml, true); // Clear history for new generated content
    updatePreview(cleanedHtml);
    showNotification('Website generated successfully! 🎉', 'success');

  } catch (error) {
    console.error('Generation Error:', error);
    handleGenerationError(error);
  } finally {
    showLoading(false);
    generateBtn.disabled = false;
    generateBtn.classList.remove('btn-loading');
  }
function handleGenerationError(error) {
  let message = 'Failed to generate website. ';
  
  if (error.message.includes('API request failed')) {
    message += 'Please check your API key and try again.';
  } else if (error.message.includes('No API key')) {
    message += 'API key is required.';
  } else {
    message += 'Using fallback template.';
  }

  showNotification(message, 'error');

  // Generate fallback HTML
  const fallbackHTML = generateFallbackHTML();
  setEditorContent(fallbackHTML);
  updatePreview(fallbackHTML);
}
}

function generateFallbackHTML() {
  const prompt = userPrompt.value.trim();
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Website</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 3rem;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            max-width: 600px;
        }
        h1 { 
            color: #333; 
            margin-bottom: 1rem;
            font-size: 2.5rem;
        }
        p { 
            color: #666; 
            line-height: 1.6;
            font-size: 1.1rem;
        }
        .prompt {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 10px;
            margin-top: 2rem;
            font-style: italic;
            border-left: 4px solid #667eea;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Website Template</h1>
        <p>This is a fallback template. For AI-generated content, please configure your OpenAI API key.</p>
        <div class="prompt">
            <strong>Your request:</strong> "${prompt || 'No description provided'}"
        </div>
    </div>
</body>
</html>`;
}

// File Operations
function downloadHTML() {
  const html = getEditorContent();
  if (!html.trim()) {
    showNotification('No HTML content to download', 'warning');
    return;
  }

  try {
    // Create a more descriptive filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
    const filename = `smartai-website-${timestamp}.html`;
    
    const blob = new Blob([html], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.style.display = 'none';
    
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    }, 100);
    
    showNotification(`HTML file "${filename}" downloaded successfully`, 'success');
  } catch (error) {
    console.error('Download error:', error);
    showNotification('Failed to download file. Please try again.', 'error');
  }
}

// Code Operations
function formatCode() {
  try {
    // Basic HTML formatting
    let html = getEditorContent();
    // Simple indentation (basic formatting)
    html = html.replace(/></g, '>\n<');
    html = html.replace(/^\s*\n/gm, '');
    
    const lines = html.split('\n');
    let formatted = '';
    let indent = 0;
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed) {
        if (trimmed.startsWith('</')) indent--;
        formatted += '  '.repeat(Math.max(0, indent)) + trimmed + '\n';
        if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>')) indent++;
      }
    });
    
    setEditorContent(formatted);
    updatePreview(formatted);
    showNotification('Code formatted', 'success');
  } catch (error) {
    showNotification('Failed to format code', 'error');
  }
}

function copyCode() {
  try {
    // Use modern clipboard API for CodeMirror content
    navigator.clipboard.writeText(getEditorContent()).then(() => {
      showNotification('Code copied to clipboard', 'success');
    }).catch(() => {
      // Fallback for older browsers
      if (codeEditor) {
        codeEditor.selectAll();
        document.execCommand('copy');
        showNotification('Code copied to clipboard', 'success');
      } else {
        htmlOutput.select();
        document.execCommand('copy');
        showNotification('Code copied to clipboard', 'success');
      }
    });
  } catch (error) {
    showNotification('Failed to copy code', 'error');
  }
}

// API Key Management
function clearAPIKey() {
  if (confirm('Are you sure you want to clear the stored API key?')) {
    localStorage.removeItem('openai_api_key');
    updateAPIStatus();
    showNotification('API key cleared', 'success');
  }
}

function updateAPIStatus() {
  const hasKey = localStorage.getItem('openai_api_key');
  if (apiStatus) {
    if (hasKey) {
      apiStatus.textContent = 'Configured';
      apiStatus.className = 'status-indicator status-success';
    } else {
      apiStatus.textContent = 'Not configured';
      apiStatus.className = 'status-indicator status-warning';
    }
  }
}

// Page Management
function savePage() {
  const html = getEditorContent();
  if (!html.trim()) {
    showNotification('No content to save', 'warning');
    return;
  }

  const name = prompt("Enter a name for this project:");
  if (!name) return;

  try {
    localStorage.setItem("smartai_page_" + name, html);
    updateSavedPages();
    showNotification(`Project "${name}" saved successfully`, 'success');
  } catch (error) {
    showNotification('Failed to save project', 'error');
  }
}

function loadSavedPage() {
  const name = savedPages.value;
  if (!name) return;

  try {
    const html = localStorage.getItem("smartai_page_" + name);
    if (html) {
      htmlOutput.value = html;
      setEditorContentWithHistory(html, true); // Clear history when loading saved content
      updatePreview(html);
      updatePreview(html);
      showNotification(`Project "${name}" loaded`, 'success');
    }
  } catch (error) {
    showNotification('Failed to load project', 'error');
  }
}

function deletePage() {
  const name = savedPages.value;
  if (!name) {
    showNotification('Please select a project to delete', 'warning');
    return;
  }

  if (confirm(`Are you sure you want to delete "${name}"?`)) {
    try {
      localStorage.removeItem("smartai_page_" + name);
      updateSavedPages();
      showNotification(`Project "${name}" deleted`, 'success');
    } catch (error) {
      showNotification('Failed to delete project', 'error');
    }
  }
}

function updateSavedPages() {
  if (!savedPages) return;
  
  savedPages.innerHTML = '<option value="">-- Select a project --</option>';
  
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("smartai_page_")) {
        const name = key.replace("smartai_page_", "");
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        savedPages.appendChild(option);
      }
    }
  } catch (error) {
    console.error('Error updating saved pages:', error);
  }
}

// Multi-Prompt Functions
function combinePrompts() {
  const mainPrompt = userPrompt.value.trim();
  const refinement = refinementPrompt.value.trim();
  
  if (!mainPrompt && !refinement) {
    showNotification('No prompts to combine', 'warning');
    return;
  }
  
  if (!mainPrompt) {
    userPrompt.value = refinement;
    refinementPrompt.value = '';
    showNotification('Refinement moved to main prompt', 'success');
    userPrompt.focus();
    return;
  }
  
  if (!refinement) {
    showNotification('No refinement prompt to combine', 'info');
    return;
  }
  
  // Combine both prompts into the main prompt
  const combinedPrompt = `${mainPrompt}\n\n${refinement}`;
  userPrompt.value = combinedPrompt;
  refinementPrompt.value = '';
  
  showNotification('Prompts combined successfully!', 'success');
  userPrompt.focus();
  updatePromptStatus();
}

function clearAllPrompts() {
  const hasContent = userPrompt.value.trim() || refinementPrompt.value.trim();
  
  if (!hasContent) {
    showNotification('Prompts are already empty', 'info');
    return;
  }
  
  if (confirm('Are you sure you want to clear all prompts?')) {
    userPrompt.value = '';
    refinementPrompt.value = '';
    showNotification('All prompts cleared', 'success');
    userPrompt.focus();
    updatePromptStatus();
  }
}

function savePromptTemplate() {
  const mainPrompt = userPrompt.value.trim();
  const refinement = refinementPrompt.value.trim();
  
  if (!mainPrompt && !refinement) {
    showNotification('No prompts to save', 'warning');
    return;
  }
  
  const templateName = prompt('Enter a name for this prompt template:');
  if (!templateName) {
    return;
  }
  
  // Clean template name for storage
  const cleanName = templateName.replace(/[^a-zA-Z0-9_\- ]/g, '').trim();
  if (!cleanName) {
    showNotification('Invalid template name', 'error');
    return;
  }
  
  try {
    const template = {
      name: cleanName,
      mainPrompt: mainPrompt,
      refinementPrompt: refinement,
      created: new Date().toISOString()
    };
    
    localStorage.setItem(`smartai_template_${cleanName}`, JSON.stringify(template));
    showNotification(`Template "${cleanName}" saved successfully!`, 'success');
    
    // Update UI to show available templates
    updatePromptTemplates();
  } catch (error) {
    console.error('Error saving template:', error);
    showNotification('Failed to save template', 'error');
  }
}

function updatePromptTemplates() {
  // Create template selector if it doesn't exist
  let templateSelector = document.getElementById('promptTemplateSelector');
  if (!templateSelector) {
    const promptSuggestions = document.querySelector('.prompt-suggestions');
    if (promptSuggestions) {
      const templateContainer = document.createElement('div');
      templateContainer.className = 'template-selector';
      templateContainer.innerHTML = `
        <label for="promptTemplateSelector">Load Template:</label>
        <select id="promptTemplateSelector">
          <option value="">-- Select a template --</option>
        </select>
        <button type="button" class="btn btn-sm btn-outline" data-action="load-template">
          <i class="fas fa-upload"></i>
          Load
        </button>
        <button type="button" class="btn btn-sm btn-danger" data-action="delete-template">
          <i class="fas fa-trash"></i>
          Delete
        </button>
      `;
      promptSuggestions.parentNode.insertBefore(templateContainer, promptSuggestions.nextSibling);
      templateSelector = document.getElementById('promptTemplateSelector');
      
      // Add event listeners for template actions
      document.addEventListener('click', (e) => {
        if (e.target.dataset.action === 'load-template') {
          loadPromptTemplate();
        } else if (e.target.dataset.action === 'delete-template') {
          deletePromptTemplate();
        }
      });
    }
  }
  
  if (templateSelector) {
    // Clear existing options except the first one
    templateSelector.innerHTML = '<option value="">-- Select a template --</option>';
    
    // Add saved templates
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('smartai_template_')) {
          const templateName = key.replace('smartai_template_', '');
          const option = document.createElement('option');
          option.value = templateName;
          option.textContent = templateName;
          templateSelector.appendChild(option);
        }
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  }
}

function loadPromptTemplate() {
  const templateSelector = document.getElementById('promptTemplateSelector');
  if (!templateSelector || !templateSelector.value) {
    showNotification('Please select a template to load', 'warning');
    return;
  }
  
  try {
    const templateData = localStorage.getItem(`smartai_template_${templateSelector.value}`);
    if (!templateData) {
      showNotification('Template not found', 'error');
      return;
    }
    
    const template = JSON.parse(templateData);
    userPrompt.value = template.mainPrompt || '';
    refinementPrompt.value = template.refinementPrompt || '';
    
    showNotification(`Template "${template.name}" loaded successfully!`, 'success');
    userPrompt.focus();
    updatePromptStatus();
  } catch (error) {
    console.error('Error loading template:', error);
    showNotification('Failed to load template', 'error');
  }
}

function deletePromptTemplate() {
  const templateSelector = document.getElementById('promptTemplateSelector');
  if (!templateSelector || !templateSelector.value) {
    showNotification('Please select a template to delete', 'warning');
    return;
  }
  
  const templateName = templateSelector.value;
  if (confirm(`Are you sure you want to delete the template "${templateName}"?`)) {
    try {
      localStorage.removeItem(`smartai_template_${templateName}`);
      showNotification(`Template "${templateName}" deleted successfully!`, 'success');
      updatePromptTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      showNotification('Failed to delete template', 'error');
    }
  }
}

// Add scroll effect to navbar
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  const currentScrollY = window.scrollY;
  
  if (navbar) {
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      // Scrolling down
      navbar.style.transform = 'translateY(-100%)';
    } else {
      // Scrolling up or at top
      navbar.style.transform = 'translateY(0)';
    }
    
    // Add glass effect when scrolled
    if (currentScrollY > 50) {
      navbar.style.backdropFilter = 'blur(25px)';
      navbar.style.background = 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(51, 65, 85, 0.95) 100%)';
    } else {
      navbar.style.backdropFilter = 'blur(20px)';
      navbar.style.background = 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)';
    }
  }
  
  lastScrollY = currentScrollY;
});

// Add navbar transition
document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    navbar.style.transition = 'all 0.3s ease';
  }
});

// Clear undo/redo history (useful when loading new content)
function clearEditHistory() {
  if (codeEditor) {
    codeEditor.clearHistory();
    updateUndoRedoButtons();
    console.log('Edit history cleared');
  }
}

// Enhanced setEditorContent that preserves or clears history as needed
function setEditorContentWithHistory(content, clearHistory = false) {
  if (codeEditor) {
    if (clearHistory) {
      // Set content and clear history for new documents
      codeEditor.setValue(content);
      codeEditor.clearHistory();
    } else {
      // Set content preserving history for edits
      codeEditor.setValue(content);
    }
    updateUndoRedoButtons();
  } else {
    htmlOutput.value = content;
  }
}

// Update prompt status based on content
function updatePromptStatus() {
  const statusElement = document.querySelector('.prompt-status');
  const statusText = document.getElementById('promptStatusText');
  
  if (!statusElement || !statusText) return;
  
  const mainPrompt = userPrompt.value.trim();
  const refinement = refinementPrompt.value.trim();
  
  // Remove all status classes
  statusElement.classList.remove('success', 'warning');
  
  if (!mainPrompt && !refinement) {
    statusText.innerHTML = '<i class="fas fa-info-circle"></i> Ready to create - enter your prompts above';
  } else if (mainPrompt && !refinement) {
    statusElement.classList.add('success');
    statusText.innerHTML = '<i class="fas fa-check-circle"></i> Main prompt ready - add refinements for more control';
  } else if (!mainPrompt && refinement) {
    statusElement.classList.add('warning');
    statusText.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Add a main prompt to describe your website structure';
  } else {
    statusElement.classList.add('success');
    statusText.innerHTML = '<i class="fas fa-star"></i> Multi-prompt ready - both prompts will be combined for generation';
  }
}

// Undo functionality
function undoEdit() {
  if (codeEditor) {
    const undoCount = codeEditor.historySize().undo;
    if (undoCount > 0) {
      codeEditor.undo();
      showNotification(`Undo applied (${undoCount - 1} remaining)`, 'success');
      // Update preview after undo
      updatePreview(codeEditor.getValue());
    } else {
      showNotification('Nothing to undo', 'info');
    }
  } else if (htmlOutput) {
    // Fallback for textarea - basic undo using browser's built-in
    document.execCommand('undo');
    showNotification('Undo applied', 'success');
    updatePreview(htmlOutput.value);
  } else {
    showNotification('Editor not available', 'error');
  }
}

// Redo functionality
function redoEdit() {
  if (codeEditor) {
    const redoCount = codeEditor.historySize().redo;
    if (redoCount > 0) {
      codeEditor.redo();
      showNotification(`Redo applied (${redoCount - 1} remaining)`, 'success');
      // Update preview after redo
      updatePreview(codeEditor.getValue());
    } else {
      showNotification('Nothing to redo', 'info');
    }
  } else if (htmlOutput) {
    // Fallback for textarea - basic redo using browser's built-in
    document.execCommand('redo');
    showNotification('Redo applied', 'success');
    updatePreview(htmlOutput.value);
  } else {
    showNotification('Editor not available', 'error');
  }
}

// Get undo/redo status for UI updates
function getUndoRedoStatus() {
  if (codeEditor) {
    const history = codeEditor.historySize();
    return {
      canUndo: history.undo > 0,
      canRedo: history.redo > 0,
      undoCount: history.undo,
      redoCount: history.redo
    };
  }
  return {
    canUndo: false,
    canRedo: false,
    undoCount: 0,
    redoCount: 0
  };
}

// Update undo/redo button states
function updateUndoRedoButtons() {
  const status = getUndoRedoStatus();
  const undoBtn = document.querySelector('[data-action="undo"]');
  const redoBtn = document.querySelector('[data-action="redo"]');
  
  if (undoBtn) {
    undoBtn.disabled = !status.canUndo;
    undoBtn.style.opacity = status.canUndo ? '1' : '0.5';
    undoBtn.title = status.canUndo ? 
      `Undo (Ctrl+Z) - ${status.undoCount} actions available` : 
      'Undo (Ctrl+Z) - Nothing to undo';
  }
  
  if (redoBtn) {
    redoBtn.disabled = !status.canRedo;
    redoBtn.style.opacity = status.canRedo ? '1' : '0.5';
    redoBtn.title = status.canRedo ? 
      `Redo (Ctrl+Y) - ${status.redoCount} actions available` : 
      'Redo (Ctrl+Y) - Nothing to redo';
  }
}

// About Modal Functions
function showAboutModal() {
  const modal = document.getElementById('aboutModal');
  if (modal) {
    modal.classList.add('show');
    modal.style.display = 'flex';
    
    // Add escape key listener
    document.addEventListener('keydown', handleModalEscape);
    
    // Add click outside to close
    modal.addEventListener('click', handleModalClickOutside);
    
    showNotification('About modal opened', 'info');
  }
}

function hideAboutModal() {
  const modal = document.getElementById('aboutModal');
  if (modal) {
    modal.classList.remove('show');
    
    // Fade out animation
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300);
    
    // Remove event listeners
    document.removeEventListener('keydown', handleModalEscape);
    modal.removeEventListener('click', handleModalClickOutside);
  }
}

function handleModalEscape(e) {
  if (e.key === 'Escape') {
    hideAboutModal();
  }
}

function handleModalClickOutside(e) {
  const modal = document.getElementById('aboutModal');
  if (e.target === modal) {
    hideAboutModal();
  }
}

// UI Helper Functions
function showLoading(show) {
  if (loadingOverlay) {
    loadingOverlay.style.display = show ? 'flex' : 'none';
  }
}

function showNotification(message, type = 'info') {
  try {
    // Fallback if document.body is not available
    if (!document.body) {
      console.log(`Notification (${type}): ${message}`);
      return;
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <span>${message}</span>
      <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  } catch (error) {
    console.error('Error showing notification:', error);
    console.log(`Notification (${type}): ${message}`);
  }
}

// Utility Functions
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

// Focus the code editor
function focusEditor() {
  if (codeEditor) {
    codeEditor.focus();
    codeEditor.refresh();
  } else if (htmlOutput) {
    htmlOutput.focus();
  }
}

// Ensure editor is clickable and editable
function setupEditorInteractivity() {
  const editorContainer = document.getElementById('htmlEditorContainer');
  if (editorContainer) {
    editorContainer.addEventListener('click', () => {
      focusEditor();
    });
  }
  
  // Add a fallback in case CodeMirror doesn't load
  if (!codeEditor && htmlOutput) {
    console.log('Setting up textarea fallback'); // Debug log
    htmlOutput.style.display = 'block';
    htmlOutput.readOnly = false;
    
    // Remove any existing listeners to avoid duplicates
    htmlOutput.removeEventListener('input', handleTextareaInput);
    htmlOutput.addEventListener('input', handleTextareaInput);
  }
}

// Handle textarea input for fallback
function handleTextareaInput() {
  console.log('Textarea input detected'); // Debug log
  updatePreview(htmlOutput.value);
}

// Initialize CodeMirror Editor
function initializeCodeEditor() {
  try {
    if (typeof CodeMirror === 'undefined') {
      console.warn('CodeMirror not loaded, using fallback textarea');
      return;
    }

    const editorContainer = document.getElementById('htmlEditorContainer');
    if (!editorContainer) {
      console.error('Editor container not found');
      return;
    }

    // Initialize CodeMirror
    codeEditor = CodeMirror.fromTextArea(htmlOutput, {
      mode: 'htmlmixed',
      theme: 'default',
      lineNumbers: true,
      lineWrapping: false,
      autoCloseTags: true,
      matchBrackets: true,
      indentUnit: 2,
      tabSize: 2,
      indentWithTabs: false,
      styleActiveLine: true,
      foldGutter: true,
      readOnly: false, // Explicitly set to editable
      cursorBlinkRate: 530, // Standard cursor blink rate
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
      extraKeys: {
        'Ctrl-Z': 'undo',
        'Ctrl-Y': 'redo',
        'Ctrl-Shift-Z': 'redo', // Alternative redo shortcut
        'Ctrl-Space': 'autocomplete',
        'Ctrl-/': 'toggleComment',
        'Ctrl-F': 'findPersistent',
        'Ctrl-S': function(cm) {
          // Prevent default browser save, trigger our save
          savePage();
          return false;
        },
        'F11': function(cm) {
          cm.setOption('fullScreen', !cm.getOption('fullScreen'));
        },
        'Esc': function(cm) {
          if (cm.getOption('fullScreen')) cm.setOption('fullScreen', false);
        }
      }
    });

    // Set initial content
    const sampleHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sample Page</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 2rem;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: white;
            padding: 3rem;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 500px;
        }
        h1 { color: #333; margin-bottom: 1rem; }
        p { color: #666; line-height: 1.6; }
        .btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            margin-top: 1rem;
            font-size: 16px;
        }
        .btn:hover { transform: translateY(-2px); }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Welcome to SmartAI Builder</h1>
        <p>This is sample content to test the enhanced code editor with syntax highlighting!</p>
        <button class="btn" onclick="alert('Button clicked!')">Click Me</button>
    </div>
</body>
</html>`;

    codeEditor.setValue(sampleHTML);
    
    // Ensure editor is editable and responsive
    codeEditor.refresh();
    codeEditor.focus();
    
    // Setup change listener for live preview with immediate and debounced updates
    let timeoutId = null;
    
    codeEditor.on('change', (cm, changeObj) => {
      console.log('CodeMirror content changed'); // Debug log
      const content = codeEditor.getValue();
      
      // Update undo/redo button states
      updateUndoRedoButtons();
      
      // Clear existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      // Immediate update for small changes
      if (content.length < 1000) {
        updatePreview(content);
      } else {
        // Debounced update for larger content
        timeoutId = setTimeout(() => {
          updatePreview(content);
        }, 500);
      }
    });

    // Also listen for paste events
    codeEditor.on('inputRead', (cm, changeObj) => {
      if (changeObj.origin === 'paste') {
        console.log('Paste detected, updating preview'); // Debug log
        updatePreview(codeMirror.getValue());
      }
    });

    // Add click listener to ensure editor is focusable
    codeEditor.on('focus', () => {
      console.log('Code editor focused');
    });
    
    // Add cursor activity for better interaction
    codeEditor.on('cursorActivity', () => {
      // Editor is active and ready for input
    });

    // Update preview with initial content
    updatePreview(sampleHTML);

    // Setup editor interactivity
    setupEditorInteractivity();
    
    // Initialize undo/redo button states
    updateUndoRedoButtons();

    console.log('CodeMirror editor initialized and ready for editing');
  } catch (error) {
    console.error('Error initializing CodeMirror:', error);
    console.log('Falling back to textarea');
    
    // Show the original textarea as fallback
    htmlOutput.style.display = 'block';
    htmlOutput.readOnly = false;
    htmlOutput.style.height = '400px';
    htmlOutput.style.fontFamily = 'monospace';
    htmlOutput.style.fontSize = '14px';
    
    // Setup fallback functionality
    setupEditorInteractivity();
  }
}

// Get current editor content (works with both CodeMirror and textarea)
function getEditorContent() {
  if (codeEditor) {
    return codeEditor.getValue();
  }
  return htmlOutput.value;
}

// Set editor content (works with both CodeMirror and textarea)
function setEditorContent(content) {
  if (codeEditor) {
    codeEditor.setValue(content);
  } else {
    htmlOutput.value = content;
  }
}

// Toggle editor theme
function toggleEditorTheme() {
  if (!codeEditor) {
    showNotification('Code editor not available', 'warning');
    return;
  }
  
  const currentTheme = codeEditor.getOption('theme');
  const newTheme = currentTheme === 'material-darker' ? 'default' : 'material-darker';
  codeEditor.setOption('theme', newTheme);
  
  showNotification(`Switched to ${newTheme === 'material-darker' ? 'dark' : 'light'} theme`, 'success');
}

// Toggle line wrapping
function toggleLineWrap() {
  if (!codeEditor) {
    showNotification('Code editor not available', 'warning');
    return;
  }
  
  const currentWrap = codeEditor.getOption('lineWrapping');
  codeEditor.setOption('lineWrapping', !currentWrap);
  
  showNotification(`Line wrapping ${!currentWrap ? 'enabled' : 'disabled'}`, 'success');
}

// Test preview synchronization
function testPreviewSync() {
  console.log('Testing preview sync...');
  
  if (codeEditor) {
    console.log('CodeMirror editor detected');
    const content = codeEditor.getValue();
    console.log('Current editor content length:', content.length);
    
    // Test by adding a simple test div
    const testContent = content + '\n<!-- Test comment added at ' + new Date().toLocaleTimeString() + ' -->';
    codeEditor.setValue(testContent);
    
    // Force update preview
    updatePreview(testContent);
    showNotification('Preview sync test completed - check console for details', 'info');
  } else {
    console.log('Using textarea fallback');
    const content = htmlOutput.value;
    console.log('Current textarea content length:', content.length);
    
    const testContent = content + '\n<!-- Test comment added at ' + new Date().toLocaleTimeString() + ' -->';
    htmlOutput.value = testContent;
    
    updatePreview(testContent);
    showNotification('Preview sync test completed (textarea mode)', 'info');
  }
}

// Responsive preview handling
function handlePreviewResize() {
  const preview = document.getElementById('preview');
  const previewContainer = document.querySelector('.preview-container');
  
  if (preview && previewContainer) {
    // Ensure iframe maintains proper dimensions
    const containerRect = previewContainer.getBoundingClientRect();
    preview.style.width = '100%';
    preview.style.height = '100%';
    
    // Add responsive class based on container size
    if (containerRect.width < 400) {
      previewContainer.classList.add('preview-mobile');
    } else {
      previewContainer.classList.remove('preview-mobile');
    }
  }
}

// Add window resize listener for preview responsiveness
window.addEventListener('resize', debounce(handlePreviewResize, 250));

// Call on initialization
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(handlePreviewResize, 100);
});

// Export functions for global access (if needed)
window.WebAIBuilder = {
  generateHTML,
  downloadHTML,
  savePage,
  loadSavedPage,
  deletePage,
  clearAPIKey,
  formatCode,
  copyCode,
  refreshPreview,
  fullscreenPreview
};
