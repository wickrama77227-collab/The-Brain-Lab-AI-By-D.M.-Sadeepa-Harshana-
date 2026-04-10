/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Brain, 
  Sparkles, 
  MessageCircle, 
  BookOpen, 
  Heart, 
  Zap, 
  Wind, 
  ChevronRight,
  Send,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getGeminiResponse } from '@/lib/gemini';

const CATEGORIES = [
  {
    id: 'psychology',
    title: 'මනෝවිද්‍යාව (Psychology)',
    icon: <Brain className="w-5 h-5" />,
    description: 'මිනිස් හැසිරීම් සහ සිතුවිලි පිටුපස ඇති විද්‍යාව.',
    content: [
      { q: 'මනෝවිද්‍යාව යනු කුමක්ද?', a: 'මනෝවිද්‍යාව යනු මිනිස් මනස සහ හැසිරීම පිළිබඳ විද්‍යාත්මක අධ්‍යයනයයි. මෙයට සිතුවිලි, හැඟීම් සහ පෙළඹවීම් ඇතුළත් වේ.' },
      { q: 'පෞරුෂය හැඩගැසෙන්නේ කෙසේද?', a: 'පෞරුෂය ජානමය සාධක (Nature) සහ පරිසරය (Nurture) යන දෙකෙහිම එකතුවකින් හැඩගැසෙයි.' },
      { q: 'සංජානන මනෝවිද්‍යාව යනු කුමක්ද?', a: 'අප තොරතුරු ලබා ගන්නා, මතක තබා ගන්නා සහ තීරණ ගන්නා ආකාරය පිළිබඳ අධ්‍යයනයයි.' }
    ]
  },
  {
    id: 'neuroscience',
    title: 'ස්නායු විද්‍යාව (Neuroscience)',
    icon: <Zap className="w-5 h-5" />,
    description: 'මොළයේ ව්‍යුහය සහ ක්‍රියාකාරිත්වය.',
    content: [
      { q: 'මොළයේ ප්‍රධාන කොටස් මොනවාද?', a: 'මොළය ප්‍රධාන වශයෙන් මස්තිෂ්කය (Cerebrum), අනුමස්තිෂ්කය (Cerebellum) සහ මොළයේ කඳ (Brainstem) ලෙස බෙදා ඇත.' },
      { q: 'ස්නායු සම්ප්‍රේෂක (Neurotransmitters) යනු මොනවාද?', a: 'ස්නායු සෛල අතර පණිවිඩ හුවමාරු කරන රසායනික ද්‍රව්‍ය වේ. උදා: ඩොපමයින්, සෙරොටොනින්.' },
      { q: 'මොළයේ නම්‍යශීලීභාවය (Neuroplasticity) යනු කුමක්ද?', a: 'අත්දැකීම් මත පදනම්ව මොළය තමාගේ ව්‍යුහය වෙනස් කර ගැනීමට ඇති හැකියාවයි.' }
    ]
  },
  {
    id: 'mindfulness',
    title: 'සතිමත්භාවය (Mindfulness)',
    icon: <Wind className="w-5 h-5" />,
    description: 'වර්තමාන මොහොත පිළිබඳ අවබෝධය.',
    content: [
      { q: 'සතිමත්භාවය යනු කුමක්ද?', a: 'විනිශ්චයකින් තොරව වර්තමාන මොහොත පිළිබඳව සම්පූර්ණ අවධානය යොමු කිරීමයි.' },
      { q: 'භාවනාවේ වාසි මොනවාද?', a: 'මානසික ආතතිය අඩු කිරීම, අවධානය වැඩි කිරීම සහ චිත්තවේගීය සමබරතාවය ඇති කිරීම.' },
      { q: 'සතිමත්භාවය පුහුණු කරන්නේ කෙසේද?', a: 'හුස්ම ගැනීම කෙරෙහි අවධානය යොමු කිරීම, ශරීරය පිළිබඳ අවධානය යොමු කිරීම වැනි සරල අභ්‍යාස මගින්.' }
    ]
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [dailyTip, setDailyTip] = useState('මනස සන්සුන්ව තබා ගැනීමට දිනකට විනාඩි 5ක් හුස්ම ගැනීම කෙරෙහි අවධානය යොමු කරන්න.');

  useEffect(() => {
    const fetchDailyTip = async () => {
      const tip = await getGeminiResponse("මනස සන්සුන්ව තබා ගැනීම සඳහා කෙටි උපදෙසක් සිංහලෙන් ලබා දෙන්න. එය වචන 20කට වඩා අඩු විය යුතුය.");
      if (tip) setDailyTip(tip);
    };
    fetchDailyTip();
  }, []);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsTyping(true);

    const aiMsg = await getGeminiResponse(userMsg, "You are an expert in psychology and mental health. Answer the user's question in Sinhala. Be empathetic and clear.");
    setChatMessages(prev => [...prev, { role: 'ai', text: aiMsg || 'කණගාටුයි, මට පිළිතුරක් ලබා දිය නොහැක.' }]);
    setIsTyping(false);
  };

  return (
    <div className="min-h-screen bg-[#fdfcfb] text-slate-900 font-sans selection:bg-orange-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-orange-500 p-1.5 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">මනස හඳුනාගනිමු</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => setActiveTab('home')} className={`text-sm font-medium transition-colors ${activeTab === 'home' ? 'text-orange-600' : 'text-slate-500 hover:text-slate-800'}`}>මුල් පිටුව</button>
            <button onClick={() => setActiveTab('learn')} className={`text-sm font-medium transition-colors ${activeTab === 'learn' ? 'text-orange-600' : 'text-slate-500 hover:text-slate-800'}`}>ඉගෙන ගන්න</button>
            <button onClick={() => setActiveTab('chat')} className={`text-sm font-medium transition-colors ${activeTab === 'chat' ? 'text-orange-600' : 'text-slate-500 hover:text-slate-800'}`}>ප්‍රශ්න අසන්න</button>
          </nav>
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">සිංහල</Badge>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {/* Hero Section */}
              <section className="text-center space-y-6 py-12">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block p-3 bg-orange-100 rounded-full mb-4"
                >
                  <Sparkles className="w-8 h-8 text-orange-600" />
                </motion.div>
                <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight">
                  ඔබේ මනසෙහි රහස් <br /> <span className="text-orange-600">අදම සොයා යන්න</span>
                </h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  මනෝවිද්‍යාව, මොළයේ ක්‍රියාකාරිත්වය සහ සතිමත්භාවය පිළිබඳව සරල සිංහලෙන් ඉගෙන ගැනීමට ඇති හොඳම අවස්ථාව.
                </p>
                <div className="flex flex-wrap justify-center gap-4 pt-4">
                  <Button size="lg" onClick={() => setActiveTab('learn')} className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-8">
                    ඉගෙනීම ආරම්භ කරන්න
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => setActiveTab('chat')} className="rounded-full px-8 border-slate-200">
                    AI සමග කතා කරන්න
                  </Button>
                </div>
              </section>

              {/* Daily Tip Card */}
              <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-100 overflow-hidden relative">
                <div className="absolute -right-12 -top-12 w-48 h-48 bg-orange-200/20 rounded-full blur-3xl" />
                <CardHeader>
                  <div className="flex items-center gap-2 text-orange-600 mb-2">
                    <Heart className="w-5 h-5 fill-current" />
                    <span className="text-xs font-bold uppercase tracking-wider">අද දවසේ උපදෙස</span>
                  </div>
                  <CardTitle className="text-2xl font-bold text-slate-800 leading-relaxed">
                    "{dailyTip}"
                  </CardTitle>
                </CardHeader>
              </Card>

              {/* Features Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                {CATEGORIES.map((cat, idx) => (
                  <Card key={cat.id} className="hover:shadow-xl transition-all duration-300 border-slate-100 group cursor-pointer" onClick={() => setActiveTab('learn')}>
                    <CardHeader>
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-600 group-hover:bg-orange-600 group-hover:text-white transition-colors mb-4">
                        {cat.icon}
                      </div>
                      <CardTitle className="text-xl">{cat.title}</CardTitle>
                      <CardDescription>{cat.description}</CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <div className="flex items-center text-sm font-medium text-orange-600">
                        වැඩිදුර කියවන්න <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'learn' && (
            <motion.div
              key="learn"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                  <BookOpen className="w-8 h-8 text-orange-600" />
                  විෂය කරුණු
                </h2>
                <Button variant="ghost" onClick={() => setActiveTab('home')} className="text-slate-500">ආපසු</Button>
              </div>

              <Tabs defaultValue="psychology" className="w-full">
                <TabsList className="grid grid-cols-3 w-full max-w-2xl mx-auto mb-8 bg-slate-100 p-1 rounded-xl">
                  {CATEGORIES.map(cat => (
                    <TabsTrigger key={cat.id} value={cat.id} className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm">
                      {cat.title.split(' ')[0]}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {CATEGORIES.map(cat => (
                  <TabsContent key={cat.id} value={cat.id} className="space-y-6">
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-orange-100 rounded-2xl text-orange-600">
                          {cat.icon}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-slate-800">{cat.title}</h3>
                          <p className="text-slate-500">{cat.description}</p>
                        </div>
                      </div>
                      
                      <Accordion type="single" collapsible className="w-full">
                        {cat.content.map((item, i) => (
                          <AccordionItem key={i} value={`item-${i}`} className="border-slate-100">
                            <AccordionTrigger className="text-left text-lg font-medium hover:text-orange-600 hover:no-underline">
                              {item.q}
                            </AccordionTrigger>
                            <AccordionContent className="text-slate-600 text-base leading-relaxed py-4">
                              {item.a}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </motion.div>
          )}

          {activeTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="h-[calc(100vh-12rem)] flex flex-col"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                  <MessageCircle className="w-8 h-8 text-orange-600" />
                  AI සමග කතා කරන්න
                </h2>
                <Button variant="ghost" onClick={() => setActiveTab('home')} className="text-slate-500">ආපසු</Button>
              </div>

              <Card className="flex-1 flex flex-col overflow-hidden border-slate-100 shadow-lg rounded-3xl">
                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-6 max-w-3xl mx-auto">
                    {chatMessages.length === 0 && (
                      <div className="text-center py-12 space-y-4">
                        <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto">
                          <Brain className="w-8 h-8 text-orange-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-800">මම ඔබට උදව් කරන්නේ කෙසේද?</h3>
                        <p className="text-slate-500">මනෝවිද්‍යාව හෝ මානසික සෞඛ්‍යය පිළිබඳ ඕනෑම දෙයක් සිංහලෙන් අසන්න.</p>
                        <div className="flex flex-wrap justify-center gap-2 pt-4">
                          {['මානසික ආතතිය අඩු කරන්නේ කෙසේද?', 'මොළයේ ක්‍රියාකාරිත්වය වැඩි කරන්නේ කොහොමද?', 'සතිමත්භාවය යනු කුමක්ද?'].map(q => (
                            <Button key={q} variant="outline" size="sm" onClick={() => setChatInput(q)} className="rounded-full border-slate-200 hover:border-orange-200 hover:bg-orange-50">
                              {q}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                    {chatMessages.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] p-4 rounded-2xl ${
                          msg.role === 'user' 
                            ? 'bg-orange-600 text-white rounded-tr-none' 
                            : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                        }`}>
                          <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        </div>
                      </motion.div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-orange-600" />
                          <span className="text-sm text-slate-500">පිළිතුර සකසමින්...</span>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                <div className="p-4 bg-slate-50 border-t border-slate-100">
                  <div className="max-w-3xl mx-auto flex gap-2">
                    <Input 
                      placeholder="ඔබේ ප්‍රශ්නය මෙහි ලියන්න..." 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1 bg-white border-slate-200 rounded-full px-6 focus-visible:ring-orange-500"
                    />
                    <Button 
                      onClick={handleSendMessage} 
                      disabled={isTyping || !chatInput.trim()}
                      className="bg-orange-600 hover:bg-orange-700 text-white rounded-full w-12 h-12 p-0 flex items-center justify-center shrink-0"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-4 py-12 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-sm">
          © 2026 මනස හඳුනාගනිමු. සියලුම හිමිකම් ඇවිරිණි. <br />
          <span className="text-xs mt-2 block italic">මෙම තොරතුරු අධ්‍යාපනික අරමුණු සඳහා පමණක් වන අතර වෛද්‍ය උපදෙස් සඳහා සුදුසුකම් ලත් වෛද්‍යවරයෙකු හමුවන්න.</span>
        </p>
      </footer>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-lg border border-slate-200 shadow-2xl rounded-full px-6 py-3 flex items-center gap-8 z-50">
        <button onClick={() => setActiveTab('home')} className={`p-2 rounded-full transition-colors ${activeTab === 'home' ? 'text-orange-600 bg-orange-50' : 'text-slate-400'}`}>
          <Brain className="w-6 h-6" />
        </button>
        <button onClick={() => setActiveTab('learn')} className={`p-2 rounded-full transition-colors ${activeTab === 'learn' ? 'text-orange-600 bg-orange-50' : 'text-slate-400'}`}>
          <BookOpen className="w-6 h-6" />
        </button>
        <button onClick={() => setActiveTab('chat')} className={`p-2 rounded-full transition-colors ${activeTab === 'chat' ? 'text-orange-600 bg-orange-50' : 'text-slate-400'}`}>
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
