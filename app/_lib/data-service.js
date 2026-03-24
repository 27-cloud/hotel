import { eachDayOfInterval } from "date-fns";
import { supabase } from "./supabase";
import { notFound } from "next/navigation";
/////////////
// GET

export async function getCabin(id) {
  const { data, error } = await supabase
    .from("cabins")
    .select("*")
    .eq("id", id)
    .single();

  // For testing
  // await new Promise((res) => setTimeout(res, 1000));

  if (error) {
    notFound();
    console.error(error);
  }

  return data;
}

export async function getCabinPrice(id) {
  const { data, error } = await supabase
    .from("cabins")
    .select("regularPrice, discount")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
  }

  return data;
}

export const getCabins = async function () {
  try {
    const { data, error } = await supabase
      .from("cabins")
      .select("id, name, maxCapacity, regularPrice, discount, image")
      .order("name");
    if (error) {
      console.error("Supabase error:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      throw new Error(`Cabins could not be loaded: ${error.message}`);
    }

    // console.log('Success! Fetched cabins:', data);
    return data;
  } catch (err) {
    // console.error('Unexpected error:', err);
    throw err;

    // return data;
  }
};

// Guests are uniquely identified by their email address
export async function getGuest(email) {
  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .eq("email", email)
    .single();

  // No error here! We handle the possibility of no guest in the sign in callback
  return data;
}

export async function getBooking(id) {
  const { data, error, count } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    // console.error(error);
    throw new Error("Booking could not get loaded");
  }

  return data;
}

// export async function getBookings(guestId) {
//   const { data, error, count } = await supabase
//     .from("bookings")
//     // We actually also need data on the cabins as well. But let's ONLY take the data that we actually need, in order to reduce downloaded data.
//     .select(
//       "id, created_at, startDate, endDate, numNights, numGuests, totalPrice, guestId, cabinId, cabins(name, image)",
//     )
//     .eq("guestId", guestId)
//     .order("startDate");

//   if (error) {
//     console.error(error);
//     throw new Error("Bookings could not get loaded");
//   }

//   return data;
// }
export async function getBookings(guestId) {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select(
        `
        id,
        created_at,
        startDate,
        endDate,
        numNights,
        numGuests,
        totalPrice,
        status,
        observations,
        cabins (
          id,
          name,
          image
        )
      `,
      )
      .eq("guestId", guestId) // 改为 guestId
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Error getting bookings:", err);
    throw err;
  }
}

export async function getBookedDatesByCabinId(cabinId) {
  let today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  today = today.toISOString();

  // Getting all bookings
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("cabinId", cabinId)
    .or(`startDate.gte.${today},status.eq.checked-in`);

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  // Converting to actual dates to be displayed in the date picker
  const bookedDates = data
    .map((booking) => {
      return eachDayOfInterval({
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
      });
    })
    .flat();

  return bookedDates;
}

export async function getSettings() {
  const { data, error } = await supabase.from("settings").select("*").single();

  if (error) {
    console.error(error);
    throw new Error("Settings could not be loaded");
  }

  return data;
}

export async function getCountries() {
  try {
    const res = await fetch(
      "https://restcountries.com/v2/all?fields=name,flag",
    );
    const countries = await res.json();
    return countries;
  } catch {
    throw new Error("Could not fetch countries");
  }
}

/////////////
// CREATE

export async function createGuest(newGuest) {
  const { data, error } = await supabase.from("guests").insert([newGuest]);

  if (error) {
    console.error(error);
    throw new Error("Guest could not be created");
  }

  return data;
}

// export async function createBooking(newBooking) {
//   const { data, error } = await supabase
//     .from('bookings')
//     .insert([newBooking])
//     // So that the newly created object gets returned!
//     .select()
//     .single();

//   if (error) {
//     console.error(error);
//     throw new Error('Booking could not be created');
//   }

//   return data;
// }
export async function createBooking(bookingData) {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .insert([
        {
          cabinId: bookingData.cabinId, // 改为 cabinId
          guestId: bookingData.guestId, // 改为 guestId
          startDate: bookingData.startDate, // 改为 startDate
          endDate: bookingData.endDate, // 改为 endDate
          numNights: bookingData.numNights, // 改为 numNights
          numGuests: bookingData.numGuests, // 改为 numGuests
          cabinPrice: bookingData.cabinPrice, // 改为 cabinPrice
          totalPrice: bookingData.totalPrice, // 改为 totalPrice
          status: bookingData.status,
          observations: bookingData.observations,
          created_at: bookingData.createdAt || new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Error creating booking:", err);
    throw err;
  }
}

/////////////
// UPDATE

// The updatedFields is an object which should ONLY contain the updated data
export async function updateGuest(id, updatedFields) {
  const { data, error } = await supabase
    .from("guests")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Guest could not be updated");
  }
  return data;
}

export async function updateBooking(id, updatedFields) {
  const { data, error } = await supabase
    .from("bookings")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  return data;
}

/////////////
// DELETE

export async function deleteBooking(id) {
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  return data;
}
