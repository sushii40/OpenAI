import { Navbar } from '@/components/layout/Navbar';
import { DairyChatbot } from '@/components/chatbot/DairyChatbot';

export default function Chatbot() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-6">
        <DairyChatbot />
      </main>
    </div>
  );
}
