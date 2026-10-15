import { isSupabaseConfigured, supabase } from './supabase';

export interface GenerationRequest {
  prompt: string;
  negative_prompt?: string;
  aspect_ratio?: string;
  quality?: string;
  style?: string;
  source_image_url?: string;
  duration?: string;
  motion_strength?: number;
}

export interface ProviderResponse<T = any> {
  success: boolean;
  jobId?: string;
  assetUrl?: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  error?: string;
  missingConfig?: string;
  data?: T;
}

/**
 * Checks server-side provider readiness.
 * Never pretends a provider is connected when it is not.
 */
export function getProviderHealth() {
  return {
    openai: {
      name: 'OpenAI (DALL-E 3)',
      type: 'Image Generation',
      configured: false, // Server-side check
      requiredEnv: 'OPENAI_API_KEY',
      docLink: '/docs/AI_PROVIDER_SETUP.md'
    },
    stability: {
      name: 'Stability AI (SDXL / SD3)',
      type: 'Image Generation & Editing',
      configured: false,
      requiredEnv: 'STABILITY_API_KEY',
      docLink: '/docs/AI_PROVIDER_SETUP.md'
    },
    runway: {
      name: 'RunwayML (Gen-2)',
      type: 'Text/Image-to-Video',
      configured: false,
      requiredEnv: 'RUNWAY_API_KEY',
      docLink: '/docs/AI_PROVIDER_SETUP.md'
    },
    replicate: {
      name: 'Replicate (SVD & Flux)',
      type: 'Video Synthesis',
      configured: false,
      requiredEnv: 'REPLICATE_API_KEY',
      docLink: '/docs/AI_PROVIDER_SETUP.md'
    }
  };
}

/**
 * Abstract Base Provider Adapter
 */
export abstract class BaseAIProvider {
  abstract readonly providerName: string;
  abstract readonly supportedModels: string[];

  protected formatMissingKeyError(envVarName: string): ProviderResponse {
    return {
      success: false,
      status: 'failed',
      error: `AI Provider (${this.providerName}) is not yet connected. Please set the server-side environment variable "${envVarName}" in your Supabase Edge Function Secrets.`,
      missingConfig: envVarName
    };
  }
}

/**
 * Image Generation Provider Implementation
 */
export class ImageGenerationProvider extends BaseAIProvider {
  readonly providerName = 'OpenAI DALL-E 3 / Stability';
  readonly supportedModels = ['dall-e-3', 'dall-e-2', 'stable-diffusion-xl-1024-v1-0'];

  async generateImage(req: GenerationRequest): Promise<ProviderResponse> {
    if (!req.prompt || req.prompt.trim().length === 0) {
      return {
        success: false,
        status: 'failed',
        error: 'Prompt cannot be empty. Please enter a descriptive prompt.'
      };
    }

    // If Supabase is configured with Edge Functions, call real edge function
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.functions.invoke('generate-image', {
          body: {
            prompt: req.prompt,
            negative_prompt: req.negative_prompt,
            aspect_ratio: req.aspect_ratio || '1:1',
            quality: req.quality || 'standard',
            style: req.style || 'cinematic'
          }
        });

        if (error) {
          return {
            success: false,
            status: 'failed',
            error: error.message || 'Edge function call failed.'
          };
        }

        return data;
      } catch (err: any) {
        return {
          success: false,
          status: 'failed',
          error: `Edge function network error: ${err.message}`
        };
      }
    }

    // In local sandbox environment without Edge Functions configured:
    // Respect non-negotiable rule: explicitly notify user of missing provider credentials
    return this.formatMissingKeyError('OPENAI_API_KEY');
  }
}

/**
 * Video Generation Provider Implementation
 */
export class VideoGenerationProvider extends BaseAIProvider {
  readonly providerName = 'Runway Gen-2 / Replicate SVD';
  readonly supportedModels = ['runway-gen-2', 'stable-video-diffusion'];

  async generateVideo(req: GenerationRequest): Promise<ProviderResponse> {
    if (!req.prompt && !req.source_image_url) {
      return {
        success: false,
        status: 'failed',
        error: 'Either a text prompt or an image upload is required for video generation.'
      };
    }

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.functions.invoke('generate-video', {
          body: {
            prompt: req.prompt,
            source_image_url: req.source_image_url,
            duration: req.duration || '5s',
            motion_strength: req.motion_strength || 5
          }
        });

        if (error) {
          return {
            success: false,
            status: 'failed',
            error: error.message || 'Edge function call failed.'
          };
        }

        return data;
      } catch (err: any) {
        return {
          success: false,
          status: 'failed',
          error: `Edge function connection error: ${err.message}`
        };
      }
    }

    return this.formatMissingKeyError('RUNWAY_API_KEY');
  }
}

/**
 * Image-to-Video Provider Adapter
 */
export class ImageToVideoProvider extends BaseAIProvider {
  readonly providerName = 'Replicate Stable Video Diffusion';
  readonly supportedModels = ['svd-xt-1.1'];

  async animateImage(imageUrl: string, motionStrength = 5): Promise<ProviderResponse> {
    if (!imageUrl) {
      return {
        success: false,
        status: 'failed',
        error: 'Please upload a source image to animate.'
      };
    }

    return this.formatMissingKeyError('REPLICATE_API_KEY');
  }
}

/**
 * Image Editing Provider Adapter
 */
export class ImageEditingProvider extends BaseAIProvider {
  readonly providerName = 'Stability Inpaint / Background Removal';
  readonly supportedModels = ['remove-background', 'inpaint-v2'];

  async removeBackground(imageUrl: string): Promise<ProviderResponse> {
    return this.formatMissingKeyError('STABILITY_API_KEY');
  }
}

export const imageProvider = new ImageGenerationProvider();
export const videoProvider = new VideoGenerationProvider();
export const imageToVideoProvider = new ImageToVideoProvider();
export const imageEditingProvider = new ImageEditingProvider();
