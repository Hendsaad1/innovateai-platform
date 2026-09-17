import React from 'react';
import { EchoHeading } from '../../components/ui/EchoHeading';
import { Card } from '../../components/ui/Card';
import { Mail, MessageSquare, MapPin } from 'lucide-react';

export const PublicContact: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
      <div className="space-y-4 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">Get in Touch</span>
        <EchoHeading text="CONTACT US" size="lg" />
        <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          Have questions regarding recruitment, partnerships, or community events? Reach out to our staff leadership.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card glass className="text-center space-y-4 p-8">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-[#8B2FC9] mx-auto">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white">Official Email</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">contact@innovate-ai.community</p>
        </Card>

        <Card glass className="text-center space-y-4 p-8">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-[#8B2FC9] mx-auto">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white">Discord & Community</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">discord.gg/innovate-ai</p>
        </Card>

        <Card glass className="text-center space-y-4 p-8">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-[#8B2FC9] mx-auto">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white">University Campus</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Faculty of Engineering, AI Lab 402</p>
        </Card>
      </div>
    </div>
  );
};
