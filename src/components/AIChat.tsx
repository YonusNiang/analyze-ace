import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, MessageSquare, BarChart3, TrendingUp, Lightbulb, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  chartData?: Record<string, unknown>;
}

interface AIChatProps {
  className?: string;
}

export const AIChat = ({ className }: AIChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI data analyst. I can help you analyze your business data, create charts, and provide insights. What would you like to explore today?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const suggestedQueries = [
    'Show me revenue trends for the last 6 months',
    'What are my top performing products?',
    'Compare this month\'s sales to last month',
    'Analyze customer retention rates',
    'Create a forecast for next quarter'
  ];

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(input),
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    // More sophisticated response generation based on query content
    if (lowerQuery.includes('revenue') || lowerQuery.includes('sales')) {
      return 'Your revenue has increased by 15% this month. The SaaS segment shows strongest growth at 18%. Top drivers are subscription renewals and enterprise deals.';
    }
    
    if (lowerQuery.includes('product') || lowerQuery.includes('performing')) {
      return 'Top products: Premium SaaS Plan (32% revenue), Enterprise Solution (28%), Basic Plan (18%). Premium shows 25% higher conversion rates.';
    }
    
    if (lowerQuery.includes('customer') || lowerQuery.includes('retention')) {
      return 'Users engaging within 48 hours have 3x higher retention. Your 30-day retention is 78% (above average). Biggest drop-off at day 7.';
    }
    
    if (lowerQuery.includes('marketing') || lowerQuery.includes('channel')) {
      return 'Email campaigns have highest ROI at 340%, social media at 280%, paid search at 220%. Organic search drives 45% of traffic.';
    }
    
    if (lowerQuery.includes('anomaly') || lowerQuery.includes('unusual')) {
      return 'Found anomalies: 150% traffic spike Tuesday, mobile conversion dropped 22% last week, acquisition costs decreased 25% this week.';
    }

    // Default responses
    const responses = [
      'Based on your data, I can see interesting patterns. Your revenue has increased by 15% compared to last month, with the highest growth in the SaaS segment.',
      'I\'ve analyzed your customer data and found that retention rates are strongest among users who engage with your platform within the first 48 hours.',
      'Looking at your sales trends, there\'s a clear seasonal pattern with peaks in Q4. I recommend increasing inventory by 20% before the holiday season.',
      'Your marketing attribution analysis shows that email campaigns have the highest ROI at 340%, followed by social media at 280%.',
      'I\'ve identified an anomaly in your user acquisition costs - they\'ve decreased by 25% this week, which suggests your recent optimization efforts are working well.'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSuggestedQuery = (query: string) => {
    setInput(query);
  };

  return (
    <Card className={`flex flex-col h-full ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5" />
          <span>AI Data Analyst</span>
          <Badge variant="secondary" className="ml-auto">
            <Bot className="h-3 w-3 mr-1" />
            Online
          </Badge>
        </CardTitle>
      </CardHeader>
             <CardContent className="flex-1 flex flex-col space-y-3 pb-3">
        <ScrollArea className="flex-1 max-h-32" ref={scrollAreaRef}>
          <div className="space-y-4 pr-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex items-start space-x-2 max-w-[80%] ${
                    message.isUser ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                                     <div className={`p-2 rounded-full ${
                     message.isUser ? 'bg-primary' : 'bg-card border border-border'
                   }`}>
                     {message.isUser ? (
                       <User className="h-3 w-3 text-primary-foreground" />
                     ) : (
                       <Bot className="h-3 w-3 text-muted-foreground" />
                     )}
                   </div>
                                     <div
                     className={`p-3 rounded-lg ${
                       message.isUser
                         ? 'bg-primary text-primary-foreground'
                         : 'bg-card border border-border'
                     }`}
                   >
                     <p className="text-sm">{message.content}</p>
                     <span className="text-xs opacity-70 mt-1 block">
                       {message.timestamp.toLocaleTimeString()}
                     </span>
                   </div>
                </div>
              </div>
            ))}
                         {isLoading && (
               <div className="flex justify-start">
                 <div className="flex items-start space-x-2">
                   <div className="p-2 rounded-full bg-card border border-border">
                     <Bot className="h-3 w-3 text-muted-foreground" />
                   </div>
                   <div className="p-3 rounded-lg bg-card border border-border">
                     <div className="flex space-x-1">
                       <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                       <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                       <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                     </div>
                   </div>
                 </div>
               </div>
             )}
          </div>
        </ScrollArea>

                 {messages.length === 1 && (
           <div className="space-y-2 mt-2">
             <p className="text-sm font-medium text-muted-foreground">Try asking:</p>
             <div className="flex flex-wrap gap-1">
               {suggestedQueries.slice(0, 2).map((query, index) => (
                 <Button
                   key={index}
                   variant="outline"
                   size="sm"
                   onClick={() => handleSuggestedQuery(query)}
                   className="text-xs hover:bg-muted/50 text-[10px] px-2 py-1"
                 >
                   {query}
                 </Button>
               ))}
             </div>
           </div>
         )}

                 <form onSubmit={handleSubmit} className="flex space-x-2 pt-1">
           <Input
             value={input}
             onChange={(e) => setInput(e.target.value)}
             placeholder="Ask me about your data..."
             disabled={isLoading}
             className="flex-1"
           />
           <Button type="submit" disabled={isLoading || !input.trim()} size="sm">
             <Send className="h-4 w-4" />
           </Button>
         </form>
      </CardContent>
    </Card>
  );
};