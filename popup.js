 
 
 document.addEventListener('DOMContentLoaded', ()=> {
  const authorizeBtn = document.getElementById('authorizeBtn');
  authorizeBtn.addEventListener('click', authorize);
});

function authorize() {
  const CLIENT_ID = '1043399388557-chu1tbavf44q1vb3khcntgee02ue3b2i.apps.googleusercontent.com'; // Replace with your actual client ID
  const SCOPES = 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.compose https://www.googleapis.com/auth/gmail.send ';
  
  const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
  const redirectUri = chrome.runtime.getManifest().oauth2.redirect_uris[0]; // Get redirect URI from manifest
  const scopes = [SCOPES];
  
  const url = `${oauth2Endpoint}?client_id=${'1043399388557-chu1tbavf44q1vb3khcntgee02ue3b2i.apps.googleusercontent.com'}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${encodeURIComponent(scopes.join(' '))}&prompt=consent`;
  
  
      chrome.identity.launchWebAuthFlow(
        {
          url: url,
          interactive: true
        },
        function(redirectUrl) {
          if (chrome.runtime.lastError) {
            console.error('Error in launching web auth flow:', chrome.runtime.lastError.message); // Log the error message
            return;
          }
      
        
      
      const accessToken = extractAccessToken(redirectUrl);
      
      console.log('Access Token:', accessToken);
      
      // Using the access token to make requests to the Gmail API
      fetch('https://www.googleapis.com/gmail/v1/users/me/profile', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      .then(response => response.json())
      .then(data => {
        console.log('Gmail Profile:', data);
        document.getElementById('content').innerText = JSON.stringify(data, null, 2); // Display profile in the <pre> tag
        
        // Once authorized, show the bulk email form
        document.getElementById('bulk_email_form').style.display = 'block';
        
        // Storing the access token in Chrome storage
        chrome.storage.local.set({ 'access_token': accessToken }, function() {
          console.log('Access token saved:', accessToken);
        });
      })
      .catch(error => {
        console.error('Error fetching Gmail profile:', error);
        // Error in fetching the user profile 
        document.getElementById('content').innerText = 'Error fetching profile'; 
      });
    }
  );
} 

// Helper function to extract access token from redirect URL
function extractAccessToken(url) {
  const accessTokenRegex = /access_token=([^&]+)/;
  const match = url.match(accessTokenRegex);
  if (match && match[1]) {
    return match[1];
  } else {
    console.error('Access token not found in URL:', url);
    return null;
  }
}



