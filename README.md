## Demo on Vercel

[Demo Chat](https://chat.bunyaminerdal.dev/)

## How to Use
The application has a simple usage for demonstration purposes.
You can only log in with a chat ID. If the chat ID you want to log in with exists in the database, you will be logged in. Otherwise, it will be added.
You can also add another chat ID you want to chat with by clicking the "Add Contact" button.
When creating a chat room, the system will search the database using only the chat ID.
If the person you entered with the chat ID is exists, the chat room will be automatically added for both of you.
The list of chat rooms will be visible on the dashboard.
Happy Chats!

## Getting Started
### First clone repository 
```bash
git clone https://github.com/bunyaminerdal/berdal-chat.git
```
### Go to project directory
```bash
cd berdal-chat
```
### Install node modules
```bash
npm install
```
### Set up env
rename .example.env to .env and fill properly with your [supabase](https://supabase.com/) account

### push prisma schema to your db
```bash
npx prisma db push
```
get more information about [prisma](https://www.prisma.io/docs)

### run locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.



