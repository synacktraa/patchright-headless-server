import { chromium } from "patchright-core";

function getEnvVar(key, defaultValue = '') {
    return process.env[key] || defaultValue;
}

function getBrowserConfig() {
    return {
        port: parseInt(getEnvVar('BROWSER_PORT', '5678')),
        wsPath: getEnvVar('BROWSER_WS_PATH', '/patchright'),
        timeout: getEnvVar('BROWSER_TIMEOUT') ? parseInt(getEnvVar('BROWSER_TIMEOUT')) : undefined,
        args: getEnvVar('BROWSER_ARGS') ? getEnvVar('BROWSER_ARGS').split(' ').filter(arg => arg.trim()) : [
            "--no-sandbox",
            "--disable-dev-shm-usage", 
            "--disable-gpu",
            "--disable-web-security",
            "--disable-features=VizDisplayCompositor",
        ],
        proxy: getEnvVar('BROWSER_PROXY_SERVER') ? {
            server: getEnvVar('BROWSER_PROXY_SERVER'),
            bypass: getEnvVar('BROWSER_PROXY_BYPASS'),
            username: getEnvVar('BROWSER_PROXY_USERNAME'),
            password: getEnvVar('BROWSER_PROXY_PASSWORD'),
        } : undefined
    };
}

async function launch() {
    const config = getBrowserConfig();
    
    const options = { port: config.port, wsPath: config.wsPath, args: config.args };

    if (config.timeout) {
        options.timeout = config.timeout;
    }
    
    if (config.proxy) {
        options.proxy = config.proxy;
    }

    return await chromium.launchServer(options);
}

async function main() {
    try {
        const server = await launch();
        console.log(`Browser server started: ${server.wsEndpoint()}`);
        
        process.on('SIGINT', async () => {
            console.log('Shutting down browser server...');
            await server.close();
            process.exit(0);
        });
        
        process.on('SIGTERM', async () => {
            console.log('Shutting down browser server...');
            await server.close();
            process.exit(0);
        });
        
    } catch (error) {
        console.error('Failed to start browser server:', error);
        process.exit(1);
    }
}

main();
