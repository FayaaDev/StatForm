import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import HubLayout from "./layouts/HubLayout";
import HomePage from "./pages/HomePage";
import PHAHomePage from "./pages/PHAHomePage";
import DemoFormPage from "./pages/DemoFormPage";
import FeedbackFormPage from "./pages/FeedbackFormPage";
import FeedbackFormPage2 from "./pages/FeedbackFormPage2";
import FeedbackFormPage3 from "./pages/FeedbackFormPage3";
import FeedbackFormPage4 from "./pages/FeedbackFormPage4";
import FeedbackFormPage5 from "./pages/FeedbackFormPage5";
import FeedbackFormPage6 from "./pages/FeedbackFormPage6";
import FeedbackFormPage7 from "./pages/FeedbackFormPage7";
import FeedbackFormPage8 from "./pages/FeedbackFormPage8";
import FeedbackFormPage9 from "./pages/FeedbackFormPage9";
import FeedbackFormPage10 from "./pages/FeedbackFormPage10";
import FeedbackFormPage11 from "./pages/FeedbackFormPage11";
import FeedbackFormPage12 from "./pages/FeedbackFormPage12";
import FeedbackFormPage13 from "./pages/FeedbackFormPage13";
import FeedbackFormPage14 from "./pages/FeedbackFormPage14";
import FeedbackFormPage15 from "./pages/FeedbackFormPage15";
import TesterFormPage from "./pages/TesterFormPage";
import SurveyFormPage from "./pages/SurveyFormPage";
import BurnoutSurveyPage from "./pages/BurnoutSurveyPage";
import NeurologyHistoryFormPage from "./pages/NeurologyHistoryFormPage";
import AcuteAbodemPage from "./pages/AcuteAbodemPage";
import ChestPainPage from "./pages/ChestPainPage";
import FeverOfUnknownOriginPage from "./pages/FeverOfUnknownOriginPage";
import CoughPage from "./pages/CoughPage";
import DyspneaPage from "./pages/DyspneaPage";
import PelvicPainPage from "./pages/PelvicPainPage";
import DepressionPage from "./pages/DepressionPage";
import DischargeSummaryPage from "./pages/DischargeSummaryPage";
import SOAPPage from "./pages/SOAPPage";
import "./App.css";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				{/* Personal Theme Routes */}
				<Route
					path="/"
					element={
						<ThemeProvider theme="personal">
							<HubLayout />
						</ThemeProvider>
					}
				>
					<Route index element={<HomePage />} />
					<Route path="discharge-summary" element={<DischargeSummaryPage />} />
					<Route path="soap-note" element={<SOAPPage />} />
					<Route path="burnout-survey" element={<BurnoutSurveyPage />} />
					<Route
						path="neurology-history"
						element={<NeurologyHistoryFormPage />}
					/>
					<Route path="acute-abdomen" element={<AcuteAbodemPage />} />
					<Route path="chest-pain" element={<ChestPainPage />} />
					<Route path="fever-unknown-origin" element={<FeverOfUnknownOriginPage />} />
					<Route path="cough-history" element={<CoughPage />} />
					<Route path="dyspnea-history" element={<DyspneaPage />} />
					<Route path="pelvic-pain" element={<PelvicPainPage />} />
					<Route path="depression-history" element={<DepressionPage />} />
				</Route>

				{/* PHA Theme Routes */}
				<Route
					path="/pha"
					element={
						<ThemeProvider theme="pha">
							<HubLayout />
						</ThemeProvider>
					}
				>
					<Route index element={<PHAHomePage />} />
					{/* <Route path="demo-form" element={<DemoFormPage />} /> */}
					<Route path="tool1_operations" element={<FeedbackFormPage />} />
					<Route path="tool2_operations" element={<FeedbackFormPage2 />} />
					<Route path="tool3_operations" element={<FeedbackFormPage3 />} />
					<Route path="tool4_operations" element={<FeedbackFormPage4 />} />
					<Route path="tool5_operations" element={<FeedbackFormPage5 />} />
					<Route path="tool6_operations" element={<FeedbackFormPage6 />} />
					<Route path="tool7_operations" element={<FeedbackFormPage7 />} />
					<Route path="tool8_operations" element={<FeedbackFormPage8 />} />
					<Route path="tool9_operations" element={<FeedbackFormPage9 />} />
					<Route path="tool10_operations" element={<FeedbackFormPage10 />} />
					<Route path="tool11_operations" element={<FeedbackFormPage11 />} />
					<Route path="tool12_operations" element={<FeedbackFormPage12 />} />
					<Route path="tool13_operations" element={<FeedbackFormPage13 />} />
					<Route path="tool14_operations" element={<FeedbackFormPage14 />} />
					<Route path="tool15_operations" element={<FeedbackFormPage15 />} />
					{/* <Route path="survey-form" element={<SurveyFormPage />} /> */}
					{/* <Route path="tester-form" element={<TesterFormPage />} /> */}
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
