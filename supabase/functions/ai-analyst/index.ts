import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();

    if (!message || !userId) {
      throw new Error('Message and userId are required');
    }

    // Initialize Supabase client with service key to access data
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // Fetch user's connected data sources
    const { data: dataSources } = await supabase
      .from('data_sources')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'connected');

    // Fetch recent analytics data for context
    const { data: analyticsData } = await supabase
      .from('analytics_data')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    // Fetch recent insights
    const { data: insights } = await supabase
      .from('insights')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    // Build context from real data
    let dataContext = "Connected Data Sources:\n";
    if (dataSources && dataSources.length > 0) {
      dataContext += dataSources.map(ds => `- ${ds.name} (${ds.type}): Last synced ${ds.last_sync || 'Never'}`).join('\n');
    } else {
      dataContext += "No data sources connected yet.";
    }

    dataContext += "\n\nRecent Analytics Data:\n";
    if (analyticsData && analyticsData.length > 0) {
      dataContext += analyticsData.map(ad => `- ${ad.metric_name}: ${ad.metric_value} (${ad.date_recorded})`).join('\n');
    } else {
      dataContext += "No analytics data available.";
    }

    dataContext += "\n\nRecent Insights:\n";
    if (insights && insights.length > 0) {
      dataContext += insights.map(insight => `- ${insight.title}: ${insight.description}`).join('\n');
    } else {
      dataContext += "No insights generated yet.";
    }

    // Prepare system prompt with real data context
    const systemPrompt = `You are an AI Data Analyst for a business analytics platform. You help users understand their business data and provide actionable insights.

IMPORTANT INSTRUCTIONS:
- Only use real data that is provided in the context below
- If no relevant data is available, clearly state "I don't have that data yet" and suggest connecting relevant data sources
- Never make up or hallucinate data, metrics, or insights
- Be helpful in explaining what data would be needed to answer questions
- Suggest specific data sources that could be connected to get the information they're asking for

Current User Data Context:
${dataContext}

Be concise, helpful, and data-driven in your responses. If the user asks about specific metrics that aren't in the available data, tell them exactly what data source would need to be connected to get that information.`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    const aiMessage = data.choices[0].message.content;

    // Store the conversation in the database
    await supabase
      .from('chat_conversations')
      .upsert({
        user_id: userId,
        messages: [
          { role: 'user', content: message, timestamp: new Date().toISOString() },
          { role: 'assistant', content: aiMessage, timestamp: new Date().toISOString() }
        ]
      }, {
        onConflict: 'user_id'
      });

    return new Response(JSON.stringify({ message: aiMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-analyst function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      message: "I'm having trouble processing your request right now. Please try again later."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});