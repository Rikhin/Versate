import { createClient } from 'supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const descriptions = [
  {
    id: "0fad747e-647a-45c2-8e05-5d1009ab23de",
    desc: `Lithium batteries are at the forefront of modern energy storage, powering everything from smartphones to electric vehicles. This project delves into innovative methods to enhance both the capacity retention and rate performance of lithium batteries. By exploring advanced electrode materials and novel electrolyte formulations, the research aims to address common degradation issues. The team conducted extensive experiments to test various charging protocols and their effects on battery longevity. Results indicate significant improvements in both energy density and charging speed. The project also investigates the environmental impact of new materials, ensuring sustainability. Collaboration with industry partners provided real-world validation of the findings. Ultimately, this work paves the way for safer, longer-lasting, and faster-charging lithium batteries for future applications.`
  },
  {
    id: "78f32d0b-cbee-41e8-926d-e83ad1e04fc2",
    desc: `Soft robotics is revolutionizing the way machines interact with their environment, and this project exemplifies that evolution. The Bending Shape Self-Sensing Pneumatic Grasper is designed to mimic the dexterity and adaptability of the human hand. Utilizing advanced pneumatic actuators, the grasper can conform to objects of various shapes and sizes. Integrated self-sensing technology allows for real-time feedback and precise control. The project explores applications in delicate object manipulation, such as in medical or agricultural settings. Rigorous testing demonstrated the grasper's ability to handle fragile items without damage. The team also developed a user-friendly interface for intuitive operation. This innovation represents a significant step forward in the intelligent evolution of soft robotic systems.`
  },
  {
    id: "305675ac-d2ce-4b68-b183-e6de9afcc636",
    desc: `Accurate forecasting of El Niño-Southern Oscillation (ENSO) cycles is crucial for global climate prediction. This project introduces a hybrid deep learning model that leverages wavelet transforms to analyze complex climate data. The model integrates both temporal and spatial features, enhancing prediction accuracy. Extensive datasets from meteorological agencies were used to train and validate the system. Results show a marked improvement over traditional forecasting methods. The project also examines the model's robustness in handling missing or noisy data. Insights gained from this research can inform disaster preparedness and agricultural planning. The team's interdisciplinary approach bridges climate science and artificial intelligence. This work sets a new benchmark for ENSO cycle forecasting.`
  },
  {
    id: "f5f4ff13-edae-464f-a7f3-fa71bd51c8a1",
    desc: `Duckweed, a fast-growing aquatic plant, offers promising solutions for sewage purification and ecological restoration. This project investigates the effectiveness of duckweed in removing pollutants from campus wastewater. Controlled experiments measured reductions in nitrogen, phosphorus, and heavy metals. The team also studied the plant's growth rate and biomass yield under various conditions. Results indicate that duckweed can significantly improve water quality while producing valuable biomass. The project explores potential uses for harvested duckweed, such as biofuel or animal feed. Collaboration with campus facilities enabled real-world implementation of the system. The research highlights the dual benefits of environmental protection and resource recovery. This approach could serve as a model for sustainable wastewater management in educational institutions.`
  },
  {
    id: "2a3ac6da-ce14-439a-9742-590f676e9a47",
    desc: `This project explores the fascinating interplay between light, heat, and sound within a simple glass jar. By directing specific wavelengths of light onto the jar, the team observed measurable temperature changes and subsequent sound generation. Advanced sensors captured the thermodynamic characteristics of the system in real time. The research delves into the underlying physics, including energy transfer and resonance phenomena. Applications range from novel musical instruments to educational demonstrations of thermodynamics. The team also investigated the effects of different materials and jar shapes. Results provide new insights into multi-modal energy conversion. This work bridges the gap between fundamental science and practical innovation, inspiring further exploration in the field.`
  },
  {
    id: "1069ae6f-cd67-4d63-9786-2a507caffb1c",
    desc: `Communication barriers between American Sign Language (ASL) users and speakers of other languages present significant challenges. This project introduces a wearable translator capable of bidirectional communication between ASL and spoken language. The device utilizes advanced sensors to detect hand movements and gestures, translating them into speech in real time. Conversely, it can convert spoken words into visual or tactile feedback for ASL users. The team focused on creating a lightweight, comfortable, and unobtrusive design. Extensive user testing ensured high accuracy and usability in various environments. The project also explores potential applications in education and public services. This innovation has the potential to greatly enhance accessibility and inclusivity for the deaf and hard-of-hearing community.`
  },
  {
    id: "5e12e99a-87aa-4e7f-b0db-d4b82497f1b6",
    desc: `Lead contamination in water sources poses a serious health risk worldwide. This project presents biochar filtrate as a novel solution for removing lead from contaminated water. The team produced biochar from agricultural waste and optimized its properties for maximum adsorption efficiency. Laboratory experiments demonstrated significant reductions in lead concentration after treatment. The project also evaluated the reusability and cost-effectiveness of the biochar filtrate. Environmental impact assessments confirmed the sustainability of the approach. Collaboration with local communities facilitated pilot-scale implementation. The research highlights the potential for scalable, low-cost water purification solutions. This work contributes to global efforts in ensuring safe and clean drinking water for all.`
  },
  {
    id: "24b25a55-ed94-4297-aac7-57832591ae53",
    desc: `Understanding the molecular mechanisms of carcinogenicity is essential for developing effective cancer therapies. This project employs computational methods to unravel the complex interactions between carcinogens and cellular components. The team utilized molecular docking and simulation techniques to predict binding affinities and reaction pathways. Results identified several key molecular targets and potential inhibitors. The project also explored the effects of genetic variations on carcinogen susceptibility. Collaboration with experimental laboratories provided validation for computational predictions. The research offers new insights into personalized medicine and targeted cancer treatment. This interdisciplinary approach bridges computational biology and clinical oncology. The findings pave the way for future advancements in cancer research.`
  },
  {
    id: "4ee2c5c3-e664-429b-9697-fb8cf2162413",
    desc: `Cerebral palsy patients often face challenges in mobility and gait. This project introduces a pose-based gait analysis system utilizing artificial intelligence and computer vision. The system captures and analyzes movement patterns, providing detailed feedback for clinicians and patients. Advanced algorithms identify deviations from typical gait and suggest corrective actions. The team conducted trials with real patients, demonstrating improved rehabilitation outcomes. The project also features a user-friendly interface for easy integration into clinical practice. Data privacy and security were prioritized throughout development. The research highlights the potential for AI-driven healthcare solutions. This work represents a significant step forward in personalized rehabilitation for cerebral palsy patients.`
  },
  {
    id: "bd9bab90-bd6f-4bfc-b863-cc12bbec18ee",
    desc: `Autonomous vehicles rely on robust communication systems for safe and efficient operation. This project explores mmWave beamforming using multimodal sensor fusion and machine learning. The team developed algorithms to optimize signal direction and strength in dynamic environments. Extensive simulations and real-world tests validated the approach. Results show improved data transmission rates and reduced latency. The project also addresses challenges related to interference and signal blockage. Collaboration with industry partners facilitated technology transfer. The research contributes to the advancement of intelligent transportation systems. This innovation paves the way for safer and more reliable autonomous vehicular communications.`
  }
];

(async () => {
  for (const { id, desc } of descriptions) {
    const { error } = await supabase.from('projects').update({ description: desc }).eq('id', id);
    if (error) {
      console.error(`Error updating project ${id}:`, error.message);
    } else {
      console.log(`Updated project ${id}`);
    }
  }
  console.log('All descriptions updated!');
  process.exit(0);
})(); 