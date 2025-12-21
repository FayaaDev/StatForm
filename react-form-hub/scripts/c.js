#!/usr/bin/env node

/**
 * Script to automatically create a new feedback form
 * Usage: node scripts/create-feedback-form.js <formNumber> <titleEn> <titleAr>
 * Example: node scripts/create-feedback-form.js 3 "Evaluation Tool 3" "أداة تقييم 3"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command line arguments
const args = process.argv.slice(2);
if (args.length < 3) {
	console.error('Usage: node create-feedback-form.js <formNumber> <titleEn> <titleAr>');
	console.error('Example: node create-feedback-form.js 3 "Evaluation Tool 3" "أداة تقييم 3"');
	process.exit(1);
}

const formNumber = args[0];
const titleEn = args[1];
const titleAr = args[2];

const formId = `tool${formNumber}_operations`;
const pageFileName = `FeedbackForm${formNumber}Page.jsx`;
const pageComponentName = `FeedbackForm${formNumber}Page`;
const formFileName = `FeedbackForm-${formNumber}.js`;

// Paths
const projectRoot = path.resolve(__dirname, '..');
const pagesDir = path.join(projectRoot, 'src', 'pages');
const formRegistryPath = path.join(projectRoot, 'src', 'config', 'formRegistry.js');
const appPath = path.join(projectRoot, 'src', 'App.jsx');

console.log(`\n🚀 Creating feedback form ${formNumber}...`);
console.log(`   ID: ${formId}`);
console.log(`   Title (EN): ${titleEn}`);
console.log(`   Title (AR): ${titleAr}\n`);

// Step 1: Create the page file
const pageContent = `import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import FormRenderer from "../components/FormRenderer";
import { createFeedbackFormComposer } from "../forms/${formFileName}";
import { getFormOptions } from "../forms/formUtils";
import { useTheme } from "../contexts/ThemeContext";

import FormProgressBar from "../components/FormProgressBar";
import { useFormController } from "../hooks/useFormController.js";

const ${pageComponentName} = () => {
	const { currentLang } = useOutletContext();
	const theme = useTheme();
	const [composer, setComposer] = useState(null);
	const [options, setOptions] = useState(null);

	const {
		setFormInstance,
		containerProps,
		activeSlideIndex,
		slides,
		jumpToSlide,
		maxVisitedSlideIndex
	} = useFormController({
		formId: "${formId}-container",
		currentLang
	});

	useEffect(() => {
		// Create composer and options based on current language and theme
		const newComposer = createFeedbackFormComposer(currentLang, theme);
		const newOptions = getFormOptions(currentLang, theme);

		setComposer(newComposer);
		setOptions(newOptions);
	}, [currentLang, theme]);

	if (!composer || !options) {
		return <div>Loading...</div>;
	}

	return (
		<>
			<FormProgressBar
				currentSlideIndex={activeSlideIndex}
				totalSlides={slides.length}
				excludeStart={1}
				excludeEnd={0}
				onStepClick={jumpToSlide}
				currentLang={currentLang}
				maxVisitedSlideIndex={maxVisitedSlideIndex}
			/>
			<div {...containerProps}>
				<FormRenderer
					composer={composer}
					options={options}
					id="${formId}-container"
					onMount={setFormInstance}
				/>
			</div>
		</>
	);
};

export default ${pageComponentName};
`;

const pageFilePath = path.join(pagesDir, pageFileName);
fs.writeFileSync(pageFilePath, pageContent);
console.log(`✅ Created: ${pageFilePath}`);

// Step 2: Update formRegistry.js
let registryContent = fs.readFileSync(formRegistryPath, 'utf8');

// Find the insertion point (after the last tool_operations entry)
const insertionPattern = /(\t\},\n)(\t\{\n\t\tid: "epidemiology-form")/;
const newRegistryEntry = `\t},
	{
		id: "${formId}",
		themes: ["pha"],
		path: "${formId}",
		title: {
			en: "${titleEn}",
			ar: "${titleAr}",
		},
	},
	{
		id: "epidemiology-form"`;

if (registryContent.match(insertionPattern)) {
	registryContent = registryContent.replace(insertionPattern, newRegistryEntry);
	fs.writeFileSync(formRegistryPath, registryContent);
	console.log(`✅ Updated: ${formRegistryPath}`);
} else {
	console.error('❌ Could not find insertion point in formRegistry.js');
	console.error('   Please add this entry manually:');
	console.error(`
	{
		id: "${formId}",
		themes: ["pha"],
		path: "${formId}",
		title: {
			en: "${titleEn}",
			ar: "${titleAr}",
		},
	},
`);
}

// Step 3: Update App.jsx - Add import
let appContent = fs.readFileSync(appPath, 'utf8');

// Find the last FeedbackFormPage import
const lastFeedbackImportPattern = /(import FeedbackForm\d*Page from "\.\/pages\/FeedbackForm\d*Page";)/g;
const matches = appContent.match(lastFeedbackImportPattern);
if (matches && matches.length > 0) {
	const lastImport = matches[matches.length - 1];
	const newImport = `${lastImport}\nimport ${pageComponentName} from "./pages/${pageFileName.replace('.jsx', '')}";`;
	appContent = appContent.replace(lastImport, newImport);
	console.log(`✅ Added import in: ${appPath}`);
} else {
	console.error('❌ Could not find FeedbackFormPage imports in App.jsx');
}

// Step 4: Update App.jsx - Add route
const routePattern = /(\t\t\t\t\t<Route path="tool\d+_operations" element={<FeedbackForm\d*Page \/>} \/>)/g;
const routeMatches = appContent.match(routePattern);
if (routeMatches && routeMatches.length > 0) {
	const lastRoute = routeMatches[routeMatches.length - 1];
	const newRoute = `${lastRoute}\n\t\t\t\t\t<Route path="${formId}" element={<${pageComponentName} />} />`;
	appContent = appContent.replace(lastRoute, newRoute);
	fs.writeFileSync(appPath, appContent);
	console.log(`✅ Added route in: ${appPath}`);
} else {
	console.error('❌ Could not find route insertion point in App.jsx');
	console.error('   Please add this route manually:');
	console.error(`   <Route path="${formId}" element={<${pageComponentName} />} />`);
}

console.log(`\n✨ Successfully created feedback form ${formNumber}!`);
console.log(`\n📝 Next steps:`);
console.log(`   1. Create the form file: src/forms/${formFileName}`);
console.log(`   2. The form should export: createFeedbackFormComposer(localization, theme)`);
console.log(`   3. Access your form at: /pha/${formId}\n`);
