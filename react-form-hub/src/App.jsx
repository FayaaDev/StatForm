import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import HubLayout from "./layouts/HubLayout";
import HomePage from "./pages/HomePage";
import PHAHomePage from "./pages/PHAHomePage";
import DemoFormPage from "./pages/DemoFormPage";
import FeedbackFormPage from "./pages/FeedbackFormPage";
import FeedbackForm2Page from "./pages/FeedbackForm2Page";
import FeedbackForm3Page from "./pages/FeedbackForm3Page";
import FeedbackForm4Page from "./pages/FeedbackForm4Page";
import FeedbackForm5Page from "./pages/FeedbackForm5Page";
import FeedbackForm6Page from "./pages/FeedbackForm6Page";
import FeedbackForm7Page from "./pages/FeedbackForm7Page";
import FeedbackForm8Page from "./pages/FeedbackForm8Page";
import FeedbackForm9Page from "./pages/FeedbackForm9Page";
import FeedbackForm10Page from "./pages/FeedbackForm10Page";
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
import EpidemiologyFormPage from "./pages/EpidemiologyFormPage";
import AnimalAssessmentFormPage from "./pages/AnimalAssessmentFormPage";
import EntomologyFormPage from "./pages/EntomologyFormPage";
import "./App.css";

function App() {
	return (
		<BrowserRouter basename={import.meta.env.BASE_URL}>
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
					<Route path="tool2_operations" element={<FeedbackForm2Page />} />
					<Route path="tool3_operations" element={<FeedbackForm3Page />} />
					<Route path="tool4_operations" element={<FeedbackForm4Page />} />
					<Route path="tool5_operations" element={<FeedbackForm5Page />} />
					<Route path="tool6_operations" element={<FeedbackForm6Page />} />
					<Route path="tool7_operations" element={<FeedbackForm7Page />} />
					<Route path="tool8_operations" element={<FeedbackForm8Page />} />
					<Route path="tool9_operations" element={<FeedbackForm9Page />} />
					<Route path="tool10_operations" element={<FeedbackForm10Page />} />
					<Route path="epidemiology-form" element={<EpidemiologyFormPage />} />
					<Route path="animal-assessment-form" element={<AnimalAssessmentFormPage />} />
					<Route path="entomology-form" element={<EntomologyFormPage />} />
					{/* <Route path="survey-form" element={<SurveyFormPage />} /> */}
					{/* <Route path="tester-form" element={<TesterFormPage />} /> */}
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
