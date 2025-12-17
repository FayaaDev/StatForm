import { useEffect, useRef } from "react";

const FormRenderer = ({ composer, options = {}, id, onMount }) => {
	const containerRef = useRef(null);
	const formInstance = useRef(null);

	useEffect(() => {
		const initForm = () => {
			// Wait for Formsmd to be available
			if (!window.Formsmd) {
				console.error("Formsmd not loaded yet");
				setTimeout(initForm, 100);
				return;
			}

			// Ensure the container exists and we haven't already rendered this specific form
			if (containerRef.current && !formInstance.current) {
				// Clear any existing content
				containerRef.current.innerHTML = "";

				// Initialize using the template from your composer
				const formsmd = new window.Formsmd(
					composer.template,
					containerRef.current,
					options,
				);

				formsmd.init();

				// Save instance to prevent re-initialization
				formInstance.current = formsmd;

				// Expose instance to parent
				if (onMount) {
					onMount(formsmd);
				}
			}
		};

		initForm();

		// Cleanup function to destroy form instance when component unmounts
		return () => {
			if (containerRef.current) {
				containerRef.current.innerHTML = "";
			}
			formInstance.current = null;
		};
	}, [composer, options]);

	// The 'id' prop allows you to preserve specific CSS ID styling from your static site
	return (
		<div
			id={id}
			ref={containerRef}
			style={{ width: "100%" }}
		/>
	);
};

export default FormRenderer;
