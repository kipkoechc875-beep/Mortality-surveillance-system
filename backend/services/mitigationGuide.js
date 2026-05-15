const DEFAULT_MITIGATION_STEPS = [
  "Strengthen early detection and screening for high-risk patients.",
  "Improve timely referral and emergency response across facilities.",
  "Ensure essential medicines, equipment, and clinical protocols are consistently available.",
  "Expand community education on prevention, warning signs, and when to seek care.",
];

const MITIGATION_GUIDE = {
  "Cardiovascular Disease": [
    "Promote regular blood pressure, cholesterol, and diabetes screening in outpatient and community clinics.",
    "Improve access to long-term treatment for hypertension and heart disease, including adherence follow-up.",
    "Run public education on diet, exercise, smoking reduction, and early warning signs such as chest pain or sudden weakness.",
    "Strengthen emergency triage and referral pathways for heart attack and stroke cases.",
  ],
  Pneumonia: [
    "Increase vaccination uptake, especially for children, older adults, and other high-risk groups.",
    "Support early diagnosis and immediate treatment for respiratory infections at primary care level.",
    "Improve oxygen availability, pulse oximetry, and inpatient respiratory support capacity.",
    "Promote infection prevention measures such as hand hygiene, nutrition support, and reduced household smoke exposure.",
  ],
  "Road Traffic Accident": [
    "Enforce helmet, seatbelt, speed control, and drink-driving regulations more consistently.",
    "Improve ambulance dispatch and trauma stabilization at first-contact facilities.",
    "Identify and fix high-risk road sections with signage, lighting, and pedestrian safety measures.",
    "Expand community road safety campaigns for drivers, riders, and pedestrians.",
  ],
  Cancer: [
    "Expand screening and early detection services for common cancers in the target population.",
    "Improve referral turnaround from primary care to diagnostic and oncology services.",
    "Support public awareness on symptoms, risk factors, and the importance of early presentation.",
    "Strengthen continuity of care for surgery, chemotherapy, radiotherapy, and palliative support.",
  ],
  Sepsis: [
    "Standardize rapid sepsis screening and treatment bundles across facilities.",
    "Improve timely antibiotic access, blood culture collection, and fluid resuscitation protocols.",
    "Strengthen infection prevention and control practices in wards, theatres, and maternity units.",
    "Train staff to escalate deteriorating patients early and monitor outcomes closely.",
  ],
  "Diabetes Complications": [
    "Increase routine blood sugar monitoring and long-term diabetes follow-up.",
    "Improve access to insulin, oral medicines, foot care, and kidney function monitoring.",
    "Educate patients on diet, medication adherence, and early warning signs of severe complications.",
    "Integrate diabetes care with hypertension and cardiovascular risk management.",
  ],
  Stroke: [
    "Strengthen screening and treatment for hypertension, diabetes, and atrial fibrillation.",
    "Educate communities to recognize stroke symptoms quickly and seek emergency care immediately.",
    "Improve emergency referral and imaging access for acute stroke management.",
    "Expand rehabilitation, secondary prevention, and long-term follow-up after discharge.",
  ],
  Tuberculosis: [
    "Increase early case finding, testing, and prompt initiation of treatment.",
    "Improve treatment adherence support through follow-up, counseling, and community health workers.",
    "Strengthen infection control, ventilation, and contact tracing in health facilities and households.",
    "Integrate TB care with HIV services and nutrition support where needed.",
  ],
  Malaria: [
    "Expand insecticide-treated net use, indoor residual spraying, and environmental control in high-risk areas.",
    "Improve rapid testing and same-day treatment at community and facility level.",
    "Ensure pregnant women and young children receive targeted prevention services.",
    "Track seasonal spikes closely and pre-position medicines and supplies before outbreaks.",
  ],
};

const getMitigationSteps = (cause) => MITIGATION_GUIDE[cause] || DEFAULT_MITIGATION_STEPS;

module.exports = {
  DEFAULT_MITIGATION_STEPS,
  MITIGATION_GUIDE,
  getMitigationSteps,
};
