import { BrowserRouter, Routes, Route } from "react-router-dom";
import HubLayout from "./layouts/HubLayout";
import HomePage from "./pages/HomePage";
import DemoFormPage from "./pages/DemoFormPage";
import FeedbackFormPage from "./pages/FeedbackFormPage";
import TesterFormPage from "./pages/TesterFormPage";
import SurveyFormPage from "./pages/SurveyFormPage";
import BurnoutSurveyPage from "./pages/BurnoutSurveyPage";
import NeurologyHistoryFormPage from "./pages/NeurologyHistoryFormPage";
import AcuteAbodemPage from "./pages/AcuteAbodemPage";
import ChestPainPage from "./pages/ChestPainPage";
import "./App.css";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<HubLayout />}>
					<Route index element={<HomePage />} />
					<Route path="demo-form" element={<DemoFormPage />} />
					<Route path="feedback-form" element={<FeedbackFormPage />} />
					<Route path="tester-form" element={<TesterFormPage />} />
					<Route path="survey-form" element={<SurveyFormPage />} />
					<Route path="burnout-survey" element={<BurnoutSurveyPage />} />
					<Route path="neurology-history" element={<NeurologyHistoryFormPage />} />
					<Route path="acute-abdomen" element={<AcuteAbodemPage />} />
					<Route path="chest-pain" element={<ChestPainPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
