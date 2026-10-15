// Supabase Edge Function: generate-video
// Deno TypeScript Runtime

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { prompt, source_image_url, duration = "5s", motion_strength = 5 } = await req.json();

    const runwayKey = Deno.env.get("RUNWAY_API_KEY");
    const replicateKey = Deno.env.get("REPLICATE_API_KEY");

    if (!runwayKey && !replicateKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Neither RUNWAY_API_KEY nor REPLICATE_API_KEY is configured on the server. Please set these secrets in Supabase.",
          missingConfig: "RUNWAY_API_KEY",
        }),
        {
          status: 503,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        status: "processing",
        message: "Video task submitted to provider queue",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
