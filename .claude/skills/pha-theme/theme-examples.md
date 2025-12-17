# PHA Theme - Component Examples

Complete, ready-to-use component examples following PHA theme guidelines.

## Table of Contents

1. [Buttons](#buttons)
2. [Forms](#forms)
3. [Cards](#cards)
4. [Navigation](#navigation)
5. [Layout](#layout)
6. [RTL Support](#rtl-support)

---

## Buttons

### Primary Action Button

```jsx
// React JSX
<button className="main-action-btn">
  Submit Form
</button>

// Inline styles alternative
<button style={{
  backgroundColor: '#09595c',
  color: 'white',
  border: 'none',
  padding: '20px 40px',
  fontSize: '1.2em',
  borderRadius: '10px',
  cursor: 'pointer',
  fontFamily: '"Majalla", sans-serif',
  transition: 'transform 0.2s, background-color 0.2s'
}}>
  Submit Form
</button>
```

```css
/* CSS */
.main-action-btn {
	background-color: #09595c;
	color: white;
	border: none;
	padding: 20px 40px;
	font-size: 1.2em;
	border-radius: 10px;
	cursor: pointer;
	transition:
		transform 0.2s,
		background-color 0.2s;
	min-width: 200px;
	font-family: "Majalla", sans-serif;
}

.main-action-btn:hover {
	background-color: #063e40;
	transform: translateY(-2px);
}
```

### Language Toggle Button

```jsx
// React component with state
import { useState } from "react";

function LanguageToggle() {
	const [currentLang, setCurrentLang] = useState("ar");

	const toggleLanguage = () => {
		const newLang = currentLang === "ar" ? "en" : "ar";
		setCurrentLang(newLang);
		localStorage.setItem("localization", newLang);
		window.location.reload();
	};

	return (
		<button className="lang-toggle" onClick={toggleLanguage}>
			{currentLang === "ar" ? "English" : "العربية"}
		</button>
	);
}
```

```css
/* CSS */
.lang-toggle {
	position: fixed;
	top: 20px;
	left: 20px;
	z-index: 1000;
	padding: 10px 20px;
	background-color: #09595c;
	color: #ffffff;
	border: none;
	border-radius: 5px;
	cursor: pointer;
	font-family: "Majalla", sans-serif;
	font-size: 16px;
	transition: background-color 0.3s;
}

.lang-toggle:hover {
	background-color: #063e40;
}
```

### Disabled Button

```jsx
<button className="main-action-btn" disabled>
	Processing...
</button>
```

```css
.main-action-btn:disabled {
	background-color: #cccccc;
	cursor: not-allowed;
	transform: none;
}
```

---

## Forms

### Text Input Field

```jsx
// React with state
import { useState } from "react";

function NameInput() {
	const [name, setName] = useState("");

	return (
		<input
			type="text"
			className="name-input"
			placeholder="Enter your name"
			value={name}
			onChange={(e) => setName(e.target.value)}
		/>
	);
}
```

```css
/* CSS */
.name-input {
	width: 100%;
	padding: 15px;
	font-size: 1.1em;
	border: 2px solid #e0e0e0;
	border-radius: 8px;
	font-family: "Majalla", sans-serif;
}

.name-input:focus {
	border-color: #09595c;
	outline: none;
}
```

### Form Container

```jsx
function FormPage() {
	return (
		<div className="form-container">
			<form onSubmit={handleSubmit}>
				<input className="name-input" type="text" placeholder="Name" />
				<button className="main-action-btn" type="submit">
					Submit
				</button>
			</form>
		</div>
	);
}
```

```css
.form-container {
	width: 100%;
	min-height: 100vh;
	max-width: 800px;
	margin: 0 auto;
	padding: 20px;
}
```

---

## Cards

### Form Link Card

```jsx
import { Link } from "react-router-dom";

function FormLinks() {
	return (
		<div className="form-list">
			<Link to="/demo-form" className="form-link-card">
				Demo Form
			</Link>
			<Link to="/tool1_operations" className="form-link-card">
				Supervision & Coordination tool
			</Link>
			<Link to="/survey-form" className="form-link-card">
				Survey Form
			</Link>
		</div>
	);
}
```

```css
.form-list {
	display: flex;
	flex-direction: column;
	gap: 15px;
	margin: 30px 0;
}

.form-link-card {
	display: block;
	padding: 20px;
	background-color: #f5f5f5;
	border-radius: 8px;
	text-decoration: none;
	color: #063e40;
	font-size: 1.2em;
	transition: background-color 0.2s;
	border: 1px solid #e0e0e0;
}

.form-link-card:hover {
	background-color: #e0e0e0;
}
```

---

## Navigation

### Navigation Menu

```jsx
import { Link } from "react-router-dom";

function Navigation() {
	return (
		<nav className="nav-menu">
			<Link to="/" className="nav-link">
				Home
			</Link>
			<Link to="/demo-form" className="nav-link">
				Demo
			</Link>
			<Link to="/tool1_operations" className="nav-link">
				Feedback
			</Link>
			<Link to="/survey-form" className="nav-link">
				Survey
			</Link>
		</nav>
	);
}
```

```css
.nav-menu {
	position: fixed;
	top: 90px;
	left: 20px;
	z-index: 999;
	display: flex;
	flex-direction: column;
	gap: 8px;
	max-width: 150px;
}

.nav-link {
	padding: 6px 12px;
	background-color: rgba(245, 245, 245, 0.95);
	color: #063e40;
	text-decoration: none;
	border-radius: 5px;
	font-family: "Majalla", sans-serif;
	font-size: 13px;
	transition: background-color 0.3s;
	text-align: center;
}

.nav-link:hover {
	background-color: #e0e0e0;
}
```

---

## Layout

### Complete Hub Layout

```jsx
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

function HubLayout() {
	const [currentLang, setCurrentLang] = useState(() => {
		return localStorage.getItem("localization") || "ar";
	});

	const toggleLanguage = () => {
		const newLang = currentLang === "ar" ? "en" : "ar";
		setCurrentLang(newLang);
		localStorage.setItem("localization", newLang);
		window.location.reload();
	};

	useEffect(() => {
		document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
		document.documentElement.lang = currentLang;
	}, [currentLang]);

	return (
		<div className="hub-layout">
			{/* Logo */}
			<div className="logo">
				<img src="/PHAlogo.svg" alt="PHA Logo" />
			</div>

			{/* Language Toggle */}
			<button className="lang-toggle" onClick={toggleLanguage}>
				{currentLang === "ar" ? "English" : "العربية"}
			</button>

			{/* Main Content */}
			<main className="form-container">
				<Outlet context={{ currentLang }} />
			</main>
		</div>
	);
}

export default HubLayout;
```

```css
.hub-layout {
	min-height: 100vh;
	position: relative;
}

.logo {
	position: fixed;
	top: 20px;
	right: 20px;
	z-index: 1000;
}

.logo img {
	height: 60px;
	width: auto;
}
```

### Home Page with Action Buttons

```jsx
function HomePage() {
	return (
		<div className="home-page">
			<h1>Welcome to Forms Hub</h1>
			<p>Create and manage forms with ease</p>

			<div className="action-buttons">
				<button className="main-action-btn">Create New Form</button>
				<button className="main-action-btn">View All Forms</button>
			</div>
		</div>
	);
}
```

```css
.home-page {
	text-align: center;
	padding: 40px 20px;
}

.home-page h1 {
	color: #09595c;
	font-size: 2.5em;
	margin-bottom: 20px;
}

.home-page p {
	color: #063e40;
	font-size: 1.2em;
}

.action-buttons {
	display: flex;
	gap: 20px;
	justify-content: center;
	margin-top: 40px;
	flex-wrap: wrap;
}
```

---

## RTL Support

### RTL-Aware Component

```jsx
import { useEffect, useState } from "react";

function RTLComponent() {
	const [isRTL, setIsRTL] = useState(false);

	useEffect(() => {
		const lang = localStorage.getItem("localization") || "ar";
		setIsRTL(lang === "ar");
		document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
	}, []);

	return (
		<div dir={isRTL ? "rtl" : "ltr"}>
			<h1 style={{ textAlign: isRTL ? "right" : "left" }}>
				{isRTL ? "مرحبا" : "Welcome"}
			</h1>
		</div>
	);
}
```

```css
/* RTL-specific overrides */
[dir="rtl"] .logo {
	right: auto;
	left: 20px;
}

[dir="rtl"] .lang-toggle {
	left: auto;
	right: 20px;
}

[dir="rtl"] .nav-menu {
	left: auto;
	right: 20px;
}

[dir="rtl"] .fmd-label,
[dir="rtl"] .fmd-question {
	text-align: right;
}
```

---

## Complete Page Example

```jsx
import { useState } from "react";
import "./App.css";

function CompleteExample() {
	const [formData, setFormData] = useState({ name: "", email: "" });

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("Form submitted:", formData);
	};

	return (
		<div className="hub-layout">
			{/* Logo */}
			<div className="logo">
				<img src="/PHAlogo.svg" alt="PHA Logo" />
			</div>

			{/* Content */}
			<div className="form-container">
				<div className="home-page">
					<h1>Contact Form</h1>
					<p>Fill out the form below</p>

					<form onSubmit={handleSubmit} style={{ marginTop: "40px" }}>
						<input
							type="text"
							className="name-input"
							placeholder="Your Name"
							value={formData.name}
							onChange={(e) =>
								setFormData({ ...formData, name: e.target.value })
							}
							style={{ marginBottom: "20px" }}
						/>

						<input
							type="email"
							className="name-input"
							placeholder="Your Email"
							value={formData.email}
							onChange={(e) =>
								setFormData({ ...formData, email: e.target.value })
							}
							style={{ marginBottom: "20px" }}
						/>

						<button type="submit" className="main-action-btn">
							Submit
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}

export default CompleteExample;
```

---

## Code Snippet Templates

### Quick Copy-Paste Templates

#### Import Statements

```jsx
import { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import "./App.css";
```

#### Color Variables

```javascript
const colors = {
	primary: "#09595c",
	primaryDark: "#063e40",
	text: "#063e40",
	background: "#ffffff",
	grayLight: "#f5f5f5",
	grayMedium: "#e0e0e0",
};
```

#### Font Setup

```css
@font-face {
	font-family: "Majalla";
	src: url("/font/majalla.ttf") format("truetype");
	font-weight: normal;
	font-style: normal;
}

body {
	font-family: "Majalla", sans-serif;
}
```
