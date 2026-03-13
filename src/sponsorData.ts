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
    {
    name: "Mojo Cycling",
    zipCodes: ["78247",], 
    brands: ["Forbidden", "Santa Cruz", "Orbea"],
    logo: "/shop logos/Mojo Cycling Logo_short.png",
    address: "1100 N Walton Blvd | Bentonville, AR 72712",
    phone: "(479) 271-7201"
  } 

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