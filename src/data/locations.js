// Comprehensive Indian locations for hyper-local property matching
export const LOCATIONS = [
  {
    state: "Delhi",
    districts: [
      "South Delhi",
      "North West Delhi",
      "South West Delhi",
      "West Delhi",
      "North Delhi",
      "Central Delhi",
      "New Delhi",
      "East Delhi",
      "Shahdara",
      "North East Delhi",
      "South East Delhi"
    ]
  },
  {
    state: "Haryana (NCR)",
    districts: [
      "Gurugram",
      "Faridabad",
      "Sonipat",
      "Panipat",
      "Karnal",
      "Rohtak",
      "Panchkula",
      "Ambala"
    ]
  },
  {
    state: "Uttar Pradesh (NCR)",
    districts: [
      "Gautam Buddha Nagar (Noida / Greater Noida)",
      "Ghaziabad",
      "Meerut",
      "Lucknow",
      "Kanpur",
      "Varanasi",
      "Agra"
    ]
  },
  {
    state: "Punjab",
    districts: [
      "SAS Nagar (Mohali)",
      "Ludhiana",
      "Amritsar",
      "Jalandhar",
      "Patiala",
      "Bathinda"
    ]
  },
  {
    state: "Chandigarh",
    districts: [
      "Chandigarh"
    ]
  },
  {
    state: "Maharashtra",
    districts: [
      "Mumbai City",
      "Mumbai Suburban",
      "Thane",
      "Pune",
      "Navi Mumbai",
      "Nagpur"
    ]
  }
];

export const ALL_DISTRICTS = LOCATIONS.flatMap(loc => 
  loc.districts.map(d => ({ district: d, state: loc.state }))
);
