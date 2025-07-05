// Emergency fix for broken preview
// Run this in browser console to reset the preview

function fixPreview() {
  const preview = document.getElementById('preview');
  const htmlOutput = document.getElementById('htmlOutput');
  
  // Reset preview iframe
  if (preview) {
    preview.src = 'about:blank';
    
    // Add sample HTML
    const sampleHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SmartAI Builder Preview</title>
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
        p { color: #666; line-height: 1.6; margin-bottom: 1rem; }
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
        .btn:hover { transform: translateY(-2px); }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 SmartAI Builder Pro</h1>
        <p>Preview is working! Enter a prompt and click "Generate Website" to create your custom website.</p>
        <button class="btn" onclick="alert('Preview is working perfectly!')">Test Button</button>
    </div>
</body>
</html>`;

    // Set content in editor if it exists
    if (htmlOutput) {
      htmlOutput.value = sampleHTML;
    }

    // Update preview
    const blob = new Blob([sampleHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    preview.src = url;
    
    console.log('Preview has been fixed!');
    return true;
  }
  return false;
}

// Auto-run the fix
fixPreview();
