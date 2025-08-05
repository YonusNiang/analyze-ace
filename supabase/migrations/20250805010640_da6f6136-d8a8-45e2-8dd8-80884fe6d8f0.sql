-- Add API configurations table for storing data source credentials
CREATE TABLE public.api_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'salesforce', 'hubspot', 'google_analytics', etc.
  config JSONB NOT NULL DEFAULT '{}', -- API credentials and settings
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.api_configurations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own API configurations" 
ON public.api_configurations 
FOR ALL 
USING (auth.uid() = user_id);

-- Add trigger for timestamps
CREATE TRIGGER update_api_configurations_updated_at
BEFORE UPDATE ON public.api_configurations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add sample data analytics table for real data storage
CREATE TABLE public.analytics_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  source_id UUID REFERENCES public.data_sources(id),
  metric_name TEXT NOT NULL,
  metric_value NUMERIC,
  metric_data JSONB DEFAULT '{}',
  date_recorded DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.analytics_data ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own analytics data" 
ON public.analytics_data 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert analytics data" 
ON public.analytics_data 
FOR INSERT 
WITH CHECK (true);

-- Add index for performance
CREATE INDEX idx_analytics_data_user_date ON public.analytics_data(user_id, date_recorded);
CREATE INDEX idx_analytics_data_source ON public.analytics_data(source_id);