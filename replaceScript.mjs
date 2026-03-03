import fs from 'fs';
import path from 'path';

const files = [
    "src/components/ui/input/SearchInput.tsx",
    "src/components/ui/button/UserProfileButton.tsx",
    "src/App.tsx",
    "src/app/watch/[id]/page.tsx",
    "src/app/search/page.tsx",
    "src/app/genres/page.tsx",
    "src/components/sections/Search/List.tsx",
    "src/components/sections/Home/List.tsx",
    "src/components/sections/Discover/ListGroup.tsx",
    "src/app/discover/page.tsx",
    "src/components/sections/Auth/Forms.tsx",
    "src/app/admin/page.tsx"
];

for (const file of files) {
    const filePath = path.join("c:/Users/HI User/Desktop/cinextma-master", file);
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf8');

    // Replace <Spinner ... /> with <LoadingSpinner ... />
    // Note: Spinner might be self-closing or have children, usually it's <Spinner ... />
    content = content.replace(/<Spinner/g, '<LoadingSpinner');
    content = content.replace(/<\/Spinner>/g, '</LoadingSpinner>');

    // Determine correct import path (App.tsx is at root, others are deep)
    let importPath = "@/components/ui/LoadingSpinner";
    if (file === "src/App.tsx") {
        importPath = "./components/ui/LoadingSpinner";
    }

    // Replace import { Spinner } from "@heroui/react"; 
    // Wait, sometimes it's import { Spinner, somethingElse } from "@heroui/react";
    // If it's the only import:
    if (content.match(/import\s+{\s*Spinner\s*}\s+from\s+["']@heroui\/react["']/)) {
        content = content.replace(/import\s+{\s*Spinner\s*}\s+from\s+["']@heroui\/react["'];?/, `import LoadingSpinner from "${importPath}";`);
    } else if (content.match(/import\s+{.*Spinner.*}\s+from\s+["']@heroui\/react["']/)) {
        // Remove Spinner from the destructured import and add the new import
        content = content.replace(/(import\s+{.*?)(\bSpinner\b,?\s*)(.*?}\s+from\s+["']@heroui\/react["'];?)/g, '$1$3\nimport LoadingSpinner from "' + importPath + '";');
        // Cleanup if `, }` remains
        content = content.replace(/,\s*}/g, " }");
    }

    fs.writeFileSync(filePath, content, 'utf8');
}
console.log("Replaced all occurrences");
