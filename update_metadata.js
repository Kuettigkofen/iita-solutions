const fs = require('fs');
const XLSX = require('xlsx');

// Load the publications data
const publicationsData = JSON.parse(fs.readFileSync('/home/user/iita-solutions/publications_data.json', 'utf8'));

console.log(`Processing ${publicationsData.length} publications...\n`);

// Metadata collected from web searches
const metadata = {
  "Wichern 2019": {
    doi: "10.1016/j.agsy.2019.102663",
    abstract: "Rural households in sub-Saharan Africa earn a substantial part of their living from rain-fed smallholder agriculture, which is highly sensitive to climate change. The framework combines crop suitability maps with a household food availability analysis to quantify household vulnerability to climate-related impacts on crop production and effects of adaptation options. The framework was tested for Uganda, identifying four hotspots of household vulnerability across the country. About 30% of households in the (central) southwest hotspots were vulnerable to a 3°C temperature increase and 10% rainfall decline through declining suitability for several key crops including highland banana, cassava, maize and sorghum. Options for adaptation to increasing temperatures were most beneficial in northern Uganda, while drought-related adaptation options were more beneficial in the southwest.",
    keywords: "Climate change, Adaptation, Vulnerability, Food security, Uganda, Smallholder agriculture"
  },
  "Weinberg 2022": {
    doi: "10.1127/entomologia/2022/1397",
    abstract: "Spodoptera eridania (Stoll), a polyphagous lepidopteran pest from the Americas, has recently invaded western and central Africa. Like its congeners, S. eridania has developed pesticide resistance. The researchers fit a CLIMEX niche model for S. eridania and applied a climate change scenario for 2050 to investigate the sensitivity of the pest threat. The study found that S. eridania can potentially expand its range throughout the tropics and into the sub-tropics, threatening a range of important commercial and subsistence crops. Modelled climatic changes will mostly expand this species potential range poleward by around 200 km by 2050. These areas of emerging potential expansion are mostly into subtropical climates, supporting diverse cropping systems, including at risk crops beans, groundnut, potato, soybeans, tomato and sweet potato.",
    keywords: "Spodoptera eridania, invasive species, pesticide resistance, CLIMEX modeling, climate change, crop threats, Africa"
  },
  "WalterMupangwa 2023": {
    doi: "10.3390/cli11040084",
    abstract: "The study analyzed minimum and maximum temperatures' variability and trends using daily time series data from 23 meteorological stations across Malawi, Mozambique, South Africa and Zimbabwe, employing modified Mann–Kendall and Theil–Sen slope models. Temperature varied with location, with minimum temperature being more variable than maximum temperature, and semi-arid regions showing higher variation in minimum temperature compared to humid and coastal environments. The results showed an upward trend in minimum (0.01–0.83 °C over a 33–38 year period) and maximum (0.01–0.09 °C over a 38–57 year period) temperatures at 9 and 15 locations, respectively.",
    keywords: "climate change; global warming; heat stress; smallholder agriculture; temperature variability"
  },
  "Tonnang 2014": {
    doi: "10.1186/1476-072X-13-12",
    abstract: "Predicting anopheles vectors' population densities and boundary shifts is crucial in preparing for malaria risks and unanticipated outbreaks. Although shifts in the distribution and boundaries of the major malaria vectors (Anopheles gambiae s.s. and An. arabiensis) across Africa have been predicted, quantified areas of absolute change in zone of suitability for their survival have not been defined. We developed a model using CLIMEX simulation platform to estimate the potential geographical distribution and seasonal abundance of these malaria vectors in relation to climatic factors. Angola, Ethiopia, Kenya, Mozambique, Tanzania, South Africa and Zambia appear most likely to be affected in terms of absolute change of malaria vectors suitability zones under the selected climate change scenarios. The potential shifts of these malaria vectors have implications for human exposure to malaria, as recrudescence of the disease is likely to be recorded in several new areas and regions.",
    keywords: "Climate change, Eco-climatic index, African countries, Anopheles gambiae s.s, Anopheles arabiensis, malaria vectors"
  },
  "Thomas 2021": {
    doi: "10.1111/brv.12644",
    abstract: "Africa underwent numerous climatic fluctuations at ancient and more recent timescales, with tectonic, greenhouse gas, and orbital forcing stimulating diversification. Increased aridification since the Late Eocene led to important extinction events, but also provided unique diversification opportunities. The paper discusses three major models of speciation: (i) geographic speciation via vicariance (allopatry); (ii) ecological speciation impacted by climate and geological changes, and (iii) genomic speciation via genome duplication, with geographic speciation being the most widely documented. Two major geo-climatic factors shaped African biodiversity: climatic fluctuations at ancient and recent timescales, and increased aridification since the Late Eocene.",
    keywords: "Africa, biodiversity, climate change, diversification, evolution, flora, fauna, speciation, tectonics"
  },
  "Sekabira 2023": {
    doi: "10.1371/journal.pstr.0000052",
    abstract: "This is a meta-analysis and scoping review of 43 studies and 11 reports on Climate-Smart (CS) One-Health innovations. The review identified determinants, challenges, and impacts related to the deployment of CS One-Health innovations, particularly in Ghana and Benin. Community participation, land tenure, political will, and age are critical adoption factors. Practices like composting, IPM, cover cropping, rotational grazing, and traditional ecological knowledge are promoted. Major barriers include cultural practices, lack of diagnostic tools, limited ICT access, and top-down implementation. Multi-disciplinary collaboration is essential for sustainable deployment.",
    keywords: "Climate-Smart agriculture, One-Health, Ghana, Benin, socio-economic determinants, innovation adoption, meta-analysis"
  },
  "Reis 2016": {
    doi: "10.1088/1748-9326/11/12/120205",
    abstract: "This editorial synthesizes findings from the N2013 Kampala conference on nitrogen management and reviews research contributions focused on nitrogen flows, pollution, human health impacts, climate interactions, and sustainable food systems. Both nitrogen surplus (pollution) and deficit (yield loss) require tailored solutions. Integrated soil fertility management and BNF are crucial in SSA. Reducing meat consumption in high-N regions can reduce emissions and improve health. Technologies such as nitrification inhibitors and NUE metrics support sustainable intensification. Nitrogen neutrality and N footprints are proposed as accountability tools.",
    keywords: "Nitrogen management, climate change, sustainable agriculture, food security, pollution, nitrogen cycle, Africa"
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
    console.log(`✓ [${foundCount}] ${pub.TITLE.substring(0, 70)}...`);
  } else {
    notFoundCount++;
  }
});

