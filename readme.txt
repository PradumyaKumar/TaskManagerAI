How AI Is Used:

Project data is sent to Gemini 2.5 Flash

AI is prompted to return strict JSON only

Defensive parsing ensures:

Markdown is stripped

Truncated JSON is detected

Errors never crash the app

If AI is unavailable or rate-limited, the system returns graceful fallback insights

This design mirrors how real-world SaaS products safely integrate LLMs.

I have added a regeneration button on web page.


Setup:
  backend:
    cd backend
    npm install
	set GEMINI_API_KEY=your_api_key_here
  frontend:
     cd frontend
     npm install
     npm run dev
    

  
