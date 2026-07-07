const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, 'docs');
const sectionEmojis = ["📖","🔧","💡","📝","🚀","✅","❓","📌","🌀","🔄","📥","🌐","🏗️","📁","✍️","👀","🔗","⚠️","📦","🗑️","🍎","🪟","🐧","📊","🔍","☁️","🌱","🦌","🐰","🎨","💻","📋","🔓","📡","🌊","🖥️","🔴","🟢","🟡","🔵"];

function getEmoji(filePath, title) {
    const lowerPath = filePath.toLowerCase();
    const lowerName = path.basename(filePath).toLowerCase();
    if (lowerPath.includes('algorithm')) return '📊';
    if (lowerPath.includes('docker')) return '🐳';
    if (lowerPath.includes('k8s')) return '☸️';
    if (lowerPath.includes('elk')) return '📈';
    if (lowerPath.includes('draw')) return '🎨';
    if (lowerPath.includes('codes')) return '💻';
    if (lowerPath.includes('notes')) return '📝';
    if (lowerPath.includes('links')) return '🔗';
    if (lowerPath.includes('main')) return '🏠';
    if (lowerName.includes('blog')) return '🚀';
    if (lowerName.includes('github') || lowerName.includes('gitee') || lowerName.includes('ssh')) return '🔑';
    if (lowerName.includes('readme')) return '📖';
    return '📄';
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split(/\r?\n/);
    if (lines.length === 0) return;

    let modified = false;
    const firstLine = lines[0];

    const titleMatch = firstLine.match(/^#\s+(.+)$/);
    if (titleMatch) {
        const title = titleMatch[1].trim();
        const firstChar = title.charAt(0);
        if (/[A-Za-z0-9\u4e00-\u9fff]/.test(firstChar)) {
            const emoji = getEmoji(filePath, title);
            lines[0] = `# ${emoji} ${title}`;

            let hasDesc = false;
            for (let j = 1; j < Math.min(5, lines.length); j++) {
                if (/^>\s*💡/.test(lines[j])) { hasDesc = true; break; }
            }

            if (!hasDesc) {
                const newLines = [lines[0], '', `> 💡 ${title}`, '', '---', ''];
                for (let i = 1; i < lines.length; i++) {
                    newLines.push(lines[i]);
                }
                lines.length = 0;
                lines.push(...newLines);
            }
            modified = true;
        }
    }

    let sectionIdx = 0;
    for (let i = 0; i < lines.length; i++) {
        const secMatch = lines[i].match(/^##\s+(.+)$/);
        if (secMatch) {
            const title = secMatch[1].trim();
            const firstChar = title.charAt(0);
            if (/[A-Za-z0-9\u4e00-\u9fff]/.test(firstChar)) {
                const emoji = sectionEmojis[sectionIdx % sectionEmojis.length];
                lines[i] = `## ${emoji} ${title}`;
                sectionIdx++;
                modified = true;
            }
        }
    }

    if (modified) {
        fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
        console.log('Updated:', filePath);
    }
}

function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (entry.name === 'ai' || entry.name === 'soft') continue;
            walk(fullPath);
        } else if (entry.name.endsWith('.md')) {
            processFile(fullPath);
        }
    }
}

walk(docsDir);
console.log('Done');