console.log(`\n${'='.repeat(80)}`);
console.log(`PROGRESS SUMMARY`);
console.log('='.repeat(80));
console.log(`Total publications: ${publicationsData.length}`);
console.log(`Successfully populated: ${foundCount}`);
console.log(`Remaining to process: ${notFoundCount}`);
console.log(`Completion: ${((foundCount / publicationsData.length) * 100).toFixed(1)}%`);

// Save updated data to Excel
const newWorkbook = XLSX.utils.book_new();
const newSheet = XLSX.utils.json_to_sheet(publicationsData);
XLSX.utils.book_append_sheet(newWorkbook, newSheet, 'Publications');
XLSX.writeFile(newWorkbook, '/home/user/iita-solutions/IITA climate publications - POPULATED.xlsx');

console.log(`\nFile saved: /home/user/iita-solutions/IITA climate publications - POPULATED.xlsx`);
console.log('='.repeat(80));

// Save list of remaining publications for batch processing
const remaining = publicationsData
  .filter(pub => !pub.DOI && !pub.Abstract && !pub.Keywords)
  .map((pub, idx) => ({
    Number: idx + 1,
    ID: pub.ID,
    Title: pub.TITLE,
    Authors: pub.AUTHORS,
    Year: pub.YEAR,
    Journal: pub.JOURNAL,
    SearchQuery: `"${pub.TITLE}" ${pub.AUTHORS ? pub.AUTHORS.split(',')[0] : ''} ${pub.YEAR} ${pub.JOURNAL} DOI`
  }));

fs.writeFileSync(
  '/home/user/iita-solutions/remaining_publications.json',
  JSON.stringify(remaining, null, 2)
);

console.log(`\nRemaining publications saved to: remaining_publications.json`);
console.log(`\nNext steps:`);
console.log(`1. Continue systematic searching for remaining ${notFoundCount} publications`);
console.log(`2. Use the SearchQuery field in remaining_publications.json for guidance`);
console.log(`3. Focus on finding DOIs first (easiest), then abstracts and keywords`);
console.log(`4. IITA-affiliated publications often appear in cgspace.cgiar.org`);
console.log(`5. Consider using CrossRef API, PubMed, or Google Scholar for batch searches`);
