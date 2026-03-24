import PageProtected from "../_components/PageProtected";
import GetGuestName from "../_components/GetGuestName";
export const metadata = {
  title: "Account",
};
export default async function Page() {
  // console.log(user);
  return (
    <PageProtected>
      <h2 className="font-semibold text-2xl  text-accent-400 mb-7">
        Welcome,{<GetGuestName />}
      </h2>
    </PageProtected>
  );
}
