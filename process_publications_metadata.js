const fs = require('fs');
const XLSX = require('xlsx');

// Load the publications data
const publicationsData = JSON.parse(fs.readFileSync('/home/user/iita-solutions/publications_data.json', 'utf8'));

console.log(`Loaded ${publicationsData.length} publications\n`);

// Manually collected metadata from searches (we'll populate this as we go)
const metadata = {
  "Wichern 2019": {
    doi: "10.1016/j.agsy.2019.102663",
    abstract: "Rural households in sub-Saharan Africa earn a substantial part of their living from rain-fed smallholder agriculture, which is highly sensitive to climate change. The framework combines crop suitability maps with a household food availability analysis to quantify household vulnerability to climate-related impacts on crop production and effects of adaptation options. The framework was tested for Uganda, identifying four hotspots of household vulnerability across the country. About 30% of households in the (central) southwest hotspots were vulnerable to a 3°C temperature increase and 10% rainfall decline through declining suitability for several key crops including highland banana, cassava, maize and sorghum. Options for adaptation to increasing temperatures were most beneficial in northern Uganda, while drought-related adaptation options were more beneficial in the southwest.",
    keywords: "Climate change, Adaptation, Vulnerability, Food security, Uganda, Smallholder agriculture"
  },
  "WalterMupangwa 2023": {
    doi: "10.3390/cli11040084",
    abstract: "The study analyzed minimum and maximum temperatures' variability and trends using daily time series data from 23 meteorological stations across Malawi, Mozambique, South Africa and Zimbabwe, employing modified Mann–Kendall and Theil–Sen slope models. Temperature varied with location, with minimum temperature being more variable than maximum temperature, and semi-arid regions showing higher variation in minimum temperature compared to humid and coastal environments. The results showed an upward trend in minimum (0.01–0.83 °C over a 33–38 year period) and maximum (0.01–0.09 °C over a 38–57 year period) temperatures at 9 and 15 locations, respectively.",
    keywords: "climate change; global warming; heat stress; smallholder agriculture; temperature variability"
  },
  "Tonnang 2014": {
    doi: "10.1186/1476-072X-13-12",
    abstract: "Predicting anopheles vectors' population densities and boundary shifts is crucial in preparing for malaria risks and unanticipated outbreaks. Although shifts in the distribution and boundaries of the major malaria vectors (Anopheles gambiae s.s. and An. arabiensis) across Africa have been predicted, quantified areas of absolute change in zone of suitability for their survival have not been defined. We developed a model using CLIMEX simulation platform to estimate the potential geographical distribution and seasonal abundance of these malaria vectors in relation to climatic factors. Angola, Ethiopia, Kenya, Mozambique, Tanzania, South Africa and Zambia appear most likely to be affected in terms of absolute change of malaria vectors suitability zones under the selected climate change scenarios. The potential shifts of these malaria vectors have implications for human exposure to malaria, as recrudescence of the disease is likely to be recorded in several new areas and regions.",
    keywords: "Climate change, Eco-climatic index, African countries, Anopheles gambiae s.s, Anopheles arabiensis"
  }
};

// Apply metadata to publications
let foundCount = 0;
let notFoundCount = 0;

publicationsData.forEach(pub => {
  const id = pub.ID;
  if (metadata[id]) {
    pub.DOI = metadata[id].doi || '';
    pub.Abstract = metadata[id].abstract || '';
    pub.Keywords = metadata[id].keywords || '';
    foundCount++;
    console.log(`✓ [${foundCount}/${publicationsData.length}] ${pub.TITLE.substring(0, 60)}...`);
  } else {
    notFoundCount++;
    console.log(`✗ [${publicationsData.length - notFoundCount + 1}/${publicationsData.length}] ${pub.TITLE.substring(0, 60)}... (Not found)`);
  }
});

// Save updated data
const newWorkbook = XLSX.utils.book_new();
const newSheet = XLSX.utils.json_to_sheet(publicationsData);
XLSX.utils.book_append_sheet(newWorkbook, newSheet, 'Publications');
XLSX.writeFile(newWorkbook, '/home/user/iita-solutions/IITA climate publications - POPULATED.xlsx');

console.log('\n' + '='.repeat(60));
console.log('SUMMARY');
console.log('='.repeat(60));
console.log(`Total publications: ${publicationsData.length}`);
console.log(`Successfully populated: ${foundCount}`);
console.log(`Not found / Low confidence: ${notFoundCount}`);
console.log(`\nFile saved: IITA climate publications - POPULATED.xlsx`);
console.log('='.repeat(60));

// Save a list of publications that need manual review
const needReview = publicationsData
  .filter(pub => !pub.DOI && !pub.Abstract && !pub.Keywords)
  .map(pub => ({
    ID: pub.ID,
    Title: pub.TITLE,
    Authors: pub.AUTHORS,
    Year: pub.YEAR,
    Journal: pub.JOURNAL
  }));

fs.writeFileSync(
  '/home/user/iita-solutions/publications_need_review.json',
  JSON.stringify(needReview, null, 2)
);

console.log(`\nPublications needing manual review saved to: publications_need_review.json`);
