
import { GoogleGenerativeAI } from "@google/generative-ai";

// const businessInfo = `

// General Business Information:
// Website: www.yourbusiness.com

// Return Policy:
// Customers can return products within 30 days of purchase with the original receipt.
// Items must be unused and in their original packaging.
// Refunds will be processed to the original payment method.

// Support Email: support@yourbusiness.com

// Madrid Location:
// Address: Calle Mayor 123, 28013 Madrid, Spain
// Phone: +34 91 123 4567
// Email: madrid@yourbusiness.com
// Opening Hours:
// Monday to Friday: 10:00 AM to 8:00 PM
// Saturday: 10:00 AM to 6:00 PM
// Sunday: Closed

// New York Location:
// Address: 456 Broadway, New York, NY 10012, USA
// Phone: +1 212-123-4567
// Email: newyork@yourbusiness.com
// Opening Hours:
// Monday to Friday: 9:00 AM to 7:00 PM
// Saturday: 10:00 AM to 5:00 PM
// Sunday: Closed

// FAQs:
// General:
// What is your return policy?

// You can return items within 30 days with the original receipt and packaging. Refunds are processed to the original payment method.
// Do you ship internationally?

// Yes, we ship to most countries. Shipping rates and delivery times vary by location.
// How can I track my order?

// You will receive a tracking number via email once your order is shipped.
// Can I cancel or modify my order?

// Orders can be modified or canceled within 24 hours. Please contact support@yourbusiness.com.
// Madrid Location:
// What are your opening hours in Madrid?

// Monday to Friday: 10:00 AM to 8:00 PM
// Saturday: 10:00 AM to 6:00 PM
// Sunday: Closed
// Is parking available at the Madrid store?

// Yes, we offer parking nearby. Contact us for details.
// How can I contact the Madrid store?

// You can call us at +34 91 123 4567 or email madrid@yourbusiness.com.
// New York Location:
// What are your opening hours in New York?

// Monday to Friday: 9:00 AM to 7:00 PM
// Saturday: 10:00 AM to 5:00 PM
// Sunday: Closed
// Do you host events at the New York location?

// Yes, we host regular workshops and community events. Check our website for updates.
// How can I contact the New York store?

// You can call us at +1 212-123-4567 or email newyork@yourbusiness.com.

// Tone Instructions:
// Conciseness: Respond in short, informative sentences.
// Formality: Use polite language with slight formality (e.g., "Please let us know," "We are happy to assist").
// Clarity: Avoid technical jargon unless necessary.
// Consistency: Ensure responses are aligned in tone and style across all queries.
// Example: "Thank you for reaching out! Please let us know if you need further assistance."

// `;



const businessInfo = `

General Business Information:
Company Name: Radoms Digital
Website: https://www.radomsdigital.com/
Industry: Digital Solutions & IT Services
Founded: 2022 (2+ years in business)
Happy Customers: 10+ satisfied clients globally

About Us:
Radoms Digital is a full-service digital agency specializing in web development, mobile apps, UI/UX design, and digital marketing. We transform ideas into powerful digital experiences.

Core Services:
1. Web Development (React, Angular, Node.js)
2. Mobile App Development (iOS & Android)
3. UI/UX Design
4. Digital Marketing (SEO, PPC, Social Media)
5. E-commerce Solutions
6. Cloud Solutions

Working Hours:
Monday to Saturday: 10:00 AM to 7:00 PM (IST)

Sunday: Closed

Contact Information:
Email: info@radomsdigital.com
Phone: +91 9876543210
Address: 123 Tech Park, Sector 15, Noida, Uttar Pradesh 201301, India

FAQs:
General:
What services does Radoms Digital offer?

We offer web development, mobile apps, UI/UX design, digital marketing, e-commerce solutions, and cloud services.
How long has Radoms Digital been in business?

We've been delivering digital solutions since 2018 (over 6 years).
Can I see your portfolio?

Yes! Visit our website at https://www.radomsdigital.com/portfolio
Do you work with international clients?

Absolutely! We serve clients globally with remote collaboration.

Projects:
What technologies do you use for web development?

We primarily use React, Angular, Node.js, and modern JavaScript frameworks.
How long does a typical website project take?

Basic websites take 2-4 weeks, complex projects may take 8-12 weeks.
Do you provide maintenance after project completion?

Yes, we offer flexible maintenance packages.
Can you redesign my existing website?

Certainly! We specialize in website revamps and modernization.

Pricing:
What's your pricing model?

We offer project-based pricing and hourly rates depending on requirements.
Do you provide free consultations?

Yes, we offer free 30-minute consultations for new projects.
Are there any hidden costs?

No, we provide transparent pricing with detailed estimates.

Client Support:
How can I track my project progress?

We provide regular updates via email and project management tools.
What if I need changes during development?

We accommodate reasonable changes during development phases.
How do you handle project communication?

We assign a dedicated project manager for smooth communication.

Tone Instructions:
Conciseness: Respond in short, informative sentences.
Formality: Use friendly yet professional language.
Clarity: Explain technical terms when necessary.
Approachability: Maintain a helpful, solution-oriented tone.
Example: "Thanks for your interest in Radoms Digital! We'd be happy to discuss your project requirements."

Success Stories:
- Built e-commerce platform for fashion brand (300% revenue growth)
- Developed healthcare app with 50,000+ downloads
- Redesigned corporate website with 200% traffic increase
`;

