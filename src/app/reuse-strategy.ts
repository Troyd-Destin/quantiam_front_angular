/**
 * reuse-strategy.ts
 * by corbfon 1/6/17
 */

import { ActivatedRouteSnapshot, RouteReuseStrategy, DetachedRouteHandle } from '@angular/router';

/** Interface for object which can store both: 
 * An ActivatedRouteSnapshot, which is useful for determining whether or not you should attach a route (see this.shouldAttach)
 * A DetachedRouteHandle, which is offered up by this.retrieve, in the case that you do want to attach the stored route
 */

export class CustomReuseStrategy implements RouteReuseStrategy {
    
    routesToCache: string[] = ["userView","userDatabase","userIndex"];


    storedRouteHandles = new Map<string, DetachedRouteHandle>();
  
    // Decides if the route should be stored
    shouldDetach(route: ActivatedRouteSnapshot): boolean {
       //return this.routesToCache.indexOf(route.data["name"]) > -1;
      if(route.data.hasOwnProperty('name'))   return true;
     
      // return false;
       //  return true; //store all routes that occur
    }
  
    //Store the information for the route we're destructing
    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {

        console.log('store',route.data["name"],this.storedRouteHandles);
       
        if(route.data.hasOwnProperty('name')){
                     this.storedRouteHandles.set(route.data["name"], handle);
        }
    }
  
    //Return true if we have a stored route object for the next route
    shouldAttach(route: ActivatedRouteSnapshot): boolean {

    if(route.data.hasOwnProperty('name')){
        return this.storedRouteHandles.has(route.data["name"]);
        }
        return false;
    }
  
    //If we returned true in shouldAttach(), now return the actual route data for restoration
    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
        console.log('retrieve',this.storedRouteHandles,route.data["name"]);
      
                return this.storedRouteHandles.get(route.data["name"]);
       
    }
  
    //Reuse the route if we're going to and from the same route
    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {

   // console.log('should reuse',future,curr);
      
            return future.data["name"] === curr.data["name"];
       
    }
  
    
}