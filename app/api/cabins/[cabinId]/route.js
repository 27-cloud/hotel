import { getBookedDatesByCabinId } from "@/app/_lib/data-service";

export default async function Get(request,{params}) {
  const {cabinId}=params;
  try{
    const [cabin,bookedDates]=await Promise.all(
      [getCabin(cabinId),getBookedDatesByCabinId(cabinId)]);
    return Response.json({cabin,bookedDates});
  }
  catch{
    return Response.json({message:"Cabin not found"});
  }
  // return  Response.json();
}