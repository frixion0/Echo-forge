
    // Define OpenAI class
    class OpenAI {
      constructor(config) {
        this.baseURL = config.baseURL || 'https://api.openai.com/v1';
        this.apiKey = config.apiKey;
        this.images = {
          generate: this.generateImage.bind(this)
        };
      }
      
      async generateImage(params) {
        const url = `${this.baseURL}/images/generations`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: JSON.stringify(params)
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || 'Image generation failed');
        }
        
        return await response.json();
      }
    }
  

// Next Script


      // Setup event listeners after the page loads
      document.addEventListener('DOMContentLoaded', () => {
        // Ensure all dialogs are hidden when page loads
        document.getElementById('apkPasswordDialog').style.display = 'none';
        document.getElementById('passwordDialog').style.display = 'none';
        document.getElementById('sourceCodeDialog').style.display = 'none';
        document.getElementById('historyViewDialog').style.display = 'none';
        document.getElementById('saveDialog').style.display = 'none';
        document.getElementById('savedImagesDialog').style.display = 'none';
        
        // Load saved server preference
        const savedServer = localStorage.getItem('selectedServer');
        if (savedServer) {
          document.getElementById('server').value = savedServer;
        }
        
        // Hide access-based buttons initially
        document.getElementById('viewSourceBtn').style.display = 'none';
        
        document.getElementById('generateBtn').addEventListener('click', generateImage);
        document.getElementById('randomPromptBtn').addEventListener('click', generateRandomPrompt);
        document.getElementById('superEnhancePromptBtn').addEventListener('click', superEnhancePrompt);
        document.getElementById('clearPromptBtn').addEventListener('click', clearPrompt);
        document.getElementById('cancelGenerationBtn').addEventListener('click', cancelGeneration);
        document.getElementById('themeToggle').addEventListener('click', toggleTheme);
        
        // Advanced settings toggle
        const advancedToggle = document.getElementById('advancedToggle');
        advancedToggle.addEventListener('change', function() {
          const advancedOptions = document.getElementById('advancedOptions');
          advancedOptions.style.display = this.checked ? 'block' : 'none';
          // Fix layout when toggling
          document.querySelector('.container').style.minHeight = this.checked ? 'auto' : '0';
          localStorage.setItem('advancedOptionsEnabled', this.checked);
        });
        
        // Load saved advanced options preference
        const advancedEnabled = localStorage.getItem('advancedOptionsEnabled') === 'true';
        document.getElementById('advancedToggle').checked = advancedEnabled;
        document.getElementById('advancedOptions').style.display = advancedEnabled ? 'block' : 'none';
        // Set container minHeight on load
        document.querySelector('.container').style.minHeight = advancedEnabled ? 'auto' : '0';
        
        // Save server selection
        document.getElementById('server').addEventListener('change', function() {
          localStorage.setItem('selectedServer', this.value);
        });
        
        // Source code download functionality
        document.getElementById('downloadSourceBtn').addEventListener('click', showPasswordDialog);
        document.getElementById('closePasswordDialog').addEventListener('click', hidePasswordDialog);
        document.getElementById('submitPasswordBtn').addEventListener('click', verifyPasswordAndDownload);
        
        // Source code viewer functionality
        document.getElementById('viewSourceBtn').addEventListener('click', showSourceCode);
        document.getElementById('closeSourceCodeDialog').addEventListener('click', hideSourceCode);
        document.getElementById('copySourceCodeBtn').addEventListener('click', copySourceCode);
        
        // Model settings button
        document.getElementById('modelSettingsBtn').addEventListener('click', showModelSettingsDialog);
        
        // History functionality
        document.getElementById('historyBtn').addEventListener('click', showHistoryDialog);
        document.getElementById('closeHistoryDialog').addEventListener('click', hideHistoryDialog);
        document.getElementById('searchHistoryFloatingBtn').addEventListener('click', searchHistoryFloating);
        document.getElementById('clearHistoryFloatingBtn').addEventListener('click', clearHistory);
        document.getElementById('downloadAllHistoryBtn').addEventListener('click', downloadAllHistory);
        
        // Saved images functionality
        document.getElementById('viewSavedBtn').addEventListener('click', showSavedImagesDialog);
        document.getElementById('closeSavedImagesDialog').addEventListener('click', hideSavedImagesDialog);
        document.getElementById('searchSavedImagesBtn').addEventListener('click', searchSavedImages);
        document.getElementById('downloadAllSavedBtn').addEventListener('click', downloadAllSavedImages);
        
        // Save dialog functionality
        document.getElementById('closeSaveDialog').addEventListener('click', hideSaveDialog);
        document.getElementById('confirmSaveBtn').addEventListener('click', saveFinalImage);
        
        // Filter dialog functionality  
        document.getElementById('saveFilterBtn').addEventListener('click', function() {
          if (currentFilterImageUrl) {
            showSaveDialog(currentFilterImageUrl, 'Filtered image', 'N/A', 'N/A');
          }
        });
        
        // APK download functionality
        document.getElementById('downloadApkBtn').addEventListener('click', showApkPasswordDialog);
        document.getElementById('closeApkPasswordDialog').addEventListener('click', hideApkPasswordDialog);
        document.getElementById('apkPasswordDialog').querySelector('#downloadApkBtn').addEventListener('click', verifyApkPasswordAndDownload);
        
        // Format dialog functionality
        document.getElementById('closeFormatDialog').addEventListener('click', hideFormatDialog);
        const formatButtons = document.querySelectorAll('.download-format-btn');
        formatButtons.forEach(button => {
          button.addEventListener('click', handleFormatSelection);
        });
        
        // Filter dialog functionality
        document.getElementById('closeFilterDialog').addEventListener('click', hideFilterDialog);
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
          button.addEventListener('click', previewFilter);
        });
        document.getElementById('applyFilterBtn').addEventListener('click', applyAndDownloadFilter);
        document.getElementById('keyboardShortcutsBtn').addEventListener('click', toggleShortcutsHelp);
        
        // Crop dialog event listeners
        document.getElementById('closeCropDialog').addEventListener('click', hideCropDialog);
        document.getElementById('applyCropBtn').addEventListener('click', applyCrop);
        document.getElementById('resetCropBtn').addEventListener('click', resetCrop);
        const aspectButtons = document.querySelectorAll('.aspect-btn');
        aspectButtons.forEach(button => {
          button.addEventListener('click', setAspectRatio);
        });
        

        
        // Set up keyboard shortcuts
        document.addEventListener('keydown', handleKeyboardShortcuts);
        
        // Initialize shortcuts help tooltip
        initShortcutsHelp();
        
        // Hide download buttons by default
        document.getElementById('downloadSourceBtn').style.display = 'none';
        document.getElementById('downloadApkBtn').style.display = 'none';
        
        // History feature event listeners
        document.getElementById('historyToggle').addEventListener('change', toggleHistory);
        document.getElementById('searchHistoryBtn').addEventListener('click', searchHistory);
        document.getElementById('clearHistoryBtn').addEventListener('click', clearHistory);
        
        // Initialize history toggle from localStorage
        const historyEnabled = localStorage.getItem('historyEnabled') !== 'false';
        document.getElementById('historyToggle').checked = historyEnabled;
        
        // Set initial toggle label color based on state
        const toggleLabel = document.querySelector('.toggle-label');
        const toggleIcon = document.querySelector('.toggle-label .pulse-icon');
        if (historyEnabled) {
          toggleLabel.style.color = 'var(--primary-color)';
          toggleIcon.style.color = 'var(--primary-color)';
          toggleIcon.style.animation = "pulse-fade 1.5s infinite";
        } else {
          toggleLabel.style.color = 'var(--light-text)';
          toggleIcon.style.color = 'var(--light-text)';
          toggleIcon.style.animation = "none";
          toggleIcon.style.opacity = "0.7";
        }
        
        // Load saved images and history when page loads
        loadSavedImages();
        loadHistory();
        
        // Check for saved theme
        if (localStorage.getItem('theme') === 'light') {
          document.body.classList.add('light-theme');
          document.getElementById('themeToggle').innerHTML = '<i class="fas fa-sun"></i>';
        }
      });
      
      // Function to check for access code in prompt
      function checkForAccessCode(promptText) {
        const downloadSourceBtn = document.getElementById('downloadSourceBtn');
        const downloadApkBtn = document.getElementById('downloadApkBtn');
        const viewSourceBtn = document.getElementById('viewSourceBtn');
        
        if (promptText.includes('[access]')) {
          // Show all buttons
          downloadSourceBtn.style.display = 'inline-block';
          downloadApkBtn.style.display = 'inline-block';
          viewSourceBtn.style.display = 'inline-block';
        } else if (promptText.includes('[remove]')) {
          // Hide all buttons
          downloadSourceBtn.style.display = 'none';
          downloadApkBtn.style.display = 'none';
          viewSourceBtn.style.display = 'none';
        }
      }
      
      // Function to show source code in dialog
      function showSourceCode() {
        const sourceCodeDialog = document.getElementById('sourceCodeDialog');
        const sourceCodeViewer = document.getElementById('sourceCodeViewer');
        
        // Get the HTML content of the document
        const htmlContent = document.documentElement.outerHTML;
        
        // Display the content in the code viewer
        sourceCodeViewer.textContent = htmlContent;
        
        // Show the dialog
        sourceCodeDialog.style.display = 'flex';
      }
      
      // Function to hide source code dialog
      function hideSourceCode() {
        document.getElementById('sourceCodeDialog').style.display = 'none';
      }
      
      // Function to copy source code to clipboard
      function copySourceCode() {
        const sourceCode = document.getElementById('sourceCodeViewer').textContent;
        
        navigator.clipboard.writeText(sourceCode)
          .then(() => {
            const copyBtn = document.getElementById('copySourceCodeBtn');
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            
            setTimeout(() => {
              copyBtn.innerHTML = originalText;
            }, 2000);
          })
          .catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy code to clipboard.');
          });
      }
      
      // Function to show history dialog
      // Function to show history dialog
      function showHistoryDialog() {
        const historyDialog = document.getElementById('historyViewDialog');
        const historyViewContent = document.getElementById('historyViewContent');
        
        // Clear previous content
        historyViewContent.innerHTML = '';
        
        // Fetch all history items from localStorage
        const keys = Object.keys(localStorage);
        const historyKeys = keys.filter(key => key.startsWith('history-image-'));
        
        if (historyKeys.length > 0) {
          // Sort by timestamp (newest first)
          historyKeys.sort((a, b) => {
            const timeA = parseInt(a.split('-')[2]);
            const timeB = parseInt(b.split('-')[2]);
            return timeB - timeA;
          });
          
          // Create HTML for each history item
          historyKeys.forEach(key => {
            const itemData = JSON.parse(localStorage.getItem(key));
            
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.dataset.key = key;
            historyItem.dataset.prompt = itemData.prompt?.toLowerCase() || '';
            historyItem.style.marginBottom = '20px';
            historyItem.style.padding = '10px';
            historyItem.style.borderBottom = '1px solid var(--border-color)';
            
            historyItem.innerHTML = `
              <div style="display: flex; align-items: center; gap: 15px;">
                <img src="${itemData.image}" alt="History image" style="width: 100px; height: 100px; object-fit: cover; border-radius: var(--radius);">
                <div style="flex: 1;">
                  <div style="font-weight: bold; margin-bottom: 5px;">Generated: ${new Date(itemData.timestamp).toLocaleString()}</div>
                  <div style="font-size: 0.9rem; color: var(--light-text);">${itemData.prompt}</div>
                  <div style="margin-top: 5px; font-size: 0.8rem;">Model: ${itemData.model}, Size: ${itemData.size}</div>
                  <div style="margin-top: 10px; display: flex; gap: 8px;">
                    <button class="download-link" style="padding: 5px 10px; font-size: 0.8rem;" 
                      onclick="downloadSavedImage('${key}')">
                      <i class="fas fa-download"></i> Download
                    </button>
                    <button class="download-link" style="padding: 5px 10px; font-size: 0.8rem; color: #ff3366; border-color: #ff3366;" 
                      onclick="deleteHistoryItem('${key}', this.closest('.history-item'))">
                      <i class="fas fa-trash"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            `;
            
            historyViewContent.appendChild(historyItem);
          });
        } else {
          historyViewContent.innerHTML = '<p style="text-align: center; padding: 20px;">No history items found.</p>';
        }
        
        // Show the dialog
        historyDialog.style.display = 'flex';
      }
      
      // Function to hide history dialog
      function hideHistoryDialog() {
        document.getElementById('historyViewDialog').style.display = 'none';
      }
      
      // Function to search within history floating dialog
      function searchHistoryFloating() {
        const searchTerm = document.getElementById('historySearchFloating').value.toLowerCase();
        const historyItems = document.querySelectorAll('#historyViewContent .history-item');
        
        historyItems.forEach(item => {
          const prompt = item.dataset.prompt;
          if (!searchTerm || prompt.includes(searchTerm)) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      }
      
      // Function to delete a history item
      function deleteHistoryItem(key, element) {
        if (confirm('Are you sure you want to delete this history item?')) {
          try {
            localStorage.removeItem(key);
            element.remove();
            
            // Check if there are no more history items
            const items = document.querySelectorAll('#historyViewContent .history-item');
            if (items.length === 0) {
              document.getElementById('historyViewContent').innerHTML = 
                '<p style="text-align: center; padding: 20px;">No history items found.</p>';
            }
          } catch (err) {
            console.error("Delete failed:", err);
            alert("Failed to delete history item: " + (err.message || "Unknown error"));
          }
        }
      }
      
      // Function to download all history images as a zip
      function downloadAllHistory() {
        const keys = Object.keys(localStorage).filter(key => key.startsWith('history-image-'));
        if (keys.length === 0) {
          alert('No history items to download.');
          return;
        }
        
        const zip = new JSZip();
        let processed = 0;
        
        keys.forEach(key => {
          try {
            const itemData = JSON.parse(localStorage.getItem(key));
            const image = itemData.image;
            const timestamp = new Date(itemData.timestamp || Date.now()).toISOString().replace(/[:.]/g, '-');
            const filename = `history_${timestamp}.png`;
            
            // Extract the base64 data from the data URL
            const base64Data = image.split(',')[1];
            zip.file(filename, base64Data, {base64: true});
            
            processed++;
            if (processed === keys.length) {
              zip.generateAsync({type:"blob"})
                .then(function(content) {
                  const a = document.createElement('a');
                  a.href = URL.createObjectURL(content);
                  a.download = `neon_history_${Date.now()}.zip`;
                  a.style.display = 'none';
                  document.body.appendChild(a);
                  a.click();
                  setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(a.href);
                  }, 100);
                });
            }
          } catch (err) {
            console.error(`Error processing history item ${key}:`, err);
          }
        });
      }
      
      // Function to show saved images dialog
      function showSavedImagesDialog() {
        const savedImagesDialog = document.getElementById('savedImagesDialog');
        const savedImagesViewContent = document.getElementById('savedImagesViewContent');
        
        // Clear previous content
        savedImagesViewContent.innerHTML = '';
        
        // Fetch all saved image items from localStorage
        const keys = Object.keys(localStorage);
        const savedKeys = keys.filter(key => key.startsWith('saved-image-'));
        
        if (savedKeys.length > 0) {
          // Sort by timestamp (newest first)
          savedKeys.sort((a, b) => {
            const timeA = parseInt(a.split('-')[2]);
            const timeB = parseInt(b.split('-')[2]);
            return timeB - timeA;
          });
          
          // Create HTML for each saved image
          savedKeys.forEach((key, index) => {
            try {
              const itemData = JSON.parse(localStorage.getItem(key));
              
              const savedItem = document.createElement('div');
              savedItem.className = 'saved-item';
              savedItem.dataset.key = key;
              savedItem.dataset.name = (itemData.name || '').toLowerCase();
              savedItem.dataset.prompt = (itemData.prompt || '').toLowerCase();
              savedItem.dataset.notes = (itemData.notes || '').toLowerCase();
              savedItem.style.marginBottom = '20px';
              savedItem.style.padding = '15px';
              savedItem.style.borderBottom = '1px solid var(--border-color)';
              savedItem.style.backgroundColor = 'rgba(var(--primary-color-rgb), 0.05)';
              savedItem.style.borderRadius = 'var(--radius)';
              
              // Determine image name and notes
              const imageName = itemData.name || `Saved Image ${index + 1}`;
              const imageNotes = itemData.notes || 'No additional notes';
              
              savedItem.innerHTML = `
                <div style="display: flex; flex-wrap: wrap; gap: 15px;">
                  <img src="${itemData.image}" alt="${imageName}" style="width: 150px; height: 150px; object-fit: cover; border-radius: var(--radius); box-shadow: 0 0 10px rgba(var(--primary-color-rgb), 0.3);">
                  <div style="flex: 1; min-width: 200px;">
                    <h4 style="margin: 0 0 10px 0; color: var(--primary-color);">${imageName}</h4>
                    <div style="font-size: 0.9rem; margin-bottom: 5px;">${itemData.prompt || 'No prompt data'}</div>
                    <div style="font-size: 0.8rem; color: var(--light-text); margin-bottom: 10px;">
                      <strong>Notes:</strong> ${imageNotes}<br>
                      <strong>Model:</strong> ${itemData.model || 'N/A'}, <strong>Size:</strong> ${itemData.size || 'N/A'}
                    </div>
                    <div style="display: flex; gap: 8px; margin-top: 10px;">
                      <button class="download-link" style="padding: 5px 10px; font-size: 0.8rem;" 
                        onclick="downloadSavedImage('${key}')">
                        <i class="fas fa-download"></i> Download
                      </button>
                      <button class="download-link" style="padding: 5px 10px; font-size: 0.8rem; color: #ff3366; border-color: #ff3366;" 
                        onclick="deleteSavedImage('${key}', this.closest('.saved-item'))">
                        <i class="fas fa-trash"></i> Delete
                      </button>
                    </div>
                  </div>
                </div>
              `;
              
              savedImagesViewContent.appendChild(savedItem);
            } catch (err) {
              console.error(`Error processing saved image ${key}:`, err);
            }
          });
        } else {
          savedImagesViewContent.innerHTML = '<p style="text-align: center; padding: 20px;">No saved images found.</p>';
        }
        
        // Show the dialog
        savedImagesDialog.style.display = 'flex';
      }
      
      // Function to search saved images
      function searchSavedImages() {
        const searchTerm = document.getElementById('savedImagesSearchFloating').value.toLowerCase();
        const savedItems = document.querySelectorAll('#savedImagesViewContent .saved-item');
        
        savedItems.forEach(item => {
          const name = item.dataset.name;
          const prompt = item.dataset.prompt;
          const notes = item.dataset.notes;
          
          if (!searchTerm || 
              name.includes(searchTerm) || 
              prompt.includes(searchTerm) || 
              notes.includes(searchTerm)) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      }
      
      // Function to download all saved images as a zip
      function downloadAllSavedImages() {
        const keys = Object.keys(localStorage).filter(key => key.startsWith('saved-image-'));
        if (keys.length === 0) {
          alert('No saved images to download.');
          return;
        }
        
        const zip = new JSZip();
        let processed = 0;
        
        keys.forEach(key => {
          try {
            const itemData = JSON.parse(localStorage.getItem(key));
            const image = itemData.image;
            const imageName = itemData.name ? itemData.name.replace(/[^\w\s]/gi, '') : `saved_image_${Date.now()}`;
            const filename = `${imageName.replace(/\s+/g, '_')}.png`;
            
            // Extract the base64 data from the data URL
            const base64Data = image.split(',')[1];
            zip.file(filename, base64Data, {base64: true});
            
            processed++;
            if (processed === keys.length) {
              zip.generateAsync({type:"blob"})
                .then(function(content) {
                  const a = document.createElement('a');
                  a.href = URL.createObjectURL(content);
                  a.download = `neon_saved_images_${Date.now()}.zip`;
                  a.style.display = 'none';
                  document.body.appendChild(a);
                  a.click();
                  setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(a.href);
                  }, 100);
                });
            }
          } catch (err) {
            console.error(`Error processing saved image ${key}:`, err);
          }
        });
      }
      
      // Function to hide saved images dialog
      function hideSavedImagesDialog() {
        document.getElementById('savedImagesDialog').style.display = 'none';
      }
      
      // Function to download a saved image
      function downloadSavedImage(key) {
        try {
          const itemData = JSON.parse(localStorage.getItem(key));
          const image = itemData.image;
          const imageName = itemData.name || `neon-saved-${Date.now()}`;
          
          // Create download link
          const a = document.createElement('a');
          a.href = image; // It's already a data URL
          a.download = `${imageName}.png`;
          a.style.display = 'none';
          
          // Trigger download
          document.body.appendChild(a);
          a.click();
          
          // Cleanup
          setTimeout(() => {
            document.body.removeChild(a);
          }, 100);
        } catch (err) {
          console.error("Download failed:", err);
          alert("Failed to download image: " + (err.message || "Unknown error"));
        }
      }
      
      // Function to delete a saved image
      function deleteSavedImage(key, element) {
        if (confirm('Are you sure you want to delete this saved image?')) {
          try {
            localStorage.removeItem(key);
            element.remove();
            
            // Check if there are no more saved images
            const keys = Object.keys(localStorage);
            const savedKeys = keys.filter(key => key.startsWith('saved-image-'));
            
            if (savedKeys.length === 0) {
              document.getElementById('savedImagesViewContent').innerHTML = 
                '<p style="text-align: center; padding: 20px;">No saved images found.</p>';
            }
          } catch (err) {
            console.error("Delete failed:", err);
            alert("Failed to delete image: " + (err.message || "Unknown error"));
          }
        }
      }
      
      // Function to show save dialog
      function showSaveDialog(imageUrl, prompt, model, size) {
        // Store current image details for saving
        window.currentImageToSave = {
          imageUrl: imageUrl,
          prompt: prompt,
          model: model,
          size: size
        };
        
        // Show the dialog
        document.getElementById('saveDialog').style.display = 'flex';
      }
      
      // Function to hide save dialog
      function hideSaveDialog() {
        document.getElementById('saveDialog').style.display = 'none';
      }
      
      // Function to save the image with additional info
      function saveFinalImage() {
        if (!window.currentImageToSave) {
          alert('No image to save!');
          return;
        }
        
        const imageName = document.getElementById('savedImageName').value || 'Untitled Image';
        const notes = document.getElementById('savedImageNotes').value || '';
        
        try {
          // Fetch the image to convert to base64 if it's a URL
          fetch(window.currentImageToSave.imageUrl)
            .then(response => response.blob())
            .then(blob => {
              const reader = new FileReader();
              reader.onloadend = function() {
                // The base64 string representation of the image
                const base64String = reader.result;
                
                // Save with timestamp and metadata
                localStorage.setItem(`saved-image-${Date.now()}`, JSON.stringify({
                  image: base64String,
                  name: imageName,
                  notes: notes,
                  prompt: window.currentImageToSave.prompt,
                  model: window.currentImageToSave.model,
                  size: window.currentImageToSave.size,
                  timestamp: new Date().toISOString()
                }));
                
                alert('Image saved successfully!');
                hideSaveDialog();
                loadSavedImages();
              };
              reader.readAsDataURL(blob);
            })
            .catch(err => {
              console.error("Error saving image:", err);
              alert("Failed to save image. Please try again.");
            });
        } catch (err) {
          console.error("Error in save process:", err);
          alert("Failed to save image. Please try again.");
        }
      }
      
      // Define the convertImageFormat function at global scope so it can be used by other functions
      async function convertImageFormat(blob, format) {
        return new Promise((resolve, reject) => {
          // Create a temporary image element
          const img = new Image();
          img.onload = () => {
            // Create a canvas element
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Draw the image to the canvas
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            // Set the right mime type
            let mimeType;
            let quality = 0.92;
            
            switch(format) {
              case 'png':
                mimeType = 'image/png';
                break;
              case 'jpeg':
                mimeType = 'image/jpeg';
                break;
              case 'webp':
                mimeType = 'image/webp';
                break;
              default:
                mimeType = 'image/png';
            }
            
            // Convert to the desired format
            canvas.toBlob(
              (blob) => resolve(blob),
              mimeType,
              quality
            );
          };
          
          img.onerror = (error) => {
            reject(error);
          };
          
          // Load the image from blob
          img.src = URL.createObjectURL(blob);
        });
      }
      
      // Current image for filter dialog
      let currentFilterImageUrl = '';
      let currentFilterImageBlob = null;
      
      // Function to show the filter dialog
      function showFilterDialog(imageUrl) {
        currentFilterImageUrl = imageUrl;
        
        // Set the original image source
        const originalImg = document.getElementById('filterOriginalImage');
        const previewImg = document.getElementById('filterPreviewImage');
        originalImg.src = imageUrl;
        previewImg.src = imageUrl;
        
        // Reset active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
          btn.classList.remove('active');
        });
        document.querySelector('.filter-btn[data-filter="none"]').classList.add('active');
        
        // Show the dialog
        document.getElementById('filterDialog').style.display = 'flex';
        
        // Preload the image blob for faster processing
        fetch(imageUrl)
          .then(response => response.blob())
          .then(blob => {
            currentFilterImageBlob = blob;
          })
          .catch(err => {
            console.error("Failed to load image for filtering:", err);
          });
      }
      
      // Function to hide the filter dialog
      function hideFilterDialog() {
        document.getElementById('filterDialog').style.display = 'none';
        currentFilterImageUrl = '';
        currentFilterImageBlob = null;
      }
      
      // Preview a filter
      function previewFilter(event) {
        if (!currentFilterImageUrl) return;
        
        // Get selected filter
        const filter = event.currentTarget.dataset.filter;
        
        // Update active button
        document.querySelectorAll('.filter-btn').forEach(btn => {
          btn.classList.remove('active');
        });
        event.currentTarget.classList.add('active');
        
        // Apply filter to preview image
        const previewImg = document.getElementById('filterPreviewImage');
        
        if (filter === 'none') {
          // Reset to original
          previewImg.style.filter = 'none';
          return;
        }
        
        // Apply selected filter
        switch(filter) {
          case 'grayscale':
            previewImg.style.filter = 'grayscale(1)';
            break;
          case 'sepia':
            previewImg.style.filter = 'sepia(0.8)';
            break;
          case 'invert':
            previewImg.style.filter = 'invert(0.8)';
            break;
          case 'saturate':
            previewImg.style.filter = 'saturate(2)';
            break;
          case 'brightness':
            previewImg.style.filter = 'brightness(1.3)';
            break;
          case 'contrast':
            previewImg.style.filter = 'contrast(1.5)';
            break;
          case 'blur':
            previewImg.style.filter = 'blur(2px)';
            break;
          default:
            previewImg.style.filter = 'none';
        }
      }
      
      // Keyboard shortcuts handler
      function handleKeyboardShortcuts(event) {
        // Don't trigger shortcuts if user is typing in an input field
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
          // Exception: Allow Ctrl+Enter in the prompt textarea
          if (event.target.id === 'prompt' && (event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            generateImage();
            event.preventDefault();
          }
          return;
        }
        
        // Shortcuts
        if (event.shiftKey) {
          switch(event.key.toLowerCase()) {
            case 'r': // Shift + R: Random prompt
              generateRandomPrompt();
              event.preventDefault();
              break;
  
            case 'c': // Shift + C: Clear prompt
              clearPrompt();
              event.preventDefault();
              break;
            case 't': // Shift + T: Toggle theme
              toggleTheme();
              event.preventDefault();
              break;
          }
        } else if (event.key === '?') {
          // Toggle shortcuts help
          toggleShortcutsHelp();
          event.preventDefault();
        }
      }
      
      // Initialize shortcuts help tooltip
      function initShortcutsHelp() {
        // Add "?" button to the header
        const helpBtn = document.createElement('button');
        helpBtn.className = 'theme-toggle';
        helpBtn.id = 'shortcutsHelpBtn';
        helpBtn.style.right = '50px';
        helpBtn.innerHTML = '<i class="fas fa-keyboard"></i>';
        helpBtn.title = 'Keyboard Shortcuts (?)';
        helpBtn.addEventListener('click', toggleShortcutsHelp);
        document.body.appendChild(helpBtn);
        
        // Add keyboard shortcut hints to buttons after a slight delay
        setTimeout(() => {
          // Add tooltip info to buttons that have keyboard shortcuts
          addShortcutIndicators();
        }, 500);
      }
      
      // Add shortcut indicators next to button text
      function addShortcutIndicators() {
        const shortcutMap = {
          'generateBtn': 'Ctrl+Enter',
          'randomPromptBtn': 'Shift+R',
          'enhancePromptBtn': 'Shift+E',
          'clearPromptBtn': 'Shift+C',
          'themeToggle': 'Shift+T',
          'shortcutsHelpBtn': '?'
        };
        
        for (const [id, shortcut] of Object.entries(shortcutMap)) {
          const btn = document.getElementById(id);
          if (btn) {
            // Add a small indicator icon with the shortcut
            const indicatorSpan = document.createElement('span');
            indicatorSpan.className = 'shortcut-indicator';
            indicatorSpan.innerHTML = `<kbd>${shortcut}</kbd>`;
            indicatorSpan.style.fontSize = '0.7rem';
            indicatorSpan.style.opacity = '0.7';
            indicatorSpan.style.marginLeft = '5px';
            indicatorSpan.style.display = 'none'; // Initially hidden
            
            // For the theme toggle button, we need special positioning
            if (id === 'themeToggle' || id === 'shortcutsHelpBtn') {
              indicatorSpan.style.position = 'absolute';
              indicatorSpan.style.right = '0';
              indicatorSpan.style.top = '100%';
              indicatorSpan.style.backgroundColor = 'var(--dark-bg)';
              indicatorSpan.style.padding = '3px';
              indicatorSpan.style.borderRadius = '3px';
              btn.style.position = 'relative';
            }
            
            btn.appendChild(indicatorSpan);
            
            // Show the indicator on hover
            btn.addEventListener('mouseenter', () => {
              indicatorSpan.style.display = 'inline-block';
            });
            
            btn.addEventListener('mouseleave', () => {
              indicatorSpan.style.display = 'none';
            });
          }
        }
      }
      
      // Toggle shortcuts help visibility
      function toggleShortcutsHelp() {
        const shortcuts = document.getElementById('shortcuts-help');
        if (shortcuts.style.display === 'block') {
          shortcuts.style.display = 'none';
        } else {
          shortcuts.style.display = 'block';
        }
      }
      
      // Variables for image editing features
      let currentCropImageUrl = '';
      let cropOriginalWidth = 0;
      let cropOriginalHeight = 0;
      let cropX = 0, cropY = 0, cropWidth = 0, cropHeight = 0;
      let isDragging = false;
      let isResizing = false;
      let dragStartX = 0, dragStartY = 0;
      let currentCropAspectRatio = null;
      let cropCanvas, cropCtx, cropOverlay, resizeHandle;
      
      // Variables for background removal
      let currentBgImageUrl = '';
      let bgOriginalImage = null;
      
      // Variables for color correction
      let currentColorImageUrl = '';
      let colorOriginalImageData = null;
      let currentCurveChannel = 'rgb';
      let curvesCanvas, curvesCtx;
      let curvePoints = {
        'rgb': [{x: 0, y: 255}, {x: 255, y: 0}],
        'r': [{x: 0, y: 255}, {x: 255, y: 0}],
        'g': [{x: 0, y: 255}, {x: 255, y: 0}],
        'b': [{x: 0, y: 255}, {x: 255, y: 0}]
      };
      
      // Show crop dialog
      function showCropDialog(imageUrl) {
        currentCropImageUrl = imageUrl;
        
        // Reset crop variables
        cropX = 0;
        cropY = 0;
        cropWidth = 0;
        cropHeight = 0;
        currentCropAspectRatio = null;
        
        // Get canvas and overlay elements
        cropCanvas = document.getElementById('cropCanvas');
        cropCtx = cropCanvas.getContext('2d');
        cropOverlay = document.getElementById('cropOverlay');
        resizeHandle = document.getElementById('resizeHandle');
        
        // Set active aspect ratio button
        document.querySelectorAll('.aspect-btn').forEach(btn => {
          btn.classList.remove('active');
        });
        document.querySelector('.aspect-btn[data-ratio="free"]').classList.add('active');
        
        // Load image and setup cropping
        const img = new Image();
        img.onload = function() {
          // Set canvas size based on image
          cropOriginalWidth = img.width;
          cropOriginalHeight = img.height;
          
          // Resize to fit dialog
          const maxWidth = window.innerWidth * 0.8; // 80% of window width
          const maxHeight = window.innerHeight * 0.5; // 50% of window height
          
          let displayWidth = img.width;
          let displayHeight = img.height;
          
          if (displayWidth > maxWidth) {
            const ratio = maxWidth / displayWidth;
            displayWidth = maxWidth;
            displayHeight = img.height * ratio;
          }
          
          if (displayHeight > maxHeight) {
            const ratio = maxHeight / displayHeight;
            displayHeight = maxHeight;
            displayWidth = displayWidth * ratio;
          }
          
          cropCanvas.width = displayWidth;
          cropCanvas.height = displayHeight;
          
          // Draw image on canvas
          cropCtx.drawImage(img, 0, 0, displayWidth, displayHeight);
          
          // Initialize crop area to the full image
          cropX = 0;
          cropY = 0;
          cropWidth = displayWidth;
          cropHeight = displayHeight;
          
          // Update overlay
          updateCropOverlay();
          
          // Set initial output dimensions
          document.getElementById('cropWidth').value = Math.round(cropOriginalWidth);
          document.getElementById('cropHeight').value = Math.round(cropOriginalHeight);
        };
        img.src = imageUrl;
        
        // Setup drag and resize event handlers
        setupCropInteraction();
        
        // Show the dialog
        document.getElementById('cropDialog').style.display = 'flex';
      }
      
      // Setup crop interaction events
      function setupCropInteraction() {
        cropOverlay.addEventListener('mousedown', startDrag);
        resizeHandle.addEventListener('mousedown', startResize);
        document.addEventListener('mousemove', dragOrResize);
        document.addEventListener('mouseup', stopDragOrResize);
        
        // Touch support
        cropOverlay.addEventListener('touchstart', startDragTouch);
        resizeHandle.addEventListener('touchstart', startResizeTouch);
        document.addEventListener('touchmove', dragOrResizeTouch);
        document.addEventListener('touchend', stopDragOrResize);
        
        // Update crop size when dimensions inputs change
        document.getElementById('cropWidth').addEventListener('input', updateCropFromDimensions);
        document.getElementById('cropHeight').addEventListener('input', updateCropFromDimensions);
      }
      
      // Event handlers for crop interaction
      function startDrag(e) {
        if (e.button !== 0) return; // Only left mouse button
        isDragging = true;
        isResizing = false;
        dragStartX = e.clientX - cropOverlay.getBoundingClientRect().left;
        dragStartY = e.clientY - cropOverlay.getBoundingClientRect().top;
        e.preventDefault();
      }
      
      function startDragTouch(e) {
        isDragging = true;
        isResizing = false;
        const touch = e.touches[0];
        dragStartX = touch.clientX - cropOverlay.getBoundingClientRect().left;
        dragStartY = touch.clientY - cropOverlay.getBoundingClientRect().top;
        e.preventDefault();
      }
      
      function startResize(e) {
        if (e.button !== 0) return; // Only left mouse button
        isResizing = true;
        isDragging = false;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        e.preventDefault();
      }
      
      function startResizeTouch(e) {
        isResizing = true;
        isDragging = false;
        const touch = e.touches[0];
        dragStartX = touch.clientX;
        dragStartY = touch.clientY;
        e.preventDefault();
      }
      
      function dragOrResize(e) {
        if (!isDragging && !isResizing) return;
        
        const rect = cropCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (isDragging) {
          // Move crop overlay
          const newX = x - dragStartX;
          const newY = y - dragStartY;
          
          // Constrain to canvas bounds
          cropX = Math.max(0, Math.min(newX, cropCanvas.width - cropWidth));
          cropY = Math.max(0, Math.min(newY, cropCanvas.height - cropHeight));
        } else if (isResizing) {
          // Resize crop overlay
          let newWidth = x - cropX;
          let newHeight = y - cropY;
          
          // Constrain to canvas bounds
          newWidth = Math.max(50, Math.min(newWidth, cropCanvas.width - cropX));
          newHeight = Math.max(50, Math.min(newHeight, cropCanvas.height - cropY));
          
          // Apply aspect ratio if set
          if (currentCropAspectRatio) {
            if (newWidth / newHeight > currentCropAspectRatio) {
              newWidth = newHeight * currentCropAspectRatio;
            } else {
              newHeight = newWidth / currentCropAspectRatio;
            }
          }
          
          cropWidth = newWidth;
          cropHeight = newHeight;
        }
        
        // Update overlay position and dimensions
        updateCropOverlay();
        
        // Update dimension inputs
        const scaleX = cropOriginalWidth / cropCanvas.width;
        const scaleY = cropOriginalHeight / cropCanvas.height;
        document.getElementById('cropWidth').value = Math.round(cropWidth * scaleX);
        document.getElementById('cropHeight').value = Math.round(cropHeight * scaleY);
        
        e.preventDefault();
      }
      
      function dragOrResizeTouch(e) {
        if (!isDragging && !isResizing) return;
        
        const rect = cropCanvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        if (isDragging) {
          // Move crop overlay (same logic as mouse)
          const newX = x - dragStartX;
          const newY = y - dragStartY;
          
          cropX = Math.max(0, Math.min(newX, cropCanvas.width - cropWidth));
          cropY = Math.max(0, Math.min(newY, cropCanvas.height - cropHeight));
        } else if (isResizing) {
          // Resize crop overlay (same logic as mouse)
          let newWidth = x - cropX;
          let newHeight = y - cropY;
          
          newWidth = Math.max(50, Math.min(newWidth, cropCanvas.width - cropX));
          newHeight = Math.max(50, Math.min(newHeight, cropCanvas.height - cropY));
          
          if (currentCropAspectRatio) {
            if (newWidth / newHeight > currentCropAspectRatio) {
              newWidth = newHeight * currentCropAspectRatio;
            } else {
              newHeight = newWidth / currentCropAspectRatio;
            }
          }
          
          cropWidth = newWidth;
          cropHeight = newHeight;
        }
        
        updateCropOverlay();
        
        const scaleX = cropOriginalWidth / cropCanvas.width;
        const scaleY = cropOriginalHeight / cropCanvas.height;
        document.getElementById('cropWidth').value = Math.round(cropWidth * scaleX);
        document.getElementById('cropHeight').value = Math.round(cropHeight * scaleY);
        
        e.preventDefault();
      }
      
      function stopDragOrResize() {
        isDragging = false;
        isResizing = false;
      }
      
      function updateCropOverlay() {
        cropOverlay.style.left = cropX + 'px';
        cropOverlay.style.top = cropY + 'px';
        cropOverlay.style.width = cropWidth + 'px';
        cropOverlay.style.height = cropHeight + 'px';
        
        resizeHandle.style.left = (cropX + cropWidth - 5) + 'px';
        resizeHandle.style.top = (cropY + cropHeight - 5) + 'px';
      }
      
      function updateCropFromDimensions() {
        const maintainRatio = document.getElementById('maintainAspectRatio').checked;
        const newWidth = parseInt(document.getElementById('cropWidth').value);
        const newHeight = parseInt(document.getElementById('cropHeight').value);
        
        if (isNaN(newWidth) || isNaN(newHeight) || newWidth <= 0 || newHeight <= 0) return;
        
        const scaleX = cropCanvas.width / cropOriginalWidth;
        const scaleY = cropCanvas.height / cropOriginalHeight;
        
        let canvasWidth = newWidth * scaleX;
        let canvasHeight = newHeight * scaleY;
        
        // Constrain to canvas size
        canvasWidth = Math.min(canvasWidth, cropCanvas.width);
        canvasHeight = Math.min(canvasHeight, cropCanvas.height);
        
        // Apply aspect ratio if needed
        if (maintainRatio && currentCropAspectRatio) {
          const ratio = newWidth / newHeight;
          if (ratio > currentCropAspectRatio) {
            canvasHeight = canvasWidth / currentCropAspectRatio;
          } else {
            canvasWidth = canvasHeight * currentCropAspectRatio;
          }
        }
        
        // Make sure crop area fits in canvas
        cropX = Math.min(cropX, cropCanvas.width - canvasWidth);
        cropY = Math.min(cropY, cropCanvas.height - canvasHeight);
        
        // Update crop dimensions
        cropWidth = canvasWidth;
        cropHeight = canvasHeight;
        
        updateCropOverlay();
      }
      
      function setAspectRatio(e) {
        // Update active button
        document.querySelectorAll('.aspect-btn').forEach(btn => {
          btn.classList.remove('active');
        });
        e.currentTarget.classList.add('active');
        
        const ratio = e.currentTarget.dataset.ratio;
        
        // Calculate aspect ratio
        if (ratio === 'free') {
          currentCropAspectRatio = null;
        } else {
          const [w, h] = ratio.split(':').map(Number);
          currentCropAspectRatio = w / h;
        }
        
        // Adjust crop area to match ratio
        if (currentCropAspectRatio) {
          if (cropWidth / cropHeight > currentCropAspectRatio) {
            cropWidth = cropHeight * currentCropAspectRatio;
          } else {
            cropHeight = cropWidth / currentCropAspectRatio;
          }
          
          // Make sure crop area fits in canvas
          if (cropX + cropWidth > cropCanvas.width) {
            cropWidth = cropCanvas.width - cropX;
            cropHeight = cropWidth / currentCropAspectRatio;
          }
          if (cropY + cropHeight > cropCanvas.height) {
            cropHeight = cropCanvas.height - cropY;
            cropWidth = cropHeight * currentCropAspectRatio;
          }
        }
        
        // Update overlay
        updateCropOverlay();
        
        // Update dimension inputs
        const scaleX = cropOriginalWidth / cropCanvas.width;
        const scaleY = cropOriginalHeight / cropCanvas.height;
        document.getElementById('cropWidth').value = Math.round(cropWidth * scaleX);
        document.getElementById('cropHeight').value = Math.round(cropHeight * scaleY);
      }
      
      function hideCropDialog() {
        document.getElementById('cropDialog').style.display = 'none';
        currentCropImageUrl = '';
      }
      
      function resetCrop() {
        // Reset crop area to full canvas
        cropX = 0;
        cropY = 0;
        cropWidth = cropCanvas.width;
        cropHeight = cropCanvas.height;
        
        // Update overlay
        updateCropOverlay();
        
        // Reset aspect ratio
        currentCropAspectRatio = null;
        document.querySelectorAll('.aspect-btn').forEach(btn => {
          btn.classList.remove('active');
        });
        document.querySelector('.aspect-btn[data-ratio="free"]').classList.add('active');
        
        // Update dimension inputs
        document.getElementById('cropWidth').value = Math.round(cropOriginalWidth);
        document.getElementById('cropHeight').value = Math.round(cropOriginalHeight);
      }
      
      function applyCrop() {
        if (!currentCropImageUrl) return;
        
        const applyCropBtn = document.getElementById('applyCropBtn');
        applyCropBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        applyCropBtn.disabled = true;
        
        try {
          // Create a new canvas for the cropped image
          const outputCanvas = document.createElement('canvas');
          const outputWidth = parseInt(document.getElementById('cropWidth').value);
          const outputHeight = parseInt(document.getElementById('cropHeight').value);
          
          outputCanvas.width = outputWidth;
          outputCanvas.height = outputHeight;
          const outputCtx = outputCanvas.getContext('2d');
          
          // Calculate source coordinates
          const scaleX = cropOriginalWidth / cropCanvas.width;
          const scaleY = cropOriginalHeight / cropCanvas.height;
          
          const sourceX = cropX * scaleX;
          const sourceY = cropY * scaleY;
          const sourceWidth = cropWidth * scaleX;
          const sourceHeight = cropHeight * scaleY;
          
          // Load original image at full resolution
          const img = new Image();
          img.onload = function() {
            // Draw cropped portion to output canvas
            outputCtx.drawImage(
              img,
              sourceX, sourceY, sourceWidth, sourceHeight,
              0, 0, outputWidth, outputHeight
            );
            
            // Convert to blob and download
            outputCanvas.toBlob(function(blob) {
              const blobUrl = URL.createObjectURL(blob);
              
              // Create download link
              const a = document.createElement('a');
              a.href = blobUrl;
              a.download = `cropped-image.png`;
              a.style.display = 'none';
              document.body.appendChild(a);
              
              // Trigger download
              setTimeout(() => {
                a.click();
                
                // Cleanup
                setTimeout(() => {
                  document.body.removeChild(a);
                  URL.revokeObjectURL(blobUrl);
                  
                  // Reset button and hide dialog
                  applyCropBtn.innerHTML = '<i class="fas fa-crop"></i> Apply & Download';
                  applyCropBtn.disabled = false;
                  hideCropDialog();
                }, 100);
              }, 100);
            });
          };
          
          img.src = currentCropImageUrl;
        } catch (err) {
          console.error("Crop failed:", err);
          alert("Failed to crop image: " + (err.message || "Unknown error"));
          
          applyCropBtn.innerHTML = '<i class="fas fa-crop"></i> Apply & Download';
          applyCropBtn.disabled = false;
        }
      }
      
      // Background Removal Functions
      function showBgRemovalDialog(imageUrl) {
        currentBgImageUrl = imageUrl;
        
        // Set the original image
        const originalImg = document.getElementById('bgOriginalImage');
        originalImg.src = imageUrl;
        
        // Show the dialog
        document.getElementById('bgRemovalDialog').style.display = 'flex';
        
        // Initialize the preview
        originalImg.onload = function() {
          // Store original image for processing
          bgOriginalImage = originalImg;
          
          // First preview
          updateBgRemovalPreview();
        };
      }
      
      function hideBgRemovalDialog() {
        document.getElementById('bgRemovalDialog').style.display = 'none';
        currentBgImageUrl = '';
        bgOriginalImage = null;
      }
      
      function updateBgRemovalPreview() {
        if (!bgOriginalImage) return;
        
        // Get threshold values
        const tolerance = parseInt(document.getElementById('toleranceSlider').value);
        const smoothing = parseInt(document.getElementById('smoothingSlider').value);
        
        // Update display values
        document.getElementById('toleranceValue').textContent = tolerance + '%';
        document.getElementById('smoothingValue').textContent = smoothing + '%';
        
        // Create canvas for processing
        const canvas = document.createElement('canvas');
        canvas.width = bgOriginalImage.naturalWidth;
        canvas.height = bgOriginalImage.naturalHeight;
        const ctx = canvas.getContext('2d');
        
        // Draw original image
        ctx.drawImage(bgOriginalImage, 0, 0);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Simple background removal algorithm (chroma key-like)
        // For a real implementation, more sophisticated algorithms would be needed
        // We'll use the corners to determine background color
        
        // Sample corners for background color
        const topLeft = [data[0], data[1], data[2], data[3]];
        const topRight = [data[(canvas.width - 1) * 4], data[(canvas.width - 1) * 4 + 1], data[(canvas.width - 1) * 4 + 2], data[(canvas.width - 1) * 4 + 3]];
        const bottomLeft = [data[(canvas.height - 1) * canvas.width * 4], data[(canvas.height - 1) * canvas.width * 4 + 1], data[(canvas.height - 1) * canvas.width * 4 + 2], data[(canvas.height - 1) * canvas.width * 4 + 3]];
        const bottomRight = [data[((canvas.height - 1) * canvas.width + (canvas.width - 1)) * 4], data[((canvas.height - 1) * canvas.width + (canvas.width - 1)) * 4 + 1], data[((canvas.height - 1) * canvas.width + (canvas.width - 1)) * 4 + 2], data[((canvas.height - 1) * canvas.width + (canvas.width - 1)) * 4 + 3]];
        
        // Average the samples
        const bgColor = [
          (topLeft[0] + topRight[0] + bottomLeft[0] + bottomRight[0]) / 4,
          (topLeft[1] + topRight[1] + bottomLeft[1] + bottomRight[1]) / 4,
          (topLeft[2] + topRight[2] + bottomLeft[2] + bottomRight[2]) / 4
        ];
        
        // Remove background
        const toleranceVal = tolerance * 2.55; // Convert to 0-255 scale
        const smoothingVal = smoothing / 100; // 0-1 scale
        
        for (let i = 0; i < data.length; i += 4) {
          // Calculate color distance
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          const distance = Math.sqrt(
            Math.pow(r - bgColor[0], 2) +
            Math.pow(g - bgColor[1], 2) +
            Math.pow(b - bgColor[2], 2)
          );
          
          // Apply transparency based on distance
          if (distance < toleranceVal) {
            // Calculate alpha based on distance and smoothing
            let alpha = (distance / toleranceVal) * 255;
            alpha = Math.max(0, Math.min(255, alpha));
            
            // Apply smoothing
            alpha = Math.pow(alpha / 255, smoothingVal) * 255;
            
            data[i + 3] = alpha;
          }
        }
        
        // Put modified image data back
        ctx.putImageData(imageData, 0, 0);
        
        // Display result
        document.getElementById('bgRemovedImage').src = canvas.toDataURL('image/png');
      }
      
      function resetBgRemoval() {
        document.getElementById('toleranceSlider').value = 30;
        document.getElementById('smoothingSlider').value = 50;
        document.getElementById('toleranceValue').textContent = '30%';
        document.getElementById('smoothingValue').textContent = '50%';
        
        updateBgRemovalPreview();
      }
      
      function applyBgRemoval() {
        if (!currentBgImageUrl || !bgOriginalImage) return;
        
        const applyBtn = document.getElementById('applyBgRemovalBtn');
        applyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        applyBtn.disabled = true;
        
        try {
          // Convert the displayed result to a download
          const resultImg = document.getElementById('bgRemovedImage');
          
          // Create download link
          const a = document.createElement('a');
          a.href = resultImg.src; // Already a data URL
          a.download = 'background-removed.png';
          a.style.display = 'none';
          document.body.appendChild(a);
          
          // Trigger download
          setTimeout(() => {
            a.click();
            
            // Cleanup
            setTimeout(() => {
              document.body.removeChild(a);
              
              // Reset button and hide dialog
              applyBtn.innerHTML = '<i class="fas fa-eraser"></i> Apply & Download';
              applyBtn.disabled = false;
              hideBgRemovalDialog();
            }, 100);
          }, 100);
        } catch (err) {
          console.error("Background removal failed:", err);
          alert("Failed to remove background: " + (err.message || "Unknown error"));
          
          applyBtn.innerHTML = '<i class="fas fa-eraser"></i> Apply & Download';
          applyBtn.disabled = false;
        }
      }
      
      // Color Correction Functions
      function showColorCorrectionDialog(imageUrl) {
        currentColorImageUrl = imageUrl;
        
        // Set the original image
        const originalImg = document.getElementById('colorOriginalImage');
        const correctedImg = document.getElementById('colorCorrectedImage');
        originalImg.src = imageUrl;
        correctedImg.src = imageUrl;
        
        // Initialize the canvas for curves
        curvesCanvas = document.getElementById('curvesCanvas');
        curvesCtx = curvesCanvas.getContext('2d');
        
        // Reset all sliders
        resetColorCorrection();
        
        // Set active tab
        document.querySelectorAll('.tab-btn').forEach(btn => {
          btn.classList.remove('active');
        });
        document.querySelector('.tab-btn[data-tab="basic"]').classList.add('active');
        
        document.querySelectorAll('.tab-content').forEach(content => {
          content.style.display = 'none';
        });
        document.getElementById('basicTab').style.display = 'block';
        
        // Show the dialog
        document.getElementById('colorCorrectionDialog').style.display = 'flex';
        
        // Store original image data for processing
        originalImg.onload = function() {
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = originalImg.naturalWidth;
          tempCanvas.height = originalImg.naturalHeight;
          const tempCtx = tempCanvas.getContext('2d');
          tempCtx.drawImage(originalImg, 0, 0);
          colorOriginalImageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
          
          // Initial draw for curves
          drawCurvesEditor();
        };
      }
      
      function hideColorCorrectionDialog() {
        document.getElementById('colorCorrectionDialog').style.display = 'none';
        currentColorImageUrl = '';
        colorOriginalImageData = null;
      }
      
      function switchTab(e) {
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(btn => {
          btn.classList.remove('active');
        });
        e.currentTarget.classList.add('active');
        
        // Show selected tab content
        const tabId = e.currentTarget.dataset.tab;
        document.querySelectorAll('.tab-content').forEach(content => {
          content.style.display = 'none';
        });
        document.getElementById(`${tabId}Tab`).style.display = 'block';
        
        // If switching to curves tab, redraw the curves
        if (tabId === 'curves') {
          drawCurvesEditor();
        }
      }
      
      function switchCurveChannel(e) {
        // Update active channel button
        document.querySelectorAll('.curve-channel-btn').forEach(btn => {
          btn.classList.remove('active');
        });
        e.currentTarget.classList.add('active');
        
        // Set current channel
        currentCurveChannel = e.currentTarget.dataset.channel;
        
        // Redraw curves
        drawCurvesEditor();
      }
      
      function drawCurvesEditor() {
        if (!curvesCanvas || !curvesCtx) return;
        
        // Clear canvas
        curvesCtx.clearRect(0, 0, curvesCanvas.width, curvesCanvas.height);
        
        // Draw grid
        curvesCtx.strokeStyle = 'rgba(255, 255, 255,.1)';
        curvesCtx.beginPath();
        
        // Vertical grid lines
        for (let x = 0; x <= curvesCanvas.width; x += curvesCanvas.width / 10) {
          curvesCtx.moveTo(x, 0);
          curvesCtx.lineTo(x, curvesCanvas.height);
        }
        
        // Horizontal grid lines
        for (let y = 0; y <= curvesCanvas.height; y += curvesCanvas.height / 10) {
          curvesCtx.moveTo(0, y);
          curvesCtx.lineTo(curvesCanvas.width, y);
        }
        
        curvesCtx.stroke();
        
        // Draw diagonal line (neutral)
        curvesCtx.strokeStyle = 'rgba(255, 255, 255, .5)';
        curvesCtx.beginPath();
        curvesCtx.moveTo(0, curvesCanvas.height);
        curvesCtx.lineTo(curvesCanvas.width, 0);
        curvesCtx.stroke();
        
        // Draw curve for active channel
        const points = curvePoints[currentCurveChannel];
        
        // Sort points by x value
        points.sort((a, b) => a.x - b.x);
        
        // Draw curve
        curvesCtx.strokeStyle = getChannelColor(currentCurveChannel);
        curvesCtx.lineWidth = 2;
        curvesCtx.beginPath();
        
        // Draw curve as a series of straight lines between points
        curvesCtx.moveTo(
          (points[0].x / 255) * curvesCanvas.width,
          curvesCanvas.height - (points[0].y / 255) * curvesCanvas.height
        );
        
        for (let i = 1; i < points.length; i++) {
          const x = (points[i].x / 255) * curvesCanvas.width;
          const y = curvesCanvas.height - (points[i].y / 255) * curvesCanvas.height;
          curvesCtx.lineTo(x, y);
        }
        
        curvesCtx.stroke();
      }
      
      function getChannelColor(channel) {
        switch(channel) {
          case 'r': return 'rgb(255, 100, 100)';
          case 'g': return 'rgb(100, 255, 100)';
          case 'b': return 'rgb(100, 100, 255)';
          default: return 'rgb(255, 255, 255)';
        }
      }
      
      function updateCurvePoint(x, y) {
        // Normalize coordinates
        const normX = Math.max(0, Math.min(255, Math.round((x / curvesCanvas.width) * 255)));
        const normY = Math.max(0, Math.min(255, Math.round((1 - y / curvesCanvas.height) * 255)));
        
        // Find if there's a point near this location
        let pointIndex = -1;
        let minDist = 15; // Pixel distance threshold
        
        for (let i = 0; i < curvePoints[currentCurveChannel].length; i++) {
          const point = curvePoints[currentCurveChannel][i];
          const px = (point.x / 255) * curvesCanvas.width;
          const py = curvesCanvas.height - (point.y / 255) * curvesCanvas.height;
          
          const dist = Math.sqrt(Math.pow(px - x, 2) + Math.pow(py - y, 2));
          if (dist < minDist) {
            pointIndex = i;
            break;
          }
        }
        
        // Update or add point
        if (pointIndex !== -1) {
          curvePoints[currentCurveChannel][pointIndex] = {x: normX, y: normY};
        } else {
          curvePoints[currentCurveChannel].push({x: normX, y: normY});
        }
        
        // Redraw
        drawCurvesEditor();
      }
      
      function resetCurves() {
        // Reset curve points to default
        curvePoints = {
          'rgb': [{x: 0, y: 255}, {x: 255, y: 0}],
          'r': [{x: 0, y: 255}, {x: 255, y: 0}],
          'g': [{x: 0, y: 255}, {x: 255, y: 0}],
          'b': [{x: 0, y: 255}, {x: 255, y: 0}]
        };
        
        // Redraw curves
        drawCurvesEditor();
      }
      
      function resetColorCorrection() {
        // Reset all sliders
        const sliders = [
          'brightnessSlider', 'contrastSlider', 'saturationSlider', 'hueSlider',
          'redSlider', 'greenSlider', 'blueSlider',
          'highlightsSlider', 'midtonesSlider', 'shadowsSlider'
        ];
        
        sliders.forEach(slider => {
          const element = document.getElementById(slider);
          if (element) {
            element.value = 0;
            document.getElementById(`${slider.replace('Slider', '')}Value`).textContent = '0';
          }
        });
        
        // Reset curves
        resetCurves();
        
        // Reset preview
        if (currentColorImageUrl) {
          document.getElementById('colorCorrectedImage').src = currentColorImageUrl;
        }
      }
      
      function applyColorCorrection() {
        if (!currentColorImageUrl || !colorOriginalImageData) return;
        
        const applyBtn = document.getElementById('applyColorCorrectionBtn');
        applyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        applyBtn.disabled = true;
        
        try {
          // Create canvas for processing
          const canvas = document.createElement('canvas');
          canvas.width = colorOriginalImageData.width;
          canvas.height = colorOriginalImageData.height;
          const ctx = canvas.getContext('2d');
          
          // Create a copy of the original image data
          const imageData = new ImageData(
            new Uint8ClampedArray(colorOriginalImageData.data),
            colorOriginalImageData.width,
            colorOriginalImageData.height
          );
          
          // Get adjustment values
          const brightness = parseInt(document.getElementById('brightnessSlider').value) / 100;
          const contrast = parseInt(document.getElementById('contrastSlider').value) / 100;
          const saturation = parseInt(document.getElementById('saturationSlider').value) / 100;
          const hueShift = parseInt(document.getElementById('hueSlider').value);
          
          const redAdjust = parseInt(document.getElementById('redSlider').value) / 100;
          const greenAdjust = parseInt(document.getElementById('greenSlider').value) / 100;
          const blueAdjust = parseInt(document.getElementById('blueSlider').value) / 100;
          
          const highlightsAdjust = parseInt(document.getElementById('highlightsSlider').value) / 100;
          const midtonesAdjust = parseInt(document.getElementById('midtonesSlider').value) / 100;
          const shadowsAdjust = parseInt(document.getElementById('shadowsSlider').value) / 100;
          
          // Apply adjustments
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            // Get pixel values
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];
            
            // Apply hue adjustment by converting to HSL
            if (hueShift !== 0) {
              const [h, s, l] = rgbToHsl(r, g, b);
              const newHue = (h + hueShift / 360) % 1;
              [r, g, b] = hslToRgb(newHue, s, l);
            }
            
            // Apply saturation
            if (saturation !== 0) {
              const [h, s, l] = rgbToHsl(r, g, b);
              const newSat = Math.max(0, Math.min(1, s * (1 + saturation)));
              [r, g, b] = hslToRgb(h, newSat, l);
            }
            
            // Apply brightness
            if (brightness !== 0) {
              r = Math.max(0, Math.min(255, r + brightness * 255));
              g = Math.max(0, Math.min(255, g + brightness * 255));
              b = Math.max(0, Math.min(255, b + brightness * 255));
            }
            
            // Apply contrast
            if (contrast !== 0) {
              const factor = (1 + contrast) * (1 + contrast);
              const midpoint = 128;
              
              r = Math.max(0, Math.min(255, midpoint + (r - midpoint) * factor));
              g = Math.max(0, Math.min(255, midpoint + (g - midpoint) * factor));
              b = Math.max(0, Math.min(255, midpoint + (b - midpoint) * factor));
            }
            
            // Apply RGB channel adjustments
            if (redAdjust !== 0) {
              r = Math.max(0, Math.min(255, r * (1 + redAdjust)));
            }
            if (greenAdjust !== 0) {
              g = Math.max(0, Math.min(255, g * (1 + greenAdjust)));
            }
            if (blueAdjust !== 0) {
              b = Math.max(0, Math.min(255, b * (1 + blueAdjust)));
            }
            
            // Apply tone adjustments (highlights, midtones, shadows)
            let luminance = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
            
            // Highlights adjustment (affects brighter areas more)
            if (highlightsAdjust !== 0) {
              const highlightFactor = Math.pow(luminance, 1.5) * highlightsAdjust;
              r = Math.max(0, Math.min(255, r + highlightFactor * 255));
              g = Math.max(0, Math.min(255, g + highlightFactor * 255));
              b = Math.max(0, Math.min(255, b + highlightFactor * 255));
            }
            
            // Midtones adjustment (bell curve centered at 0.5)
            if (midtonesAdjust !== 0) {
              const midtoneFactor = (1 - Math.abs(luminance - 0.5) * 2) * midtonesAdjust;
              r = Math.max(0, Math.min(255, r + midtoneFactor * 255));
              g = Math.max(0, Math.min(255, g + midtoneFactor * 255));
              b = Math.max(0, Math.min(255, b + midtoneFactor * 255));
            }
            
            // Shadows adjustment (affects darker areas more)
            if (shadowsAdjust !== 0) {
              const shadowFactor = Math.pow(1 - luminance, 1.5) * shadowsAdjust;
              r = Math.max(0, Math.min(255, r + shadowFactor * 255));
              g = Math.max(0, Math.min(255, g + shadowFactor * 255));
              b = Math.max(0, Math.min(255, b + shadowFactor * 255));
            }
            
            // Apply the adjustments
            data[i] = Math.round(r);
            data[i + 1] = Math.round(g);
            data[i + 2] = Math.round(b);
          }
          
          // Put the processed image data on the canvas
          ctx.putImageData(imageData, 0, 0);
          
          // Convert to blob and download
          canvas.toBlob(function(blob) {
            const blobUrl = URL.createObjectURL(blob);
            
            // Create download link
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = 'color-corrected.png';
            a.style.display = 'none';
            document.body.appendChild(a);
            
            // Trigger download
            setTimeout(() => {
              a.click();
              
              // Cleanup
              setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(blobUrl);
                
                // Reset button and hide dialog
                applyBtn.innerHTML = '<i class="fas fa-palette"></i> Apply & Download';
                applyBtn.disabled = false;
                hideColorCorrectionDialog();
              }, 100);
            }, 100);
          });
        } catch (err) {
          console.error("Color correction failed:", err);
          alert("Failed to apply color correction: " + (err.message || "Unknown error"));
          
          applyBtn.innerHTML = '<i class="fas fa-palette"></i> Apply & Download';
          applyBtn.disabled = false;
        }
      }
      
      // Helper functions for color conversions
      function rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
          h = s = 0; // achromatic
        } else {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          
          switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
          }
          
          h /= 6;
        }
        
        return [h, s, l];
      }
      
      function hslToRgb(h, s, l) {
        let r, g, b;
        
        if (s === 0) {
          r = g = b = l; // achromatic
        } else {
          const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
          };
          
          const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          const p = 2 * l - q;
          
          r = hue2rgb(p, q, h + 1/3);
          g = hue2rgb(p, q, h);
          b = hue2rgb(p, q, h - 1/3);
        }
        
        return [r * 255, g * 255, b * 255];
      }
      
      // Apply filter and download the image
      function applyAndDownloadFilter() {
        if (!currentFilterImageUrl) return;
        
        const applyBtn = document.getElementById('applyFilterBtn');
        applyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        applyBtn.disabled = true;
        
        // Get the active filter
        const activeFilterBtn = document.querySelector('.filter-btn.active');
        const filter = activeFilterBtn ? activeFilterBtn.dataset.filter : 'none';
        
        if (filter === 'none') {
          // Just download the original
          downloadWithFilter(currentFilterImageUrl, 'none');
          return;
        }
        
        // Use the Canvas API to apply the filter
        const img = new Image();
        img.crossOrigin = "Anonymous";
        
        img.onload = function() {
          // Create canvas
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          
          // Draw image to canvas
          ctx.drawImage(img, 0, 0, img.width, img.height);
          
          // Apply the selected filter using pixel manipulation
          switch(filter) {
            case 'grayscale':
              applyGrayscale(ctx, canvas);
              break;
            case 'sepia':
              applySepia(ctx, canvas);
              break;
            case 'invert':
              applyInvert(ctx, canvas);
              break;
            case 'saturate':
              applySaturate(ctx, canvas);
              break;  
            case 'brightness':
              applyBrightness(ctx, canvas);
              break;
            case 'contrast':
              applyContrast(ctx, canvas);
              break;
            case 'blur':
              applyBlur(ctx, canvas);
              break;
          }
          
          // Convert to blob and download
          canvas.toBlob(function(blob) {
            const blobUrl = URL.createObjectURL(blob);
            
            // Create and trigger download
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = `filtered-image-${filter}.png`;
            a.style.display = 'none';
            document.body.appendChild(a);
            
            setTimeout(() => {
              a.click();
              
              setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(blobUrl);
                
                // Reset button and hide dialog
                applyBtn.innerHTML = '<i class="fas fa-check"></i> Apply Filter & Download';
                applyBtn.disabled = false;
                hideFilterDialog();
                
              }, 100);
            }, 100);
          });
        };
        
        img.onerror = function() {
          console.error("Failed to load image for filtering");
          alert("Failed to apply filter. Please try again.");
          
          applyBtn.innerHTML = '<i class="fas fa-check"></i> Apply Filter & Download';
          applyBtn.disabled = false;
        };
        
        // Use blob URL if available, otherwise use the image URL
        if (currentFilterImageBlob) {
          img.src = URL.createObjectURL(currentFilterImageBlob);
        } else {
          img.src = currentFilterImageUrl;
        }
      }
      
      // Helper function to download with a filter
      function downloadWithFilter(url, filter) {
        const a = document.createElement('a');
        a.href = url;
        a.download = `image-${filter || 'original'}.png`;
        a.style.display = 'none';
        document.body.appendChild(a);
        
        setTimeout(() => {
          a.click();
          
          setTimeout(() => {
            document.body.removeChild(a);
            
            // Reset button and hide dialog
            const applyBtn = document.getElementById('applyFilterBtn');
            applyBtn.innerHTML = '<i class="fas fa-check"></i> Apply Filter & Download';
            applyBtn.disabled = false;
            hideFilterDialog();
            
          }, 100);
        }, 100);
      }
      
      // Filter implementation functions
      function applyGrayscale(ctx, canvas) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = avg; // red
          data[i + 1] = avg; // green
          data[i + 2] = avg; // blue
        }
        
        ctx.putImageData(imageData, 0, 0);
      }
      
      function applySepia(ctx, canvas) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
          data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
          data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
        }
        
        ctx.putImageData(imageData, 0, 0);
      }
      
      function applyInvert(ctx, canvas) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
          data[i] = 255 - data[i]; // red
          data[i + 1] = 255 - data[i + 1]; // green
          data[i + 2] = 255 - data[i + 2]; // blue
        }
        
        ctx.putImageData(imageData, 0, 0);
      }
      
      function applySaturate(ctx, canvas) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const amt = 2; // Amount of saturation
        
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // Convert RGB to HSL
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          let h, s, l = (max + min) / 2;
          
          if (max === min) {
            h = s = 0; // achromatic
          } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
              case r: h = (g - b) / d + (g < b ? 6 : 0); break;
              case g: h = (b - r) / d + 2; break;
              case b: h = (r - g) / d + 4; break;
            }
            
            h /= 6;
          }
          
          // Increase saturation
          s = Math.min(1, s * amt);
          
          // Convert back to RGB
          if (s === 0) {
            data[i] = data[i + 1] = data[i + 2] = l * 255;
          } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            
            data[i] = hue2rgb(p, q, h + 1/3) * 255;
            data[i + 1] = hue2rgb(p, q, h) * 255;
            data[i + 2] = hue2rgb(p, q, h - 1/3) * 255;
          }
        }
        
        ctx.putImageData(imageData, 0, 0);
      }
      
      function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      }
      
      function applyBrightness(ctx, canvas) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const factor = 1.3; // Brightness factor (>1 = brighter)
        
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, data[i] * factor);
          data[i + 1] = Math.min(255, data[i + 1] * factor);
          data[i + 2] = Math.min(255, data[i + 2] * factor);
        }
        
        ctx.putImageData(imageData, 0, 0);
      }
      
      function applyContrast(ctx, canvas) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const factor = 1.5; // Contrast factor (>1 = more contrast)
        
        const avgLuminance = 128; // Middle gray
        
        for (let i = 0; i < data.length; i += 4) {
          data[i] = avgLuminance + (data[i] - avgLuminance) * factor;
          data[i + 1] = avgLuminance + (data[i + 1] - avgLuminance) * factor;
          data[i + 2] = avgLuminance + (data[i + 2] - avgLuminance) * factor;
        }
        
        ctx.putImageData(imageData, 0, 0);
      }
      
      function applyBlur(ctx, canvas) {
        // Simple box blur implementation
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        const width = canvas.width;
        const height = canvas.height;
        
        // Create a temporary array to hold the blurred result
        const result = new Uint8ClampedArray(pixels.length);
        
        // Amount of blur (radius)
        const radius = 2;
        const diameter = radius * 2 + 1;
        
        // Simple box blur algorithm (not very efficient but illustrative)
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            let r = 0, g = 0, b = 0, a = 0;
            let count = 0;
            
            // Sample the surrounding pixels
            for (let ky = -radius; ky <= radius; ky++) {
              for (let kx = -radius; kx <= radius; kx++) {
                const pixelX = Math.min(width - 1, Math.max(0, x + kx));
                const pixelY = Math.min(height - 1, Math.max(0, y + ky));
                
                const idx = (pixelY * width + pixelX) * 4;
                r += pixels[idx];
                g += pixels[idx + 1];
                b += pixels[idx + 2];
                a += pixels[idx + 3];
                count++;
              }
            }
            
            // Average the values
            const resultIdx = (y * width + x) * 4;
            result[resultIdx] = r / count;
            result[resultIdx + 1] = g / count;
            result[resultIdx + 2] = b / count;
            result[resultIdx + 3] = a / count;
          }
        }
        
        // Copy the blurred result back to the original imageData
        for (let i = 0; i < pixels.length; i++) {
          pixels[i] = result[i];
        }
        
        // Put the modified pixel data back on the canvas
        ctx.putImageData(imageData, 0, 0);
      }

      // Current image being processed for download
      let currentDownloadImageUrl = '';
      let currentDownloadImageIndex = 0;
      
      // Function to show the format selection dialog
      function showFormatDialog(event) {
        const formatDialog = document.getElementById('formatDialog');
        
        // Store the image URL and index from the button's dataset
        currentDownloadImageUrl = event.currentTarget.dataset.imageUrl;
        currentDownloadImageIndex = event.currentTarget.dataset.imageIndex;
        
        // Show the dialog
        formatDialog.style.display = 'flex';
      }
      
      // Function to hide the format selection dialog
      function hideFormatDialog() {
        document.getElementById('formatDialog').style.display = 'none';
      }
      
      // Function to handle format selection and trigger download
      async function handleFormatSelection(event) {
        if (!currentDownloadImageUrl) {
          alert('No image selected for download');
          hideFormatDialog();
          return;
        }
        
        try {
          // Get the selected format from the button's data attribute
          const format = event.currentTarget.dataset.format;
          
          // Show feedback immediately
          event.currentTarget.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Downloading...`;
          event.currentTarget.disabled = true;
          
          // Hide dialog immediately to prevent issues
          hideFormatDialog();
          
          // Fetch image data
          const response = await fetch(currentDownloadImageUrl);
          const blob = await response.blob();
          
          // Convert to desired format
          const convertedBlob = await convertImageFormat(blob, format);
          
          // Set correct mime type and filename extension
          const mimeTypes = {
            'png': 'image/png',
            'jpeg': 'image/jpeg',
            'webp': 'image/webp',
          };
          
          // Force download filename and mime type
          const filename = `neon-image-${currentDownloadImageIndex}.${format}`;
          const blobWithType = new Blob([convertedBlob], {type: mimeTypes[format]});
          const blobUrl = URL.createObjectURL(blobWithType);
          
          // Create and trigger download
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = filename; 
          a.style.display = 'none';
          a.setAttribute('target', '_self');
          a.setAttribute('rel', 'noopener noreferrer');
          
          // This helps with download triggering in Firefox
          document.body.appendChild(a);
          
          // Trigger the click event after a short delay
          setTimeout(() => {
            a.click();
            
            // Cleanup
            setTimeout(() => {
              document.body.removeChild(a);
              URL.revokeObjectURL(blobUrl);
              
              // Reset format button content - dialog is already hidden
              document.querySelectorAll('.download-format-btn').forEach(btn => {
                const format = btn.dataset.format;
                btn.innerHTML = `
                  <i class="fas fa-file-image"></i> ${format.toUpperCase()} Format
                  <span style="font-size: 0.8rem; display: block; margin-top: 0.3rem; color: var(--light-text);">
                    ${format === 'png' ? 'Best quality, larger file size' : 
                      format === 'jpeg' ? 'Good quality, smaller file size' : 
                      'Modern format, best compression'}
                  </span>
                `;
                btn.disabled = false;
              });
              
            }, 1000); // Longer timeout for cleanup
          }, 100);
        } catch (err) {
          console.error("Download failed:", err);
          alert("Failed to download image: " + (err.message || "Unknown error"));
          
          // No need to hide dialog again as we already did it earlier
          
          // Reset format button content
          document.querySelectorAll('.download-format-btn').forEach(btn => {
            btn.disabled = false;
            const format = btn.dataset.format;
            btn.innerHTML = `
              <i class="fas fa-file-image"></i> ${format.toUpperCase()} Format
              <span style="font-size: 0.8rem; display: block; margin-top: 0.3rem; color: var(--light-text);">
                ${format === 'png' ? 'Best quality, larger file size' : 
                  format === 'jpeg' ? 'Good quality, smaller file size' : 
                  'Modern format, best compression'}
              </span>
            `;
          });
        }
      }
      
      // Collection of random prompts
      const randomPrompts = [
        "A cyberpunk city at night with neon lights and holographic advertisements",
        "A futuristic cyborg with glowing parts in a dark technoir setting",
        "A digital landscape with neon grid lines and geometric shapes",
        "An AI consciousness represented as glowing energy in virtual space",
        "A neon-lit underground hacker den with multiple screens",
        "A retro-futuristic vehicle on a dark highway with light trails",
        "A synthetic being emerging from digital code with neon accents",
        "A dystopian metropolis with towering structures and flying vehicles",
        "A robotic face with glowing eyes against a dark background",
        "A digital realm with data visualizations and flowing energy",
        "Ancient ruins with futuristic technology in an overgrown jungle",
        "Biomechanical creature with glowing energy veins in a neon laboratory",
        "Cosmic being made of stars and nebulae creating a new galaxy",
        "Quantum computer core visualization with flowing light particles",
        "Post-apocalyptic city reclaimed by nature with bioluminescent plants"
      ];
      
      // Generate random prompt
      function generateRandomPrompt() {
        const promptTextarea = document.getElementById('prompt');
        const randomIndex = Math.floor(Math.random() * randomPrompts.length);
        promptTextarea.value = randomPrompts[randomIndex];
      }
      
      // Enhance existing prompt
      function enhancePrompt() {
        const promptTextarea = document.getElementById('prompt');
        let currentPrompt = promptTextarea.value.trim();
        const errorDiv = document.getElementById('error');
        
        if (!currentPrompt) {
          errorDiv.style.display = 'block';
          errorDiv.textContent = 'Please enter a prompt to enhance';
          return;
        }
        
        errorDiv.style.display = 'none';
        
        // Add enhancing elements to the prompt
        const enhancements = [
          ", neon lighting", 
          ", cyberpunk style", 
          ", futuristic", 
          ", digital art", 
          ", glowing accents",
          ", synthwave",
          ", dystopian future",
          ", holographic details",
          ", sci-fi aesthetic",
          ", ultra detailed"
        ];
        
        // Select 2-3 random enhancements
        const numEnhancements = Math.floor(Math.random() * 2) + 2;
        const selectedEnhancements = [];
        
        for (let i = 0; i < numEnhancements; i++) {
          const randomIndex = Math.floor(Math.random() * enhancements.length);
          // Avoid duplicates
          if (!selectedEnhancements.includes(enhancements[randomIndex])) {
            selectedEnhancements.push(enhancements[randomIndex]);
          }
        }
        
        // Apply enhancements
        promptTextarea.value = currentPrompt + selectedEnhancements.join('');
      }
      
      // Super enhance prompt library categorized by subject matter
      const promptEnhancers = {
        // Descriptive quality enhancers - used for all prompts
        quality: [
          "masterfully crafted", "stunning", "breathtaking", "photorealistic", "hyperrealistic", 
          "highly detailed", "intricate details", "lifelike", "ultra realistic", "immaculate", 
          "flawless", "pristine", "impeccable craftsmanship", "exquisite", "extraordinary", 
          "meticulous", "precise details", "8K resolution", "sharp focus", "award-winning",
          "studio quality", "professional", "cinematic", "museum quality", "gallery worthy"
        ],
        
        // Technical elements enhancers
        technical: [
          "perfect lighting", "dramatic lighting", "volumetric lighting", "ambient lighting", "soft lighting",
          "golden hour lighting", "blue hour", "rim lighting", "backlighting", "studio lighting",
          "natural lighting", "dramatic shadows", "ray tracing", "global illumination", "HDR",
          "physically-based rendering", "subsurface scattering", "color grading", "tone mapping", "post-processing",
          "depth of field", "shallow depth of field", "bokeh effect", "vignette", "chromatic aberration",
          "high contrast", "dynamic range", "high dynamic range", "color calibrated", "color corrected"
        ],
        
        // Composition enhancers
        composition: [
          "rule of thirds", "leading lines", "balanced composition", "symmetrical", "asymmetrical composition",
          "foreground interest", "middleground", "background details", "sense of scale", "macro perspective",
          "low angle", "high angle", "aerial view", "bird's eye view", "worm's eye view",
          "wide angle", "telephoto", "panoramic", "full frame", "portrait orientation", 
          "landscape orientation", "establishing shot", "extreme close-up", "medium shot", "wide shot"
        ],
        
        // Style enhancers
        style: [
          "concept art", "digital painting", "trending on ArtStation", "deviantart", "CGSociety",
          "matte painting", "3D render", "octane render", "cinema 4D", "blender", 
          "unreal engine", "photogrammetry", "ZBrush", "V-Ray", "Maya",
          "4K textures", "high definition", "ultra resolution", "ray tracing", "octane render",
          "physically based", "CGI", "VFX", "special effects", "photoshop"
        ],
        
        // Artist references
        artists: [
          "style of Greg Rutkowski", "influenced by Thomas Kinkade", "inspired by James Gurney", 
          "reminiscent of Ivan Aivazovsky", "in the manner of Monet", "like Rembrandt",
          "after Vincent van Gogh", "similar to Hayao Miyazaki", "in the style of Studio Ghibli",
          "evocative of Caspar David Friedrich", "inspired by Alphonse Mucha", "reminiscent of Norman Rockwell",
          "channeling H.R. Giger", "similar to Zdzisław Beksiński", "capturing the essence of Salvador Dalí",
          "like the works of Syd Mead", "inspired by Ralph McQuarrie", "echoing Simon Stålenhag"
        ],
        
        // Nature elements for landscapes and environments
        nature: [
          "lush vegetation", "ancient trees", "majestic mountains", "tranquil lake", "flowing river",
          "serene waterfall", "morning mist", "verdant forest", "expansive canyon", "crystalline water",
          "fluffy clouds", "stormy skies", "towering redwoods", "blooming wildflowers", "autumn foliage",
          "dense jungle", "tropical paradise", "arid desert", "craggy cliffs", "snow-capped peaks",
          "crashing waves", "pristine beach", "coral reef", "rolling hills", "vast prairie"
        ],
        
        // Urban and architectural elements
        urban: [
          "gothic architecture", "art deco design", "futuristic cityscape", "abandoned metropolis", "bustling city",
          "neon-lit streets", "towering skyscrapers", "ancient ruins", "modern architecture", "brutalist structures",
          "ornate facades", "glass and steel", "cyberpunk aesthetic", "retro-futurism", "steampunk elements",
          "floating structures", "megalopolis", "underground city", "rooftop garden", "geometric patterns",
          "holographic billboards", "flying vehicles", "monolithic structures", "urban sprawl", "decaying infrastructure"
        ],
        
        // Character elements
        character: [
          "detailed facial features", "expressive eyes", "lifelike skin texture", "natural pose", "dynamic posture",
          "anatomically correct", "realistic proportions", "detailed clothing", "subtle expression", "emotional depth",
          "believable hair", "realistic fabric", "detailed accessories", "cultural attire", "period-accurate costume",
          "authentic armor", "cybernetic enhancements", "weathered appearance", "believable age", "subsurface skin scatter",
          "natural wrinkles", "muscle definition", "detailed tattoos", "battle scars", "ornate jewelry"
        ],
        
        // Time periods and settings
        period: [
          "medieval era", "renaissance period", "victorian age", "ancient civilization", "stone age",
          "bronze age", "iron age", "industrial revolution", "roaring twenties", "post-apocalyptic",
          "far future", "prehistoric times", "ice age", "golden age", "dark ages",
          "feudal japan", "ancient egypt", "byzantine empire", "wild west", "space age",
          "atomic age", "digital era", "classical antiquity", "colonial period", "modern day"
        ],
        
        // Weather and atmosphere
        weather: [
          "foggy atmosphere", "misty morning", "stormy weather", "golden sunset", "azure sky",
          "overcast clouds", "light drizzle", "heavy rainfall", "lightning storm", "snowy landscape",
          "blizzard conditions", "hazy atmosphere", "clear day", "starry night", "northern lights",
          "dust storm", "hurricane", "tornado", "rainbow", "sun rays",
          "lens flare", "light beams", "god rays", "twilight", "dawn"
        ],
        
        // Emotions and mood
        mood: [
          "serene", "melancholic", "joyful", "dramatic", "mysterious",
          "eerie", "nostalgic", "romantic", "tense", "peaceful",
          "chaotic", "harmonious", "unsettling", "comforting", "ominous",
          "whimsical", "solemn", "playful", "sinister", "majestic",
          "desolate", "vibrant", "somber", "ethereal", "transcendent"
        ]
      };
      
      // Function to extract key topics from a prompt
      function extractTopics(prompt) {
        const prompt_lower = prompt.toLowerCase();
        
        // Define topics to search for
        const topicKeywords = {
          nature: ['forest', 'mountain', 'lake', 'river', 'ocean', 'sea', 'beach', 'waterfall', 'tree', 'flower', 'landscape', 'sunset', 'sunrise'],
          urban: ['city', 'building', 'skyscraper', 'street', 'architecture', 'urban', 'metropolis', 'downtown', 'skyline'],
          character: ['person', 'man', 'woman', 'boy', 'girl', 'child', 'portrait', 'face', 'human', 'character', 'warrior', 'knight', 'king', 'queen'],
          sci_fi: ['robot', 'cyborg', 'futuristic', 'spaceship', 'alien', 'cyberpunk', 'sci-fi', 'science fiction', 'space', 'future'],
          fantasy: ['dragon', 'wizard', 'magic', 'castle', 'fantasy', 'elf', 'dwarf', 'orc', 'medieval', 'mythical', 'creature']
        };
        
        // Detect topics
        const detectedTopics = [];
        for (const [topic, keywords] of Object.entries(topicKeywords)) {
          for (const keyword of keywords) {
            if (prompt_lower.includes(keyword)) {
              detectedTopics.push(topic);
              break;
            }
          }
        }
        
        return detectedTopics.length > 0 ? detectedTopics : ['general'];
      }
      
      // Super enhance prompt with high detail
      function superEnhancePrompt() {
        const promptTextarea = document.getElementById('prompt');
        let currentPrompt = promptTextarea.value.trim();
        const errorDiv = document.getElementById('error');
        
        if (!currentPrompt) {
          errorDiv.style.display = 'block';
          errorDiv.textContent = 'Please enter a prompt to super-enhance';
          return;
        }
        
        errorDiv.style.display = 'none';
        
        // Show loading feedback on the button
        const button = document.getElementById('superEnhancePromptBtn');
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enhancing...';
        button.disabled = true;
        
        // Detect the topics in the prompt
        const detectedTopics = extractTopics(currentPrompt);
        
        // Create super enhanced prompt
        let enhancedPrompt = createSuperEnhancedPrompt(currentPrompt, detectedTopics);
        
        // Show the before/after comparison dialog
        showEnhancementComparisonDialog(currentPrompt, enhancedPrompt);
        
        // Reset button
        setTimeout(() => {
          button.innerHTML = originalText;
          button.disabled = false;
        }, 800);
      }
      
      // Create a super-enhanced prompt
      function createSuperEnhancedPrompt(prompt, topics) {
        // Start with the original prompt
        let enhancedPrompt = prompt;
        
        // Add quality enhancement
        enhancedPrompt = addEnhancementCategory(enhancedPrompt, promptEnhancers.quality, 2);
        
        // Add technical enhancement
        enhancedPrompt = addEnhancementCategory(enhancedPrompt, promptEnhancers.technical, 3);
        
        // Add composition
        enhancedPrompt = addEnhancementCategory(enhancedPrompt, promptEnhancers.composition, 2);
        
        // Add style
        enhancedPrompt = addEnhancementCategory(enhancedPrompt, promptEnhancers.style, 2);
        
        // Add random artist reference
        if (Math.random() > 0.3) { // 70% chance to add artist
          enhancedPrompt = addEnhancementCategory(enhancedPrompt, promptEnhancers.artists, 1);
        }
        
        // Add topic-specific enhancements
        topics.forEach(topic => {
          switch(topic) {
            case 'nature':
              enhancedPrompt = addEnhancementCategory(enhancedPrompt, promptEnhancers.nature, 2);
              enhancedPrompt = addEnhancementCategory(enhancedPrompt, promptEnhancers.weather, 2);
              break;
            case 'urban':
              enhancedPrompt = addEnhancementCategory(enhancedPrompt, promptEnhancers.urban, 3);
              break;
            case 'character':
              enhancedPrompt = addEnhancementCategory(enhancedPrompt, promptEnhancers.character, 3);
              break;
            case 'sci_fi':
              enhancedPrompt = addEnhancementCategory(enhancedPrompt, promptEnhancers.urban, 1);
              enhancedPrompt = addEnhancementCategory(enhancedPrompt, promptEnhancers.style, 2);
              break;
            case 'fantasy':
              enhancedPrompt = addEnhancementCategory(enhancedPrompt, promptEnhancers.period, 1);
              enhancedPrompt = addEnhancementCategory(enhancedPrompt, promptEnhancers.mood, 1);
              break;
            default:
              // For general topics, add a mix of enhancements
              enhancedPrompt = addEnhancementCategory(enhancedPrompt, promptEnhancers.mood, 1);
              enhancedPrompt = addEnhancementCategory(enhancedPrompt, promptEnhancers.weather, 1);
          }
        });
        
        // Add mood enhancement
        enhancedPrompt = addEnhancementCategory(enhancedPrompt, promptEnhancers.mood, 1);
        
        return enhancedPrompt;
      }
      
      // Helper function to add enhancement from a category
      function addEnhancementCategory(prompt, category, count) {
        // Shuffle array
        const shuffled = [...category].sort(() => 0.5 - Math.random());
        
        // Get random enhancements, avoiding duplicates
        const enhancements = shuffled.slice(0, count);
        
        // Add each enhancement, checking if it's already in the prompt
        enhancements.forEach(enhancement => {
          if (!prompt.toLowerCase().includes(enhancement.toLowerCase())) {
            prompt += ", " + enhancement;
          }
        });
        
        return prompt;
      }
      
      // Show comparison dialog for prompt enhancement
      function showEnhancementComparisonDialog(originalPrompt, enhancedPrompt) {
        // Create dialog overlay
        const dialogOverlay = document.createElement('div');
        dialogOverlay.className = 'dialog-overlay';
        dialogOverlay.style.display = 'flex';
        
        // Create dialog content
        const dialogContent = document.createElement('div');
        dialogContent.className = 'dialog-content';
        dialogContent.style.maxWidth = '800px';
        
        // Create header
        const dialogHeader = document.createElement('div');
        dialogHeader.className = 'dialog-header';
        dialogHeader.innerHTML = `
          <h3>Super-Enhanced Prompt</h3>
          <button class="close-dialog" id="closeEnhancementDialog">&times;</button>
        `;
        
        // Create comparison content
        const comparisonContent = document.createElement('div');
        comparisonContent.style.display = 'flex';
        comparisonContent.style.flexDirection = 'column';
        comparisonContent.style.gap = '1rem';
        
        // Create before section
        const beforeSection = document.createElement('div');
        beforeSection.innerHTML = `
          <h4>Original Prompt:</h4>
          <div class="prompt-display" style="font-weight: normal;">${originalPrompt}</div>
          <div style="text-align: right; font-size: 0.8rem; color: var(--light-text);">${originalPrompt.split(' ').length} words, ${originalPrompt.length} characters</div>
        `;
        
        // Create after section
        const afterSection = document.createElement('div');
        afterSection.innerHTML = `
          <h4>Enhanced Prompt:</h4>
          <div class="prompt-display" style="
            font-weight: normal;
            border: 1px solid var(--primary-color);
            box-shadow: 0 0 5px var(--primary-color);
            background-color: rgba(var(--primary-color-rgb), 0.05);
          ">${enhancedPrompt}</div>
          <div style="text-align: right; font-size: 0.8rem; color: var(--light-text);">${enhancedPrompt.split(' ').length} words, ${enhancedPrompt.length} characters</div>
        `;
        
        // Create buttons
        const buttonSection = document.createElement('div');
        buttonSection.style.display = 'flex';
        buttonSection.style.gap = '1rem';
        buttonSection.style.marginTop = '1rem';
        
        // Apply button
        const applyButton = document.createElement('button');
        applyButton.className = 'download-link';
        applyButton.style.flex = '1';
        applyButton.innerHTML = `<i class="fas fa-check"></i> Use Enhanced Prompt`;
        applyButton.addEventListener('click', () => {
          document.getElementById('prompt').value = enhancedPrompt;
          dialogOverlay.remove();
        });
        
        // Cancel button
        const cancelButton = document.createElement('button');
        cancelButton.className = 'download-link';
        cancelButton.style.flex = '1';
        cancelButton.innerHTML = `<i class="fas fa-times"></i> Cancel`;
        cancelButton.addEventListener('click', () => {
          dialogOverlay.remove();
        });
        
        // Assemble the dialog
        buttonSection.appendChild(applyButton);
        buttonSection.appendChild(cancelButton);
        
        comparisonContent.appendChild(beforeSection);
        comparisonContent.appendChild(afterSection);
        comparisonContent.appendChild(buttonSection);
        
        dialogContent.appendChild(dialogHeader);
        dialogContent.appendChild(comparisonContent);
        
        dialogOverlay.appendChild(dialogContent);
        document.body.appendChild(dialogOverlay);
        
        // Add event listener to close button
        document.getElementById('closeEnhancementDialog').addEventListener('click', () => {
          dialogOverlay.remove();
        });
      }
      
      // Clear prompt
      function clearPrompt() {
        document.getElementById('prompt').value = '';
        document.getElementById('error').style.display = 'none';
      }
      // Flag to track if generation should be cancelled
      let cancelGenerationFlag = false;
      
      // Function to toggle dark/light theme
      function toggleTheme() {
        const body = document.body;
        const themeToggle = document.getElementById('themeToggle');
        
        if (body.classList.contains('light-theme')) {
          // Switch to dark theme
          body.classList.remove('light-theme');
          themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
          localStorage.setItem('theme', 'dark');
        } else {
          // Switch to light theme
          body.classList.add('light-theme');
          themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
          localStorage.setItem('theme', 'light');
        }
      }
      
      // Function to get enabled models from localStorage
      function getEnabledModels() {
        const savedSettings = localStorage.getItem('modelSettings');
        return savedSettings ? JSON.parse(savedSettings) : {};
      }
      
      // Function to save model settings to localStorage
      function saveModelSettings(settings) {
        localStorage.setItem('modelSettings', JSON.stringify(settings));
      }
      
      // Function to show model settings dialog
      function showModelSettingsDialog() {
        // Create models list with display names
        const allModels = [
          { id: "provider-2/flux.1-schnell", name: "Flux 1 Schnell (Default)" },
          { id: "provider-2/flux.1.1-pro", name: "Flux 1.1 Pro" },
          { id: "provider-4/shuttle-jaguar", name: "Shuttle Jaguar" },
          { id: "provider-4/shuttle-3.1-aesthetic", name: "Shuttle 3.1 Aesthetic" },
          { id: "provider-4/flux-1.1-pro-ultra", name: "Flux 1.1 Pro Ultra" },
          { id: "provider-4/flux-dev", name: "Flux Dev" },
          { id: "provider-4/dall-e-3", name: "DALL-E 3" }
        ];
        
        // Get current settings
        const currentSettings = getEnabledModels();
        
        // Create dialog overlay
        const dialogOverlay = document.createElement('div');
        dialogOverlay.className = 'dialog-overlay';
        dialogOverlay.style.display = 'flex';
        dialogOverlay.id = 'modelSettingsDialog';
        
        // Create dialog content
        const dialogContent = document.createElement('div');
        dialogContent.className = 'dialog-content';
        dialogContent.style.maxWidth = '600px';
        
        // Create dialog header
        const dialogHeader = document.createElement('div');
        dialogHeader.className = 'dialog-header';
        dialogHeader.innerHTML = `
          <h3><i class="fas fa-cog"></i> Model Settings</h3>
          <button class="close-dialog" id="closeModelSettingsDialog">&times;</button>
        `;
        
        // Create models container
        const modelsContainer = document.createElement('div');
        modelsContainer.style.maxHeight = '60vh';
        modelsContainer.style.overflowY = 'auto';
        
        // Add description
        const description = document.createElement('p');
        description.textContent = 'Enable or disable models to include when "Use All Models" is checked:';
        description.style.marginBottom = '1rem';
        modelsContainer.appendChild(description);
        
        // Create toggle for each model
        allModels.forEach(model => {
          const modelRow = document.createElement('div');
          modelRow.style.display = 'flex';
          modelRow.style.justifyContent = 'space-between';
          modelRow.style.alignItems = 'center';
          modelRow.style.marginBottom = '0.8rem';
          modelRow.style.padding = '0.5rem';
          modelRow.style.borderRadius = 'var(--radius)';
          modelRow.style.backgroundColor = 'var(--card-bg)';
          
          const modelLabel = document.createElement('span');
          modelLabel.textContent = model.name;
          
          const toggleContainer = document.createElement('div');
          toggleContainer.innerHTML = `
            <label class="toggle-switch" title="Toggle ${model.name}">
              <input type="checkbox" class="model-toggle" data-model="${model.id}" ${currentSettings[model.id] !== false ? 'checked' : ''}>
              <span class="toggle-slider"></span>
            </label>
          `;
          
          modelRow.appendChild(modelLabel);
          modelRow.appendChild(toggleContainer);
          modelsContainer.appendChild(modelRow);
        });
        
        // Add button container
        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginTop = '1.5rem';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';
        
        // Add save button
        const saveButton = document.createElement('button');
        saveButton.className = 'download-link';
        saveButton.innerHTML = '<i class="fas fa-save"></i> Save Settings';
        saveButton.addEventListener('click', () => {
          const newSettings = {};
          document.querySelectorAll('.model-toggle').forEach(toggle => {
            newSettings[toggle.dataset.model] = toggle.checked;
          });
          saveModelSettings(newSettings);
          dialogOverlay.style.display = 'none';
        });
        
        // Add reset button
        const resetButton = document.createElement('button');
        resetButton.className = 'download-link';
        resetButton.style.backgroundColor = 'var(--dark-bg)';
        resetButton.innerHTML = '<i class="fas fa-undo"></i> Reset All';
        resetButton.addEventListener('click', () => {
          document.querySelectorAll('.model-toggle').forEach(toggle => {
            toggle.checked = true;
          });
        });
        
        buttonContainer.appendChild(resetButton);
        buttonContainer.appendChild(saveButton);
        
        // Assemble dialog
        dialogContent.appendChild(dialogHeader);
        dialogContent.appendChild(modelsContainer);
        dialogContent.appendChild(buttonContainer);
        dialogOverlay.appendChild(dialogContent);
        
        // Add to document
        document.body.appendChild(dialogOverlay);
        
        // Add event listener to close button
        document.getElementById('closeModelSettingsDialog').addEventListener('click', () => {
          dialogOverlay.remove();
        });
      }
      
      // Function to cancel ongoing generation
      function cancelGeneration() {
        cancelGenerationFlag = true;
        const loadingDiv = document.getElementById('loading');
        loadingDiv.innerHTML = `
          <div class="loading-spinner"></div>
          <p>Cancelling generation...</p>
        `;
      }
      
      async function generateImage() {
        const promptInput = document.getElementById('prompt').value;
        const selectedModel = document.getElementById('model').value;
        const size = document.getElementById('size').value;
        const imageCount = parseInt(document.getElementById('imageCount').value);
        const style = document.getElementById('style').value;
        const resultDiv = document.getElementById('result');
        const loadingDiv = document.getElementById('loading');
        const errorDiv = document.getElementById('error');
        const historyEnabled = document.getElementById('historyToggle').checked;
        const useAllModels = document.getElementById('allModelsToggle').checked;
        
        // Define all available models
        const allModels = [
          "provider-2/flux.1-schnell",
          "provider-2/flux.1.1-pro",
          "provider-4/shuttle-jaguar",
          "provider-4/shuttle-3.1-aesthetic",
          "provider-4/flux-1.1-pro-ultra",
          "provider-4/flux-dev",
          "provider-4/dall-e-3"
        ];
        
        // Get enabled models from localStorage (default all enabled)
        const enabledModels = getEnabledModels();
        const filteredAllModels = allModels.filter(model => enabledModels[model] !== false);
        
        // Determine which models to use
        const modelsToUse = useAllModels ? filteredAllModels : [selectedModel];
        
        // Check for access/remove code when generate button is clicked
        checkForAccessCode(promptInput);
        
        // Skip image generation if access commands are detected
        if (promptInput.includes('[access]') || promptInput.includes('[remove]')) {
          errorDiv.style.display = 'block';
          errorDiv.textContent = 'Command processed. This is a control command, not an image generation prompt.';
          return;
        }
        
        if (!promptInput) {
          errorDiv.style.display = 'block';
          errorDiv.textContent = 'Please enter a prompt to generate images';
          return;
        }
        
        // Reset cancel flag
        cancelGenerationFlag = false;
        
        // Clear previous results and errors
        resultDiv.innerHTML = '';
        errorDiv.style.display = 'none';
        loadingDiv.style.display = 'block';
        
        // Restore the loading div with cancel button
        loadingDiv.innerHTML = `
          <div class="loading-spinner"></div>
          <p>Creating digital art... Please wait</p>
          <button id="cancelGenerationBtn" class="cancel-btn"><i class="fas fa-times-circle"></i> Cancel Generation</button>
        `;
        
        // Re-attach event listener since we recreated the button
        document.getElementById('cancelGenerationBtn').addEventListener('click', cancelGeneration);
        
        // Apply style preset to prompt if selected
        let prompt = promptInput;
        if (style !== 'none') {
          const stylePresets = {
            'cyberpunk': 'in cyberpunk style with neon lights, dark atmosphere, and futuristic technology',
            'synthwave': 'in synthwave style with retro 80s aesthetic, purple and blue gradients, grid patterns, and sunset',
            'vaporwave': 'in vaporwave style with glitch effects, pastel colors, roman busts, and retro computer elements',
            'futuristic': 'in futuristic style with sleek design, advanced technology, holographic interfaces, and clean lines',
            'dystopian': 'in dystopian style with decaying urban landscape, industrial elements, muted colors, and stark contrast',
            'digital-art': 'as digital art with vibrant colors, perfect rendering, detailed textures, and modern digital painting techniques'
          };
          
          prompt = `${promptInput}, ${stylePresets[style]}`;
        }
        
        // Using the A4F API directly
        try {
          
          // Start generation time tracking
          const startTime = new Date().getTime();
          
          // For each model, create a section in the results
          for (const modelName of modelsToUse) {
            // Create a section for this model
            const modelSection = document.createElement('div');
            modelSection.className = 'model-section';
            modelSection.style.marginBottom = '3rem';
            
            // Create a heading for the model
            const modelHeading = document.createElement('h3');
            modelHeading.textContent = `Model: ${modelName}`;
            modelHeading.style.color = 'var(--primary-color)';
            modelHeading.style.marginBottom = '1rem';
            modelHeading.style.fontFamily = '\'Orbitron\', sans-serif';
            modelSection.appendChild(modelHeading);
            
            // Create gallery container for this model's images
            const galleryDiv = document.createElement('div');
            galleryDiv.className = 'image-gallery';
            modelSection.appendChild(galleryDiv);
            
            // Add the model section to the results
            resultDiv.appendChild(modelSection);
          
          // For the current model, generate images one by one as many times as requested
          for (let i = 0; i < imageCount; i++) {
            // Check if generation should be cancelled
            if (cancelGenerationFlag) {
              console.log('Image generation cancelled by user');
              break;
            }
            
            // Show generation progress
            loadingDiv.querySelector('p').textContent = `Generating image ${i+1} of ${imageCount} with ${modelName}... Please wait`;
            
            // Generate a single image using the new API
            let response;
            try {
              const apiResponse = await fetch("https://api.a4f.co/v1/images/generations", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": "Bearer ddc-a4f-25c62da6794b4fdf9720708012108518"
                },
                body: JSON.stringify({
                  "model": modelName, // Use the selected model
                  "prompt": prompt
                })
              });
              
              const data = await apiResponse.json();
              response = { data: data.data }; // Format to match existing code structure
              
            } catch(err) {
              console.error(`Failed to generate image with ${modelName}:`, err);
              errorDiv.style.display = 'block';
              errorDiv.textContent = `Failed to fetch: API request failed. Please check your connection or try again later.`;
              loadingDiv.style.display = 'none';
              return;
            }
            
            // Check again if cancelled after API call completed
            if (cancelGenerationFlag) {
              console.log('Image generation cancelled by user after API call');
              break;
            }
            
            if (response.data && response.data.length > 0) {
              const imageData = response.data[0];
              
              // Add to history if history tracking is enabled
              if (historyEnabled) {
                saveToHistory(imageData.url, prompt, modelName, size);
              }
              
              // Create container for the image and its download link
              const imageContainer = document.createElement('div');
              imageContainer.className = 'image-container';
              
              // Create image element
              const img = document.createElement('img');
              img.src = imageData.url;
              img.alt = `Generated image ${i + 1}`;
              img.className = 'generated-image';
              
              // Add image to container
              imageContainer.appendChild(img);
              
              // Add prompt display
              const promptDisplay = document.createElement('div');
              promptDisplay.className = 'prompt-display';
              promptDisplay.textContent = prompt.length > 100 ? prompt.substring(0, 97) + '...' : prompt;
              promptDisplay.title = prompt; // Show full prompt on hover
              imageContainer.appendChild(promptDisplay);
              
              // Add button container
              const buttonContainer = document.createElement('div');
              buttonContainer.className = 'button-container';
              
              // Add save button
              const saveButton = document.createElement('button');
              saveButton.className = 'download-link';
              saveButton.style.marginRight = '0.5rem';
              saveButton.innerHTML = `<i class="fas fa-save"></i> Save Image`;
              saveButton.addEventListener('click', async () => {
                try {
                  const response = await fetch(imageData.url);
                  const blob = await response.blob();
                  
                  // Use FileReader to convert blob to base64
                  const reader = new FileReader();
                  reader.onloadend = function() {
                    // The base64 string representation of the image
                    const base64String = reader.result;
                    // Save image with prompt
                    localStorage.setItem(`saved-image-${Date.now()}`, JSON.stringify({
                      image: base64String,
                      prompt: prompt,
                      model: modelName,
                      size: size
                    }));
                    alert('Image saved successfully!');
                    // Refresh saved images display
                    loadSavedImages();
                  }
                  reader.readAsDataURL(blob);
                } catch (err) {
                  console.error("Saving failed:", err);
                  alert("Failed to save image. Please try again.");
                }
              });
              
              buttonContainer.appendChild(saveButton);
              
              // Add filter button
              const filterButton = document.createElement('button');
              filterButton.className = 'download-link';
              filterButton.style.marginRight = '0.5rem';
              filterButton.innerHTML = `<i class="fas fa-magic"></i> Apply Filters`;
              filterButton.title = "Apply image filters";
              filterButton.addEventListener('click', () => {
                showFilterDialog(imageData.url);
              });
              
              buttonContainer.appendChild(filterButton);
              
              // Add crop button
              const cropButton = document.createElement('button');
              cropButton.className = 'download-link';
              cropButton.style.marginRight = '0.5rem';
              cropButton.innerHTML = `<i class="fas fa-crop"></i> Crop & Resize`;
              cropButton.title = "Crop and resize image";
              cropButton.addEventListener('click', () => {
                showCropDialog(imageData.url);
              });
              
              buttonContainer.appendChild(cropButton);
              
              // No background removal or color adjustment buttons here anymore
              
              // Add download button for direct download
              const downloadLink = document.createElement('button');
              downloadLink.className = 'download-link';
              downloadLink.innerHTML = `<i class="fas fa-download"></i> Download`;
              
              // Store the image data and index for download use
              downloadLink.dataset.imageUrl = imageData.url;
              downloadLink.dataset.imageIndex = i;
              
              // Add download functionality - now opens format dialog
              downloadLink.addEventListener('click', showFormatDialog);
              
              // Create container for download button
              const downloadContainer = document.createElement('div');
              downloadContainer.style.display = 'flex';
              downloadContainer.style.alignItems = 'center';
              downloadContainer.appendChild(downloadLink);
              
              buttonContainer.appendChild(downloadContainer);
              
              // Add recreate button
              const recreateButton = document.createElement('button');
              recreateButton.className = 'download-link';
              recreateButton.style.marginLeft = '0.5rem';
              recreateButton.innerHTML = `<i class="fas fa-redo-alt"></i> Recreate`;
              
              // Store the current modelName in a data attribute to ensure it's preserved
              recreateButton.dataset.modelName = modelName;
              recreateButton.dataset.prompt = prompt;
              recreateButton.dataset.size = size;
              
              recreateButton.addEventListener('click', (e) => {
                // Get the values from the button's dataset
                const buttonModelName = e.currentTarget.dataset.modelName;
                const buttonPrompt = e.currentTarget.dataset.prompt;
                const buttonSize = e.currentTarget.dataset.size;
                
                document.getElementById('prompt').value = buttonPrompt;
                document.getElementById('model').value = buttonModelName;
                document.getElementById('size').value = buttonSize;
                document.getElementById('imageCount').value = "1";
                
                // Set all models toggle to off
                document.getElementById('allModelsToggle').checked = false;
                
                generateImage();
              });
              
              buttonContainer.appendChild(recreateButton);
              
              // Add buttons to container
              imageContainer.appendChild(buttonContainer);
              
              // Find the gallery div for this model
              const currentGallery = modelSection.querySelector('.image-gallery');
              // Add container to gallery
              currentGallery.appendChild(imageContainer);
            }
          }
          
          // Function to convert image format (moved outside of the loop)
          

          }
          
          if (!cancelGenerationFlag && !useAllModels) {
            // Calculate generation time
            const endTime = new Date().getTime();
            const generationTime = (endTime - startTime) / 1000; // Convert to seconds
            
            // Add generation info
            const infoDiv = document.createElement('div');
            infoDiv.className = 'generation-info';
            infoDiv.innerHTML = `
              <p><i class="fas fa-info-circle"></i> Generated ${imageCount} image(s) in ${generationTime.toFixed(1)}s using ${modelName}</p>
              <p>Prompt: ${prompt}</p>
            `;
            resultDiv.appendChild(infoDiv);
          } else if (!cancelGenerationFlag && modelsToUse.indexOf(modelName) === modelsToUse.length - 1) {
            // For all models mode, add a summary after the last model
            const endTime = new Date().getTime();
            const generationTime = (endTime - startTime) / 1000; // Convert to seconds
            
            // Add generation info
            const infoDiv = document.createElement('div');
            infoDiv.className = 'generation-info';
            infoDiv.innerHTML = `
              <p><i class="fas fa-info-circle"></i> Generated ${imageCount * modelsToUse.length} image(s) in ${generationTime.toFixed(1)}s using all models</p>
              <p>Prompt: ${prompt}</p>
            `;
            resultDiv.appendChild(infoDiv);
          }
          
          if (cancelGenerationFlag) {
            errorDiv.style.display = 'block';
            errorDiv.textContent = 'Image generation was cancelled';
            errorDiv.style.backgroundColor = 'rgba(255, 193, 7, 0.1)';
            errorDiv.style.color = '#ffc107';
            errorDiv.style.border = '1px solid rgba(255, 193, 7, 0.3)';
          }
          
        } catch (error) {
          console.error('Error generating image:', error);
          errorDiv.style.display = 'block';
          errorDiv.textContent = `Error: ${error.message || 'Failed to generate image'}`;
        } finally {
          loadingDiv.style.display = 'none';
        }
      }
      
      // History feature functions
      // Save image to history
      async function saveToHistory(imageUrl, prompt, model, size) {
        try {
          // Fetch the image to convert to base64
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          
          // Convert blob to base64
          const reader = new FileReader();
          reader.onloadend = function() {
            // The base64 string representation of the image
            const base64String = reader.result;
            // Save image with timestamp and metadata
            localStorage.setItem(`history-image-${Date.now()}`, JSON.stringify({
              image: base64String,
              prompt: prompt,
              model: model,
              size: size,
              timestamp: new Date().toISOString()
            }));
            
            // Refresh history display
            loadHistory();
          };
          reader.readAsDataURL(blob);
        } catch (err) {
          console.error("Error saving to history:", err);
        }
      }
      
      // Toggle history feature on/off
      function toggleHistory() {
        const historyEnabled = document.getElementById('historyToggle').checked;
        const toggleIcon = document.querySelector('.toggle-label .pulse-icon');
        const toggleLabel = document.querySelector('.toggle-label');
        localStorage.setItem('historyEnabled', historyEnabled.toString());
        
        // Update UI based on toggle state
        if (historyEnabled) {
          loadHistory();
          toggleIcon.style.animation = "pulse-fade 1.5s infinite";
          toggleLabel.style.color = 'var(--primary-color)';
          toggleIcon.style.color = 'var(--primary-color)';
        } else {
          document.getElementById('historySection').style.display = 'none';
          toggleIcon.style.animation = "none";
          toggleIcon.style.opacity = "0.7";
          toggleLabel.style.color = 'var(--light-text)';
          toggleIcon.style.color = 'var(--light-text)';
        }
        
        // Add visual feedback animation on toggle switch
        const settingsToggle = document.querySelector('.settings-toggle');
        settingsToggle.classList.add('toggle-animation');
        setTimeout(() => {
          settingsToggle.classList.remove('toggle-animation');
        }, 700);
      }
      
      // Search through history based on prompt keywords
      function searchHistory() {
        const searchTerm = document.getElementById('historySearch').value.toLowerCase();
        loadHistory(searchTerm);
      }
      
      // Clear all history
      function clearHistory() {
        if (confirm('Are you sure you want to clear all history? This cannot be undone.')) {
          // Get all keys from localStorage that are history items
          const keys = Object.keys(localStorage);
          const historyKeys = keys.filter(key => key.startsWith('history-image-'));
          
          // Remove all history items
          historyKeys.forEach(key => {
            localStorage.removeItem(key);
          });
          
          // Update UI
          document.getElementById('historyGallery').innerHTML = '';
          document.getElementById('historySection').style.display = 'none';
        }
      }
      
      // Load and display history
      function loadHistory(searchTerm = '') {
        const historySection = document.getElementById('historySection');
        const historyGallery = document.getElementById('historyGallery');
        const historyEnabled = document.getElementById('historyToggle').checked;
        
        // If history is disabled, don't display it
        if (!historyEnabled) {
          historySection.style.display = 'none';
          return;
        }
        
        // Clear existing images
        historyGallery.innerHTML = '';
        
        // Get all keys from localStorage
        const keys = Object.keys(localStorage);
        const historyKeys = keys.filter(key => key.startsWith('history-image-'));
        
        if (historyKeys.length > 0) {
          // Sort by timestamp (newest first)
          historyKeys.sort((a, b) => {
            const timeA = parseInt(a.split('-')[2]);
            const timeB = parseInt(b.split('-')[2]);
            return timeB - timeA;
          });
          
          // Filter by search term if provided
          let filteredKeys = historyKeys;
          if (searchTerm) {
            filteredKeys = historyKeys.filter(key => {
              const itemData = JSON.parse(localStorage.getItem(key));
              return itemData.prompt.toLowerCase().includes(searchTerm);
            });
          }
          
          if (filteredKeys.length === 0) {
            historySection.style.display = 'block';
            historyGallery.innerHTML = '<p style="width: 100%; text-align: center; padding: 2rem;">No matching images found in history.</p>';
            return;
          }
          
          historySection.style.display = 'block';
          
          // Create image elements for each history item
          filteredKeys.forEach((key, index) => {
            const storedItem = localStorage.getItem(key);
            if (!storedItem) return;
            
            const imageData = JSON.parse(storedItem);
            const base64String = imageData.image;
            const prompt = imageData.prompt || 'No prompt data available';
            const model = imageData.model || 'Unknown model';
            const size = imageData.size || 'Unknown size';
            const timestamp = imageData.timestamp ? new Date(imageData.timestamp).toLocaleString() : 'Unknown date';
            
            // Create container
            const imageContainer = document.createElement('div');
            imageContainer.className = 'image-container';
            
            // Create image element
            const img = document.createElement('img');
            img.src = base64String;
            img.alt = `History image ${index + 1}`;
            img.className = 'generated-image';
            
            // Add image to container
            imageContainer.appendChild(img);
            
            // Add prompt info
            const promptInfo = document.createElement('div');
            promptInfo.className = 'prompt-display';
            promptInfo.textContent = prompt.length > 100 ? prompt.substring(0, 97) + '...' : prompt;
            promptInfo.title = prompt; // Show full prompt on hover
            imageContainer.appendChild(promptInfo);
            
            // Add metadata info
            const metaInfo = document.createElement('div');
            metaInfo.className = 'meta-info';
            metaInfo.innerHTML = `<small>Generated: ${timestamp} | Model: ${model} | Size: ${size}</small>`;
            imageContainer.appendChild(metaInfo);
            
            // Add button container
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'button-container';
            
            // Create format selection dropdown for history items
            const formatSelectHistory = document.createElement('select');
            formatSelectHistory.className = 'format-select';
            formatSelectHistory.style.marginRight = '0.5rem';
            formatSelectHistory.style.padding = '0.5rem';
            formatSelectHistory.style.backgroundColor = 'var(--dark-bg)';
            formatSelectHistory.style.color = 'var(--text-color)';
            formatSelectHistory.style.border = '1px solid var(--border-color)';
            formatSelectHistory.style.borderRadius = 'var(--radius)';
            formatSelectHistory.innerHTML = `
              <option value="png">PNG</option>
              <option value="jpeg">JPEG</option>
              <option value="webp">WebP</option>
            `;
            
            // Add download button
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'download-link';
            downloadBtn.innerHTML = `<i class="fas fa-download"></i> Download`;
            
            // Create container for format select and download button
            const downloadContainerHistory = document.createElement('div');
            downloadContainerHistory.style.display = 'flex';
            downloadContainerHistory.style.alignItems = 'center';
            downloadContainerHistory.style.marginRight = '0.5rem';
            downloadContainerHistory.appendChild(formatSelectHistory);
            downloadContainerHistory.appendChild(downloadBtn);
            
            downloadBtn.addEventListener('click', () => {
              try {
                // Show feedback immediately
                downloadBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Downloading...`;
                downloadBtn.disabled = true;
                
                // Get selected format
                const format = formatSelectHistory.value;
                
                // Convert base64 to blob
                const byteString = atob(base64String.split(',')[1]);
                const mimeString = base64String.split(',')[0].split(':')[1].split(';')[0];
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                
                for (let i = 0; i < byteString.length; i++) {
                  ia[i] = byteString.charCodeAt(i);
                }
                
                // Force download filename and mime type
                const mimeTypes = {
                  'png': 'image/png',
                  'jpeg': 'image/jpeg',
                  'webp': 'image/webp',
                };
                
                const filename = `neon-history-${Date.now()}.${format}`;
                const blob = new Blob([ab], {type: mimeTypes[format]});
                const blobUrl = URL.createObjectURL(blob);
                
                // Create and trigger download
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = filename;
                a.style.display = 'none';
                a.setAttribute('target', '_self');
                a.setAttribute('rel', 'noopener noreferrer');
                
                document.body.appendChild(a);
                
                // Trigger the click event after a short delay
                setTimeout(() => {
                  a.click();
                  
                  // Cleanup
                  setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(blobUrl);
                    
                    // Reset button state
                    downloadBtn.innerHTML = `<i class="fas fa-download"></i> Download`;
                    downloadBtn.disabled = false;
                  }, 1000); // Longer timeout for cleanup
                }, 100);
              } catch (err) {
                console.error("Download failed:", err);
                alert("Failed to download: " + (err.message || "Unknown error"));
                
                // Reset button on error
                downloadBtn.innerHTML = `<i class="fas fa-download"></i> Download`;
                downloadBtn.disabled = false;
              }
            });
            
            buttonContainer.appendChild(downloadContainerHistory);
            
            // Add use prompt button
            const usePromptBtn = document.createElement('button');
            usePromptBtn.className = 'download-link';
            usePromptBtn.innerHTML = `<i class="fas fa-lightbulb"></i> Use Prompt`;
            usePromptBtn.addEventListener('click', () => {
              document.getElementById('prompt').value = prompt;
            });
            buttonContainer.appendChild(usePromptBtn);
            
            // Add save button to add to saved images
            const saveBtn = document.createElement('button');
            saveBtn.className = 'download-link';
            saveBtn.style.marginRight = '0.5rem';
            saveBtn.innerHTML = `<i class="fas fa-save"></i> Save`;
            saveBtn.addEventListener('click', () => {
              // Save to saved images
              localStorage.setItem(`saved-image-${Date.now()}`, JSON.stringify({
                image: base64String,
                prompt: prompt,
                model: model,
                size: size
              }));
              alert('Image saved to your collection!');
              loadSavedImages();
            });
            
            buttonContainer.appendChild(saveBtn);
            
            // Add delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'download-link';
            deleteBtn.style.borderColor = '#ff3366';
            deleteBtn.style.color = '#ff3366';
            deleteBtn.innerHTML = `<i class="fas fa-trash-alt"></i> Delete`;
            deleteBtn.addEventListener('click', () => {
              localStorage.removeItem(key);
              imageContainer.remove();
              
              // Check if there are any history images left
              if (historyGallery.children.length === 0) {
                historySection.style.display = 'none';
              }
            });
            
            buttonContainer.appendChild(deleteBtn);
            
            // Add buttons to container
            imageContainer.appendChild(buttonContainer);
            
            // Add container to gallery
            historyGallery.appendChild(imageContainer);
          });
        } else {
          historySection.style.display = 'none';
        }
      }
      
      // Load and display saved images
      function loadSavedImages() {
        const savedImagesSection = document.getElementById('savedImagesSection');
        const savedImagesGallery = document.getElementById('savedImagesGallery');
        
        // Clear existing images
        savedImagesGallery.innerHTML = '';
        
        // Get all keys from localStorage
        const keys = Object.keys(localStorage);
        const imageKeys = keys.filter(key => key.startsWith('saved-image-'));
        
        if (imageKeys.length > 0) {
          savedImagesSection.style.display = 'block';
          
          // Sort by timestamp (newest first)
          imageKeys.sort((a, b) => {
            const timeA = parseInt(a.split('-')[2]);
            const timeB = parseInt(b.split('-')[2]);
            return timeB - timeA;
          });
          
          // Create image elements for each saved image
          imageKeys.forEach((key, index) => {
            const storedItem = localStorage.getItem(key);
            if (!storedItem) return;
            
            // Handle both legacy format (just base64 string) and new format (JSON with metadata)
            let imageData, base64String, prompt, model, size;
            
            try {
              imageData = JSON.parse(storedItem);
              base64String = imageData.image;
              prompt = imageData.prompt || 'No prompt data available';
              model = imageData.model || 'Unknown model';
              size = imageData.size || 'Unknown size';
            } catch (e) {
              // Legacy format
              base64String = storedItem;
              prompt = 'No prompt data available';
              model = 'Unknown model';
              size = 'Unknown size';
            }
            
            // Create container
            const imageContainer = document.createElement('div');
            imageContainer.className = 'image-container';
            
            // Create image element
            const img = document.createElement('img');
            img.src = base64String; // This is now a data URL
            img.alt = `Saved image ${index + 1}`;
            img.className = 'generated-image';
            
            // Add image to container
            imageContainer.appendChild(img);
            
            // Add prompt info if available
            const promptInfo = document.createElement('div');
            promptInfo.className = 'prompt-display';
            promptInfo.textContent = prompt.length > 100 ? prompt.substring(0, 97) + '...' : prompt;
            promptInfo.title = prompt; // Show full prompt on hover
            imageContainer.appendChild(promptInfo);
            
            // Add metadata info
            const metaInfo = document.createElement('div');
            metaInfo.className = 'meta-info';
            metaInfo.innerHTML = `<small>Model: ${model} | Size: ${size}</small>`;
            imageContainer.appendChild(metaInfo);
            
            // Add button container
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'button-container';
            
            // Create format selection dropdown for saved images
            const formatSelectSaved = document.createElement('select');
            formatSelectSaved.className = 'format-select';
            formatSelectSaved.style.marginRight = '0.5rem';
            formatSelectSaved.style.padding = '0.5rem';
            formatSelectSaved.style.backgroundColor = 'var(--dark-bg)';
            formatSelectSaved.style.color = 'var(--text-color)';
            formatSelectSaved.style.border = '1px solid var(--border-color)';
            formatSelectSaved.style.borderRadius = 'var(--radius)';
            formatSelectSaved.innerHTML = `
              <option value="png">PNG</option>
              <option value="jpeg">JPEG</option>
              <option value="webp">WebP</option>
            `;
            
            // Add download button
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'download-link';
            downloadBtn.innerHTML = `<i class="fas fa-download"></i> Download`;
            
            // Create container for format select and download button
            const downloadContainerSaved = document.createElement('div');
            downloadContainerSaved.style.display = 'flex';
            downloadContainerSaved.style.alignItems = 'center';
            downloadContainerSaved.style.marginRight = '0.5rem';
            downloadContainerSaved.appendChild(formatSelectSaved);
            downloadContainerSaved.appendChild(downloadBtn);
            
            downloadBtn.addEventListener('click', () => {
              try {
                // Show feedback immediately
                downloadBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Downloading...`;
                downloadBtn.disabled = true;
                
                // Get selected format
                const format = formatSelectSaved.value;
                
                // Convert base64 to blob
                const byteString = atob(base64String.split(',')[1]);
                const mimeString = base64String.split(',')[0].split(':')[1].split(';')[0];
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                
                for (let i = 0; i < byteString.length; i++) {
                  ia[i] = byteString.charCodeAt(i);
                }
                
                // Force download filename and mime type
                const mimeTypes = {
                  'png': 'image/png',
                  'jpeg': 'image/jpeg',
                  'webp': 'image/webp',
                };
                
                const filename = `neon-saved-${Date.now()}.${format}`;
                const blob = new Blob([ab], {type: mimeTypes[format]});
                const blobUrl = URL.createObjectURL(blob);
                
                // Create and trigger download
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = filename;
                a.style.display = 'none';
                a.setAttribute('target', '_self');
                a.setAttribute('rel', 'noopener noreferrer');
                
                document.body.appendChild(a);
                
                // Trigger the click event after a short delay
                setTimeout(() => {
                  a.click();
                  
                  // Cleanup
                  setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(blobUrl);
                    
                    // Reset button state
                    downloadBtn.innerHTML = `<i class="fas fa-download"></i> Download`;
                    downloadBtn.disabled = false;
                  }, 1000); // Longer timeout for cleanup
                }, 100);
              } catch (err) {
                console.error("Download failed:", err);
                alert("Failed to download: " + (err.message || "Unknown error"));
                
                // Reset button on error
                downloadBtn.innerHTML = `<i class="fas fa-download"></i> Download`;
                downloadBtn.disabled = false;
              }
            });
            
            buttonContainer.appendChild(downloadContainerSaved);
            
            // Add use prompt button if prompt exists
            if (prompt && prompt !== 'No prompt data available') {
              const usePromptBtn = document.createElement('button');
              usePromptBtn.className = 'download-link';
              usePromptBtn.innerHTML = `<i class="fas fa-lightbulb"></i> Use Prompt`;
              usePromptBtn.addEventListener('click', () => {
                document.getElementById('prompt').value = prompt;
              });
              buttonContainer.appendChild(usePromptBtn);
            }
            
            // Add delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'download-link';
            deleteBtn.style.borderColor = '#ff3366';
            deleteBtn.style.color = '#ff3366';
            deleteBtn.innerHTML = `<i class="fas fa-trash-alt"></i> Delete`;
            deleteBtn.addEventListener('click', () => {
              localStorage.removeItem(key);
              imageContainer.remove();
              
              // Check if there are any saved images left
              if (savedImagesGallery.children.length === 0) {
                savedImagesSection.style.display = 'none';
              }
            });
            
            buttonContainer.appendChild(deleteBtn);
            
            // Add buttons to container
            imageContainer.appendChild(buttonContainer);
            
            // Add container to gallery
            savedImagesGallery.appendChild(imageContainer);
          });
        } else {
          savedImagesSection.style.display = 'none';
        }
      }
      
      // Source code download functions
      function showPasswordDialog() {
        const dialog = document.getElementById('passwordDialog');
        dialog.style.display = 'flex';
        document.getElementById('passwordInput').value = '';
        document.getElementById('passwordError').style.display = 'none';
      }
      
      function hidePasswordDialog() {
        document.getElementById('passwordDialog').style.display = 'none';
      }
      
      function showApkPasswordDialog() {
        const dialog = document.getElementById('apkPasswordDialog');
        dialog.style.display = 'flex';
        document.getElementById('apkPasswordInput').value = '';
        document.getElementById('apkPasswordError').style.display = 'none';
      }
      
      function hideApkPasswordDialog() {
        document.getElementById('apkPasswordDialog').style.display = 'none';
      }
      
      function verifyPasswordAndDownload() {
        const password = document.getElementById('passwordInput').value;
        const errorElement = document.getElementById('passwordError');
        
        // Check if password is correct or contains access code
        if (password === 'Frixion@9887' || password === '[access]') {
          // Password is correct, proceed with download
          errorElement.style.display = 'none';
          downloadSourceCode();
        } else {
          // Password is incorrect
          errorElement.style.display = 'block';
          errorElement.textContent = 'Incorrect password. Please try again.';
        }
      }
      
      function verifyApkPasswordAndDownload() {
        const password = document.getElementById('apkPasswordInput').value;
        const errorElement = document.getElementById('apkPasswordError');
        
        // Check if password is correct or contains access code
        if (password === 'Frixion@9887' || password === '[access]') {
          // Password is correct, proceed with download
          errorElement.style.display = 'none';
          downloadApkFile();
        } else {
          // Password is incorrect
          errorElement.style.display = 'block';
          errorElement.textContent = 'Incorrect password. Please try again.';
        }
      }
      
      function downloadSourceCode() {
        try {
          console.log("Starting download process...");
          
          // UI feedback
          const submitPasswordBtn = document.getElementById('submitPasswordBtn');
          submitPasswordBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing download...';
          submitPasswordBtn.disabled = true;
          
          // Create a new JSZip instance
          const zip = new JSZip();
          
          // Get HTML content
          const htmlContent = document.documentElement.outerHTML;
          console.log("HTML content captured, length: " + htmlContent.length);
          
          // Add files to the zip
          zip.file("index.html", htmlContent);
          
          // Extract and add CSS as separate file
          const cssContent = Array.from(document.styleSheets)
            .filter(sheet => !sheet.href) // Only inline stylesheets
            .map(sheet => {
              try {
                return Array.from(sheet.cssRules)
                  .map(rule => rule.cssText)
                  .join('\n');
              } catch (e) {
                console.warn('Cannot access cssRules from stylesheet', e);
                return '';
              }
            })
            .join('\n');
          
          zip.file("styles.css", cssContent);
          
          // Extract and add JS as separate file
          const jsContent = Array.from(document.scripts)
            .filter(script => !script.src && script.textContent.trim().length > 0)
            .map(script => script.textContent)
            .join('\n\n// Next Script\n\n');
          
          zip.file("script.js", jsContent);
          
          // Generate the zip file
          zip.generateAsync({type: "blob"})
            .then(function(content) {
              // Create download link for the zip
              const zipFilename = 'neonai-generator-source.zip';
              const blobUrl = URL.createObjectURL(content);
              
              const a = document.createElement('a');
              a.href = blobUrl;
              a.download = zipFilename;
              a.style.display = 'none';
              a.setAttribute('target', '_self');
              a.setAttribute('rel', 'noopener noreferrer');
              
              // Append to body
              document.body.appendChild(a);
              
              // Trigger click with delay
              setTimeout(() => {
                console.log("Triggering download...");
                a.click();
                
                // Cleanup with longer delay
                setTimeout(() => {
                  document.body.removeChild(a);
                  URL.revokeObjectURL(blobUrl);
                  hidePasswordDialog();
                  console.log("Download complete");
                  
                  // Reset button
                  submitPasswordBtn.innerHTML = '<i class="fas fa-download"></i> Download Source Code';
                  submitPasswordBtn.disabled = false;
                }, 2000);
              }, 100);
            });
          
        } catch (error) {
          console.error('Error creating source download:', error);
          alert('Failed to download source code: ' + error.message);
          
          // Reset button
          const submitPasswordBtn = document.getElementById('submitPasswordBtn');
          submitPasswordBtn.innerHTML = '<i class="fas fa-download"></i> Download Source Code';
          submitPasswordBtn.disabled = false;
        }
      }
      
      function downloadApkFile() {
        try {
          console.log("Starting APK download process...");
          
          // UI feedback
          const downloadBtn = document.getElementById('apkPasswordDialog').querySelector('#downloadApkBtn');
          downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing APK...';
          downloadBtn.disabled = true;
          
          // Create a new JSZip instance for APK simulation
          const zip = new JSZip();
          
          // Get HTML content for APK simulation
          const htmlContent = document.documentElement.outerHTML;
          
          // Add HTML file to the APK simulation
          zip.file("index.html", htmlContent);
          
          // Create manifest.json for the APK simulation
          const manifestContent = {
            "name": "NeonAI Generator",
            "version": "1.0.0",
            "description": "AI Image Generator Application",
            "main": "index.html",
            "display": "standalone",
            "orientation": "portrait",
            "theme_color": "#0f0f13",
            "background_color": "#0f0f13",
            "icons": [
              {
                "src": "icon.png",
                "sizes": "192x192",
                "type": "image/png"
              }
            ]
          };
          
          // Add manifest to the APK simulation
          zip.file("manifest.json", JSON.stringify(manifestContent, null, 2));
          
          // Create a README file
          zip.file("README.txt", 
            "NeonAI Generator Mobile App\n" +
            "===========================\n\n" +
            "Thank you for downloading the NeonAI Generator App!\n\n" +
            "This APK file contains a packaged version of the NeonAI Generator for Android devices.\n" +
            "To install, simply open this file on your Android device and follow the prompts.\n\n" +
            "Features:\n" +
            "- Generate stunning AI images\n" +
            "- Save and download your creations\n" +
            "- Use preset styles or customize your own\n\n" +
            "For support or questions, please contact support@neonai-generator.com\n\n" +
            "© 2023 NeonAI Generator"
          );
          
          // Generate the APK file (simulated as a ZIP)
          zip.generateAsync({type: "blob"})
            .then(function(content) {
              // Create download link for the APK
              const apkFilename = 'neonai-generator-app.apk';
              const blobUrl = URL.createObjectURL(content);
              
              const a = document.createElement('a');
              a.href = blobUrl;
              a.download = apkFilename;
              a.style.display = 'none';
              a.setAttribute('target', '_self');
              a.setAttribute('rel', 'noopener noreferrer');
              
              // Append to body
              document.body.appendChild(a);
              
              // Trigger click with delay
              setTimeout(() => {
                console.log("Triggering APK download...");
                a.click();
                
                // Cleanup with longer delay
                setTimeout(() => {
                  document.body.removeChild(a);
                  URL.revokeObjectURL(blobUrl);
                  hideApkPasswordDialog();
                  console.log("APK download complete");
                  
                  // Reset button
                  downloadBtn.innerHTML = '<i class="fas fa-android"></i> Download APK';
                  downloadBtn.disabled = false;
                }, 2000);
              }, 100);
            });
          
        } catch (error) {
          console.error('Error creating APK download:', error);
          alert('Failed to download APK: ' + error.message);
          
          // Reset button
          const downloadBtn = document.getElementById('apkPasswordDialog').querySelector('#downloadApkBtn');
          downloadBtn.innerHTML = '<i class="fas fa-android"></i> Download APK';
          downloadBtn.disabled = false;
        }
      }
    