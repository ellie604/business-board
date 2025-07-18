"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStorageBucket = exports.getStorageUrl = exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
// Get the appropriate S3 key based on environment
const getS3Key = () => {
    const env = process.env.NODE_ENV || 'development';
    switch (env) {
        case 'production':
            return process.env.SUPABASE_S3_KEY_PROD || 'dfef7e0f668973dce61c9b9929d6ce0a';
        default:
            return process.env.SUPABASE_S3_KEY_DEV || '4644a5c70d082eb641b213c30c7822a9';
    }
};
// Initialize Supabase client
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
// Get storage URL
const getStorageUrl = () => {
    return `${supabaseUrl}/storage/v1/s3`;
};
exports.getStorageUrl = getStorageUrl;
// Get the appropriate bucket name based on environment
const getStorageBucket = () => {
    const env = process.env.NODE_ENV || 'development';
    const vercelEnv = process.env.VERCEL_ENV;
    console.log('Storage bucket selection:', { env, vercelEnv });
    // Use consistent folder structure across environments:
    // Both environments should have the same structure with communications/ and listings/
    if (vercelEnv === 'production' || env === 'production') {
        // Production environment uses business-documents-prod
        return 'business-documents-prod';
    }
    else {
        // Preview and development use business-documents-dev
        return 'business-documents-dev';
    }
};
exports.getStorageBucket = getStorageBucket;
