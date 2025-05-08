import React, { useState } from 'react';
import * as emailjs from "emailjs-com";
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from "../components/DarkModeToggle";

function Settings() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSent, setIsSent] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs.send(
      "service_f4sn5bj", 
      "template_ud9nxsg",
      formData,
      "B3sPGFgxCxjI0Tlbj"
    )
    .then(() => {
      setIsSent(true);
      setFormData({ name: "", email: "", message: "" });
    })
    .catch((error) => {
      console.error("Error sending message:", error);
    });
  };

  return (
    <>
    
      <div className="settings-header">
        <button onClick={() => navigate('/')} className="journalhome-button">🏠</button>
        <button onClick={() => navigate('/journal')} className="journalhome-button">📝</button>
        <button onClick={() => navigate('/history')} className="history-button">📖</button>
        <DarkModeToggle />
      </div>
    
       {/* Flex wrapper for form + about section */}
       
  <div className="settings-layout-wrapper">
  <div className="tip-box">
  <h3>☕ Leave a Tip</h3>
  <p>
    If this little app makes your day brighter, consider leaving a tiny tip! 🧁 
    It helps keep the journal free and supports future updates, big and small 💖
    Created by Shayna Marie
  </p>
  <a 
    href="https://paypal.me/Sylvariae?country.x=US&locale.x=en_US" 
    target="_blank" 
    rel="noopener noreferrer"
  >
    <button className="tip-button">Send a Tip</button>
  </a>
</div>

    {/* Contact Form Section */}
    <div className="settings-page-container">
      <div className="settings-form-wrapper">
        <h3 className="settings-title">Report a Bug or Issue</h3>
        {isSent && <p className="settings-success-message">Message sent successfully!</p>}

        <form onSubmit={handleSubmit} className="settings-contact-form">
          <label className="settings-label">Name:</label>
          <input
            className="settings-input"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label className="settings-label">Email:</label>
          <input
            className="settings-input"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label className="message-label">Message:</label>
          <textarea
            className="message-textarea"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>

          <button type="submit" className="message-submit-button">Send Message</button>
        </form>
      </div>
    </div>


    {/* About Section */}
    <div className="about-section-container">
      <h3>About Your Happy Little Journal💖</h3>
      <p>This little journaling app is your cozy corner to untangle thoughts, track emotions, and spot patterns in your day-to-day life. 
        Feeling chatty? Use the speech-to-text feature to vent out loud — no typing required.
        Need a bit of support? Our friendly AI (powered by Gemini, Google’s smart language model) gently offers feedback, encouragement, or insight based on what you share. 
        It’s like having a thoughtful buddy who actually listens.
        And yes, every entry — even the ones with AI reflections — can be saved, so you can revisit your thoughts anytime. Simple, supportive, and always here when you need to check in with yourself.</p>
      
      <p>Your journal entries are stored locally on your device — which means everything you write stays private and never leaves your browser unless you choose to export it. 
        This setup helps keep things simple and secure, but it also means your entries won’t automatically sync across devices. 
        If you switch browsers or clear your cache, your entries might not be there anymore.
        To help with that, the app lets you export your entries as a backup and import them later if needed. 
        It’s a good habit to export your journal occasionally — just in case your device resets or a glitch sneaks in. That way, your thoughts are safe and easy to restore whenever you need them.</p>
    </div>

     
     {/* Add to Home Screen Section */}
<div className="add-homescreen">
  <h3>📲 Add to Your Home Screen</h3>
  <p>Want quick access to your Happy Little Journal just like a regular app? You can add it to your phone’s home screen — no download needed!</p>

  <h4>For iPhone (Shortcuts App)</h4>
  <ul>
    <li>1. <strong>Open the Shortcuts App</strong> If you don’t have it, download “Shortcuts” from the App Store — it's a free Apple app.</li>
    <li>2. Tap the + (plus) button in the top right corner to create a new shortcut.</li>
    <li>3. In the search bar, type and select <strong>“Open URL.”</strong></li>
    <li>4. <strong>Tap “URL” </strong>and paste this link: <strong>https://myhappylittlejournal.com</strong></li>
    <li>5. Tap the arrow <strong>Open URLS⬅️</strong> at the top of the screen, and hit <strong>"Add to Home Screen"</strong></li>
    <li>6. You can customize your Icon name and picture</li>
    <li>7. Click <strong>"Add"</strong> and now you have an icon on your homescreen!</li>
  </ul>

  <h4>For Android </h4>
  <ul>
    <li>1. Open Chrome (or your preferred browser) on your phone.</li>
    <li>2. Visit: <strong>https://myhappylittlejournal.com</strong></li>
    <li>3. Tap the <strong>three dots menu (⋮)</strong> in the top-right corner.</li>
    <li>4. Select <strong>“Add to Home screen.”</strong></li>
    <li>5. Choose a name you'd like for your Journal!</li>
    <li>6. Tap <strong>“Add”</strong> — and confirm by dragging the icon or tapping “Add Automatically.”</li>
  </ul>

  <p>This way, your journal lives right on your phone’s home screen — just like an app, without taking up any space. 💖</p>
</div>

  </div>
</>

  );
}

export default Settings;
