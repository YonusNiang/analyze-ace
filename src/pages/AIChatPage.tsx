import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, MessageSquare, BarChart3, TrendingUp, Lightbulb, Bot, User, Download, Share2, Settings } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  chartData?: Record<string, unknown>;
}

const AIChatPage = () => {
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
    'Create a forecast for next quarter',
    'Identify anomalies in my data',
    'What marketing channels are most effective?',
    'Show me user behavior patterns'
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

    // Simulate AI response with more sophisticated logic
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
      return 'Based on your revenue data, I can see that your monthly recurring revenue has increased by 15% compared to last month. The SaaS segment shows the strongest growth at 18%, while e-commerce is up 12%. Your top revenue drivers are subscription renewals and enterprise deals. Would you like me to create a detailed revenue breakdown chart?';
    }
    
    if (lowerQuery.includes('product') || lowerQuery.includes('performing')) {
      return 'Your top performing products this month are: 1) Premium SaaS Plan (32% of revenue), 2) Enterprise Solution (28% of revenue), 3) Basic Plan (18% of revenue). The Premium plan shows 25% higher conversion rates and 40% lower churn compared to other products. I recommend focusing marketing efforts on the Premium tier.';
    }
    
    if (lowerQuery.includes('customer') || lowerQuery.includes('retention')) {
      return 'I\'ve analyzed your customer retention data and found that users who engage with your platform within the first 48 hours have 3x higher retention rates. Your 30-day retention is 78%, which is above industry average. The biggest drop-off occurs at day 7. I recommend implementing an onboarding email sequence to improve early engagement.';
    }
    
    if (lowerQuery.includes('marketing') || lowerQuery.includes('channel')) {
      return 'Your marketing attribution analysis shows: Email campaigns have the highest ROI at 340%, followed by social media at 280%, and paid search at 220%. Organic search drives 45% of your traffic but has a lower conversion rate. I recommend increasing your email marketing budget and optimizing your organic content strategy.';
    }
    
    if (lowerQuery.includes('anomaly') || lowerQuery.includes('unusual')) {
      return 'I\'ve identified several anomalies in your data: 1) A 150% traffic spike on Tuesday correlated with your content marketing campaign, 2) Mobile conversion rates dropped 22% last week, 3) User acquisition costs decreased by 25% this week. The mobile issue appears to be related to a recent app update. Would you like me to investigate further?';
    }
    
    if (lowerQuery.includes('forecast') || lowerQuery.includes('predict')) {
      return 'Based on current trends and seasonal patterns, I predict: Q4 revenue will increase by 23% compared to Q3, primarily driven by holiday campaigns. User acquisition costs will remain stable, and conversion rates should improve by 8% with your planned optimizations. The forecast confidence level is 85%.';
    }

    // Default responses for other queries
    const responses = [
      'I\'ve analyzed your data and found some interesting patterns. Your key metrics are trending positively, with revenue up 15% and user engagement increasing by 12%. Would you like me to dive deeper into any specific area?',
      'Based on your business data, I can see opportunities for optimization. Your conversion funnel shows a 15% drop-off at the checkout stage. I recommend A/B testing your checkout process to improve completion rates.',
      'Looking at your user behavior data, I notice that customers who use your mobile app have 40% higher lifetime value. Consider prioritizing mobile experience improvements to boost overall revenue.',
      'Your data shows strong growth in the SaaS segment, with 18% month-over-month increase. However, there\'s room for improvement in the e-commerce vertical. Would you like me to create a detailed comparison analysis?',
      'I\'ve identified that your email marketing campaigns have the highest ROI at 340%. Your open rates are 15% above industry average, but click-through rates could be improved by 25% with better subject line optimization.'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSuggestedQuery = (query: string) => {
    setInput(query);
  };

  const exportChat = () => {
    const chatContent = messages.map(msg => 
      `${msg.isUser ? 'User' : 'AI'}: ${msg.content} (${msg.timestamp.toLocaleString()})`
    ).join('\n\n');
    
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-chat-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary rounded-lg">
            <MessageSquare className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">AI Data Analyst</h1>
            <p className="text-sm text-muted-foreground">
              Powered by advanced analytics and machine learning
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Bot className="h-3 w-3" />
            <span>Online</span>
          </Badge>
          <Button variant="outline" size="sm" onClick={exportChat}>
            <Download className="h-4 w-4 mr-2" />
            Export Chat
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

             {/* Chat Area */}
       <div className="flex-1 flex flex-col">
         <ScrollArea className="flex-1 p-6 pb-0" ref={scrollAreaRef}>
           <div className="space-y-6 max-w-4xl mx-auto mb-8">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex items-start space-x-3 max-w-[70%] ${
                    message.isUser ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div className={`p-3 rounded-full ${
                    message.isUser ? 'bg-primary' : 'bg-muted'
                  }`}>
                    {message.isUser ? (
                      <User className="h-4 w-4 text-primary-foreground" />
                    ) : (
                      <Bot className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div
                    className={`p-4 rounded-lg ${
                      message.isUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border border-border'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <span className="text-xs opacity-70 mt-2 block">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3">
                  <div className="p-3 rounded-full bg-muted">
                    <Bot className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="p-4 rounded-lg bg-card border border-border">
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

                 {/* Suggested Queries */}
         {messages.length === 1 && (
           <div className="p-6 border-t border-border mt-12">
             <div className="max-w-4xl mx-auto">
               <p className="text-sm font-medium text-muted-foreground mb-4">Try asking:</p>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                 {suggestedQueries.map((query, index) => (
                   <Button
                     key={index}
                     variant="outline"
                     size="sm"
                     onClick={() => handleSuggestedQuery(query)}
                     className="text-xs h-auto p-3 text-left hover:bg-muted/50"
                   >
                     {query}
                   </Button>
                 ))}
               </div>
             </div>
           </div>
         )}

        {/* Input Area */}
        <div className="p-6 border-t border-border">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="flex space-x-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me about your data, trends, insights, or create charts..."
                disabled={isLoading}
                className="flex-1 text-base"
              />
              <Button type="submit" disabled={isLoading || !input.trim()} size="lg">
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-2">
              I can analyze your data, create visualizations, identify trends, and provide actionable insights.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatPage; 