import {Request, Response} from "express";
import axios, { AxiosResponse } from 'axios';


export const sort =async (req : Request, res:Response)=> {
   const result = await fetchData();
   res.send(result);
}


async function fetchRoutes(lang: string): Promise<RouteOfAdministration[]> {
    const url = `https://health-products.canada.ca/api/drug/route/?lang=${lang}&type=json`;
    const response = await axios.get<RouteOfAdministration[]>(url);
    return response.data;
  }

async function fetchData() {
    try {
        // Fetch English data and remove duplicates
        const englishRoutes = await fetchRoutes('en');
        const uniqueEnglishMap = new Map<number, RouteOfAdministration>();
    
        englishRoutes.forEach(route => {
          if (!uniqueEnglishMap.has(route.route_of_administration_code)) {
            uniqueEnglishMap.set(route.route_of_administration_code, route);
          }
        });
    
        // Fetch French data
        const frenchRoutes = await fetchRoutes('fr');
        const frenchMap = new Map<number, string>();
    
        frenchRoutes.forEach(route => {
          frenchMap.set(route.route_of_administration_code, route.route_of_administration_name);
        });
    
        // Combine both English and French data
        const combinedRoutes: CombinedRouteOfAdministration[] = Array.from(uniqueEnglishMap.values()).map(route => ({
          code: route.route_of_administration_code,
          nameEN: route.route_of_administration_name,
          nameFR: frenchMap.get(route.route_of_administration_code) || 'N/A'
        }));
    
        return combinedRoutes;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Error fetching data:', error.message);
        } else {
          console.error('Unexpected error:', error);
        }
        return [];
      }
  }


  async function fetchDosageForms(lang: string): Promise<DosageForm[]> {
    const url = `https://health-products.canada.ca/api/drug/form/?lang=${lang}&type=json`;
    const response = await axios.get<DosageForm[]>(url);
    return response.data;
  }
  
  async function fetchAndCombineDosageForms(): Promise<CombinedDosageForm[]> {
    try {
      // Fetch English dosage forms and remove duplicates
      const englishDosageForms = await fetchDosageForms('en');
      const uniqueEnglishMap = new Map<number, DosageForm>();
  
      englishDosageForms.forEach(form => {
        if (!uniqueEnglishMap.has(form.pharmaceutical_form_code)) {
          uniqueEnglishMap.set(form.pharmaceutical_form_code, form);
        }
      });
  
      // Fetch French dosage forms
      const frenchDosageForms = await fetchDosageForms('fr');
      const frenchMap = new Map<number, string>();
  
      frenchDosageForms.forEach(form => {
        frenchMap.set(form.pharmaceutical_form_code, form.pharmaceutical_form_name);
      });
  
      // Combine both English and French dosage form data
      const combinedDosageForms: CombinedDosageForm[] = Array.from(uniqueEnglishMap.values()).map(form => ({
        code: form.pharmaceutical_form_code,
        nameEN: form.pharmaceutical_form_name,
        nameFR: frenchMap.get(form.pharmaceutical_form_code) || 'N/A'
      }));
  
      return combinedDosageForms;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching data:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
      return [];
    }
  }

  interface RouteOfAdministration {
    drug_code: number;
    route_of_administration_code: number;
    route_of_administration_name: string;
  }

  interface CombinedRouteOfAdministration {
    code: number;
    nameEN: string;
    nameFR: string;
  }

  interface DosageForm {
    drug_code: number;
    pharmaceutical_form_code: number;
    pharmaceutical_form_name: string;
  }
  
  interface CombinedDosageForm {
    code: number;
    nameEN: string;
    nameFR: string;
  }