# Muzi — Collaborative Music Spaces 🎶  

## 📖 Description  
Muzi is a collaborative music platform where friends can create spaces, queue songs, and enjoy music together in real time.  

-  **Spaces**: Admins create spaces, users join to add songs.  
-  **Voting System**: Songs rearrange dynamically based on votes.  
-  **Queue Behavior**: Before playback, songs reshuffle live with votes; once a track starts, the first song locks while others keeps on rearranging based on votes.  
-  **Admin Controls**: Manage spaces, change roles, and delete any song.  
-  **User Controls**: Add songs, vote on all, and delete only their own.  
-  **Realtime Updates**: All add/delete/vote events are powered by **Socket.IO**, making the experience seamless and live.  

🔗 **Live App:** [Muzi on Render](https://muzi-frontend.onrender.com)  
> ⚠️ Note: Since the app is hosted on Render free tier, the server may take up to **1 minute to wake up**
---

## 🛠️ Tech Stack  
- **Frontend:** React, Material-UI (MUI), Socket.IO Client  
- **Backend:** Node.js, Express, Socket.IO  
- **Database:** MongoDB  

---

## 🚀 Installation & Setup  

1. **Clone the repository**  
   ```bash
   git clone https://github.com/Ajay-Subramaniam/Muzi.git
   cd Muzi
2. **Setup Environment Variables**  
   - There are already .env.sample files present in both frontend/ and backend/ folders.
   - Open each .env.sample, populate the fields, and rename the file to .env
3. **Run the Backend**  
   ```bash
   cd backend
   npm install
   node server.js
4. **Run the Frontend**  
   ```bash
   cd frontend
   npm install
   npm run dev
5. Open http://localhost:5173 in your browser.


