import { defineConfig, loadEnv } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

function pickBackendUrl(env) {
    if (env.VITE_BACKEND_URL) return env.VITE_BACKEND_URL;

    for (const key of ['GOOGLE_REDIRECT_URI', 'FACEBOOK_REDIRECT_URI']) {
        if (env[key]) {
            try {
                return new URL(env[key]).origin;
            } catch {
                // ignore
            }
        }
    }

    if (env.APP_URL) return env.APP_URL;

    return 'http://127.0.0.1:8000';
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const backendUrl = pickBackendUrl(env);

    const proxyToBackend = {
        target: backendUrl,
        changeOrigin: true,
        secure: false,
    };

    return {
        plugins: [
            laravel({
                input: ['resources/css/app.css', 'resources/js/app.js'],
                refresh: true,
            }),
            tailwindcss(),
        ],
        server: {
            proxy: {
                '/up': proxyToBackend,
                '/api': proxyToBackend,
                '/register': proxyToBackend,
                '/login': proxyToBackend,
                '/forgot-password': proxyToBackend,
                '/reset-password': proxyToBackend,
                '/verify-otp': proxyToBackend,
                '/resend-otp': proxyToBackend,
                '/email/verify-otp': proxyToBackend,
                '/email/resend-otp': proxyToBackend,
                '/auth': proxyToBackend,
            },
            watch: {
                ignored: ['**/storage/framework/views/**'],
            },
        },
    };
});
