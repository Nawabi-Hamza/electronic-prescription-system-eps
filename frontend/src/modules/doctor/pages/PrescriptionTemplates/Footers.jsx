export function SimpleFooter({ doctor_name, lastname, addresses }) {
  // console.log(addresses)
  return (
    <>
      <div className="flex justify-end">
        <div className="text-center">
          <p className="border-t pt-1 font-semibold">Dr. {doctor_name} {lastname}</p>
        </div>
      </div>
      <div>
        {addresses?.length && 
          <div className="text-sm flex gap-1 mt-4 border-t-2 ">
            <p className="font-semibold">Address:</p>
            <p>{addresses[0]?.address}</p>
            <p>{addresses[0]?.province}, {addresses[0]?.country}</p>
            <p>District: {addresses[0]?.district}</p>
            <p>Room: {addresses[0]?.room_number}, Floor: {addresses[0]?.floor_number}</p>
          </div>
        }
        <p>
          &copy; All RIGHTS RESERVED BY: https://paikareps.com / SUPPORT: +93 771844770
        </p>
      </div>
    </>
  );
}