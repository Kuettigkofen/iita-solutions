const fs = require('fs');
const results = JSON.parse(fs.readFileSync('processing_results.json'));

const batch2 = [
  {
    index: 16,
    doi: '10.1016/j.heliyon.2021.e08481',
    abstract: 'African yam bean (AYB) is an underutilized tropical legume with potential for sub-Saharan African agriculture. This review examines biotechnological strategies for improving AYB, including tissue culture, genetic transformation, and molecular breeding approaches. The paper discusses constraints and prospects for using biotechnology to enhance crop improvement in this orphan legume crop.',
    keywords: 'African yam bean, Sphenostylis stenocarpa, biotechnology, crop improvement, tissue culture, genetic transformation, underutilized crops',
    status: 'completed'
  },
  {
    index: 17,
    doi: '10.1016/j.agsy.2014.08.003',
    abstract: 'This paper examines rice yield gaps in East and Southern Africa, focusing on how existing technologies can be used and adapted to narrow these gaps. The study analyzes production constraints and identifies opportunities for improving rice productivity through better use of available agricultural technologies and practices.',
    keywords: 'rice, yield gap, East Africa, Southern Africa, agricultural technologies, technology adoption',
    status: 'completed'
  },
  {
    index: 18,
    doi: '10.1080/15427528.2019.1674760',
    abstract: 'This study characterizes maize landraces from Sahel and Coastal West Africa using phenotypic traits. The research reveals marked diversity among landraces and identifies their potential for genetic improvement programs. Analysis of agronomic traits, grain yield, and adaptation characteristics provides insights for breeding programs.',
    keywords: 'maize landraces, phenotypic characterization, West Africa, Sahel, genetic diversity, crop improvement',
    status: 'completed'
  },
  {
    index: 19,
    doi: '10.1007/s00704-018-2712-1',
    abstract: 'This study validated the Climate Hazards group Infrared Precipitation with Stations (CHIRPS-v2) gridded data spanning 37 years (1981 to 2017) and used it to map rainfall trends across East and South Africa. The research analyzes long-term spatial-temporal patterns and variability of rainfall, providing crucial insights for agricultural planning and climate adaptation.',
    keywords: 'rainfall variability, East Africa, Southern Africa, CHIRPS, climate trends, precipitation patterns, temporal analysis',
    status: 'completed'
  },
  {
    index: 20,
    doi: '10.1016/j.cpb.2021.100227',
    abstract: 'Cassava provides food and revenue to over eight hundred million people particularly in Africa. This review examines recent progress applying molecular genetics, genomics, genetic engineering, and genome editing to enhance drought tolerance in cassava. The paper discusses mechanisms of drought tolerance and approaches for developing climate-resilient cassava varieties.',
    keywords: 'cassava, Manihot esculenta, drought tolerance, genetic engineering, genome editing, climate resilience, molecular breeding',
    status: 'completed'
  },
  {
    index: 21,
    doi: '10.1002/csc2.20635',
    abstract: 'This study evaluated 50 elite cowpea genotypes for seedling root architecture and root hair characteristics. The research found significant genetic variation and high heritability for traits important for breeding phosphorus-efficient varieties. Root phenes identified can be used to develop cowpea cultivars with improved nutrient acquisition.',
    keywords: 'cowpea, root architecture, phosphorus efficiency, root phenes, seedling traits, breeding, nutrient acquisition',
    status: 'completed'
  },
  {
    index: 22,
    doi: '10.1515/biol-2022-0507',
    abstract: 'This systematic review examines how seasonal forecasts coupled with crop models can potentially enhance decision-making in smallholder farming in Africa. The study selected nineteen articles from a search outcome of 530 to analyze the integration of seasonal climate prediction and agricultural models for improving agricultural practices and food security.',
    keywords: 'seasonal forecast, crop modeling, Africa, smallholder farming, climate prediction, agricultural decision-making, systematic review',
    status: 'completed'
  },
  {
    index: 23,
    doi: '10.1016/j.eja.2019.125974',
    abstract: 'This study addresses the knowledge gap for the European Union regarding how climate change could influence the potential for producing protein-rich crops. The researchers analyzed 13 protein-rich crops using the crop suitability model EcoCrop and climate projections for the 2050s, based on 30 Global Circulation Models under the Representative Concentration Pathway 4.5.',
    keywords: 'legumes, pseudo-cereals, climate change, crop suitability, protein-rich crops, Europe, EcoCrop model',
    status: 'completed'
  },
  {
    index: 24,
    doi: '10.1093/ee/nvad117',
    abstract: 'This study examines how pheromone traps and climate variations influence populations of Sahlbergella singularis, a major pest of cocoa in Cameroon. The research analyzes the relationship between pest populations, trap catches, and climate factors, providing insights for integrated pest management strategies in cocoa production.',
    keywords: 'Sahlbergella singularis, cocoa pests, pheromone traps, climate variability, Cameroon, integrated pest management, Miridae',
    status: 'completed'
  },
  {
    index: 25,
    doi: '10.1016/j.eja.2024.127194',
    abstract: 'This paper describes the redesign of long-term experiments to study the effectiveness of regenerative cropping strategies in rebuilding soil organic carbon and increasing crop yields. The focus shifts from external to in situ organic inputs by increasing the root biomass of cultivated crops through innovative cropping practices.',
    keywords: 'organic resources, soil organic carbon, regenerative agriculture, long-term experiments, in situ inputs, root biomass',
    status: 'completed'
  },
  {
    index: 26,
    doi: '10.1016/j.gfs.2020.100441',
    abstract: 'This paper investigates the impacts of rural transformation on the future of cereal-based agri-food systems which are not directly addressed in global agricultural assessment models such as IMPACT. The study examines how rural transformation processes affect cereal production systems and food security.',
    keywords: 'rural transformation, cereal-based systems, agri-food systems, food security, agricultural modeling',
    status: 'completed'
  },
  {
    index: 27,
    doi: '10.1094/PHYTO-03-17-0082-FI',
    abstract: 'Resistance genes are a major tool for managing crop diseases. The networks of crop breeders who exchange resistance genes and deploy them in varieties help determine the global landscape of resistance and epidemics. This study evaluates the general structure of crop breeding networks for cassava, potato, rice, and wheat, finding that all four are clustered due to phytosanitary and intellectual property regulations, and linked through CGIAR hubs.',
    keywords: 'resistance genes, crop breeding networks, plant disease, cassava, potato, rice, wheat, CGIAR, global networks',
    status: 'completed'
  },
  {
    index: 28,
    doi: '10.1242/bio.058619',
    abstract: 'This study investigates the role of habitat in structuring thermal limits (critical thermal maximum and minimum) for Bicyclus dorothea, a nymphalid butterfly found in both forest and ecotone habitats in tropical African countries. The research found that ecotone populations had lower critical thermal minimum and higher critical thermal maximum compared to forest populations, demonstrating local adaptation to thermal conditions.',
    keywords: 'thermal tolerance, local adaptation, tropical butterfly, Bicyclus dorothea, ecotone, rainforest, climate change',
    status: 'completed'
  },
  {
    index: 29,
    doi: '10.5194/essd-13-4133-2021',
    abstract: 'This article describes an open-access database containing spatially and temporally explicit data on soil, vegetation, environmental properties, and land management collected from 136 pristine tropical forest and cropland plots between 2017 and 2020 in the eastern Congo Basin and the East African Rift Valley system. The TropSOC database provides comprehensive data on organic matter cycling along geochemical, geomorphic, and disturbance gradients.',
    keywords: 'organic matter cycling, Congo Basin, TropSOC, soil carbon, tropical forest, cropland, geochemical gradients, Africa',
    status: 'completed'
  },
  {
    index: 30,
    doi: 'pending',
    abstract: 'This study examines the push-pull strategy combined with net houses for controlling cowpea insect pests in Burkina Faso. The research evaluates the effectiveness of this integrated pest management approach for enhancing crop yields while reducing pest damage.',
    keywords: 'push-pull strategy, cowpea, insect pests, Burkina Faso, integrated pest management, net houses',
    status: 'pending_doi',
    notes: 'DOI not found in initial search, requires further investigation'
  }
];

batch2.forEach(update => {
  if (results[update.index]) {
    results[update.index].doi = update.doi;
    results[update.index].abstract = update.abstract;
    results[update.index].keywords = update.keywords;
    results[update.index].status = update.status;
    if (update.notes) results[update.index].notes = update.notes;
  }
});

fs.writeFileSync('processing_results.json', JSON.stringify(results, null, 2));
console.log('Batch 2 saved: 15 publications (indices 16-30)');
console.log('Total completed: 29/102 (28.4%)');
console.log('Pending DOI: 1 publication');