const API_KEY = "AIzaSyDXgxkFeiwhdxzO67ElHqRMZteOAbrp-50";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash",
    systemInstruction: businessInfo
});

let messages = {
    history: [],
}

async function sendMessage() {

    console.log(messages);
    const userMessage = document.querySelector(".chat-window input").value;
    
    if (userMessage.length) {

        try {
            document.querySelector(".chat-window input").value = "";
            document.querySelector(".chat-window .chat").insertAdjacentHTML("beforeend",`
                <div class="user">
                    <p>${userMessage}</p>
                </div>
            `);

            document.querySelector(".chat-window .chat").insertAdjacentHTML("beforeend",`
                <div class="loader"></div>
            `);

            const chat = model.startChat(messages);

            let result = await chat.sendMessageStream(userMessage);
            
            document.querySelector(".chat-window .chat").insertAdjacentHTML("beforeend",`
                <div class="model">
                    <p></p>
                </div>
            `);
            
            let modelMessages = '';

            for await (const chunk of result.stream) {
              const chunkText = chunk.text();
              modelMessages = document.querySelectorAll(".chat-window .chat div.model");
              modelMessages[modelMessages.length - 1].querySelector("p").insertAdjacentHTML("beforeend",`
                ${chunkText}
            `);
            }

            messages.history.push({
                role: "user",
                parts: [{ text: userMessage }],
            });

            messages.history.push({
                role: "model",
                parts: [{ text: modelMessages[modelMessages.length - 1].querySelector("p").innerHTML }],
            });

        } catch (error) {
            document.querySelector(".chat-window .chat").insertAdjacentHTML("beforeend",`
                <div class="error">
                    <p>The message could not be sent. Please try again.</p>
                </div>
            `);
        }

        document.querySelector(".chat-window .chat .loader").remove();
        
    }
}

document.querySelector(".chat-window .input-area button")
.addEventListener("click", ()=>sendMessage());

document.querySelector(".chat-button")
.addEventListener("click", ()=>{
    document.querySelector("body").classList.add("chat-open");
});

document.querySelector(".chat-window button.close")
.addEventListener("click", ()=>{
    document.querySelector("body").classList.remove("chat-open");
    
});


// Bubble animation
document.addEventListener('DOMContentLoaded', function() {
    const chatWindow = document.querySelector('.chat-window');
    if (chatWindow) {
        const bubblesContainer = document.createElement('div');
        bubblesContainer.className = 'bubbles-container';
        
        // Create 10 bubbles
        for (let i = 0; i < 10; i++) {
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            
            // Random properties
            const size = Math.random() * 20 + 4;
            const left = Math.random() * 90;
            const duration = Math.random() * 15 + 10;
            const delay = Math.random() * 5;
            
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            bubble.style.left = `${left}%`;
            bubble.style.top = '90%';
            bubble.style.animationDuration = `${duration}s`;
            bubble.style.animationDelay = `${delay}s`;
            
            bubblesContainer.appendChild(bubble);
        }
        
        chatWindow.insertBefore(bubblesContainer, chatWindow.firstChild);
    }
});


