// src/sponsorData.ts

export interface SponsoredShop {
  name: string;
  zipCodes: string[];
  brands: string[];
  logo: string;
  address: string;
  phone: string;
}

// Leave this array empty for now to disable the takeover!
// When you get a paying sponsor, just add their object back into this array.
export const SPONSORED_SHOPS: SponsoredShop[] = [
  /* {
    name: "Spoke Appeal",
    zipCodes: ["76028", "76029", "76097"], 
    brands: ["Specialized", "Santa Cruz", "Revel"],
    logo: "https://placehold.co/400x150/ffffff/0f172a?text=SPOKE+APPEAL&font=Montserrat",
    address: "123 Main St, Burleson, TX",
    phone: "(817) 555-0123"
  } 
  */

];