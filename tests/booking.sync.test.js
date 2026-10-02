import {afterEach,describe,it,expect} from "bun:test";
import {buildBookingGroups,bangkokBookingDate} from "../src/lib/bookingCatalog";
import {verifyVoucher,createBooking} from "../src/hooks/useBooking";
const originalFetch=globalThis.fetch;
afterEach(()=>{globalThis.fetch=originalFetch});
describe("booking UI/API contract",()=>{
 it("uses API IDs/prices and retains new promotions instead of hard-coded values",()=>{
  const groups=buildBookingGroups([{id:"real-id",title:"New promotion (90 mins)",description:"New",price:"789.00",duration:90,pictureUrl:"",note:"",type:"promotion",isActive:true}]);
  expect(groups[0].type).toBe("promotion");expect(groups[0].variants[0]).toMatchObject({id:"real-id",price:789,duration:90});
 });
 it("does not invent bookable packages when the API is empty",()=>expect(buildBookingGroups([])).toEqual([]));
 it("keeps appointments in Thailand time regardless of browser timezone",()=>expect(bangkokBookingDate("2099-01-01","10:00")).toBe("2099-01-01T03:00:00.000Z"));
 it("does not accept a malformed voucher response",async()=>{globalThis.fetch=(async()=>new Response("{}",{status:200}));expect((await verifyVoucher("code")).isValid).toBe(false);});
 it("returns the actual voucher discount",async()=>{globalThis.fetch=(async()=>new Response(JSON.stringify({id:"v1",discount:"100.00",isExpired:false})));expect(await verifyVoucher("code")).toEqual({id:"v1",discount:100,isValid:true});});
 it("does not claim booking success without a persisted booking ID",async()=>{globalThis.fetch=(async()=>new Response("{}"));await expect(createBooking({branchId:"b1",packageId:"p1",date:"2099-01-01",customerEmail:"guest@example.com"})).rejects.toThrow("confirmation");});
 it("sends the confirmation email with the booking request",async()=>{let requestBody;globalThis.fetch=(async(_url,options)=>{requestBody=JSON.parse(options.body);return new Response(JSON.stringify({status:"success",booking:{id:"booking1"}}),{status:201});});await createBooking({branchId:"b1",packageId:"p1",date:"2099-01-01",customerEmail:"guest@example.com"});expect(requestBody.customerEmail).toBe("guest@example.com");});
});
