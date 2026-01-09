const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const dashboardDir = path.join(rootDir, 'hyperlynx_dashboard');
const distDir = path.join(rootDir, 'dist');
const distDashboardDir = path.join(distDir, 'dashboard');

console.log('Building dashboard...');

try {
    // Install and Build Dashboard
    execSync('npm install', { cwd: dashboardDir, stdio: 'inherit' });
    execSync('npm run build', { cwd: dashboardDir, stdio: 'inherit' });

    // Ensure dist/dashboard exists
    if (!fs.existsSync(distDashboardDir)) {
        fs.mkdirSync(distDashboardDir, { recursive: true });
    }

    // Copy build artifacts
    const buildDir = path.join(dashboardDir, 'build');

    if (fs.existsSync(buildDir)) {
        copyRecursiveSync(buildDir, distDashboardDir);
        console.log('Dashboard built and copied successfully.');
    } else {
        console.error('Error: Dashboard build directory not found.');
        process.exit(1);
    }

} catch (error) {
    console.error('Error building dashboard:', error);
    process.exit(1);
}

function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest);
        }
        fs.readdirSync(src).forEach((childItemName) => {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}
